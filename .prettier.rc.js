module.exports = {
  singleQuote: true,
  semi: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 80,
  bracketSpacing: true,
  endOfLine: "lf",
  arrowParens: "avoid",
  importOrder: [
    "^@utils/(.*)$",
    "^@api/(.*)$",
    "^@hooks/(.*)$",
    "^@app/(.*)$",
    "^@components/(.*)$",
    "^@styles/(.*)$",
    "^[./]",
  ],
  plugins: ["prettier-plugin-tailwindcss"],
};
