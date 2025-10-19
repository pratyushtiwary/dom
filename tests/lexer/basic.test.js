import { expect, describe, it } from "vitest";
import parseHtml from "../../lexer/index";

describe("basic lexer tests", () => {
  it.each([
    {
      title: "Empty string",
      input: ``,
      output: [
        {
          type: "TEXT",
          content: "",
        },
      ],
    },
    {
      title: "Single tag, without attrs",
      input: `<p>Test</p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {},
          children: [
            {
              type: "TEXT",
              content: "Test",
            },
          ],
        },
      ],
    },
    {
      title: "Single tag, with attrs",
      input: `<p abc xyz="hello world" test=1>Test</p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {
            abc: true,
            xyz: "hello world",
            test: "1",
          },
          children: [
            {
              type: "TEXT",
              content: "Test",
            },
          ],
        },
      ],
    },
    {
      title: "Nested tags, without attrs",
      input: `<p>Test <h1>Hello World</h1></p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {},
          children: [
            {
              type: "TEXT",
              content: "Test ",
            },
            {
              type: "ELEMENT",
              tag: "h1",
              data: {},
              children: [
                {
                  type: "TEXT",
                  content: "Hello World",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Nested tags, with attrs",
      input: `<p test="hello world" xyz>Test <h1 abc=1 pqr="h1 test">Hello World</h1></p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {
            test: "hello world",
            xyz: true,
          },
          children: [
            {
              type: "TEXT",
              content: "Test ",
            },
            {
              type: "ELEMENT",
              tag: "h1",
              data: {
                abc: "1",
                pqr: "h1 test",
              },
              children: [
                {
                  type: "TEXT",
                  content: "Hello World",
                },
              ],
            },
          ],
        },
      ],
    },
  ])(
    "should correctly parse basic html strings: $title",
    ({ input, output }) => {
      expect(parseHtml(input)).toStrictEqual(output);
    }
  );
});
