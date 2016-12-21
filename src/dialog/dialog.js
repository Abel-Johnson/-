function dialog(option) {
	option = option || {};


//传入对象的替身（最好不要修改传入的对象）
	var defaults = {
		title: "这是一个弹框",
		content: "我是弹框",
		okFn: function() {}
	};
	
	for(var attr in option) {
		defaults[attr] = option[attr];
	}
	
	
//封装弹框
	// 遮罩
	var mask = document.createElement("div");
	mask.style.cssText = "width: 100%; height: 100%;background: rgba(0,0,0,.5);position: fixed;left: 0;top: 0";
	document.body.appendChild(mask);

	//弹框的结构，appendChild到body中
	var diaDiv = document.createElement("div");
	diaDiv.className = "tip-box";
	var diaHtml = `
				<div class="tb-head">
					<h3>${defaults.title}</h3>
					<i class="close" title="关闭">x</i>
				</div>
				<div class="tb-content">
					${defaults.content}
				</div>
				<div class="tb-btns">
					<span class="errorTip"></span>
					<a href="javascript:;" class="btn confirm">确定</a>
					<a href="javascript:;" class="btn cancel">取消</a>
				</div>
	`;
	diaDiv.innerHTML = diaHtml;
	mask.appendChild(diaDiv);
	
	//弹框居中显示
	function setCenter(){
		diaDiv.style.left = (document.documentElement.clientWidth - diaDiv.offsetWidth)/2 + "px";
		diaDiv.style.top = (document.documentElement.clientHeight - diaDiv.offsetHeight)/2 + "px";
	}
	setCenter();
/*添加窗口伸缩自适应居中*/
	 window.addEventListener("resize", setCenter);
	
	
	
//给确定,取消,关闭(按钮)添加点击处理
	//1.获取元素
		var close = diaDiv.getElementsByClassName("close")[0];//(关闭按钮)
		var ok = diaDiv.getElementsByClassName("confirm")[0];//(确认按钮)
		var cancel = diaDiv.getElementsByClassName("cancel")[0];//(取消按钮)
		
	//2.添加点击事件
		close.addEventListener("click", function() {
			document.body.removeChild(mask);
		})
		
		ok.addEventListener("click", function() {
			var willClose = defaults.okFn(); //函数本身包含的就是判断能否关闭弹窗的条件
			if(willClose) {
				//返回值是true的时候才让弹框关掉
				document.body.removeChild(mask);
			}
		})
		
		cancel.addEventListener("click", function() {
			document.body.removeChild(mask);
		})
}