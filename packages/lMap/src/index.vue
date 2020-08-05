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
