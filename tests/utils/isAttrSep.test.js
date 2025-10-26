import { expect, describe, it, beforeEach } from "vitest";
import { isAttrSep } from "../../lexer/utils";
import { ATTR_SEP } from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isAttrSep", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it("should return true when state is ATTR_SEP", () => {
    stateMachine.transition(ATTR_SEP, 0);
    expect(isAttrSep(stateMachine, '')).toBeTruthy();
  });
  
  it("should return false when state is not ATTR_SEP", () => {
    expect(isAttrSep(stateMachine, '')).toBeFalsy();
  });

});
