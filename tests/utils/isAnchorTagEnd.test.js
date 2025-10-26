import { expect, describe, it, beforeEach } from "vitest";
import { isAnchorTagEnd } from "../../lexer/utils";
import { END_CHAR, ANCHOR_END, SEP } from "../../lexer/consts";
import StateMachine from "../../lexer/stateMachine";

describe("isAnchorTagEnd", () => {
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
      expected: true,
    },
  ])(
    "should correctly return $expected when $input is found and current state is END_CHAR",
    ({ input, expected }) => {
      stateMachine.transition(END_CHAR, 0);
      expect(isAnchorTagEnd(stateMachine, input)).toBe(expected);
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
  ])(
    "should correctly return false when $input is found and current state is not END_CHAR",
    ({ input }) => {
      expect(isAnchorTagEnd(stateMachine, input)).toBeFalsy;
    }
  );
});
