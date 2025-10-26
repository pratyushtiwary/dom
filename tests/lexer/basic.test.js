import { expect, describe, it } from "vitest";
import parseHtml from "../../lexer/index";

describe("basic lexer tests", () => {
  it.each([
    {
      title: "Empty string",
      input: ``,
    },
    {
      title: "Single tag, without attrs",
      input: `<p>Test</p>`,
    },
    {
      title: "Single tag, with attrs",
      input: `<p abc xyz="hello world" test=1>Test</p>`,
    },
    {
      title: "Nested tags, without attrs",
      input: `<p>Test <h1>Hello World</h1></p>`,
    },
    {
      title: "Nested tags, with attrs",
      input: `<p test="hello world" xyz>Test <h1 abc=1 pqr="h1 test">Hello World</h1></p>`,
    },
  ])(
    "should correctly parse basic html strings: $title",
    ({ input }) => {
      expect(parseHtml(input)).toMatchSnapshot();
    }
  );
});
