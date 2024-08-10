<!-- 档案 -->
<template>
	<view class="content">
		<up-toast ref="uToastRef"></up-toast>
		<view class="heads">
			<view v-if="!token" class="no-logged-state">
				<view class="tops">
					<image src="../../static/image/group.png" mode="" />
					<view class="rights">
						<view class="no-login">未登录</view>
						<view class="login-experience">登录，体验更多功能</view>
					</view>
				</view>
				<view class="bottoms">
					<view @click="immediatelyLogin" class="sign-in-now">立即登录</view>
					<image @click="openPopup('wx')" src="../../static/image/wx.png" mode="" />
					<image @click="openPopup('phone')" src="../../static/image/phone.png" mode="" />
				</view>
			</view>
			<view v-else class="log-state">
				<image @click="goUserInfo" src="../../static/image/group-active.png" mode="" />
				<view class="login-info-phone">{{formPhone(phone)}}</view>
			</view>
		</view>
		<view class="account">
			<image src="../../static/image/wx.png" mode="" />
			<view class="gzgzh">
				<view class="titles">关注公众号</view>
				<view class="desc">随时掌控产品知识及视频</view>
			</view>
			<image class="img" src="../../static/image/icon.png" mode="" />
		</view>
		<view class="my-service">
			<view class="servicetitles">我的服务</view>
			<view class="servicetype">
				<view class="imginfo">
					<image src="../../static/image/group1.png" mode="" />
					<view class="infos">常见问题</view>
				</view>
				<view class="imginfo">
					<image src="../../static/image/own.png" mode="" />
					<view class="infos">关于我们</view>
				</view>
				<view class="imginfo">
					<image src="../../static/image/appeal.png" mode="" />
					<view class="infos">我的申诉</view>
				</view>
			</view>
		</view>
		<view class="others-class">
			<view class="tops">
				<view class="imgdec">
					<image src="../../static/image/other1.png" mode="" />
					<view class="infos">账户</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other2.png" mode="" />
					<view class="infos">同步</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other3.png" mode="" />
					<view class="infos">扫描</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other4.png" mode="" />
					<view class="infos">文档</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other5.png" mode="" />
					<view class="infos">打印机</view>
				</view>
			</view>
			<view class="bottoms">
				<view class="imgdec">
					<image src="../../static/image/other6.png" mode="" />
					<view class="infos">推荐</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other7.png" mode="" />
					<view class="infos">客服</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other8.png" mode="" />
					<view class="infos">反馈</view>
				</view>
				<view class="imgdec">
					<image src="../../static/image/other9.png" mode="" />
					<view class="infos">设置</view>
				</view>
				<view class="imgdec"></view>
			</view>
		</view>
		<uni-popup ref="popup" background-color="#fff">
			<view class="popup-content">
				<view class="input-content">
					<view class="input-list">
						<view class="list-left">+86</view>
						<view class="list-right"><input class="uni-input" v-model="area" /></view>
						<uni-icons class="uni-icon" type="right" size="30"></uni-icons>
					</view>
					<view class="input-list">
						<input class="uni-input" v-model="getPhone" placeholder="请输入手机号" type="number" />
					</view>
					<button @click="getCode" type="primary">获取验证码</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="secondLogin" background-color="#fff">
			<view class="popup-content">
				<view class="input-content">
					<view class="input-list"><view class="list-left">+86</view>
						<view class="list-right">
							<input class="uni-input" v-model="area" />
						</view>
						<uni-icons class="uni-icon" type="right" size="30"></uni-icons>
					</view>
					<view class="input-list">
						<input class="uni-input" v-model="getPhone" placeholder="请输入手机号" type="number" />
					</view>
					<button @click="getCode" type="primary">获取验证码</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="codePopup" background-color="#fff">
			<view class="code-popup-content">
				<view class="title">
					<uni-icons @click="back" class="icon" type="left" size="30"></uni-icons>
					<text>请输入验证码</text>
				</view>
				<view class="tips" style="margin-bottom: 40rpx;">
					验证码已发送至+86 {{formPhone(getPhone)}}
				</view>
				<up-code-input :space="30" v-model="code" :focus="true" :maxlength="5"></up-code-input>
				<view class="djs" v-if="count > 0" style="margin-top: 30rpx;">{{count}}秒后可重新发送</view>
				<view class="djs" v-else @click="getCode" style="margin-top: 30rpx;">重新发送</view>
				<button style="margin-top: 40rpx;" @click="login" type="primary">登录</button>
			</view>
		</uni-popup>
		<tabBar :activeBar="4" />
	</view>
</template>

<script>
	import { getTelCode, login } from '../../api/index.js'
	import api from '../../util/api';
	import tabBar from '../tab-bar/index.vue'
	export default {
		components: { tabBar },
		data() {
			return {
				phone:'',
				getPhone: '',
				area: '中国',
				timer: null, // 定时器
				count: 60, // 时间
				code: "", // 验证码  
				focus: true, // 焦点
				isCode: true,
				token: ''
			}
		},
		async onShow() {
			this.token = uni.getStorageSync("token")
			this.phone = uni.getStorageSync("phone")
		},
		async onLoad() {
			this.token = uni.getStorageSync("token")
			this.phone = uni.getStorageSync("phone")
		},
		watch: {
			count(val) {
				if (val == 0) {
					clearInterval(this.timer)
				}
			},
		},
		methods: {
			// 跳转全部文档
			jumpDocument() {
				uni.switchTab({
          url: `/pages/documents/index`
        });
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
			userOtherPhone() {
				if(!this.token){
					this.$refs['secondLogin'].open('bottom')
				}else{
					return
				}
			},
			goUserInfo() {
				if(!this.token){
					return
				}else{
					uni.navigateTo({
						url: '/pages/personalCenter/userInfo'
					})
				}
			},
			immediatelyLogin() {
				uni.navigateTo({
					url: `/pages/login/index?getPhone=${uni.getStorageSync('phone')}`
				})
				return
				this.$refs['secondLogin'].open('bottom')
			},
			login() {
				login({
					phone: this.getPhone,
					code: this.code
				}).then(res => {
					this.token = res.data.token
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('phone', this.getPhone);
					this.phone = this.getPhone
					this.getPhone = ''
					this.code = ''
					this.count = 60
					clearInterval(this.timer)
					this.$refs['popup'].close()
					this.$refs['codePopup'].close()
					this.$refs['secondLogin'].close()
				})
			},
			back() {
				this.$refs['codePopup'].close()
			},
			openPopup(val) {
				if (val === 'phone') {
					this.getPhone = ''
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return
					this.$refs['popup'].open('bottom')
				} else {
					//ifdef MP-WEIXIN
					uni.getProvider({
						service: 'oauth',
						success: (res) => {
							if (res.provider.indexOf('weixin') > -1) {
								uni.login({
									provider: res.provider[0],
									success: (loginRes) => {
										uni.getUserInfo({
											provider: res.provider[0],
											success: (infoRes) => {
												//掉后台接口
											}
										});
									}
								});
							}
						}
					})
					//endif
					//ifdef H5
					let app_id = 'xxx';
					// 授权后重定向的回调地址。可设置为后端接口，用于接受code参数；也可设置为前端页面链接，前端接收code后，再调用后端接口，处理后续逻辑
					let redirect_uri = 'xxx'; 
					//静默登录
					window.location.href =
						`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${app_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
					//endif
				}

			},
			formPhone(val) {
				var tel = '' + val
				var reg = /(\d{3})\d{4}(\d{4})/
				var tel1 = tel.replace(reg, "$1****$2")
				return tel1
			},
			getTimer() {
				this.timer = setInterval(() => {
					if (this.count == 0) {
						clearInterval(this.timer)
						return
					}
					this.count--
				}, 1000)
			},
			getCode() {
				if (!this.getPhone) {
					this.$refs['uToastRef'].show({
						type: 'error',
						icon: false,
						message: "请输入手机号",
						complete() {
							params.url && uni.navigateTo({
								url: params.url
							});
						}
					});
					return
				}
				getTelCode({
					phone: this.getPhone
				}).then(res => {
					this.$refs['codePopup'].open('bottom')
					if (this.count == 0) {
						this.count = 60
						this.getTimer()
					} else {
						this.getTimer()
					}
				})
			},
			codeNumInputFun(e) {
				let val = e.detail.value
				this.code = val
				if (val.length == 5) this.isCode = false
				else this.isCode = true
			},
			codeNumBlurFun(e) {
				let val = e.detail.value
				this.focus = false
				if (val.length == 5) this.isCode = false
				else this.isCode = true
			},
			codefocusFun(index) {
				this.focus = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		padding: 32rpx 40rpx;
	}
	.content {
		.heads {
			text-align: center;
			background: #FFFFFF;
			padding: 28rpx 32rpx;
			.no-logged-state {
				.tops {
					display: flex;
					image {
						width: 84rpx;
						height: 84rpx;
					}
					.rights {
						margin-left: 26rpx;
						display: flex;
						justify-content: space-between;
						flex-direction: column;
						text-align: left;
						.no-login {
							color: #000;
							font-family: "PingFang SC";
							font-size: 28rpx;
							font-style: normal;
							font-weight: 600;
							line-height: normal;
							.login-experience {
								color: rgba(0, 0, 0, 0.60);
								font-family: "PingFang SC";
								font-size: 24rpx;
								font-style: normal;
								font-weight: 400;
								line-height: normal;
							}
						}
					}
				}
				.bottoms {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 28rpx;
					.sign-in-now {
						flex: 1;
						height: 80rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 12rpx;
						background: #2356FD;
						color: #FFF;
						font-family: "PingFang SC";
						font-size: 28rpx;
						font-style: normal;
						font-weight: 600;
						line-height: normal;
					}
					image {
						width: 80rpx;
						height: 80rpx;
						margin-left: 60rpx;
					}
				}
			}
			.log-state {
				display: flex;
				align-items: center;
				image {
					width: 84rpx;
					height: 84rpx;
				}
				.login-info-phone {
					margin-left: 28rpx;
					color: #000;
					font-family: "PingFang SC";
					font-size: 32rpx;
					font-style: normal;
					font-weight: 600;
					line-height: normal;
				}
			}
		}
		.account {
			background: #FFFFFF;
			padding: 24rpx 24rpx 22rpx 32rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			margin-top: 44rpx;
			height: 124rpx;
			image {
				width: 60rpx;
				height: 60rpx;
			}
			.gzgzh {
				flex: 1;
				font-family: "PingFang SC";
				font-style: normal;
				margin-left: 24rpx;
				height: 78rpx;
				display: flex;
				align-items: left;
				justify-content: space-between;
				flex-direction: column;
				.titles {
					color: #000;
					font-size: 28rpx;
					font-weight: 600;
					line-height: normal;
				}
				.desc {
					color: rgba(0, 0, 0, 0.60);
					font-size: 24rpx;
					font-weight: 400;
					line-height: normal;
				}
			}
			.img {
				width: 32rpx;
				height: 32rpx;
			}
		}
		.my-service {
			background: #FFFFFF;
			border-radius: 8rpx;
			margin-top: 24rpx;
			padding-bottom: 30rpx;
			.servicetitles {
				padding: 34rpx 50rpx 0rpx 30rpx;
				color: #000;
				font-family: "PingFang SC";
				font-size: 28rpx;
				font-style: normal;
				font-weight: 600;
				line-height: normal;
			}
			.servicetype {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-top: 40rpx;
				.imginfo {
					flex: 1;
					display: flex;
					align-items: center;
					flex-direction: column;
					image {
						width: 52rpx;
						height: 52rpx;
					}
					.infos {
						color: #000;
						font-family: "PingFang SC";
						font-size: 24rpx;
						font-style: normal;
						font-weight: 400;
						line-height: normal;
						margin-top: 14rpx;
					}
				}
			}
		}
		.others-class {
			background: #FFFFFF;
			padding: 48rpx 30rpx;
			border-radius: 8rpx;
			margin-top: 24rpx;
			margin-bottom: 40rpx;
			.tops, .bottoms {
				display: flex;
				justify-content: space-between;
			}
			.tops {
				margin-bottom: 48rpx;
			}
			.imgdec {
				width: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-direction: column;
				image {
					width: 48rpx;
					height: 48rpx;
				}
				.infos {
					margin-top: 16rpx;
					color: #000;
					font-family: "PingFang SC";
					font-size: 24rpx;
					font-style: normal;
					font-weight: 400;
					line-height: normal;
				}
			}
		}
	}

	.popup-content {
		height: 1000rpx;
		background-color: #fff;
	}

	.input-content {
		padding: 50rpx;
		box-sizing: border-box;
	}

	.input-list {
		position: relative;
		width: 100%;
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.list-left {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 150rpx;
		height: 100rpx;
		background-color: #ccc;
	}

	.list-left:after {
		position: absolute;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto 0;
		display: block;
		width: 1px;
		height: 60rpx;
		background-color: #000;
		content: '';
	}

	.list-right {
		/* position: relative; */
		flex: 1;
	}

	.input-list input {
		width: 100%;
		height: 100rpx;
		padding: 0 20rpx;
		box-sizing: border-box;
		background-color: #ccc;
	}

	.input-list .uni-icon {
		position: absolute;
		right: 10rpx;
	}

	.code-popup-content {
		height: calc(100vh - 88rpx);
		padding: 20rpx;
		box-sizing: border-box;
		background-color: #fff;
	}

	.code-popup-content .title {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100rpx;
	}

	.title .icon {
		position: absolute;
		left: 0;
	}

	.phone_code_single_cinput {
		position: fixed;
		left: -100rpx;
		width: 50rpx;
		height: 50rpx;
	}

	.phone_code_single_codeinput {
		height: 100rpx;
		display: flex;
		justify-content: space-between;
	}

	.phone_code_single_codeinput>view {
		margin-top: 5rpx;
		margin-left: 15rpx;
		width: 100rpx;
		height: 100rpx;
		line-height: 86rpx;
		font-size: 60rpx;
		font-weight: bold;
		color: #313131;
		text-align: center;
		border-radius: 10rpx;
	}

	.phone_code_single_codeinput>view:nth-child(1) {
		margin-left: 0rpx;
	}

	.phone_code_single {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
	}
</style>