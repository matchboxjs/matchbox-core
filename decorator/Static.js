var inherit = require("../inherit")
var Decorator = require("./Decorator")

module.exports = Static

function Static (value) {
  Decorator.call(this, "static", value)
  this.loopMembers = true
}

inherit(Static, Decorator)

Static.prototype.digestConstructor = function (Constructor) {}
