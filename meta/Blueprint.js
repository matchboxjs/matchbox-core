var forIn = require("matchbox-util/object/in")
var copy = require("matchbox-util/object/copy")
var extendObject = require("matchbox-util/object/extend")
var Block = require("../blocks/Block")
var inherit = require("../inherit")
var extend = require("../extend")
var augment = require("../augment")
var include = require("../include")

module.exports = Blueprint

function Blueprint (blocks, parent) {
  blocks = blocks || {}

  this.parent = parent

  this.decorators = {}

  //this.inherits = null
  this.augments = []
  this.includes = []

  this.statics = {}

  this.Super = null
  this.Constructor = null

  this.getters = {}
  this.setters = {}
  this.accessors = {}
  //this.prototype = {}

  this.inheritBlocks(parent)
  this.separateBlocks(blocks)
  this.setupConstructor(this.Super, blocks.constructor, blocks)
  this.buildBlocks()
  this.buildPrototype()
  this.buildCache()
}

Blueprint.prototype.inheritBlocks = function (parent) {
  if (!parent) return

  this.decorators = copy(parent.decorators)
  //this.augments = copy(parent.augments)
  //this.includes = copy(parent.includes)
  this.statics = copy(parent.augments)
  this.getters = copy(parent.getters)
  this.setters = copy(parent.setters)
  this.accessors = copy(parent.accessors)
}

Blueprint.prototype.separateBlocks = function (blocks) {
  var blueprint = this

  forIn(blocks, function (name, block) {
    if (!(block instanceof Block)) {
      return
    }

    switch (block.type) {
      case "decorator":
        blueprint.decorators[name] = block
        break

      case "inherit":
        blueprint.Super = block.value
        break
      case "include":
        blueprint.includes.push(block.value)
        break
      case "augment":
        blueprint.augments.push(block.value)
        break

      case "static":
        blueprint.statics[name] = block.value
        break

      case "getter":
        blueprint.getters[name] = block.value
        break
      case "setter":
        blueprint.setters[name] = block.value
        break
      case "accessor":
        blueprint.accessors[name] = block
        break
    }

    delete blocks[name]
  })
}

Blueprint.prototype.setupConstructor = function (Super, Constructor, prototype) {
  var blueprint = this

  Constructor = Constructor || function () {
    if (Super) Super.apply(this, arguments)
    this.constructor.initialize(this)
  }

  if (Super) inherit(Constructor, Super)
  prototype.constructor = Constructor

  Constructor.initialize = function (instance) {
    var top = instance.constructor.blueprint
    blueprint.buildInstance(instance, top)
  }
  Constructor.extend = function (blocks) {
    blocks = blocks || {}
    blocks.inherit = Constructor
    var superBlueprint = new Blueprint(blocks, blueprint)
    return superBlueprint.Constructor
  }

  this.Constructor = Constructor
}

Blueprint.prototype.buildBlocks = function (Constructor, prototype) {
  var blueprint = this

  this.includes.forEach(function (block) {
    block.build(Constructor, prototype)
  })

  this.augments.forEach(function (block) {
    block.build(Constructor, prototype)
  })

  extend(Constructor, prototype)

  if (blueprint.parent) {
    extendObject(Constructor, blueprint.parent.statics)
  }
  extendObject(Constructor, blueprint.statics)

  blueprint.digest("accessor", function( name, access ){
    if( !access ) return
    if( typeof access == "function" ){
      define.getter(proto, name, access)
    }
    else if( typeof access["get"] == "function" && typeof access["set"] == "function" ){
      define.accessor(proto, name, access["get"], access["set"])
    }
    else if( typeof access["get"] == "function" ){
      define.getter(proto, name, access["get"])
    }
    else if( typeof access["set"] == "function" ){
      define.getter(proto, name, access["set"])
    }
  }, true)
}

Blueprint.prototype.buildPrototype = function (prototype, top) {}

Blueprint.prototype.buildCache = function (prototype, top) {}

Blueprint.prototype.buildInstance = function (instance, top) {}
