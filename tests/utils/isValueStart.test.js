import { expect, describe, it, beforeEach } from "vitest";
import { isValueStart } from "../../lexer/utils";
import {
  ATTR,
  ANCHOR_END,
  ATTR_SEP,
  SEP,
  DOUBLE_QUOTE,
  SINGLE_QUOTE,
} from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isValueStart", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it.each([
    {
      input: ANCHOR_END.char, // note to self: this check feels wierd but is handled correctly inside the if block for value transition
      expected: true,
    },
    {
      input: ATTR_SEP.char,
      expected: true,
    },
    {
      input: SEP.char,
      expected: true,
    },
    {
      input: DOUBLE_QUOTE.char,
      expected: true,
    },
    {
      input: SINGLE_QUOTE.char,
      expected: true,
    },
    {
      input: "t",
      expected: false,
    },
  ])(
    "should correctly return $expected when $input is found and current state is ATTR",
    ({ input, expected }) => {
      stateMachine.transition(ATTR, 0);
      expect(isValueStart(stateMachine, input)).toBe(expected);
    }
  );

  it.each([
    {
      input: ANCHOR_END.char,
    },
    {
      input: ATTR_SEP.char,
    },
    {
      input: SEP.char,
    },
    {
      input: DOUBLE_QUOTE.char,
    },
    {
      input: SINGLE_QUOTE.char,
    },
    {
      input: "t",
    },
  ])(
    "should correctly return false when $input is found and current state is not ATTR",
    ({ input }) => {
      expect(isValueStart(stateMachine, input)).toBeFalsy;
    }
  );
});
