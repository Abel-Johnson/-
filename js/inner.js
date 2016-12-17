(function() {
	window.inner = {
		//根据id生成树形菜单的innerHTML
		setTreeHtml(data, id) {
			var str = "<ul>";
			var sonsData = handle.getSonsById(data, id);
			sonsData.forEach(function(value) {
				str += `<li>
										<h3 class="li-item" data-id="${value.id}" style="padding-left: ${(20 + 28*(handle.getAncestorsById(data, value.id).length-1))}px;">
											<i class=" triangleIco  fa ${handle.getSonsById(data, value.id).length? `fa-caret-down`:``}"></i>
											<i class="treeIco folderIco fa fa-folder-o"></i>
											${value.title}
										</h3>
										${inner.setTreeHtml(data, value.id)}
								</li>`
			})
			str += "</ul>";
			return str;
		},
		
		//根据id生成面包屑导航的innerHTML
		setNavHtml(data, id) {
			var str = "";
			var ancestorsData = handle.getAncestorsById(data, id).reverse();
			ancestorsData.forEach(function(value) {
				str += `<span class="path-item" data-id=${value.id}>${value.title}</span>${value.id != id?`<i class="fa fa-angle-right"></i>`:``}`
			})
			return str;
		},
		
		
		//根据id生成文件区的innerHTML
		
			//生成文件区中 单个文件夹 内部结构
		setAFolder(value) {
			return  `<span class="select">√</span>
										<div class="img">
											<i class="fa fa-folder-open-o"></i>
										</div>
										<div class="file-name">
											<span class="file-title">${value.title}</span>
											<span class="file-edit">
												<input type="text" class="editor"/>
											</span>
										</div>`
		},
			
		
		
		
		setFolderHtml(data, id) {
			var str = "";
			var sonsData = handle.getSonsById(data, id);
				sonsData.forEach(function(value) {
					str += `<li class="file-item" data-id=${value.id}>${inner.setAFolder(value)}</li>`
				})
			return str;
		},
		
		
		//用生成父级然后添加innerHTML的方法来创建文件
		createFolderEle() {
			var container = document.createElement("li");
			container.className = "file-item";
			container.innerHTML = inner.setAFolder({});
			return container;
		}
	}
	
})()
