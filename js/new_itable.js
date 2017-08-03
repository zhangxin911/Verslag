"use strict"

function iTable(tContainer, tSettings, tabs) {
	this.rowCount = tSettings.rowCount;
	this.cellCount = tSettings.cellCount;
	this.container = tContainer;
	this.settings = tSettings;
	this.tabs = tabs;
	var header, footer, curIndex, tools;
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
	var content = $('<div></div>'),
		tLeft = $('.yOrder'),
		tHead = $('.xOrder');
	var bLeft = tLeft.find('table tr:first td:first').outerWidth(),
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

iTable.prototype.frameSelect = function() {
	var that = this;
	var cWidth = parseInt($(this.container).width());
	var cHeight = parseInt($(this.container).height());

	var disWidth = parseInt($('.yOrder').outerWidth());
	var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());

	$(this.container).on('mousedown', function() {
		var fileNodes = $('.dataTable tr td');

		var isSelect = true;
		var ev = window.event || arguments[0];
		var sleft = parseInt($(this).scrollLeft());
		var stop = parseInt($(this).scrollTop());

		var oX = ev.clientX - disWidth + sleft;
		var oY = ev.clientY - disHeight + stop;

		var selDiv = $('<div class="mapdiv"></div>');

		selDiv.css({
			'position': 'absolute',
			'width': '0px',
			'height': '0px',
			'font-size': '0px',
			'margin': '0px',
			'padding': '0px',
			'border': '1px solid #1ab394',
			'background-color': '#4acfb4',
			'z-index': '1000',
			'filter': 'alpha(opacity:60)',
			'opacity': '0.6',
			'display': 'none',
			'left': oX,
			'top': oY
		});

		$(this).append(selDiv);

		var _x = null;
		var _y = null;
		var mergeArr = [];
		$(that.container).on('mousemove', function() {
			var evt = window.event || arguments[0];
			var xArr = [],
				yArr = [];
			var sleft = $(this).scrollLeft();
			var stop = $(this).scrollTop();
			if(isSelect) {
				if(selDiv.css('display') == "none") {
					selDiv.css('display', 'none');
				}
				_x = (evt.x || evt.clientX);
				_y = (evt.y || evt.clientY);

				_x = _x + sleft - disWidth;
				_y = _y + stop - disHeight;

				selDiv.css({
					'left': Math.min(_x, oX),
					'top': Math.min(_y, oY),
					'width': Math.abs(_x - oX),
					'height': Math.abs(_y - oY)
				});
				if(_x + 86 >= cWidth) {
					sleft += 100;
					$(that.container).scrollLeft(sleft);
				} else {
					sleft -= 100;
					$(that.container).scrollLeft(sleft);
				}
				var _l = parseInt(selDiv.css('left'));
				var _t = parseInt(selDiv.css('top'));
				var _w = selDiv.width(),
					_h = selDiv.height();

				for(var i = 0; i < fileNodes.length; i++) {

					var sl = fileNodes[i].offsetWidth + fileNodes[i].offsetLeft;
					var st = fileNodes[i].offsetHeight + fileNodes[i].offsetTop;
					if(sl > _l && st > _t && fileNodes[i].offsetLeft < _l + _w && fileNodes[i].offsetTop < _t + _h) {

						var nCols = parseInt($(fileNodes[i]).attr('cols')) - 1;
						var nRows = parseInt($(fileNodes[i]).attr('rows')) - 1;
						var nCspan = parseInt($(fileNodes[i]).attr('colspan')) - 1 || 0;
						var nRspan = parseInt($(fileNodes[i]).attr('rowspan')) - 1 || 0;
						var expectX = nCols + nCspan;
						var expectY = nRows + nRspan;
						xArr.push(nCols);
						yArr.push(nRows);
						xArr.push(expectX);
						yArr.push(expectY);
						var xMax = xArr.max(),
							xMin = xArr.min(),
							yMax = yArr.max(),
							yMin = yArr.min();
						$(fileNodes[i]).addClass('ui-selected');

					} else {
						$(fileNodes[i]).removeClass('ui-selected');
					}
				}

				for(var i = xMin; i < (xMax + 1); i++) {
					for(var j = yMin; j < (yMax + 1); j++) {
					 $("[pos='" + i + "-" + j + "']").addClass('ui-selected');
					 
					}
				}

				that.lightCoor($('.ui-selected'));
			}

		});

		$(document).off('mouseup').on('mouseup', function() {
			isSelect = false;
			selDiv && selDiv.remove();
		});

	});

}
Array.prototype.min = function() {
	var min = this[0];
	var len = this.length;
	for(var i = 1; i < len; i++) {
		if(this[i] < min) {
			min = this[i];
		}
	}
	return min;
}
//最大值
Array.prototype.max = function() {
	var max = this[0];
	var len = this.length;
	for(var i = 1; i < len; i++) {
		if(this[i] > max) {
			max = this[i];
		}
	}
	return max;
}

iTable.prototype.keyCursor = function() {
	var that = this;
	$(document).off('keydown').on('keydown', {
		time: "0",
		lastTd: "",
		fixX: "",
		fixY: "",
		keyCode: "",
		callz: that
	}, typing);
}

function typing(event) {
	var sNode = $('.ui-selected');
	var callZ = event.data.callz;

	if($('.ui-selected').length == 1) {
		if(event.keyCode == '8' || event.keyCode == '18' || event.keyCode == '16' || event.keyCode == '9') {
			return;
		}
		var that = $(this);
		var tdText = $('.ui-selected').text();

		var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'></input>");
		if(!$('.ui-selected input').length) {
			$('.ui-selected').html(tdInput);
		}
		tdInput.focus();

		var nowX = parseInt($(sNode).attr('cols')) - 1;
		var nowY = parseInt($(sNode).attr('rows')) - 1;

		var colAdd = parseInt($(sNode).attr('colspan')) - 1 || 0;
		var rowAdd = parseInt($(sNode).attr('rowspan')) - 1 || 0;

		nowX += colAdd;
		nowY += rowAdd;
		event.data.time = parseInt(event.data.time) + 1;

		if(event.data.time === 1) {
			//获取第一次点击的单元格
			event.data.lastTd = sNode;
			event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
			event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
		}

		//↓
		if(event.keyCode == '13' || event.keyCode == '40') {
			if(event.target == $('body')[0]) {
				tdInput.remove();
			}

			if(event.target != $('body')[0]) {
				$('.ui-selected').html($(event.target).val());
				$(event.target).blur(function() {
					$(this).remove();
				});
			}

			if($(event.data.lastTd)[0] != $(sNode)[0]) {
				if(event.data.fixX != nowX) {
					//不同单元格x坐标不同
					if(!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {
						//区分跨行列时，单元格x坐标不同情况
						event.data.lastTd = sNode;
						event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
						event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					}

				}

			}
			var lastKey = String(event.data.keyCode);
			switch(lastKey) {
				case '39':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
				case '37':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
				case '38':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
			}
			var nextX = event.data.fixX;
			var nextY = nowY + 1;
			if($("[pos='" + nextX + "-" + nextY + "']").length > 0) {
				$(sNode).removeClass('ui-selected');
				$("[pos='" + nextX + "-" + nextY + "']").addClass('ui-selected');
			} else {
				var _nowY = nowY + 1;
				var _nowX = nowX + 1;

				while(_nowY >= 0) {
					while(_nowX >= 0) {
						var nextRowspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('rowspan'));
						var nextColspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('colspan'));

						$(sNode).removeClass('ui-selected');
						//下一个单元格行列不合并 
						if(!nextRowspan && !nextColspan) {
							$("[pos='" + nextX + "-" + nextY + "']").addClass('ui-selected');

						}
						//下一个单元格只列合并 
						if(!nextRowspan && nextColspan) {

							$("[pos='" + _nowX + "-" + nextY + "']").addClass('ui-selected');
						}
						//下一个单元格只行合并 
						if(nextRowspan && !nextColspan) {

							$("[pos='" + _nowX + "-" + nextY + "']").addClass('ui-selected');
						}
						//下一个单元格行列合并 
						if(nextRowspan && nextColspan) {

							$("[pos='" + _nowX + "-" + _nowY + "']").addClass('ui-selected');
						}

						_nowX--;
					}
					_nowY--;
				}

			}
			event.data.keyCode = event.keyCode;
			callZ.lightCoor($('.ui-selected'));
		}

		//→
		if(event.keyCode == '39') {

			if(event.target == $('body')[0]) {
				tdInput.remove();
			}

			if(event.target != $('body')[0]) {
				$('.ui-selected').html($(event.target).val());
				$(event.target).blur(function() {
					$(this).remove();
				});
			}

			if($(event.data.lastTd)[0] != $(sNode)[0]) {
				if(event.data.fixY != nowY) {
					//不同单元格x坐标不同
					if(!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {
						//区分跨行列时，单元格x坐标不同情况
						event.data.lastTd = sNode;
						event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
						event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					}

				}

			}
			var lastKey = String(event.data.keyCode);

			switch(lastKey) {
				case '13':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '40':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '37':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '38':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
			}
			var nextX = nowX + 1;
			var nextY = event.data.fixY;
			if($("[pos='" + nextX + "-" + nextY + "']").length > 0) {
				$(sNode).removeClass('ui-selected');
				$("[pos='" + nextX + "-" + nextY + "']").addClass('ui-selected');
			} else {
				var _nowY = nowY + 1;
				var _nowX = nowX + 1;

				while(_nowX >= 0) {
					while(_nowY >= 0) {
						var nextRowspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('rowspan'));
						var nextColspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('colspan'));

						$(sNode).removeClass('ui-selected');
						//下一个单元格行列不合并 
						if(!nextRowspan && !nextColspan) {
							$("[pos='" + nextX + "-" + nextY + "']").addClass('ui-selected');

						}
						//下一个单元格只行合并 
						if(!nextRowspan && nextColspan) {

							$("[pos='" + _nowX + "-" + nextY + "']").addClass('ui-selected');
						}
						//下一个单元格只列合并 
						if(nextRowspan && !nextColspan) {

							$("[pos='" + nextX + "-" + _nowY + "']").addClass('ui-selected');
						}
						//下一个单元格行列合并 
						if(nextRowspan && nextColspan) {

							$("[pos='" + _nowX + "-" + _nowY + "']").addClass('ui-selected');
						}

						_nowY--;
					}
					_nowX--;
				}

			}
			event.data.keyCode = event.keyCode;
			callZ.lightCoor($('.ui-selected'));
		}

		//←
		if(event.keyCode == '37') {
			var r1 = 0,
				r2 = 0,
				r3 = 0;
			if(event.target == $('body')[0]) {
				tdInput.remove();
			}

			if(event.target != $('body')[0]) {
				$('.ui-selected').html($(event.target).val());
				$(event.target).blur(function() {
					$(this).remove();
				});
			}

			if($(event.data.lastTd)[0] != $(sNode)[0]) {
				if(event.data.fixX != nowX) {
					//不同单元格x坐标不同
					if(!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {
						//区分跨行列时，单元格x坐标不同情况
						event.data.lastTd = sNode;
						event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
						event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					}

				}

			}
			var lastKey = String(event.data.keyCode);

			switch(lastKey) {
				case '13':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '40':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '38':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
				case '39':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
			}
			var nextX = parseInt(nowX - 1);
			var nextY = parseInt(event.data.fixY);
			if($("[pos='" + nextX + "-" + nextY + "']").length > 0) {
				$(sNode).removeClass('ui-selected');
				$("[pos='" + nextX + "-" + nextY + "']").addClass('ui-selected');
			} else {
				var _nowY = nowY;
				var _nowX = nowX;

				while(_nowY >= 0) {
					_nowX = nowX;
					while(_nowX >= 0) {
						var nextRowspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('rowspan'));
						var nextColspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('colspan'));
						var lastColspan = parseInt($(sNode).attr('colspan')) - 1;
						var lastRowspan = parseInt($(sNode).attr('rowspan')) - 1;
						$(sNode).removeClass('ui-selected');
						//下一个单元格行列不合并 
						if(!nextRowspan && !nextColspan) {
							$("[pos='" + (nextX - lastColspan) + "-" + nextY + "']").addClass('ui-selected');

						}
						//下一个单元格只列合并 
						if(!nextRowspan && nextColspan) {
							if($("[pos='" + (_nowX - nextColspan + 1) + "-" + nextY + "']").length > 0) {
								r1++;
								(r1 == 1) && ($("[pos='" + (nextX - nextColspan + 1) + "-" + nextY + "']").addClass('ui-selected'));

							}

						}
						//下一个单元格只行合并 
						if(nextRowspan && !nextColspan) {
							if($("[pos='" + nextX + "-" + _nowY + "']").length > 0) {
								r2++;
								(r2 == 1) && ($("[pos='" + nextX + "-" + _nowY + "']").addClass('ui-selected'));

							}
						}
						//下一个单元格行列合并 
						if(nextRowspan && nextColspan) {
							if($("[pos='" + _nowX + "-" + _nowY + "']").length > 0) {
								r3++;
								(r3 == 1) && ($("[pos='" + _nowX + "-" + _nowY + "']").addClass('ui-selected'));

							}
						}

						_nowX--;
					}
					_nowY--;
				}

			}
			event.data.keyCode = event.keyCode;
			callZ.lightCoor($('.ui-selected'));
		}

		//↑
		if(event.keyCode == '38') {
			var u1 = 0,
				u2 = 0,
				u3 = 0;
			if(event.target == $('body')[0]) {
				tdInput.remove();
			}

			if(event.target != $('body')[0]) {
				$('.ui-selected').html($(event.target).val());
				$(event.target).blur(function() {
					$(this).remove();
				});
			}

			if($(event.data.lastTd)[0] != $(sNode)[0]) {
				if(event.data.fixX != nowX) {
					//不同单元格x坐标不同
					if(!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {
						//区分跨行列时，单元格x坐标不同情况
						event.data.lastTd = sNode;
						event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
						event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					}

				}

			}
			var lastKey = String(event.data.keyCode);

			switch(lastKey) {
				case '13':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '40':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;

					break;
				case '37':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
				case '39':
					event.data.lastTd = sNode;
					event.data.fixX = parseInt($(event.data.lastTd).attr('cols')) - 1;
					event.data.fixY = parseInt($(event.data.lastTd).attr('rows')) - 1;
					break;
			}
			var nextX = event.data.fixX;
			var nextY = nowY - 1;
			if($("[pos='" + nextX + "-" + nextY + "']").length > 0) {
				$(sNode).removeClass('ui-selected');
				$("[pos='" + nextX + "-" + nextY + "']").addClass('ui-selected');
			} else {
				var _nowY = nowY;
				var _nowX = nowX;

				while(_nowX >= 0) {
					_nowY = nowY;
					while(_nowY >= 0) {
						var nextRowspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('rowspan'));
						var nextColspan = parseInt($("[pos='" + _nowX + "-" + _nowY + "']").attr('colspan'));
						var lastColspan = parseInt($(sNode).attr('colspan')) - 1;
						var lastRowspan = parseInt($(sNode).attr('rowspan')) - 1;
						$(sNode).removeClass('ui-selected');
						//下一个单元格行列不合并 
						if(!nextRowspan && !nextColspan) {
							$("[pos='" + nextX + "-" + (nextY - lastRowspan) + "']").addClass('ui-selected');

						}
						//下一个单元格只列合并 
						if(!nextRowspan && nextColspan) {
							if($("[pos='" + _nowX + "-" + nextY + "']").length > 0) {
								u1++;
								(u1 == 1) && ($("[pos='" + _nowX + "-" + nextY + "']").addClass('ui-selected'));

							}

						}
						//下一个单元格只行合并 
						if(nextRowspan && !nextColspan) {
							if($("[pos='" + nextX + "-" + _nowY + "']").length > 0) {
								u2++;
								(u2 == 1) && ($("[pos='" + nextX + "-" + _nowY + "']").addClass('ui-selected'));

							}

						}
						//下一个单元格行列合并 
						if(nextRowspan && nextColspan) {
							if($("[pos='" + _nowX + "-" + _nowY + "']").length > 0) {
								u3++;
								(u3 == 1) && ($("[pos='" + _nowX + "-" + _nowY + "']").addClass('ui-selected'));

							}
						}

						_nowY--;
					}
					_nowX--;
				}

			}
			event.data.keyCode = event.keyCode;
			callZ.lightCoor($('.ui-selected'));
		}
		if($('.ui-selected').length > 0) {
			var xCoo = Number($('.ui-selected').attr('cols')) - 1,
				yCoo = Number($('.ui-selected').attr('rows')) - 1;
			$('.disbox').text(IntToChr(xCoo) + String(yCoo + 1));
		}
	} else {
		return;
	}

}

iTable.prototype.getCurTable = function() {
	var t;
	t = this.container.find('table:visible');
	return t
}

iTable.prototype.setCss = function() {
	var viewWidth = $(window).width(),
		viewHeight = $(window).height();
	var tBody = this.getCurTable().parent(),
		tLeft = $('.yOrder'),
		tHead = $('.xOrder');
	var bLeft = tLeft.find('table tr:first td:first').outerWidth() + 1;
	var bTop = tHead.find('table tr:first td:first').outerHeight() + 1;

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
		that.height(viewHeight - bTop - 113);
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
	var event = window.event || arguments[0];
	var tid = tid || 1;;
	var _self = this;
	$('#iTable' + tid).find('tr td').each(function() {

		$(this).dblclick(function() {
			var tdWidth = $(this).width();
			var tdHeight = $(this).height();
			var tdText = $(this).text();
			var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'></input>");
			tdInput.width(tdWidth - 2);
			tdInput.height(tdHeight - 2);

			$(this).html(tdInput);
			set_text_value_position(tdInput, -1);

			$('.tdInput').keyup(function() {
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

			$(".tdInput").keyup(function(event) {
				if(event.keyCode == 13) {
					$('.tdInput').blur();
					$(document).on('keyup', typing);
				}
			});
			$(".tdInput").click(function(event) {
				return false;
			});
			$('#iTable' + tid + ' tr td').not($(this)).click(function(event) {

				$('.tdInput').blur();
			});

		});

		$(this).click(function() {

			var tr = $(this).parent();
			$('.ui-selected').removeClass('ui-selected');
			$(this).addClass('ui-selected');
			var xCoo = Number($(this).attr('cols')) - 1,
				yCoo = Number($(this).attr('rows')) - 1;
			if($('.disbox').length > 0) {
				$('.disbox').text(IntToChr(xCoo) + String(yCoo + 1));
			}
			_self.tdTofx($(this));
			_self.lightCoor($(this));
			$('#ip_fx').blur();

		});
		$(this).mouseenter(function() {
			var text = $(this).text();
			var div = $('<div class="tdTip">' + text + '</div>');
			var len = getStrLength(text);
			if(len > 10) {
				$('body').append(div);
				var dis = mouseCoords();
				div.css({
					'position': 'absolute',
					'top': dis.y,
					'left': dis.x
				});
			} else {
				return;
			}

		});
		$(this).mouseout(function() {
			$('.tdTip').remove();
		});

	});
}

iTable.prototype.lightCoor = function(obj) {

	var target = obj;

	$('.leftTable tr td').removeClass('lCoo');
	$('.titleTable tr td').removeClass('lCoo');
	for(var t = 0; t < target.length; t++) {
		var cols = parseInt($(target).eq(t).attr('cols')) - 1;
		var rows = parseInt($(target).eq(t).attr('rows')) - 1;
		var cSpan = parseInt($(target).eq(t).attr('colspan')) - 1 || 0;
		var rSpan = parseInt($(target).eq(t).attr('rowspan')) - 1 || 0;

		for(var i = rows; i < rows + rSpan + 1; i++) {
			$('.leftTable').find('tr').eq(i).find('td').addClass('lCoo');
		}
		for(var j = cols; j < cols + cSpan + 1; j++) {
			$('.titleTable tr').find('td').eq(j).addClass('lCoo');
		}

	}

}

function getStrLength(str) {

	var realLength = 0,
		len = str.length,
		charCode = -1;
	for(var i = 0; i < len; i++) {
		charCode = str.charCodeAt(i);
		if(charCode >= 0 && charCode <= 128) realLength += 1;
		else realLength += 2;
	}
	return realLength;
};

function mouseCoords(ev) {
	var ev = ev || window.event;
	if(ev.pageX || ev.pageY) {
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
	this.tools = $('<div class="tools"></div>');
	this.header.append(this.tools);
	this.header.insertBefore(this.container);

}

//字体类型
iTable.prototype.fontFamily = function() {
	var select = this.createSelection('fontFamily', this.settings.fontFamily);
	var sel_a = $(select).find('ul li a');
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
	var sel_a = $(select).find('ul li a');
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
	var sel_a = $(simMenu).children(0);
	sel_a.on('click', function() {

		$('.ui-selected').hasClass('ffbold') ? $('.ui-selected').removeClass('ffbold') : $('.ui-selected').addClass('ffbold');

	});

}
//字体倾斜
iTable.prototype.fontItalic = function() {
	var simMenu = this.createSimpleMenu('fitalic');
	var sel_a = $(simMenu).children(0);
	sel_a.on('click', function() {

		$('.ui-selected').hasClass('ffitalic') ? $('.ui-selected').removeClass('ffitalic') : $('.ui-selected').addClass('ffitalic');

	});

}
//字体下划线
iTable.prototype.fontOverline = function() {
	var simMenu = this.createSimpleMenu('foverline');
	var sel_a = $(simMenu).children(0);
	sel_a.on('click', function() {

		$('.ui-selected').hasClass('ffoverline') ? $('.ui-selected').removeClass('ffoverline') : $('.ui-selected').addClass('ffoverline');

	});

}
//字体颜色
iTable.prototype.fontColor = function() {
	var select = this.createCellMenu('d_fcolor', 'fontColor', this.settings.fontColor);
	var td = $(select).find('table tr td');
	var className, curClass;
	var selThem;

	td.on('click', function() {

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
	var td = $(select).find('table tr td');
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

	});
}

//字符对齐
iTable.prototype.textAlign = function() {
	var select = this.createCellMenu('f_align', 'textAlign', this.settings.textAlign);
	var td = $(select).find('table tr td');
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
iTable.prototype.express = function() {
	var select = this.createSelection('express', this.settings.express);
	var sel_a = $(select).find('ul li a');
	var className, curClass;
	var selThem;
	var that = this;
	sel_a.on('click', function() {
		var ways = $(this).attr('class').replace('fx_', '');
		that.formula(ways);
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

//列插入
iTable.prototype.insertCol = function() {
	var simMenu = this.createSimpleMenu('', '插入列');
	var sel_a = $(simMenu).children(0);

	var that = this;
	sel_a.on('click', function() {
		var sNode = $('.ui-selected');
		var xArr=[],yArr=[];
		var xMax,xMin,yMax,yMin;
		if(sNode.length >= 2) {
           for(var i=0;i<sNode.length;i++){
           	  var cols=parseInt(sNode.eq(i).attr('cols'));
           	  var rows=parseInt(sNode.eq(i).attr('rows'));           	  
           	  xArr.push(cols);
			  yArr.push(rows);
			  xMax = xArr.max(),xMin = xArr.min(),yMax = yArr.max(),yMin = yArr.min();
                  			 
           }
           
           for(var _y=0;_y<that.rowCount + 1;_y++){
           	  for(var _x=xMin;_x<xMax+1;_x++){
           	  	 var index=xMax;
           	  	if($('td[cols=' + xMin + '][rows=' + _y + ']').length>0){
           	  		$('td[cols=' + xMin + '][rows=' + _y + ']').before('<td style="background:orange"></td>');
           	  	}else{
           	  		$('td[cols=' + (xMin-1) + '][rows=' + _y + ']').after('<td style="background:orange"></td>');
//         	  		while(index>-1){
//         	  			if($('td[cols=' + index + '][rows=' + _y + ']').length>0){
//         	  				$('td[cols=' + index + '][rows=' + _y + ']').after('<td style="background:orange"></td>');
//                          break;
//                          
//         	  			}           	  			
//         	  			index--;
//         	  		}
           	  	}
           	  	
           	    
           	  }
           }
           
           
		} else {
			var xIndex = parseInt(sNode.attr('cols'));
			var yIndex = parseInt(sNode.attr('rows'));
			for(var i = 0; i < that.rowCount + 1; i++) {
				var time = 0;
				
				for(var j = xIndex; j > -1; j--) {
                    
					var cols = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('cols'));
					if(cols == xIndex) {
						var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;
						if(cspan >= 2) {
							$('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan + 1);
						} else {
							$('td[cols=' + xIndex + '][rows=' + i + ']').before('<td style="background:orange"></td>');
						}
                  
					} else {
						if($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
							time++;
							if(time == 1) {
								var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;
								var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
								if(cspan >= 2) {
									if(rspan<=yIndex&&(rspan+i)>=yIndex){
										
									}else{
									 $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan + 1);	
									}
									
								}
							}
						}

					}

				}
			}
			that.cellCount++;
		}
		that.setIndex();
		that.fillTd();
		that.keyCursor();
		that.updateTop();
	});

}
//行插入
iTable.prototype.insertRow = function() {
	var simMenu = this.createSimpleMenu('', '插入行');
	var sel_a = $(simMenu).children(0);

	var that = this;
	sel_a.on('click', function() {
		var sNode = $('.ui-selected');
		if(sNode.length >= 2) {

		} else {
			var index = parseInt(sNode.attr('rows'));
			for(var i = index; i > -1; i--) {
				var tr = $('<tr></tr>');
				//var time = 0;
				for(var j = 0; j < that.cellCount + 1; j++) {
					var rows = $('td[cols=' + j + '][rows=' + i + ']').attr('rows');

					if(rows == index) {
						var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
						if(rspan >= 2) {
							$('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan + 1);
						} else {
							tr.append('<td style="background:orange"></td>');
							$('td[cols=' + j + '][rows=' + i + ']').parent().before(tr);
						}
					} else {
						if($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
							//time++;
							//if(time==1){
							var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
							if(rspan >= 2) {
								$('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan + 1);
							}
							//}
						}
					}
				}

			}
			that.rowCount++;
		}

		that.setIndex();
		that.fillTd();
		that.keyCursor();
		that.updateLeft();
	});

}
//列删除
iTable.prototype.deleteCol = function() {
	var simMenu = this.createSimpleMenu('', '删除列');
	var sel_a = $(simMenu).children(0);

	var that = this;
	sel_a.on('click', function() {
		var sNode = $('.ui-selected');
		if(sNode.length >= 2) {

		} else {
			var index = parseInt(sNode.attr('cols'));
			for(var i = 0; i < that.rowCount + 1; i++) {
				var time = 0;
				for(var j = index; j > -1; j--) {

					var cols = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('cols'));
					if(cols == index) {
						var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;
						if(cspan >= 2) {
							$('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan - 1);
						} else {
							$('td[cols=' + j + '][rows=' + i + ']').remove();
						}

					} else {
						if($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
							time++;
							if(time == 1) {
								var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;
								if(cspan >= 2) {
									$('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan - 1);
								}
							}
						}

					}

				}
			}
			that.cellCount--;

		}
		that.setIndex();
		that.fillTd();
		that.keyCursor();
		that.updateLeft();
	});

}

//行删除
iTable.prototype.deleteRow = function() {
	var simMenu = this.createSimpleMenu('', '删除行');
	var sel_a = $(simMenu).children(0);

	var that = this;
	sel_a.on('click', function() {
		var sNode = $('.ui-selected');
		if(sNode.length >= 2) {

		} else {
			var index = parseInt(sNode.attr('rows'));
			for(var i = index; i > -1; i--) {
				//var tr=$('<tr></tr>');
				//var time = 0;
				for(var j = 0; j < that.cellCount; j++) {
					var rows = $('td[cols=' + j + '][rows=' + i + ']').attr('rows');

					if(rows == index) {
						var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
						if(rspan >= 2) {
							$('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan - 1);
						} else {
							$('td[cols=' + j + '][rows=' + i + ']').parent().remove();
						}
					} else {
						if($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
							var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
							if(rspan >= 2) {
								$('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan - 1);
							}

						}
					}
				}

			}
			that.rowCount--;
		}
		that.setIndex();
		that.fillTd();
		that.keyCursor();
		that.updateLeft();
	});

}

//单元格上的公式区域
iTable.prototype.formula = function(ways) {

	var func = ways;
	var target = $('.ui-selected')[0];
	var tmpContent = $(target).text();
	var xCoo = $(target).attr('cols');
	var yCoo = $(target).attr('rows');
	var input = '<input type="text" class="fxInput" onkeyup="this.size=(this.value.length>4?this.value.length:4)";>';
	var width = target.offsetWidth;
	var height = target.offsetHeight;
	var left = target.offsetLeft;
	var top = target.offsetTop;
	var enterDiv = '<div class="fxDiv">';

	enterDiv = enterDiv + ways + '(' + input + ')' + '</div>';

	this.container.append($(enterDiv));
	$('.fxDiv').css({

		'height': height - 2,
		'left': left,
		'top': top,
		'position': 'absolute',
		'border': '1px solid red',
		'z-index': '98',
		'background': '#ffffff'
	});
	$('.fxInput').css({
		'height': height - 10,
		'line-height': height - 10,
		'border': 'none',
		'outline': 'none'

	});
	$('.fxInput').keyup(function() {
		var ev = ev || event;
		var endValue = $(this).val();
		if(ev.keyCode == 13) {
			endValue.split();
			$(this).blur();
			$(this).parent().remove();

		}
	});

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
	var selectionBox = $('<div class="toolBox"></div>');
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

	selectionBox.append(selectHead);
	this.tools.append(selectionBox);
	selectUl.hide();
	selectHead.on('click', function() {
		selectUl.toggle();
	});

	selectUl.find('li a').on('click', function() {

		$(selectHead).text($(this).text());
	})
	return selectionBox;
}

//创建工具栏单个菜单
iTable.prototype.createSimpleMenu = function(className, text) {
	var menus = $('<div class="toolBox"></div>');
	var mText = text || '';
	var mClass = className;
	var simTool = $('<span class="' + mClass + '">' + mText + '</span>');
	menus.append(simTool);
	this.tools.append(menus);
	return menus;
}
//创建工具栏格子菜单
iTable.prototype.createCellMenu = function(dClass, className, menus) {

	var selectionBox = $('<div class="toolBox"></div>');
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
	selectionBox.append(selectHead);

	this.tools.append(selectionBox);

	selectTb.hide();
	selectHead.on('click', function() {
		selectTb.toggle();
	});
	return selectionBox;

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
		i++;
		that.sheetWork();

	});
}

iTable.prototype.sheetWork = function() {
	var that = this;
	$('.sheet').on('click', function() {
		box.empty();
		var dId = $(this).attr('id');
		dId = dId.replace('sheet', '');
		dId = parseInt(dId);
		that.createContent(dId);
		that.fillTd(dId);
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
		stInput.select();
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
			cell.setAttribute('pos', col + '-' + i);
		}
	}

}

//y轴更新
iTable.prototype.updateLeft = function() {
	var trNum = this.rowCount;
	$('.leftTable').empty();
	for(var i = 0; i < this.rowCount; i++) {
		var tr = $("<tr></tr>");
		tr.appendTo($(".leftTable"));
		for(var j = 0; j < 1; j++) {
			var th = $("<td>" + (i + 1) + "</td>");
			th.appendTo(tr);
		}

	}

}

//x轴更新
iTable.prototype.updateTop = function() {
	var that = this;
	$('.titleTable').empty();

	for(var i = 0; i < 1; i++) {
		var tr = $("<tr></tr>");
		tr.appendTo($(".titleTable"));

		for(var j = 0; j < this.cellCount; j++) {
			var td = $("<td>" + IntToChr(j) + "</td>");
			td.appendTo(tr);
		}

	}

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
	var dis = $('<span class="disbox"></span>');
	fxBox.append(dis);
	fxBox.append(fxInput);
	this.header.append(fxBox);
	this.fillWork();
}
//输入操作
iTable.prototype.fillWork = function() {

	var ev = window.event || arguments[0];
	var ifx = $('#ip_fx');
	var pValue, nValue;
	var pArr, nArr, cArr;
	var endText;
	var res, delRes;
	var delText;
	var reg, flReg;
	var that = this;
	var calText;
	ifx.keyup(function(ev) {
		pValue = ifx.val();

		flReg = /^\=|\+|\-|\*|\/|\(|\)/;
		reg = /^\=((((\(*([a-zA-Z]([1-9]\d*))\)*|([1-9]\d*))(\+|-|\/|\*))*(([1-9]\d*)|([a-zA-Z]([1-9]\d*))*\)*))|([a-zA-Z]([1-9]\d*)))/;
		res = pValue.match(reg);

		if((!!res) && (!!res[0])) {

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

		if($('.ui-selected').length > 1) {
			return;
		} else {
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
			this.blur();
			var allValue = pValue;

			calRes = allValue.match(reg);
			if((!!calRes) && (!!calRes[0])) {

				fText = calRes[0].toString();
				allArr = fText.split(flReg);
 
				for(var i = 0; i < allArr.length; i++) {
					if(!!allArr[i]) {
						var tmp = allArr[i];
						var tmpVal = String(that.getValue(allArr[i]));
						allValue = allValue.replace(tmp, tmpVal);

					}

				}
				calText = allValue;
				calText = calText.substring(1);

				var result = dal2Rpn(calText);
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

iTable.prototype.rMenus = function() {
	var that = this;
	var rMenus = this.createRmenus();
	var winH = $(window).height() - $(this.footer).outerHeight();
	var winW = $(window).width();

	$('.dataTable').contextmenu(function() {
		var ev = ev || window.event;
		var oX = ev.clientX;
		var oY = ev.clientY;

		var mH = $(rMenus).height();
		var mW = $(rMenus).width();
		$(rMenus).css({
			'left': oX,
			'top': oY,
			'display': 'block'
		});
		(oY + mH > winH) && ($(rMenus).css({
			'top': winH - mH - 20
		}));
		(oX + mW > winW) && ($(rMenus).css({
			'left': winW - mW - 20
		}));

		return false;
	});

	$('.dataTable').find('tr td').each(function() {
		$(this).contextmenu(function() {
			var arr = $('.ui-selected');
			var obj = this;
			var has = containsArray(arr, obj);
			if(has == -1) {
				$('.dataTable').find('td').removeClass('ui-selected');
			}
			$(this).addClass('ui-selected');
		});
	})
}
iTable.prototype.createRmenus = function() {
	var menus = $('<div></div>');
	var dataArr = [];
	var cut = this.cut(dataArr);
	menus.append(cut);

	var copy = this.copy();
	menus.append(copy);

	var paste = this.paste(dataArr);
	menus.append(paste);

	var _insert = this._insert(dataArr);
	menus.append(_insert);

	var _delete = this._delete(dataArr);
	menus.append(_delete);

	var that = this;

	menus.css({
		'position': 'absolute',
		'width': '200px',
		'overflow': 'hidden',
		'background': '#FBFBFB',
		'display': 'none',
		'font-size': '14px',
	});
	$('body').append(menus);

	$(document).on('click', function() {
		menus.hide();
		return false;
	});
	return menus;
}

iTable.prototype.cut = function(dataArr) {
	var cutDiv = $('<div class="menu-cut">剪切</div>');
	cutDiv.css({
		'padding': '2px 10px',
		'cursor': 'pointer'
	})

	cutDiv.on('click', function() {

		var tdLength = $('.ui-selected').length;
		$(this).parent().hide();
		if(tdLength <= 1) {
			dataArr.length = 0;

			var td = $('.ui-selected')[0];
			dataArr.push($(td).text());
			$(td).text('');
		} else {
			dataArr.length = 0;
			for(var i = 0; i < tdLength; i++) {

				var tds = $('.ui-selected')[i];
				dataArr.push($(tds));
				$(tds).text('');
			}
		}

	});
	return cutDiv;
}

iTable.prototype.copy = function() {
	var copyDiv = $('<div class="menu-copy">复制</div>');
	copyDiv.css({
		'padding': '2px 10px',
		'cursor': 'pointer'
	})
	copyDiv.on('click', function() {
		var tdLength = $('.ui-selected').length;
		$(this).parent().hide();
		if(tdLength <= 1) {
			dataArr.length = 0;

			var td = $('.ui-selected')[0];
			dataArr.push($(td).text());
		} else {
			dataArr.length = 0;
			for(var i = 0; i < tdLength; i++) {

				var tds = $('.ui-selected')[i];
				dataArr.push($(tds));
			}
		}
	});
	return copyDiv;
}
iTable.prototype.paste = function(dataArr) {
	var pasteDiv = $('<div class="menu-paste">粘贴</div>');
	pasteDiv.css({
		'padding': '2px 10px',
		'cursor': 'pointer'
	});
	pasteDiv.on('click', function() {
		$(this).parent().hide();

		var tdLength = $('.ui-selected').length;
		if(tdLength <= 1) {
			$('.ui-selected').text(dataArr[0]);
		} else {
			for(var i = 0; i < tdLength; i++) {
				//           removeUied();
				//           var tds=$('.ui-selected')[i];
				//           dataArr.push($(tds));
				//           $(tds).text('');

			}
		}

	});
	return pasteDiv;
}

iTable.prototype._insert = function() {
	var insertDiv = $('<div class="menu-insert">插入</div>');
	var that = this;
	insertDiv.css({
		'padding': '2px 10px',
		'cursor': 'pointer'
	});

	insertDiv.on('click', function() {
		var ev = ev || window.event;
		var winW = $(window).width();
		var winH = $(window).height();
		var toolsDiv = $('<div></div>');
		var toolsTitle = $('<div><span>插入</span></div>');

		toolsDiv.append(toolsTitle);
		toolsDiv.css({
			'position': 'absolute',
			'top': '50%',
			'left': '50%',
			'width': '200px',
			'background': '#ffffff'
		});
		$(that.container).append(toolsDiv);

	});

	return insertDiv;
}

iTable.prototype._delete = function() {
	var deleteDiv = $('<div class="menu-delete">删除</div>');
	deleteDiv.css({
		'padding': '2px 10px',
		'cursor': 'pointer'
	});

	return deleteDiv;
}

iTable.prototype.tdTofx = function(obj) {

	var tdVal = obj.text();
	var fx = $('#ip_fx');
	fx.val(tdVal);

}
iTable.prototype.getValue = function(arr) {
	arr = arr.toString();

	var xCoo = arr.replace(/[a-zA-Z]*/, ' '),yCoo = arr.replace(/[1-9]\d*/, ' ');
	yCoo = yCoo.charCodeAt(0) - 96;
	xCoo--;
	yCoo--;
	var value;
	var text = Number($('[pos="' + xCoo + '-' + yCoo + '"]').text());
	if(typeof(text) != 'number') {
		value = 0;
	} else {
		if(!!text) {
			value = Number(text);
		} else {
			value = 0;
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
	var lTd = $("[pos='" + posX + "-" + posY + "']");
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
function stopPropagation(e) {
	var e = window.event || arguments[0];
	if(e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
}
//数组去重
function removeDuplicatedItem(arr) {
	var ret = [];

	for(var i = 0, j = arr.length; i < j; i++) {
		if(ret.indexOf(arr[i]) === -1) {
			ret.push(arr[i]);
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

iTable.prototype.init = function() {
	var tOption = this.tabs;
	this.createContent();
	this.createXaxis();
	this.createYaxis();
	this.setCss();
	this.fillTd();
	this.tableScroll();
	this.createTip();
	this.createFooter();
	this.createHeader();

	tOption.fontFamily && this.fontFamily();
	tOption.fontSize && this.fontSize();
	tOption.fontBold && this.fontBold();
	tOption.fontItalic && this.fontItalic();
	tOption.fontOverline && this.fontOverline();
	tOption.fontColor && this.fontColor();
	tOption.bgColor && this.bgColor();
	tOption.mergeTd && this.mergeTd();
	tOption.splitTd && this.splitTd();
	tOption.textAlign && this.textAlign();

	this.express();
	this.insertCol();
	this.insertRow();
	this.deleteCol();
	this.deleteRow();

	this.addSheet();
	this.sheetMove();
	this.setIndex();
	this.fillBlank();
	this.rMenus();
	this.frameSelect();
	this.keyCursor();
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
var tabs = {
	fontColor: true,
	fontFamily: true,
	fontSize: true,
	fontBold: true,
	fontItalic: true,
	fontOverline: true,
	fontBgcolor: true,
	fontFamily: true,
	mergeTd: true,
	splitTd: true,
	textAlign: true,
}
var t = new iTable(box, settings, tabs);


t.init();
 