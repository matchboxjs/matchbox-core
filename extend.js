module.exports = function extend (Class, prototype) {
  Object.getOwnPropertyNames(prototype).forEach(function (name) {
    if (name !== "constructor" ) {
      var descriptor = Object.getOwnPropertyDescriptor(prototype, name)
      Object.defineProperty(Class.prototype, name, descriptor)
    }
  })

  return Class
}
