import { expect, describe, it } from "vitest";
import { isTagEnd } from "../../lexer/utils";
import { ANCHOR_START, ANCHOR_END, SEP, TAG } from "../../lexer/consts";

describe("isTagEnd", () => {
  it.each([
    {
      state: ANCHOR_START,
      input: ANCHOR_START,
      output: false,
    },
    {
      state: TAG,
      input: SEP,
      output: true,
    },
    {
      state: TAG,
      input: ANCHOR_START,
      output: false,
    },
    {
      state: TAG,
      input: ANCHOR_END,
      output: true,
    },
  ])("should correctly flag tag end state", ({ state, input, output }) => {
    expect(isTagEnd(state, input)).toBe(output);
  });
});
