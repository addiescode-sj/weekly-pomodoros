module.exports = {
  presets: [
    "@babel/preset-env",
    [
      "@babel/preset-react",
      {
        runtime: "automatic", // React 자동 import 설정
      },
    ],
    "@babel/preset-typescript",
  ],
};
