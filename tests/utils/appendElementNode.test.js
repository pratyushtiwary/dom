import { expect, describe, it, vi } from "vitest";
import { appendElementNode } from "../../lexer/utils";

describe("appendElementNode", () => {
  const nodes = [];

  const parseMethod = vi.fn().mockImplementation((content) => {
    return [
      {
        content: content,
      },
    ];
  });

  it.each([
    {
      input: "",
      output: undefined,
      verifyCall: false,
    },
    {
      input: "Test",
      output: { content: "Test" },
      verifyCall: true,
    },
  ])(
    "should correctly append ellement node",
    ({ input, output, verifyCall }) => {
      appendElementNode(nodes, input, parseMethod);

      if (verifyCall) {
        expect(parseMethod).toHaveBeenCalledWith(input);
      }
      expect(nodes.at(-1)).toStrictEqual(output);
    }
  );
});
