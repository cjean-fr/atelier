import { noReactImports } from './rules/no-react-imports';
import { noReactHooks } from './rules/no-react-hooks';
import { noUnsafeEventHandlers } from './rules/no-unsafe-event-handlers';
import { noJavascriptUrls } from './rules/no-javascript-urls';
import { noContext } from './rules/no-context';
import { noRefs } from './rules/no-refs';

const rules = {
  'no-react-imports': noReactImports,
  'no-react-hooks': noReactHooks,
  'no-unsafe-event-handlers': noUnsafeEventHandlers,
  'no-javascript-urls': noJavascriptUrls,
  'no-context': noContext,
  'no-refs': noRefs,
};

const plugin: any = {
  rules,
};

const configs = {
  recommended: {
    plugins: {
      '@cjean-fr/jsx-string': plugin,
    },
    rules: {
      '@cjean-fr/jsx-string/no-react-imports': 'error',
      '@cjean-fr/jsx-string/no-react-hooks': 'error',
      '@cjean-fr/jsx-string/no-unsafe-event-handlers': 'warn',
      '@cjean-fr/jsx-string/no-javascript-urls': 'error',
      '@cjean-fr/jsx-string/no-context': 'error',
      '@cjean-fr/jsx-string/no-refs': 'error',
    },
  },
};

plugin.configs = configs;

export default plugin;
