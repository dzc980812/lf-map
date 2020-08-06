import Map from "./_abstract/map";
import { MapConfig } from "../types";

import LeafletMap from "./map";

class MapFunction {
	static async createMap(config: MapConfig): Promise<Map> {
		return new LeafletMap(config.content);
	}
}

export default MapFunction;
