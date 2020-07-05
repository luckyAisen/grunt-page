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

```diff
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

```diff
+ babel: {
+   options: {
+     //使用什么标准来编译js的代码
+     presets: ["@babel/preset-env"],
+   },
+   server: {
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

```diff
+ copy: {
+   server: {
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

编写完任务后，我们执行一下这个任务：`yarn grunt copy:server` 。执行完后，我们在 temp 文件夹下可以看到，src 目录下的 index.html 和 about.html 已经拷贝到 temp 目录下了。

## 处理图片、字体、以及其他类型文件

最后一步，我们来编写图片、字体、以及其他类型文件的任务。需要使用到一个叫做`grunt-contirb-imagemin`的插件。在命令终端输入`yarn add grunt-contirb-imagemin --dev`来安装这个插件,yarn 安装这个插件可能会比较慢，可以使用 cnpm 安装。安装完后，我们开始编写任务，代码如下：

```diff
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

开始之前，我们先执行一下`yarn clean`任务，删除 temp 文件夹和 dist 文件夹。

我们需要启动一个服务帮我们把页面渲染出来，需要安装一个插件，叫做[grunt-browser-sync](http://www.browsersync.cn/docs/grunt/)。在命令终端输入`yarn add grunt-browser-sync --dev`。安装完成过后，我们需要在`grunt.initConfig`多目标任务中配置一下这个 browserSync 任务，代码如下：

```diff
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

编写完任务后，在启动这个服务器之前啊，我们需要先执行以下 copy 任务，因为我们的定义服务器的监听的目录（baseDir）是 temp 文件夹，在浏览器终端依次输入 `yarn grunt copy 和`yarn grunt browserSync`，之后，系统会使用系统默认浏览器开打一个本地 6060 端口的页面，如下：

<img alt="https://user-images.githubusercontent.com/19791710/86249864-6d5c7400-bbe2-11ea-89a6-efbc4cc6b5da.png" src="https://user-images.githubusercontent.com/19791710/86249864-6d5c7400-bbe2-11ea-89a6-efbc4cc6b5da.png">

但是，你会发现页面没有任何的样式，我们打开到 temp 目录下的 index.html 文件，看到引入样式文件，一个是 node_modules 包的 bootstrap.css，一个是 assets/styles 下的 main.css。main.css 在 temp 下都没有，我们第一步在解决 main.css 这个问题。那这个问题很简单，我们可以在任务启动的时候，执行一下我们在基础任务中的编写的 sass 这个任务。

那要咋做呢？我们可以在编写一个 develop 任务，这个任务就是 sass 任务和 browserSync 任务组合，我们可以使用 grunt 提供的一个叫做`registerTask`的 api 定义一个任务。这个 api 有 3 个参数，第一个是任务的名称，第二个任务是任务的说明，第三个参数是执行体。如果第二个参数不是字符串，是个数组或者函数的话，那么会被视为任务的执行体。

代码如下：

```diff
+ grunt.registerTask("develop", "启动web服务器", [
+   "clean",
+   "copy:server",
+   "sass:server",
+   "babel:server",
+   "browserSync",
+ ]);
```

我们需要在启动这个服务器时先清除 temp 这个目录，然后执行 copy 这个多任务中的 server 任务，将 src 下的所有 html 文件拷贝到 temp 目录下，再接着去处理 sass 的编译，最后启动服务器。

我们执行 develop 这个任务，他会自动启动一个服务器，我们看到 temp 文件夹下已经生成了 main.css 文件了，我们再次打开页面来看看。你会发现还是一样啊，没有什么变化，我们打开 F12，切换到 Network 下的 css，发现 main.css 已经加载进来了。

现在剩下的要解决的是，node_module 包的引用问题。我们要使用到 browserSync 这个插件的另外一个选项，叫做 routes，前置路由的配置，把 html 中使用到的 node_module 映射到根目录下的 node_module。

代码如下：

```diff
browserSync: {
  dev: {
    options: {
      notify: false, //是否开启通知
      port: 6060, //启动的端口，如果不设置，默认是3000端口
      server: {
        baseDir: ["temp"], // 监听的目录
+       routes: {
+         // 前置路由，设置了路由后，会去找项目目录中指定的文件夹
+         "/node_modules": "node_modules",
+       },
      }
    }
  }
}
```

然后，我们重新执行以下 develop 任务。打开浏览器，你会发现页面的样式已经是正常了的，打开到控制台我们来看，bootstrap.css 也被加载进来了。

我们在检查一下其他页面的样式或者图片是否显示正确，我们打开到 about 页面，发现图片和网站的 ico 没有加载进来，因为 temp 文件夹下根本就没有图片。我们可以把图片也打包进来当执行了 develop 的时候。但是，没有太大的必要，因为在开发阶段，不需要把什么文件都打包进来，所以我们可以通过监听多个目录来实现这个功能。修改一下 baseDir 的监听目录就可以了

```diff
browserSync: {
  dev: {
    options: {
      notify: false, //是否开启通知
      port: 6060, //启动的端口，如果不设置，默认是3000端口
      server: {
-       baseDir: ["temp"], // 监听的目录
+       baseDir: ["temp","src","public"], // 监听的目录
        routes: {
         // 前置路由，设置了路由后，会去找项目目录中指定的文件夹
         "/node_modules": "node_modules",
        },
      }
    }
  }
}
```

这样，我们的一个完整的开发服务器就配置完了，接下来要实现热更新的功能。

## 实现热更新

要实现热更新的功能，需要安装一个插件，叫做`grunt-contrib-watch`，我们在终端输入`yarn add grunt-contrib-watch --dev`来安装一下这个插件，实现热更新要和 browser-sync 插件一起使用。

第一步，我们需要在 browserSync 任务中启动`watchTask`是否启动监听

```diff
browserSync: {
  dev: {
    options: {
+     watchTask: true,
      notify: false, //是否开启通知
      port: 6060, //启动的端口，如果不设置，默认是3000端口
      server: {
        baseDir: ["temp","src","public"], // 监听的目录
        routes: {
         // 前置路由，设置了路由后，会去找项目目录中指定的文件夹
         "/node_modules": "node_modules",
        },
      }
    }
  }
}
```

第二步，我们需要在`grunt.initConfig`中编写一些 watch 监听任务和添加几个 clean 任务

```diff
clean: {
  dist: "dist",
  temp: "temp",
+  html: "temp/*.html",
+  css: "temp/assets/styles/*",
+  js: "temp/assets/scripts/*",
+  images: "temp/assets/images",
+  fonts: "temp/assets/fonts",
+  ico: "temp/favicon.ico",
}

+ watch: {
+   html: {
+     files: ["src/*.html", "src/**/*.html"],
+     tasks: ["clean:html", "copy:server"],
+   },
+   css: {
+     files: ["src/assets/styles/*"],
+     tasks: ["clean:css", "sass:server"],
+   },
+   js: {
+     files: ["src/assets/scripts/*"],
+     tasks: ["clean:js", "babel:server"],
+   },
+   otherFile: {
+     files: ["src/assets/images/*", "src/assets/fonts/*", "public/*"],
+     tasks: ["clean:images", "clean:fonts", "imagemin:temp"],
+   },
+ },
```

**watch 中，我们添加了 html、css、js、otherFile 这几个任务，意思是，监听指定的目录文件，当文件发生改变时，触发指定的任务。并且修改了 develop 这个任务，添加了 watch 任务，这个 watch 任务一定要放到最后在执行。**

编写完任务后，我们在命令行终端重新执启动一下服务器，`yarn grunt develop`。

![https://user-images.githubusercontent.com/19791710/86508614-01615200-be14-11ea-84c6-49cb797b1c29.png](https://user-images.githubusercontent.com/19791710/86508614-01615200-be14-11ea-84c6-49cb797b1c29.png)

当服务器启动完后，我们修改一下 header 的名称，修改完后，切换到浏览器，我们无需刷新，就可以看到已经修改了。

![image](https://user-images.githubusercontent.com/19791710/86508656-65841600-be14-11ea-9f8d-0b27d3468665.png)

# 上线时的打包编译

最后，我们来编写项目上线时要做的文件合拼、文件压缩等。

## 编写多一个 copy 任务，将 temp 下的所有内容拷贝到 dist

```diff
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
+  build: {
+    files: [
+      {
+        expand: true,
+        cwd: "temp",
+        src: ["**/*"],
+        dest: "dist",
+      },
+    ],
+  },
},
```

编写完 copy 任务后，我们执行一下，`yarn grunt copy:build`任务。执行完后，dist 文件夹是已经存在了，并且把 temp 文件夹下的内容都已经拷贝过来了。

## 合拼文件

合拼文件所需要用到的有两个插件，一个是`grunt-useref`，一个是`grunt-contrib-concat`。我们先来安装一下这两个插件。`yarn add grunt-useref grunt-contrib-concat --dev`

grunt-useref 这个插件的作用呢，主要是把图一的编译成图二的，如下图

图一：

![image](https://user-images.githubusercontent.com/19791710/86509494-ee05b500-be1a-11ea-9bbb-d0910181bbeb.png)

图二：

![image](https://user-images.githubusercontent.com/19791710/86509517-142b5500-be1b-11ea-9fbd-7556cdc533ad.png)

而 grunt-contrib-concat 是将 jquery、popper、bootstrap 这三个 js 文件合拼成一个 vendor.js 文件

我们来编写以下这两个任务：

```diff
+ useref: {
+   html: "dist/**/*.html",
+   temp: "dist",
+ },


+ concat: {
+   options: {
+     separator: ";",
+   },
+   js: {
+     src: [
+       "node_modules/jquery/dist/jquery.js",
+       "node_modules/popper.js/dist/umd/popper.js",
+       "node_modules/bootstrap/dist/js/bootstrap.js",
+     ],
+     dest: "dist/assets/scripts/vendor.js",
+   },
+   css: {
+     src: ["node_modules/bootstrap/dist/css/bootstrap.css"],
+     dest: "dist/assets/styles/vendor.css",
+   },
+ },
```

编写完任务后，我们一个一个来执行，先执行 useref 这个任务，执行完后，打开 dist 文件夹下的 index.html 文件，我们能发现，已经从图一变成图二的了。

在执行一下 concat 这个任务，执行后，你会发现 dist 文件夹下多了 vendor.js 和 vendor.css 文件，我们打开看看，vendor.js 文件已经是 jquery、popper、bootstrap 这 3 个库的合拼了，vendor.css 已经把 bootstrap 合拼进来了。

## 压缩 html 文件

压缩 html 文件需要用到的插件是`grunt-contrib-htmlmin`，我们执行命令输入`yarn add grunt-contrib-htmlmin --dev`。编写压缩 html 任务

```diff
+ htmlmin: {
+   build: {
+     options: {
+       removeComments: true, //移除注释
+       collapseWhitespace: true,//折叠文档，去除多余空格
+       conservativeCollapse: true,//设置成一行
+       minifyJS: true,//缩小脚本元素和事件属性中的JavaScript
+       minifyCSS: true,//缩小样式元素和样式属性中的CSS
+     },
+     files: [
+       {
+         expand: true,
+         cwd: "dist", //需要处理的文件（input）所在的目录。
+         src: ["**/*.html"], //表示需要处理的文件。如果采用数组形式，数组的每一项+ 就是一个文件名，可以使用通配符。
+         dest: "dist/", //表示处理后的文件名或所在目录。
+       },
+     ],
+   },
+ },
```

编写完任务后，我们来执行当前这个任务，`yarn grunt htmlmin`，执行完后，我们打开 dist 文件夹下的 index.html 文件和 about.html 文件，我们发现已经被压缩成了一行。

那接下来的工作就是压缩 css 和 js 了。

## 压缩 css

压缩 css 要使用到一个插件，叫做`grunt-css-clean` 我们来安装一下，`yarn add grunt-css-clean --dev`

安装完后，我们来编写任务：

```diff
+ css_clean: {
+   build: {
+     files: [
+       {
+         expand: true,
+         cwd: "dist",
+         src: ["assets/styles/**/*.css"],
+         dest: "dist",
+       },
+     ],
+   },
+ },
```

编写完后，我们执行这个任务，`yarn grunt css_clean`，执行完过后，我们重新看一下 dist 文件夹下的 css 文件，我们打开，发现已经编译压缩好了。

## 压缩 js

压缩 js 要使用到一个插件，叫做`grunt-contrib-uglify` 我们来安装一下，`yarn add grunt-contrib-uglify --dev`

安装完后，我们来编写任务：

```diff
+ // 压缩js
+ uglify: {
+   options: {
+     mangle: true, //混淆变量名
+     comments: "false", //false（删除全部注释），some（保留@preserve @license @cc_on等注释）
+   },
+   build: {
+     files: [
+       {
+         expand: true,
+         cwd: "temp", //js目录下
+         src: ["assets/scripts/*.js"], //所有js文件
+         dest: "dist/assets/scripts", //输出到此目录下
+       },
+     ],
+   },
+ },
```

编写完成后,我们执行一下 uglify 这个命令，`yarn grunt uglify` 执行完后，我们看到 dist 文件夹下的 js 文件都已经是压缩好了的。

那至此，我们需要把上面几个的任务组合成一个任务，来完成最后的工作。

## 整合任务

```diff
+ grunt.registerTask("complie", ["copy:server", "sass:server", "babel:server"]);
+
+ grunt.registerTask("develop", "启动web服务器", [
+   "clean",
+   "complie",
+   "browserSync",
+   "watch",
+ ]);
+
+ grunt.registerTask("build", [
+   "clean",
+   "complie",
+   "imagemin",
+   "copy",
+   "concat",
+   "useref",
+   "htmlmin",
+   "css_clean",
+   "uglify",
+ ]);
```

package.json 文件添加下面 script 命令

```json
"scripts": {
  "clean": "grunt clean",
  "serve": "grunt develop",
  "build": "grunt build"
},
```

