// 编写地图组件
import lMap from "./src/index.vue";

(lMap as any).install = function(Vue: any) {
	Vue.component((lMap as any).options.name, lMap);
};

export default lMap;
