var extend = require("matchbox-util/object/extend")
var defaults = require("matchbox-util/object/defaults")

var inherit = require("./inherit")
var Extension = require("./Extension")

module.exports = InstanceExtension

function InstanceExtension (options, initialize) {
  if (!initialize) {
    initialize = options
    options = {}
  }
  options = defaults(options, {
    loop: true
  })
  extend(options, {
    type: "instance",
    inherit: true,
    initialize: initialize
  })
  Extension.call(this, options)
}

inherit(InstanceExtension, Extension)
