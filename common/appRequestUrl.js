const baseUrl = "http://localhost:9091/MyBus";

const urlMap = {
	login: baseUrl + "/login",
	logout: baseUrl + "/logout",
	
	login: baseUrl + "/login",
	logout: baseUrl + "/logout",
	regist: baseUrl + "/regist",
	
	loginCheck: baseUrl +"/getUserInfo",//获取微信账号信息
	getLocationName: baseUrl + "/getLocationInfo?location=",//获取定位地点名

	findBusRouteList: baseUrl+ "/busRoute/queryList",
	findBusRoute: baseUrl+ "/busRoute/queryObject",
	addBusRoute: baseUrl+ "/busRoute/addBusRoute",
	editBusRoute: baseUrl+ "/busRoute/editBusRoute",

	findBusStationList: baseUrl+ "/busStation/queryList",
	findBusStation: baseUrl+ "/busStation/queryObject",
	addBusStation: baseUrl+ "/busStation/addBusStation",
	editBusStation: baseUrl+ "/busStation/editBusStation",

	findBusBuildingList: baseUrl+ "/busBuilding/queryList",
	findBusBuilding: baseUrl+ "/busBuilding/queryObject",
	addBusBuilding: baseUrl+ "/busBuilding/addBusBuilding",
	editBusBuilding: baseUrl+ "/busBuilding/editBusBuilding",
	
	findBusCommentList: baseUrl+ "/busComment/queryList",
	findBusComment: baseUrl+ "/busComment/queryObject",
	addBusComment: baseUrl+ "/busComment/addBusComment",
	editBusComment: baseUrl+ "/busComment/editBusComment",

	getPicById : baseUrl + "/nmPic/getPicById/",
	getRoutePath: baseUrl + "/busRoute/getRoutePath"
}

const getUserInfo = function(){
	var _this = this;
	try {
		const value = uni.getStorageSync('userInfo');
		console.log("1"+JSON.stringify(value));
		return value ? value : false;
	} catch (e) {
		return false;
	}
}

const login = function(){
	var _this = this;
	
	
}

const request = function(requestOpt) {
	try {
		requestOpt = requestOpt || {};
		if (!requestOpt.url) {
			requestFail();
			return;
		}
		var token = "";
		try {
			const value = uni.getStorageSync('userInfo');
			if (value) {
				token = value.token;
			}
		} catch (e) {
			token = "";
		}
		requestOpt.data = requestOpt.data || {};
		requestOpt.data['token'] = token;
		requestOpt.method = requestOpt.method || 'POST';
		requestOpt.header = requestOpt.header || {
			// 'content-type': 'application/x-www-form-urlencoded',
			'token': token
		};
		requestOpt.timeout = requestOpt.timeout || 30000;
		requestOpt.responseType = requestOpt.responseType || 'text';
		requestOpt.dataType = requestOpt.dataType || "json";
		requestOpt.sslVerify = requestOpt.sslVerify || true;
		requestOpt.success = requestOpt.success || function(res) {};
		requestOpt.fail = requestOpt.fail || function(res) {};
		requestOpt.complete = requestOpt.complete || function(res) {};
		uni.showLoading({
			title: "加载中"
		});

		uni.request({
			url: requestOpt.url,
			data: requestOpt.data,
			method: requestOpt.method,
			responseType: requestOpt.responseType,
			sslVerify: requestOpt.sslVerify,
			timeout: requestOpt.timeout,
			dataType: requestOpt.dataType,
			header: requestOpt.header,
			success: function(res) {
				requestOpt.success(res);
				if(res.data.code == 401){
					uni.showToast({
						title:"未登录",
						icon:'none'
					})
					uni.removeStorageSync('user');
				}
			},
			fail: function(res) {
				requestOpt.fail(res);
			},
			complete: function(res) {
				uni.hideLoading();
			}
		});
	} catch (e) {
		//TODO handle the exception
		uni.hideLoading();
		uni.showToast({
			icon: "none",
			title: "请求异常"
		})
	}
}

const sendMsg = function(uid,content,pid,type,creater){
	request({
		method: "POST",
		url: urlMap.addQuMessage,
		data: {
			uid:uid,
			pid:pid,
			stat:0,
			type:type,
			content:content,
			creater: creater,
			validFlag: 1
		},
		success: function(res) {
			
		},
		fail: function(res) {
	
		}
	});
}


export default {
	getUserInfo,
	baseUrl,
	request,
	urlMap,
	login,
	sendMsg
}
