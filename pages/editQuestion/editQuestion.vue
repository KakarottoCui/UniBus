<template>
	<view style="margin: 5rpx;padding:20rpx; background-color: white;">
		<u-form :model="form" ref="uForm">
			<u-form-item label-width="120" :left-icon-style="{color:'#09a0f7'}"
				:label-style="{color:'#09a0f7',fontWeight:'bold'}" left-icon="account-fill" label="用户"
				:border-bottom="true">
				<u-input placeholder="用户未登录" :disabled="true" v-model="user.nickName" />
			</u-form-item>
			<u-form-item prop="content" label-width="120" :left-icon-style="{color:'#09a0f7'}"
				:label-style="{color:'#09a0f7',fontWeight:'bold'}" left-icon="question-circle-fill" label="留言"
				:border-bottom="true" label-position="top">
				<u-input type="textarea" placeholder="请输入留言" v-model="form.content" />
			</u-form-item>
			
		</u-form>

		<u-button @click="submit" type="primary" style="margin-top: 100rpx;">提交留言</u-button>

	</view>
</template>

<script>
import appRequest from "@/common/appRequestUrl.js";
	export default {
		data() {
			return {
				user: {
					nickName: "未知"
				},
				form: {
					content: ''
				},
				rules: {
					content: {
						required: true,
						message: '请输入留言',
						trigger: ['change', 'blur'],
					}
				}
			};
		},
		onLoad(options) {
			
		},
		onShow() {
			this.user = appRequest.getUserInfo();
			if (!this.user) {
				uni.navigateBack();
			}
			this.form.uid = this.user.uid;
		},
		methods: {
			getLocation:function(){
				var _this = this;
				wx.getLocation({
					type: 'wgs84',
					success(res) {
						const latitude = res.latitude
						const longitude = res.longitude
						const speed = res.speed
						const accuracy = res.accuracy
						_this.form.addX = longitude;
						_this.form.addY = latitude;
						_this.getPositionName(latitude, longitude)
						console.log(JSON.stringify(res));
					}
				})
			},
			
			submit() {
				var _this = this;
				this.$refs.uForm.validate(valid => {
					if (valid) {

						_this.addData();
					} else {
						console.log('验证失败');
					}
				});
			},
			getPositionName(latitude, longitude) {
				var _this = this;
				appRequest.request({
					method: "GET",
					url: appRequest.urlMap.getLocationName + latitude + "," + longitude,
					success: function(res) {
						if (res.data.code == 200) {
							var info = res.data.data;
							_this.form.addItem = info.province + info.city + info.district + info.street;
							_this.form.address = info.province + info.city;

							console.log(JSON.stringify(_this.form))

						} else {
							uni.showToast({
								icon: "none",
								title: "获取位置明细失败"
							})
						}
						//{"code":200,"msg":"位置获取成功","data":{"distance":"22","province":"江苏省","city":"苏州市","street":"震川中路","district":"昆山市","street_number":"422","direction":"near"}}
					},
					fail: function(res) {
						//callback();
					}
				})
			},addData:function(){
				var _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.addBusComment,
					data:_this.form,
					success: function(res) {
						if (res.data.code == 200) {
							uni.showToast({
								icon:"none",
								title:"留言成功",
								success() {
									uni.navigateBack();
								}
							})
				
						} else {
							uni.showToast({
								icon: "none",
								title: "留言失败"
							})
						}
					},
					fail: function(res) {
						uni.showToast({
							icon: "none",
							title: "添加异常"
						})
					}
				})
				
			},editData:function(){
				var _this = this;
				appRequest.request({
					method: "POST",
					url: appRequest.urlMap.editQuQuestion,
					data:_this.form,
					success: function(res) {
						if (res.data.code == 200) {
							uni.showToast({
								icon:"none",
								title:"修改成功",
								success() {
									uni.navigateBack();
								}
							})
				
						} else {
							uni.showToast({
								icon: "none",
								title: "修改失败"
							})
						}
					},
					fail: function(res) {
						uni.showToast({
							icon: "none",
							title: "修改异常"
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import '@/uview-ui/theme.scss';
</style>
