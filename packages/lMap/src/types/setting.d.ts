import { Point } from "./point";

export interface MapSetting {
	center: Point;
	zoom: number;
	minZoom?: number;
	maxZoom?: number;
	scrollWheelZoom?: boolean;
}
