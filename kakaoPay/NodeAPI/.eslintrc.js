// .eslintrc.js
module.exports = {
  root: true,
  plugins: ["prettier"],
  extends: ["eslint:recommended", "prettier", "airbnb-base", "plugin:prettier/recommended"],
  env: {
    node: true,
    es6: true,
  },
  rules: {
      "import/newline-after-import": "off",
      "camelcase": "off",
      "no-unused-vars": "warn"
  },
  ignorePatterns: ["node_modules/", ".eslintrc.js"],
};