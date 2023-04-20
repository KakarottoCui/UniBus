<template>
	<view class="u-p-20" style="background-color: white;">

		<u-field @click="clickF(1)" :disabled="true" v-model="begin.title" label="出发站" placeholder="请选择出发站">
		</u-field>
		<u-field :border-bottom="false" @click="clickF(2)" :disabled="true" v-model="end.title" label="目的站" placeholder="请选择到达站">
		</u-field>
		<u-button type="primary" @click="routePlan">路线规划</u-button>
		<view class="u-p-20 u-m-t-25" v-if="routeList.length > 0">
			<u-time-line >
					<view class="u-p-20 u-font-30">总距离：<text class="u-tips-color">{{dis}}米</text>，途经{{routeList.length}}站</view>
					<u-time-line-item nodeTop="2" v-for="(item,index) in routeList" :key="index">
						<!-- 此处自定义了左边内容，用一个图标替代 -->
						<template v-slot:node>
							<view class="u-node" style="background: #19be6b;">
								<!-- 此处为uView的icon组件 -->
								<u-icon name="home-fill" color="#fff" :size="24"></u-icon>
							</view>
						</template>
						<template v-slot:content>
							<view>
								<view class="u-order-title">{{(index+1)+'、'+item.title}}</view>
								<view class="u-order-desc">{{item.area}}</view>
							</view>
						</template>
					</u-time-line-item>
					<u-button @click="showMapModel">查看地图</u-button>
			</u-time-line>	
		</view>
			
		
		
		
		<u-popup :closeable="true" close-icon-color="red" v-model="showMap" mode="center" length="80%" height="80%">
			<view>
				<map v-if="routeList.length>0" :polyline="polyline" style="width: 100%; height:90vh;" :latitude="routeList[0].addX"
					:longitude="routeList[0].addY" :markers="covers">
				</map>
			</view>
		</u-popup>

		<u-popup :closeable="true" close-icon-color="red" v-model="showSel" mode="center" length="80%" height="80%">
			<view class="u-p-20">

				<view class="u-p-20 u-font-30" style="color: #2979ff;">站点选择</view>

				<u-search :show-action="false" placeholder="输入站点名搜索" v-model="keyword"></u-search>

				<u-cell-group title="站点名称">

					<view v-if="item.title.indexOf(keyword) > -1" v-for="(item,index) in stationList" :key="index" class="u-p-30 u-m-10"
						style="background-color: white;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);">
						<view class="u-flex u-row-between u-p-10" @click="selItem(item)">
							<view class="">
								<u-icon name="home" color="#2979ff" size="35"></u-icon>
								<text class="u-p-10">{{item.title}}</text>
							</view>

							<view style="color: #2979ff;"> 点击选择
							</view>
						</view>
						<view>地址：<text class="u-tips-color">{{item.area}}</text></view>
					</view>

				</u-cell-group>

			</view>
		</u-popup>

	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js";
	export default {
		data() {
			return {
				showMap: false,
				showSel: false,
				stationList: [],
				keyword: "",
				selObj: {id:""},
				begin: {id:""},
				end: {id:""},
				selIndex:0,
				routeList:[],
				dis:0,
				selList:[],
				polyline: [],
				covers: []
			};
		},
		onLoad: function() {
			this.getStationData();
		},
		methods: {
			routePlan(){
				if(this.begin.id == this.end.id || !this.begin.id || !this.end.id ){
					uni.showToast({
						icon:"none",
						title:"出发站和目的站均需选取且不能相同"
					});
					return;
				}
				let _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.getRoutePath,
					data: {
						station1:this.begin.id,
						station2:this.end.id
					},
					
					header:{
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: function(res) {
						if (res.data.code == 200) {
							if(!res.data.data.res){
								uni.showModal({
									title:"规划失败",
									content:"线路未连通或者距离过远"
								})
								return;
							}
							_this.routeList = res.data.data.path;
							_this.dis = res.data.data.shortDis;
							if(!_this.dis){
								_this.dis = _this.getDistance(_this.routeList[0].addX,_this.routeList[0].addY,_this.routeList[_this.routeList.length-1].addX,_this.routeList[_this.routeList.length-1].addY);
							}
							_this.setRoute();
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
				
				
			},setRoute(){
				
				//let text =
				
			},
			clickF(index){
				this.selIndex = index;
				this.showSel=true;
			},
			selItem(item) {
				this.selObj = item;
				if(this.selIndex == 1){
					this.begin = item;
				}else{
					this.end = item;
				}
				
				this.showSel = false;
			},
			getStationData: function() {
				let _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findBusStationList,
					data: {
						validFlag: 1
					},
					success: function(res) {
						if (res.data.code == 200) {
							_this.stationList = res.data.data;

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

			},getDistance(lat1, lng1, lat2, lng2) {
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
				// var distance_str = "";

				// if (parseInt(distance) >= 1) {
				// 	distance_str = distance.toFixed(1) + "km";
				// } else {
				// 	distance_str = (distance * 1000).toFixed(1) + "m";
				// }
				return (distance * 1000).toFixed(1);
			},initLine: function() {
				let _this = this;
				this.selList = this.routeList;
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
					_this.showMap = true;
				}
			},showMapModel() {
				
				var res = [];
				this.selList = this.routeList;
				for (var i = 0; i < this.selList.length; i++) {
					res.push({
						width: 20,
						height: 30,
						latitude: this.selList[i].addX,
						longitude: this.selList[i].addY,
						iconPath: appRequest.baseUrl + "/static/img/station.png",
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
				res[0].iconPath = "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png"
					res[res.length - 1].iconPath = "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png"
				
				//this.polyline.points = res;
				this.covers = res;
				this.initLine();

			}
		}
	}
</script>

<style lang="scss">
	.u-node {
			width: 44rpx;
			height: 44rpx;
			border-radius: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background: #d0d0d0;
		}
		
		.u-order-title {
			color: #333333;
			font-weight: bold;
			font-size: 32rpx;
		}
		
		.u-order-desc {
			color: rgb(150, 150, 150);
			font-size: 28rpx;
			margin-bottom: 6rpx;
		}
		
		.u-order-time {
			color: rgb(200, 200, 200);
			font-size: 26rpx;
		}
</style>