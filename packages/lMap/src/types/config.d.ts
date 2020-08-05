import { MapSetting } from "./setting";

export type MapType = "leaflet";

export interface LeafLetMapConfig {
	url: string; // url
	mapType: string; //地图类型
	crs: string; // 地图坐标
	type: string; // 地图类型supermap mapbox或其他
	token?: any; // token
}

export type ContentType = any;

export interface MapConfig {
	content: LeafLetMapConfig;
	setting?: MapSetting;
}
