/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["../.eslintrc.cjs", "next/core-web-vitals"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
