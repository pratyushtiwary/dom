import { expect, describe, it, beforeEach } from "vitest";
import { isAnchorEndChar } from "../../lexer/utils";
import { ANCHOR_START, END_CHAR } from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isAnchorEndChar", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it("should correctly transition to END_CHAR when / is found and current state is ANCHOR_START", () => {
    stateMachine.transition(ANCHOR_START, 0);
    expect(isAnchorEndChar(stateMachine, END_CHAR.char)).toBeTruthy();
  });

  it("should correctly return false when char is not / and state is ANCHOR_START", () => {
    stateMachine.transition(ANCHOR_START, 0);
    expect(isAnchorEndChar(stateMachine, "")).toBeFalsy();
  });
  
  it("should correctly return false when char is / and state is not ANCHOR_START", () => {
    expect(isAnchorEndChar(stateMachine, END_CHAR.char)).toBeFalsy();
  });
 
  it("should correctly return false when char is not / and state is not ANCHOR_START", () => {
    expect(isAnchorEndChar(stateMachine, "")).toBeFalsy();
  });
});
