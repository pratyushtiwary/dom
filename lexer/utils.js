const {
  TEXT_NODE,
  ELEMENT_NODE,
  VOID_TAGS,
  ANCHOR_START,
  END_CHAR,
  SEP,
  ANCHOR_END,
  ATTR_SEP,
  ATTR,
  VALUE,
  DOUBLE_QUOTE,
  SINGLE_QUOTE,
  TAG,
} = require("./consts");

class TransitionStrategyBuilder {
  charEq = new Set();
  charNotEq = new Set();
  expectedState = undefined;

  stateEq(state) {
    this.expectedState = state;
    return this;
  }

  currCharEq(...chars) {
    for (const char of chars) {
      this.charEq.add(char);
    }
    return this;
  }

  currCharNotEq(...chars) {
    for (const char of chars) {
      this.charNotEq.add(char);
    }
    return this;
  }

  build() {
    return (state, char) => {
      let matchingConditions = true;

      if (this.charEq.size > 0 && !this.charEq.has(char)) {
        matchingConditions = false;
      }

      if (this.charNotEq.size > 0 && this.charNotEq.has(char)) {
        matchingConditions = false;
      }

      if (this.expectedState && this.expectedState.name !== state.getState()?.name) {
        matchingConditions = false;
      }

      return matchingConditions;
    };
  }
}
// recovery checkers
const requiresTagStartRecovery = new TransitionStrategyBuilder()
  .stateEq(ANCHOR_START)
  .currCharEq(SEP.char, END_CHAR.char, ANCHOR_END.char, ANCHOR_START.char)
  .build();
const requiresAttrRecovery = new TransitionStrategyBuilder()
  .stateEq(ATTR_SEP)
  .currCharEq(SEP.char)
  .build();

// normal checkers
const isAnchorStart = new TransitionStrategyBuilder()
  .currCharEq(ANCHOR_START.char)
  .build();
const isAnchorEndChar = new TransitionStrategyBuilder()
  .stateEq(ANCHOR_START)
  .currCharEq(END_CHAR.char)
  .build();
const isTagNameStart = new TransitionStrategyBuilder()
  .stateEq(ANCHOR_START)
  .currCharNotEq(SEP.char, END_CHAR.char, ANCHOR_END.char, ANCHOR_START.char)
  .build();
const isAnchorTagEnd = new TransitionStrategyBuilder()
  .stateEq(END_CHAR)
  .currCharEq(ANCHOR_END.char)
  .build();
const isAttrStart = new TransitionStrategyBuilder()
  .stateEq(TAG)
  .currCharEq(SEP.char, ANCHOR_END.char)
  .build();
const isValueStart = new TransitionStrategyBuilder()
  .stateEq(ATTR)
  .currCharEq(
    ANCHOR_END.char,
    ATTR_SEP.char,
    SEP.char,
    DOUBLE_QUOTE.char,
    SINGLE_QUOTE.char
  )
  .build();
const isAttrSep = new TransitionStrategyBuilder().stateEq(ATTR_SEP).build();
const isValueEnd = new TransitionStrategyBuilder()
  .stateEq(VALUE)
  .currCharEq(SEP.char, ANCHOR_END.char, DOUBLE_QUOTE.char, SINGLE_QUOTE.char)
  .build();

function removeQuotes(inputString, quoteChar = undefined) {
  if (quoteChar) {
    if (inputString.startsWith(quoteChar)) {
      inputString = inputString.slice(1);
    }

    if (inputString.endsWith(quoteChar)) {
      inputString = inputString.slice(0, -1);
    }

    return inputString;
  }

  if (
    inputString.startsWith(DOUBLE_QUOTE.char) ||
    inputString.startsWith(SINGLE_QUOTE.char)
  ) {
    inputString = inputString.slice(1);
  }

  if (
    inputString.endsWith(DOUBLE_QUOTE.char) ||
    inputString.endsWith(SINGLE_QUOTE.char)
  ) {
    inputString = inputString.slice(0, -1);
  }

  return inputString;
}

function getValue(inputString, startIdx, endIdx, quoteChar) {
  return removeQuotes(inputString.slice(startIdx, endIdx), quoteChar).trim();
}

function getAttr(inputString, startIdx, endIdx) {
  return inputString.slice(startIdx, endIdx).trim();
}

function createTextNode(text) {
  return {
    type: TEXT_NODE,
    content: JSON.stringify(text).replace(/\\r\\n/g, "\\n"),
  };
}

function createElementNode(tagName) {
  return {
    tag: tagName,
    children: [],
    isKnownVoid: isVoidTag(tagName),
    data: {},
    type: ELEMENT_NODE,
  };
}

function isVoidTag(tagName) {
  return VOID_TAGS.has(tagName);
}

module.exports = {
  getValue,
  getAttr,
  createTextNode,
  createElementNode,
  requiresTagStartRecovery,
  requiresAttrRecovery,
  isAnchorStart,
  isAnchorEndChar,
  isTagNameStart,
  isAnchorTagEnd,
  isAttrStart,
  isValueStart,
  isAttrSep,
  isValueEnd,
  isVoidTag,
  removeQuotes
};
