import { expect, describe, it, beforeEach, vi } from "vitest";
import { SEP, ATTR_SEP } from "../lexer/consts";
import StateMachine from "../lexer/stateMachine";

describe("StateMachine", () => {
  const stateMachine = new StateMachine();

  beforeEach(() => {
    stateMachine.transition(undefined, 0);
  });

  it("should correctly transition to new state", () => {
    stateMachine.transition(SEP, 0);
    expect(stateMachine.getState()).toBe(SEP);
  });

  it("should correctly keep track of state change idx", () => {
    stateMachine.transition(SEP, 0);
    expect(stateMachine.getStateStartIndex()).toBe(0);
    stateMachine.transition(ATTR_SEP, 20);
    expect(stateMachine.getStateStartIndex()).toBe(20);
  });

  it("should correctly set and get context data", () => {
    const contextData = {
      test: true,
    };
    expect(stateMachine.getContext()).toStrictEqual({});
    stateMachine.setContext(contextData);
    expect(stateMachine.getContext()).toStrictEqual(contextData);
  });

  it("should correctly set and get quotes state", () => {
    const quotesState = {
      quoteChar: '"',
      withinQuotes: true,
    };
    expect(stateMachine.getQuotesState()).toBeNull();
    stateMachine.setQuotesState(
      quotesState.quoteChar,
      quotesState.withinQuotes
    );
    expect(stateMachine.getQuotesState()).toStrictEqual(quotesState);
  });

  it("should correctly trigger onTransition when transition happens", () => {
	const mockTransitionListener = vi.fn();
	stateMachine.onTransition = mockTransitionListener;
	stateMachine.transition(SEP, 0);
	expect(mockTransitionListener).toHaveBeenCalled();
	mockTransitionListener.mockReset();
	stateMachine.transition(SEP, 0, true);
	expect(mockTransitionListener).not.toHaveBeenCalled();
  });
});
