var inherit = require("./inherit")
var Extension = require("./Extension")

module.exports = PrototypeExtension

function PrototypeExtension (initialize) {
  Extension.call(this, {
    type: "prototype",
    inherit: false,
    initialize: initialize
  })
}

inherit(PrototypeExtension, Extension)
