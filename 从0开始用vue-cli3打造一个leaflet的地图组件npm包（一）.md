## 介绍  

使用过leaflet的小伙伴应该都觉得他非常好用 但同时也非常麻烦 因为需要安装许多我们想使用的对应插件 并且都没有官方的中文文档 只能靠着 有道快译 等软件去翻译 可能有时候运气好能碰到大佬翻译过的文章 所以我打算使用vue-cli3从零开始 打造一个属于我们的 leaflet的地图组件包 将leaflet的各种插件功能集成到一起 做到开箱即用  

第一篇 会大体简单的写一下如何配置如何上传npm包

---

## 第一步 我们先来创建一个vue项目用来做我们的npm包开发

### 1.1 创建vue项目 做准备工作
>使用vue create 来创建项目 创建项目部分不做过多介绍了 相信来看这篇文章的小伙伴都应该会创建 我采用的配置有ts和router 因为考虑到虽然做npm包以来 但是我还想做到 在项目里进行测试和展示 进行让小伙伴们更好的观看效果 所以用到了router  
创建后的目录为

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e672ec5744d9445fba3ec47e25bf34e7~tplv-k3u1fbpfcp-zoom-1.image)  
### 1.2 更改vue目录结构  
> 首先我将src改名成为了doc 作为以后调用组件测试和展示组件的项目  
然后创建一个vue.config.js文件 进行对应的配置 将entry入口更改为doc文件夹下

```
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
```  
>然后运行一下项目没问题  

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c5e1cbecaead4756b9caa4a9ca2f2e92~tplv-k3u1fbpfcp-zoom-1.image)  

> 第一部分的准备工作完成 开始接下来的任务 doc文件夹作为我们将来测试组件和展示组件的项目 文件夹

---

## 第二步 开始编写我们npm的内容  

### 2.1 开始编写npm包

> 接下开创建一个packages文件夹 作为我们npm编写组件的文件夹  
在packages文件夹中创建一个test文件夹 作为我们的测试文件夹 来进行一下简单的测试使用  
test 文件夹中 我创建了一个index.ts文件和src文件夹 index.ts用来配置注册组件及暴露出去 src为我们的内容文件夹  
在src文件夹中我创建了一个index.vue做为我们编写组件的地方  

### 2.2 写一个简单的demo 作为测试使用
```
// 写了一个简单的demo 作为测试使用
<template>
	<div class="test">
		test component
	</div>
</template>
<script>
export default {
	name: "test",
	options: {
		name: "test",
	},
	created() {
		console.log("created,测试我们的test组件");
	},
};
</script>
<style>
.test {
	color: red;
}
</style>
```
### 2.3 暴露组件  
> 接下来在test文件夹下创建的index.ts文件里编写我们的代码 在index.ts中获取我们src的代码 然后注册为一个组件并暴露出去

```
import test from "./src/index.vue";

/* istanbul ignore next */
(test as any).install = function(Vue: any) {
	Vue.component(test.name, test);
};

export default test;

```

### 2.4 当前目录结构  

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdfecf835cac4d5baba34ce49baa9d2b~tplv-k3u1fbpfcp-zoom-1.image)  

---

## 第三步 配置全局注册组件

### 3.1 编写全局注册文件 

> 此时虽然我们编写了一个简单的demo 组件 但是还是不能掀起任何波澜 甚至还会有报错 但是我们稍安勿躁 接下来的一步比较关键 在packages文件下创建一个index.ts 用来获取我们编写的组件 并且导出

```
// 导入单个组件
import test from './test'

// 以数组的结构保存组件，便于遍历
const components = [test];

// 定义 install 方法
const install:any = function (Vue:any) {
  if (install.installed)return;
  install.installed = true;
  // 遍历并注册全局组件
  components.map(component => {
    // Vue.component(component.name, component);
    Vue.use(component)
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  // 导出的对象必须具备一个 install 方法
  install,
  // 组件列表
  ...components
};
```

### 3.2 完成全局编写组件 
>大功告成! 接下来要做的就是在项目中先进行测试

---
## 第四步 在项目中进行测试  

### 4.1 在项目中进行测试我们的组件是否可以正常运行 引用组件

> 我们可以去我们的doc文件夹下获取一下我们刚编写的test组件是否ok 是否可以正常使用 首先要做的就是在doc/main.ts引入 我们刚编写的组件 

```
import Vue from "vue";
import App from "./App.vue";

import test from "../packages/index"; //引入组件
Vue.use(test); //进行注册

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount("#app");
```

### 4.2 在项目中使用刚刚编写的test组件  

>因为main中进行了全局注册 所以直接使用组件名即可

```
<template>
	<div id="app">
		<div id="nav">
			test
			<test></test>
		</div>
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
```
### 4.3 检查页面  

> 引入完成后我们看一下页面是否是正确的效果  

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1499bd705c954ccabeaeee9041dae5ad~tplv-k3u1fbpfcp-zoom-1.image)  

>ok 样式 输出都有存在一个没少 接下来就是打包成npm包发布到npm上 供他人使用  

---

## 第五步 配置打包  

### 5.1配置打包命令

> 为了区分打包 我们将我们的packages文件夹打包成lib  
在package.json的scripts新增一条lib命令

```
    "lib": "vue-cli-service build --target lib --name test --dest lib packages/index.ts"
    // 该命令 指定了打包哪一个文件夹和名字
```

### 5.2 配置读取路径main  

> 打包配置完成后 就需要配置打包读取的路径了 还是在package.json中更改 更改package.json的main修改成我们打包后的js

```
 "main": "lib/test.umd.min.js",
```
### 5.3 全部配置

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/990bb473e95c4972bcf72d61f297f474~tplv-k3u1fbpfcp-zoom-1.image)  

### 5.4 开始打包
> 配置完成后 我们直接使用 yarn lib 或 npm run lib就可以打包成npm包了 让我们来运行一下打包命令  

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fa7b041f77d426ca648f3cc790e720f~tplv-k3u1fbpfcp-zoom-1.image)  

> ok 打包成功  打包成功后会在目录下多出一个lib文件夹 该文件夹就是我们的npm包 接下来就是要把他上传到npm上供大家使用了  

--- 

## 第六步上传到npm  

### 6.1 安装nrm 管理 npm

> 接下来就要上传到 npm 了 首先我们需要 下载一个nrm插件来管理我们的npm

```
// 使用命令全局安装 nrm
npm install -g nrm  
```  

### 6.2 简单的nrm命令  

```
nrm ls // 查看我们npm列表
nrm use // 切换源
```
### 6.3 切换到npm源  

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0290a58de61a46ea8b5c17c19dcf8d2f~tplv-k3u1fbpfcp-zoom-1.image)  

> 首先我们用nrm ls查看一下我们当前所在的源 星号为当前所在源 当前我们在taobao源 我们使用nrm use npm 切换到 npm源  

```
nrm use npm
```

> 这时我们再查看列表就可以看到npm前面带星号了 证明我们切换成功了  

---  

## 第七步 登陆npm源 及上传注意事项

### 7.1 登陆

>切换到 npm源后 我们就可以用npm login命令进行登陆了 登陆成功后就可以我们的上传操作 npm publish 但是在我们登陆后上传前还有一些需要注意的地方

### 7.2 注意事项

>  1.需要注意一下 package.json里的"private"属性 如果是私有需要把它设置为false  
   2.每次上传都需要更改版本号 只有版本号不同 才可以上传成功  
   3.需要注意命名不要和其他人冲突 如果想要指定下载地址 需要在包前面加@符  
   4.可以创建一个.npmignore文件过滤掉不想上传的文件  
   
### 7.3 npm publish  上传
 > 好了做了这么多终于可以上传了 来让我们使用一下npm publish 直接上传即可  
 
 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efb3ea84ef784fe78fb0eb56fa35bd89~tplv-k3u1fbpfcp-zoom-1.image)  
 
 > ok顺利上传 来让我们去 npm上看一下我们的包是否存在 
 
 ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9268ed857ca64065993e004c938bd3b4~tplv-k3u1fbpfcp-zoom-1.image)  
 
 ---
 
 ## 第八步 下载使用 
 
 ### 8.1 开始下载
 
 > ok 折腾了这么久 终于大功告成 在其他项目中下载测试一下 直接npm install lf-map-npm  
 
 ### 8.2 引入使用  
 > ok 到了这里基本上已经大功告成了 来让我们在其他项目中引入 在其他项目的main.js中引入我们的组件和组件的css和注册  
 
 ```
 import lfMapNpm from 'lf-map-npm' // 引入组件
 import 'lf-map-npm/lib/test.css'  // 引入组件css
 Vue.use(lfMapNpm)                 // 注册使用  
 ```
 
 > 在项目中想用的地方直接使用 为了方便这里在App.vue中直接使用了  
 
 ```
 <template>
	<div id="app">
		<test></test>
	</div>
</template>

<script>
export default {
	name: "App",
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
 ```  
 
 ### 8.3 成功～
 > 终于到了本次最激动人心的部分了 来让我们怀着紧张的心情查看一下页面   
 
 ![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3948dafb977f44c1a1a61ee7bf5123f8~tplv-k3u1fbpfcp-zoom-1.image)  
 
 > okok 成功没得问题打印样式都在 
 
 ---
 
 ## 总结  
 
 >ok 到了这里第一篇就结束了 本文讲述了如何用vue编写一个npm包的方式及上传
 其实非常简单 主要用到的命令是  
 1.nrm ls 查看npm列表  
 2.nrm use 切换npm源  
 3.npm login 登陆npm  
 4.npm publish 上传到npm  
 还有就是修改文件夹及配置  
 我们第一步已经迈出接下来就要开始 来基于leaflet来集成一个开箱即用的npm包  
 
```! 
 转载需标明出处及授权
```
---

## npm地址
[npm地址](https://www.npmjs.com/package/lf-map-npm)  
[https://www.npmjs.com/package/lf-map-npm](https://www.npmjs.com/package/lf-map-npm)
```
https://www.npmjs.com/package/lf-map-npm
```
---
## github地址  
> 配置部分我放在了lib分支下 如有需求请到lib分支下载  
[github地址](https://github.com/dzc980812/lf-map/tree/lib)  
[https://github.com/dzc980812/lf-map/tree/lib](https://github.com/dzc980812/lf-map/tree/lib)  
```
https://github.com/dzc980812/lf-map/tree/lib
```
---
## 掘金地址
[从0开始用vue-cli3打造一个leaflet的地图组件npm包（一）](https://juejin.im/post/6857062204722642951)
[https://juejin.im/post/6857062204722642951](https://juejin.im/post/6857062204722642951)
```
https://juejin.im/post/6857062204722642951
```

[从0开始用vue-cli3+ts打造一个leaflet+supermap的地图组件npm包（二）构建一个基础地图](https://juejin.im/post/6857686524797026312)  
[https://juejin.im/post/6857686524797026312](https://juejin.im/post/6857686524797026312)  
```
https://juejin.im/post/6857686524797026312
```

---

##### 希望对各位小伙伴有所帮助 欢迎各位 来一起讨论 共同成长 指出不足
---



```！
如需转载请标明出处 或 获得授权
```
