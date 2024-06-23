<template>
  <view class="container">
    <image class="bg" src="../../static/image/qidong.png" mode="" />
    <image class="wenzi" src="../../static/image/zhengjubao.png" mode="" />
  </view>
</template>
<script>
	export default {
		data() {
			return {
				
			}
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
  }
</style>
