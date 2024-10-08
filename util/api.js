const baseUrl = 'https://blb-api.rongchengshuke.com'   
export const myGSSMainRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({ title: '加载中', mask: true })
		let header = {
			Authorization: uni.getStorageSync("tokenBlb") || ''
		}
		if (options.requestType) {
			header["Content-Type"] = options.requestType;
		}
		uni.request({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: ((res) => {
				uni.hideLoading();
				if (res.data.code === 200) {
					resolve(res.data)
				} else if (res.data.code === 201) {
					uni.setStorageSync('tokenBlb', '');
					uni.showToast({ title: res.data.message, icon: 'none' })
				} else {
					uni.showToast({ title: res.data.message, icon: 'none' })
				}
			}),
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({ title: '请求接口失败', icon: 'error' })
				reject(err)
			}
		})
	})
}
export const downloadFileFn = (options) => {
	return new Promise((resolve, reject) => {
		uni.showLoading({ title: '加载中', mask: true })
		let header = {
			Authorization: uni.getStorageSync("tokenBlb") || '',
		}
		if (options.requestType) {
			header["Content-Type"] = options.requestType;
		}
		uni.downloadFile({
			url: baseUrl + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: header,
			success: ((res) => {
				uni.hideLoading();
				if (res.statusCode === 200) {
					resolve(res)
				} else {
					uni.showToast({ title: '下载文件失败' });
				}
			}),
			fail: (err) => {
				uni.hideLoading();
				uni.showToast({ title: '请求接口失败', icon: 'error' })
				reject(err)
			}
		})
	})
}
export const myRequestUploadFile = (options) => {
	uni.showLoading({ title: '加载中', mask: true })
	let header = {
		Authorization: uni.getStorageSync("tokenBlb") || ''
	}
	if (options.requestType) {
		header["Content-Type"] = options.requestType;
	}
	return options.files.map((file, index) => {
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: `${baseUrl}/api/index/upload`, // 接口地址
				filePath: options.type ==='wx' ? file.tempFilePath : file, // 临时文件路径
				name: 'file', // 服务器接收的文件字段名(这个地方很重要要和后端沟通一下)
				header: header,
				formData: options.formData || {},
				success: function (res) {
					uni.hideLoading();
					resolve(res.data)
				},
				fail: function (err) {
					uni.hideLoading();
					uni.showToast({ title: '上传失败', icon: 'error' })
					reject(err)
				},
			})
		})
	})
}
export default {
	myGSSMainRequest,
	downloadFileFn,
  myRequestUploadFile
}