const path = require('path');
const merge = require('webpack-merge')
module.exports = {
  lintOnSave: false,
  pages: {
    index: {
      // page 的入口
      entry: "doc/main.ts",
      // 模板来源
      template: "public/index.html",
      // 输出文件名
      filename: "index.html"
    }
  },
};