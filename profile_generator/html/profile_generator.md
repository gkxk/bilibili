
> 输入用户id, 生成用户信息卡片
> 觉得有趣就给[**repo**](https://github.com/gkxk/bilibili/tree/main/profile_generator)点个star支持下吧

> 绘制/网络当前需要两三秒, 之后有时间会优化下


<div id="profile_input_container">
	<!-- input在键入enter后触发绘制 -->
	<input id="uid" type="text" placeholder="输入用户id" value="430086241" onkeydown="if(event.keyCode==13) generate_bilibili_profile()">
	<button onclick="generate_bilibili_profile()">生成</button>
</div>
<div id="result"></div>
<style>
	/* input, button暗色主题 */
	#profile_input_container{
		text-align: center;
	}
	/* result居中 */
	#result{
		text-align: center;
	}
</style>

<script>
	async function getVideoList(id){
		let url = `https://api.bilibili.com/x/space/arc/search?mid=${id}&ps=30&tid=0&pn=1&keyword=&order=pubdate&jsonp=jsonp`
		// return axios.post(`http://127.0.0.1:3000/get`, {
		return axios.post(`https://o65kk5pfbg.execute-api.us-east-1.amazonaws.com/get`, {
			"url": url
		}).then(function (response) {
			let vlist=response.data.data.list.vlist;
			// 返回vlist中的title
			return vlist.map((v)=>v.title);
		})
	}
	async function generate_bilibili_profile(){
		// 获取用户id
		var uid = document.getElementById("uid").value;
		// 使用axios发送post请求
		// axios.post(`http://127.0.0.1:3000/get`, {
		return axios.post(`https://o65kk5pfbg.execute-api.us-east-1.amazonaws.com/get`, {
			"url": `https://api.bilibili.com/x/space/acc/info?mid=${uid}&jsonp=jsonp`
		})
		.then(async function (response) {
			try{
				let vlist=await getVideoList(uid);
				console.log(vlist);

				console.log(response);
				// 生成用户信息卡片
				let data = response.data.data;

				// 以canvas形式绘制
				let canvas = document.createElement("canvas");
				canvas.width = 400;
				canvas.height = 140 + 20*vlist.length + (vlist.length?20:0);
				let ctx = canvas.getContext("2d");

				let background_img = new Image();
				background_img.src = data.top_photo;
				background_img.onload = function(){
					// ctx.drawImage(background_img, 0, 0, canvas.width, canvas.height);
					// 自适应绘制底图, 而非拉伸
					let scale = Math.max(canvas.width/background_img.width, canvas.height/background_img.height);
					ctx.drawImage(background_img, 0, 0, background_img.width*scale, background_img.height*scale);

					// 在中心位置(左上角坐标10,10 宽高380,180)绘制黑色透明矩形
					ctx.fillStyle = "rgba(0,0,0,0.8)";
					ctx.fillRect(10, 10, 380, canvas.height-20);

					// 在左边绘制头像
					let avatar_img = new Image();
					avatar_img.src = data.face;
					avatar_img.onload = function(){
						ctx.drawImage(avatar_img, 20, 20, 100, 100);
					}

					ctx.font = "16px Arial";
					ctx.fillStyle = "#dddddd";
					ctx.fillText(`${data.name} (lv${data.level} ${data.sex}${data.silence?" 被封":""})`, 140, 40);

					ctx.font = "14px Arial";
					ctx.fillText(`${data.mid}`, 140, 60);

					// 斜体
					ctx.font = "italic 12px Arial";
					if(!data.sign) data.sign = "该用户什么都没写";
					// if(data.sign.length > 20){
					// 	ctx.fillText(`${data.sign.slice(0, 20)}`, 140, 80);
					// 	ctx.fillText(`${data.sign.slice(20)}`, 140, 100);
					// }else
					// 	ctx.fillText(`${data.sign}`, 140, 80);
					let sign_i=0;
					while(data.sign.length){
						ctx.fillText(`${data.sign.slice(0, 20)}`, 140, 80+sign_i*20);
						data.sign = data.sign.slice(20);
						sign_i++;
					}

					// 替换原有dom
					document.getElementById("result").innerHTML = "";
					document.getElementById("result").appendChild(canvas);

					// 绘制视频列表
					if(vlist.length){
						ctx.font = "12px Arial";
						ctx.fillText(`最近上传的视频:`, 20, 140);
						for(let i=0; i<Math.min(vlist.length, 30); i++){
							ctx.fillText(`${vlist[i].slice(0, 30)}`, 20, 160+i*20);
						}
					}
				}
			}
			catch(e){
				alert(`获取失败, uid错误, 或服务暂时不可用: ${e}`);
			}
		})
		.catch(function (error) {
			alert(`获取失败, uid错误, 或服务暂时不可用: ${error}`);
		});
	}
</script>

<br>

示例: 

{%gp - %}
![](https://d2ekywz288hemq.cloudfront.net/im/bilibili_profile/bilibili_profile_gkxk.png)
![](https://d2ekywz288hemq.cloudfront.net/im/bilibili_profile/bilibili_profile_1.png)
![](https://d2ekywz288hemq.cloudfront.net/im/bilibili_profile/bilibili_profile_114514.png)
![](https://d2ekywz288hemq.cloudfront.net/im/bilibili_profile/bilibili_profile_海州拌饭.png)
![](https://d2ekywz288hemq.cloudfront.net/im/bilibili_profile/bilibili_profile_工艺工具机械大全.png)
![](https://d2ekywz288hemq.cloudfront.net/im/bilibili_profile/bilibili_profile_迷茫的阿库.png)
{%endgp%}




<hr>

- 后续待做:
	- [ ] 让图片在云端生成, 通过api直接获取图片
	- [ ] 根据反馈, 随时更新完善
	- [ ] 后续尝试下其他api的用法. 编写更多类似工具











