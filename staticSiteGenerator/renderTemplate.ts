import path from "path";
import nun from "nunjucks";
import { minify } from "html-minifier";
import fs from "fs-extra";

import { Context } from "./Context.js";

/**
 * Parameters used in _frame.njk.
 */
export interface PageFrameParameter {
  styles: string[];
  title: string;
  heading: string;
}

export const renderTemplate = async <TTemplate>(
  fileName: string,
  data: TTemplate & PageFrameParameter,
  context: Context,
): Promise<string> => {
  const nunEnv = new nun.Environment(
    new nun.FileSystemLoader([path.resolve("webpage")]),
  );
  const file = await fs.readFile(fileName, "utf-8");
  const compiled = nunEnv.renderString(file, {
    ...context,
    ...data,
    styles: data.styles.map((style) => context.staticStyles[style]),
  });

  if (context.mode === "production") {
    const uglified = minify(compiled, {
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      useShortDoctype: false,
      sortClassName: true,
      sortAttributes: true,
      removeTagWhitespace: true,
      removeStyleLinkTypeAttributes: true,
      removeScriptTypeAttributes: true,
      removeRedundantAttributes: true,
      removeOptionalTags: false,
      removeEmptyElements: false,
      removeEmptyAttributes: false,
      removeComments: true,
      removeAttributeQuotes: false,
      processConditionalComments: false,
      preserveLineBreaks: false,
      minifyJS: true,
      minifyURLs: true,
      minifyCSS: true,
      keepClosingSlash: true,
      includeAutoGeneratedTags: true,
      html5: true,
    });

    return uglified;
  }

  return compiled;
};
