const {
  ANCHOR_START,
  ANCHOR_END,
  TAG,
  SEP,
  ATTR,
  END_CHAR,
  CONTENT,
  ATTR_SEP,
  VALUE,
  DOUBLE_QUOTE,
  SINGLE_QUOTE,
} = require("./consts");
const {
  getAttr,
  getValue,
  createTextNode,
  createElementNode,
  isAnchorStart,
  isAnchorEndChar,
  isTagNameStart,
  requiresTagStartRecovery,
  requiresAttrRecovery,
  isAnchorTagEnd,
  isAttrStart,
  isValueStart,
  isAttrSep,
  isValueEnd,
} = require("./utils");
const StateMachine = require("./stateMachine");

const handleRecovery = (stateMachine) => {
  const stateStartIdx = stateMachine.getStateStartIndex();

  stateMachine.transition(CONTENT, stateStartIdx, true); // move caret back when state transition happened and mark it as content
};

function parseHtml(inputString) {
  const tagStack = [];
  //TODO: Add logic for recovery from malformed html
  //TODO: Extract conditions into utils for better readability
  const state = new StateMachine();

  const outerChildren = [];

  state.transition(CONTENT, 0);

  state.onTransition = (oldState, newState, stateStartIdx) => {
    if (newState === CONTENT && inputString[stateStartIdx - 1] === ANCHOR_END.char) {
      const currNode = tagStack[tagStack.length - 1];

      if (currNode === undefined) return;

      if (currNode.isKnownVoid) {
        const node = tagStack.pop();
        if (tagStack.length > 0) {
          tagStack[tagStack.length - 1].children.push(node);
        } else {
          outerChildren.push(node);
        }
      }
    }

    if (oldState === CONTENT) {
      const content = inputString.substring(
        state.getStateStartIndex(),
        stateStartIdx - 1
      );

      if (content === "") return;

      if (tagStack[tagStack.length - 1] === undefined) {
        outerChildren.push(createTextNode(content));
        return;
      }
      tagStack[tagStack.length - 1].children.push(createTextNode(content));
    }
  };

  for (let currCharIdx = 0; currCharIdx < inputString.length; currCharIdx++) {
    const currChar = inputString[currCharIdx];

    // tag start logic start
    if (isAnchorStart(state, currChar)) {
      state.transition(ANCHOR_START, currCharIdx + 1);
      continue;
    }

    if (isAnchorEndChar(state, currChar)) {
      state.transition(END_CHAR, currCharIdx + 1);
      continue;
    }

    if (isTagNameStart(state, currChar)) {
      state.transition(TAG, currCharIdx);
      continue;
    }
    // tag start logic end

    // state recovery logic start
    if (requiresTagStartRecovery(state, currChar)) {
      // consider the previous content as CONTENT
      handleRecovery(state);
      state.transition(CONTENT, currCharIdx);
      continue;
    }

    if (requiresAttrRecovery(state, currChar)) {
      // imp for state recovery, ignore spaces after =, example: href= "https://example.com"
      continue;
    }
    // state recovery logic end

    // attr and tag end logic start
    if (isAnchorTagEnd(state, currChar)) {
      const endingTagName = inputString.substring(
        state.getStateStartIndex(),
        currCharIdx
      );
      let node = tagStack.pop();
      let prevNode = undefined;

      if (node) {
        node.hasEnding = node.tag === endingTagName;
      }

      while (node?.tag !== endingTagName && tagStack.length > 0) {
        prevNode = node;
        node = tagStack.pop();
        node.hasEnding = node.tag === endingTagName;
        node.children.push(prevNode);
      }
      if (tagStack.length > 0) {
        tagStack[tagStack.length - 1].children.push(node);
      } else if (node) {
        outerChildren.push(node);
      }
      state.transition(CONTENT, currCharIdx + 1);
    }

    if (isAttrStart(state, currChar)) {
      const tagName = inputString.substring(
        state.getStateStartIndex(),
        currCharIdx
      );
      tagStack.push(createElementNode(tagName));
      state.transition(currChar === ANCHOR_END.char ? CONTENT : ATTR, currCharIdx + 1);
    }

    if (isValueStart(state, currChar)) {
      const attrName = getAttr(
        inputString,
        state.getStateStartIndex(),
        currCharIdx
      );

      if (currChar === ANCHOR_END.char && attrName === "") {
        state.transition(CONTENT, currCharIdx + 1);
        continue;
      }

      if (attrName === "") {
        continue;
      }

      tagStack[tagStack.length - 1].data[attrName] = true; // default to true since we have seen this attribute
      state.transition(
        currChar === ANCHOR_END.char
          ? CONTENT
          : currChar === SEP.char
          ? ATTR
          : ATTR_SEP,
        currCharIdx + 1
      );
      state.setContext(attrName);
      continue;
    }

    if (isAttrSep(state, currChar)) {
      const quoteChar = currChar;
      let caretIdx = currCharIdx;

      if (currChar === ANCHOR_END.char) {
        state.transition(CONTENT, currCharIdx + 1);
        continue;
      }

      if (quoteChar === DOUBLE_QUOTE.char || quoteChar === SINGLE_QUOTE.char) {
        state.setQuotesState(quoteChar, true);
        caretIdx += 1;
      }
      state.transition(VALUE, caretIdx);
      continue;
    }

    if (isValueEnd(state, currChar)) {
      const quotesState = state.getQuotesState();
      if (
        quotesState &&
        quotesState.withinQuotes &&
        currChar !== quotesState.quoteChar
      ) {
        continue;
      }
      const value = getValue(
        inputString,
        state.getStateStartIndex(),
        currCharIdx,
        quotesState?.quoteChar
      );
      const attrName = state.getContext();
      const node = tagStack.at(-1);
      node.data[attrName] = value;
      state.setQuotesState(null, false);
      state.transition(
        currChar === ANCHOR_END.char ? CONTENT : ATTR,
        currCharIdx + 1
      );
    }
    // attr and tag end logic end
  }

  if (tagStack.length > 0) {
    let node = tagStack.pop();
    let prevNode = undefined;
    while (tagStack.length > 0) {
      prevNode = node;
      node = tagStack.pop();
      node.children.push(prevNode);
    }

    outerChildren.push(node);
  }

  // everything after last state transition is content
  const remainingContent = inputString.substring(
    state.getStateStartIndex(),
    inputString.length
  );
  if (remainingContent !== "") {
    const lastNode = outerChildren[outerChildren.length - 1];

    if (lastNode && !lastNode.hasEnding && lastNode.children) {
      lastNode.children.push(createTextNode(remainingContent));
    } else {
      outerChildren.push(createTextNode(remainingContent));
    }
  }

  return outerChildren;
}

module.exports = parseHtml;
