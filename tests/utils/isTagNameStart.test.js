import { expect, describe, it, beforeEach } from "vitest";
import { isTagNameStart } from "../../lexer/utils";
import {
  ANCHOR_START,
  END_CHAR,
  SEP,
  ANCHOR_END,
  ANCHOR_START,
} from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isTagNameStart", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it.each([
    {
      input: SEP.char,
      expected: false,
    },
    {
      input: END_CHAR.char,
      expected: false,
    },
    {
      input: ANCHOR_END.char,
      expected: false,
    },
    {
      input: ANCHOR_START.char,
      expected: false,
    },
    {
      input: "t",
      expected: true,
    },
  ])(
    "should correctly return $expected when $input is found and current state is ANCHOR_START",
    ({ input, expected }) => {
      stateMachine.transition(ANCHOR_START, 0);
      expect(isTagNameStart(stateMachine, input)).toBe(expected);
    }
  );

  it.each([
    {
      input: SEP.char,
    },
    {
      input: END_CHAR.char,
    },
    {
      input: ANCHOR_END.char,
    },
    {
      input: ANCHOR_START.char,
    },
    {
      input: "t",
    },
  ])(
    "should correctly return false when $input is found and current state is not ANCHOR_START",
    ({ input }) => {
      expect(isTagNameStart(stateMachine, input)).toBeFalsy;
    }
  );
});
