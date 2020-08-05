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
	width: 100%;
	height: 800px;
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
