<template>
  <view class="container">
    <image class="bg" src="../../static/image/qidong.png" mode="" />
    <!-- <image class="wenzi" src="../../static/image/zhengjubao.png" mode="" /> -->
     <view class="titles">病历宝</view>
  </view>
</template>
<script>
	export default {
		data() {
			return {}
		},
		onShow() {
      setTimeout(() => {
        uni.switchTab({
          url: `/pages/index/index`
        });
      }, 2000)
    },
		methods: {}
	}
</script>

<style scoped lang="less">
  .container {
    width: 100%;
    height: 100vh;
    background: linear-gradient(196deg, #E9E4F7 0%, #E4EEF7 46.78%, rgba(255, 255, 255, 0.00) 80.4%);
    display: flex;
    align-items: center;
    flex-direction: column;
    .bg {
      width: 500rpx;
      height: 500rpx;
      margin-top: 200rpx;
    }
    .wenzi {
      width: 240rpx;
      height: 60rpx;
      margin-top: 90rpx;
    }
    .titles {
      width: 440rpx;
      height: 60rpx;
      margin-top: 90rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 80rpx;
      font-style:italic;
      letter-spacing: 10rpx;
      font-weight: 600;
    }
  }
</style>
