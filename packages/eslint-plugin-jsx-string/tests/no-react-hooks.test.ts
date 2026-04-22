import { RuleTester } from '@typescript-eslint/rule-tester';
import * as parser from '@typescript-eslint/parser';
import { noReactHooks } from '../src/rules/no-react-hooks';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
});

ruleTester.run('no-react-hooks', noReactHooks, {
  valid: [
    'const data = fetchData();',
    'function MyComp() { return null; }',
  ],
  invalid: [
    {
      code: 'const [state, setState] = useState(0);',
      errors: [{ messageId: 'useState' }],
    },
    {
      code: 'useEffect(() => {}, []);',
      errors: [{ messageId: 'useEffect' }],
    },

    {
      code: 'const ref = useRef();',
      errors: [{ messageId: 'noHook', data: { name: 'useRef' } }],
    },
  ],
});
