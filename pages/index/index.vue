<template>
	<view class="Qin-Question">

		<u-search shape="square" :show-action="false" @clear="searchInfo" @search="searchInfo" placeholder="请输入搜索线路"
			v-model="text"></u-search>

		<!-- <view class="qin_select">
			<u-search :show-action="false" @clear="searchInfo" @search="searchInfo" placeholder="请输入搜索关键词" v-model="text"></u-search>
			<input v-module="text" class="qin_input" placeholder="请输入搜索关键词" /> 
		</view> -->
		<view class="qin_header">
			<view>公交线路</view>
			<view @click="jumpToAddQuestion">留言</view>
		</view>
		<view class="ranking-header" style="padding-left: 100rpx;padding-right: 100rpx;">
			<text style="u-m-l-20" @click="changeView(0)" :class="selTab == 0 ? 'sel':''">线路</text>
			<text style="u-m-r-20" @click="changeView(1)" :class="selTab == 1 ? 'sel':''">地标</text>
		</view>
		<view v-for="(item, index) in dataList" :key="index">
			<u-card :title="'路线名：'+item.title" title-color="#09a0f7">
				<view class="" slot="body">
					<view class="u-body-item u-flex u-row-between u-p-b-0">
						<view class="u-body-item-title u-line-2">{{"简介："+item.memo}}</view>
					</view>
				</view>
				<view class="" slot="foot"><u-icon name="home-fill" size="34" color="#09a0f7"
						:label="selTab==1 ? '查看地标':'查看站点'" @click="showItem(item)"></u-icon></view>
			</u-card>
		</view>
		<view class="qin_more">
			没有更多内容了...
		</view>
		<u-popup :closeable="true" close-icon-color="red" v-model="showStation" mode="center" length="80%">
			<view class="u-p-10">
				<u-cell-group title="站点明细">

					<view v-for="(item,index) in selList" :key="index" class="u-p-30 u-m-10"
						style="background-color: white;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);">
						<view class="u-flex u-row-between u-p-10">
							<view class="">
								<u-icon name="home" color="#2979ff" size="35"></u-icon>
								<text class="u-p-10">{{item.title}}</text>
							</view>

							<view v-if="item.dis!='-'"> 距上站:<text class="u-tips-color u-p-l-10">{{item.dis}}</text>
							</view>
						</view>
						<view>简介：<text class="u-tips-color">{{item.memo}}</text></view>
						<view>地址：<text class="u-tips-color">{{item.area}}</text></view>
					</view>

				</u-cell-group>
				<u-button type="primary" class="u-m-10 u-m-t-25" @click="showMapModel">查看地图</u-button>
			</view>
		</u-popup>
		<u-popup :closeable="true" close-icon-color="red" v-model="showMap" mode="center" length="80%" height="80%">
			<view>
				<map :polyline="polyline" v-if="showMap" style="width: 100%; height:90vh;" :latitude="selRoute.addX"
					:longitude="selRoute.addY" :markers="covers">
				</map>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js";
	import qinContent from '@/components/qin_content/qin_content.vue'
	export default {
		name: 'Qin-Question',
		data() {
			return {
				code: "",
				text: "",
				selTab: 0,
				userAddX: 0, //纬度
				userAddY: 0, //经度
				dataList: [],
				showStation: false,
				selList: [],
				selRoute: {},
				showMap: false,
				polyline: [{
					points: [{
						latitude: 39.8888726387478,
						longitude: 116.40099038098143
					}, {
						latitude: 39.91481538744656,
						longitude: 116.37455452893064
					}],
					color: "#31c27c",
					width: 10,
					arrowLine: true,
					borderWidth: 2
				}],
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/location.png'
				}, {
					latitude: 39.90,
					longitude: 116.39,
					iconPath: '../../../static/location.png'
				}]
			}
		},
		mounted() {
			var _this = this;

		},
		components: {
			qinContent
		},
		onLoad() {
			var _this = this;
			this.getQuestionList();
		},
		onShow() {
			//uni.clearStorage();
			var _this = this;
			let userInfo = appRequest.getUserInfo();
			if (!userInfo) {
			    uni.reLaunch({
			     url: "/pages/login/login"
			    });
			   }



			// wx.getLocation({
			//  type: 'wgs84',
			//  success (res) {
			//    const latitude = res.latitude
			//    const longitude = res.longitude
			//    const speed = res.speed
			//    const accuracy = res.accuracy
			//    console.log(JSON.stringify(res));
			//  }
			// })
		},
		methods: {
			showItem(item) {
				let _this = this;
				if (this.selTab == 0) {
					this.selRoute = item;
					this.showStation = true;
					this.selList = item.stationList;

					this.selList.map(function(item, index, arr) {
						if (index == 0) {
							item['dis'] = "-";
						} else {
							item['dis'] = _this.getDistance(item.addX, item.addY, _this.selList[index - 1].addX,
								_this.selList[index - 1].addY);
						}
					})


				} else {
					this.selList = this.dataList;
					this.selRoute = item;
					this.showMapModel();
				}

			},
			showMapModel() {
				this.showMap = true;
				var res = [];
				for (var i = 0; i < this.selList.length; i++) {
					res.push({
						width: 20,
						height: 30,
						latitude: this.selList[i].addX,
						longitude: this.selList[i].addY,
						iconPath: this.selTab == 0 ? appRequest.baseUrl + "/static/img/station.png" : appRequest
							.baseUrl + "/static/img/build.png",
						label: {
							content: this.selList[i].title,
							color: "red",
							padding: 3,
							fontSize: '20px'
						},
						callout: {
							content: this.selList[i].title+"，简介："+this.selList[i].memo
						}
					})
				}
				if (this.selTab == 0) {
					res[0].iconPath = "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png"
					res[res.length - 1].iconPath = "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png"
				}
				//this.polyline.points = res;
				this.covers = res;
				if (this.selTab == 0) {
					this.initLine();
				}

			},
			showInfo(qid) {
				uni.navigateTo({
					url: "/pages/detail/detail?qid=" + qid
				})
			},
			searchInfo() {
				this.getQuestionList();
			},
			changeView(index) {
				this.selTab = index;
				this.getQuestionList();
			},
			getQuestionList() {
				var _this = this;
				let url = this.selTab == 0 ? appRequest.urlMap.findBusRouteList : appRequest.urlMap.findBusBuildingList;
				appRequest.request({
					method: "POST",
					url: url,
					data: {
						title: _this.text,
						validFlag: 1
					},
					success: function(res) {
						if (res.data.code == 200) {
							_this.dataList = [];
							_this.dataList = res.data.data;

						} else {
							uni.showToast({
								icon: "none",
								title: "查询失败"
							})
						}
					},
					fail: function(res) {

					}
				})
			},
			//参数分别为第一点的纬度，经度；第二点的纬度，经度
			getDistance(lat1, lng1, lat2, lng2) {
				function rad(d) {
					return d * Math.PI / 180.0;
				}
				var radLat1 = rad(lat1);
				var radLat2 = rad(lat2);
				var a = radLat1 - radLat2;
				var b = rad(lng1) - rad(lng2);
				var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
					Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137; // EARTH_RADIUS;
				s = Math.round(s * 10000) / 10000; //输出为公里

				var distance = s;
				var distance_str = "";

				if (parseInt(distance) >= 1) {
					distance_str = distance.toFixed(1) + "km";
				} else {
					distance_str = (distance * 1000).toFixed(1) + "m";
				}
				return distance_str;
			},
			jumpToAddQuestion() {
				uni.navigateTo({
					url: "/pages/editQuestion/editQuestion"
				})
			},
			getUserLogin(code) {
				let _this = this;
				uni.clearStorage();
			},
			initLine: function() {
				let _this = this;
				if (!this.selList || this.selList.length < 2) {
					return;
				}
				var url = "https://apis.map.qq.com/ws/direction/v1/driving/"; //请求路径
				url += "?from=" + this.selList[0].addX + "," + this.selList[0].addY; //起点坐标
				url += "&to=" + this.selList[this.selList.length - 1].addX + "," + this.selList[this.selList.length -
					1].addY; //终点坐标
				url += "&output=jsonp&callback=cb"; //指定JSONP回调函数名，本例为cb
				if (this.selList.length > 2) {
					url += "&waypoints=";
					for (let i = 1; i < this.selList.length - 1; i++) {
						url += this.selList[i].addX + "," + this.selList[i].addY;
						if (i != this.selList.length - 2) {
							url += ";";
						}
					}
				}

				url += "&key=26WBZ-CQG35-75FIB-ICLTD-UUP5E-E2FQX";
				jsonp_request(url);

				//浏览器调用WebServiceAPI需要通过Jsonp的方式，此处定义了发送JOSNP请求的函数
				function jsonp_request(url) {
					var script = document.createElement('script');
					script.src = url;
					document.body.appendChild(script);
				}

				//定义请求回调函数，在此拿到计算得到的路线，并进行绘制
				window.cb = function cb(ret) {
					var coords = ret.result.routes[0].polyline,
						pl = [];
					//坐标解压（返回的点串坐标，通过前向差分进行压缩）
					var kr = 1000000;
					for (var i = 2; i < coords.length; i++) {
						coords[i] = Number(coords[i - 2]) + Number(coords[i]) / kr;
					}
					//将解压后的坐标放入点串数组pl中
					for (var i = 0; i < coords.length; i += 2) {
						pl.push({
							lat: coords[i],
							lng: coords[i + 1]
						});
					}

					_this.polyline = [];
					for (let i = 1; i < pl.length; i++) {

						_this.polyline.push({
							points: [{
								latitude: pl[i - 1].lat,
								longitude: pl[i - 1].lng
							}, {
								latitude: pl[i].lat,
								longitude: pl[i].lng
							}],
							color: "#3f80de",
							width: 8,
							arrowLine: true,
							borderWidth: 2,
						})
					}
				}
			}

		}
	}
</script>

<style scoped lang="less">
	.Qin-Question {
		.qin_more {
			margin: 20rpx 0;
			font-size: 20rpx;
			text-align: center;
			color: rgba(0, 0, 0, .55);
		}

		.qin_select {
			height: 80rpx;
			width: 100%;
			background-color: #fff;
			font-size: 30rpx;
			text-align: center;
			border: 1px solid rgba(0, 0, 0, .1)
		}

		.qin_input {
			height: 80rpx;
		}

		.uni-input-wrapper {
			align-items: center;
			justify-content: center;
		}

		.qin_header {
			margin-bottom: 30rpx;
			margin-top: 30rpx;
			font-size: 35rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			& view {
				&:last-child {
					height: 70rpx;
					width: 130rpx;
					text-align: center;
					line-height: 70rpx;
					color: #fff;
					background-color: #09a0f7;
				}
			}
		}

		.qin_content_list {
			margin-top: 30rpx;
			background-color: #fff;
		}
	}

	.ranking-header {
		display: flex;
		background-color: #fff;
		padding: 40rpx;
		justify-content: space-between;
		align-items: center;
		font-size: 40rpx;

		&>text {
			padding-bottom: 10rpx;
		}

		.sel {
			border-bottom: 8rpx solid #09a0f7;
			font-weight: bold;
		}
	}
</style>