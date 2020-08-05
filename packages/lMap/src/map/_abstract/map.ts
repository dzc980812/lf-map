import { ContentType, MapSetting ,LeafLetMapConfig} from "../../types";

abstract class Map {
	map: any = null; //地图

	config: ContentType; // 配置内容

	setting!: MapSetting; // 地图配置
}

export default Map;
