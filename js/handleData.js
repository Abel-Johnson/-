var handle = {
	//找到在数组中指定id的元素对象
	getSelfById(dataArr, id) {
		return dataArr.find(function(value) {
			return value.id == id;
		})
	},
	
	//找到在数组中指定id的元素的子数据对象数组
	getSonsById(dataArr, id) {
		return dataArr.filter(function(value) {
			return value.pid == id;
		})
	},
	
	//找到在数组中指定id元素的所有祖先元素对象（包括自己）的数组
	getAncestorsById(dataArr, id) {
		var arr = [];
		var self = handle.getSelfById(dataArr, id);
		if(self) {
			arr.push(self);
			arr = arr.concat(handle.getAncestorsById(dataArr, self.pid));
		}
		return arr;
	},
	
	//通过指定id，找到这个id的所有的子孙数据（包括自己），放在数组中
	getChildrenById(dataArr, id) {
		var arr = [];
		var self = handle.getSelfById(dataArr, id);
		arr.push(self);
		var sons = handle.getSonsById(dataArr, self.id);
		sons.forEach(function(value) {
			arr = arr.concat(handle.getChildrenById(dataArr,value.id) )
		});
			return arr;
	},
	
	//通过指定的一组id，找到每个id下的所有的子孙数据（包括自己），放在数组中
	getChildrenByIdArr(dataArr, idArr) {
		var arr = [];
		idArr.forEach(function(value) {
			arr = arr.concat(handle.getChildrenById(dataArr, value));
		})
		return arr;
	},
	
	
	// 传入一组id，删除其后代数据
	delObjByIdArr(dataArr, idArr) {
		var childAll = handle.getChildrenByIdArr(dataArr, idArr);
		for (var i = 0; i < dataArr.length; i++) {
			for (var j = 0; j < childAll.length; j++) {
				if(dataArr[i] === childAll[j]) {
					dataArr.splice(i,1);
					i--;
					break;
				}
			}
		}
	},
	
	
	//判断传入的字符串在同级的所有title里是否存在
	isExistTitle(dataArr, id, str) {
		var sons = handle.getSonsById(dataArr, id);
		return sons.findIndex(function(value) {
			return value.title === str;
		}) !== -1;
	},
	//返回指定id数据对象在整体数组中的下标
	getIndexById(dataArr, id) {
		return dataArr.findIndex(function(value) {
			return value.id == id;
		})
	},
	
	//删除数组中指定id的数据对象
	delDataObj(dataArr, id) {
		var index = handle.getIndexById(dataArr, id);
		dataArr.splice(index,1);
//		return dataArr;
	}
}
