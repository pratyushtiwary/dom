const parseHtml = require("./lexer");

const inputString = `test <body><xyz>Test</xyz><test><xyz><abc>test<xyz>1</xyz></body>test<a>1</a>`;
console.log("Input:", inputString)
console.log("Output:\n", JSON.stringify(parseHtml(inputString), null, 4));