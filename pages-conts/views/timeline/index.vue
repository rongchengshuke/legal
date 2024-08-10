<!-- 时间轴 -->
<template>
	<view class="container" :style="{height: scrollHeight + 'px'}">
    <view class="item-class" v-for="(item, index) in tableData" :key="index">
      <view class="tops">
        <view class="dot"></view>
        <view>{{ item.month }}</view>
      </view>
      <view class="img-all">
        <view class="item-img" v-for="(itmImg, itmIdx) in item.imgs" :key="itmIdx">
          <image :src="itmImg" mode="aspectFill" />
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	import api from '../../../util/api';
	export default {
		data() {
			return {
				tableData: [],
				scrollHeight: 0,
        objHeight: {
					h2: '',
					h3: '',
				}
			}
		},
		onReady() {
			const _t = this
			uni.getSystemInfo({
				success: (res) => {
					let allHeight = res.windowHeight
					setTimeout(() => {
            _t.scrollHeight = allHeight - 20
          },500)
				}
			})
		},
		onLoad(option) {
      this.getData()
		},
		methods: {
      getData() {
        api.myGSSMainRequest({
					url: '/api/task/dateRangeList',
					method: 'GET',
					data: {
						start: '2024-04-01',
						end: '2035-07-01'
					}
				}).then((res) => {
					if (res.code === 200) {
						this.tableData = res.data
					} else {
						this.tableData = []
					}
				})
      },
			preview(imgs) {
				uni.previewImage({
					urls: [imgs],
				});
			},
		}
	}
</script>

<style lang="less" scoped>
.container {
  overflow-y: auto;
  .item-class {
    width: calc(100% - 60rpx);
    margin-left: 24rpx;
    .tops {
      display: flex;
      align-items: center;
      color: #1A1A1A;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 32rpx;
      font-style: normal;
      font-weight: bold;
      margin-bottom: 20rpx;
      .dot {
        width: 22rpx;
        height: 22rpx;
        border-radius: 50%;
        background: #00CB9B;
        margin-right: 20rpx;
      }
    }
    .img-all {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      width: calc(100% - 10rpx);
      margin-left: 8rpx;
      border-left: 4rpx dashed #EAEAEA;
      .item-img {
        width: 320rpx;
        height: 320rpx;
        margin-bottom: 20rpx;
        border-radius: 4px;
        background: #F5F5F5;
        margin-left: 20rpx;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
