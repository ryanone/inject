/**
 * @venus-library qunit
 * @venus-template sandbox
 * @venus-include ../../src/includes/constants.js
 * @venus-include ../../src/includes/globals.js
 * @venus-include ../../src/lib/class.js
 * @venus-include ../../src/rulesengine.js
 */

module("RulesEngine", {
  setup: function() {
    RulesEngine.clearRules();
    userConfig = {
      moduleRoot: "http://example.com/",
      useSuffix: true
    };
  }
});

test("Scaffolding", function() {
  ok(typeof(RulesEngine) === "object", "object exists");
});

test("Identifier Resolution", function() {
  equal(RulesEngine.resolveIdentifier("foo", "one/two/three/four/five"), "foo", "resolves to root");
  equal(RulesEngine.resolveIdentifier("./foo", "one/two/three/four/five"), "one/two/three/four/foo", "./ is same dir as five");
  equal(RulesEngine.resolveIdentifier("../foo", "one/two/three/four/five"), "one/two/three/foo", "../ is same dir as four");
  equal(RulesEngine.resolveIdentifier("/foo", "one/two/three/four/five"), "/foo", "/ resolves to /foo (known absolute)");

});

test("URL Resolution", function() {
  var rootUrl   = "http://example.com/";
  var baseUrl   = "http://example.com/a/b/c/d/e";
  var baseUL    = "http://example.com/a/b/c/d/";
  var baseUUL   = "http://example.com/a/b/c/";
  var baseSlash = "http://example.com/a/b/c/d/e/";

  RulesEngine.addRule("one", "ONE");
  RulesEngine.addRule(/two/, "TWO");
  RulesEngine.addRule(/three/, {
    path: "THREE"
  });
  RulesEngine.addRule(/four/, {
    path: function(path) {
      return path.toUpperCase();
    }
  });
  RulesEngine.addRule(/match/, {
    path: function(path) {
      return path.replace(/match/g, "MATCH");
    }
  });

  equal(RulesEngine.resolveUrl("one"), rootUrl+"ONE.js");
  equal(RulesEngine.resolveUrl("two"), rootUrl+"TWO.js");
  equal(RulesEngine.resolveUrl("three"), rootUrl+"THREE.js");
  equal(RulesEngine.resolveUrl("four"), rootUrl+"FOUR.js");

  equal(RulesEngine.resolveUrl("http://absolute.com"), "http://absolute.com");

  equal(RulesEngine.resolveUrl("./match", baseUrl), baseUL+"MATCH.js");
  equal(RulesEngine.resolveUrl("../match", baseUrl), baseUUL+"MATCH.js");

  // tests two rules at once
  equal(RulesEngine.resolveUrl("./match", baseSlash), baseSlash+"MATCH.js");

  // disable the auto-extension
  userConfig.useSuffix = false;
  equal(RulesEngine.resolveUrl("one"), rootUrl+"ONE");

});

test("Manifest", function() {
  var calls = 0;
  var expectedCalls = 1;

  // stub addRule... make sure it's called
  var addRule = RulesEngine.addRule;
  RulesEngine.addRule = function() {
    calls++;
    equal(arguments[0], "test", "arguments passed through");
    addRule.apply(RulesEngine, arguments);
  };

  RulesEngine.manifest({
    "test": "testOne"
  });

  equal(calls, expectedCalls, "addRule was called internally");

  // restore addrule
  RulesEngine.addRule = addRule;
});

test("converting URLs", function() {
  var root = "http://resolved.com/src/to/modules/foo.js";
  var baseDir = "http://resolved.com/src/to/modules";

  userConfig.moduleRoot = root;

  equal(RulesEngine.resolveUrl("sample", root), baseDir+"/sample.js", "basic URL resolution");
  equal(RulesEngine.resolveUrl("http://absolutepath.com/absolute/path.js", root), "http://absolutepath.com/absolute/path.js", "absolute path resolution");
  equal(RulesEngine.resolveUrl("../a/b", baseDir+"/one/two/foo.js"), baseDir+"/one/a/b.js", "relative path resolution");
});

test("#169 moduleRoot shouldn't force a slash", function() {
  root = "http://example.com?file=";

  equal(RulesEngine.resolveUrl("sample", root), "http://example.com?file=sample.js", "no auto-slash insertion with query strings");
});

test("#167 useSuffix config needs to be respected", function() {
  userConfig.moduleRoot = "http://example.com?file=";
  userConfig.useSuffix = false;

  equal(RulesEngine.resolveUrl("sample", root), "http://example.com?file=sample", "no auto suffix insertion");
});

test("addRule weights respected", function() {
  var order = ["one", "two", "three"];
  var last = null;

  RulesEngine.addRule("example", {
    weight: 100,
    path: function() {
      order.shift();
      return "example";
    }
  });

  RulesEngine.addRule("example", {
    weight: 23,
    path: function() {
      last = order.join(",");
      return "example";
    }
  });

  RulesEngine.addRule("example", {
    weight: 67,
    path: function() {
      order.shift();
      return "example";
    }
  });

  RulesEngine.resolveUrl("example");
  equal(last, "three", "rules were ran in weight order: 100, 67, 23");
});
