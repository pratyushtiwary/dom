import { expect, describe, it } from "vitest";
import { isWithinQuotes } from "../../lexer/utils";
import { DOUBLE_QUOTE, SINGLE_QUOTE, SEP } from "../../lexer/consts";

describe("isWithinQuotes", () => {
  it.each([
    {
      input: SEP,
      output: false,
    },
    {
      input: DOUBLE_QUOTE,
      output: true,
    },
    {
      input: SINGLE_QUOTE,
      output: true,
    },
  ])("should correctly flag within quote state", ({ input, output }) => {
    expect(isWithinQuotes(input)).toBe(output);
  });
});
