/**
 * @venus-library qunit
 * @venus-template sandbox
 * @venus-include ../resources/sinon.js
 * @venus-include ../../src/includes/constants.js
 * @venus-include ../../src/includes/globals.js
 * @venus-include ../../src/lib/class.js
 * @venus-include ../../src/injectcore.js
 */

var lscache;
var Executor;
var DownloadManager;

// a local function to save and restore config for the purpose of this test
var saveConfig;
var restoreConfig;
(function() {
  var cfg;
  saveConfig = function() {
    cfg = userConfig;
  }
  restoreConfig = function() {
    userConfig = cfg;
  }
})();

module("InjectCore", {
  setup: function() {
    saveConfig();

    HAS_LOCAL_STORAGE = true;

    Executor = {
      runModule: sinon.stub()
    };
    DownloadManager = {
      download: sinon.stub()
    };

    // stub out lscache
    lscacheWithNoKey = {
      set: sinon.spy(),
      flush: sinon.spy(),
      get: sinon.stub().withArgs("!appCacheKey").returns(null)
    };
    lscacheWithTwoKey = {
      set: sinon.spy(),
      flush: sinon.spy(),
      get: sinon.stub().withArgs("!appCacheKey").returns("2")
    };

    sinon.spy(window, "eval");
  },
  teardown: function() {
    restoreConfig();
    window.eval.restore();
  }
});

test("Scaffolding", function() {
  ok(typeof(InjectCore) === "object", "object exists");
});

test("Passthrough and config", function() {
  InjectCore.setModuleRoot("http://testok.com");
  InjectCore.setCrossDomain({
    relayFile: "http://testok-relay.com",
    relaySwf: "http://testok-swf.com"
  });
  InjectCore.setExpires(987654);
  InjectCore.setUseSuffix(true);

  // test userConfig
  equal(userConfig.moduleRoot, "http://testok.com", "moduleRoot");
  equal(userConfig.xd.relayFile, "http://testok-relay.com", "relayFile");
  equal(userConfig.xd.relaySwf, "http://testok-swf.com", "relaySwf");
  equal(userConfig.fileExpires, 987654, "fileExpires");
  equal(userConfig.useSuffix, true, "useSuffix");
});

test("setCacheKey wipes cache", function() {
  lscache = lscacheWithNoKey;
  InjectCore.setCacheKey("5");
  ok(lscache.flush.called, "cache was flushed");

  lscache = lscacheWithTwoKey;
  InjectCore.setCacheKey("2");
  ok(!lscache.flush.called, "cache was not flushed");

  InjectCore.setCacheKey("5");
  ok(lscache.flush.called, "cache was flushed");
});
