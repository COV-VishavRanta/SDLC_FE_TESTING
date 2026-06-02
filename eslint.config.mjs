import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * Custom ESLint rules from eslint-config-js-ts (adapted for flat config)
 * The original package uses legacy config format and has outdated rule names,
 * so we include the rules directly here with corrected names for @typescript-eslint v8+
 */

// JavaScript rules (applies to all JS/TS files)
const jsRules = {
  camelcase: ['error', { ignoreImports: true }],
  curly: ['error', 'multi-line'],
  'default-case': ['error', { commentPattern: '^no default$' }],
  'default-param-last': 'error',
  eqeqeq: 'error',
  'no-multi-assign': 'error',
  'no-console': 'off',
  'no-use-before-define': 'error',
  'no-eval': 'error',
  'no-alert': 'warn',
  'no-useless-concat': 'error',
  'no-useless-rename': 'error',
  'no-implied-eval': 'error',
  'no-loop-func': 'error',
  'no-await-in-loop': 'error',
  'no-constructor-return': 'error',
  'no-duplicate-imports': ['error', { includeExports: true }],
  'no-new-native-nonconstructor': 'error',
  'no-promise-executor-return': 'error',
  'no-self-compare': 'error',
  'no-unmodified-loop-condition': 'error',
  'no-unreachable-loop': 'error',
  'no-unused-private-class-members': 'error',
  'prefer-exponentiation-operator': 'error',
  'prefer-const': 'error',
  'require-await': 'error',
  'symbol-description': 'error',
  yoda: ['error', 'never'],
  'vars-on-top': 'error',
  'prefer-spread': 'error',
  'prefer-rest-params': 'error',
  'prefer-promise-reject-errors': 'error',
  'prefer-destructuring': 'error',
  'prefer-arrow-callback': 'error',
  'operator-assignment': 'error',
  'no-void': 'error',
  'no-useless-return': 'error',
  'no-unneeded-ternary': 'error',
  'no-undefined': 'off',
  'no-undef-init': 'error',
  'no-var': 'error',
  'no-useless-constructor': 'error',
};

// TypeScript-specific rules (applies to .ts/.tsx files)
const tsRules = {
  '@typescript-eslint/prefer-for-of': 'error',
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  'no-empty-function': 'off',
  '@typescript-eslint/no-empty-function': 'error',
  '@typescript-eslint/array-type': 'error',
  '@typescript-eslint/no-confusing-non-null-assertion': 'error',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/prefer-nullish-coalescing': 'error',
  '@typescript-eslint/prefer-optional-chain': 'error',
  '@typescript-eslint/unified-signatures': 'error',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  '@typescript-eslint/no-unused-vars': 'error',
  // Renamed from no-useless-template-literals in @typescript-eslint v8
  '@typescript-eslint/no-unnecessary-template-expression': 'error',
  'no-throw-literal': 'off',
  '@typescript-eslint/only-throw-error': 'error',
  '@typescript-eslint/no-dynamic-delete': 'error',
  '@typescript-eslint/no-array-delete': 'error',
  '@typescript-eslint/no-confusing-void-expression': 'off',
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/no-meaningless-void-operator': 'error',
  '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
  '@typescript-eslint/no-unnecessary-condition': 'off',
  '@typescript-eslint/no-mixed-enums': 'error',
  'no-magic-numbers': 'off',
  '@typescript-eslint/no-magic-numbers': 'off',
  '@typescript-eslint/no-unsafe-unary-minus': 'error',
  '@typescript-eslint/require-array-sort-compare': 'error',
  '@typescript-eslint/no-useless-empty-export': 'error',
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // JavaScript rules for all files
  {
    rules: jsRules,
  },
  // TypeScript-specific rules (only for .ts/.tsx files)
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    rules: tsRules,
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
