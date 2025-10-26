class Token {
  name = undefined;
  char = undefined;

  constructor(name, char = "") {
    this.name = name;
    this.char = char;
  }

  toString() {
    return this.name;
  }
};

const ANCHOR_START = new Token("ANCHOR_START", "<");
const ANCHOR_END = new Token("ANCHOR_END", ">");
const END_CHAR = new Token("END_CHAR", "/");
const TAG = new Token("TAG");
const ATTR = new Token("ATTR");
const VALUE = new Token("VALUE");
const CONTENT = new Token("CONTENT");
const ATTR_SEP = new Token("ATTR_SEP", "=");
const SEP = new Token("SEP", " ");
const DOUBLE_QUOTE = new Token("DOUBLE_QUOTE", '"');
const SINGLE_QUOTE = new Token("SINGLE_QUOTE", "'");

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

module.exports = {
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
  VOID_TAGS,
  TEXT_NODE,
  ELEMENT_NODE
};