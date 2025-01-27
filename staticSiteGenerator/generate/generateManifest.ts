import fs from "fs-extra";
import path from "path";

import { Context } from "../Context.js";

export const generateManifest = async (ctx: Context): Promise<void> => {
  let manifest = await fs.readFile(
    "webpage/images/favicon/site.webmanifest",
    "utf-8",
  );

  for (const [name, key] of Object.entries(ctx.staticImages)) {
    manifest = manifest.replaceAll(name, key);
  }

  await fs.writeFile(path.join(ctx.outputDirectory, "manifest.json"), manifest);
};
