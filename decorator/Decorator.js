var forIn = require("matchbox-util/object/in")

module.exports = Decorator

function Decorator (name, value) {
  this.name = name
  this.value = value
  this.loopMembers = true
}

Decorator.prototype.digestPrototype = function (prototype, prop) {
  if (this.loopMembers) {
    forIn(prop, function (name, value) {
      this.onPrototype(prototype, name, value)
    })
  }
  else {
    this.onPrototype(prototype, prop, this.value)
  }
}
Decorator.prototype.digestInstance = function (instance, prop) {}
Decorator.prototype.digestConstructor = function (Constructor, prop) {}

Decorator.prototype.onPrototype = function (prototype, prop, value) {}
Decorator.prototype.onInstance = function (instance, prop, value) {}
Decorator.prototype.onConstructor = function (Constructor, prop, value) {}
