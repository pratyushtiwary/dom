import { expect, describe, it } from "vitest";
import { getAttr } from "../../lexer/utils";

describe("getAttr", () => {
  it.each([
    {
      input: "This is a test input",
      startIdx: 10,
      endIdx: 20,
      output: "test input",
    },
    {
      input: "This is a  test input  ",
      startIdx: 10,
      endIdx: 23,
      output: "test input",
    },
    {
      input: "This is a 'test input'",
      startIdx: 10,
      endIdx: 22,
      output: "'test input'",
    },
  ])(
    "should correctly perfrom substr",
    ({ input, startIdx, endIdx, output }) => {
      expect(getAttr(input, startIdx, endIdx)).toBe(output);
    }
  );
});
