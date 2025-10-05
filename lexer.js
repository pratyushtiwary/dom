// TODO: Handle user added void tags
const inputString = `<html lang="en"><head><meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"></head> <body><xyz xyz>test</body></html>`;
// const inputString = `<p test="1 2" disabled=true abc xyz>Test < <p><b>Test</b></p> <meta xyz>test</p>`;
// const inputString = `<p test="1 2" disabled=true abc xyz>Test < <p><b>Test</b></p> <meta xyz>test</p>`;
// const inputString = `<p test="1 2" disabled=true abc xyz>Test < <b test xyz="test"><p>Test</p></b> <p>Test</p> test</p>`;
// const inputString = `
// <body>
//   <xyz>
//   test
//   <test>
//   abc
// </body>`;
// const inputString = `<p test="1" xyz>Test test</p>`;
// const inputString = `<img src=test>`;

// TOKENs
const ANCHOR_START = "<";
const ANCHOR_END = ">";
const END_CHAR = "/";
const TAG = "TAG";
const ATTR = "ATTR";
const VALUE = "VALUE";
const CONTENT = "CONTENT";
const NESTED = "NESTED";
const NESTED_TAG = NESTED + TAG;
const NESTED_TAG_END = NESTED_TAG + END_CHAR;
const NESTED_ANCHOR_START = NESTED + ANCHOR_START;
const NESTED_ATTR = NESTED + ATTR;
const ATTR_SEP = "=";
const SEP = " ";
const DOUBLE_QUOTE = '"';
const SINGLE_QUOTE = "'";
const TEXT_NODE = "TEXT";
const ELEMENT_NODE = "ELEMENT";

const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

// composables
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

function parseSingleHtmlString(inputString) {
  let tagName,
    data = {},
    children = [];

  // context for state machine
  let state,
    stateStartIdx = 0,
    tempStateData,
    withinQuotes = false,
    quoteChar,
    contentStartIdx,
    nestingIndentCount = 0,
    nestedTagName,
    isNestedTagVoid = false,
    nestedTagStartIdx;

  // main loop
  for (let currCharIdx = 0; currCharIdx < inputString.length; currCharIdx++) {
    const currChar = inputString[currCharIdx];

    if (isSep(state, currChar)) {
      continue;
    }

    if (isAnchorStart(state, currChar)) {
      state = ANCHOR_START;
      continue;
    }

    if (isTagStart(state, currChar)) {
      state = TAG;
      stateStartIdx = currCharIdx;
      continue;
    }

    if (isTagEnd(state, currChar)) {
      tagName = inputString.slice(stateStartIdx, currCharIdx);
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
        const content = inputString.slice(contentStartIdx, currCharIdx - 1);
        children.push(createTextNode(content));
      }
      state = NESTED_TAG_END;
      continue;
    }

    if (state === NESTED_TAG_END && currChar === ANCHOR_END) {
      nestingIndentCount -= 1;
      if (nestingIndentCount === 0) {
        const nestedContent = inputString.slice(stateStartIdx, currCharIdx + 1); // +1 to include >
        children.push(parseSingleHtmlString(nestedContent));
        contentStartIdx = currCharIdx + 1;
      }
      state = CONTENT;
      continue;
    }

    if (state === NESTED_ATTR && isNestedTagVoid && currChar === ANCHOR_END) {
      nestingIndentCount -= 1;
      contentStartIdx = currCharIdx + 1;
      state = CONTENT;
      if (nestingIndentCount === 0) {
        children.push(
          parseSingleHtmlString(inputString.slice(stateStartIdx, currCharIdx + 1))
        );
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
        const content = inputString.slice(contentStartIdx, currCharIdx - 1);
        children.push(createTextNode(content));
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
      nestedTagName = inputString.slice(nestedTagStartIdx + 1, currCharIdx);
      isNestedTagVoid = isVoidTag(nestedTagName);
      
      if (!isNestedTagVoid) {
        continue;
      }
      
      if (currChar === ANCHOR_END) {
        children.push(createElementNode(nestedTagName, {}, []));
        contentStartIdx = currCharIdx + 1;
        nestingIndentCount -= 1;
        state = CONTENT;
      } else {
        state = NESTED_ATTR;
      }
    }
  }

  return createElementNode(tagName, data, children);
}

const parsedNode = parseSingleHtmlString(inputString);

console.log(JSON.stringify(parsedNode, null, 4));
