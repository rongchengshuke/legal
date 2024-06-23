
import request from "../util/api.js";

export function getTelCode(data) {
	return request.myGSSMainRequest({
		url:'/api/sms/send',
		method:'POST',
		data
	});
}

export function login(data) {
	return request.myGSSMainRequest({
		url:'/api/user/login',
		method:'POST',
		data
	});
}
