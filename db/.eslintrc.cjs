/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["../.eslintrc.cjs"],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
};
