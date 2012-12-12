/**
 * @venus-library qunit
 * @venus-template sandbox
 * @venus-include ../../src/lib/class.js
 * @venus-include ../../src/treenode.js
 */

module("TreeNode");

function buildSampleTree() {
  /*
      root
      /   \
     A     B___
    / \   / \  \
   C   D E   F  G
   |  /     / \  \
   H I     J  K   L
  */
  function tn(val) {
    var n = new TreeNode(val);
    return n;
  }
  var root = tn("root");
  var a = tn("a");
  var b = tn("b");
  var c = tn("c");
  var d = tn("d");
  var e = tn("e");
  var f = tn("f");
  var g = tn("g");
  var h = tn("h");
  var i = tn("i");
  var j = tn("j");
  var k = tn("k");
  var l = tn("l");

  root.addChild(a);
  root.addChild(b);

  a.addChild(c);
  a.addChild(d);

  b.addChild(e);
  b.addChild(f);
  b.addChild(g);

  c.addChild(h);

  d.addChild(i);

  f.addChild(j);
  f.addChild(k);

  g.addChild(l);

  return {
    tree: root,
    postOrder: ["h", "c", "i", "d", "a", "e", "j", "k", "f", "l", "g", "b", "root"]
  }
}

test("Scaffolding", function() {
  ok(typeof(TreeNode) !== "undefined", "object exists");
});

test("Tree Walk", function() {
  var setupData = buildSampleTree();
  var output = [];

  setupData.tree.postOrder(function(node) {
    output.push(node.getValue());
  });
  deepEqual(output, setupData.postOrder, "postOrder traversal");
});