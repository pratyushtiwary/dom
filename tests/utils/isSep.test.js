import { expect, describe, it } from "vitest";
import { isSep } from "../../lexer/utils";
import {
  SEP,
  VALUE
} from "../../lexer/consts";

describe("isSep", () => {
  it.each([
    {
      state: SEP,
      input: SEP,
      output: true,
    },
    {
      state: VALUE,
      input: SEP,
      output: false,
    },
    {
      state: SEP,
      input: VALUE,
      output: false,
    },
  ])(
    "should correctly flag sep state",
    ({ state, input, output }) => {
      expect(isSep(state, input)).toBe(output);
    }
  );
});
