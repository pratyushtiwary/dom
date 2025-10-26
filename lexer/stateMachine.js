const isDebug = false; // set to true to get transitions logged

class StateMachine {
  state = undefined;
  stateStartIndex = 0;
  contextData = {};
  quotesState = null;

  onTransition = null;

  transition(newState, stateStartIdx, silent=false) {
    if (isDebug) {
      console.log(`${this.state?.name} -> ${newState.name}, silent: ${silent}`);
    }
    !silent && this.onTransition && this.onTransition(this.state, newState, stateStartIdx);
    this.state = newState;
    this.stateStartIndex = stateStartIdx;
  }

  getState() {
    return this.state;
  }

  getStateStartIndex() {
    return this.stateStartIndex;
  }

  getContext() {
    return this.contextData;
  }

  getQuotesState() {
    return this.quotesState;
  }

  setContext(data) {
    this.contextData = data;
  }

  setQuotesState(quoteChar, withinQuotes) {
    this.quotesState = {
      quoteChar,
      withinQuotes,
    };
  }
}
module.exports = StateMachine;
