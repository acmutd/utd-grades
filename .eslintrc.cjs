/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "jest"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
    "plugin:jest/recommended",
  ],
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off", // typescript isn't smart enough to never need this
    "@typescript-eslint/no-floating-promises": [
      "error",
      {
        ignoreIIFE: true, // need this for stuff like async onClick handlers
      },
    ],
    "@typescript-eslint/restrict-template-expressions": "off", // this one is just annoying, you can use non-strings in templates without issue
  },
};
