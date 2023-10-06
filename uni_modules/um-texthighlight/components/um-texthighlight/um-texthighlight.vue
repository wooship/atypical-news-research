<template>
	<view>
		<block v-for="(item, index) in getHilightStrArray(text, keyword)" :key="index">
			<text :style="(item == keyword? 'color:' + color : '')">{{item}}</text>
		</block>
	</view>
</template>
<script>
	export default {
		props: {
			// 需要显示的文本
			text: {
				type: String,
			},
			// 需要高亮的关键字
			keyword: {
				type: String,
			},
			// 高亮的颜色
			color: {
				type: String,
				default: 'red'
			}
		},

		methods: {
			/**
			 * 将文本和关键字分割成数组
			 * @param str  待处理字符串
			 * @param key  关键字字符串
			 * @returns 将关键字分割后的数组
			 */
			getHilightStrArray(str, key) {
				return str.replace(new RegExp(`${key}`, 'g'), `%%${key}%%`).split('%%');
			}
		}
	}
</script>
