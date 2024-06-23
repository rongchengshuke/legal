<template>
	<view class="container">
		<!-- <uni-nav-bar :fixed="true" shadow :title="titleName" /> -->
		<view class="bgliner">
			<view class="search-area">
				<view class="search-area-input">
					<uni-easyinput suffixIcon="search" v-model="valueSearch" placeholder="请输入关键字" 
						@iconClick="iconClick" />
				</view>
			</view>
			<view class="nav-area">
				<view class="nav-item" @click="upPopupOpen">
					<image class="feature" src="../../static/image/feature1.png" mode="" />
					<text class="title">导入证据</text>
				</view>
				<view class="nav-item" @click="newFolder">
					<image class="feature" src="../../static/image/feature2.png" mode="" />
					<text class="title">新建文件夹</text>
				</view>
				<view class="nav-item" @click="intelScan">
					<image class="feature" src="../../static/image/feature3.png" mode="" />
					<text class="title">智能扫描</text>
				</view>
				<view class="nav-item">
					<image class="feature" src="../../static/image/feature4.png" mode="" />
					<text class="title">其他</text>
				</view>
			</view>
		</view>
		<view class="recentHistory">
			<view class="headr">
				<view class="title">近期历史记录</view>
				<view class="toAll" @click="viewTotal">
					<view>查看全部</view>
					<image src="../../static/image/icon1.png" mode="" />
				</view>
			</view>
			<view class="recentHistory-list">
				<view class="recentHistory-item" v-for="(item, index) in dataList" 
					:key="index" @click="detailsFn(item)">
					<image :src="item.thumb_img" @click.stop="preview(item.thumb_img)" /> 
					<view class="recentHistory-item-docDetail">
						<text class="docDetailName">{{ item.task_name }}</text>
						<text class="docDetailDate">{{ timestamp(item.created_time*1000) }}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 导入证据选择弹窗 --开始-->
		<uni-popup id="upPopup" ref="upPopup" type="center" background-color="#FFFFFF">
			<view class="nav-area upImg-area">
				<view class="nav-item" @click="handleUpImg(1)">
					<view class="upImg-item-yuan">
						<uni-icons type="camera-filled" size="24" color="#4dabf7"></uni-icons>
					</view>
					<text class="title">拍照</text>
				</view>
				<view class="nav-item" @click="handleUpImg(2)">
					<view class="upImg-item-yuan">
						<uni-icons type="image-filled" size="24" color="#69db7c"></uni-icons>
					</view>
					<text class="title">本地图片</text>
				</view>
			</view>
			<view class="upPopup-cancle"  @click="upPopupCancle">取消</view>
		</uni-popup>
		<uni-popup ref="documents" type="bottom" background-color="#fff">
			<view class="titles">新建文件夹</view>
			<view class="inputs">
				<uni-easyinput class="uni-mt-5" v-model="valueInput"></uni-easyinput>
			</view>
			<view class="conts">
				<button class="btn1" @click="cancelFn">取消</button>
				<button class="btn2" type="primary" @click="btnFn">确定</button>
			</view>
		</uni-popup>
</view>
</template>
<script>
	import utils from '../../util/utils';
	import api from '../../util/api';
	export default {
		data() {
			return {
				title: 'Hello',
				titleName: '证据宝',
				dataList: [],
				valueInput: '',
				valueSearch: ''
			}
		},
		onShow() {
			this.getHistoricalRecord()
			this.$refs.upPopup && this.$refs.upPopup.close()
		},
		methods: {
			iconClick() {

			},
			navigateBackFn() {
				uni.navigateBack({
					delta: 1
				})
			},
			preview(imgs) {
				uni.previewImage({
					urls: [imgs],
				});
			},
			uploadFile(files, type) {
				const urlsArr = []
				const uploadTasks = api.myRequestUploadFile(
					{ files, type }
				)
				Promise.all(uploadTasks).then((res) => {
					res.forEach((item) => {
						const paraseItem = JSON.parse(item)
						if (paraseItem.code === 200) {
							urlsArr.push(paraseItem.data[0])
						}
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages/upImgDisplay/index?imgList=${JSON.stringify(urlsArr)}`
						})
					})
				}).catch((err) => {
					console.log('上传失败', err)
				})
			},
			handleUpImg(type){
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
				  count: 20,
				  mediaType: ['image'],
				  sourceType: type == 1 ? ['camera'] : ['album'],
				  maxDuration: 30,
					success: (resPath) => {
						this.uploadFile(resPath.tempFiles, 'wx')
					}
				})
				// #endif
				// #ifdef H5 || APP-PLUS
				uni.chooseImage({
					count: 20,
					sizeType: ['original', 'compressed'],
					sourceType: type == 1 ? ['camera'] : ['album'],
					success: (resPath) => {
						this.uploadFile(resPath.tempFilePaths, 'h5')
					}
				});
				// #endif
			},
			upPopupOpen(){
				if (uni.getStorageSync("token")) {
					this.$refs.upPopup.open()
				} else {
					uni.showToast({ title: 'Header authorization 参数值不能为空，请重新登录', icon: 'none' })
					return
				}
			},
			newFolder() {
				const now = new Date();
				const year = now.getFullYear();
				const month = now.getMonth() + 1;
				const day = now.getDate();
				this.valueInput = `新建文件夹${year}-${month}-${day}`
				this.$refs.documents.open()
			},
			intelScan() {
				uni.chooseImage({
					count: 20,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'],
					success: (resPath) => {
						this.uploadFile(resPath.tempFilePaths, 'h5')
					}
				});
			},
			viewTotal() {
				uni.switchTab({
          url: `/pages/documents/index`
        });
			},
			cancelFn() {
				this.$refs.documents.close()
			},
			// 新建文件夹确定成功
			btnFn() {
				api.myGSSMainRequest({
					url: '/api/category/add',
					method: 'POST',
					data: {
						name: this.valueInput
					}
				}).then((res) => {
					if (res.code === 200) {
						this.cancelFn()
						uni.navigateTo({
							url: `/pages/file/index?name=${this.valueInput}&category_id=${res.data.category_id}&type=index`
						})
					}
				})
			},
			upPopupCancle(){
				this.$refs.upPopup.close()
			},
			getHistoricalRecord() {
				api.myGSSMainRequest({
					url: '/api/task/list',
					method: 'GET',
				}).then((res) => {
					if (res.code === 200) {
						this.dataList = res.data
					} else {
						this.dataList = []
					}
				})
			},
			detailsFn(item) {
				uni.navigateTo({
					url: `/pages/previewEvidence/index?id=${item.id}&types=img`
				})
			},
			timestamp(time) {
				return utils.convertTimestamp(time)
			}
		}
	}
</script>

<style scoped lang="less">
	.bgliner {
		background: linear-gradient(221deg, #E1EEFE 0%, #F5F8FF 76.8%)!important;
		padding-top: 32rpx;
	}
	.search-area {
		display: flex;
		padding: 0rpx 40rpx;
		margin-bottom: 20rpx;
		&-input{
			width: 100%;
			::v-deep .is-input-border {
				height: 80rpx;
				border-radius: 98rpx;
				border: 4rpx solid #000000!important;
				font-size: 28rpx;
			}
			::v-deep .uni-icons {
				color: #000000!important;
				margin-right: 10rpx;
			}
		}
	}
	.nav-area{
		display:flex;
		justify-content: space-between;
		flex-wrap: wrap;
		grid: 10rpx; 
		padding: 20rpx 0;
		margin-bottom: 20rpx;
		.nav-item{
			min-width: calc( 100% / 4 );
			display:flex;
			flex-direction: column;
			align-items: center;
			font-size: 22rpx;
			color: #000000;
			margin-bottom: 20rpx;
			.feature {
				width: 64rpx;
				height: 64rpx;
			}
			text{
				margin-top: 8rpx;
			}
		}
	}
	.recentHistory {
		.headr {
			padding: 20rpx 40rpx;
			background-color: #FFFFFF;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			.title{
				font-weight: bold;
				font-size: 28rpx
			}
			.toAll {
				color: rgba(0, 0, 0, 0.60);
				font-family: "PingFang SC";
				font-size: 22rpx;
				font-style: normal;
				font-weight: 400;
				line-height: normal;
				display: flex;
				align-items: center;
				image {
					width: 32rpx;
					height: 32rpx;
					margin-left: 4rpx;
				}
			}
		}
		&-list {
			padding: 0rpx 40rpx;
		}
		&-item{
			display: flex;
			margin-bottom: 20rpx;
			background-color: #FFFFFF;
			padding: 24rpx;
			image{
				width: 160rpx;
				height: 160rpx;
				margin-right: 20rpx;
			}
			&-docDetail{
				display: flex;
				flex-direction: column;
				.docDetailName{
					font-size: 28rpx;
					margin-bottom: 12rpx;
				}
				.docDetailDate{
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}
	#upPopup{
		.uni-popup{
			background-color: red;
		}
		.upImg-area{
			width: 600rpx;
			justify-content: space-around;
			align-items: center;
			margin: 20rpx 0 0;
		}
		.upImg-item-yuan {
			padding: 16rpx;
			border-radius: 50%;
			background-color: #f5f5f5;
		}
		.upPopup-cancle{
			padding: 20rpx 0;
			text-align: center;
			border: 2rpx solid #f0f0f0;
			border-width: 2rpx 0 0 0;
			color: #666;
		}	
	}
	.titles, .inputs {
		width: calc(100% - 80rpx);
		margin-left: 20px;
	}
	.titles {
		padding: 20rpx 0px 0px 0px;
		text-align: center;
		font-size: 32rpx;
	}
	.conts {
		width: calc(100% - 80rpx);
		margin-left: 40rpx;
		display: flex;
		margin-top: 20rpx;
		margin-bottom: 140rpx;
		.btn1 {
			margin-right: 40rpx;
		}
		.btn1, .btn2 {
			flex: 1;
		}
	}
</style>
