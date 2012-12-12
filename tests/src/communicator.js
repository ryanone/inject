/**
 * @venus-library qunit
 * @venus-template sandbox
 * @venus-include ../resources/sinon.js
 * @venus-include ../resources/config.js
 * @venus-include ../../src/includes/constants.js
 * @venus-include ../../src/includes/globals.js
 * @venus-include ../../src/lib/class.js
 * @venus-include ../../src/communicator.js
 */

var lscache;
var Executor;

module("Communicator", {
  setup: function() {
    lscache = {
      setBucket: function() {},
      flush: function() {},
      set: sinon.stub(),
      get: sinon.stub()
    };
    Executor = {
      flagModuleAsBroken: function() {}
    };
  }
});

test("Scaffolding", function() {
  ok(typeof(Communicator) === "object", "object exists");
});

asyncTest("Simple Get", 1, function() {
  Communicator.get("sampleModule", location.href, function(results) {
    ok(results, "got results from communicator");
    start();
  });
});

asyncTest("Get uses lscache", 2, function() {
  Communicator.get("sampleModule", location.href, function(results) {
    ok(lscache.get.called, "lscache get called");
    ok(lscache.set.called, "lscache set called");
    start();
  });
});

asyncTest("in lscache doesn't redownload", 2, function() {
  lscache.get.withArgs(location.href).returns("content");

  Communicator.get("sampleModule", location.href, function(results) {
    ok(lscache.get.called, "lscache get called");
    ok(!lscache.set.called, "lscache set not called");
    start();
  });

});