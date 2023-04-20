<template>
	<view>
	
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{user.nickName}}</view>
				<view class="u-font-14 u-tips-color">用户ID:{{user.uid}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<!-- <u-icon name="scan" color="#969799" size="28"></u-icon> -->
			</view>
			<view class="u-m-l-10 u-p-10">
				<!-- <u-icon name="arrow-right" color="#969799" size="28"></u-icon> -->
			</view>
		</view>
		
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="showInfo" icon="setting" title="信息"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view @click="removeToken()" class="qin_logout">
			注销
		</view>
	</view>
</template>

<script>
	import appRequest from "@/common/appRequestUrl.js";
	export default {
		name: 'Qin-question-my',
		data() {
			return {
				pic:'https://uviewui.com/common/logo.png',
				show:true,
				user: {},
				commentNum: 0,
				questionNum: 0,
				collectNum: 0,
				msgNum:0
			}
		},
		onShow() {
			this.user = appRequest.getUserInfo();
			if (!this.user) {
				uni.reLaunch({
					url: "/pages/index/index"
				});
			}
		},
		methods: {
			showInfo(){
				uni.showModal({
					title:"信息",
					content:"名称：公交线路，版本：v0.808"
				})
			},
			toItem(index){
				uni.navigateTo({
					url:"/pages/collectItem/collectItem?index="+index
				})
			},
			removeToken(){
				uni.clearStorage();
				uni.reLaunch({
					url:"/pages/login/login"
				})
			},
			getInfo() {
				var _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findQuCommentList,
					data: {
						creater: _this.user.uid,
						validFlag: 1
					},
					success: function(res) {
						_this.commentNum = res.data.data.length;
					},
					fail: function(res) {

					}
				});

				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findQuCollectList,
					data: {
						creater: _this.user.uid,
						validFlag: 1,
						type: 1
					},
					success: function(res) {
						_this.collectNum = res.data.data.length;
					},
					fail: function(res) {

					}
				});

				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findQuQuestionList,
					data: {
						uid: _this.user.uid,
						validFlag: 1
					},
					success: function(res) {
						_this.questionNum = res.data.data.length;
					},
					fail: function(res) {

					}
				});
				
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.findQuMessageList,
					data: {
						uid: _this.user.uid,
						validFlag: 1,
						stat:0
					},
					success: function(res) {
						_this.msgNum = res.data.data.length;
					},
					fail: function(res) {
				
					}
				});
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}

.qin_logout {
	margin-top: 700rpx;
	height: 80rpx;
	text-align: center;
	line-height: 80rpx;
	font-weight: bold;
	color: #fff;
	background-color: #09a0f7;
}
</style>
