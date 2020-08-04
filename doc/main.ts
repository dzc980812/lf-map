import Vue from "vue";
import App from "./App.vue";

import test from "../packages/index";
Vue.use(test);

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount("#app");
