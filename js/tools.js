var t = (function() {
	var methods = {
		$(attrString, ele) {
			var ele = ele || document;
			console.log(ele);
			return ele.querySelector(attrString);
		},
		$s(attrString, ele) {
			var ele = ele || document;
			return ele.querySelectorAll(attrString);
		},
		
	//操作类名
		hasClass(ele, className) {
			var classArr = ele.className.split(" ");
			return classArr.findIndex(function(value) {
				return value === className; 
			}) !== -1
		},
		addClass(ele, className) {
			if(!methods.hasClass(ele, className)) {
				ele.className += " "+className;
			}
		},
		delClass(ele, className) {
			if(methods.hasClass(ele, className)) {
				var classArr = ele.className.split(" ");
				for (var i = 0; i < classArr.length; i++) {
					if(classArr[i] === className) {
						classArr.splice(i,1);
						i--;
					}
				}
				ele.className = classArr.join(" ");
			}
		},
		toggleClass(ele, className) {
			if(methods.hasClass(ele, className)) {
				methods.delClass(ele, className);
				return false; //false代表删掉了class
			} else {
				methods.addClass(ele, className);
 				return true; //true 代表添加了class
			}
		},
		
	//添加事件
		on(ele, eventName, fn) {
			ele.addEventListener(eventName,fn);
		},
		off(ele, eventName, fn) {
			ele.removeEventListener(eventName,fn);
		},
		
	//找到指定元素的祖先元素中 含有'指定属性名'的 最近的一个元素
		specialPt(ele, attr) {
			var keyChar = attr.charAt(0);
			if(keyChar === ".") {//指定了class
				while(ele.nodeType !== 9 && !methods.hasClass(ele, attr.slice(1))) {
					ele = ele.parentNode;
				}
			} else if(keyChar === "#") {//指定了id
				while(ele.nodeType !== 9 && methods.id !== attr.slice(1)) {
					ele = ele.parentNode;
				}
			} else {
				while(ele.nodeType !== 9 && methods.nodeName !== attr.toUpperCase()) {
					ele = ele.parentNode;
				}
			}
			return ele.nodeType === 9 ? null : ele;
		},
		
		
	//转换布局
		changeLayout(eles) {
			var parent = eles[0].parentNode;
			parent.style.position = "relative";
			Array.from(eles).forEach(function(value) {
				
			})
		}
		
		
		
		
		
		
		
		
		
		
		
	}
	return methods;
})()
