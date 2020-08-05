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
			console.log(error, "map.ts-73-error");
		}
	}
}

export default leafletMap;
