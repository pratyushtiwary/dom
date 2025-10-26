import { expect, describe, it } from "vitest";
import { isValueEnd } from "../../lexer/utils";
import {
  ANCHOR_END,
  DOUBLE_QUOTE,
  SEP,
  SINGLE_QUOTE,
  VALUE,
} from "../../lexer/consts";

describe("isValueEnd", () => {
  it.each([
    {
      state: VALUE,
      input: SEP,
      output: true,
    },
    {
      state: VALUE,
      input: ANCHOR_END,
      output: true,
    },
    {
      state: VALUE,
      input: DOUBLE_QUOTE,
      output: true,
    },
    {
      state: VALUE,
      input: SINGLE_QUOTE,
      output: true,
    },
    {
      state: VALUE,
      input: DOUBLE_QUOTE,
      output: true,
      isWithinQuotes: true,
      quoteChar: '"',
    },
    {
      state: VALUE,
      input: DOUBLE_QUOTE,
      output: false,
      isWithinQuotes: true,
      quoteChar: "'",
    },
    {
      state: VALUE,
      input: SINGLE_QUOTE,
      output: true,
      isWithinQuotes: true,
      quoteChar: "'",
    },
    {
      state: VALUE,
      input: SINGLE_QUOTE,
      output: false,
      isWithinQuotes: true,
      quoteChar: '"',
    },
  ])(
    "should correctly flag value end state",
    ({ state, input, isWithinQuotes, quoteChar, output }) => {
      expect(isValueEnd(state, input, isWithinQuotes, quoteChar)).toBe(output);
    }
  );
});
