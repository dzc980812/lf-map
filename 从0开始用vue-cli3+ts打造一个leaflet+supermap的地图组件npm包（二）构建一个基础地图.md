## 介绍
> 第一篇中我们简单的做了一个demo测试 并打成npm包上传到了 npm官网 其他项目中也可直接使用，接下来我们要做的就是把leaflet集成supermap mapbox等各种功能后，打成npm包供他人使用 

---

### leaflet 介绍  

> leaflet是一个开源的js地图库所以它本身只有地图组件并不提供地图内容 它非常的轻量而且很强大能渲染市面上的大部分地图 如百度地图 高德地图 谷歌地图 supermap mapbox 天地图 或者图片地图 这些是要基于其他地图尝试的图床去进行渲染的 比如supermap ArcGIS等 leaflet有一些较为基础的功能的api 如渲染地图 简单的点位等如果需要做一些热力图 什么的 我们还是需要下载其他的依赖 在我开发的过程中 非常的影响进度 大部分时间都在寻找合适的插件 和适配的一些问题 我们的目标就是 完成一个只需要简单配置使用对应组件和传送对应参数即可渲染的目的 现在就让我们带着这些期待开始 把它变成一个开箱即用的npm包！

---

## 1.整理项目文件夹
### 1.1 整理项目目录
> 在上一篇中我们创建了一个test文件夹作为测试使用 现在他已经没有了它的作用我们可以将它删除 然后创建一个lMap文件夹 或者直接给test文件夹改名成lMap 用来作为地图组件存放的地方 目前整体结构跟昨天依旧一样  

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b31a9d3eb0744c5e9bf50c8bce144f43~tplv-k3u1fbpfcp-zoom-1.image)  

### 1.2 准备构造地图 文件夹
>创建完lMap文件夹后 接下来我们就要开始编写渲染我们地图的代码了 为了方便查看 结构清晰 我们在src文件夹下创建一个map文件夹 我们将编写的地图的代码放在src/map文件夹下 以后这个文件夹下还会有 点位 圆形 矩形 热力图等更多地图功能的代码 并且因为我使用了ts所以还要作出一些相对应的配置 所以在src下创建了types文件夹用来存放.d.ts文件 在src文件夹下创建了一个_abstract文件夹用来存放一些函数的抽象 ts定义的规则 此时的目录结构   

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7b0e41f3753e4260b6417ac80023985e~tplv-k3u1fbpfcp-zoom-1.image)

---

## 2.开始打造地图组件  

### 2.1 安装leaflet插件
> 文件夹已经摆好 主要的文件也已经创建 接下来就让我们开始编写地图组件 首先安装leaflet插件 由于我们用到的是supermap的云GIS网络开发客户端所以还要安装supermap/iclient-leaflet插件 mapbox不需要安装依赖

```
yarn add leaflet; //安装leaflet
yarn add @supermap/iclient-leaflet // 安装supermap引擎
```

### 2.2 开始准备着手开发

> 安装完成后 我们就可以开始开发我们的地图组件了 首先在map文件夹下的map.ts 引入 这里需要注意 需要把leaflet的css也跟着引入进去 不然会引起地图样式混乱

```
// 引入leaflet
import L from "leaflet";
// leaflet CSS 不引入会混乱
import "leaflet/dist/leaflet.css";
// supermap引擎
import "@supermap/iclient-leaflet";
```  

---

## 3.开始开发地图组件  

### 3.1 编写地图组件的模版 -> lMap/src/index.vue
> 因为打算开发npm包 所以我创建了两个开发的地方 一个是用来 进行的渲染模版 是一个vue文件 另一个是用来写一些地图逻辑的是一个ts文件 让我们在我们刚才的index.vue里开始编写渲染地图组件需要的代码 在index.vue里主要是写一些模版和基础数据 主要是从父组件获取数据也就是在我们使用的地方写对应的数据然后获取到数据后 然后传入 map.ts里 进行逻辑处理然后渲染   
先在template里写一个模版 然后通过引入mapFunction.ts的文件调用 mapFunction.ts文件里面的createMap  
mapFunction.ts文件的作用是集合各个功能的暴露后的方法 然后去写对应文件的功能 比如现在编写的功能是基础渲染功能我们就在里mapFunction.ts获取的map.ts写一个createMap方法  
然后写入我们的需要的配置项 从父组件中获得也就是我们在使用组件的时候需要传送过来 并且在下面给出整理 然后传到map.ts里进行渲染

```
//lMap/src/index.vue
<template>
	<div style="width: 100%; height: 100%">
		<div ref="map" style="with: 100%; height: 100%;"></div>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Provide } from "vue-property-decorator";
import MapFunction from "./map/mapFunction";

@Component({
	name: "lMap",
})
export default class leafletMap extends Vue {
	// Map 地图实例
	Map?: any;
	// 地图是否存在 是否可用
	existence: boolean = false;
	// 地图配置文件
	@Prop() config!: any;
	// 地图中心点
	@Prop({ type: [Array, Object], required: true }) center!: [number, number] | { lng: number; lat: number };
	// 地图缩放层级
	@Prop({ required: true }) zoom!: number;
	// 地图最小缩放层级
	@Prop() minZoom!: number;
	// 地图最大缩放层级
	@Prop() maxZoom!: number;
	//地图是否可以缩放
	@Prop({ default: true }) scrollWheelZoom!: boolean;
	// 地图是否可以设置拖拽
	@Prop({ default: true }) draggable!: boolean;
	// 地图配置
	get mapSetting() {
		return {
			center: this.center,
			zoom: this.zoom,
			minZoom: this.minZoom,
			maxZoom: this.maxZoom > 18 ? 18 : this.maxZoom,
			scrollWheelZoom: this.scrollWheelZoom,
			draggable: this.draggable,
		};
	}
	// 地图初始化
	async init() {
		try {
			if (this.Map) {
				return await this.Map.init(this.$refs.map as HTMLElement, this.mapSetting, this.$listeners);
			}
		} catch (err) {
			return Promise.reject(err);
		}
	}
	async mounted() {
    // 创建地图实例
		this.Map = await MapFunction.createMap(this.config);
		this.init().then((event) => {
			this.existence = true;
		});
	}
}
</script>
```

### 3.2编写mapFunction.ts -> src/map/function.ts
> mapFunction.ts的作用就是 整理我们各个功能文件ts 比如现在我们就要引用我们的map.ts和 以后还会引入其他地图组件 并且将自己暴露出去 让其可以获取并使用

```
// src/map/mapFunction.ts

import Map from "./_abstract/map";
import { MapConfig } from "../types";
import LeafletMap from "./map";

class MapFunction {
	static async createMap(config: MapConfig): Promise<Map> {
		return new LeafletMap(config.content);
	}
}

export default MapFunction;
```

### 3.3 编写地图渲染代码 -> src/map/map.ts
> 在这里我们就是我们地图所使用的代码 再里面进行引入依赖 然后将从index.vue中的参数 对应的传送给地图的api 现在我们将做一个基础的渲染supermap云gis地图的功能

```
// src/map/map.ts
import Map from "./_abstract/map";
import { LeafLetMapConfig } from "../types";
// 引入leaflet
import L from "leaflet";
// leaflet CSS 不引入会混乱
import "leaflet/dist/leaflet.css";
// supermap引擎
import "@supermap/iclient-leaflet";

class leafletMap extends Map {
	// leaflet 动态配置
	leafletMap: string | any = {};
    
	constructor(config: LeafLetMapConfig) {
		super();
		this.leafletMap = config;
	}

	/*
	  地图初始化 
	  elm      地图所在dom
      setting  地图配置
      listener 地图监听
	 */
	async init(elm: HTMLElement, setting: any = this.setting, listener?: any): Promise<any> {
		const config = this.leafletMap;
		try {
			if (!(window as any).supermap) {
				this.map = L.map(elm, {
					// 坐标系
					crs: (L as any).CRS[config.crs],
					// 初始化地图的地理中心。
					center: [setting.center[0], setting.center[1]],
					// 最大放大倍数
					maxZoom: setting.maxZoom,
					// 最小放大倍数
					minZoom: setting.minZoom,
					// 初始化地图的缩放
					zoom: setting.zoom,
					// 是否默认添加放大控件
					zoomControl: false,
					// (多边形缩放)：决定地图是否可被缩放到鼠标拖拽出的矩形的视图，鼠标拖拽时需要同时按住shift键
					boxZoom: false,
					// 地图是否自动处理浏览器窗口调整大小以更新自身。默认为true，没有实验过该属性
					trackResize: false,
					// 聚焦到地图且允许用户通过键盘的方向键和加减键来漫游地图。
					keyboard: false,
					// （淡出动画）：确定瓦片淡出动画是否可用。通常默认在所有浏览器中都支持CSS3转场，android例外
					fadeAnimation: true,
					//（缩放动画）确定瓦片缩放动画是否可用。通常默认在所有浏览器中都支持CSS3转场，android例外
					zoomAnimation: true,
					//（注记缩放动画）：确定注记的缩放是否随地图缩放动画而播放，如果被禁用，注记在动画中拉长时会消失。通常默认在所有浏览器中都支持CSS3转场，android例外。
					markerZoomAnimation: true,
					// 属性控制 --->是否显示水印
					attributionControl: false,
					// 是否允许放大缩小
					scrollWheelZoom: true,
					//是否拖动
					dragging: true,
					// 双击放大缩小
					doubleClickZoom: false,
				});
				(L as any)[config["type"]][config["mapType"]](config["url"]).addTo(this.map);
			}
			return this.map;
		} catch (error) {
			console.log(error, "map.ts-error");
		}
	}
}

export default leafletMap;
```

> 到这里渲染地图基础组件就完成了 接下来就去看看是否可以使用

---

## 4.项目中测试使用

### 4.1 项目中测试使用
> 和上一篇中一样 在packages/lMap/index.ts和packages/index.ts中暴露 在vue项目中的main.ts引入 然后在 vue中直接使用组件名称 l-map 传送对应的参数就可以 我们在组件中规定了需要传center中心点 和zoom初始缩放等级 maxZoom minZoom地图最大最小缩放登记 和config的地图配置 接下来让我们一起来试一下  
渲染基础地图config 配置如下   
crs : 为地图坐标系 一般地图中都会有标注  
type: 使用渲染地图的引擎 如果用supermap就写supermap mapbox写空 ‘’  
mapType : 地图的类型比如天地图 高德地图   
url : 地图渲染地址  

```
// doc/App.vue
<template>
	<div id="app">
		<div id="nav">
			<l-map id="lmap" ref="map" :center="center" :zoom="zoom" :minZoom="minZoom" :maxZoom="maxZoom" :config="mapConfig"></l-map>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

export default class App extends Vue {
	//地图基础配置
	mapConfig = {
		content: {
			crs: "EPSG3857",
			type: "supermap",
			mapType: "tiledMapLayer",
			url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
		},
	};
	// 地图中心点
	center = [39.90586280822754, 116.38834476470947];
	// 地图初始缩放等级
	zoom = 10;
	// 地图最小缩放等级
	minZoom = 3;
	// 地图最大缩放等级
	maxZoom = 18;
}
</script>

<style>
#app {
	width: 1000px;
	height: 1000px;
}
#nav {
	width: 100%;
	height: 100%;
}
#lmap {
	width: 100%;
	height: 100%;
	background: Red;
}
</style>
```

### 4.2查看效果

> 好了 该传的参数都已经传过去了 让我们一起来看一下效果 

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/efbc33595c4b4cac916e51a5e72526b3~tplv-k3u1fbpfcp-zoom-1.image)

> ok 没问题接下来就是打包及其他项目中进行测试了

---

## 5.打包成上传到npm及其他项目测试
### 5.1 下载npm及注册npm包
> 打包和上一篇中一样 yarn lib 然后 通过npm publish上传 上一篇中说过 这里就不再重复叙述了  
然后在我们的其他项目中 下载我们新上传的npm包 并在main.js中全局引入我们的项目依赖和注册  

```
// 引入我们的lf-map-npm包
import leafletMap from "lf-map-npm";
// 引入我们的lf-map-npm的css文件不然地图样式会错乱
import "lf-map-npm/lib/lf-map-npm.css";
// 注册我们的依赖包
Vue.use(leafletMap);
```

### 5.2 编写测试代码  

>基本和上述在项目中的代码一致

```
// App.vue
<template>
	<div id="app">
		<l-map id="lmap" ref="map" :center="center" :zoom="zoom" :minZoom="minZoom" :maxZoom="maxZoom" :config="mapConfig"></l-map>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
	//地图基础配置
	mapConfig = {
		content: {
			crs: "EPSG3857",
			type: "supermap",
			mapType: "tiledMapLayer",
			url: "https://iserver.supermap.io/iserver/services/map-china400/rest/maps/China",
		},
	};
	// 地图中心点
	center = [39.90586280822754, 116.38834476470947];
	// 地图初始缩放等级
	zoom = 10;
	// 地图最小缩放等级
	minZoom = 3;
	// 地图最大缩放等级
	maxZoom = 18;
}
</script>

<style>
#app {
	width: 100%;
	height: 500px;
	margin-top: 60px;
}
</style>

```  

### 5.3 查看效果  
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/483b8c1d82d24a0aa2834ea97916e328~tplv-k3u1fbpfcp-zoom-1.image)  

> 成功渲染 没有任何问题～

---

## 总结  
>本篇简单写了一下leaflet和supermap的基础渲染功能 其他功能还没有实现 下一篇要实现集成渲染mapbox 和 基础地图的一些功能 如点击获取坐标位置 销毁地图 监听地图等功能的实现封装 然后会封装marker 等一些功能 目标希望引入组件传入对应参数即可使用的效果   

> 希望对各位有所帮助  
如有错误欢迎各位大佬指出也欢迎各位小伙伴们前来热烈讨论 项目目前已经打包成npm包 在npm官网 欢迎各位下载使用  

## npm地址
[npm地址](https://www.npmjs.com/package/lf-map-npm)  
[https://www.npmjs.com/package/lf-map-npm](https://www.npmjs.com/package/lf-map-npm)
```
https://www.npmjs.com/package/lf-map-npm
```
---
## github地址  
> 地图部分我放到了项目的map分支下 如有需求请到map分支下载 运行后即可看到效果   
[github地址](https://github.com/dzc980812/lf-map/tree/map)  
[https://github.com/dzc980812/lf-map/tree/map](https://github.com/dzc980812/lf-map/tree/map)  
```
https://github.com/dzc980812/lf-map/tree/map
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

```！
如需转载请标明出处 或 获得授权
```









