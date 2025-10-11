const ANCHOR_START = "<";
const ANCHOR_END = ">";
const END_CHAR = "/";
const TAG = "TAG";
const ATTR = "ATTR";
const VALUE = "VALUE";
const CONTENT = "CONTENT";
const NESTED = "NESTED"; // this is intentionally not exported, as it is used by other CONST and doesn't have any other usage
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
const USER_DEFINED_VOID_TAG = "USER_DEFINED_VOID_TAG";
const USER_DEFINED_VOID_TAG_END_CHAR = USER_DEFINED_VOID_TAG + END_CHAR;

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

module.exports = {
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
  DOUBLE_QUOTE,
  SINGLE_QUOTE,
  TEXT_NODE,
  ELEMENT_NODE,
  USER_DEFINED_VOID_TAG,
  USER_DEFINED_VOID_TAG_END_CHAR,
  VOID_TAGS
};