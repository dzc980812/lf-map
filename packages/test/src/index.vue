<template>
	<div class="test">
		test component
	</div>
</template>
<script>
export default {
	name: "test",
	options: {
		name: "test",
	},
	created() {
		console.log("created,测试我们的test组件");
	},
	components: {},
	props: {},
	data() {
		return {};
	},
	methods: {},
};
</script>
<style>
.test {
	color: red;
}
</style>
