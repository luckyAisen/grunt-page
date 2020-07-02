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
    copy: {
      serve: {
        files: [
          {
            expand: true,
            cwd: "src", //需要处理的文件（input）所在的目录。
            src: ["**/*.html"], ////表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
            dest: "temp", //表示处理后的文件名或所在目录。
          },
        ],
      },
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
    imagemin: {
      main: {
        options: {
          optimizationLevel: 1, //定义 PNG 图片优化水平
        },
        files: [
          {
            expand: true,
            cwd: "src/assets/images/", //原文件存放的文件夹
            src: ["**/*.{png,jpg,jpeg,gif,svg}"], //  images 目录下所有 png/jpg/jpeg/gif图片
            dest: "temp/assets/images", // 保存位置
          },
          {
            expand: true,
            cwd: "src/assets/fonts/", //原文件存放的文件夹
            src: ["**/*"], //  fonts 目录下所有 字体文件
            dest: "temp/assets/fonts", // 保存位置
          },
          {
            expand: true,
            cwd: "public/", // 原文件存放的文件夹
            src: ["**/*"], // public 目录下所有 字体文件
            dest: "temp/", // 保存位置
          },
        ],
      },
    },
    browserSync: {
      dev: {
        options: {
          // watchTask: true,
          notify: false, //是否开启通知
          port: 6060, //启动的端口，如果不设置，默认是3000端口
          // files: [
          //   "src/**/*.html",
          //   "src/assets/styles/*",
          //   "src/assets/scripts/*",
          //   "src/assets/images/*",
          //   "src/assets/fonts/*",
          //   "public/*",
          // ],
          server: {
            baseDir: ["temp"], // 监听多个目录
            // routes: {
            //   // 前置路由，设置了路由后，会去找项目目录中指定的文件夹
            //   "/node_modules": "node_modules",
            // },
          },
        },
      },
    },
  });

  grunt.registerTask("develop", "启动web服务器", [
    "clean",
    "copy:serve",
    "sass",
    "browserSync",
  ]);
};
