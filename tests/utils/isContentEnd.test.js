import { expect, describe, it } from "vitest";
import { isContentEnd } from "../../lexer/utils";
import {
	CONTENT,
	NESTED_ANCHOR_START,
	ANCHOR_START,
	SEP
} from "../../lexer/consts";

describe("isContentEnd", () => {
  it.each([
    {
      state: SEP,
      input: ANCHOR_START,
      output: false,
    },
    {
      state: CONTENT,
      input: ANCHOR_START,
      output: true,
    },
    {
      state: NESTED_ANCHOR_START,
      input: ANCHOR_START,
      output: true,
    },
    {
      state: SEP,
      input: NESTED_ANCHOR_START,
      output: false,
    },
    {
      state: SEP,
      input: SEP,
      output: false,
    },
  ])(
    "should correctly flag content end state",
    ({ state, input, output }) => {
      expect(isContentEnd(state, input)).toBe(output);
    }
  );
});
