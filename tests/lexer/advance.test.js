import { expect, describe, it } from "vitest";
import parseHtml from "../../lexer/index";

describe("advance lexer tests", () => {
	it.each([
    {
      title: "void tag, not nested",
      input: `<img src="https://example.com" disabled width=200>`,
    },
    {
      title: "void tag, nested",
      input: `<p><img src="https://example.com" disabled width=200> test</p>`,
    },
    {
      title: "user-defined void tag, not nested",
      input: `<xyz abc=1 pqr="hello world" test> test`,
    },
    {
      title: "user-defined void tag, nested",
      input: `<p><xyz abc=1 pqr="hello world" test> <abc>test</p>`,
    },
    {
      title: "without root",
      input: `test <p>Hello world</p>`,
    },
    {
      title: "dangling <",
      input: `<p>Text < <b>bold</b></p>`,
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
    },
  ])(
    "should correctly parse basic html strings: $title",
    ({ input, output }) => {
      expect(parseHtml(input)).toMatchSnapshot();
    }
  );
});