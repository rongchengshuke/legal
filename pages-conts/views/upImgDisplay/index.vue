<!-- 档案 -->
<template>
	<view class="container" :style="{ height: scrollHeight + 'px' }">
		<view class="prelist" v-if="reseveList.length > 0">
			<view class="prelist-imgBox" v-for="(item, index) in reseveList" :key="index">
				<image :src="item" @click="preview(item)" />
				<uni-icons type="clear" size="30" color="#FFFFFF" @click="deleteImg(item, index)"></uni-icons>
			</view>
		</view>
		<view class="tables" v-if="tableData.length">
			<view class="table">
				<!-- 表头 -->
				<view class="row header">
					<view class="cell num-column">序号</view>
					<view class="cell name-column">病历名称</view>
					<view class="cell obj-column">证明对象</view>
					<view class="cell page-column">页码</view>
				</view>
				<!-- 数据行 -->
				<view v-for="(item, index) in tableData" :key="index" class="row">
					<view v-if="item.nameRowspan > 0" class="cell num-column flex-center" :style="{ 'grid-row': `span ${item.nameRowspan}` }">{{ item.num }}</view>
					<view v-if="item.nameRowspan > 0" class="cell name-column flex-center" :style="{ 'grid-row': `span ${item.nameRowspan}` }">{{ item.name }}</view>
					<view class="cell obj-column">
						{{ item.obj }}
						<view class="color-class" @click="preview(item.url)">病历图片</view>
					</view>
					<view v-if="item.page_rangeRowspan > 0" class="cell page-column flex-center" :style="{ 'grid-row': `span ${item.page_rangeRowspan}` }">{{ item.page_range }}</view>
				</view>
			</view>
		</view>
		<view class="fixBtn">
			<text class="btn1" @click="uploadFn(1)">拍照</text>
			<text class="btn2" @click="uploadFn(2)">本地图片</text>
			<text v-if="tableData.length" class="btn3" @click="downloadFn()">档案下载</text>
			<text class="btn4" @click="generateTable">{{ tableData.length ? '再次生成' : '生成表格' }}</text>
		</view>
	</view>
</template>

<script>
	import utils from '../../../util/utils';
	import api from '../../../util/api';
	export default {
		data() {
			return {
				rowColumn: ['name', 'page_range'],
				reseveList: [],
				task_id: '',
				tableData: [],
				scrollHeight: 0,
        objHeight: {
					h2: '',
					h3: '',
				},
				tokenData: '',
				category_id: '',
				catalogId: '',
				catalog_name: ''
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
			this.category_id = option.category_id ? option.category_id : ''
			const imgList = JSON.parse(option.imgList)
			this.getData(imgList)
		},
		onShow() {
			if (utils.is_weixin()) {
				utils.pageHead()
			}
		},
		methods: {
			preview(imgs) {
				uni.previewImage({
					urls: [imgs],
				});
			},
			getData(arr) {
				api.myGSSMainRequest({
					url: '/api/task/add',
					method: 'POST',
					requestType: 'application/json',
					data: {
						urls: arr,
						category_id: this.category_id
					}
				}).then((res) => {
					if (res.code === 200) {
						this.reseveList = res.data.urls
						this.task_id = res.data.task_id
					}
				})
			},
			deleteImg(item, idx) {
				api.myGSSMainRequest({
					url: '/api/index/delImg',
					method: 'POST',
					data: {
						task_id: this.task_id,
						urls: [item]
					}
				}).then((res) => {
					if (res.code === 200) {
						uni.showToast({ title: res.message, icon: 'success'	})
						this.reseveList = this.reseveList.filter(itom => itom !== item);
						// 存储为了是h5刷新界面后面添加的图片没有了
						uni.setStorageSync('imgArr', JSON.stringify(this.reseveList));
					}
				})
			},
			uploadFn(type) {
				// #ifdef MP-WEIXIN
				uni.chooseMedia({
				  count: 20,
				  mediaType: ['image'],
				  sourceType: type == 1 ? ['camera'] : ['album'],
				  maxDuration: 30,
					success: (resPath) => {
						this.uploadFile(resPath.tempFiles, 'wx')
					}
				})
				// #endif
				// #ifdef H5 || APP-PLUS
				uni.chooseImage({
					count: 20,
					sizeType: ['original', 'compressed'],
					sourceType: type == 1 ? ['camera'] : ['album'],
					success: (resPath) => {
						this.uploadFile(resPath.tempFilePaths, 'h5')
					}
				});
				// #endif
			},
			uploadFile(files, type) {
				const urlsArr = []
				const uploadTasks = api.myRequestUploadFile({ 
					files, 
					type,
					formData: {
						task_id: this.task_id
					},
				})
				Promise.all(uploadTasks).then((res) => {
					res.forEach((item) => {
						const paraseItem = JSON.parse(item)
						if (paraseItem.code === 200) {
							urlsArr.push(paraseItem.data[0])
						}
					})
					this.reseveList = this.reseveList.concat(urlsArr)
					setTimeout(() => {
						// 存储为了是h5刷新界面后面添加的图片没有了
						uni.setStorageSync('imgArr', JSON.stringify(this.reseveList))
					})
				}).catch((err) => {
					console.log('上传失败', err)
				})
			},
			generateTable() {
				api.myGSSMainRequest({
					url: '/api/index/aiAnalysis',
					method: 'POST',
					data: {
						task_id: this.task_id
					}
				}).then((res) => {
					if (res.code === 200) {
						const arrs = utils.calculateRowSpansByFields(res.data.tableData, this.rowColumn);
						this.catalogId = res.data.catalog_id;
						this.catalog_name = res.data.catalog_name
						this.tableData = arrs
					} else {
						this.tableData= []
					}
				})
			},
			downloadFn() {
				api.downloadFileFn({
					url: `/api/catalog/download?catalog_id=${this.catalogId}`,
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
		},
		onUnload() {
			uni.removeStorageSync('imgArr');
		}
	}
</script>

<style scoped lang="less">
.container {
	overflow-y: auto;
	.prelist {
		width: 100%;
		padding: 10px 0px;
		display: flex;
		flex-wrap: wrap;
		&-imgBox{
			display: inline-block;
			width: calc((100% - 30px)/3);
			height: 150px;
			text-align: center;
			box-sizing: border-box;
			border-radius: 5px;
			margin: 0px 5px;
			border: 1px solid #999;
			position: relative;
			image{
				width: 100%;
				height: 100%;
			}
			::v-deep .uni-icons {
				position: absolute;
				top: 0px;
				right: 0px; 
				z-index: 1; 
			}
		}
	}
	.tables {
		width: calc(100% - 10px);
		margin: 0px 5px;
		td {
			uni-view {
				display: inline;
			}
		}
	}
	.fixBtn{
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
		text{
			width: 90px;
			height: 30px;
			line-height: 30px;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px solid #1c7ed6;
			font-size: 13px;
			border-radius: 15px;
			color: #1c7ed6;
			cursor: pointer;
		}
		.btn1, .btn2, .btn3 {
			margin-right: 10px;
		}
		.btn1 {
			width: 50px;
		}
		.btn2, .btn4 {
			width: 70px;
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
  grid-template-columns: 80rpx 160rpx 1fr 80rpx; /* 序号和页码宽度较窄，病历名称宽度较宽 */
  border: 1px solid #ccc;
}
.row {
  display: contents;
}
.cell {
  padding: 20rpx;
  border: 2rpx solid #ccc;
  text-align: center;
}
.header .cell {
  font-weight: bold;
  background-color: #f0f0f0;
}
.color-class {
  color: blue;
  cursor: pointer;
}
.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
