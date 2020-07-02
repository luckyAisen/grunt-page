# 使用 grunt 进行项目的开发和打包

## 目标

使用 grunt 提供一个在项目的开发过程中需要的服务器，要求实现热更新的功能，在项目开发完成后，编译压缩合拼文件，通过命令的方式帮助我们自动完成编译构建。

## 说明

文档中使用到的模板是这个：[aisen60-pages](https://github.com/Aisen60/aisen60-pages)

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

# grunt 是什么？

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

# 编写基础任务

编写基础的任务的目标是，是为了后面搭建开发服务器和上线打包构建做准备。

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

## 处理 scss，编写 sass 任务，将 scss 编译成可供浏览器执行的代码。

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

## 处理 js，编写 babel 任务，将 js、es6 等新特性编译可供浏览器执行的代码

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

编写完这个任务后，我们在终端输入命令执行这个任务`yarn grunt babel`。执行完后，我们打开 temp 目录下的 assets 目录下的 script 目录下的 main.js 文件，可以看到，原本在 src 文件夹下的 main.js 文件中的`const`关键词被替换成了`var`

## 处理 html，编写 copy 任务

接下来，我们需要处理 html，我们使用`grunt-contrib-copy`这个插件，将 src 目录下的 html 文件拷贝到 temp 文件夹下。在命令行终端输入：`yarn add grunt-contrib-copy --dev`来安装这个插件。安装完成过后啊，我们需要编写相关的任务，代码如下：

```patch
+ copy: {
+   serve: {
+     files: [
+       {
+         expand: true,
+         cwd: "src", //需要处理的文件（input）所在的目录。
+         src: ["**/*.html"], ////表示需要处理的文件。如果采用数组形式，数组+ 的每一项就是一个文件名，可以使用通配符。
+         dest: "temp", //表示处理后的文件名或所在目录。
+       }
+     ]
+   }
+ },
```

编写完任务后，我们执行一下这个任务：`yarn grunt copy:serve` 。执行完后，我们在 temp 文件夹下可以看到，src 目录下的 index.html 和 about.html 已经拷贝到 temp 目录下了。

## 处理图片、字体、以及其他类型文件

最后一步，我们来编写图片、字体、以及其他类型文件的任务。需要使用到一个叫做`grunt-contirb-imagemin`的插件。在命令终端输入`yarn add grunt-contirb-imagemin --dev`来安装这个插件,yarn 安装这个插件可能会比较慢，可以使用 cnpm 安装。安装完后，我们开始编写任务，代码如下：

```patch
+ imagemin: {
+   main: {
+     options: {
+       optimizationLevel: 1, //定义 PNG 图片优化水平
+     },
+     files: [
+       {
+         expand: true,
+         cwd: "src/assets/images/", //原文件存放的文件夹
+         src: ["**/*.{png,jpg,jpeg,gif,svg}"], //  images 目录下所有 png/jpg/jpeg/gif图片
+         dest: "temp/assets/images", // 保存位置
+       },
+       {
+         expand: true,
+         cwd: "src/assets/fonts/", //原文件存放的文件夹
+         src: ["**/*"], //  fonts 目录下所有 字体文件
+         dest: "temp/assets/fonts", // 保存位置
+       },
+       {
+         expand: true,
+         cwd: "public/", // 原文件存放的文件夹
+         src: ["**/*"], // public 目录下所有 字体文件
+         dest: "temp/", // 保存位置
+       }
+     ]
+   }
+ }
```

编写完任务后，我们在命令行终端输入：`yarn grunt imagemin` 执行这个任务，执行完这个任务后，我们可以看到，temp 目录下已经有了相对应的图片文件、字体文件等，这是高保真的压缩，在不影响文件的情况下压缩文件的大小。

至此，我们所有的基础任务已经编写完了。

# 搭建开发服务器，并且实现热更新

## 安装 grunt-browser-sync 插件

开始之前，我们先执行一下`yarn clean`任务，删除temp文件夹和dist文件夹。

我们需要启动一个服务帮我们把页面渲染出来，需要安装一个插件，叫做[grunt-browser-sync](http://www.browsersync.cn/docs/grunt/)。在命令终端输入`yarn add grunt-browser-sync --dev`。安装完成过后，我们需要在`grunt.initConfig`多目标任务中配置一下这个 browserSync 任务，代码如下：

```patch
+ browserSync: {
+   dev: {
+     options: {
+       notify: false, //是否开启通知
+       port: 6060, //启动的端口，如果不设置，默认是3000端口
+       server: {
+         baseDir: ["temp"], // 监听的目录
+       }
+     }
+   }
+ }
```
编写完任务后，在启动这个服务器之前啊，我们需要先执行以下copy任务，因为我们的定义服务器的监听的目录（baseDir）是temp文件夹，在浏览器终端依次输入 `yarn grunt copy 和 `yarn grunt browserSync`，之后，系统会使用系统默认浏览器开打一个本地6060端口的页面，如下：

<img alt="https://user-images.githubusercontent.com/19791710/86249864-6d5c7400-bbe2-11ea-89a6-efbc4cc6b5da.png" src="https://user-images.githubusercontent.com/19791710/86249864-6d5c7400-bbe2-11ea-89a6-efbc4cc6b5da.png">

但是，你会发现页面没有任何的样式，我们打开到temp目录下的index.html文件，看到引入样式文件，一个是node_modules包的bootstrap.css，一个是assets/styles下的main.css。main.css在temp下都没有，我们第一步在解决main.css 这个问题。那这个问题很简单，我们可以在任务启动的时候，执行一下我们在基础任务中的编写的sass这个任务。

那要咋做呢？我们可以在编写一个develop任务，这个任务就是sass任务和browserSync任务组合，我们可以使用grunt提供的一个叫做`registerTask`的api定义一个任务。这个api有3个参数，第一个是任务的名称，第二个任务是任务的说明，第三个参数是执行体。如果第二个参数不是字符串，是个数组或者函数的话，那么会被视为任务的执行体。

代码如下：

```patch
+ grunt.registerTask("develop", "启动web服务器", [
+   "clean",
+		"copy:serve",
+   "sass",
+   "browserSync",
+ ]);
```

我们需要在启动这个服务器时先清除temp这个目录，然后执行copy这个多任务中的serve任务，将src下的所有html文件拷贝到temp目录下，再接着去处理sass的编译，最后启动服务器。

我们执行develop这个任务，他会自动启动一个服务器，

