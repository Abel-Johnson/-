window.onload = function() {
//获取到数据
	var files = data.files;
	
//获取元素
	var treeMenu = t.$(".side-bar");//左侧树形菜单
	var brandNav = t.$("#brand-crumb");//上边面包屑导航
	var filePart = t.$('#file-part');//下面文件区域
	var selectAll = t.$('.select-all');//全选框 
	var emptyContent = t.$(".empty-content");//无文件界面
	var checkBoxs = filePart.getElementsByClassName("select");//动态获取到文件区的所有单选框
	var fileItems = filePart.getElementsByClassName("file-item");//动态获取到文件区的所有文件夹项
	var topTip = t.$('#topTip');//顶部弹框
	var newFolderBtn = t.$('.btn-new');//新建文件夹按钮 
	var delFolderBtn = t.$('.btn-del');//删除文件夹按钮 
//-----------------工具函数---------------
	
	//获取到指定data-id的树形菜单项
	function getTreeItemById(dataId) {
		var treeItems = t.$s(".li-item");
		for (var i = 0; i < treeItems.length; i++) {
			if(treeItems[i].dataset.id == dataId) {
				return treeItems[i];
			}
		}
	}
	function changeShow(id) {
	//1.树形菜单区域
		t.delClass(getTreeItemById(currentId), "li-selected");
		t.addClass(getTreeItemById(id), "li-selected")
	//2.面包屑导航区域	
		brandNav.innerHTML = inner.setNavHtml(files, id);
	//3.文件区域	
		emptyContent.style.display = handle.getSonsById(files,id).length ? "none" : "block";
		filePart.innerHTML = inner.setFolderHtml(files, id);
		currentId = id;
	//4.清空全选框
		t.delClass(selectAll, "selected");
	}
	
//	根据文件区 编辑框 里边值的有无改变表现
	function createFile() {
		if(!newFolderBtn.isCreate) {
			return
		} else {
			var newFitem = fileItems[0];//获取到新建的文件夹
			var fileName = t.$(".file-name",newFitem);//获取到新文件夹的标题容器
			var fileEdit = t.$(".file-edit",newFitem).firstElementChild;//获取到新文件夹的编辑框
			var fileNameBox = t.$(".file-name",newFitem);//获取到新文件夹的标题容器
			
			var value = fileEdit.value.trim();//获取到输入值
			if(value) {//如果输入了东西的话
				if(handle.isExistTitle(files, currentId, value)){//如果命名冲突的情况
					filePart.removeChild(newFitem);
					topTipFn("warn", "命名冲突，新建不成功")
				} else {//通过校验
					fileName.innerHTML = value;
					var id = Math.random();
					files.unshift(
						{
							id:id,
							pid:currentId,
							title:value,
							type:"file"
						}
					);
					newFitem.setAttribute("data-id", id);
					treeMenu.innerHTML = inner.setTreeHtml(files, -1);//重绘树形菜单
					t.addClass(getTreeItemById(currentId), "li-selected");
					topTipFn("success", "校验通过，新建成功");
				}
			} else {
				filePart.removeChild(newFitem);
				if(!handle.getSonsById(files,currentId).length) {
					emptyContent.style.display = "block";
				}
			}
		}
		t.delClass(fileNameBox, "edit-mode");//让标题框显示出来同时让编辑框隐藏
		newFolderBtn.isCreate = false;
	}
	
	
	//顶部弹框
	function topTipFn(type, message) {
		var ico = "";
		switch (type){
			case "warn":
				ico = '!';
				break;
			case "error":
				ico = 	'X';
				break;
			default:
				ico = "√";
				break;
		}
		clearTimeout(topTip.timer);
		topTip.style.top = "-60px";
		topTip.style.transition = "none";
		topTip.className = 'tip-'+ type;
		topTip.innerHTML = '<i class="ico circle">'+ico+'</i>'+message;
		setTimeout(function() {
			topTip.style.top = "10px";
			topTip.style.transition = ".3s";
		},0);
		
		topTip.timer = setTimeout(function() {
			topTip.style.top = "-60px";
		},1500)
	}
	
	//全选框
	//	检测有没有都被选上
	function checkIfSelAll(){
			if(Array.from(checkBoxs).every(function(value) {
				return t.hasClass(value, "selected");
			})) {
				t.addClass(selectAll, "selected");//把全选框勾上
			} else {
				t.delClass(selectAll, "selected");//把全选框去掉
			}
		}
	
	//找到当前所有被选择的文件夹 项
	function whoSelected() {
		return Array.from(checkBoxs).filter(function(value) {
			return t.hasClass(value, "selected");
		}).map(function(value) {
			return t.specialPt(value, ".file-item");
		})
	}
	
	//碰撞检测
	function isknock(ele1, ele2) {
		var pos1 = ele1.getBoundingClientRect();
		var pos2 = ele2.getBoundingClientRect();
		
		return pos1.right > pos2.left && pos1.left < pos2.right && pos1.top < pos2.bottom && pos1.bottom > pos2.top;
	}
	
	//检测光标是否进入某一项
	function ifCursorIn(event, ele) {
		var e = event;
		var pos = ele.getBoundingClientRect();
		return e.clientX > pos.left && e.clientX < pos.right && e.clientY > pos.top && e.clientY < pos.bottom;
	}
	
//-------------(初始化)渲染各个区域---------
	var currentId = 0;
//1.树形菜单区域
	treeMenu.innerHTML = inner.setTreeHtml(files, -1);
	//初始状态给id为0的树形菜单项添加选中的class
	t.addClass(getTreeItemById(0), "li-selected");
//2.面包屑导航区域	
	brandNav.innerHTML = inner.setNavHtml(files, 0);
//3.文件区域	
	filePart.innerHTML = inner.setFolderHtml(files, 0);

//-------------添加各个区域的交互-------------
	
//1.树形菜单区域
	t.on(treeMenu, "click", function(ev) {
		var target = ev.target;
		if(target = t.specialPt(target, ".li-item")) {
			var clickId = target.dataset.id;
			changeShow(clickId);
		}
	});

//2.面包屑导航区域	
	t.on(brandNav, "click", function(ev) {
		var target = ev.target;
		if(target = t.specialPt(target, ".path-item")) {
			var clickId = target.dataset.id;
			changeShow(clickId);
		}
	});

//3.文件区域	

	//	鼠标在该区域单击事件
	//1.单击小选框，只给 单选框 & 所在的文件项 加class
	t.on(filePart, "click", function(ev) {
		var target = ev.target;
		if(t.specialPt(target, ".select")) {//点到了单选框
			target = t.specialPt(target, ".select");
			t.toggleClass(target, 'selected');
			
			checkIfSelAll();
		}
		else if(t.specialPt(target, ".editor")) return;//点到了输入框
	});
	//2.点击项的其他部分，进入该目录（通过重新渲染）
	t.on(filePart, "click", function(ev) {
		var target = ev.target;
		if(t.specialPt(target, ".editor") || t.specialPt(target, ".select")) return;
		if(target = t.specialPt(target, ".file-item")) {//点到的不是单选框，也不是输入框的项的其他部分
			//就跳转到下一页（即刷新页面）
			var clickId = target.dataset.id;
			changeShow(clickId);
		}
	});
	
	//鼠标移入移出事件添加
	t.on(filePart, "mouseover", function(ev) {
		var target = ev.target;
		if(target = t.specialPt(target, ".file-item")) {
			t.addClass(target, "file-change");
		}
	});
	t.on(filePart, "mouseout", function(ev) {
		var target = ev.target;
		if(target = t.specialPt(target, ".file-item")) {
			var checkBox = target.querySelector(".select");
			//如果单选框被选中的话，就不会在鼠标移出的时候去掉class了
			if(!t.hasClass(checkBox, "selected"))
				t.delClass(target, "file-change");
		}
	});
	

//4.全选
	t.on(selectAll, "click", function() {
		if(!fileItems.length) return;
		var chooseSelectAll = t.toggleClass(selectAll,"selected");
		Array.from(checkBoxs).forEach(function(value,index) {
			if(chooseSelectAll) {
				t.addClass(value, "selected");
				t.addClass(fileItems[index], "file-change");
			} else {
				t.delClass(value, "selected");
				t.delClass(fileItems[index], "file-change");
			}
		})
	})

//5.新建文件夹
	t.on(newFolderBtn, "mouseup", function() {
		var newFitem = inner.createFolderEle();
		var firstF = fileItems[0];
		//新建好以后塞到父级容器里
		if(firstF){
			filePart.insertBefore(newFitem, firstF);
		} else {
			emptyContent.style.display = "none";
			filePart.appendChild(newFitem);
		}
		
		
		var fileName = t.$(".file-name",newFitem);//获取到新文件夹的标题容器
		var fileEdit = t.$(".file-edit",newFitem).firstElementChild;//获取到新文件夹的编辑框
		var fileNameBox = t.$(".file-name",newFitem);//获取到新文件夹的标题容器
		
		t.addClass(fileNameBox, "edit-mode");//让编辑框显示出来同时让标题框隐藏
		fileEdit.focus();//给输入框焦点
		newFolderBtn.isCreate = true;
	})
	
	//点击输入框以外任何区域，根据里边值的有无改变表现
	t.on(document, 'mousedown', createFile)
	t.on(document, 'keyup', function(ev) {
		if(ev.keyCode === 13) {
			createFile();
		}
	})
	
	//阻止冒泡，使得在编辑状态点击自己（输入框）时，不会冒泡到document，而开始判断输入框有没有内容，进而重绘页面
	t.on(filePart, 'mousedown', function(ev) {
		if(t.specialPt(ev.target, '.editor')) {
			ev.stopPropagation();
		}
	})


//6.删除文件夹
	t.on(delFolderBtn, 'click', function() {
		//定义一个数组用来存放点击删除按钮这一时刻被选中的项的id
		var arr = [];
		for (var i = 0; i < checkBoxs.length; i++) {
			if(t.hasClass(checkBoxs[i], "selected")){
				arr.push(fileItems[i].dataset.id);
			}
		};
		if(!arr.length) {
			topTipFn("warn", "请选择要删除的文件");
		} else {
			//删掉被选中的对象
			handle.delObjByIdArr(files, arr);
			
			//重新渲染
			treeMenu.innerHTML = inner.setTreeHtml(files, -1);
			changeShow(currentId);
		}
	});
	
//7.框选
	t.on(filePart, 'mousedown', function(ev) {
		if(ev.which !== 1 ) return;//如果是点着右键或中键想拖拽的 ，不行！
		var target = ev.target;
		var item = t.specialPt(target, ".file-item");//找到按下位置所在的项
		
		//如果点击的是里边的 "被选中" 的 '项',不让他有框选的能力
		if(item && item.getElementsByClassName("selected").length) return;
		
		//附加点击空白区域取消选择
		var selectedItems = whoSelected();//获取到按下时刻，所有被选的li项
		if(!item) {
			Array.from(selectedItems).forEach(function(value,index) {
				t.delClass(value, 'file-change');
				t.delClass(checkBoxs[index], 'selected');
			})
		}
		//最后把全选框的对号去掉
		t.delClass(selectAll, "selected");//把全选框去掉
		
		
		//创建框
		var square = document.createElement("div");
		square.className = "square";

		
		//记录按下时的鼠标的相对位置
		var oriX = ev.clientX;
		var oriY = ev.clientY;
		square.style.left = oriX + "px";
		square.style.top = oriY + "px";
		

		
		function cursorMove(ev) {
			ev.preventDefault();
			if(Math.abs(ev.clientX - oriX) < 15 && Math.abs(ev.clientY - oriY) < 15 ) return;
			document.body.appendChild(square);//只有鼠标移动距离大于15px时才把他append到网页中
			
			
			square.style.width = Math.abs(ev.clientX - oriX) + "px";
			square.style.height = Math.abs(ev.clientY - oriY) + "px";
			square.style.left = Math.min(oriX, ev.clientX) + "px";
			square.style.top = Math.min(oriY, ev.clientY) + "px";
			
			for (var i = 0; i < fileItems.length; i++) {
				if(isknock(square, fileItems[i])){
					t.addClass(fileItems[i], 'file-change');
					t.addClass(checkBoxs[i], 'selected');
				} else {
					t.delClass(fileItems[i], 'file-change');
					t.delClass(checkBoxs[i], 'selected');
				};
			}
			
			checkIfSelAll();
		}
		function cursorDispear(ev) {
			t.off(document, 'mousemove', cursorMove);
			if(document.body.getElementsByClassName("square")[0]){
				document.body.removeChild(square);
			}
			t.off(document, 'mouseup', cursorDispear);
		}
		//添加鼠标移动事件，会改变生成的块的位置，以及大小
		t.on(document, 'mousemove', cursorMove);
		
		//添加鼠标抬起事件， 会清除掉鼠标移动事件和鼠标抬起事件
		t.on(document, 'mouseup', cursorDispear);
	})
	
	
	
////8. 拖拽
//	t.on(filePart, 'mousedown', function(ev) {
//		if(ev.which !== 1 ) return;//如果是点着右键或中键想拖拽的 ，不行！
//		var target = ev.target;
//		var item = t.specialPt(target, ".file-item");//找到按下位置所在的项
//		
//		//如果点击的不是里边的 "被选中" 的 '项',不让他有拖拽的能力
//		if(!(item && item.getElementsByClassName("selected").length)) return;
//		var selectedItems = whoSelected();//获取到按下时刻，所有被选的li项
//		
//	//1.转换布局，把浮动布局转换成定位布局
//		Array.from(fileItems).forEach(function(value) {
//			value.style.left = value.offsetLeft + "px";
//			value.style.top = value.offsetTop + "px";
//		})
//		Array.from(fileItems).forEach(function(value) {
//			value.style.position = "absolute";
//			value.style.float = "none";
//		})
//	//2.给被选中的元素加克隆 & 记录鼠标距各项的距离
//		var cloneItems = Array.from(selectedItems).map(function(value) {
//											return value.cloneNode(true);
//										})
//			cloneItems.forEach(function(value) {
//											filePart.append(value);
//											value.style.opacity = .5;
//											value.disX = ev.clientX - value.offsetLeft;
//											value.disY = ev.clientY - value.offsetTop;
//										})
//		console.log(cloneItems);
//		
//	//4.加拖拽
//		var currentIndex;
//		function dragFn(ev) {
//			cloneItems.forEach(function(value) {
//				value.style.left = ev.clientX - value.disX + "px";
//				value.style.top = ev.clientY - value.disY + "px";
//				
//				//添加光标进入某项的特殊效果
//				Array.from(fileItems).forEach(function(value,index) {
//					if(ifCursorIn(ev, value)) {
//						if(currentIndex) {
//							fileItems[currentIndex].style.borderColor = "";
//						}
//						value.style.borderColor = "green";
//						currentIndex;
//					}
//				})	
//			})	
//		}
//		t.on(document, 'mousemove', dragFn);
//	//5.鼠标松开
//		function msUp(ev) {
//			cloneItems.forEach(function(value) {
//				filePart.removeChild(value);
//				t.on(document, 'mousemove', dragFn);
//				t.off(document, 'mouseup', msUp);
//				
//				//修改数据 --> 重新渲染
//				
//				
//			})
//		}
//		t.on(document, 'mouseup', msUp);
//	})
}
