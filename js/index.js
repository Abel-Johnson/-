window.onload = function() {
//获取到数据
	var files = data.files;
	
//获取元素
	var treeMenu = t.$(".side-bar");//左侧树形菜单
	var brandNav = t.$("#brand-crumb");//上边面包屑导航
	var filePart = t.$('#file-part');//下面文件夹区域
	var selectAll = t.$('.select-all');//全选框 
	var emptyContent = t.$(".empty-content");//无文件界面
	var checkBoxs = filePart.getElementsByClassName("select");//动态获取到文件区的所有单选框
	var fileItems = filePart.getElementsByClassName("file-item");//动态获取到文件区的所有文件夹项
	var topTip = t.$('#topTip');//顶部弹框
	
	var newFolderBtn = t.$('.btn-new');//新建文件夹按钮 
	var delFolderBtn = t.$('.btn-del');//删除文件夹按钮 
	var moveFolderBtn = t.$('.btn-move');//删除文件夹按钮
	var renameFolderBtn = t.$('.btn-rename');//重命名文件夹按钮
	console.log(moveFolderBtn)
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
			var fileName = t.$(".file-title",newFitem);//获取到新文件夹的标题
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
	t.on(document, 'mousedown', function(ev) {
		ev.preventDefault();
	})
	
	
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
	t.on(selectAll, "click", function(ev) {
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
		if(isDraging) return;//如果正在拖拽就不要让该按钮有作用
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
			//弹框确认
			dialog({
				title:"",
				content: `
					<i class="questionIco">?</i>
					<div class="content-desc">
						<p class="text">确定要删除这个文件夹吗？</p>
						<em class="add">已删除的文件可以在回收站找到</em>
					</div>`,
				//该函数是通过返回值来判断要不要关闭弹窗
				okFn: function() {
					//因为后边要得到其返回值肯定要调用该函数,所以可以把该数据也写在里边(这个函数没用到)
					
				//删掉被选中的对象
				handle.delObjByIdArr(files, arr);
				
				//重新渲染
				treeMenu.innerHTML = inner.setTreeHtml(files, -1);
				changeShow(currentId);
				return true;
				}
			});
		}
	});
	
//7.框选
	t.on(filePart, 'mousedown', function(ev) {
		if(ev.which !== 1 ) return;//如果是点着右键或中键想拖拽的 ，不行！
		var target = ev.target;
		var item = t.specialPt(target, ".file-item");//找到按下位置所在的项
		
		//如果点击的是里边的 "被选中" 的 '项',不让他有框选的能力
		if(item && item.getElementsByClassName("selected").length) return;
		
		//附加功能:点击空白区域取消选择
		var selectedItems = whoSelected();//获取到按下时刻，所有被选的li项
		if(!item) {
			Array.from(selectedItems).forEach(function(value,index) {
				t.delClass(value, 'file-change');
				t.delClass(value.getElementsByClassName("select")[0], 'selected');
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
//8. 拖拽
	var isDraging = false;
	t.on(filePart, 'mousedown', function(ev) {
		if(ev.which !== 1 ) return;//如果是点着右键或中键想拖拽的 ，不行！
		var target = ev.target;
		var item = t.specialPt(target, ".file-item");//找到按下位置所在的项
		
		//如果点击的不是里边的 "被选中" 的 '项',不让他有拖拽的能力
		if(!(item && item.getElementsByClassName("selected").length)) return;
		
		var selectedItems = whoSelected();//获取到按下时刻，所有被选的li项
		var selectedIdArr = Array.from(selectedItems).map(function(value) {
			return value.dataset.id;
		})//获取到按下时刻，所有被选的li项的id的集合
		
		var circle = document.createElement("div");
		circle.className = "amount-circle";
//		1.光标移出当前项，加入按下时已经生成的一个小圆圈（里边显示被选择的个数）跟着光标四处移动
		function dragMove(ev) {
			isDraging = true;
			if(!document.body.getElementsByClassName("amount-circle").length && ifCursorIn(ev, item)) return;
				document.body.appendChild(circle);
				circle.innerHTML = selectedItems.length;
				
				circle.style.left = ev.clientX + 10 + "px";
				circle.style.top = ev.clientY + 10 + "px";
		}
		t.on(document, 'mousemove', dragMove)
//		2，鼠标松开
		function dragUp(ev) {
			isDraging = false;
			if(document.body.getElementsByClassName('amount-circle').length) {
				document.body.removeChild(circle);
				
				var selectItemArr = whoSelected();
				var selectItemIdArr = selectItemArr.map(function(value) {
					return value.dataset.id;
				});	
				
				var item = t.specialPt(ev.target, ".file-item");//找到松开鼠标位置所在的项
				if(item && !(selectItemArr.findIndex(function(value){
					console.log(value,item);
					return value == item;
				})+1)){
					var allMoved = true;
					selectItemIdArr.forEach(function(value,index) {
						var self = handle.getSelfById(files, value); //获取到当前项对应的数据对象
						var nowId = item.dataset.id;
						var isExist = handle.isExistTitle(files, nowId, self.title);
						if(!isExist) { 
							//如果不存在,则正是我们需要的,改pid,然后把该元素从文件夹区remove掉
							self.pid = nowId;
							filePart.removeChild(selectItemArr[index]);
							
//////////////////////*加一个处理:把目标项的class去掉
							t.delClass(item, 'file-change');	
//////////////////////*处理完毕
	
	
							
						} else {
//								如果当前遍历到的项的title存在,就意味着该项的移动必然是不成功的,所以就不满足'所有项都被成功移动'了,就要把表状态的'开关'改成false,加开关的作用是:
//								如果没有全部移动成功,要弹出顶部横幅
							
							allMoved = false;
						}
					})
					if( !allMoved ) {
						topTipFn("warn", "部分文件移动失败(不能重名)");
					}
					//重绘页面
					treeMenu.innerHTML = inner.setTreeHtml(files, -1);
					t.addClass(getTreeItemById(currentId), "li-selected")
				}
			}
			t.off(document, 'mousemove', dragMove)
			t.off(document, 'mouseup', dragUp);
		}
		t.on(document, 'mouseup', dragUp);
	})
//9.移动到(弹框)
	/*
		思路:
		目的:选择好文件后
			判断转悠被选择项的数组的长度,
				如果一个都没有选,顶部弹框提醒,不弹框
				如果数组长度大于0,代表选好了要删除的项,弹出框,点击要移动到的文件夹,点击确定,   通过校验   把数据改了,刷新页面
					
				
	 * 
 	*/
	t.on(moveFolderBtn, "click", function() {
		var selectItemArr = whoSelected();
		var selectItemIdArr = selectItemArr.map(function(value) {
			return value.dataset.id;
		});
		var isMoving = false; //表目标文件夹选择的合法性(表示没有选择合法的目标文件夹),初始状态没有选择也是不合法
		var nowId = null;  // 初始被点击的id
			
		if (!selectItemIdArr.length) {
			topTipFn("warn", "请选择要移动的文件");
		} else {
			dialog({
				title: "选择存储位置",
				content: `
					<div class="folder" style="text-align:left; margin-bottom: 5px">
						<i class="fa fa-folder">${handle.getSelfById(files, parseInt(selectItemIdArr[0])).title}</i>
						<span class="folder-nm"></span>
						${selectItemIdArr.length !== 1? `<span class="">等</span>`:``}
					</div>
					<div class="small-tree side-bar">
						${inner.setTreeHtml(files, -1)}
					</div>
				`,
				okFn: function() {
					if(!isMoving) {
						//如果没有校验通过(isMoving还是false,没有改变(只有当通过校验时才会改成true)),没有资格进行移动,就不让弹框关闭
						return false;//不能关弹框
					} else {
						//校验:
						/*
//						 合法的目标文件夹需要满足(这些在if外边做,满足条件后把isMoving改为true):
//						 	1.点击的目标文件夹不是arr里的（以及他们后代元素的)任何一项（不能自己往自己里边移动)
//						 	2.点击的目标文件夹不能是arr里元素的直接父元素(不能把自己拿出来放到自己的父级里(相当于什么都没做))
						 	
//						 特殊的,选好目标文件夹后（目标文件夹选择合法后),
//						 	3.arr里的元素的title 不能 与点击的目标文件夹的子文件夹 重名
						*/
						var allMoved = true;
						selectItemIdArr.forEach(function(value,index) {
							var self = handle.getSelfById(files, value); //获取到当前项对应的数据对象
							var isExist = handle.isExistTitle(files, nowId, self.title);
							if(!isExist) { 
								//如果不存在,则正是我们需要的,改pid,然后把该元素从文件夹区remove掉
								self.pid = nowId;
								filePart.removeChild(selectItemArr[index]);
							} else {
//								如果当前遍历到的项的title存在,就意味着该项的移动必然是不成功的,所以就不满足'所有项都被成功移动'了,就要把表状态的'开关'改成false,加开关的作用是:
//								如果没有全部移动成功,要弹出顶部横幅
								
								allMoved = false;
							}
						})
						if( !allMoved ) {
							topTipFn("warn", "部分文件移动失败(不能重名)");
						}
						
						//重新渲染树形菜单
						treeMenu.innerHTML = inner.setTreeHtml(files, -1);
						t.addClass(getTreeItemById(currentId), "li-selected")
						changeShow(currentId);
						
						return true;//可以关弹框
					}
				}
			});
			//给小树形菜单添加交互	顺便处理点击目标文件夹的合法性(如果合法,就把isMoving改为true; 如果不合法,在按钮左侧提示span里添加提示文字)
			//初始化界面:
			var tipBox = document.getElementsByClassName("tip-box")[0];//整个弹框
			var smallTree = document.getElementsByClassName("small-tree")[0]; //提示对话框里的树型菜单
			var errorTip = tipBox.getElementsByClassName("errorTip")[0]; //错误提示span
			var rootItem = smallTree.getElementsByClassName("li-item")[0];//微云那一项
			t.addClass(rootItem, "li-selected");
			var sTreeNowItem = rootItem;
			var selChildrenArr = handle.getChildrenByIdArr(files, selectItemIdArr);//用来装这些后代数据对象
//			console.log(handle.getChildrenByIdArr(files, selectItemIdArr));
		
			//添加点击
			t.on(smallTree, "click", function(ev) {
		/*		 合法的目标文件夹需要满足:
					 	1.点击的目标文件夹不是arr里的（以及他们后代元素的)任何一项（不能自己往自己里边移动)
					 	2.点击的目标文件夹不能是arr里元素的直接父元素(不能把自己拿出来放到自己的父级里(相当于什么都没做))
		*/
				var target = ev.target;
				
//	--------var selectItemArr		var selectItemIdArr 粘贴备用--------------
				if(target = t.specialPt(target, ".li-item")) {
					
					//添加样式
					t.delClass(sTreeNowItem, "li-selected");
					t.addClass(target, "li-selected");
					sTreeNowItem = target;
					
					//改上边初始化为null的代表当前选中文件夹的id
					nowId = target.dataset.id;
					nowData = handle.getSelfById(files,nowId);
					
					//1.判断.点击的目标文件夹是不是后代arr里的
					var isIn = !!selChildrenArr.find(function(value){
						return value == nowData;
					});
					
					
					//2.判断.点击的目标文件夹不能是arr里元素的直接父元素
					var isExist = (nowId == handle.getSelfById(files, selectItemIdArr[0]).pid);
					
					
					if(isIn) {
						errorTip.innerHTML = '!不能移动到自身或其子文件夹中';
					} else if (isExist){
						errorTip.innerHTML = '!不能移动到自身父文件夹中';
					} else {
						errorTip.innerHTML = '';
					}
					
					isMoving = true;
					if(isIn || isExist) {
						isMoving = false;
					}
					
				}
			})
			
			
			
		}
	})
// 10.重命名
	/*
	 * 思路:
	 	获取到这个时刻已选的项,
	 		根据其长度判断:
	 			如果数组长度等于0(没有选择任何项),顶部弹窗:  topTipFn("warn", "请选择要重命名的文件")
	 			如果数组长度大于1,顶部弹窗:  topTipFn("warn", "只能对单个文件进行重命名")
	 			如果数组长度等于1,进行下一步
	 				把编辑框显示,title隐藏,给焦点（文字加阴影),输入文字...
	 				点击document,校验,修改数据,重新渲染
	 				
	 	
	 */
	
	var rn_obj = {};
	t.on(renameFolderBtn, 'click', function() {
		var selNum = whoSelected().length;//选中项的个数
		switch (selNum) {
			case 0:
				topTipFn("warn", "请选择要重命名的文件");
				break;
			case 1:
				rn_obj.tgItem = whoSelected()[0];
				rn_obj.fileName = t.$(".file-title",rn_obj.tgItem);//获取到新文件夹的标题容器
				rn_obj.fileEdit = t.$(".file-edit",rn_obj.tgItem).firstElementChild;//获取到新文件夹的编辑框
				rn_obj.fileNameBox = t.$(".file-name",rn_obj.tgItem);//获取到新文件夹的标题容器
				rn_obj.fileEdit.value = rn_obj.fileName.innerHTML;
				
				t.addClass(rn_obj.fileNameBox, "edit-mode");  //让编辑框显示出来同时让标题框隐藏
				rn_obj.fileEdit.select(); //给输入框默认值以及选中的效果
				renameFolderBtn.isRename = true;
				break;
			default:
				topTipFn("warn", "只能对单个文件进行重命名");
				break;
		}
	})
	
	/*点击空白区域,让重命名生效
			值是空白时,就不用改title里的值了
   值是别的名字时,要校验一下是否跟同级重名
				值还是原来的名字,就什么都不做
				值不是原来的名字,校验是否同名
					,通过校验再改title
	 最后,统一把显示改了,把数据改了,重绘左侧树形菜单
	*/
	t.on(document, 'mousedown', function(ev){
		if(!renameFolderBtn.isRename) return ;
		var value = rn_obj.fileEdit.value.trim(); //取到编辑框的内容
		
		if(value) {
			var isExist = handle.isExistTitle(files, currentId, value);
			
			if(value !== rn_obj.fileName.innerHTML) {
				if(isExist) {
					topTipFn("warn", "命名冲突，请重新命名");
				} else {
					topTipFn("success", "命名成功");
					rn_obj.fileName.innerHTML = value;
					//修改数据
					var self = handle.getSelfById(files, rn_obj.tgItem.dataset.id);
					self.title = value;
					//重新渲染树形菜单
					treeMenu.innerHTML = inner.setTreeHtml(files, -1);
					t.addClass(getTreeItemById(currentId), "li-selected")
				}
			}
		}
		//转换表现
		console.log("2222");
		t.delClass(rn_obj.fileNameBox, "edit-mode");
		t.delClass(rn_obj.tgItem, 'file-change');
		t.delClass(rn_obj.tgItem.getElementsByClassName("select")[0], 'selected');
			
		renameFolderBtn.isRename = false;
	})
}


