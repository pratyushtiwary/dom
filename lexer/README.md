# HTML Lexer

This module is responsible to generate AST from a input string. This AST is then used by `buildTree`(this method is yet to be implemented) to build a dom tree using `ElementNode` objects which would give user the ability to query tree using CSS selectors.

## 10000 ft Overview

The lexer is implemented inside `index.js`. It contains a state machine which maintains context regarding the surrounding texts, this is helpful to understand where a tag begins and ends.

## TODOs

- Addition of unit tests,
- Decouple if/else logic,
- Replace if/else with switch statements,
- Bugs, there are ton of bugs because html spec is very **flexible** and allows user to do lot of things which might not be handled correctly right now by the lexer.