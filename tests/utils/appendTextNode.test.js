import { expect, describe, it } from "vitest";
import { appendTextNode, createTextNode } from "../../lexer/utils";

describe("appendTextNode", () => {
  const nodes = [];

  it.each([
    {
      input: "",
      output: undefined,
    },
    {
      input: "Test",
      output: createTextNode("Test"),
    },
    {
      input: " Test",
      output: createTextNode(" Test"),
    },
  ])("should correctly append text node", ({ input, output }) => {
    appendTextNode(nodes, input);
    expect(nodes.at(-1)).toStrictEqual(output);
  });
});
