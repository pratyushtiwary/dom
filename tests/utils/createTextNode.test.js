import { expect, describe, it } from "vitest";
import { createTextNode } from "../../lexer/utils";
import { TEXT_NODE } from "../../lexer/consts";

describe("createTextNode", () => {
  it.each([
    {
      input: "This is a test input",
      output: {
        type: TEXT_NODE,
        content: "This is a test input",
      },
    },
    {
      input: ["This is a test input"],
      output: {
        type: TEXT_NODE,
        content: ["This is a test input"],
      },
    },
  ])("should correctly create new text node", ({ input, output }) => {
    expect(createTextNode(input)).toStrictEqual(output);
  });
});
