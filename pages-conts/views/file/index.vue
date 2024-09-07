titleName<template>
	<view class="container">
    <!-- <uni-nav-bar :fixed="true" shadow left-icon="left" :title="titleName" @clickLeft="navigateBack" /> -->
    <view class="recentHistory">
			<view class="recentHistory-list">
				<view class="recentHistory-item" v-for="(item, index) in dataList" :key="index" @click="detailsFn(item)">
					<image :src="item.thumb_img" @click.stop="preview(item.thumb_img)" /> 
					<view class="recentHistory-item-docDetail">
						<text class="docDetailName">{{ item.task_name }}</text>
						<text class="docDetailDate">{{ timestamp(item.created_time*1000) }}</text>
					</view>
				</view>
			</view>
		</view>
    <view class="upload-class" @click="uploadFn">
      <img src="../../../static/image/file.png" />
    </view>
  </view>
</template>
<script>
	import utils from '../../../util/utils';
	import api from '../../../util/api';
	export default {
		data() {
			return {
				title: 'Hello',
				dataList: [],
				tokenData: '',
        titleName: '',
        category_id: 0,
        typeBack: '',
			}
		},
    onLoad(option) {
      this.titleName = option.name
			uni.setNavigationBarTitle({
				title: option.name
			})
      this.typeBack = option.type
      this.category_id = option.category_id
      this.getData()
    },
		async onShow() {
			if (utils.is_weixin()) {
				utils.pageHead()
			}
			await this.getData()
		},
		methods: {
      navigateBack() {
        uni.switchTab({
          url: `/pages/${this.typeBack}/index`
        });
      },
			getData() {
				api.myGSSMainRequest({
					url: '/api/task/list',
					method: 'GET',
					header: {
						Authorization: this.tokenData
					},
          data: {
            category_id: this.category_id
          }
				}).then((res) => {
					if (res.code === 200) {
						this.dataList = res.data
					} else {
						this.dataList = []
					}
				})
			},
      uploadFn() {
        uni.chooseImage({
					count: 20,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (resPath) => {
						this.uploadFile(resPath.tempFilePaths, 'h5')
					}
				});
      },
      uploadFile(files, type) {
				const urlsArr = []
				const uploadTasks = api.myRequestUploadFile({ files, type })
				Promise.all(uploadTasks).then((res) => {
					res.forEach((item) => {
						const paraseItem = JSON.parse(item)
						if (paraseItem.code === 200) {
							urlsArr.push(paraseItem.data[0])
						}
					})
					setTimeout(() => {
						uni.navigateTo({
							url: `/pages-conts/views/upImgDisplay/index?imgList=${JSON.stringify(urlsArr)}&category_id=${this.category_id}`
						})
					})
				}).catch((err) => {
					console.log('上传失败', err)
				})
			},
			preview(imgs) {
				uni.previewImage({
					urls: [imgs],
				});
			},
      detailsFn(item) {
				uni.navigateTo({
					url: `/pages/previewEvidence/index?id=${item.id}&types=img`
				})
			},
			timestamp(time) {
				return utils.convertTimestamp(time)
			}
		}
	}
</script>

<style scoped lang="less">
::v-deep .uni-navbar__content {
  background-color: rgba(248, 248, 248)!important;
  border: 0px!important;
  .uni-navbar__header {
    background-color: rgba(248, 248, 248)!important;
    color: rgba(0,0,0)!important;
    border: 0px!important;
  }
}
.container {
  .recentHistory{
    padding: 20px 10px 20px 10px;
    margin-bottom: 10px;
    &-item{
      display: flex;
      margin-bottom: 10px;
      background-color: #FFFFFF;
      padding: 10px;
      image{
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      &-docDetail{
        display: flex;
        flex-direction: column;
        .docDetailName{
          font-size: 14px;
          margin-bottom: 6px;
        }
        .docDetailDate{
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  .upload-class {
    width: 50rpx;
    height: 50rpx;
    background: #FFFFFF;
    border-radius: 50%;
    position: absolute;
    right: 40rpx;
    bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    image {
      width: 50rpx;
      height: 50rpx;
    }
  }
}
</style>
