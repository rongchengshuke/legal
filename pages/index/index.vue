<template>
	<view class="container">
		<up-navbar title="首页" @leftClick="backClick" leftIconColor="#000000" leftIconSize="16" :autoBack="true" />
		<view class="bgliner">
			<view class="search-area">
				<view class="search-area-input">
					<uni-easyinput suffixIcon="search" v-model="valueSearch" placeholder="请输入关键字" @iconClick="iconClick" />
					<uni-icons class="set-icon" type="settings" size="30" @click="filterTime" />
				</view>
			</view>
			<uni-drawer ref="showRight" mode="right" :mask-click="true">
				<scroll-view class="drawer-box" scroll-y="true">
					<uni-easyinput class="uni-mt-5" suffixIcon="search" v-model="planName" 
						placeholder="请输入关键字" @iconClick="searchClick"></uni-easyinput>
					<uni-row  class="time-box">
						<uni-col :span="8">
							<button type="default" size="mini" @click="clickTime('1')">今天</button>
						</uni-col>
						<uni-col :span="8">
							<button type="default" size="mini" @click="clickTime('1')">近一周</button>
						</uni-col>
						<uni-col :span="8">
							<button class="btn" type="default" size="mini" @click="clickTime('1')">近一个月</button>
						</uni-col>
					</uni-row >
					<view class="times-ranges">
						<uni-datetime-picker type="date" :clear-icon="false" v-model="startTime" />
						<span class="lines">-</span>
						<uni-datetime-picker type="date" :clear-icon="false" v-model="endTime" />
					</view>
					<uni-row class="button-box">
						<uni-col :span="10">
							<button class="reset-btn" @click="closeDrawer" type="default">重置</button>
						</uni-col>
						<uni-col :span="4"></uni-col>
						<uni-col :span="10">
							<button class="submit-btn" @click="confirmDrawer" type="primary">确认</button>
						</uni-col>
					</uni-row>
				</scroll-view>
			</uni-drawer>

			<view class="nav-area">
				<view class="nav-item" @click="upPopupOpen">
					<image class="feature" src="../../static/image/feature1.png" mode="" />
					<text class="title">导入病历</text>
				</view>
				<view class="nav-item" @click="newFolder">
					<image class="feature" src="../../static/image/feature2.png" mode="" />
					<text class="title">新建文件夹</text>
				</view>
				<view class="nav-item" @click="intelScan">
					<image class="feature" src="../../static/image/feature3.png" mode="" />
					<text class="title">智能扫描</text>
				</view>
				<view class="nav-item" @click="timeLineFn">
					<image class="feature" src="../../static/image/feature4.png" mode="" />
					<text class="title">时间轴</text>
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
		<!-- 导入病历选择弹窗 --开始-->
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
		<tabBar :activeBar="0" />
	</view>
</template>
<script>
	import utils from '../../util/utils';
	import api from '../../util/api';
	import tabBar from '../tab-bar/index.vue'
	export default {
		components: { tabBar },
		data() {
			return {
				title: 'Hello',
				titleName: '病历宝',
				dataList: [],
				valueInput: '',
				valueSearch: '',
				planName: '',
				startTime: '',
				endTime: ''
			}
		},
		onShow() {
			// if (utils.is_weixin()) {
			// 	utils.pageHead()
			// }
			this.getHistoricalRecord()
			this.$refs.upPopup && this.$refs.upPopup.close()
		},
		methods: {
			backClick() {
				console.log('44444444444')
				uni.webView.postMessage({
					data: {
						action: 'uni-app', //可自己随意定义，需要与app中接收通信的方法对应
					}
				})
			},
			filterTime() {
				this.$refs.showRight.open();
			},
			searchClick() {
				this.getHistoricalRecord()
				this.$refs.showRight.close()
			},
			closeDrawer() {
				this.valueSearch = ''
				this.startTime = ''
				this.endTime = ''
				this.planName = ''
				this.getHistoricalRecord()
				this.$refs.showRight.close()
			},
			confirmDrawer() {
				this.getHistoricalRecord()
				this.$refs.showRight.close()
			},
			iconClick() {},
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
							url: `/pages-conts/views/upImgDisplay/index?imgList=${JSON.stringify(urlsArr)}`
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
				if (uni.getStorageSync("tokenBlb")) {
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
			timeLineFn() {
				uni.navigateTo({
					url: `/pages-conts/views/timeline/index`
				})
			},
			viewTotal() {
				uni.switchTab({
          url: `/pages/documents/index`
        });
			},
			cancelFn() {
				this.$refs.documents.close()
			},
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
							url: `/pages-conts/views/file/index?name=${this.valueInput}&category_id=${res.data.category_id}&type=index`
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
					data: {
						valueSearch: this.valueSearch,
						planName: this.planName,
						startTime: this.startTime,
						endTime: this.endTime
					}
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
			},
			// ----时间----
			addLeadingZero(number) {
				if (number < 10) {
					return "0" + number;
				}
				return number;
			},
			getTime(time) {
  			let year = time.getFullYear();
  			let month = time.getMonth() + 1;
  			let day = time.getDate();
  			let formattedDate = year + "-" + this.addLeadingZero(month) + "-" + this.addLeadingZero(day);
				return formattedDate
			},
			getWeekTime() {
				let time = (new Date).getTime() - 7 * 24 * 60 * 60 * 1000;
        let tragetTime = new Date(time);
        tragetTime = tragetTime.getFullYear() + "-" + (tragetTime.getMonth()> 9 
					? (tragetTime.getMonth() + 1) : "0" + (tragetTime.getMonth() + 1)) + "-" + (tragetTime.getDate()> 9 ? (tragetTime.getDate()) 
					: "0" + (tragetTime.getDate()));
        return tragetTime;
			},
			clickTime(type) {
				let currentDate = new Date();
  			currentDate.setMonth(currentDate.getMonth() - 1);
				const todayTime = this.getTime(new Date());
				const weekTime = this.getWeekTime();
				const monthTime = this.getTime(currentDate)
				if (type === '1') {
					this.startTime = todayTime
					this.endTime = todayTime
				} else if (type === '2') {
					this.startTime = weekTime
					this.endTime = todayTime
				} else if (type === '3') {
					this.startTime = monthTime
					this.endTime = todayTime
				}
			}
		}
	}
</script>

<style scoped lang="less">
	page {
		padding-top: 140rpx;
	}
	::v-deep .u-navbar--fixed {
		top: 0rpx!important;
		z-index: 99999!important;
		.u-navbar__content {
			padding-top: 46rpx;
		}
	}
	::v-deep .u-navbar__content__left {
		padding-top: 46rpx;
	}
	.container {
		height: 100vh;
		background: #F8FAFB!important;
		overflow-y: hidden;
	}
	.bgliner {
		background: linear-gradient(221deg, #E1EEFE 0%, #F5F8FF 76.8%)!important;
		padding-top: 32rpx;
	}
	.search-area {
		display: flex;
		padding: 0rpx 20rpx;
		margin-bottom: 20rpx;
		&-input{
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			::v-deep .is-input-border {
				height: 70rpx;
				border-radius:50rpx;
				border: 4rpx solid #000000!important;
				font-size: 28rpx;
			}
			::v-deep .uni-icons {
				color: #000000!important;
				margin-right: 10rpx;
			}
			.set-icon {
				margin-left: 20rpx;
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
		background: #F8FAFB!important;
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
			height: calc(100vh - 500rpx);
			background: #EDF2FA!important;
			padding: 20rpx 20rpx 100rpx 20rpx;
			overflow-y: auto;
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
	::v-deep .uni-drawer__content {
		width: 600rpx!important;
		padding: 20rpx!important;
		.drawer-box {
			.button-box {
				width: 100%;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.reset-btn {
					background: #F8F8F8;
					color: #333333;
				}
				.submit-btn {
					background: #009DFF;
					color: #FFFFFF;
				}
			}
			.times-ranges {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				.lines {
					margin: 0px 3px;
				}
			}
		}
	}
	::v-deep .time-box {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.btn {
			float: right!important;
		}
	}
</style>
