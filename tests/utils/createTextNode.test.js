import { expect, describe, it } from "vitest";
import { createTextNode } from "../../lexer/utils";

describe("createTextNode", () => {
  it.each([
    {
      input: "This is a test input",
    },
    {
      input: ["This is a test input"],
    },
  ])("should correctly create new text node", ({ input }) => {
    expect(createTextNode(input)).toMatchSnapshot();
  });
});
