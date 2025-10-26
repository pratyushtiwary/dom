import { expect, describe, it } from "vitest";
import { isTagStart } from "../../lexer/utils";
import { ANCHOR_END, ANCHOR_START, SEP } from "../../lexer/consts";

describe("isTagStart", () => {
  it.each([
    {
      state: ANCHOR_START,
      input: ANCHOR_START,
      output: false,
    },
    {
      state: undefined,
      input: 'w',
      output: false,
    },
    {
      state: ANCHOR_START,
      input: 'w',
      output: true,
    },
  ])("should correctly flag tag start state", ({ state, input, output }) => {
    expect(isTagStart(state, input)).toBe(output);
  });
});
