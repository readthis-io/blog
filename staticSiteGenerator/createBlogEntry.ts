import path from "path";
import readingTime from "reading-time";

import { BlogEntry } from "./BlogEntry.js";
import { createSlug } from "./createSlug.js";
import { FrontMatter } from "./FrontMatter.js";
import { renderMarkdown } from "./renderMarkdown.js";

const extractFileName = (filename: string): string => {
  return path.basename(path.dirname(path.resolve(filename)));
};

/**
 * Reads a blogs front matter and creates a blog entry out of the front matter,
 * including the rendered markdown content.
 *
 * Enriches the frontmatter with generated contend.
 *
 * @param frontMatter the blogs front matter
 * @returns the blog entry
 */
export const createBlogEntry = async (
  frontMatter: FrontMatter,
): Promise<BlogEntry> => {
  return {
    descriptionMarkdown: frontMatter.data.description,
    description: await renderMarkdown(
      frontMatter.data.description,
      path.dirname(frontMatter.path),
    ),
    html: await renderMarkdown(
      frontMatter.content,
      path.dirname(frontMatter.path),
    ),
    markdown: frontMatter.content,
    slug: createSlug(frontMatter.data.slug, extractFileName(frontMatter.path)),
    tags: frontMatter.data.tags,
    title: frontMatter.data.title,
    featuredImage: frontMatter.data.featuredImage,
    author: frontMatter.data.author,
    readingTime: readingTime(frontMatter.content).text,
    topic: frontMatter.data.topic,
  };
};
