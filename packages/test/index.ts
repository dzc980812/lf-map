import test from "./src/index.vue";

/* istanbul ignore next */
(test as any).install = function(Vue: any) {
	Vue.component(test.name, test);
};

export default test;
