module.exports = Block

function Block (type, value) {
  this.type = type
  this.value = value
}

Block.prototype.build = function () {}
