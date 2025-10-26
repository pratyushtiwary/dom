import { expect, describe, it } from "vitest";
import { removeQuotes } from "../../lexer/utils";

describe("removeQuotes", () => {
	it.each([
		{
			"input": "\"Hello world\"",
			"output": "Hello world",
			"quoteChar": "\"",
		},
		{
			"input": "'Hello world'",
			"output": "Hello world",
			"quoteChar": "'",
		},
		{
			"input": "'Hello 'world",
			"output": "Hello 'world",
			"quoteChar": "'",
		},
		{
			"input": "\"Hello \"world",
			"output": "Hello \"world",
			"quoteChar": "\"",
		},
		{
			"input": "Hello 'world'",
			"output": "Hello 'world",
			"quoteChar": "'",
		},
		{
			"input": "Hello \"world\"",
			"output": "Hello \"world",
			"quoteChar": "\"",
		},
		{
			"input": "Hello world",
			"output": "Hello world",
			"quoteChar": "\"",
		},
		{
			"input": "'Hello world'",
			"output": "Hello world",
		},
		{
			"input": "\"Hello world\"",
			"output": "Hello world",
		},
		{
			"input": "\"Hello world\"",
			"output": "\"Hello world\"",
			"quoteChar": "'"
		},
		{
			"input": "'Hello world'",
			"output": "'Hello world'",
			"quoteChar": "\""
		}
	])("should correct remove quotes", ({input, output, quoteChar}) => {
		expect(removeQuotes(input, quoteChar)).toBe(output)
	});
});