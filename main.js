import App from './App'
// import Vue from 'vue'
// import * as api from './util/api.js'
// Object.keys(api).forEach(key => {
// 	Vue.prototype['$' + key] = api[key]
// })
// #ifndef VUE3
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import uviewPlus from 'uview-plus'
export function createApp() {
	const app = createSSRApp(App)
	app.use(uviewPlus)
	return {
		app
	}
}
// #endif