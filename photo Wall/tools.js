
var tools = (function(){
	//选择器
	function $(selector,content){
		var firstChar = selector.charAt(0);
		content = content || document;
		if( firstChar === '#' ){
			return document.getElementById(selector.slice(1));
		}else if(  firstChar === '.'  ){// 通过 class  来获取 元素
			//首先获取所有元素
			var allElement = content.getElementsByTagName('*');
			// 定义一个数组 用来储存获取到的 元素   	
			var arr =[];											
			for( var i = 0; i < allElement.length ; i++ ){ 
				//循环所有的元素 并获取其的className         
				 var classname = allElement[i].className;
				 // 把该元素的 className 解析为数组 用空格分开           
				 var classArr = classname.split(' ');
				 // 循环该元素的className 每一项 如
				 // 果有一项与传入的 selector.slice(1) 相同				
				 for( var j = 0; j < classArr.length ; j++ ){
				 	// 则表示该元素 有其 class 并
				 	// 把它放入 数组( arr ) 中        
				 	if( classArr[j] == selector.slice(1) ){			 
				 		arr.push( allElement[i] );
				 		// 同时停止该循环          
				 		break;                                      
				 	}
				 }
			};
			return arr;//最后输出 该数组中的所有 元素;
		}else{
			return content.getElementsByTagName(selector);
		}
	}
	//获取计算后属性值   此值有px
	function getStyle(obj,attr){     //获取样式
		if( obj.currentStyle ){
			return obj.currentStyle[attr];
		}else{
			return getComputedStyle(obj)[attr];
		}
	};
	//封装函数 设置参数     控制对象、控制属性、
	//速度、最终值、达到最终值运行的函数
	//MTween之前的版本  用距离计算的  仅供参考使用
	function doMove(obj,attr,speed,target,callBack){ 
		//运行函数式，如果 该定时器存在  则停止
		//函数运行，否则 运行该函数   
		if( obj.timer ) return;
		// 当前该属性的值							
		var num = parseFloat( getStyle( obj,attr ) );
		//判断 目前属性 与 目标属性的大小 如
		//果 大 则 为减小，相反增加	
		speed = num > target ? -Math.abs(speed) : Math.abs(speed); 
		obj.timer = setInterval(function(){	// 开启定时器
			num += speed;	//每次增加值
			//判断 运行中的 num 值是否即将到达 目标属性
			if(Math.abs(target-num) <= Math.abs(speed)){ 
				//也可判断  speed > 0 && 
				//num >= target || speed < 0 && num <= target 
				num = target;//即将到达目
				//标属性则 使 num 值为目标
				//值 （为了防止 与目标属性 微小相差）
				clearInterval(obj.timer);//到达目标属性 关闭定时器
				obj.timer = null;//清除该定时器
				obj.style[attr] = num + 'px';
				//判断 实参中有没有输入 运行的函数 没有则为			
				(typeof callBack === "function") && callBack();  
			}else{
				obj.style[attr] = num + 'px';
			}
		},30)
	}
	//距离现在还有多少天 多少小时 多少分 多少秒
	function futurefun(timeStr){
		var now = new Date();
		var future = new Date(timeStr);
		//转换成距离 timeStr 时间还有多少秒钟
		var time = (future.getTime() - now.getTime())/1000;
		//一天为86400秒
		var Day = Math.floor(time/86400);
		var Hour = Math.floor(time%86400/3600);
		var Minute = Math.floor(time%86400%3600/60);
		var Second = Math.floor(time%60);
		var onOff = true;
		if( time <= 0 ) onOff = false;
		var json = {
			D:Day,
			H:Hour,
			Min:Minute,
			S:Second,
			onOff:onOff
		}
		return json;
	};
	//封装函数，当数字小于10时，自动在数字前添加"0"
	//现阶段知道适用于时钟
	function addZero(m){
		if(m<0) return m;
		if( m >= 10 ){
			return m;
		}else{
			return '0' + m;
		}
	};
	//判断这个classNames是否存在
	function hasClass(element,classNames){
			//取出元素的className 取出之后是一个string，因class中间有空格，因此用字符串的方法split将该字符串剪切成数组
			var classAll = element.className.split(" ");
			//遍历数组 当所检测的classNames存在是返回true,不存在返回false
			for( var i = 0;i < classAll.length;i++ ){
				if( classNames === classAll[i] ){
					return true;//只要检测到有 就立即停止
				}
			}
			return false;//遍历整个数组没有时，才返回false
	}
	//向元素里边添加class
	function addClass(element,classNames){
		//声明oldClass变量，记录没有添加之前的值
		var oldClass = element.className;
		//调用hasClass函数，检测要添加的classNames是否已经存在，如果存在则不执行
		if( !hasClass(element,classNames) ){
			element.className += " " + classNames;
		}
		//增加class完成后，如果之前没有class，则删除第一项的空格，如果之前就有class则这一步就不执行
		if( !oldClass ){
			element.className = element.className.slice(1);
		}
	}
	//从元素里删除class
	function removeClass(element,classNames){
		//先判断是否存在这个class
		if( hasClass(element,classNames) ){
			//获取class字符串集合，截取成数组
			var classAll = element.className.split(" ");
			//遍历数组，找到相同的删除
			for( var i = 0;i < classAll.length;i++ ){
				if( classAll[i] === classNames ){
					classAll.splice(i,1);
					i--;//每删除一个字符串长度减少1，下一个的小标也减小1，所以要减去 用来保证能够遍历到数组的每一项
				}
			}
			if( classAll.length == 0 ){//如果数组长度为0，那么class也就没必要要了
				element.removeAttribute("class");
			}else{//如果有的话，还是重新拼成字符串
				element.className = classAll.join(" ");
			}
		}
	}
	//切换class
	function toggleClass(element,classNames){
		//如果存在这个class 就删除
		if( hasClass(element,classNames) ){
			removeClass(element,classNames);
			return false;//拓展，使另外一个元素可同步
		}else{//如果不存在 就添加
			addClass(element,classNames);
			return true;//拓展，使另外一个元素可同步
		}
	}
	//在指定的元素后边插入元素
	function insertAfter(newElement,targetElement){
			//先找到父级节点
			var parent = targetElement.parentNode;
			//如果目标元素已经是父级的最后一个元素
			if( !targetElement.nextElementSibling ){
				parent.appendChild(newElement);
			}else{//如果目标元素的下一个元素存在
				parent.insertBefore(newElement,targetElement.nextElementSibling)
			}
	}
	//替换想要改变的class
	function replaceClass(element,oldClass,newClass){
		if( hasClass( element,oldClass ) ){
			removeClass(element,oldClass);
			addClass(element,newClass);
		}
	}
	//获取滚动条滚动的距离 返回的是一个对象 属性值包括 同top 和 left
	function scrollT(){
		return {
			top:document.documentElement.scrollTop || document.body.scrollTop,
			left:document.documentElement.scrollLeft || document.body.scrollLeft
			}	
	}
	//获取可视区域的height 和 width 在js中可是区域是html
	function view(){
		return {
			W:document.documentElement.clientWidth,
			H:document.documentElement.clientHeight
		}
	}
	//记录焦点的位置
	function setSelectionRange(element,start,end){
		//说明 start 起始位置 end终止位置
		//选中的内容不包括起始位置，但是包括终止位置
		//如果两者数值相同则没有选中内容，但是focus可以依靠
		//这个位置获取焦点
		//start 取element下的selectionStart属性值
		//end 取element下的selectionEnd属性值
		element.setSelectionRange(start,end);
		element.focus();	
	}
	return {
		$ : $,
		getStyle : getStyle,	//getComputedStyle和obj.current.style
		doMove : doMove,
		futurefun : futurefun,	//距离目标还有几天几小时几分几秒
		addZero : addZero,		//增加0
		hasClass : hasClass,	//检测是否存在向检测的className
		addClass : addClass,	//增加class
		removeClass : removeClass,	//移除class
		toggleClass : toggleClass,	//切换class
		insertAfter : insertAfter,	//在指定元素后面插入元素
		replaceClass : replaceClass,
		scrollT:scrollT,//获取滚动条滚动的距离 
						//返回的是一个对象 属性值包括 同top 和 left
		view:view,      //可视区域宽高
		setSelectionRange : setSelectionRange//获取焦点位置
		
	}
}())



