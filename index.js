var Factory = require("./Factory")

module.exports = factory

factory.CacheExtension = require("./CacheExtension")
factory.InstanceExtension = require("./InstanceExtension")
factory.PrototypeExtension = require("./PrototypeExtension")

function factory( blueprint ){
  return new Factory(blueprint).assemble()
}
