import { expect, describe, it } from "vitest";
import { isAttrStart } from "../../lexer/utils";
import { ANCHOR_START, ANCHOR_END, SEP } from "../../lexer/consts";

describe("isAttrStart", () => {
  it.each([
    {
      state: SEP,
      input: ANCHOR_START,
      output: true,
    },
    {
      state: SEP,
      input: SEP,
      output: false,
    },
    {
      state: SEP,
      input: ANCHOR_END,
      output: true,
    },
    {
      state: ANCHOR_START,
      input: SEP,
      output: false,
    },
  ])("should correctly flag attr start state", ({ state, input, output }) => {
    expect(isAttrStart(state, input)).toBe(output);
  });
});
