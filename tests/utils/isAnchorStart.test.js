import { expect, describe, it } from "vitest";
import { isAnchorStart } from "../../lexer/utils";
import { ANCHOR_END, ANCHOR_START, SEP } from "../../lexer/consts";

describe("isAnchorStart", () => {
  it.each([
	{
		"state": undefined,
		"input": ANCHOR_END,
		"output": false,
	},
	{
		"state": ANCHOR_START,
		"input": ANCHOR_START,
		"output": false,
	},
	{
		"state": ANCHOR_START,
		"input": ANCHOR_END,
		"output": false,
	},
	{
		"state": undefined,
		"input": ANCHOR_START,
		"output": true,
	},
	{
		"state": SEP,
		"input": ANCHOR_END,
		"output": false,
	},
	{
		"state": undefined,
		"input": SEP,
		"output": false,
	},
  ])("should correctly flag anchor start state", ({ state, input, output }) => {
	expect(isAnchorStart(state, input)).toBe(output)
  });
});
