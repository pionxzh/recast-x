"use strict";

import { parse } from "../lib/parser";
import { Printer } from "../lib/printer";
import { getLineTerminator } from "../lib/util";
import assert from "assert";
import * as types from "ast-types";

const eol = getLineTerminator();

for (const { title, parser } of [
  { title: "Babel JSX Compatibility", parser: require("../parsers/babel") },
  { title: "Esprima JSX Compatibility", parser: require("../parsers/esprima") },
]) {
  describe(title, function () {
    const printer = new Printer({ tabWidth: 2 });
    const parseOptions = { parser };

    function check(source: string) {
      const ast1 = parse(source, parseOptions);
      const ast2 = parse(printer.printGenerically(ast1).code, parseOptions);
      types.astNodesAreEquivalent.assert(ast1, ast2);
    }

    it("should parse and print attribute comments", function () {
      check("<b /* comment */ />");
      check("<b /* multi\nline\ncomment */ />");
    });

    it("should parse and print child comments", function () {
      check("<b>{/* comment */}</b>");
      check("<b>{/* multi\nline\ncomment */}</b>");
    });

    it("should parse and print literal attributes", function () {
      check('<b className="hello" />');
    });

    it("should parse and print expression attributes", function () {
      check("<b className={classes} />");
    });

    it("should parse and print chidren", function () {
      check("<label><input /></label>");
    });

    it("should parse and print literal chidren", function () {
      check("<b>hello world</b>");
    });

    it("should parse and print expression children", function () {
      check("<b>{this.props.user.name}</b>");
    });

    it("should parse and print namespaced elements", function () {
      check("<Foo.Bar />");
    });

    // Esprima does not parse JSX fragments: https://github.com/jquery/esprima/issues/2020
    (/esprima/i.test(title)
      ? xit
      : it)("should parse and print fragments", function () {
      check(["<>", "  <td>Hello</td>", "  <td>world!</td>", "</>"].join("\n"));
    });
  });
}

it("should not remove trailing whitespaces", function () {
  const printer = new Printer({ tabWidth: 2 });
  const source =
    `function App() {${eol}` +
    `  const name = "world";${eol}` +
    `${eol}` +
    `  return (${eol}` +
    `    <div className="app">${eol}` +
    `        hello {name}${eol}` +
    `    </div>${eol}` +
    `  );${eol}` +
    "}";
  const ast = parse(source, { parser: require("../parsers/esprima") });
  ast.program.body[0].body.body[1].argument.openingElement.attributes[0].name.name =
    "abc";

  const code = printer.printGenerically(ast).code;

  assert.equal(
    code,
    `function App() {${eol}` +
      `  const name = "world";${eol}` +
      `${eol}` +
      `  return (${eol}` +
      `    <div abc="app">hello {name}${eol}` +
      `    </div>${eol}` +
      `  );${eol}` +
      "}",
  );
});
