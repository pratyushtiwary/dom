import { expect, describe, it } from "vitest";
import { getValue } from "../../lexer/utils";

describe("getValue", () => {
  it.each([
    {
      input: "This is a test input",
      startIdx: 10,
      endIdx: 20,
      output: "test input",
    },
    {
      input: "This is a 'test input'",
      startIdx: 10,
      endIdx: 22,
      output: "test input",
    },
    {
      input: "This is a 'test input'",
      startIdx: 10,
      endIdx: 21,
      output: "test input",
    },
    {
      input: "This is a 'test 'input'",
      startIdx: 10,
      endIdx: 22,
      output: "test 'input",
    },
    {
      input: 'This is a "test \'input"',
      startIdx: 10,
      endIdx: 22,
      output: "test 'input",
    },
    {
      input: 'This is a "test \'input"',
      startIdx: 10,
      endIdx: 23,
      output: '"test \'input"',
      quoteChar: "'",
    },
    {
      input: "This is a 'test \"input'",
      startIdx: 10,
      endIdx: 23,
      output: "'test \"input'",
      quoteChar: '"',
    },
    {
      input: "This is a  'test \"input'  ",
      startIdx: 10,
      endIdx: 26,
      output: "'test \"input'",
      quoteChar: '"',
    },
  ])(
    "should correctly perfrom substr after removing quotes",
    ({ input, startIdx, endIdx, quoteChar, output }) => {
      expect(getValue(input, startIdx, endIdx, quoteChar)).toBe(output);
    }
  );
});
