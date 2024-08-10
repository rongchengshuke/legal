<template>
	<view class="wrapper">
		<view class="tops">
      <image class="bg" src="../../static/image/Mask_group.png" mode="" />
      <image class="back-icon" src="../../static/image/back.png" mode="" @click="backGo" />
      <view class="titles">输入验证码</view>
      <view class="codes">验证码已发送至+86 {{formPhone(getPhone)}}</view>
    </view>
    <view class="bottoms">
      <view class="popup-content">
        <up-code-input :space="30" v-model="code" :focus="true" :maxlength="5" @finish="loginFn">
        </up-code-input>
        <view class="djs" v-if="count > 0" style="margin-top: 30rpx;">{{count}}秒后可重新发送</view>
        <view class="djs" v-else @click="getCode" style="margin-top: 30rpx;">重新发送</view>
      </view>
    </view>
	</view>
</template>

<script>
  import { getTelCode, login } from '../../api/index.js'
	export default{
		data() {
			return {
				phone:'',
				getPhone: '',
				area: '中国',
				timer: null, 
				count: 60, 
				code: "",  
				token: ''
			}
		},
		onLoad(option) {
			this.getPhone = option.getPhone
      if (this.count == 0) {
        this.count = 60
        this.getTimer()
      } else {
        this.getTimer()
      }
		},
		methods:{
      loginFn() {
				login({ phone: this.getPhone, code: this.code }).then(res => {
					this.token = res.data.token
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('phone', this.getPhone);
					this.phone = this.getPhone
					this.getPhone = ''
					this.code = ''
					this.count = 60
					clearInterval(this.timer)
          setTimeout(() => {
            uni.switchTab({
              url: `/pages/index/index`
            });
          });
				})
			},
      formPhone(val) {
				let tel = '' + val
				let reg = /(\d{3})\d{4}(\d{4})/
				let tel1 = tel.replace(reg, "$1****$2")
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
        this.code = ''
				if (!this.getPhone) {
          uni.showToast({ title: '请输入手机号', icon: 'error' })
					return
				}
				getTelCode({ phone: this.getPhone}).then(res => {
					if (this.count == 0) {
						this.count = 60
						this.getTimer()
					} else {
						this.getTimer()
					}
				})
			},
      backGo() {
        uni.navigateBack()
      }
		}
	}
</script>
<style lang="scss" scoped>
.wrapper {
  background: #FFFFFF;
  height: 100vh;
  .tops {
    width: 750rpx;
    height: 400rpx;
    .bg {
      width: 100%;
      height: 400rpx;
      position: absolute;
      z-index: 0;
    }
    .back-icon {
      width: 60rpx;
      height: 60rpx;
      position: absolute;
      z-index: 0;
      top: 106rpx;
      left: 36rpx;
    }
    .titles {
      color: #000;
      font-family: "PingFang SC";
      font-size: 64rpx;
      font-style: normal;
      font-weight: 500;
      position: absolute;
      top: 260rpx;
      left: 100rpx;
    }
    .codes {
      color: #000;
      font-family: "PingFang SC";
      font-size: 28rpx;
      font-style: normal;
      position: absolute;
      top: 380rpx;
      left: 100rpx;
    }
  }
  ::v-deep .bottoms {
    position: relative;
    padding-top: 80rpx;
    z-index: 1;
    .popup-content {
      width: calc(100% - 160rpx);
      margin-left: 80rpx;
      .u-code-input {
        .u-code-input__item {
          width: 121rpx;
          height: 121rpx;
          border: 1rpx solid #F4F7F4!important;
          border-radius: 54rpx;
          background: #F4F7F4;
          margin-right: 36rpx!important;
        }
      }
      .djs {
        color: #00CB9B;
        font-family: "PingFang SC";
        font-size: 28rpx;
        font-style: normal;
        font-weight: 400;
      }
    }
  }
}
</style>