import { expect, describe, it } from "vitest";
import { appendTextNode, createTextNode } from "../../lexer/utils";

describe("appendTextNode", () => {
  const nodes = [];

  it.each([
    {
      input: "",
    },
    {
      input: "Test",
    },
    {
      input: " Test",
    },
  ])("should correctly append text node", ({ input }) => {
    appendTextNode(nodes, input);
    expect(nodes.at(-1)).toMatchSnapshot();
  });
});
