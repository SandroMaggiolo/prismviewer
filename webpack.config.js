const path = require("path")

module.exports = {
  entry: path.resolve(__dirname, "src/prism.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "prism.js",
    library: "prism",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  mode: "development",
}