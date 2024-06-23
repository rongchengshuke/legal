<template>
	<view class="container">
		<view class="search-area">
			<view class="search-area-input">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"/>
			</view>
		</view>
		<view class="recentHistory">
			<view class="recentHistory-list">
				<view class="recentHistory-item" v-for="(item, index) in dataList" :key="index">
					<view class="left">
						<image src="/static/logo.png" /> 
						<view class="docDetail">
							<text class="docDetailName">{{ item.catalog_name }}</text>
							<text class="docDetailDate">{{ timestamp(item.created_time*1000) }}</text>
						</view>
					</view>
					<view class="right" @click="preview(item)">预览</view>
				</view>
			</view>
		</view>
</view>
</template>
<script>
	import utils from '../../util/utils';
	import api from '../../util/api';
	export default {
		data() {
			return {
				title: 'Hello',
				dataList: [],
				tokenData: ''
			}
		},
		async onShow() {
			await this.getData()
		},
		methods: {
			getData() {
				api.myGSSMainRequest({
					url: '/api/catalog/list',
					method: 'GET',
					header: {
						Authorization: this.tokenData
					}
				}).then((res) => {
					if (res.code === 200) {
						this.dataList = res.data
					} else {
						this.dataList = []
					}
				})
			},
			preview(item) {
				uni.navigateTo({
					url: `/pages/previewEvidence/index?id=${item.id}&types=table&catalog_name=${item.catalog_name}`
				})
			},
			timestamp(time) {
				return utils.convertTimestamp(time)
			}
		}
	}
</script>

<style scoped lang="less">
	.container {
		padding: 20rpx;
		.search-area{
			background-color: #fff;
			padding: 20rpx 30rpx;
			display: flex;
			margin-bottom: 20rpx;
			&-input{
				display: flex;
				flex: 1;
				background-color: #fafafa;
				border-radius: 40rpx;
				padding: 4rpx 20rpx;
				input{
					margin-left: 6rpx;
					font-size: 28rpx;
				}
				.input-uni-icon{
					padding-top: 4rpx;
				}
			}
		}
		.recentHistory {
			&-item{
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 20rpx;
				margin-bottom: 20rpx;
				.left {
					display: flex;
					align-items: center;
					image {
						width: 100rpx;
						height: 100rpx;
						margin-right: 20rpx;
					}
					.docDetail {
						display: flex;
						flex-direction: column;
						.docDetailName {
							font-size: 28rpx;
							margin-bottom: 12rpx;
						}
						.docDetailDate {
							font-size: 24rpx;
							color: #666;
						}
					}
				}
				.right {
					padding-right: 20rpx;
					color: #1c7ed6;
					cursor: pointer;
				}
			}
		}
	}
</style>
