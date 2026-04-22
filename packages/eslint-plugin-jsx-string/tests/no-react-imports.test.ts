import { RuleTester } from '@typescript-eslint/rule-tester';
import * as parser from '@typescript-eslint/parser';
import { noReactImports } from '../src/rules/no-react-imports';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
});



// Since bun:test doesn't directly support ruleTester.run, we can wrap it or just use it if it works with Vitest-like APIs.
// However, RuleTester usually expects a global 'describe' and 'it' if using Jest.
// For Bun, we might need a little bridge or just use the rule logic directly for simple tests.

ruleTester.run('no-react-imports', noReactImports, {
  valid: [
    'import { renderToString } from "@cjean-fr/jsx-string";',
    'import fs from "fs";',
  ],
  invalid: [
    {
      code: 'import React from "react";',
      errors: [{ messageId: 'noReactImport' }],
    },
    {
      code: 'import { useState } from "react";',
      errors: [{ messageId: 'noReactImport' }],
    },
    {
      code: 'import ReactDOM from "react-dom";',
      errors: [{ messageId: 'noReactImport' }],
    },
  ],
});

