# 使用 grunt 进行项目的开发和打包

## 目标

使用 grunt 提供一个在项目的开发过程中需要的服务器，要求实现热更新的功能，在项目开发完成后，编译压缩合拼文件，通过命令的方式帮助我们自动完成编译构建。

## 说明

文档中使用到的模板是这个：[grunt-page](https://github.com/Aisen60/grunt-page)

文件夹结构

```
└── grunt-page ······································· 项目根目录
   ├─ public ········································· 静态文件夹
   │  └─ favicon.ico ·································
   ├─ src ············································ 源文件夹
   │  ├─ assets ······································ assets 文件夹
   │  │  ├─ fonts ···································· 字体文件夹
   │  │  │  └─ pages.eot ·····························
   │  │  │  └─ pages.svg ·····························
   │  │  │  └─ pages.ttf ·····························
   │  │  │  └─ pages.woff ····························
   │  │  ├─ images ··································· 图片文件夹
   │  │  │  └─ brands.svg ····························
   │  │  │  └─ logo.png ······························
   │  │  ├─ scripts ·································· 脚本文件夹
   │  │  │  └─ main.js ·······························
   │  │  └─ styles ··································· 样式文件夹
   │  │     ├─ _icons.scss ···························
   │  │     ├─ _variables.scss ·······················
   │  │     └─ main.scss ·····························
   │  ├─ about.html ··································
   │  └─ index.html ··································
   ├─ .gitignore ····································· git忽略文件
   ├─ README.md ······································ 项目说明文件
   ├─ gruntfile.js ··································· grunt 任务文件
   ├─ package.json ··································· package file
   └─ yarn.lock ······································ yarn 锁定文件
```

## grunt 是什么？

grunt 是一个前端自动化构建工具，可以帮我们完成很多重复性的工作，例如压缩、编译、单元测试等等。grunt 本身不具备任何的打包编译功能，它只是一个任务工具，通过配置文件编写任务的形式，并且通过相关的插件帮助我们完成压缩、编译、单元测试等等之类的打包构建任务。

## 安装 grunt

克隆[模板](https://github.com/Aisen60/grunt-page)到本地，执行`yarn install`安装项目运行所需要的依赖。安装完依赖后，我们来安装 grunt。执行`yarn add grunt --dev`，安装完后，在项目根目录下新建一个`gruntfile.js`文件，这个 js 文件是 grunt 的入口文件和配置文件，用于定义一些 grunt 自动执行的任务，通过编写任务的方式完成来帮助我们完成构建任务。

`gruntfile.js`需要导出一个函数，此函数接收一个 grunt 的形参，内部提供了创建任务时所需要用到的 api。

```javascript
// Grunt 的入口文件
// 用于定义一些需要Grunt自动执行的任务
// 需要导出一个函数
// 此函数接收一个grunt的形参，内部提供一些创建任务时可以用到的API
module.exports = (grunt) => {};
```

## 安装 load-grunt-tasks

完成了 grunt 的安装之后，我们需要安装一个名字叫做`load-grunt-tasks`的包，这个包主要的作用是自动加载 grunt 插件中的任务。

前面我们也说到了，grunt 它没有打包构建的能力，它只是一个任务工具，打包构建都是使用 grunt 相关的插件去完成的。

输入`yarn add load-grunt-tasks --dev`安装这个插件。

安装完成后，我们需要在 gruntfile.js 中引入这个插件，并且在调用执行它，让它自动加载 grunt 插件中的任务。

```javascript
const loadGruntTasks = require("load-grunt-tasks");
module.exports = (grunt) => {
  loadGruntTasks(grunt);
};
```

接下来，我们开始来编写构建任务。

## 编写 clean 任务

我们先编写一个清除目录的任务，这个任务会在后面的启动开发服务器任务和构建任务中使用到。

`clean` 这个任务需要使用到一个名字叫做`grunt-contrib-clean`的插件。输入命令安装这个插件：`yarn add grunt-contrib-clean --dev`

安装完成后，我们在`grunt.initConfig`多目标任务中配置一下 clean 这个任务的选项参数，我们需要给 clean 任务的定义多个目标，一个是 dist 目标，一个是 temp 目标，分别清除根目录下的 dist 和 temp 文件夹。

```javascript
const loadGruntTasks = require("load-grunt-tasks");
module.exports = (grunt) => {
  loadGruntTasks(grunt);
  grunt.initConfig({
    clean: {
      // main: ["dist", "temp"],
      dist: "dist",
      temp: "temp",
    },
  });
};
```

设置完成后，为了验证 clean 任务是否成功，我们在根目录下新建 dist 和 temp 文件夹，新建成功后，在命令行终端输入 `yarn grunt clean` 执行 clean 任务，执行完 clean 这个任务后，根目录下的 dist 和 temp 文件夹会被清除。

## 编写 sass 任务，将 scss 编译成可供浏览器执行的代码。

接下来，我们在编写一个处理 scss 文件的任务，我们需要将 scss 编程成可供浏览器执行的 css 代码。需要安装两个包，分别是`grunt-sass`和`sass`。输入命令安装这两个插件：`yarn add grunt-sass sass --dev`。安装这两个包的时间会比较久，涉及到一些二进制的编码，可以换成 cnpm 安装，速度相对会快很多。

安装完后，我们需要在 gruntfile.js 中引入 sass 这个包，并且在`grunt.initConfig`多目标任务中配置一下 sass 这个任务的选项参数，代码如下：

```patch
+ const sass = require("sass");
+ sass: {
+   options: {
+     /**
+       * style 参数说明
+       * 编译后的css代码的格式有以下几种方式：
+       * 嵌套输出方式 nested
+       * 展开输出方式 expanded
+       * 紧凑输出方式 compact
+       * 压缩输出方式 compressed
+       */
+     style: "expanded",
+     // implementation 使用什么标准来编译scss
+     implementation: sass,
+   },
+   server: {
+     opations: {
+       // 是否开启 sourceMap,在开发环境建议开启sourceMap
+       sourceMap: true,
+     },
+     //需要处理的文件，可支持多个文件
+     files: {
+       // 生产文件:目标文件
+       "temp/assets/styles/main.css": "src/assets/styles/main.scss",
+     }
+   }
+ }
```

编写完任务之后，我们在命令行终端输入 `yarn grunt sass` 来执行一下这个任务，任务执行完毕过后，我们可以看到根目录下多出了一个 `temp` 的文件夹，我们打开到`temp`下的`assets`文件夹下的`styles`文件夹，这里面有两个文件，分别是`main.css`和`main.css.map`,我们打开`main.css`，可以看到 scss 已经变成了 css 了。但是，怎么少了`_icons.scss`、`_variables.scss`这两个文件呢？这两个文件是没有被编译吗？其实，不是的，因为这两个文件都是以下划线开头的（\_），在 scss 中标识是被引入的文件，所以这两个文件一同编译进了`main.css`文件中了。

## 编写 babel 任务，将 js、es6 等新特性编译可供浏览器执行的代码

我们在编写 js 中，可能会使用到一些 es 的新特性，现在的浏览器还不能很好的支持 es 新特性，我们需要把 js 的代码编译 es5，这样就可供浏览器执行了。

我们需要安装 `grunt-babel` 、`@babel/core` 、`@babel/preset-env`这 3 个插件，在命令行终端输入`yarn add grunt-babel @babel/core @babel/preset-env --dev`。

安装完成后，需要在`grunt.initConfig`中编写一些配置。代码如下，包括了参数说明：

```patch
+ babel: {
+   options: {
+     //使用什么标准来编译js的代码
+     presets: ["@babel/preset-env"],
+   },
+   serve: {
+     options: {
+       //是否开启sourceMap，在开发环境建议开启
+       sourceMap: true,
+     },
+     //需要处理的文件，可支持多个文件
+     files: {
+       // 生产文件:目标文件
+       "temp/assets/scripts/main.js": "src/assets/scripts/main.js",
+     }
+   }
+ }
```

编写完这个任务后，我们在终端输入命令执行这个任务`yarn grunt babel`。执行完后，我们打开temp目录下的assets目录下的script目录下的main.js文件，可以看到，原本在src文件夹下的main.js文件中的`const`关键词被替换成了`var`

未完待续~