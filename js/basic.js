	
	
	var dtC=$(".dataTable_container");
	
	CreateTable(40, 26, 1);
	CreateLeft(40, 1);
	CreateTitle(1, 26);
    fillTd(1);


	
    //input光标
	function set_text_value_position(obj, spos) {
		var tobj = document.getElementById('tdInput');
		if (spos < 0) spos = tobj.value.length;
		if (tobj.setSelectionRange) { //兼容火狐,谷歌
			setTimeout(function() {
				tobj.setSelectionRange(spos, spos);
				tobj.focus();
			}, 0);
		} else if (tobj.createTextRange) { //兼容IE
			var rng = tobj.createTextRange();
			rng.move('character', spos);
			rng.select();
		}
	}

	//获取鼠标坐标

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




	//select
	

		//字体类型

		(function fontfamilySelect() {
			var cName;
			var ipt_ff = document.getElementById('ipt_ff');
			var ul_ff = document.getElementById('ul_ff');
			var lis = ul_ff.children;
			var bd = document.getElementsByTagName('body');

			ipt_ff.onclick = function() {
				ul_ff.style.display = 'block';
				ul_fcolor.style.display = "none";
				ul_fs.style.display = "none";
				ul_ffill.style.display = "none";
				stopPropagation();

			}


			for (var i = 0; i < lis.length; i++) {
				lis[i].setAttribute('Oindex', i);
				lis[i].onclick = function() {
					ul_ff.style.display = 'none';

					ipt_ff.innerHTML = this.children[0].innerHTML;
					//console.log($('#qqq'));
					cName = this.children[0].className;
					$("[chosed=qqq]").addClass(cName);
					var reg = new RegExp("(((font_)[A-Za-z0-9_]+\s*)+)", "g");

					cClass = $("[chosed=qqq]").attr('class');


					cClass = cClass.replace(reg, cName);
					var arr = cClass.split(' ');
					cClass = removeDuplicatedItem(arr);

					$("[chosed=qqq]").removeAttr('class');
					$("[chosed=qqq]").addClass(cClass);

                    stopPropagation();



				}
				lis[i].onmouseover = function() {
					var Oindex = Number(this.getAttribute('Oindex')) + 1;
					this.children[0].style.background = '#ECECEC';
				}
				lis[i].onmouseout = function() {
					var Oindex = Number(this.getAttribute('Oindex')) + 1;
					this.children[0].style.background = '#FFFFFF';
				}

			}

		})();

		//字体大小

		(function fontsizeSelect() {
			var cName;
			var ipt_fs = document.getElementById('ipt_fs');
			var ul_fs = document.getElementById('ul_fs');
			var lis = ul_fs.children;

			ipt_fs.onclick = function() {
				ul_fs.style.display = 'block';
				ul_fcolor.style.display = "none";

				ul_ff.style.display = "none";
				ul_ffill.style.display = "none";

				stopPropagation();

			}


			for (var i = 0; i < lis.length; i++) {
				lis[i].setAttribute('Oindex', i);
				lis[i].onclick = function() {
					//console.log(cClass);
					ul_fs.style.display = 'none';

					ipt_fs.innerText = this.children[0].innerText;
					cName = this.children[0].className;

					$("[chosed=qqq]").addClass(cName);


					var reg = new RegExp("(((fsize_)[A-Za-z0-9_]+\s*)+)", "g");

					cClass = $("[chosed=qqq]").attr('class');


					cClass = cClass.replace(reg, cName);


					var arr = cClass.split(' ');
					cClass = removeDuplicatedItem(arr);


					$("[chosed=qqq]").removeAttr('class');
					$("[chosed=qqq]").addClass(cClass);

stopPropagation();
				}
				lis[i].onmouseover = function() {
					var Oindex = Number(this.getAttribute('Oindex')) + 1;
					this.children[0].style.background = '#ECECEC';


				}
				lis[i].onmouseout = function() {
					var Oindex = Number(this.getAttribute('Oindex')) + 1;
					this.children[0].style.background = '#FFFFFF';


				}

			}


		})();

		//字体颜色

		(function fontcolorSelect() {
			var ipt_fcolor = document.getElementById('ipt_fcolor');
			var ul_fcolor = document.getElementById('ul_fcolor');


			ipt_fcolor.onclick = function() {
				ul_fcolor.style.display = 'table-cell';

				ul_fs.style.display = "none";
				ul_ff.style.display = "none";
				ul_ffill.style.display = "none";
stopPropagation();

			}
			$('#ul_fcolor').find('td').each(function() {
				$(this).click(function() {
				
					ul_fcolor.style.display = "none";
					var cName = $(this).attr('class');
					$("[chosed=qqq]").addClass(cName);
					var reg = new RegExp("(((fc_)[A-Za-z0-9_]+\s*)+)", "g");

					cClass = $("[chosed=qqq]").attr('class');

					cClass = cClass.replace(reg, cName);



					var arr = cClass.split(' ');
					cClass = removeDuplicatedItem(arr);
					 

					$("[chosed=qqq]").removeAttr('class');
					$("[chosed=qqq]").addClass(cClass);
					stopPropagation();
				});
			});

		})();


		//td背景

		(function tdbgFill() {
			var ipt_ffill = document.getElementById('ipt_ffill');
			var ul_ffill = document.getElementById('ul_ffill');

			ipt_ffill.onclick = function() {
				 
				ul_ffill.style.display = 'table-cell';
				ul_fcolor.style.display = "none";

				ul_fs.style.display = "none";
				ul_ff.style.display = "none";
				stopPropagation();

			}
			$('#ul_ffill').find('td').each(function() {
				$(this).click(function() {
					
					ul_ffill.style.display = "none";
					var cName = $(this).attr('class');
					$("[chosed=qqq]").addClass(cName);
					 
					var reg = new RegExp("(((ffill_)[A-Za-z0-9_]+\s*)+)", "g");

					cClass = $("[chosed=qqq]").attr('class');

					cClass = cClass.replace(reg, cName);



					var arr = cClass.split(' ');
					cClass = removeDuplicatedItem(arr);
					 

					$("[chosed=qqq]").removeAttr('class');
					$("[chosed=qqq]").addClass(cClass);
					stopPropagation();
				});
			});

		})();


        //align
        (function fAlign() {
			var ipt_falign = document.getElementById('ipt_falign');
			var ul_falign = document.getElementById('ul_falign');

			ipt_falign.onclick = function() {
				 
				ul_falign.style.display = 'table-cell';
				ul_fcolor.style.display = "none";

				ul_fs.style.display = "none";
				ul_ff.style.display = "none";
				stopPropagation();

			}
			$('#ul_falign').find('td').each(function() {
				$(this).click(function() {
					
					ul_falign.style.display = "none";
					var cName = $(this).attr('class');
					$("[chosed=qqq]").addClass(cName);
					 
					var reg = new RegExp("(((falign_)[A-Za-z0-9_]+\s*)+)", "g");

					cClass = $("[chosed=qqq]").attr('class');

					cClass = cClass.replace(reg, cName);
					var arr = cClass.split(' ');
					cClass = removeDuplicatedItem(arr);
					 

					$("[chosed=qqq]").removeAttr('class');
					$("[chosed=qqq]").addClass(cClass);
					stopPropagation();
				});
			});

		})();

        (function fx() {
			var ipt_fx = document.getElementById('ipt_fx');
			var ul_fx = document.getElementById('ul_fx');

			ipt_fx.onclick = function() {
				 
				ul_fx.style.display = 'block';
				ul_fcolor.style.display = "none";

				ul_fs.style.display = "none";
				ul_ff.style.display = "none";
				stopPropagation();

			}
		})();



          //加粗
		(function fontbold() {
			$('.fbold').click(function() {
				$("[chosed=qqq]").hasClass('ffbold') ? $("[chosed=qqq]").removeClass('ffbold') : $("[chosed=qqq]").addClass('ffbold');

			});

		})();
		
		 //斜体
		(function fontitalic() {
			$('.fitalic').click(function() {
				$("[chosed=qqq]").hasClass('ffitalic') ? $("[chosed=qqq]").removeClass('ffitalic') : $("[chosed=qqq]").addClass('ffitalic');

			});

		})();

        //删除线
		(function foverline() {
			$('.foverline').click(function() {
				$("[chosed=qqq]").hasClass('ffoverline') ? $("[chosed=qqq]").removeClass('ffoverline') : $("[chosed=qqq]").addClass('ffoverline');

			});

		})();




		document.onclick = function() {
			ul_fcolor.style.display = "none";
			ul_fs.style.display = "none";
			ul_ff.style.display = "none";
			ul_ffill.style.display = "none";
			ul_falign.style.display="none";
			ul_fx.style.display="none";
		};
	


   function classFilter(){
   	   
   }
     
    //阻止冒泡
    function stopPropagation() {  
    var e = e || window.event;  
    if(e.stopPropagation) { //W3C阻止冒泡方法  
        e.stopPropagation();  
    } else {  
        e.cancelBubble = true; //IE阻止冒泡方法  
    }  
    } 


	//去重

	function removeDuplicatedItem(ar) {
		var ret = [];

		for (var i = 0, j = ar.length; i < j; i++) {
			if (ret.indexOf(ar[i]) === -1) {
				ret.push(ar[i]);
			}
		}
		ret = ret.join(' ');
		return ret

	}
	//ctable

	function CreateTable(rowCount, cellCount, tIndex) {
		var num = parseInt(tIndex);
		dtC=$(".dataTable_container");	
		var tb = $("<table class='dataTable' id='dataTable" + tIndex + "'></table>");
		dtC.append(tb);
		for (var i = 0; i < rowCount; i++) {
			var tr = CreateTr();
			$("#dataTable" + tIndex).append(tr);
			for (var j = 0; j < cellCount; j++) {
				var td = CreateTd('', '');
				td.attr('r_col', j + 1);
				td.attr('r_row', i + 1);
				//td.attr('sheetnum',i);
				tr.append(td);
			}


		}
		
	}
	
	

	function CreateTr(className) {
		var tr = $("<tr class='" + className + "'></tr>");
		return tr;
	}


	function CreateTd(className,tdValue){

		var td = $("<td class='" + className + "'>" + tdValue + "</td>")
		return td;
	}
    
    
    //表头
	function CreateTitle(rowCount, cellCount){


		for (var i = 0; i < rowCount; i++) {
			var tr = $("<tr></tr>");

			tr.appendTo($("#titleTable"));

			for (var j = 0; j < cellCount; j++) {
				var th = $("<th>" + String.fromCharCode((65 + j)) + "</th>");
				th.attr('reportcol', j + 1);
				th.attr('reportrow', i + 1);
				// td.attr('sheetnum',i);
				th.appendTo(tr);
			}

		}

	}
   
    //左边
	function CreateLeft(rowCount, cellCount){


		for (var i = 0; i < rowCount; i++) {
			var tr = $("<tr></tr>");
			tr.appendTo($("#leftTable"));
			for (var j = 0; j < cellCount; j++) {
				var td = $("<td>" + (i + 1) + "</td>");
				td.appendTo(tr);
			}
		}

	}


    //编辑表格
	function fillTd(id) {
		var id = parseInt(id);

		$('#dataTable' + id).find('td').each(function() {

			$(this).dblclick(function() {

				var that = $(this);
				var ev = ev || window.event;
				that.attr('id', 'tttt')

				var tdWidth = that.width() - 2;
				var tdHeight = that.height() - 4;
				var tdText = that.text();

				var tdInput = $("<input type='text'  id='tdInput' class='tdInput' style='border:1px solid red;' value='" + tdText + "'></input>");

				tdInput.width(tdWidth);
				tdInput.height(tdHeight);

				that.html(tdInput);

				set_text_value_position(tdInput, -1);

 
				$('.tdInput').blur(function() {
					var content = $('.tdInput').val();
					$('.tdInput').remove();
					if (tdText == content) {
						$('#tttt').html(content);
						$("#tttt").removeAttr('id');
					} else {
						$('#tttt').html(content);
						$("#tttt").removeAttr('id');
					}

					event.stopPropagation();
				});

				$(".tdInput").keyup(function() {
					if (event.keyCode == 13) {
						$('.tdInput').blur();
					}
				});
				
				
				$('#dataTable'+id+' tr td').click(function(){
					$('.tdInput').blur();
				});
				
			});


			$(this).click(function() {


				$('.dataTable').find('td').removeClass('tdOn');
				$(this).addClass('tdOn');
				//		 	
				$(".dataTable tr td").removeAttr('chosed');
				$(this).attr('chosed', 'qqq');

			});



		});

	}


	(function addSheet() {
		var i = 2;
        dtC=(".dataTable_container");
		$('#sheet1').on('click', function() {

			$(this).addClass('sheetdefault').siblings().removeClass('sheetdefault');

			dtC.children().hide();
			$('#dataTable1').show();

			return false;
		});
		$('.addSheet').click(function() {
			CreateTable(40, 26, i);
			dtC.children().hide();


			var dd = $("<dd class='sheet sheetdefault' id=sheet" + i + ">sheet" + i + "</dd>");
			var curId = $(".sheetdefault").attr('id');
			//curId = parseInt(curId);
			curId=curId.replace('sheet','');
			//curId = parseInt(curId.substr(-1));
            curId=parseInt(curId);
            
			$("#sheet" + curId).removeClass('sheetdefault');

			var neId = parseInt(curId) + 1;
           //console.log(neId);
			$("#dataTable"+neId).show();
			fillTd(neId);
			$('.sheetqueuedl').append(dd);


			$("#dataTable" + neId).selectable();


			dd.on('click', function() {


				var dId = $(this).attr('id');
				dId = dId.replace('sheet','');
				dId = parseInt(dId);
				$("#dataTable" + dId).selectable();
				$(this).addClass('sheetdefault').siblings().removeClass('sheetdefault');
				dtC.children().hide();
				$("#dataTable" + dId).show();



				return false;
			});
			i++;
            //console.log(i);
			//$("#sheet"+(curId+1)).addClass('sheetdefault');


		});



	})();
    
    (function sheetMove(){
    	var lsheet=$('.lsheet');
    	var rsheet=$('.rsheet');
    	var sDl=$(".sheetqueuedl");
	    var num=0;
	    
	    
    	rsheet.click(function(){
        num==sDl.find('dd').length-1?num=sDl.find('dd').length-1:num++;
 		toNavPos();
    	});
    	
    	lsheet.click(function(){   		   		  				
    		num==0?num=0:num--;
     		toNavPos();
    	});
    	
    	function toNavPos(){
		sDl.stop().animate({'margin-left':-num*80},100);
	}
    	
    })();
    






	$(document).ready(function() {
		var dtC=$(".dataTable_container");
		
		dtC.height($(window).height() - 170);

		$(window).resize(function() {
			dtC.height($(window).height() - 170);

		});


		$(".dataTable_container").scroll(function() {
			var scrollY = $(".dataTable_container").scrollTop();
			var scrollX = $(".dataTable_container").scrollLeft();

			$(".yOrder").css('top', -scrollY + 30);
			$(".xOrder").css('left', -scrollX);

		});

		　$("#dataTable1").selectable();
		$("#btnMerge").on('click', mergeTd);
		$("#btnSplit").on('click', splitTd);



	});


   //合并单元格
	function mergeTd() {


		var cId = $('.sheetdefault').attr('id');
		cId = cId.substr(-1);

		var $t = $("#dataTable" + cId);

		if ($("table", $t).length > 0) {
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


			if (rowspan <= 1 && colspan <= 1) return;

			$("tr", $t).each(function() {
				var idx = $("tr", $t).index(this);
				var arr, $td = $("<td>").addClass(isSel ? sigSel : sigDel);

				if (idx == ridx) {
					// 本行在 [cidx] 后插入 colspan-1 个

					arr = $(); // 准备待插单元格
					for (var i = 0; i < colspan - 1; i++)
					arr = arr.add($td.clone());
					// 插入
					$("th,td", this).eq(cidx).after(arr);
                   
				} else if (ridx < idx && idx < ridx + rowspan) {
					// 以下行在 [cidx] 前插入 colspan 个

					arr = $(); // 准备待插单元格
					for (var i = 0; i < colspan; i++)
					arr = arr.add($td.clone());
					// 插入
					if (cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0) $("th,td", this).eq(cidx - 1).after(arr);
					else if ($("th,td", this).eq(cidx).length > 0) $("th,td", this).eq(cidx).before(arr);
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
            
            
            
			if (rmin <= ridx && ridx <= rmax && cmin <= cidx && cidx <= cmax) $(this).addClass(sigDel);

			if (ridx == rmin && cidx == cmin) $(this).removeClass(sigDel).attr({
				rowspan: rnum,
				colspan: cnum
			});

			if ($(this).attr("rowspan") == 1) $(this).removeAttr("rowspan");
			if ($(this).attr("colspan") == 1) $(this).removeAttr("colspan");
		}).remove("." + sigDel);


	}


    //分割单元格

	function splitTd() {

		var cId = $('.sheetdefault').attr('id');
		cId = cId.substr(-1);

		var $t = $("#dataTable" + cId);

		if ($("table", $t).length > 0) {
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


			if (rowspan <= 1 && colspan <= 1) return;

			if (isSel) $(this).removeAttr("colspan").removeAttr("rowspan");

			// 跨格开插
			$("tr", $t).each(function() {
				var idx = $("tr", $t).index(this);
				var arr, $td = $("<td>");

				if (!isSel) $td.addClass(sigDel);

				if (idx == ridx) {
					// 本行在 [cidx] 后插入 colspan-1 个

					arr = $(); // 准备待插单元格
					for (var i = 0; i < colspan - 1; i++)
					arr = arr.add($td.clone());

					$("th,td", this).eq(cidx).after(arr);

				} else if (ridx < idx && idx < ridx + rowspan) {
					// 以下行在 [cidx] 前插入 colspan 个

					arr = $(); // 准备待插单元格
					for (var i = 0; i < colspan; i++)
					arr = arr.add($td.clone());

					if (cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0) $("th,td", this).eq(cidx - 1).after(arr);
					else if ($("th,td", this).eq(cidx).length > 0) $("th,td", this).eq(cidx).before(arr);
					else $(this).prepend(arr);
				}
			});
		});

		// 重新获取以取到删者并删之
		$("th,td", $t).remove("." + sigDel);


	}