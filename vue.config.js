module.exports = {
  css: {
    extract: false,
  },
  configureWebpack: {
    mode: "production",
    output: {
      filename: "uranus-game-chat.js",
    },
    optimization: {
      splitChunks: false,
    },
  },
};
