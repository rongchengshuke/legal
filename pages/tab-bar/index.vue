<template>
	<view class="cxy-tab-bar">
		<view v-for="(item, index) in tabBarArr" :key="index" class="tab-bar-item" @click="switchTabFn(item, index)">
			<template v-if="index != 2">
				<image class="tab_img" :src="activeBar === index ? item.selectedIconPath : item.iconPath" />
				<view class="tab_text" :style="{color: activeBar === index ? selectedColor : color}">
					<view >{{item.text}}</view>
				</view>
			</template>
			<template v-else>
				<image class="camer-class" src="../../static/image/camera.png" />
			</template>
		</view>
	</view>
</template>
<script>
  import api from '../../util/api';
	export default {
		props: {
			activeBar: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				color: "#7A7E83",
				selectedColor: "#228be6",
				tabBarArr: [
          {
						centerItem: false,
						pagePath: "/pages/index/index",
						iconPath: "/static/image/home.png",
						selectedIconPath: "/static/image/homeSe.png",
						text: "首页"
					},
          {
						centerItem: false,
						pagePath: "/pages/documents/index",
						iconPath: "/static/image/files.png",
						selectedIconPath: "/static/image/filesSe.png",
						text: "档案"
					},
          {},
					{
						centerItem: false,
						pagePath: "/pages/evidenceMenu/index",
						iconPath: "/static/image/list.png",
						selectedIconPath: "/static/image/listSe.png",
						text: "目录"
					},
          {
						centerItem: false,
						pagePath: "/pages/personalCenter/index",
						iconPath: "/static/image/my.png",
						selectedIconPath: "/static/image/mySe.png",
						text: "我的"
					}
				]
			}
		},
		methods: {
			switchTabFn(item, index) {
        if (index === 2) {
          uni.chooseImage({
            count: 20,
            sizeType: ['original', 'compressed'],
            sourceType: ['camera'],
            success: (resPath) => {
              this.uploadFile(resPath.tempFilePaths, 'h5')
            }
          });
        } else {
          uni.switchTab({
            url: item.pagePath
          })
        }
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.cxy-tab-bar {
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		right: 0;
		height: calc(100rpx + env(safe-area-inset-bottom));
		background: white;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #fff;
    border-top: 2rpx solid rgba(0, 0, 0, 0.33);;
		.tab-bar-item {
			flex: 1;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			background-color: #fff;
			height: 100%;
			.tab_img {
				width: 50rpx;
				height: 50rpx;
			}
			.tab_text {
				font-size: 24rpx;
			}
		}
    .camer-class {
      width: 100rpx;
      height: 100rpx;
      position: absolute;
      z-index: 1000;
      top: -16rpx;
    }
	}
</style>