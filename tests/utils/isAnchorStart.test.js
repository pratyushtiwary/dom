import { expect, describe, it } from "vitest";
import { isAnchorStart } from "../../lexer/utils";
import { ANCHOR_START } from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isAnchorStart", () => {
	const stateMachine = new StateMachine();

	it("should correctly transition to ANCHOR_START when < is found", () => {
		expect(isAnchorStart(stateMachine, ANCHOR_START.char)).toBeTruthy();
	});
	
	it("should correctly return false when char is not <", () => {
		expect(isAnchorStart(stateMachine, '')).toBeFalsy();
	});
});