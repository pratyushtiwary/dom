import { expect, describe, it } from "vitest";
import { isVoidTag } from "../../lexer/utils";
import { VOID_TAGS } from "../../lexer/consts";

describe("isVoidTag", () => {
  it.each([
    ...Array.from(VOID_TAGS).map((tag) => ({
      input: tag,
      output: true,
    })),
    {
      input: "abc",
      output: false,
    },
    {
      input: "xyz",
      output: false,
    },
  ])("should correctly categorize known void tags", ({ input, output }) => {
    expect(isVoidTag(input)).toBe(output);
  });
});
