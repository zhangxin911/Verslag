function iTable(tContainer, tSettings) {
	this.rowCount = tSettings.rowCount;
	this.cellCount = tSettings.cellCount;
	this.container = tContainer;
	this.settings = tSettings;
	var header, footer, curIndex,tools;
}

iTable.prototype.createContent = function(tid) {
	var tId = tid || 1;
	var myContainer = this.container;
	myContainer.empty();
	var tb = $("<table class='dataTable' id='iTable" + tId + "'></table>");
	myContainer.append(tb);

	for(var i = 0; i < this.rowCount; i++) {
		var tr = this.createTr();
		$("#iTable" + tId).append(tr);
		for(var j = 0; j < this.cellCount; j++) {
			var td = this.createTd('', '');

			tr.append(td);
		}

	}
	this.setIndex();
	$("[pos=0-0]").addClass('ui-selected');
}

iTable.prototype.createTr = function() {
	var tr = $("<tr></tr>");
	return tr;
}
iTable.prototype.createTd = function(className, tdValue) {

	var td = $("<td class=" + className + ">" + tdValue + "</td>");
	return td;
}
iTable.prototype.createXaxis = function() {

	var xAxis = $("<div class='xOrder'></div>");
	xAxis.empty();
	var xTable = $("<table class='titleTable'></table>");
	var xTdWidth = [];
	var curT = this.getCurTable();
	var firTds = curT.find('tr:first td');

	xAxis.insertBefore(this.container);
	xAxis.append(xTable);
	for(var i = 0; i < 1; i++) {
		var tr = $("<tr></tr>");

		tr.appendTo($(".titleTable"));

		for(var j = 0; j < this.cellCount; j++) {
			var td = $("<td>" + IntToChr(j) + "</td>");

			td.appendTo(tr);
		}

	}

}
iTable.prototype.createYaxis = function() {
	var yAxis = $("<div class='yOrder'></div>");
	var yTable = $("<table class='leftTable'></table>");

	yAxis.empty();
	yAxis.insertBefore(this.container);
	yAxis.append(yTable);
	for(var i = 0; i < this.rowCount; i++) {
		var tr = $("<tr></tr>");

		tr.appendTo($(".leftTable"));

		for(var j = 0; j < 1; j++) {
			var th = $("<td>" + (i + 1) + "</td>");

			th.appendTo(tr);
		}

	}
}
iTable.prototype.createTip = function() {
	var content = $('<div></div>');
	tLeft = $('.yOrder');
	tHead = $('.xOrder');

	bLeft = tLeft.find('table tr:first td:first').outerWidth();
	bTop = tHead.find('table tr:first td:first').outerHeight();
	content.css({
		'position': 'fixed',
		'background': '#f5f5f5',
		'z-index': 101,
		'top': '0',
		'left': '0',
		'width': bLeft,
		'height': bTop,
		'border-right': '1px solid #AAAAAA',
		'border-bottom': '1px solid #AAAAAA',
		'margin-top': '70px'
	});
	content.insertBefore(this.container);
}

iTable.prototype.getCurTable = function() {
	var t;
	t = this.container.find('table:visible');
	return t
}

iTable.prototype.setCss = function() {
	var viewWidth = $(window).width();
	var viewHeight = $(window).height();
	tBody = this.getCurTable().parent();

	tLeft = $('.yOrder');
	tHead = $('.xOrder');

	bLeft = tLeft.find('table tr:first td:first').outerWidth() + 1;
	bTop = tHead.find('table tr:first td:first').outerHeight() + 1;

	tLeft.css({
		'position': 'fixed',
		'z-index': '99',
		'background': '#f5f5f5',
		'height': viewHeight,
		'overflow': 'hidden',
		'left': '0'
	});
	tHead.css({
		'position': 'fixed',
		'z-index': '100',
		'background': '#f5f5f5',
		'width': viewWidth - bLeft,
		'overflow': 'hidden',
		'margin-left': bLeft,
		'margin-top': '70px',
		'top': '0'
	});

	tBody.css({
		'margin-left': bLeft,
		'margin-top': bTop + 70,
		'width': viewWidth - bLeft,
		'height': viewHeight - bTop - 110,
		'overflow': 'scroll',
		'position': 'relative'
	});

	var that = this.container;
	$(window).resize(function() {
		var viewWidth = $(window).width();
		var viewHeight = $(window).height();
		that.width(viewWidth - bLeft);
		that.height(viewHeight - bTop);
	});

}
//滚动
iTable.prototype.tableScroll = function() {
	this.container.scroll(function() {
		var scrollY = $(this).scrollTop();
		var scrollX = $(this).scrollLeft();

		$(".yOrder table").css('margin-top', -scrollY);
		$(".xOrder table").css('margin-left', -scrollX);

	});
}

//填写表格
iTable.prototype.fillTd = function(tid) {

	var tid = tid || 1;;
	var _self = this;
	$('#iTable' + tid).find('tr td').each(function() {

		$(this).dblclick(function() {
             
			var that = $(this);
			var ev = ev || window.event;
			that.attr('fid', 'tttt')

			var tdWidth = that.width();
			var tdHeight = that.height();
			var tdText = that.text();

			var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'></input>");

			tdInput.width(tdWidth - 2);
			tdInput.height(tdHeight - 2);

			that.html(tdInput);

			set_text_value_position(tdInput, -1);
            $('.tdInput').keyup(function(){
            	$('#ip_fx').val($(this).val());
            });
            
			$('.tdInput').blur(function() {
				 
				var content = $('.tdInput').val();
                
				if(tdText == content) {

					$(this).parent().html(content);

				} else {

					$(this).parent().html(content);

				}
				$('.tdInput').remove();

				
			});

			$(".tdInput").keyup(function(ev) {
				if(ev.keyCode == 13) {
					$('.tdInput').blur();
				}
			});
            $(".tdInput").click(function(ev) {
				return false;
			});
			$('#iTable' + tid + ' tr td').not(that).click(function(event) {
				    
					$('.tdInput').blur();
			});

		});

		$(this).click(function() {

			var tr = $(this).parent();
			$('.dataTable').find('td').removeClass('ui-selected');
			$(this).addClass('ui-selected');

			$(".dataTable tr td").removeAttr('chosed');
			$(this).attr('chosed', 'clickone');
			var xCoo = Number($(this).attr('cols')) - 1,
				yCoo = Number($(this).attr('rows')) - 1;
			var colspan = Number($(this).attr('colspan'));
			var rowspan = Number($(this).attr('rowspan'));

			colspan = colspan || 1;
			rowspan = rowspan || 1;

			var xIndex = $(this).index() + 1;
			var yIndex = $(this).parent().index() + 1;
			var targetY = $(".yOrder table").find('tr:eq(' + yCoo + ')');
			var targetX = $(".xOrder table").find('tr td:eq(' + xCoo + ')');
            $('.disbox').text(IntToChr(xCoo)+String(yCoo+1));
			_self.remakeRow(targetY, yCoo, xIndex, yIndex, rowspan, colspan);
			_self.remakeCol(targetX, xCoo, xIndex, yIndex, rowspan, colspan, xCoo, yCoo);
            _self.tdTofx($(this));
            removeUied();
            $('#ip_fx').blur();
           
		});
		$(this).mouseenter(function(){
			var text=$(this).text();
			var div=$('<div class="tdTip">'+text+'</div>');
			var len=getStrLength(text);
			if(len>10){
			$('body').append(div);
			var dis=mouseCoords();
			
			div.css({
				'position':'absolute',
				'top':dis.y,
				'left':dis.x
			});
			}else{
				return;
			}
			
		});
		$(this).mouseout(function(){
			$('.tdTip').remove();
		});
		 
        
	});
 ;
}
function getStrLength(str) {
         
        var realLength = 0, len = str.length, charCode = -1;
        for (var i = 0; i < len; i++) {
            charCode = str.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) realLength += 1;
            else realLength += 2;
        }
        return realLength;
    };

function mouseCoords(ev) {
		var ev = ev || window.event;
		if (ev.pageX || ev.pageY) {
			return {
				x: ev.pageX,
				y: ev.pageY
			};
		}
		return {
			x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
			y: ev.clientY + document.body.scrollTop - document.body.clientTop
		};
	}


//创建底部容器
iTable.prototype.createFooter = function() {
	this.footer = $('<div class="footer"></div>');
	this.footer.css({
		'z-index': 102
	})
	this.container.after(this.footer);

	var addBox = $('<div class="addBox"><div class="addSheet"></div></div>');
	this.footer.append(addBox);

	var sheetQueue = $('<div class="sheetqueue"><div><dl class="sheetqueuedl"><dd class="sheet sheetdefault" id="sheet1">1</dd></dl></div></div>');
	this.footer.append(sheetQueue);

	var sheetFloat = $('<div class="sheetfloat"><span class="lsheet"></span><span class="rsheet"></span></div>');
	this.footer.append(sheetFloat);
	this.sheetWork();
}

//创建头部容器
iTable.prototype.createHeader = function() {
	this.header = $('<div class="header"></div>');
	this.header.css({
		'z-index': 103
	})
	this.tools=$('<div class="tools"></div>');
	this.header.append(this.tools);
	this.header.insertBefore(this.container);

}

 

//字体类型
iTable.prototype.fontFamily = function() {
	var select = this.createSelection('fontFamily', this.settings.fontFamily);
	var sel_a = $(select[0]).find('ul li a');
	var className, curClass;
	var selThem;

	sel_a.on('click', function() {

		className = $(this).attr('class');
		$('.ui-selected').addClass(className);

		var reg = new RegExp("(((font_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
			curClass = curClass.replace(reg, className);
		} else {
			return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
		selThem = $('.ui-selected');
		removeUied();
		$('.ui-selected').removeAttr('class');
		selThem.addClass(curClass);
	});

	sel_a.mouseover(function() {
		$(this).css({
			'background': '#ECECEC'
		});

	});
	sel_a.mouseout(function() {
		$(this).css({
			'background': '#FFFFFF'
		});
	});

}
//字体大小
iTable.prototype.fontSize = function() {
	var select = this.createSelection('fontSize', this.settings.fontSize);
	var sel_a = $(select[0]).find('ul li a');
	var className, curClass;
	var selThem;
	sel_a.on('click', function() {

		className = $(this).attr('class');
		$('.ui-selected').addClass(className);

		var reg = new RegExp("(((fsize_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
			curClass = curClass.replace(reg, className);
		} else {
			return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
		selThem = $('.ui-selected');
		removeUied();
		$('.ui-selected').removeAttr('class');

		selThem.addClass(curClass);
	});

	sel_a.mouseover(function() {
		$(this).css({
			'background': '#ECECEC'
		});

	});
	sel_a.mouseout(function() {
		$(this).css({
			'background': '#FFFFFF'
		});
	});
}
//字体粗细
iTable.prototype.fontBold = function() {
	var simMenu = this.createSimpleMenu('fbold');
	var sel_a = $(simMenu[0]).children(0);
	sel_a.on('click', function() {
		removeUied();
		$('.ui-selected').hasClass('ffbold') ? $('.ui-selected').removeClass('ffbold') : $('.ui-selected').addClass('ffbold');

	});

}
//字体倾斜
iTable.prototype.fontItalic = function() {
	var simMenu = this.createSimpleMenu('fitalic');
	var sel_a = $(simMenu[0]).children(0);
	sel_a.on('click', function() {
		removeUied();
		$('.ui-selected').hasClass('ffitalic') ? $('.ui-selected').removeClass('ffitalic') : $('.ui-selected').addClass('ffitalic');

	});

}
//字体下划线
iTable.prototype.fontOverline = function() {
	var simMenu = this.createSimpleMenu('foverline');
	var sel_a = $(simMenu[0]).children(0);
	sel_a.on('click', function() {
		removeUied();
		$('.ui-selected').hasClass('ffoverline') ? $('.ui-selected').removeClass('ffoverline') : $('.ui-selected').addClass('ffoverline');

	});

}
//字体颜色
iTable.prototype.fontColor = function() {
	var select = this.createCellMenu('d_fcolor', 'fontColor', this.settings.fontColor);
	var td = $(select[0]).find('table tr td');
	var className, curClass;
	var selThem;

	td.on('click', function() {
		removeUied();

		className = $(this).find('a').attr('class');
		$('.ui-selected').addClass(className);

		var reg = new RegExp("(((fc_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
			curClass = curClass.replace(reg, className);
		} else {
			return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
		selThem = $('.ui-selected');
		$('.ui-selected').removeAttr('class');

		selThem.addClass(curClass);
	});
}
//表格背景
iTable.prototype.bgColor = function() {
	var select = this.createCellMenu('d_fill', 'bgColor', this.settings.bgColor);
	var td = $(select[0]).find('table tr td');
	var className, curClass;
	var selThem;

	td.on('click', function() {

		className = $(this).attr('class');
		$('.ui-selected').addClass(className);

		var reg = new RegExp("(((ffill_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
			curClass = curClass.replace(reg, className);
		} else {
			return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
		selThem = $('.ui-selected');
		$('.ui-selected').removeAttr('class');

		selThem.addClass(curClass);
		removeUied();
	});
}

//字符对齐
iTable.prototype.textAlign = function() {
	var select = this.createCellMenu('f_align', 'textAlign', this.settings.textAlign);
	var td = $(select[0]).find('table tr td');
	var className, curClass;
	var selThem;
	td.css({
		'background': '#FFFFFF'
	});
	td.on('click', function() {

		className = $(this).attr('class');
		$('.ui-selected').addClass(className);

		var reg = new RegExp("(((falign_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
			curClass = curClass.replace(reg, className);
		} else {
			return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
		selThem = $('.ui-selected');
		$('.ui-selected').removeAttr('class');

		selThem.addClass(curClass);
		removeUied();
	});

	td.mouseover(function() {
		$(this).css({
			'background': '#ECECEC'
		});

	});
	td.mouseout(function() {
		$(this).css({
			'background': '#FFFFFF'
		});
	});
}
//公式选择
iTable.prototype.express=function(){
	var select = this.createSelection('express', this.settings.express);
	var sel_a = $(select[0]).find('ul li a');
	var className, curClass;
	var selThem;
    var that=this;
	sel_a.on('click', function() {
        var ways=$(this).attr('class').replace('fx_','');
       // that.formula(ways);
	});

	sel_a.mouseover(function() {
		$(this).css({
			'background': '#ECECEC'
		});

	});
	sel_a.mouseout(function() {
		$(this).css({
			'background': '#FFFFFF'
		});
	});
}
//单元格上的公式区域
iTable.prototype.formula=function(ways){
	removeUied();
	var func=ways;
	var target=$('.ui-selected')[0];
	var tmpContent=$(target).text();
	var xCoo=$(target).attr('cols');
	var yCoo=$(target).attr('rows');
	var input=$('<input type="text">');
	var width=target.offsetWidth;
	var height=target.offsetHeight;
	var left=target.offsetLeft;
	var top=target.offsetTop;
	var enterDiv=$('<div></div>');
     
	enterDiv.append(input);
	enterDiv.css({
		'min-width': width - 2,
		'height': height - 2,
		'left': left,
		'top': top,
		'position': 'absolute',
		'border': '1px solid red',
		'z-index': '98',
		'background':'#ffffff'
	});
	input.css({
		'height':height-10,
		'line-height':height-10,
		'border':'none',
		'outline':'none'
		
		
	}); 
	this.container.append(enterDiv);
	
}

iTable.prototype.sum=function(val){   	 
	 var total;
	 for(var i=0;i<val.length;i++){
	 	 if(val[i]!=''){
	 	 	total+=parseInt(val[i]);
	 	 }
	 }
	 console.log(total);
	 return total;
}

//合并单元格
iTable.prototype.mergeTd = function() {
	var mergeBtn = this.createSimpleMenu('mergeBtn');
	var that = this;
	mergeBtn.on('click', function() {
		var $t = $('.dataTable');
		if($("table", $t).length > 0) {
			alert("不支持嵌套表格！");
			return;
		}

		var sigDel = "sign4delete";
		var sigSel = "ui-selected";

		$("th,td", $t).each(function() {

			var ridx = $("tr", $t).index($(this).parent("tr"));
			var cidx = $(this).parent().children("th,td").index(this);

			var rowspan = Number($(this).attr("rowspan")) || 1;
			var colspan = Number($(this).attr("colspan")) || 1;
			var isSel = $(this).hasClass(sigSel);

			if(rowspan <= 1 && colspan <= 1) return;

			$("tr", $t).each(function() {
				var idx = $("tr", $t).index(this);
				var arr, $td = $("<td>").addClass(isSel ? sigSel : sigDel);

				if(idx == ridx) {
					// 本行在 [cidx] 后插入 colspan-1 个

					arr = $(); // 准备待插单元格
					for(var i = 0; i < colspan - 1; i++)
						arr = arr.add($td.clone());
					// 插入
					$("th,td", this).eq(cidx).after(arr);

				} else if(ridx < idx && idx < ridx + rowspan) {
					// 以下行在 [cidx] 前插入 colspan 个

					arr = $(); // 准备待插单元格
					for(var i = 0; i < colspan; i++)
						arr = arr.add($td.clone());
					// 插入
					if(cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0) $("th,td", this).eq(cidx - 1).after(arr);
					else if($("th,td", this).eq(cidx).length > 0) $("th,td", this).eq(cidx).before(arr);
					else $(this).prepend(arr);
				}
			});
		});

		var rmin = 10000,
			cmin = 10000;
		var rmax = 0,
			cmax = 0;
		var rnum, cnum;
		// 计算起始和跨距
		$("th,td", $t).filter("." + sigSel).each(function() {
			var ridx = $("tr", $t).index($(this).parent("tr"));

			rmin = ridx < rmin ? ridx : rmin;
			rmax = ridx > rmax ? ridx : rmax;

			var cidx = $(this).parent().children("th,td").index(this);

			cmin = cidx < cmin ? cidx : cmin;
			cmax = cidx > cmax ? cidx : cmax;

		});
		rnum = rmax - rmin + 1;
		cnum = cmax - cmin + 1;

		// 合并单元格
		$("th,td", $t).each(function() {
			var ridx = $("tr", $t).index($(this).parent("tr"));
			var cidx = $(this).parent().children("th,td").index(this);

			if(rmin <= ridx && ridx <= rmax && cmin <= cidx && cidx <= cmax) $(this).addClass(sigDel);

			if(ridx == rmin && cidx == cmin) $(this).removeClass(sigDel).attr({
				rowspan: rnum,
				colspan: cnum
			});

			if($(this).attr("rowspan") == 1) $(this).removeAttr("rowspan");
			if($(this).attr("colspan") == 1) $(this).removeAttr("colspan");
		}).remove("." + sigDel);
		that.setIndex();
	});

}
//拆分单元格
iTable.prototype.splitTd = function() {
	var splitBtn = this.createSimpleMenu('splitBtn');
	var that = this;
	splitBtn.on('click', function() {
		var $t = $(".dataTable");

		if($("table", $t).length > 0) {
			alert("不支持嵌套表格！");
			return;
		}

		var sigDel = "sign4delete";
		var sigSel = "ui-selected";

		$("th,td", $t).each(function() {

			var ridx = $("tr", $t).index($(this).parent("tr"));
			var cidx = $(this).parent().children("th,td").index(this);
			var rowspan = Number($(this).attr("rowspan")) || 1;
			var colspan = Number($(this).attr("colspan")) || 1;
			var isSel = $(this).hasClass(sigSel);

			if(rowspan <= 1 && colspan <= 1) return;

			if(isSel) $(this).removeAttr("colspan").removeAttr("rowspan");

			// 跨格开插
			$("tr", $t).each(function() {
				var idx = $("tr", $t).index(this);
				var arr, $td = $("<td>");

				if(!isSel) $td.addClass(sigDel);

				if(idx == ridx) {
					// 本行在 [cidx] 后插入 colspan-1 个

					arr = $(); // 准备待插单元格
					for(var i = 0; i < colspan - 1; i++)
						arr = arr.add($td.clone());

					$("th,td", this).eq(cidx).after(arr);

				} else if(ridx < idx && idx < ridx + rowspan) {
					// 以下行在 [cidx] 前插入 colspan 个

					arr = $(); // 准备待插单元格
					for(var i = 0; i < colspan; i++)
						arr = arr.add($td.clone());

					if(cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0) $("th,td", this).eq(cidx - 1).after(arr);
					else if($("th,td", this).eq(cidx).length > 0) $("th,td", this).eq(cidx).before(arr);
					else $(this).prepend(arr);

				}
			});
		});

		$("th,td", $t).remove("." + sigDel);
		that.setIndex();
	});

}

//创建工具栏下拉菜单
iTable.prototype.createSelection = function(id, menus) {
	var selection = $('<div class="toolBox"></div>');
	var selectHead = $('<div id="' + id + '"></div>');
	var selectUl = $('<ul id=""></ul>');
	var selectLi, arr = [];

	for(var index in menus) {
		arr.push(index);
		selectHead.text(arr[0]);
		selectLi = $('<li><a class="' + menus[index] + '">' + index + '</a></li>');
		selectUl.append(selectLi);
	}
	selectHead.after(selectUl);

	selection.append(selectHead);
	this.tools.append(selection);
	selectUl.hide();
	selectHead.on('click', function() {
		selectUl.toggle();
	});

	selectUl.find('li a').on('click', function() {

		$(selectHead[0]).text($(this).text());
	})
	return selection;
}

//创建工具栏单个菜单
iTable.prototype.createSimpleMenu = function(className) {
	var menus = $('<div class="toolBox"></div>');
	var simTool = $('<span class="' + className + '"></span>');
	menus.append(simTool);
	this.tools.append(menus);
	return menus;
}
//创建工具栏格子菜单
iTable.prototype.createCellMenu = function(dClass, className, menus) {

	var selection = $('<div class="toolBox"></div>');
	var selectHead = $('<div class="' + dClass + '"></div>');
	var selectTb = $('<table class="' + className + '"></table>');
	var selectTr = $('<tr></tr>');
	var selectTd, length = JSONLength(menus);
	var arr1 = [],
		arr2 = [];
	for(var index in menus) {
		arr1.push(menus[index].tdclass);
		arr2.push(menus[index].fclass);

	}
	for(var i = 0; i < arr1.length + 1; i++) {
		selectTd = $('<td class="' + arr1[i] + '"><a class="' + arr2[i] + '"></a></td>');
		selectTr.append(selectTd);
		if((i + 1) % 5 == 0 && (i + 1) != 0) {

			selectTb.append(selectTr);
			selectTr = $('<tr></tr>');

		} else {
			selectTb.append(selectTr);
		}

	}

	selectHead.after(selectTb);
	selection.append(selectHead);

	this.tools.append(selection);

	selectTb.hide();
	selectHead.on('click', function() {
		selectTb.toggle();
	});
	return selection;

}
//增加sheet
iTable.prototype.addSheet = function() {
	var i = 2;
	var box = this.container;
	var that = this;         
	$('.addSheet').click(function() {
		box.empty();
		var dd = $("<dd class='sheet sheetdefault' id=sheet" + i + ">sheet" + i + "</dd>");
		var curId = $(".sheetdefault").attr('id');
		curId = curId.replace('sheet', '');
		curId = parseInt(curId);

		$("#sheet" + curId).removeClass('sheetdefault');

		var neId = parseInt(curId) + 1;

		$('.sheetqueuedl').append(dd);
		that.createContent(neId);
		that.fillTd(neId);
		$("#iTable" + neId).selectable();
		i++;
		that.sheetWork(); 
		
	 });
}

iTable.prototype.sheetWork=function(){
	var that=this;
	$('.sheet').on('click', function() {
			box.empty();
			var dId = $(this).attr('id');
			dId = dId.replace('sheet', '');
			dId = parseInt(dId);
			that.createContent(dId);
			that.fillTd(dId);
			$("#iTable" + dId).selectable();
			$(this).addClass('sheetdefault').siblings().removeClass('sheetdefault');

			return false;
		});
		
	
		$('.sheet').on('dblclick', function() {
			var that = $(this);
			var ev = ev || window.event;
			var tdWidth = that.width();
			var tdHeight = that.height();
			var tdText = that.text();

			var stInput = $("<input type='text' class='stInput'  value='" + tdText + "'></input>");

			stInput.width(tdWidth - 2);
			stInput.height(tdHeight - 2);

			that.html(stInput);
			$('.stInput').blur(function() {
				var content = $('.stInput').val();

				if(tdText == content) {

					$(this).parent().html(content);

				} else {

					$(this).parent().html(content);

				}
				$('.stInput').remove();

				event.stopPropagation();
			});
			$(".stInput").keyup(function(ev) {
				if(ev.keyCode == 13) {
					$('.stInput').blur();
				}
			});
		});

}


//sheet移动
iTable.prototype.sheetMove = function() {
	var lsheet = $('.lsheet');
	var rsheet = $('.rsheet');
	var sDl = $(".sheetqueuedl");
	var num = 0;

	rsheet.click(function() {
		num == sDl.find('dd').length - 1 ? num = sDl.find('dd').length - 1 : num++;
		toNavRPos();

	});

	lsheet.click(function() {
		num == 0 ? num = 0 : num--;
		toNavRPos();
	});

	function toNavRPos() {
		sDl.stop().animate({
			'margin-left': -num * 80
		}, 100);

	}

	function toNavLPos() {

		if(sDl.css('marginLeft') < sDl.css('width')) {
			sDl.animate({
				'margin-left': 100
			}, 100);

		} else {
			sDl.stop();
		}

	}
}
//设置坐标
iTable.prototype.setIndex = function() {
	var offsetLeftArray = new Array();
	var cell; // 单元格Dom  
	var col; // 单元格实际所在列  
	var cellStr; // 每个cell以row,col,rowSpan,colSpan,value形式  
	var cellStrArray = [];
	var t = this.getCurTable();

	var id = (t.attr('id')).replace('iTable', '');

	var objTab = document.getElementById('iTable' + id);

	// 遍历第一次取出offsetLeft集合  
	for(var i = 0; i < objTab.rows.length; i++) {
		for(var j = 0; j < objTab.rows[i].cells.length; j++) {
			cell = objTab.rows[i].cells[j];
			if(offsetLeftArray.contains(cell.offsetLeft) == -1)
				offsetLeftArray.push(cell.offsetLeft);

		}
	}

	offsetLeftArray.sort(function(x, y) {
		return parseInt(x) - parseInt(y);
	});

	// 遍历第二次生成cellStrArray  
	for(var i = 0; i < objTab.rows.length; i++) {
		for(var j = 0; j < objTab.rows[i].cells.length; j++) {
			cell = objTab.rows[i].cells[j];

			col = offsetLeftArray.contains(cell.offsetLeft);

			cellStr = i + ',' + col;
			cellStrArray.push(cellStr);
			var coo = (i + 1) + ',' + (col + 1);
			var coo = cellStrArray[j];
			cell.setAttribute('rows', i + 1);
			cell.setAttribute('cols', col + 1);
			cell.setAttribute('pos', i + '-' + col);
		}
	}

}
//创建操作行按钮
iTable.prototype.remakeRow = function(obj, rowNum, xIndex, yIndex, rowspan, colspan) {
	var btnBox = $('<div class="trBtn"></div>');
	var addTr = $('<span class="addTr">+</span>');
	var delTr = $('<span class="delTr">-</span>');
	var _self = this;
	var t = this.getCurTable();
	var id = (t.attr('id')).replace('iTable', '');
	var xIndex = xIndex,
		yIndex = yIndex;
	var rowSpan = rowspan,
		colSpan = colspan;

	var targetTd = obj.children(0);
	var otherTd = obj.siblings().children(0);
	btnBox.append(addTr);
	btnBox.append(delTr);

	for(var i = 0; i < otherTd.length; i++) {
		$(otherTd[i]).children(0).remove();
	}

	if(targetTd.children(0)) {
		targetTd.children(0).remove();
	} else {
		targetTd.append(btnBox);
	}

	targetTd.append(btnBox);
	addTr.on('click', function() {
		//		for(var i = 0; i < rowSpan; i++) {
		var tr = _self.createTr();

		for(var j = 0; j < _self.cellCount; j++) {
			var td = _self.createTd('', '22');
			tr.append(td);
		}
		if(rowSpan == 1) {
			$(t).find('tr:eq(' + rowNum + ')').after(tr);
		} else {
			$(t).find('tr:eq(' + (rowSpan + yIndex - 2) + ')').after(tr);
		}

		//		}

		for(var k = 0; k < rowSpan; k++) {
			var ltr = $("<tr></tr>");
			var ltd = $("<td></td>");
			ltr.append(ltd);
			if(rowspan == 1) {
				$('.leftTable').find('tr:eq(' + rowNum + ')').after(ltr);
			} else {
				$('.leftTable').find('tr:eq(' + (rowSpan + yIndex - 2) + ')').after(ltr);

			}
		}
		_self.rowCount++;
		_self.remarkLeft($('.leftTable'), rowNum);
		_self.setIndex();
		_self.fillTd(id);

	});
	delTr.on('click', function() {
		$('.leftTable').find('tr:eq(' + rowNum + ')').remove();

		if(rowSpan != 1) {
			$("#iTable" + id).find('tr:eq(' + rowNum + ')').remove();
			for(var j = rowNum; j < rowSpan + rowNum - 1; j++) {
				for(var i = 0; i < colSpan; i++) {

					$("#iTable" + id).find('tr:eq(' + j + ')').append($("<td></td>"));
					 
				}
			}
		} else {
			$("#iTable" + id).find('tr:eq(' + rowNum + ')').remove();

		}
		_self.remarkLeft($('.leftTable'), rowNum);
		_self.setIndex();
		_self.fillTd(id);
	});

}

//创建列操作按钮
iTable.prototype.remakeCol = function(obj, colNum, xIndex, yIndex, rowspan, colspan, xCoo, yCoo) {
	var btnBox = $('<div class="colBtn"></div>');
	var addCol = $('<span class="addCol">+</span>');
	var delCol = $('<span class="delCol">-</span>');
	var _self = this;
	var t = this.getCurTable();
	var id = (t.attr('id')).replace('iTable', '');

	var targetTd = obj;
	var otherTd = obj.parent().children(0);
	var xIndex = xIndex,
		yIndex = yIndex;
	var rowSpan = rowspan,
		colSpan = colspan;
	var xCoo = xCoo;

	btnBox.append(addCol);
	btnBox.append(delCol);

	for(var i = 0; i < otherTd.length; i++) {
		$(otherTd[i]).children(0).remove();
	}

	if(targetTd.children(0)) {
		targetTd.children(0).remove();
	} else {
		targetTd.append(btnBox);
	}
	targetTd.append(btnBox);

	addCol.on('click', function() {

		for(var j = 0; j < _self.rowCount; j++) {

			var td = _self.createTd('', 'new');
			var num = Number(xCoo) + Number(colSpan);

			$("[pos='" + j + "-" + num + "']").before(td);
		}

		var ttd = $("<td></td>");
		$('.titleTable').find('tr:eq(0) td:eq(' + colNum + ')').after(ttd);
		_self.cellCount++;
		_self.remarkTop($('.titleTable'), colNum);

		_self.setIndex();
		_self.fillTd(id);
	});

	delCol.on('click', function() {
		for(var j = 0; j < _self.rowCount; j++) {
			var num = Number(xCoo) + Number(colSpan) - 1;

			$("[pos='" + j + "-" + num + "']").remove();

		}
		$('.titleTable').find('tr td:eq(' + xIndex + ')').remove();
		_self.remarkTop($('.titleTable'), colNum);
		_self.setIndex();
		_self.fillTd(id);
	});
}
//更新顶部
iTable.prototype.remarkTop = function(obj, startNum) {
	var TopTb = obj;
	var trs = $(TopTb[0]).find('tr td');
	var trLength = trs.length;

	for(var i = startNum; i < trLength; i++) {
		$(trs[i]).text(IntToChr(i));
	}
}
//更新左侧
iTable.prototype.remarkLeft = function(obj, startNum) {
	var leftTb = obj;
	var trs = $(leftTb[0]).find('tr td');
	var trLength = trs.length;
	for(var i = startNum; i < trLength; i++) {
		$(trs[i]).text(i + 1);
	}

}
//创建公式输入框
iTable.prototype.fillBlank = function() {
	var fxBox = $('<div class="fx"></div>');
	var fxInput = $('<input type="text" id="ip_fx">');
	var dis=$('<span class="disbox"></span>');
	fxBox.append(dis);
	fxBox.append(fxInput);
	this.header.append(fxBox);
	this.fillWork();
}
//输入操作
iTable.prototype.fillWork = function() {

	var ev = ev || event;
	var ifx = $('#ip_fx');
	var pValue, nValue;
	var pArr, nArr, cArr;
	var endText;
	var res, delRes;
	var delText;
	var reg, flReg;
    var that=this;
    var calText;
	ifx.keyup(function(ev) {
		pValue = ifx.val();
		 
		flReg = /^\=|\+|\-|\*|\/|\(|\)/;
		//reg = /^\=(((\(*([a-zA-Z]([1-9]\d*))\)*(\+|-|\/|\*))*([a-zA-Z]([1-9]\d*))*\)*)|([a-zA-Z]([1-9]\d*)))/;
		
		reg= /^\=((((\(*([a-zA-Z]([1-9]\d*))\)*|([1-9]\d*))(\+|-|\/|\*))*(([1-9]\d*)|([a-zA-Z]([1-9]\d*))*\)*))|([a-zA-Z]([1-9]\d*)))/;
		res = pValue.match(reg);
		 
		 
		if((!!res)&&(!!res[0])) {
 
			endText = res[0].toString();
			pArr = endText.split(flReg);
            
			for(var i = 0; i < pArr.length; i++) {
				if(!!pArr[i]) {
					if(String(nValue).indexOf(pArr[i]) <= -1) {
						lightTd(pArr[i]);
						cLightTd(pArr[i].substr(0, pArr[i].length - 1));
 
					}

				}
			}
 
            
		}
 
        
        
		if($('.ui-selected').length>1){
			return;
		}else{
			$('.ui-selected').text(pValue); 
		}
        
		//删除
		if((ev.keyCode == 8)) {
			delRes = nValue.match(/([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*/);
			if(!!nValue) {

				dArr = nValue.split(flReg);

				cArr = pValue.split(flReg);

				delTmp = getUniqueSet(cArr, dArr);

				if(!!delTmp[1]) {
					cLightTd(delTmp[1]);
				}

			}

		}
		if((ev.keyCode == 13)) {
			ifx.blur();
			var allValue=pValue;
			 
			calRes = allValue.match(reg);
			if((!!calRes)&&(!!calRes[0])) {
             
			fText = calRes[0].toString();
			allArr = fText.split(flReg);
             
			for(var i = 0; i < allArr.length; i++) {
				if(!!allArr[i]) {											 
                        var tmp=allArr[i];
                        var tmpVal=String(that.getValue(allArr[i]));
                        allValue=allValue.replace(tmp,tmpVal);					
                        
				}
				 
			}
			calText=allValue;
			calText=calText.substring(1);
 
			
			var result =dal2Rpn(calText);
            $('.ui-selected').text(result); 
            $('.mask').remove();
		}

	}

	ifx.keydown(function(ev) {
		nValue = ifx.val();
	});
	 

});

}


//高亮蒙版
iTable.prototype.createMask = function(left, top, width, height, posX, posY) {
	var mask = $('<div class="mask"></div>');
	var color = getRandomColor();

	mask.css({
		'width': width - 2,
		'height': height - 2,
		'left': left,
		'top': top,
		'position': 'absolute',
		'border': '1px solid' + color,
		'z-index': '99'
	});
	mask.attr('mpos', posX + '-' + posY);
	this.container.append(mask);

}
iTable.prototype.tdTofx=function(obj){
	 
	var tdVal=obj.text();
	var fx=$('#ip_fx');
	fx.val(tdVal);
	 
}
iTable.prototype.getValue=function(arr){
	arr=arr.toString();
	 
    var xCoo=arr.replace(/[a-zA-Z]*/,' ');
    var yCoo=arr.replace(/[1-9]\d*/,' '); 
    yCoo=yCoo.charCodeAt(0) - 96;
    xCoo--;yCoo--; 
    var value;
    var text=Number($('[pos="'+xCoo+'-'+yCoo+'"]').text());
    if(typeof(text)!='number'){
    	value=0;
    }else{
    	if(!!text){
    		value=Number(text);
    	}else{
    		value=0;
    	}
    	
    }
	
	return value;
}

//高亮单元格
function lightTd(tmp) {

	var posY = tmp.match(/^[a-zA-Z]{1}/gi);
	var posX = tmp.match(/\+?[1-9][0-9]*$/g);
	posY = posY.toString();
	posY = posY.toLocaleLowerCase().charCodeAt(0) - 96;
	posY--;
	posX = posX.toString() - 1;
    if(posY == null || posX == null || posY.length == 0 || String(posY).length == 0) {
		return;
	}
	lTd = $("[pos='" + posX + "-" + posY + "']");
	var width = lTd[0].offsetWidth,
		height = lTd[0].offsetHeight;
	var left = lTd[0].offsetLeft,
		top = lTd[0].offsetTop;
	t.createMask(left, top, width, height, posX, posY);
    
}
//随机颜色
function getRandomColor() {
	return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
}
//取消高亮
function cLightTd(tmp) {

	var posY = tmp.match(/^[a-zA-Z]{1}/gi);
	var posX = tmp.match(/\+?[1-9][0-9]*$/g);
	posY = posY.toString();
	posY = posY.toLocaleLowerCase().charCodeAt(0) - 96;
	if(posY == null || posX == null || posY.length == 0 || String(posX).length == 0) {
		return;
	}
	posY--;
	posX = posX.toString() - 1;

	$('[mpos="' + posX + '-' + posY + '"]').remove();

}

//字符串取异
function getUniqueSet(setA, setB) {

	var temp = {};
	for(var i = 0, len = setA.length; i < len; i++) {
		temp[setA[i]] = 0;
	}
	for(var j = 0, len = setB.length; j < len; j++) {
		if(typeof temp[setB[j]] === 'undefined') {
			temp[setB[j]] = 0;
		} else {
			temp[setB[j]]++;
		}
	}
	//output
	var ret = [];
	for(var item in temp) {
		!temp[item] && ret.push(item);
	}
	return ret;
}

//Input光标
function set_text_value_position(obj, spos) {
	var tobj = document.getElementById('tdInput');
	if(spos < 0) spos = tobj.value.length;
	if(tobj.setSelectionRange) { //兼容火狐,谷歌
		setTimeout(function() {
			tobj.setSelectionRange(spos, spos);
			tobj.focus();
		}, 0);
	} else if(tobj.createTextRange) { //兼容IE
		var rng = tobj.createTextRange();
		rng.move('character', spos);
		rng.select();
	}
}
//取消冒泡
function stopPropagation() {
	var e = e || window.event;
	if(e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}
//数组去重
function removeDuplicatedItem(ar) {
	var ret = [];

	for(var i = 0, j = ar.length; i < j; i++) {
		if(ret.indexOf(ar[i]) === -1) {
			ret.push(ar[i]);
		}
	}
	ret = ret.join(' ');
	return ret

}
//
function JSONLength(obj) {
	var size = 0,
		key;
	for(key in obj) {
		if(obj.hasOwnProperty(key)) size++;
	}
	return size;
};

function removeUied() {
	$('.ui-selectable').find('tbody').removeAttr('class');
	$('.ui-selectable').find('tr').removeAttr('class');
}

//数字转字母 27->AA
function IntToChr(index) {
	var start = 65;
	var str = '';

	if(Math.floor(index / 26) > 0) {
		str += IntToChr(Math.floor(index / 26) - 1);
	}
	str += String.fromCharCode(index % 26 + start);

	return str;

}

function containsArray(array, obj) {
	for(var i = 0; i < array.length; i++) {
		if(array[i] == obj) {
			return i;
			break;
		}
	}
	return -1;
}
Array.prototype.contains = function(obj) {
	return containsArray(this, obj);
}

var settings = {
	rowCount: 40,
	cellCount: 26,
	fontFamily: {
		'黑体': 'font_Black',
		'宋体': 'font_Song',
		'楷体': 'font_Kai',
		'微软雅黑': 'font_Mirco'

	},
	fontSize: {
		'10': 'fsize_10',
		'12': 'fsize_12',
		'14': 'fsize_14',
		'16': 'fsize_16',
		'18': 'fsize_18',
		'20': 'fsize_20'
	},
	fontBold: 1,
	fontColor: {
		'red': {
			'tdclass': 'ffc_red',
			'fclass': 'fc_red'
		},
		'yellow': {
			'tdclass': 'ffc_yellow',
			'fclass': 'fc_yellow',
		},
		'green': {
			'tdclass': 'ffc_green',
			'fclass': 'fc_green',
		},
		'orange': {
			'tdclass': 'ffc_orange',
			'fclass': 'fc_orange',
		},
		'blue': {
			'tdclass': 'ffc_blue',
			'fclass': 'fc_blue',
		},
		'aqua': {
			'tdclass': 'ffc_aqua',
			'fclass': 'fc_aqua',
		},
		'purple': {
			'tdclass': 'ffc_purple',
			'fclass': 'fc_purple',
		},
		'black': {
			'tdclass': 'ffc_black',
			'fclass': 'fc_black',
		},
		'white': {
			'tdclass': 'ffc_white',
			'fclass': 'fc_white',
		},
		'grey': {
			'tdclass': 'ffc_grey',
			'fclass': 'fc_grey',
		}
	},
	bgColor: {
		'red': {
			'tdclass': 'ffill_red',
			'fclass': 'fill_red'
		},
		'yellow': {
			'tdclass': 'ffill_yellow',
			'fclass': 'fill_yellow',
		},
		'green': {
			'tdclass': 'ffill_green',
			'fclass': 'fill_green',
		},
		'orange': {
			'tdclass': 'ffill_orange',
			'fclass': 'fill_orange',
		},
		'blue': {
			'tdclass': 'ffill_blue',
			'fclass': 'fill_blue',
		},
		'aqua': {
			'tdclass': 'ffill_aqua',
			'fclass': 'fill_aqua',
		},
		'purple': {
			'tdclass': 'ffill_purple',
			'fclass': 'fill_purple',
		},
		'black': {
			'tdclass': 'ffill_black',
			'fclass': 'fill_black',
		},
		'white': {
			'tdclass': 'ffill_white',
			'fclass': 'fill_white',
		},
		'grey': {
			'tdclass': 'ffill_grey',
			'fclass': 'fill_grey',
		}
	},
	textAlign: {
		'left': {
			'tdclass': 'falign_left',
			'fclass': 'ffalign_left',
		},
		'center': {
			'tdclass': 'falign_center',
			'fclass': 'ffalign_center',
		},
		'right': {
			'tdclass': 'falign_right',
			'fclass': 'ffalign_right',
		}
	},
	express: {
		'求和': 'fx_sum',
		'平均': 'fx_avg',
		'计数': 'fx_count',
		'最大': 'fx_max',
		'最小': 'fx_min'

	}
	

}

var box = $('.box');
var t = new iTable(box, settings);

t.createContent();
t.createXaxis();
t.createYaxis();
t.setCss();
t.fillTd();
t.tableScroll();
t.createTip();
t.createFooter();
t.createHeader();

t.fontFamily();
t.fontSize();
t.fontBold();
t.fontItalic();
t.fontOverline();
t.fontColor();
t.bgColor();
t.mergeTd();
t.splitTd();
t.textAlign();
t.express();
t.addSheet();
t.sheetMove();
t.setIndex();
t.fillBlank();

$("#iTable1").selectable();
