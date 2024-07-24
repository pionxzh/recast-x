import { parser } from "./babel";
import getBabelOptions, { Overrides } from "./_babel_options";

export { parser };

export function parse(source: string, options?: Overrides): ReturnType<typeof parser.parse> {
  const babelOptions = getBabelOptions(options);
  babelOptions.plugins.push("jsx", "typescript");
  return parser.parse(source, babelOptions);
}
