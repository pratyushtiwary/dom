import { expect, describe, it } from "vitest";
import { isValueStart } from "../../lexer/utils";
import {
  SEP,
  ATTR,
  ATTR_SEP,
} from "../../lexer/consts";

describe("isValueStart", () => {
  it.each([
    {
      state: ATTR_SEP,
      input: SEP,
      output: false,
    },
    {
      state: ATTR_SEP,
      input: ATTR_SEP,
      output: false,
    },
    {
      state: ATTR_SEP,
      input: ATTR,
      output: true,
    },
  ])("should correctly flag value start state", ({ state, input, output }) => {
    expect(isValueStart(state, input)).toBe(output);
  });
});
