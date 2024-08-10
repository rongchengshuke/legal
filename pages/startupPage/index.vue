<template>
  <view class="container">
    <image class="bg" src="../../static/image/blb-icon.png" mode="" />
    <view class="titles">病历宝</view>
    <!-- <web-view src="https://39757c03g9.oicp.vip/invite?id=zhangHeng"></web-view> -->
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
    background: #00CB9B;
    display: flex;
    align-items: center;
    flex-direction: column;
    .bg {
      width: 228rpx;
      height: 228rpx;
      margin-top: 500rpx;
    }
    .titles {
      color: #FFF;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 40rpx;
      font-style: normal;
      font-weight: 600;
      line-height: 44rpx; 
      letter-spacing: -0.816rpx;
      margin-top: 64rpx;
    }
  }
</style>
