const parseHtml = require("./lexer");
const fs = require("fs");

// const filePath = "tests/integration/input.html";
// const inputString = fs.readFileSync(filePath, "utf-8");
// const inputString = `<ul>
//           <li><a href="../index.html">main page</a></li>
//           <li><a href= "http://www.unicode.org/versions/Unicode4.0.0/ch06.pdf" title="Writing Systems and Punctuation" type="application/pdf" >Unicode Standard, chapter&nbsp;6</a></li>
//         </ul>`;
// const inputString = `<p><xyz src="https://example.com" disabled width=200>pqr <abc> test</p>`;
// const inputString = `<html lang="en">
// <head>
// 	<meta charset="UTF-8">
// 	<meta name="viewport" content="width=device-width, initial-scale=1.0">
// 	<title>Test Simple</title>
// test</head>
// </html>`;
const inputString = `
          <tbody>
            <tr><th scope="row">Denmark</th> <td> 43,070 </td><td> 42,370</td></tr>
            <tr><th scope="row">Finland</th> <td>337,030 </td><td>305,470</td></tr>
            <tr><th scope="row">Iceland</th> <td>103,000 </td><td>100,250</td></tr>
            <tr><th scope="row">Norway</th>  <td>324,220 </td><td>307,860</td></tr>
            <tr><th scope="row">Sweden</th>  <td>449,964 </td><td>410,928</td></tr>
          </tbody>`;
// parseHtml(inputString);
// console.log("Input:", inputString)
fs.writeFileSync(
  "./test.json",
  JSON.stringify(parseHtml(inputString), null, 4),
  {
    encoding: "utf-8",
  }
);
