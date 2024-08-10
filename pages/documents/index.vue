<template>
	<view class="container">
		<view class="search-area">
			<view class="search-area-input">
				<uni-icons class="input-uni-icon" type="search" size="18" color="#999" />
				<input confirm-type="search" class="nav-bar-input" type="text" placeholder="输入搜索关键词"/>
			</view>
		</view>
		<view v-if="dataFileData.length" class="recentHistory">
			<view class="cont" v-for="(item, index) in dataFileData" :key="index" @click="fileView(item)">
				<div class="lefts">
					<image src="/static/image/folder.png" /> 
					<view class="docDetail">
						<text class="docDetailName">{{ item.name }}</text>
						<text class="docDetailDate">{{ timestamp(item.created_time*1000) }}</text>
					</view>
				</div>
				<view class="rights" @click.stop="deleteEdit(item)">···</view>
			</view>
		</view>
		<view v-if="dataList.length" class="recentHistory">
			<u-checkbox-group class="box-class" v-model="checkedArr" @change="changeBox">
				<view class="cont" v-for="(item, index) in dataList" :key="index" @click="detailsFn(item)">
					<div class="lefts">
						<image :src="item.thumb_img" @click.stop="preview(item.thumb_img)" /> 
						<view class="docDetail">
							<text class="docDetailName">{{ item.task_name }}</text>
							<text class="docDetailDate">{{ timestamp(item.created_time*1000) }}</text>
						</view>
					</div>
					<view class="rights">
						<u-checkbox :name="item.id"></u-checkbox>
					</view>
				</view>
			</u-checkbox-group>
		</view>
		<!-- 调取的目录 -->
		<uni-popup class="box-popup" ref="boxFile">
			<view class="conts">
				<view class="hears">
					<view class="left">
						<view class="cha" @click="chaFn">X</view>
						<view>已选{{ checkedArr.length }}项</view>
					</view>
					<view v-if="dataList.length != checkedArr.length" class="grn-class" @click="selectFn('1')">全选</view>
					<view v-if="dataList.length === checkedArr.length" class="grn-class" @click="selectFn('0')">取消全选</view>
				</view>
				<view class="centers">
					<view class="recentHistory">
						<u-checkbox-group class="box-class" v-model="checkedArr" @change="changeBoxselected">
							<view class="cont" v-for="(item, index) in dataList" :key="index" 
								:class="{ 'active-bg': checkedArr.includes(item.id) }">
								<div class="lefts">
									<image :src="item.thumb_img" @click.stop="preview(item.thumb_img)" /> 
									<view class="docDetail">
										<text class="docDetailName">{{ item.task_name }}</text>
										<text class="docDetailDate">{{ timestamp(item.created_time*1000) }}</text>
									</view>
								</div>
								<view class="rights">
										<u-checkbox :name="item.id"></u-checkbox>
								</view>
							</view>
						</u-checkbox-group>
					</view>
				</view>
				<view class="bottoms">
					<view class="btn">移动</view>
					<view v-if="checkedArr.length === 1" class="btn" @click="renameBoxFn">重命名</view>
					<view v-if="checkedArr.length != 1" class="btn">合并</view>
					<view class="btn" @click="deleteTask">删除</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup class="del-class" ref="deleteBox" type="dialog">
			<uni-popup-dialog cancelText="取消" confirmText="确认删除" title="删除" 
				:content="deleteBoxInfo" @confirm="boxConfirm" @close="boxClose">
			</uni-popup-dialog>
		</uni-popup>
		<uni-popup class="re-class" ref="renameBox" type="bottom" background-color="#FFFFFF">
			<view class="titles">重命名</view>
			<view class="inputs">
				<uni-easyinput class="uni-mt-5" v-model="boxRename"></uni-easyinput>
			</view>
			<view class="conts">
				<button class="btn1" @click="cancelBoxFn">取消</button>
				<button class="btn2" type="primary" @click="btnBoxFn">确定</button>
			</view>
		</uni-popup>
		<!-- 文件夹 -->
		<uni-popup class="file-popup" ref="fileRef" type="bottom">
			<view class="conts">
				<view class="close-btn">
					<view>证件卡包</view>
					<view class="xclass" @click="xFn">X</view>
				</view>
				<view class="controls">
					<view class="item" @click="editDelete('edit')">重命名</view>
					<view class="item" @click="editDelete('delete')">删除</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup class="re-class" ref="rename" type="bottom" background-color="#FFFFFF">
			<view class="titles">重命名</view>
			<view class="inputs">
				<uni-easyinput class="uni-mt-5" v-model="valueInput"></uni-easyinput>
			</view>
			<view class="conts">
				<button class="btn1" @click="cancelFn">取消</button>
				<button class="btn2" type="primary" @click="btnFn">确定</button>
			</view>
		</uni-popup>
		<uni-popup class="del-class" ref="fileDelete" type="dialog">
			<uni-popup-dialog cancelText="取消" confirmText="确认删除" title="删除" 
				:content="deleteCont" @confirm="fileCoonfirm" @close="fileClose">
			</uni-popup-dialog>
		</uni-popup>
		<tabBar :activeBar="1" />
	</view>
</template>
<script>
	import utils from '../../util/utils';
	import api from '../../util/api';
	import tabBar from '../tab-bar/index.vue'
	export default {
		components: { tabBar },
		data() {
			return {
				title: 'Hello',
				dataFileData: [],
				dataList: [],
				tokenData: '',
				rowData: null,
				valueInput: '',
				deleteCont: '删除文件夹将同时删除文件夹内的所有文档。其中包含的未同步内容，删除后将无法找回。请确认是否删除?',
				checkedArr: [],
				deleteBoxInfo: '删除项中有内容没有同步，删除后将无法找回，请确认是否删除?',
				boxRename: ''
			}
		},
		async onShow() {
			await this.getFileData()
			await this.getData()
			await this.initPopup()
		},
		methods: {
			initPopup() {
				this.$refs.boxFile && this.$refs.boxFile.close()
				this.$refs.deleteBox && this.$refs.deleteBox.close()
				this.$refs.renameBox && this.$refs.renameBox.close()
				this.$refs.fileRef && this.$refs.fileRef.close()
				this.$refs.rename && this.$refs.rename.close()
				this.$refs.fileDelete && this.$refs.fileDelete.close()
			},
			preview(imgs) {
				uni.previewImage({
					urls: [imgs],
				});
			},
			getFileData() {
				api.myGSSMainRequest({
					url: '/api/category/list',
					method: 'GET',
					header: {
						Authorization: this.tokenData
					}
				}).then((res) => {
					if (res.code === 200) {
						this.dataFileData = res.data
					} else {
						this.dataFileData = []
					}
				})
			},
			getData() {
				api.myGSSMainRequest({
					url: '/api/task/list',
					method: 'GET',
				}).then((res) => {
					if (res.code === 200) {
						this.dataList = res.data
					} else {
						this.dataList = []
					}
				})
			},
			fileView(item) {
				uni.navigateTo({
					url: `/pages/file/index?name=${item.name}&category_id=${item.id}&type=documents`
				})
			},
			detailsFn(item) {
				uni.navigateTo({
					url: `/pages/previewEvidence/index?id=${item.id}&types=img`
				})
			},
			timestamp(time) {
				return utils.convertTimestamp(time)
			},
			deleteEdit(item) {
				this.rowData = item
				this.$refs.fileRef.open()
			},
			editDelete(type) {
				if (type === 'edit') {
					this.valueInput = this.rowData.name
					this.xFn()
					this.$refs.rename.open()
				} else {
					this.xFn()
					this.$refs.fileDelete.open()
				}
			},
			cancelFn() {
				this.$refs.rename.close()
			},
			btnFn() {
				api.myGSSMainRequest({
					url: '/api/category/rename',
					method: 'POST',
					data: {
						category_id: this.rowData.id,
						category_name: this.valueInput
					}
				}).then((res) => {
					if (res.code === 200) {
						this.cancelFn()
						this.getFileData()
					}
				})
			},
			fileClose() {
				this.$refs.fileDelete.close()
			},
			fileCoonfirm() {
				api.myGSSMainRequest({
					url: '/api/category/del',
					method: 'POST',
					data: {
						category_id: this.rowData.id,
					}
				}).then((res) => {
					if (res.code === 200) {
						this.fileClose()
						this.getFileData()
					}
				})
			},
			xFn() {
				this.$refs.fileRef.close()
			},
			changeBox(e) {
				this.$refs.boxFile.open()
			},
			changeBoxselected(e) {
				// console.log('66666666', e)
			},
			chaFn() {
				this.$refs.boxFile.close()
				this.checkedArr = []
			},
			selectFn(type) {
				let arr = []
				if (type === '1') {
					this.dataList.forEach((item) => {
						arr.push(item.id)
					})
				}
				this.checkedArr = arr
			},
			deleteTask() {
				this.$refs.deleteBox.open()
			},
			boxClose() {
				this.$refs.deleteBox.close()
			},
			boxConfirm() {
				api.myGSSMainRequest({
					url: '/api/task/del',
					method: 'POST',
					data: {
						task_id: this.checkedArr,
					}
				}).then((res) => {
					if (res.code === 200) {
						this.boxClose()
						this.chaFn()
						this.getData()
					}
				})
			},
			renameBoxFn() {
				const boxId = this.checkedArr[0]
				let row = this.dataList.find(item => item.id === boxId);
				this.boxRename = row.task_name
				this.$refs.renameBox.open()
			},
			cancelBoxFn() {
				this.$refs.renameBox.close()
				this.boxRename = ''
			},
			btnBoxFn() {
				api.myGSSMainRequest({
					url: '/api/task/rename',
					method: 'POST',
					data: {
						task_id: this.checkedArr.length ? this.checkedArr[0] : '',
						task_name: this.boxRename
					}
				}).then((res) => {
					if (res.code === 200) {
						this.cancelBoxFn()
						this.chaFn()
						this.getData()
					}
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.container {
		padding: 20rpx;
		.search-area{
			background-color: #fff;
			padding: 20rpx 30rpx;
			display: flex;
			margin-bottom: 20rpx;
			&-input{
				display: flex;
				flex: 1;
				background-color: #fafafa;
				border-radius: 40rpx;
				padding: 4rpx 20rpx;
				input{
					margin-left: 6rpx;
					font-size: 28rpx;
				}
				.input-uni-icon{
					padding-top: 4rpx;
				}
			}
		}
	}
	.recentHistory {
		.box-class {
			width: 100%;
			display: flex;
			flex-flow: column;
		}
		.cont {
			background-color: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 20rpx;
			margin-bottom: 20rpx;
			width: calc(100% - 40rpx);
			.lefts {
				display: flex;
				align-items: center;
				image {
					width: 100rpx;
					height: 100rpx;
					margin-right: 20rpx;
				}
				.docDetail {
					display: flex;
					flex-direction: column;
					.docDetailName {
						font-size: 28rpx;
						margin-bottom: 12rpx;
					}
					.docDetailDate {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}
		.rights {
			width: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			font-size: 32rpx;
			color: #333333;
		}
		.active-bg {
			background: #E8F8F7;
		}
	}
	.file-popup {
		z-index: 999;
		.conts {
			width: 100%;
			height: 400rpx;
			background: #FFFFFF;
			border-radius: 20rpx 20rpx 0px 0px;
			.close-btn {
				padding: 20rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				background: rgba(241, 241, 241, 1);
				border-radius: 20rpx 20rpx 0px 0px;
				.xclass {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					color: rgb(140, 140, 140);
					background: rgba(220, 220, 220, 1);
				}
			}
			.controls {
				padding: 20rpx;
				.item {
					padding: 30rpx 0px;
				}
			}
		}
	}
	.re-class {
		z-index: 999;
		background: #FFFFFF;
		.titles, .inputs {
			width: calc(100% - 60rpx);
			margin-left: 40rpx;
		}
		.titles {
			padding: 20rpx 0rpx 0rpx 0rpx;
			text-align: center;
			font-size: 32rpx;
		}
		.conts {
			width: calc(100% - 80rpx);
			margin-left: 40rpx;
			display: flex;
			margin-top: 20rpx;
			margin-bottom: 40rpx;
			.btn1 {
				margin-right: 40rpx;
			}
			.btn1, .btn2 {
				flex: 1;
			}
		}
	}
	::v-deep .del-class {
		z-index: 9999;
		.uni-popup-dialog {
			.uni-dialog-title {
				justify-content: flex-start;
				padding-left: 40rpx;
				.uni-dialog-title-text {
					color: #333333;
				}
			}
			.uni-dialog-button-group {
				.uni-border-left {
					.uni-dialog-button-text {
						color: red;
					}
				}
			}
		}
	}
	.box-popup {
		z-index: 999;
		.conts {
			width: 100vw;
			height: 100vh;
			background: #FFFFFF!important;
			.hears {
				height: 98rpx;
				line-height: 98rpx;
				padding: 0px 40rpx 0px 0px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid rgba(220, 220, 220, 1);
				.left {
					display: flex;
					align-items: center;
					.cha {
						padding: 0px 40rpx;
					}
				}
			}
			.centers {
				height: calc(100vh - 220rpx);
				padding: 10rpx 0px;
				overflow: auto;
			}
			.bottoms {
				height: 98rpx;
				line-height: 98rpx;
				padding: 0px 40rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-top: 1px solid rgba(220, 220, 220, 1);
			}
		}
	}
	.grn-class {
		color: #40AB9C;
	}
</style>
