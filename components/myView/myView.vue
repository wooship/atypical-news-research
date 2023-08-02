<template>
	<view class="myView">{{message}}</view>
</template>

<script>
	export default {
		name: "myView",
		data() {
			return {
				message: ''
			};
		},
		methods: {
			msg(message) {
				this.message = message;
			}
		}
	}
</script>

<style>
	.myView {
		font-size: 14px;
		font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
	}
</style>