var Map = require("es6-map")
var internals = require("matchbox-internals")
var object = require("matchbox-util/object")
var merge = require("matchbox-util/merge")

module.exports = core

var DS = new Map()
var definitions = new Map()

function core( definition ){
  definition = definition || {}
  var registry = {}
  return create(definition, registry)
}

function create( definition, registry ){
  /**
   * Get a value from the definition and optionally call a definition function on it.
   *
   * @param {String} property
   * @param {Function} [define]
   * @param {Boolean} [loop = false] Loop over this value as an object.
   * @return {*} the definition value
   * */
  function def( property, define, loop ){
    if (definition.hasOwnProperty(property) && definition[property] != null) {
      if (define) loop ? object.in(definition[property], define) : define(definition[property])
      return definition[property]
    }
  }

  var name = def("name")

  if( registry.hasOwnProperty(name) ) {
    return registry[name]
  }

  var Class = def("constructor") || function Core () {}
  internals(Class)
  definitions.set(Class)

  var Super = def("inherit", Class.inherit)
  var superDef = definitions.get(Super)

  if( name ){
    object.constant(Class, "__name", name)
    Class.property("__name", name)
    registry[name] = Class
  }
  if( Super ){
    object.constant(Class, "__super", Super)
    Class.method("__applySuper", function( method, args ){
      return Super.prototype[method].apply(this, args)
    })
    Class.method("__callSuper", function( method, args ){
      args = [].slice.call(arguments, 1)
      return Super.prototype[method].apply(this, args)
    })
  }

  def("include", Class.include)
  def("augment", Class.augment)
  def("prototype", Class.proto)
  def("static", Class.static, true)
  def("accessor", function( name, access ){
    if (typeof access.get == "function" && typeof access.set == "function") {
      Class.accessor(name, access.get, access.set)
    }
    else if (typeof access == "function") {
      Class.get(name, access)
    }
    else if (typeof access.get == "function") {
      Class.get(name, access.get)
    }
    else if (typeof access.set == "function") {
      Class.set(name, access.set)
    }
  }, true)

  var descriptors = merge(DS.get(Super), def("describe"))
  DS.set(Class, descriptors)
  object.in(descriptors, function (property, describe) {
    var superValue = superDef ? superDef[property] || {} : {}
    var value = definition[property] || {}
    value = definition[property] = merge(superValue, value)
    describe(Class, value)
  })

  Class.prototype.constructor = Class

  Class.extend = function( superDefinition ){
    superDefinition = superDefinition || {}
    superDefinition.inherit = Class
    return create(superDefinition, registry)
  }

  return Class
}
