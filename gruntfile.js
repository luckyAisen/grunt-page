// Grunt 的入口文件
// 用于定义一些需要Grunt自动执行的任务
// 需要导出一个函数
// 此函数接收一个grunt的形参，内部提供一些创建任务时可以用到的API

const loadGruntTasks = require("load-grunt-tasks");
const sass = require("sass");
module.exports = (grunt) => {
  loadGruntTasks(grunt);
  grunt.initConfig({
    clean: {
      // main: ["dist", "temp"],
      dist: "dist",
      temp: "temp",
    },
    sass: {
      options: {
        /**
         * style 参数说明
         * 编译后的css代码的格式有以下几种方式：
         * 嵌套输出方式 nested
         * 展开输出方式 expanded
         * 紧凑输出方式 compact
         * 压缩输出方式 compressed
         */
        style: "expanded",
        // implementation 使用什么标准来编译scss
        implementation: sass,
      },
      server: {
        opations: {
          // 是否开启 sourceMap,在开发环境建议开启sourceMap
          sourceMap: true,
        },
        //需要处理的文件，可支持多个文件
        files: {
          // 生产文件:目标文件
          "temp/assets/styles/main.css": "src/assets/styles/main.scss",
        },
      },
    },
    babel: {
      options: {
        //使用什么标准来编译js的代码
        presets: ["@babel/preset-env"],
      },
      serve: {
        options: {
          //是否开启sourceMap，在开发环境建议开启
          sourceMap: true,
        },
        //需要处理的文件，可支持多个文件
        files: {
          // 生产文件:目标文件
          "temp/assets/scripts/main.js": "src/assets/scripts/main.js",
        },
      },
    },
  });
};
