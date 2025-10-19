import { expect, describe, it } from "vitest";
import parseHtml from "../../lexer/index";

describe("advance lexer tests", () => {
	it.each([
    {
      title: "void tag, not nested",
      input: `<img src="https://example.com" disabled width=200>`,
      output: [
        {
          type: "ELEMENT",
          tag: "img",
          data: {
            src: "https://example.com",
            disabled: true,
            width: "200",
          },
          children: [],
        },
      ],
    },
    {
      title: "void tag, nested",
      input: `<p><img src="https://example.com" disabled width=200> test</p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {},
          children: [
            {
              type: "ELEMENT",
              tag: "img",
              data: {
                src: "https://example.com",
                disabled: true,
                width: "200",
              },
              children: [],
            },
            {
              type: "TEXT",
              content: " test",
            },
          ],
        },
      ],
    },
    {
      title: "user-defined void tag, not nested",
      input: `<xyz abc=1 pqr="hello world" test> test`,
      output: [
        {
          type: "ELEMENT",
          tag: "xyz",
          data: {
            abc: "1",
            pqr: "hello world",
            test: true,
          },
          children: [
            {
              type: "TEXT",
              content: " test",
            },
          ],
        },
      ],
    },
    {
      title: "user-defined void tag, nested",
      input: `<p><xyz abc=1 pqr="hello world" test> <abc>test</p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {},
          children: [
            {
              type: "ELEMENT",
              tag: "xyz",
              data: {
                abc: "1",
                pqr: "hello world",
                test: true,
              },
              children: [
                {
                  type: "TEXT",
                  content: " ",
                },
                {
                  type: "ELEMENT",
                  tag: "abc",
                  data: {},
                  children: [
                    {
                      type: "TEXT",
                      content: "test",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "without root",
      input: `test <p>Hello world</p>`,
      output: [
        {
          type: "TEXT",
          content: "test ",
        },
        {
          type: "ELEMENT",
          tag: "p",
          data: {},
          children: [
            {
              type: "TEXT",
              content: "Hello world",
            },
          ],
        },
      ],
    },
    {
      title: "dangling <",
      input: `<p>Text < <b>bold</b></p>`,
      output: [
        {
          type: "ELEMENT",
          tag: "p",
          data: {},
          children: [
            {
              type: "TEXT",
              content: "Text < ",
            },
            {
              type: "ELEMENT",
              tag: "b",
              data: {},
              children: [
                {
                  type: "TEXT",
                  content: "bold",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "simple html file",
      input: `<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Test Simple</title>
</head>
<body>
	<h1>Hello world</h1>
</body>
</html>`,
      output: [
        {
          type: "ELEMENT",
          tag: "html",
          data: {
            lang: "en",
          },
          children: [
            {
              type: "TEXT",
              content: "\n",
            },
            {
              type: "ELEMENT",
              tag: "head",
              data: {},
              children: [
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "meta",
                  data: {
                    charset: "UTF-8",
                  },
                  children: [],
                },
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "meta",
                  data: {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0",
                  },
                  children: [],
                },
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "title",
                  data: {},
                  children: [
                    {
                      type: "TEXT",
                      content: "Test Simple",
                    },
                  ],
                },
                {
                  type: "TEXT",
                  content: "\n",
                },
              ],
            },
            {
              type: "TEXT",
              content: "\n",
            },
            {
              type: "ELEMENT",
              tag: "body",
              data: {},
              children: [
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "h1",
                  data: {},
                  children: [
                    {
                      type: "TEXT",
                      content: "Hello world",
                    },
                  ],
                },
                {
                  type: "TEXT",
                  content: "\n",
                },
              ],
            },
            {
              type: "TEXT",
              content: "\n",
            },
          ],
        },
      ],
    },
    {
      title: "highly nested html file",
      input: `<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Test highly nested</title>
</head>
<body>
	<h1>Hello world <p>I'm a <b>p <i><xyz>tag</i></b></p></h1>
</body>
</html>`,
      output: [
        {
          type: "ELEMENT",
          tag: "html",
          data: {
            lang: "en",
          },
          children: [
            {
              type: "TEXT",
              content: "\n",
            },
            {
              type: "ELEMENT",
              tag: "head",
              data: {},
              children: [
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "meta",
                  data: {
                    charset: "UTF-8",
                  },
                  children: [],
                },
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "meta",
                  data: {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1.0",
                  },
                  children: [],
                },
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "title",
                  data: {},
                  children: [
                    {
                      type: "TEXT",
                      content: "Test highly nested",
                    },
                  ],
                },
                {
                  type: "TEXT",
                  content: "\n",
                },
              ],
            },
            {
              type: "TEXT",
              content: "\n",
            },
            {
              type: "ELEMENT",
              tag: "body",
              data: {},
              children: [
                {
                  type: "TEXT",
                  content: "\n\t",
                },
                {
                  type: "ELEMENT",
                  tag: "h1",
                  data: {},
                  children: [
                    {
                      type: "TEXT",
                      content: "Hello world ",
                    },
                    {
                      type: "ELEMENT",
                      tag: "p",
                      data: {},
                      children: [
                        {
                          type: "TEXT",
                          content: "I'm a ",
                        },
                        {
                          type: "ELEMENT",
                          tag: "b",
                          data: {},
                          children: [
                            {
                              type: "TEXT",
                              content: "p ",
                            },
                            {
                              type: "ELEMENT",
                              tag: "i",
                              data: {},
                              children: [
                                {
                                  type: "ELEMENT",
                                  tag: "xyz",
                                  data: {},
                                  children: [
                                    {
                                      type: "TEXT",
                                      content: "tag",
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  type: "TEXT",
                  content: "\n",
                },
              ],
            },
            {
              type: "TEXT",
              content: "\n",
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