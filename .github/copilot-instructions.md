We always write typescript code using single quotes and spaces instead of tabs. When your responses include this type of code, please follow these conventions.

Code with multiple "if" conditions or related code blocks must always place each statement on a new line e.g. `}\nelse {` instead of `} else {`. This applies to try/catch and other similar code blocks requiring multiple related, but separate statements.

We write typescript code with semicolons. Responses including code should use semicolons where appropriate. Additionally, we use trailing commas when destructuring or defining an object literal.

Typescript code should avoid unnecessary new lines within a function body. These new lines are typically inserted to provide better readability, but are unnecessary for us and we prefer a more compact flow.

When writing typescript, we discourage using `any` in favor of providing explicit types or using `unknown` and a type assertion. When responses include code with ts types, please try to use appropriate types or document why `any` was used if it's necessary.

The first command when executing command line operations MUST BE `nvm use` so that the correct NodeJS version is active in the shell environment. This includes the binaries "npm" or "npx" e.g. `nvm use && npm test`. The `nvm use` command can be excluded if a command is determined to have no relation to the node environment.
