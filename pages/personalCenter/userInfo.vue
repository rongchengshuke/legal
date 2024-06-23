<template>
	<view class="wrapper">
		<view class="edit-phone">
			<view>{{formPhone(phone)}}</view>
			<view>修改</view>
		</view>
		<view class="account-status">
			<view class="lefts">
				<view>账户状态</view>
				<view class="status">普通用户</view>
			</view>
			<view class="rights">升级我的账户</view>
		</view>
		<view class="change-password">修改密码</view>
		<view class="residual-coupon">
			<view class="lefts">
				<view>剩余点券</view>
				<view class="status">0点券</view>
			</view>
			<view class="rights">充值2000点券</view>
		</view>
		<view class="residual-coupon">
			<view class="lefts">
				<view>剩余传真</view>
				<view class="status">0页</view>
			</view>
		</view>
		<view class="my-assets">我的资产</view>
		<button class="btn" type="primary" @click="loginout">退出登录</button>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				phone:'',
				token: ''
			}
		},
		async onShow() {
			this.token = uni.getStorageSync("token")
			this.phone = uni.getStorageSync("phone")
		},
		methods:{
			async loginout(){
				await uni.setStorageSync('token', '');
				await uni.navigateBack()
			},
			formPhone(val) {
				var tel = '' + val
				var reg = /(\d{3})\d{4}(\d{4})/
				var tel1 = tel.replace(reg, "$1****$2")
				return tel1
			},
		}
	}
</script>
<style lang="scss" scoped>
.wrapper {
	padding: 20rpx;
	.edit-phone {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0rpx;
	}
	.account-status, .residual-coupon {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0rpx;
		.lefts {
			.status {
				font-size: 24rpx;
				color: rgb(156, 156, 156);
			}
		}
		.rights {
			color: rgba(230, 158, 63);
		}
	}
	.change-password, .my-assets {
		display: flex;
		align-items: center;
		padding: 20rpx 0rpx;
	}
	.residual-coupon {
		.rights {
			color: rgba(69, 172, 160);
		}
	}
	.btn {
		margin-top: 40rpx;
		background: rgb(241, 241, 241);
		color: #333333;
	}
	.btn:after {
		border: 0px;
	}
}
</style>