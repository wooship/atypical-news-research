<!-- 普通模式演示(vue) -->
<template>
	<view class="content">
		<pop-up ref="popup">
			<view :style="'overflow:scroll;width:'+popWidth+'px;height:'+popHeight+'px;'">
				<!-- <view class="item">
					<myView id="scoreView" ref="scoreView"></myView>
					<myView id="mockView" ref="mockView"></myView>
				</view> -->
				<!-- <view class="item-line"></view> -->
				<zero-markdown-view :themeColor="themeColor" :markdown="content"></zero-markdown-view>
			</view>
		</pop-up>
		<z-paging ref="paging" v-model="dataList" @query="queryList">
			<!-- 需要固定在顶部不滚动的view放在slot="top"的view中，如果需要跟着滚动，则不要设置slot="top" -->
			<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
			<template #top>
				<z-tabs :list="tabList" @change="tabChange" />
			</template>
			<!-- 如果希望其他view跟着页面滚动，可以放在z-paging标签内 -->
			<view class="item" v-for="(item,index) in dataList" :key="index" @click="itemClick(item,index)">
				<view class="item-title">
					<um-texthighlight :text="item.summary" :keyword="item.keyWord"
						color="red"></um-texthighlight>
				</view>
				<view class="item-line"></view>
				<view class="item-detail">{{item.publishTime}} {{item.tags}}</view>
				<!-- <view class="item-detail">{{item.source}}</view> -->
			</view>
		</z-paging>
	</view>
</template>

<script>
	import {
		getParamsRequest,
		getTimeOut
	} from "../../apis/index.js"
	export default {
		usingComponents: {
			'popup': '@/components/pop-up/pop-up.vue',
			'myView': '@/componets/myView/myView.vue'
		},
		data() {
			return {
				//v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
				dataList: [],
				tabList: ['非典型样本', '普通样本'],
				tabIndex: 0,
				popWidth: 0,
				popHeight: 0,
				content: '',
				themeColor: '#000000',
			}
		},
		onLoad() {
			const res = uni.getSystemInfoSync();
			this.popWidth = res.windowWidth * 0.8
			this.popHeight = res.windowHeight * 0.7
			// console.log(res.screenWidth)
			// console.log(res.windowWidth)
			// console.log(res.screenHeight)
			// console.log(res.windowHeight)
			// console.log(res.safeAreaInsets.bottom)
			/*  #ifdef  MP-WEIXIN  */
			wx.cloud.init()
			/*  #endif  */
		},
		mounted() {

		},
		methods: {
			tabChange(index) {
				this.tabIndex = index;
				// console.log(index)
				//当切换tab或搜索时请调用组件的reload方法，请勿直接调用：queryList方法！！
				this.$refs.paging.reload();
			},
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				// console.log(pageNo, pageSize)
				/*  #ifndef  MP-WEIXIN  */
				getParamsRequest("/newslist", {
					"pageNum": pageNo - 1,
					"pageSize": pageSize,
					"tabIndex": this.tabIndex
				}, true, "POST").then(res => {
					//将请求的结果数组传递给z-paging
					// console.log(res)
					this.$refs.paging.complete(res);
				}).catch(res => {
					//如果请求失败写this.$refs.paging.complete(false);
					//注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
					//在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
					this.$refs.paging.complete(false);
				})
				/*  #endif  */
				/*  #ifdef  MP-WEIXIN  */
				uni.showLoading({
					title: '加载中'
				});
				wx.cloud.callFunction({ //调用云服务
					name: "newslist", //云函数名称
					data: {
						pageNo: pageNo - 1,
						pageSize: pageSize,
						tabIndex: this.tabIndex,
					},
				}).then(res => {
					// console.log(res.result)
					this.$refs.paging.complete(JSON.parse(res.result));
					uni.hideLoading();
				}).catch(res => {
					this.$refs.paging.complete(false);
					uni.hideLoading();
				})
				/*  #endif  */
			},
			itemClick(item, index) {
				// if (!item.tags.includes('政治') && !item.summary.includes('') && !item.summary.includes('')) {
				setTimeout(() => {
					this.$nextTick(() => {
						// this.$refs.scoreView.$el.innerText = "评分结果：" + item.score + '/100'
						// this.$refs.mockView.$el.innerText = item.mock
						// console.log(this.$refs)
						// let scoreView = uni.createSelectorQuery().in(this).select('#scoreView');
						// let mockView = uni.createSelectorQuery().in(this).select('#mockView');
						// scoreView.boundingClientRect(data =>{
						// 	console.log(data)
						// }).exec()
						// scoreView.innerText = "评分结果：" + item.score + '/100'
						// mockView.innerText = item.mock

						/*  #ifndef  MP-WEIXIN  */
						getParamsRequest("/newsdetail", {
							"id": item.id,
						}, true, "POST").then(res => {
							// this.$refs.scoreView.msg("参考打分：" + res.score + '/100')
							// this.$refs.mockView.msg(res.mock)
							this.content = res.markdown
							this.$refs.popup.open();
						}).catch(res => {
							// this.$refs.scoreView.msg("参考打分：" + '??' + '/100')
							// this.$refs.mockView.msg('数据获取失败')
							this.content = ''
						})
						/*  #endif  */

						/*  #ifdef  MP-WEIXIN  */
						uni.showLoading({
							title: '加载中'
						});
						wx.cloud.callFunction({ //调用云服务
							name: "newsdetail", //云函数名称
							data: {
								id: item.id,
							},
						}).then(res => {
							// console.log(res.result)
							let result = JSON.parse(res.result)
							// this.$refs.scoreView.msg("参考打分：" + result.score + '/100')
							// this.$refs.mockView.msg(result.mock)
							this.content = result.markdown
							uni.hideLoading();
							this.$refs.popup.open();
						}).catch(res => {
							// this.$refs.scoreView.msg("参考打分：" + '??' + '/100')
							// this.$refs.mockView.msg('数据获取失败')
							this.content = ''
							uni.hideLoading();
						})
						/*  #endif  */
					})
					// console.log('点击了', item.title);
				}, 100);
				// }
			}
		}
	}
</script>

<style>
	.item {
		align-items: center;
		padding: 10px;
		/* display: flex;
		flex-direction: column; */
		border-radius: 5px;
		margin: 15px;
		background-color: #f8f8f8;
		box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
	}

	.item-title {
		font-size: 14px;
	}

	.item-detail {
		padding: 5rpx 15rpx;
		/* border-radius: 10rpx; */
		font-size: 12px;
		font-style: oblique;
		/* color: white; */
		/* background-color: #007AFF; */
	}

	.item-line {
		height: 1px;
		width: 100%;
		background-color: #d1d1d1;
		margin: 5px 0px 5px 0px;
	}
</style>