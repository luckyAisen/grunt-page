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
      dist: "dist",
      temp: "temp",
      html: "temp/*.html",
      css: "temp/assets/styles/*",
      js: "temp/assets/scripts/*",
      images: "temp/assets/images",
      fonts: "temp/assets/fonts",
      ico: "temp/favicon.ico",
    },
    copy: {
      server: {
        files: [
          {
            expand: true,
            cwd: "src", //需要处理的文件（input）所在的目录。
            src: ["**/*.html"], ////表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
            dest: "temp", //表示处理后的文件名或所在目录。
          },
        ],
      },
      build: {
        files: [
          {
            expand: true,
            cwd: "temp",
            src: ["**/*"],
            dest: "dist",
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
      server: {
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
      temp: {
        options: {
          optimizationLevel: 1, //定义 PNG 图片优化水平
        },
        files: [
          {
            expand: true,
            cwd: "src/assets/images/", //原图存放的文件夹
            src: ["**/*.{png,jpg,jpeg,gif,svg}"], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
            dest: "temp/assets/images", // 优化后的图片保存位置，覆盖旧图片，并且不作提示
          },
          {
            expand: true,
            cwd: "src/assets/fonts/", //原图存放的文件夹
            src: ["**/*"], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
            dest: "temp/assets/fonts", // 优化后的图片保存位置，覆盖旧图片，并且不作提示
          },
          {
            expand: true,
            cwd: "public/", //原图存放的文件夹
            src: ["**/*"], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
            dest: "temp/", // 优化后的图片保存位置，覆盖旧图片，并且不作提示
          },
        ],
      },
    },
    browserSync: {
      dev: {
        options: {
          watchTask: true,
          notify: false, //是否开启通知
          port: 6060, //启动的端口，如果不设置，默认是3000端口
          files: [
            "src/**/*.html",
            "src/assets/styles/*",
            "src/assets/scripts/*",
            "src/assets/images/*",
            "src/assets/fonts/*",
            "public/*",
          ],
          server: {
            baseDir: ["temp", "src", "public"], // 监听多个目录
            routes: {
              // 前置路由，设置了路由后，会去找项目目录中指定的文件夹
              "/node_modules": "node_modules",
            },
          },
        },
      },
    },
    watch: {
      html: {
        files: ["src/*.html", "src/**/*.html"],
        tasks: ["clean:html", "copy:server"],
      },
      css: {
        files: ["src/assets/styles/*"],
        tasks: ["clean:css", "sass:server"],
      },
      js: {
        files: ["src/assets/scripts/*"],
        tasks: ["clean:js", "babel:server"],
      },
      otherFile: {
        files: ["src/assets/images/*", "src/assets/fonts/*", "public/*"],
        tasks: ["clean:images", "clean:fonts", "imagemin:temp"],
      },
    },
    useref: {
      html: "dist/**/*.html",
      temp: "dist",
    },
    concat: {
      options: {
        separator: ";",
      },
      js: {
        src: [
          "node_modules/jquery/dist/jquery.js",
          "node_modules/popper.js/dist/umd/popper.js",
          "node_modules/bootstrap/dist/js/bootstrap.js",
        ],
        dest: "dist/assets/scripts/vendor.js",
      },
      css: {
        src: ["node_modules/bootstrap/dist/css/bootstrap.css"],
        dest: "dist/assets/styles/vendor.css",
      },
    },
    htmlmin: {
      build: {
        options: {
          removeComments: true, //移除注释
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyJS: true,
          minifyCSS: true,
        },
        files: [
          {
            expand: true,
            cwd: "dist", //需要处理的文件（input）所在的目录。
            src: ["**/*.html"], //表示需要处理的文件。如果采用数组形式，数组的每一项就是一个文件名，可以使用通配符。
            dest: "dist/", //表示处理后的文件名或所在目录。
          },
        ],
      },
    },
    css_clean: {
      build: {
        files: [
          {
            expand: true,
            cwd: "dist",
            src: ["assets/styles/**/*.css"],
            dest: "dist",
          },
        ],
      },
    },
    uglify: {
      options: {
        mangle: true, //混淆变量名
        comments: "false", //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
      },
      build: {
        files: [
          {
            expand: true,
            cwd: "dist", //js目录下
            src: ["assets/scripts/*.js"], //所有js文件
            dest: "dist", //输出到此目录下
          },
        ],
      },
    },
  });

  grunt.registerTask("complie", ["copy:server", "sass:server", "babel:server"]);

  grunt.registerTask("develop", "启动web服务器", [
    "clean",
    "complie",
    "browserSync",
    "watch",
  ]);

  grunt.registerTask("build", [
    "clean",
    "complie",
    "imagemin",
    "copy",
    "concat",
    "useref",
    "htmlmin",
    "css_clean",
    "uglify",
  ]);
};
