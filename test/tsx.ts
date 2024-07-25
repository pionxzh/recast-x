"use strict";

import * as parser from "../parsers/babel-ts";
import * as recast from "../main";
import { getLineTerminator } from "../lib/util";
import assert from "assert";

const eol = getLineTerminator();

describe("Babel TSX Compatibility", function () {
  function check(lines: string[]) {
    const code = lines.join(eol);
    const ast = recast.parse(code, { parser });
    const output = recast.prettyPrint(ast, { tabWidth: 2 }).code;
    assert.strictEqual(code, output);
  }

  it("should parse and print typed JSX elements", function () {
    check(["<Foo<Bar> />;"]);
  });
});
