import Vue from "vue";
import App from "./App.vue";

import leafletMap from "../packages/index";
Vue.use(leafletMap);

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount("#app");
