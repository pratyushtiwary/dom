import { expect, describe, it, beforeEach } from "vitest";
import { requiresTagStartRecovery } from "../../lexer/utils";
import {
  ANCHOR_START,
  SEP,
  END_CHAR,
  ANCHOR_START,
  ANCHOR_END,
} from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("requiresTagStartRecovery", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it.each([
    {
      input: ANCHOR_END.char,
      expected: true,
    },
    {
      input: END_CHAR.char,
      expected: true,
    },
    {
      input: ANCHOR_START.char,
      expected: true,
    },
    {
      input: SEP.char,
      expected: true,
    },
    {
      input: "t",
      expected: false,
    },
  ])(
    "should correctly return $expected when $input is found and current state is ANCHOR_START",
    ({ input, expected }) => {
      stateMachine.transition(ANCHOR_START, 0);
      expect(requiresTagStartRecovery(stateMachine, input)).toBe(expected);
    }
  );

  it.each([
    {
      input: ANCHOR_END.char,
    },
    {
      input: END_CHAR.char,
    },
    {
      input: ANCHOR_START.char,
    },
    {
      input: SEP.char,
    },
    {
      input: "t",
    },
  ])(
    "should correctly return false when $input is found and current state is not ANCHOR_START",
    ({ input }) => {
      expect(requiresTagStartRecovery(stateMachine, input)).toBeFalsy;
    }
  );
});
