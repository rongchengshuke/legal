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
				<table border="0" cellspacing="0" cellpadding="5">
			    <thead>
			      <tr>
			        <th width="50" align="center">序号</th>
			        <th width="80" align="center">病历名称</th>
			        <th width="150" align="center">证明对象</th>
			        <th width="50" align="center">页码</th>
			      </tr>
			    </thead>
			    <tbody>
			      <tr v-for="(item, index) in tableData" :key="index">
			        <td align="center" v-if="item.nameRowspan > 0" :rowspan="item.nameRowspan">{{ item.num }}</td>
			        <td align="center" v-if="item.nameRowspan > 0" :rowspan="item.nameRowspan">{{ item.name }}</td>
			        <td align="center">
			          {{ item.obj }}
			          <div class="color-class" @click="preview(item.url)">病历图片</div>
			        </td>
			        <td align="center" v-if="item.page_rangeRowspan > 0" :rowspan="item.page_rangeRowspan">{{ item.page_range }}</td>
			      </tr>
			    </tbody>
			  </table>
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
						// 设置下载的文件名
						oA.download = `${this.catalog_name}.zip` // todo改成 当前档案的名称
						// Blob临时路径再保存到本地
						oA.href = res.tempFilePath
						// 插入DOM并执行点击下载
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
		// white-space: nowrap;
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
</style>
