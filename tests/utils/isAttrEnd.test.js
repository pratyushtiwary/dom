import { expect, describe, it } from "vitest";
import { isAttrEnd } from "../../lexer/utils";
import {
  ANCHOR_START,
  ANCHOR_END,
  SEP,
  ATTR,
  ATTR_SEP,
} from "../../lexer/consts";

describe("isAttrEnd", () => {
  it.each([
    {
      state: ATTR,
      input: ATTR_SEP,
      output: true,
    },
    {
      state: ATTR,
      input: SEP,
      output: true,
    },
    {
      state: SEP,
      input: ATTR_SEP,
      output: false,
    },
    {
      state: SEP,
      input: SEP,
      output: false,
    },
    {
      state: ATTR,
      input: ANCHOR_START,
      output: false,
    },
    {
      state: ATTR,
      input: ANCHOR_END,
      output: false,
    },
  ])("should correctly flag attr end state", ({ state, input, output }) => {
    expect(isAttrEnd(state, input)).toBe(output);
  });
});
