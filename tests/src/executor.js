/**
 * @venus-library qunit
 * @venus-template sandbox
 * @venus-include ../resources/sinon.js
 * @venus-include ../../src/includes/constants.js
 * @venus-include ../../src/includes/globals.js
 * @venus-include ../../src/includes/commonjs.js
 * @venus-include ../../src/lib/class.js
 * @venus-include ../../src/executor.js
 */

module("Executor", {
  setup: function() {
    sinon.spy(window, "eval");
  },
  teardown: function() {
    window.eval.restore();
  }
});

test("Scaffolding", function() {
  ok(typeof(Executor) === "object", "object exists");
});

test("JS Execution", function() {
  userConfig.debug.sourceMap = false;

  // inject facade
  Inject = {
    INTERNAL: {
      execute: {},
      modules: {},
      execs: {},
      createModule: function() {
        return {
          exports: {}
        };
      },
      createRequire: function() {
        return function() {};
      },
      createDefine: function() {
        return function() {};
      },
      require: function() {},
      defineExecutingModuleAs: function() {},
      undefineExecutingModule: function() {},
      setModuleExports: function() {}
    },
    clearCache: function() {}
  };

  var testScript = "exports.foo = \"bar\";";
  var module = Executor.runModule("testId", testScript, "http://example.com/testid.js", {});
  var moduleB = Executor.runModule("testId", testScript, "http://example.com/testid.js", {});

  equal(module.exports.foo, "bar", "module sandboxed and set exports");
  ok(!eval.called, "eval not called when sourcemap is off");
  equal(module, moduleB, "same execution yields same module result");
});
