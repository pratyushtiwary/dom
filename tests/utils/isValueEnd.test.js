import { expect, describe, it, beforeEach } from "vitest";
import { isValueEnd } from "../../lexer/utils";
import { VALUE, SEP, ANCHOR_END, DOUBLE_QUOTE, SINGLE_QUOTE } from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isValueEnd", () => {
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
      input: ANCHOR_END.char,
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
    "should correctly return $expected when $input is found and current state is VALUE",
    ({ input, expected }) => {
      stateMachine.transition(VALUE, 0);
      expect(isValueEnd(stateMachine, input)).toBe(expected);
    }
  );

  it.each([
    {
      input: SEP.char,
    },
    {
      input: ANCHOR_END.char,
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
    "should correctly return false when $input is found and current state is not VALUE",
    ({ input }) => {
      expect(isValueEnd(stateMachine, input)).toBeFalsy;
    }
  );
});
