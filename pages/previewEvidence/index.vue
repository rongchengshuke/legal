<!-- 档案 -->
<template>
	<view class="container" :style="{height: scrollHeight + 'px'}">
    <view v-if="types !== 'table'">
      <view  class="prelist" v-if="reseveList.length">
        <view class="prelist-imgBox" v-for="(item, index) in reseveList" :key="index" 
					:class="{'mr20': index / 2 ===0 }">
          <image :src="item" :mode="aspectFillType" @click="preview(item)" />
        </view>
      </view>
    </view>
		<view v-if="types !== 'img'">
      <view class="tables" v-if="tableData.length">
				<view class="table">
					<!-- 表头 -->
					<view class="row header">
						<view class="cell">序号</view>
						<view class="cell">病历名称</view>
						<view class="cell">证明对象</view>
						<view class="cell">页码</view>
					</view>
					<!-- 数据行 -->
					<view v-for="(item, index) in tableData" :key="index" class="row">
						<view v-if="item.nameRowspan > 0" class="cell flex-center" :style="{ 'grid-row': `span ${item.nameRowspan}` }">{{ item.num }}</view>
						<view v-if="item.nameRowspan > 0" class="cell flex-center" :style="{ 'grid-row': `span ${item.nameRowspan}` }">{{ item.name }}</view>
						<view class="cell">
							{{ item.obj }}
							<view class="color-class" @click="preview(item.url)">病历图片</view>
						</view>
						<view v-if="item.page_rangeRowspan > 0" class="cell flex-center" :style="{ 'grid-row': `span ${item.page_rangeRowspan}` }">{{ item.page_range }}</view>
					</view>
				</view>
      </view>
    </view>
		<view v-if="types !== 'img'" class="fixBtn" @click="downloadFn()">
			<image src="../../static/image/xiazai.png" mode="" />
			档案下载
		</view>
	</view>
</template>

<script>
	import utils from '../../util/utils';
	import api from '../../util/api';
	export default {
		data() {
			return {
				rowColumn: ['name', 'page_range'],
				reseveList:[],
				task_id: '',
				tableData: [],
				scrollHeight: 0,
        objHeight: {
					h2: '',
					h3: '',
				},
        types: '',
				catalog_name: '',
				aspectFillType: 'aspectFill'
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
      this.types = option.types
			this.catalog_name = option.catalog_name ? option.catalog_name : ''
      this.id = option.id
      if (this.types === 'img') {
        this.getDataImg()
      } else if (this.types === 'table') {
        this.getDataTable()
      }
		},
		methods: {
			downloadFn() {
				api.downloadFileFn({
					url: `/api/catalog/download?catalog_id=${this.id}`,
					method: 'GET',
					requestType: 'application/vnd.ms-excel',
					responseType: 'blob',
				}).then((res) => {
					if (res.statusCode === 200) {
						let oA = document.createElement("a")
						oA.download = `${this.catalog_name}.zip`
						oA.href = res.tempFilePath
						document.body.appendChild(oA)
						oA.click()
						oA.remove()
					}
				})
			},
			getDataImg() {
				api.myGSSMainRequest({
					url: '/api/task/imgs',
					method: 'GET',
					requestType: 'application/json',
					data: {
						task_id: this.id
					}
				}).then((res) => {
					if (res.code === 200) {
						this.reseveList = res.data
            this.tableData = []
					}
				})
			},
      getDataTable() {
				api.myGSSMainRequest({
					url: '/api/catalog/detail',
					method: 'GET',
					requestType: 'application/json',
					data: {
						catalog_id: this.id
					}
				}).then((res) => {
					if (res.code === 200) {
						this.tableData = utils.calculateRowSpansByFields(res.data.tableData, this.rowColumn)
            this.reseveList = []
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

<style scoped lang="less">
.container {
  overflow-y: auto;
	padding-bottom: 20rpx;
	.prelist {
		padding: 20rpx;
		display: flex;
		flex-wrap: wrap;
		overflow-y: auto;
		&-imgBox{
			width: calc((100% - 20rpx)/2);
			height: 340rpx;
			background: #F5F5F5;
			border-radius: 8rpx;
			margin-bottom: 28rpx;
			image{
				height: 100%;
				width: 100%; 
			}
		}
		.mr20 {
			margin-right: 20rpx;
		}
	}
	.tables {
		// width: calc(100% - 10px);
		margin: 10rpx 16rpx 28rpx 16rpx;
	}
	.fixBtn{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 320rpx;
		height: 80rpx;
		margin: auto;
		border-radius: 48rpx;
		background: #00CB9B;
		box-shadow: 0rpx 10rpx 20rpx 0rpx #B2C4FF;
		color: #E2EFFF;
		text-align: center;
		font-family: "PingFang SC";
		font-size: 16px;
		font-style: normal;
		font-weight: 400;
		line-height: normal;
		image {
			width: 24rpx;
			height: 26rpx;
			margin-right: 10rpx;
		}
	}
	.color-class {
		color: #456DEC;
	}
}
table{
	width: 100%;
	box-sizing: border-box;
	border-top: 1px solid #dfe2e5; 
	border-left: 1px solid #dfe2e5;
	border: 1px solid #dfe2e5;
}
th{
	border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;
}
td{
	border-right: 1px solid #dfe2e5; border-bottom: 1px solid #dfe2e5;
}
.table {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid #ccc;
}
.row {
  display: contents;
}
.cell {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}
.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}
.header .cell {
  font-weight: bold;
  background-color: #f0f0f0;
}
.color-class {
  color: blue;
  cursor: pointer;
}
</style>
