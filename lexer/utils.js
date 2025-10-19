const {
  ANCHOR_START,
  ANCHOR_END,
  TAG,
  ATTR,
  VALUE,
  CONTENT,
  NESTED_TAG,
  NESTED_TAG_END,
  NESTED_ANCHOR_START,
  NESTED_ATTR,
  ATTR_SEP,
  SEP,
  DOUBLE_QUOTE,
  SINGLE_QUOTE,
  TEXT_NODE,
  ELEMENT_NODE,
  VOID_TAGS,
  USER_DEFINED_VOID_TAG_END_CHAR
} = require("./consts");

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
    inputString.startsWith(DOUBLE_QUOTE) ||
    inputString.startsWith(SINGLE_QUOTE)
  ) {
    inputString = inputString.slice(1);
  }

  if (
    inputString.endsWith(DOUBLE_QUOTE) ||
    inputString.endsWith(SINGLE_QUOTE)
  ) {
    inputString = inputString.slice(0, -1);
  }

  return inputString;
}

function isAnchorStart(state, char) {
  return state === undefined && char === ANCHOR_START;
}

function isTagStart(state, char) {
  return state === ANCHOR_START && char !== ANCHOR_START;
}

function isTagEnd(state, char) {
  return state === TAG && (char === SEP || char === ANCHOR_END);
}

function isAttrStart(state, char) {
  return state === SEP && char !== SEP;
}

function isAttrEnd(state, char) {
  return state === ATTR && (char === ATTR_SEP || char === SEP);
}

function isValueStart(state, char) {
  return state === ATTR_SEP && char !== SEP && char !== ATTR_SEP;
}

function isValueEnd(state, char, isWithinQuotes, quoteChar) {
  if (isWithinQuotes) {
    return state === VALUE && char === quoteChar;
  }
  return (
    state === VALUE &&
    (char === SEP ||
      char === ANCHOR_END ||
      char === DOUBLE_QUOTE ||
      char === SINGLE_QUOTE)
  );
}

function isSep(state, char) {
  return state === SEP && char === SEP;
}

function isTagBodyStarting(state, char, tagName) {
  return (
    state !== CONTENT &&
    state !== NESTED_TAG_END &&
    state !== NESTED_TAG &&
    state !== NESTED_ATTR &&
    state !== USER_DEFINED_VOID_TAG_END_CHAR &&
    char === ANCHOR_END
  );
}

function isContentEnd(state, char) {
  return (
    (state === CONTENT || state === NESTED_ANCHOR_START) &&
    char === ANCHOR_START
  );
}

function isWithinQuotes(char) {
  return char === SINGLE_QUOTE || char === DOUBLE_QUOTE;
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
    content: text,
  };
}

function createElementNode(tag, data, children) {
  return {
    type: ELEMENT_NODE,
    tag,
    data,
    children,
  };
}

function isVoidTag(tagName) {
  return VOID_TAGS.has(tagName);
}

function appendTextNode(nodesDir, content) {
  if (content === "") return;

  nodesDir.push(createTextNode(content));
}

function appendElementNode(nodesDir, content, parseMethod) {
  if (content === "") return;

  nodesDir.push(...parseMethod(content));
}

module.exports = {
  removeQuotes,
  isAnchorStart,
  isTagStart,
  isTagEnd,
  isAttrStart,
  isAttrEnd,
  isValueStart,
  isValueEnd,
  isSep,
  isTagBodyStarting,
  isContentEnd,
  isWithinQuotes,
  getValue,
  getAttr,
  createTextNode,
  createElementNode,
  isVoidTag,
  appendTextNode,
  appendElementNode,
};