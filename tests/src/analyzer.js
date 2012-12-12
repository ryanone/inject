
/**
 * @venus-library qunit
 * @venus-template sandbox
 * @venus-include ../../src/includes/constants.js
 * @venus-include ../../src/lib/class.js
 * @venus-include ../../src/lib/link.js
 * @venus-include ../../src/analyzer.js
 */

module("Analyzer");

var requireSampleCode = ([
'/*',
' * require("ignoreA");',
'require("ignoreB");',
'*/',
'//require("ignoreC");',
'var a = require("expected");',
'var b=require("expectedB");',
"var c=require('expectedC');",
' require("ignoreD", "ignoreE");',
' require(ignoreF);',
'']).join("\n");

var requireSampleCode_177 = ([
'define("player", ["one", "two", "three", "exports"], function(one, two, three, exports) {',
'    var colors = ["#ff0000", "#0000ff"];',
'    exports.colors = colors;',
'});',
'']).join("\n");

var sampleFunction = "function foo(one, two, three) {};";

test("Scaffolding", function() {
  ok(typeof(Analyzer) === "object", "object exists");
});

test("extraction", function() {
  var result = Analyzer.extractRequires(requireSampleCode);
  var item;

  var okRegex = /expected/g;
  var badRegex = /ignore/g;

  var totalOk = requireSampleCode.match(okRegex).length;

  ok(result.length > 0, "found some require statements");
  equal(result.length, totalOk, "all expected require() statements found: "+result.join(" "));

  // loop through everything in results, ensure we don't match a bad one
  for (var i = 0, len = result.length; i < len; i++) {
    item = result[i];
    if (badRegex.test(item) === true) {
      ok(false, "the following require() statement should have been skipped: "+item);
    }
    else {
      ok(true, "found expected regex: "+item);
    }
  }
});

test("#177 define syntax messes up with arrays", function() {
  var result = Analyzer.extractRequires(requireSampleCode_177);
  equal(result.length, 3, "only three modules identified");
});