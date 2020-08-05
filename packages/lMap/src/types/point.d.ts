export interface Coordinate {
	lng: number; // 经度
	lat: number; // 纬度
}

export type Point = [number, number] | Coordinate;

export interface Bounds {
	sw: Coordinate;
	ne: Coordinate;
}
