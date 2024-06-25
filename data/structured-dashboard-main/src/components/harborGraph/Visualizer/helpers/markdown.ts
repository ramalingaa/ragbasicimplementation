import twemoji from "twemoji";

import MarkdownIt from "markdown-it";
import { Token } from "markdown-it";
import { full as emoji } from "markdown-it-emoji";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

md.use(emoji);

// @ts-ignore
md.renderer.rules.emoji = (token: Token, idx: Number) => {
  // @ts-ignore
  return twemoji.parse(token[idx].content, {
    base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"
  });
};

export const markdown = (text: string) => {
  return md.renderInline(text);
};
