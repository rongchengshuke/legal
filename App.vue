<script>
	export default {
		onLaunch: function() {
			this.initScript()
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initScript() {
				var script = document.createElement('script');
				script.type = "text/javascript";
				script.async = true;
				script.src = "./static/js/uni.webview.1.5.2.js";
				document.head.appendChild(script);
				console.log(wx, "wx");
			}
		}
	}
</script>

<style lang="scss">
	@import "uview-plus/index.scss";
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	page {
		background-color: #F8FAFB;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	::v-deep .uni-tabbar__icon {
		margin-top: 5px!important;
	}
	::v-deep .uni-tabbar__bd {
		height: fit-content!important;
	}
	::v-deep .uni-tabbar__label {
		margin-top: 0px!important;
		padding-bottom: 3px!important;
	}
	.uni-mask {
    background: rgba(0, 0, 0, 0.5)!important; /* 设置蒙层的颜色 */
	}
	::v-deep .uni-navbar {
		.uni-navbar--fixed{
			border-bottom-color: rgba(255,255,255,0)!important;
		}
	}
	::v-deep .uni-tabbar__mid {
		img {
			border-radius: 50%;
		}
	}
	::v-deep .uni-tabbar-bottom {
		display: none;
	}
</style>
