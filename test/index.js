var object = require("matchbox-util/object")
var chai = require("chai")
var assert = chai.assert
var core = require("../index")

function test (name, fn) {
  it(name, function () {
    fn.apply(this, arguments)
  })
}

describe("core", function () {

  test("works without arguments", function () {
    core()
  })

  test("returns a constructor", function () {
    var Class = core({})
    assert.isFunction(Class)
  })

  test("returns the provided constructor", function () {
    function Hello () {}
    var Class = core({
      constructor: Hello
    })
    assert.equal(Hello, Class)
  })

  test("assigns its name to the constructor", function () {
    var Class = core({
      name: "hello"
    })
    assert.equal(Class.__name, "hello")
  })

  test("assigns its name to the instance", function () {
    var Class = core({
      name: "hello"
    })
    var obj = new Class()
    assert.equal(obj.__name, "hello")
  })

  test("descriptor", function () {
    var something = {
      hey: "ho",
      "let's": "go"
    }

    var Base = core({
      describe: {
        something: function (Class, options) {
          if (Class == Base) {
            assert.isUndefined(options)
          }
          if (Class == Super) {
            assert.equal(something, options)
          }
          object.in(options, function (name, option) {
            Class.property(name, option)
          })
        }
      }
    })

    var base = new Base()
    assert.isUndefined(base.hey)
    assert.isUndefined(base["let's"])

    var Super = Base.extend({
      something: something
    })

    var sup = new Super()
    assert.equal(sup.hey, "ho")
    assert.equal(sup["let's"], "go")
  })

  test("descriptor inheritance", function () {
    var Base = core({
      describe: {
        something: function (Class, options) {
          object.in(options, function (name, option) {
            Class.property(name, option)
          })
        }
      }
    })

    var S1 = Base.extend({
      something: {
        "s1": "s1"
      }
    })
    var s1 = new S1()
    assert.equal(s1.s1, "s1")

    // descriptors carry over even when not defined
    var S2 = S1.extend({})
    var s2 = new S2()
    assert.equal(s2.s1, "s1")

    var S3 = S2.extend({
      something: {
        "s3": "s3"
      }
    })
    var s3 = new S3()
    assert.equal(s3.s1, "s1")
    assert.equal(s3.s3, "s3")

    // descriptor values can be overridden
    var S4 = S3.extend({
      something: {
        s3: null
      }
    })
    var s4 = new S4()
    assert.equal(s4.s3, null)
  })
})
