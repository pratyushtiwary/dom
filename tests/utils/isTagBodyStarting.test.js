import { expect, describe, it } from "vitest";
import { isTagBodyStarting } from "../../lexer/utils";
import {
  CONTENT,
  NESTED_TAG_END,
  NESTED_TAG,
  NESTED_ATTR,
  USER_DEFINED_VOID_TAG_END_CHAR,
  ANCHOR_END,
  SEP,
} from "../../lexer/consts";

describe("isTagBodyStarting", () => {
  it.each([
    {
      state: SEP,
      input: ANCHOR_END,
      output: true,
    },
    {
      state: SEP,
      input: SEP,
      output: false,
    },
    {
      state: CONTENT,
      input: ANCHOR_END,
      output: false,
    },
    {
      state: NESTED_TAG_END,
      input: ANCHOR_END,
      output: false,
    },
    {
      state: NESTED_TAG,
      input: ANCHOR_END,
      output: false,
    },
    {
      state: NESTED_ATTR,
      input: ANCHOR_END,
      output: false,
    },
    {
      state: USER_DEFINED_VOID_TAG_END_CHAR,
      input: ANCHOR_END,
      output: false,
    },
  ])(
    "should correctly flag tag body starting state",
    ({ state, input, output }) => {
      expect(isTagBodyStarting(state, input)).toBe(output);
    }
  );
});
