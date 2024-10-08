import { parser } from "./babel";
import getBabelOptions, { Overrides } from "./_babel_options";

// This module is suitable for passing as options.parser when calling
// recast.parse to process Flow code:
//
//   const ast = recast.parse(source, {
//     parser: require("recast/parsers/flow")
//   });
//
export function parse(
  source: string,
  options?: Overrides,
): ReturnType<typeof parser.parse> {
  const babelOptions = getBabelOptions(options);
  babelOptions.plugins.push("jsx", "flow");
  return parser.parse(source, babelOptions);
}
