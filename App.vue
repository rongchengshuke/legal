<script>
	import api from './util/api';
	export default {
		onLaunch: function() {
			uni.onTabBarMidButtonTap(() => {
				uni.chooseImage({
					count: 20,
					sizeType: ['original', 'compressed'],
					sourceType: ['camera'],
					success: (resPath) => {
						this.uploadFile(resPath.tempFilePaths, 'h5')
						
					}
				});
			})
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
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
		}
	}
</script>

<style lang="scss">
	@import "uview-plus/index.scss";
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #F8FAFB;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	::v-deep .uni-tabbar__icon {
		margin-top: 5px!important;
	}
	::v-deep .uni-tabbar__bd {
		height: fit-content!important;
	}
	::v-deep .uni-tabbar__label {
		margin-top: 0px!important;
		padding-bottom: 3px!important;
	}
	.uni-mask {
    background: rgba(0, 0, 0, 0.5)!important; /* 设置蒙层的颜色 */
	}
	::v-deep .uni-navbar {
		.uni-navbar--fixed{
			border-bottom-color: rgba(255,255,255,0)!important;
		}
	}
	::v-deep .uni-tabbar__mid {
		img {
			border-radius: 50%;
		}
	}
</style>
