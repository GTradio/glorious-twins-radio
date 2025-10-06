import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "eslint:recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended"
  ),
  ...compat.env({
    browser: true,
    es2021: true,
  }),
  ...compat.config({
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
    },
    plugins: [
      "react",
      "@typescript-eslint",
      "import",
      "jsx-a11y",
      "react-hooks"
    ],
    rules: {
      "react/require-default-props": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      "react/prop-types": "off",
      "prettier/prettier": [
        "warn",
        {
          "endOfLine": "auto"
        }
      ],
      "react/react-in-jsx-scope": "off",
      "no-param-reassign": 0,
      "react/jsx-props-no-spreading": "off",
      "react/jsx-no-target-blank": "off",
      "react/no-unknown-property": [
        "off",
        {
          "ignore": [
            "args",
            "attach"
          ]
        }
      ],
      "react/jsx-filename-extension": [
        1,
        {
          "extensions": [
            ".js",
            ".jsx",
            ".tsx",
            ".ts"
          ]
        }
      ],
      "react/function-component-definition": [
        2,
        {
          "namedComponents": "arrow-function",
          "unnamedComponents": "arrow-function"
        }
      ]
    }
  })
];

export default eslintConfig;