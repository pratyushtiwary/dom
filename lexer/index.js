// const inputString = `<body><xyz>Test</xyz><test><xyz><abc>test<xyz>1</xyz></body>`;
// const inputString = `<head><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"></head>`;
// const inputString = `<html lang="en"><head><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><xyz><abc>test</body></html>`;
// const inputString = `<p test="1 2" disabled=true abc xyz>Test < <p><b>Test</b></p> <meta xyz>test</p>`;
// const inputString = `<p test="1 2" disabled=true abc xyz>Test < <p><b>Test</b></p> <meta xyz>test</p>`;
// const inputString = `<p test="1 2" disabled=true abc xyz>Test < <b test xyz="test"><p>Test</p></b> <p>Test</p> test</p>`;
// const inputString = `
// <body>>
//   <xyz>
//   test
//   <test>
//   abc
// </body>`;
// const inputString = `<p test="1" xyz>Test test</p>`;
// const inputString = `<img src=test>`;
const {
  ANCHOR_START,
  ANCHOR_END,
  END_CHAR,
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
  USER_DEFINED_VOID_TAG,
  USER_DEFINED_VOID_TAG_END_CHAR,
} = require("./consts");

const {
  isAnchorStart,
  isTagStart,
  isTagEnd,
  isAttrStart,
  isAttrEnd,
  isValueStart,
  isValueEnd,
  isSep,
  isTagBodyStarting,
  isWithinQuotes,
  getValue,
  getAttr,
  createTextNode,
  createElementNode,
  isVoidTag,
  appendTextNode,
  appendElementNode,
} = require("./utils");

const UserVoidTagsMap = require("./userVoidTagsMap");

const USER_DEFINED_VOID_TAGS = new UserVoidTagsMap();

/**
 * Given an input string this function return AST generated from the passed input string which tries to closely represent the string in tree format
 * @param {String} inputString - input html string
 * @returns
 */
function parseHtml(inputString) {
  if (
    !inputString.match(
      /\<([a-z0-9\{\}\"\'\/\_\\\.\@\*\:\%\+\&\.\;\)\~\(\/\,\=\-\s])*\>/gi
    )
  ) {
    return [createTextNode(inputString)];
  }

  let tagName = "",
    data = {},
    children = [];

  let nodes = [];

  // context for state machine
  let state,
    stateStartIdx = 0,
    tempStateData,
    withinQuotes = false,
    quoteChar,
    contentStartIdx = 0,
    nestingIndentCount = 0,
    nestedTagName,
    isNestedTagVoid = false,
    nestedTagStartIdx,
    isTagVoid = false;

  //TODO: Move state related stuff to StateMachine class
  function resetState(currCharIdx) {
    stateStartIdx = currCharIdx + 1;
    contentStartIdx = currCharIdx + 1;
    state = undefined;
    tagName = "";
    data = {};
    children = [];
    nestingIndentCount = 0;
  }

  // main loop
  for (let currCharIdx = 0; currCharIdx < inputString.length; currCharIdx++) {
    const currChar = inputString[currCharIdx];

    if (
      state !== CONTENT &&
      state !== VALUE &&
      (currChar === "\r" || currChar === "\n")
    ) {
      // we don't care about new lines outside the content and value range
      continue;
    }

    if (isSep(state, currChar)) {
      continue;
    }

    if (isAnchorStart(state, currChar)) {
      state = ANCHOR_START;
      continue;
    }

    if (state === ANCHOR_START && currChar === END_CHAR) {
      state = END_CHAR;
      stateStartIdx = currCharIdx + 1;
      continue;
    }

    if (state === END_CHAR && currChar === ANCHOR_END) {
      const endingTagName = inputString.substring(
        stateStartIdx,
        currCharIdx
      );

      appendTextNode(
        nodes,
        inputString.substring(contentStartIdx, stateStartIdx - 2)
      );

      if (endingTagName === tagName && tagName === "") {
        resetState(currCharIdx);
        continue;
      }

      state = CONTENT;
      contentStartIdx = currCharIdx + 1;
      continue;
    }

    if (isTagStart(state, currChar)) {
      // add any text node before anchor tag
      const content = inputString.substring(contentStartIdx, currCharIdx - 1);
      appendTextNode(nodes, content);
      state = TAG;
      stateStartIdx = currCharIdx;
      continue;
    }

    if (isTagEnd(state, currChar)) {
      tagName = inputString.substring(stateStartIdx, currCharIdx).trim();
      isTagVoid = isVoidTag(tagName);
      USER_DEFINED_VOID_TAGS.delete(tagName);
      state = currChar === ANCHOR_END ? ANCHOR_END : SEP;
    }

    if (isTagBodyStarting(state, currChar, tagName)) {
      // dump any attr related data if exists
      if (state === VALUE && tempStateData !== undefined) {
        data[tempStateData] = getValue(
          inputString,
          stateStartIdx,
          currCharIdx,
          quoteChar
        );
      } else if (state === ATTR) {
        const tempAttrName = getAttr(inputString, stateStartIdx, currCharIdx);
        data[tempAttrName] = true;
      }

      if (isTagVoid) {
        nodes.push(createElementNode(tagName, data, []));
        resetState(currCharIdx);
        continue;
      }

      state = CONTENT;
      tempStateData = undefined;
      contentStartIdx = currChar === ANCHOR_END ? currCharIdx + 1 : currCharIdx;
      continue;
    }

    if (isAttrStart(state, currChar)) {
      state = ATTR;
      stateStartIdx = currCharIdx;
      continue;
    }

    if (isAttrEnd(state, currChar)) {
      const attrName = getAttr(inputString, stateStartIdx, currCharIdx);
      data[attrName] = true;
      tempStateData = attrName;
      state = currChar === ATTR_SEP ? ATTR_SEP : SEP;
      continue;
    }

    if (isValueStart(state, currChar)) {
      stateStartIdx = currCharIdx;
      state = VALUE;
      if (isWithinQuotes(currChar)) {
        withinQuotes = true;
        quoteChar = currChar;
      }
      continue;
    }

    if (isValueEnd(state, currChar, withinQuotes, quoteChar)) {
      data[tempStateData] = getValue(
        inputString,
        stateStartIdx,
        currCharIdx,
        quoteChar
      );
      state = currChar === ANCHOR_END ? ANCHOR_END : SEP;
      tempStateData = undefined; // reset attr context
      withinQuotes = false;
      quoteChar = undefined;
      continue;
    }

    if (
      (state === CONTENT || state === NESTED_TAG) &&
      currChar === ANCHOR_START
    ) {
      state = NESTED_ANCHOR_START;
      continue;
    }

    if (state === NESTED_ANCHOR_START && currChar === END_CHAR) {
      if (nestingIndentCount === 0) {
        const content = inputString.substring(contentStartIdx, currCharIdx - 1);
        appendElementNode(children, content, parseHtml);
      }
      state = NESTED_TAG_END;
      tempStateData = currCharIdx + 1;
      continue;
    }

    if (state === NESTED_TAG_END && currChar === ANCHOR_END) {
      const nestedTagEndName = inputString
        .substring(tempStateData, currCharIdx)
        .trim();

      nestingIndentCount -= 1;
      USER_DEFINED_VOID_TAGS.delete(nestedTagEndName);
      isNestedTagVoid = false;
      tempStateData = undefined;

      if (nestingIndentCount === 0) {
        const nestedContent = inputString.substring(
          stateStartIdx,
          currCharIdx + 1
        ); // +1 to include >
        appendElementNode(children, nestedContent, parseHtml);
        USER_DEFINED_VOID_TAGS.clear();
        nestingIndentCount = 0;
      }

      if (
        nestingIndentCount - USER_DEFINED_VOID_TAGS.size <= -1 &&
        nestedTagEndName === tagName
      ) {
        nodes.push(createElementNode(tagName, data, children));
        resetState(currCharIdx);
      } else {
        state = CONTENT;
      }
      contentStartIdx = currCharIdx + 1;
      continue;
    }

    if (state === NESTED_ATTR && isNestedTagVoid && currChar === ANCHOR_END) {
      nestingIndentCount -= 1;
      USER_DEFINED_VOID_TAGS.delete(nestedTagName);
      contentStartIdx = currCharIdx + 1;
      state = CONTENT;
      if (nestingIndentCount === 0) {
        const content = inputString.substring(stateStartIdx, currCharIdx + 1);
        appendElementNode(children, content, parseHtml);
      }

      if (nestingIndentCount === -1) {
        nodes.push(createElementNode(tagName, data, children));
        resetState(currCharIdx);
      }
      continue;
    }

    if (
      state === USER_DEFINED_VOID_TAG &&
      isNestedTagVoid &&
      currChar === ANCHOR_START
    ) {
      state = USER_DEFINED_VOID_TAG_END_CHAR;
      continue;
    }

    if (
      state === USER_DEFINED_VOID_TAG_END_CHAR &&
      isNestedTagVoid &&
      currChar === END_CHAR
    ) {
      tempStateData = currCharIdx + 1;
      state = USER_DEFINED_VOID_TAG_END_CHAR;
      continue;
    }

    if (
      state === USER_DEFINED_VOID_TAG_END_CHAR &&
      isNestedTagVoid &&
      currChar === ANCHOR_END
    ) {
      const endTag = inputString.substring(tempStateData, currCharIdx);
      USER_DEFINED_VOID_TAGS.delete(tagName);

      if (endTag === tagName) {
        const content = inputString.substring(stateStartIdx, currCharIdx + 1);
        nodes.push(
          createElementNode(tagName, data, [...children, ...parseHtml(content)])
        );
        // this branch is taken when we found closing of our main tag name, hence this means that current context node needs to be closed, so we reset all the state machine context here
        resetState(currCharIdx);
      } else {
        state = USER_DEFINED_VOID_TAG;
      }
      continue;
    }

    if (
      state === NESTED_ANCHOR_START &&
      currChar !== SEP &&
      currChar !== ANCHOR_START &&
      currChar !== ANCHOR_END &&
      currChar !== END_CHAR
    ) {
      if (nestingIndentCount === 0) {
        // only set start when outer tag starts, this handles cases like `<p><b>Test</b></p>` in such cases we need idx of first <
        stateStartIdx = currCharIdx - 1; // -1 to include anchor tag
        // save all the text seen till now
        const content = inputString.substring(contentStartIdx, currCharIdx - 1);
        if (content !== "") {
          children.push(createTextNode(content));
        }
      }
      nestedTagStartIdx = currCharIdx - 1; // -1 to include <
      state = NESTED_TAG;
      nestingIndentCount += 1;
      continue;
    } else if (state === NESTED_ANCHOR_START) {
      state = CONTENT;
      continue;
    }

    if (state === NESTED_TAG && (currChar === SEP || currChar === ANCHOR_END)) {
      nestedTagName = inputString
        .substring(nestedTagStartIdx + 1, currCharIdx)
        .trim();

      if (nestingIndentCount - 1 > 0 && !isVoidTag(nestedTagName)) {
        USER_DEFINED_VOID_TAGS.add(nestedTagName); // assume every tag is void, this will help maintain indent stack counter
      }

      isNestedTagVoid =
        isVoidTag(nestedTagName) || USER_DEFINED_VOID_TAGS.has(nestedTagName);

      if (!isNestedTagVoid) {
        continue;
      }

      if (
        currChar === ANCHOR_END &&
        !USER_DEFINED_VOID_TAGS.has(nestedTagName)
      ) {
        children.push(createElementNode(nestedTagName, {}, []));
        contentStartIdx = currCharIdx + 1;
        nestingIndentCount -= 1;
        state = CONTENT;
      } else {
        if (
          USER_DEFINED_VOID_TAGS.has(nestedTagName) &&
          currChar === ANCHOR_END
        ) {
          state = USER_DEFINED_VOID_TAG;
          continue;
        }
        nestingIndentCount += 1;
        state = NESTED_ATTR;
      }
    }
  }

  if (state === NESTED_TAG || state === USER_DEFINED_VOID_TAG) {
    // this likely means inputString only contains nested tags
    const content = inputString.substring(stateStartIdx);
    appendElementNode(children, content, parseHtml);
  } else if (state === CONTENT) {
    // this means we only have content inside input string, dump content as text node
    const content = inputString.slice(contentStartIdx);
    if (content !== "") {
      children.push(createTextNode(content));
    }
  }

  if (tagName !== "") {
    nodes.push(createElementNode(tagName, data, children));
  }

  if (
    state === undefined &&
    contentStartIdx &&
    inputString.substring(contentStartIdx) !== ""
  ) {
    nodes.push(createTextNode(inputString.substring(contentStartIdx)));
  }

  return nodes;
}

module.exports = parseHtml;
