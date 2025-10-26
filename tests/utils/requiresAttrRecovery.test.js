import { expect, describe, it, beforeEach } from "vitest";
import { requiresAttrRecovery } from "../../lexer/utils";
import { ATTR_SEP, SEP } from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("requiresTagStartRecovery", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it.each([
    {
      input: SEP.char,
      expected: true,
    },
    {
      input: "t",
      expected: false,
    },
  ])(
    "should correctly return $expected when $input is found and current state is ATTR_SEP",
    ({ input, expected }) => {
      stateMachine.transition(ATTR_SEP, 0);
      expect(requiresAttrRecovery(stateMachine, input)).toBe(expected);
    }
  );

  it.each([
    {
      input: SEP.char,
    },
    {
      input: "t",
    },
  ])(
    "should correctly return false when $input is found and current state is not ATTR_SEP",
    ({ input }) => {
      expect(requiresAttrRecovery(stateMachine, input)).toBeFalsy;
    }
  );
});
