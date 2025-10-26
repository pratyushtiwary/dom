import { expect, describe, it } from "vitest";
import { createElementNode } from "../../lexer/utils";

describe("createElementNode", () => {
  it.each([
    {
      tag: "test",
      data: {
        abc: true,
        xyz: "1",
      },
      children: [],
    },
    {
      tag: "test",
      data: {
        abc: true,
        xyz: "1",
      },
      children: [1, 2, 3, 4],
    },
  ])(
    "should correctly create new element node",
    ({ tag, data, children }) => {
      expect(createElementNode(tag, data, children)).toMatchSnapshot();
    }
  );
});
