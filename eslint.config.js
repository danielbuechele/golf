import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/extensions': ['error', 'ignorePackages', {
        'js': 'always',
        'ts': 'never'
      }]
    },
    settings: {
      'import/resolver': {
        typescript: {}
      }
    }
  }
);