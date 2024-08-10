<template>
	<view class="wrapper">
		<view class="tops">
      <image class="bg" src="../../static/image/Mask_group.png" mode="" />
      <image class="back-icon" src="../../static/image/back.png" mode="" @click="backGo" />
      <view class="titles">欢迎登录</view>
    </view>
    <view class="bottoms">
      <view class="popup-content">
				<view class="input-content">
					<view class="input-list">
						<view class="list-left">+86</view>
						<view class="list-right"><input class="uni-input" v-model="area" /></view>
            <u-icon name="arrow-right" color="#333333" size="15"></u-icon>
					</view>
					<view class="input-list mt32">
						<input class="uni-input" v-model="getPhone" placeholder="请输入手机号" type="number" />
					</view>
          <view class="input-list btn" @click="getCode">获取验证码</view>
          <view class="wx-bg-title" @click="openPopup('wx')">
            <image src="../../static/image/wx.png" mode="" />
            <view>微信登录</view>
          </view>
				</view>
			</view>
    </view>
	</view>
</template>

<script>
  import { getTelCode } from '../../api/index.js'
	export default{
		data() {
			return {
				phone:'',
				getPhone: '',
				area: '中国'
			}
		},
		async onLoad(option) {
      this.getPhone = option.getPhone
    },
		methods:{
			getCode() {
				if (!this.getPhone) {
          uni.showToast({ title: '请输入手机号', icon: 'error' })
					return
				}
				getTelCode({ phone: this.getPhone}).then(res => {
          uni.navigateTo({
            url: `/pages/inputCode/index?getPhone=${this.getPhone}`
          })
				})
			},
      openPopup() {
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
  }
  .bottoms {
    position: relative;
    padding-top: 44rpx;
    z-index: 1;
    .popup-content {
      .input-content {
        .input-list {
          width: 466rpx;
          height: 108rpx;
          display: flex;
          align-items: center;
          background: #F4F7F4;
          border-radius: 54rpx;
          padding: 0rpx 40rpx;
          margin: 0 auto;
          .list-left {
            height: 30rpx;
            line-height: 30rpx;
            color: #000000;
            font-style: normal;
            font-weight: bold;
            padding-right: 30rpx;
            font-size: 36rpx;
            border-right: 2rpx solid #000000;
          }
          .list-right {
            padding-left: 30rpx;
            color: #000000;
            font-style: normal;
            font-weight: bold;
            font-size: 32rpx;
          }
          ::v-deep .u-icon__icon {
            font-weight: bold!important;
          }
          .uni-input {
            width: 100%;
          }
        }
        .mt32 {
          margin-top: 32rpx;
        }
        .btn {
          background: #00CB9B;
          color: #FFFFFF;
          font-size: 36rpx;
          font-style: normal;
          font-weight: 500;
          justify-content: center;
          margin-top: 66rpx;
        }
        .wx-bg-title {
          width: 120rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #333;
          text-align: center;
          font-family: "PingFang SC";
          font-size: 28rpx;
          font-style: normal;
          font-weight: 400;
          position: absolute;
          bottom: -340rpx;
          left: calc(50% - 60rpx);
          image {
            width: 88rpx;
            height: 88rpx;
          }
        }
      }
    }
  }
}
</style>