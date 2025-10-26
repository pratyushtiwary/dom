import { expect, describe, it } from "vitest";
import parseHtml from "../../lexer/index";
import fs from "fs";
import path from "path";


describe("Integration test", () => {
	const currentDir = __dirname;
	it("should correctly parse input html file", () => {
		const inputHtml = fs.readFileSync(path.join(currentDir, "input.html"), "utf-8");

		expect(parseHtml(inputHtml)).toMatchSnapshot();
	});
})