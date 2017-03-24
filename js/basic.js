	
	
	
	

   	$(document).ready(function() {
		var dtC=$(".dataTable_container");
		CreateTable(100, 26, 1);
	    CreateLeft(100, 1);
	    CreateTitle(1, 26);
        fillTd(1);
		dtC.height($(window).height() - 170);

		$(window).resize(function() {
			dtC.height($(window).height() - 170);

		});


		$(".dataTable_container").scroll(function(){
			var scrollY = $(".dataTable_container").scrollTop();
			var scrollX = $(".dataTable_container").scrollLeft();

			$(".yOrder").css('top', -scrollY + 30);
			$(".xOrder").css('left', -scrollX);

		});

		　$("#dataTable1").selectable();
		
		
		  $("#btnMerge").on('click', mergeTd);
		  $("#btnSplit").on('click', splitTd);



	});
	
	
	
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




    //阻止冒泡
    function stopPropagation() {  
    var e = e || window.event;  
    if(e.stopPropagation) {
        e.stopPropagation();  
    } else {  
        e.cancelBubble = true; 
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
//				td.attr('r_col', j + 1);
//				td.attr('r_row', i + 1);
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
//				th.attr('reportcol', j + 1);
//				th.attr('reportrow', i + 1);
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

				var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'></input>");

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

				$(".tdInput").keyup(function(ev) {
					if (ev.keyCode == 13) {
						$('.tdInput').blur();
					}
				});
				
				
				$('#dataTable'+id+' tr td').click(function(){
					$('.tdInput').blur();
				});
				
			});


			$(this).click(function() {
                
                var tr=$(this).parent();
				$('.dataTable').find('td').removeClass('ui-selected');
				$(this).addClass('ui-selected');
				//		 	
				$(".dataTable tr td").removeAttr('chosed');
				$(this).attr('chosed', 'qqq');
//				var rIndex=tr[0].rowIndex;
//              var cIndex=$(this)[0].cellIndex;
//              ($('.titleTable').find('tr th').eq(cIndex)).css({'background':'#DDDDDD','color':'#6699CC'}).siblings().css({'background':'#F5F5F5','color':'#000000'});
//              ($('.leftTable').find('tr td').eq(rIndex)).css({'background':'#DDDDDD','color':'#6699CC'}).parent().siblings().children().css({'background':'#F5F5F5','color':'#000000'}); 
//              
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
			CreateTable(100, 26, i);
			dtC.children().hide();


			var dd = $("<dd class='sheet sheetdefault' id=sheet" + i + ">sheet" + i + "</dd>");
			var curId = $(".sheetdefault").attr('id');
			curId=curId.replace('sheet','');
            curId=parseInt(curId);
            
			$("#sheet" + curId).removeClass('sheetdefault');

			var neId = parseInt(curId) + 1;
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
    









   //合并单元格
	function mergeTd() {


		var cId = $('.sheetdefault').attr('id');
		cId =  cId.replace('sheet','');

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
           
             var tWidth;
            cnum>3?tWidth=103:tWidth=102;
			if (rmin <= ridx && ridx <= rmax && cmin <= cidx && cidx <= cmax) $(this).addClass(sigDel);

			if (ridx == rmin && cidx == cmin) $(this).removeClass(sigDel).attr({
				rowspan: rnum,
				colspan: cnum
			}).width(cnum*tWidth);
           
			if ($(this).attr("rowspan") == 1) $(this).removeAttr("rowspan");
			if ($(this).attr("colspan") == 1) $(this).removeAttr("colspan");
		}).remove("." + sigDel);
        getUi();
       
	}


    //分割单元格

	function splitTd() {

		var cId = $('.sheetdefault').attr('id');
		cId = cId.replace('sheet','');

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
					
                   
				}else if (ridx < idx && idx < ridx + rowspan) {
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
		$("th,td", $t).remove("." + sigDel).width('100');


	}
	
//寻找td
	var f = function(tab,flag){

	var findTable = {},
		f = findTable,
		tabArr = [];

	if(tab == true || tab == 'true'){

		tab = 'table';

		flag = true;

	}else{

		tab = tab;

	}

	//判断单个还是所有
	if(flag){

		f.table = document.querySelectorAll(tab);

		for(var o = 0; o < f.table.length; o += 1){

			tabArr.push(f.table[o]);

		}
       
	}else{

		tab = tab || 'table';

		f.table = document.querySelector(tab);

		f.table.length = 1;

		tabArr.push(f.table);
		

	}

	for(var p = 0; p < tabArr.length; p += 1){

		actionTable(tabArr[p]);

	}

	
	f.table.getTableXY = function(x,y,type){

		var tableAllArr = [],
			temp = parameter(x,y,type);

		x = temp.x;

		y = temp.y;
		
		type = temp.type;


		if(tabArr.length == 1){

			return actionTable(tabArr[0]).getTableXY(x,y,type);

		}else{

			for(var p = 0; p < tabArr.length; p += 1){

				tableAllArr.push(actionTable(tabArr[p]).getTableXY(x,y,type));

			}		

			return tableAllArr;
	
		}

	}

	function actionTable(obj){

		var f = obj;

		//获取当前table所有tr，td，th
		f.refreshTable = function(){

			f.tableTr = obj.querySelectorAll('tr');

			f.tableTd = obj.querySelectorAll('td');

			f.tableTrLength = f.tableTr.length;

			f.tableTdLength = f.tableTd.length;
         
		};

		f.refreshTable();

		//给所有td绑定唯一标识
		f.tableCard = function(){

			var i = 0,k = 0,
				everyTrChild,
				everyTrChildLength;

			//重新获取,
			f.refreshTable();

			for(i; i < f.tableTrLength; i += 1){

				//绑定独立
				f.bindXY(f.tableTr[i],i);

			}

		};

		//为每一个td绑定独立ID
		f.tableTdArr= [];

		f.bindXY = function(tr,i){

			var td = tr.querySelectorAll('td'),
				tdLen = td.length;

			for(var n = 0; n < tdLen; n += 1){

				td[n].tableX = i;

				td[n].tableY = n;

				td[n].tableXY = [i,n];

				f.tableTdArr.push(td[n]);
               
			}

		};

		f.tableCard();


		//获取元素方法
		f.getTableXY = function(x,y,type){

			var temp = parameter(x,y,type);

			x = temp.x;

			y = temp.y;

			type = temp.type;

			//取出精确坐标
			if(type && type == 'all' || (x && y && y != 'all' && !type)){

				type = 'all';

				return f.eachTable(x,y,type);

			}else{

				return f.eachTable(x,y);

			}

		};

		//循环比较找出符合条件的元素
		f.eachTable = function(x,y,type){

			if(type && type == 'all'){

				for(var i = 0; i < f.tableTdArr.length; i += 1){


					if(x == f.tableTdArr[i].tableXY[0] && y == f.tableTdArr[i].tableXY[1]){

						f.success = f.tableTdArr[i];

						break;

					}

				}

			}

			if(y == 'tr'){

				for(var n = 0; n < f.tableTdArr.length; n += 1){

					if(x == f.tableTdArr[n].tableX){

						f.success = f.tableTdArr[n].parentNode;

						break;

					}

				}

			}

			if(y == 'td'){

				f.success = [];

				for(var m = 0; m < f.tableTrLength; m += 1){

					var tbtr = f.tableTr[m].querySelectorAll('td');

					//console.log(tbtr);

					for(k = 0; k < tbtr.length; k += 1){

						if(x == tbtr[k].tableY){

							f.success.push(tbtr[k]);

							continue;
						}

					}

				}

			}

			return f.success;

		};

		return f;

	}


	//参数处理
	function parameter(x,y,type){

		//避免出现 0 == false
		if(x == 0){

			x = '0';

		}

		if(y == 0){

			y = '0';
		}

		if(y == null && type == 'tr'){

			y = type;

		}

		if(x == null && type == 'td'){

			x = y;

			y = type;

		}

		return {
			x : x,
			y : y,
			type : type
		}

	}

	return f.table;

};


	
//颜色随机	
function getRandomColor(){
	return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);

}
//字符串取异
function getUniqueSet( setA, setB ){
	 
    var temp = {};
    for( var i = 0, len = setA.length; i < len ; i++ ){
        temp[ setA[i] ] = 0;
    }
    for( var j = 0, len = setB.length; j < len ; j++ ){
        if( typeof temp[ setB[j] ] === 'undefined' ){
            temp[ setB[j] ] = 0;
        }else{
            temp[ setB[j] ]++;
        }
    }
    //output
    var ret = [];
    for( var item in temp ){
        !temp[item] && ret.push( item );
    }
    return ret;
}




//(function hLight(){
//  var ev=ev||event;
//	var ifx=$('#ip_fx');
//	var ivalue;
//	var rs;
//	var arr=[];
//	var posX,posY;
//	var lTd;
//  var tmp=[];
//  var delTmp;
//  var lastValue,pastValue,changeValue;
//  var preColor;
//  var lightBox;
//  var pVal,lVal,cVal;
//  
//  
//	ifx.keydown(function(ev){
//		 //ivalue=ifx.val();
//	     pastValue=ivalue;
//	     
//	});
//      
//   
//	 ifx.keyup(function(ev){
//	 	
//	 	ivalue=ifx.val();
//	 	//ivalue.style.color=getRandomColor();
//		if(!ivalue){
//			return;
//		}else{
//		 
//      if((ev.keyCode==187)||ev.keyCode==189||(ev.keyCode==16&&ev.keyCode==56)||ev.keyCode==191){
//      	
//		    lastValue=ivalue;
//		    
//      }
//
// 
////     pVal=pastValue.split(/\+|\-|\*|\//);
////     lVal=lastValue.split(/\+|\-|\*|\//);
////     cVal=getUniqueSet(lVal,pVal);
////     console.log(cVal);
//
//
////删除
//       if((ev.keyCode==8)){
// 
//        
//           arr=ivalue.split(/\+|\-|\*|\//);
//           
//           pastValue=pastValue.split(/\+|\-|\*|\//);
//           
//          
//           delTmp=getUniqueSet(arr, pastValue);    
// 
//           
//           for(var i=0;i<delTmp.length;i++){
//           	 
//           	
//           	  rs=(delTmp[i].match(/[a-zA-Z]{1}[0-9]*/g)).toString();
//            
//            
//           }
//          
//           cLightTd(rs);
//           
//       }
//    
//        tmp=ivalue.replace(lastValue,'');
//        console.log(tmp);
//        
//        if(String(lastValue).indexOf(tmp)<=-1){
//        	lightTd(tmp);
//        	(String(lastValue).indexOf(tmp.substr(0,tmp.length-1))<=-1)&&cLightTd(tmp.substr(0,tmp.length-1));
//        		
//        	
//  
//        }
//        
//        
//        
//        
//        
//  		for(i = 0;i<coordinate.length;i++){
//  			if(isWhite(coordinate[i])){
//  				lightTd(coordinate[i]);
//  			}
//  			
//  		}
//	    }
//	  });
//	    
//	
//})();





(function(){
 var ev=ev||event;
 var ifx=$('#ip_fx');
 var pValue,nValue;
 var pArr,nArr,cArr;
 var endText;
 var res,delRes;
 var delText;
 var reg,flReg;
 
ifx.keyup(function(ev){
	pValue=ifx.val();
	
	
	//a1          /([a-zA-Z]([1-9]\d*))/i
	//-a1         /((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1}))/i
	//a1-a2        /([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*/
	//(a1-a2)    /(\(([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*\))|(([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*)/
	//数学公式       (\(*\d+(.\d+)*\)*(\+|-|/|\*))+\d+(.\d+)*\)*	
	//  a1+a2*(b4+c9)   /((\(*([a-zA-Z]([1-9]\d*))\)*(\+|-|\/|\*))*([a-zA-Z]([1-9]\d*))*\)*)|([a-zA-Z]([1-9]\d*))/
	
	
	

   	flReg=/\+|\-|\*|\/|\(|\)/;
    reg=/((\(*([a-zA-Z]([1-9]\d*))\)*(\+|-|\/|\*))*([a-zA-Z]([1-9]\d*))*\)*)|([a-zA-Z]([1-9]\d*))/;
	res=pValue.match(reg);
	 
	
	
	if(!!res[0]){
		
		endText=res[0].toString();
	  
	    
	    //实际应点亮的所有td坐标
	    pArr=endText.split(flReg);
	   
	 
	   
	    for(var i=0;i<pArr.length;i++){
	    	if(!!pArr[i]){
	    	isWhite(pArr[i])&&lightTd(pArr[i]);
 
	    	if(String(nValue).indexOf(pArr[i])<=-1){
        	lightTd(pArr[i]);
 
            cLightTd(pArr[i].substr(0,pArr[i].length-1));
	    	
	    	}
	    	
	    	
	    	}
	    }
	    

	    
	    
	}
	
	
	
	
	//删除
	if((ev.keyCode==8)){
   
          delRes=nValue.match( /([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*/);
   
            
             if(!!nValue){
             	
     
         
                dArr=nValue.split(flReg);

               cArr=pValue.split(flReg);

               delTmp=getUniqueSet(cArr, dArr); 
    
                if(!!delTmp[1]){
                cLightTd(delTmp[1]);
                }

                
             }
            

             
         }
	
	
	
	
});

ifx.keydown(function(ev){
	nValue=ifx.val();	
});


})();





function isWhite(tmp){
	      posX=tmp.match(/^[a-zA-Z]{1}/gi);
          posY=tmp.match(/\+?[1-9][0-9]*$/g); 
          posX=posX.toString();
	      posX=posX.toLocaleLowerCase().charCodeAt(0)-96;
	      posX--;
	      posY=posY.toString()-1;
      
          lTd=f('#dataTable1',true).getTableXY(posY,posX);
          if(lTd.style.background == ''){
          	return true;
          }
          else{
          	return false;
          }
}

function lightTd(tmp){
	      
	      posX=tmp.match(/^[a-zA-Z]{1}/gi);
          posY=tmp.match(/\+?[1-9][0-9]*$/g); 
          posX=posX.toString();
	      posX=posX.toLocaleLowerCase().charCodeAt(0)-96;
	      posX--;
	      posY=posY.toString()-1;
          
          lTd=f('#dataTable1',true).getTableXY(posY,posX);
         
        lTd.style.background=getRandomColor();
 
 

        
          
}
function cLightTd(tmp){
	
	      posX=tmp.match(/^[a-zA-Z]{1}/gi);
          posY=tmp.match(/\+?[1-9][0-9]*$/g); 
          posX=posX.toString();
	      posX=posX.toLocaleLowerCase().charCodeAt(0)-96;

	      if(posX == null||posY==null||posX.length ==0||String(posY).length==0){
	      	return;
	      }
	      posX--;
	      posY=posY.toString()-1;          
          lTd=f('#dataTable1',true).getTableXY(posY,posX);

          lTd.style.background='';
          return true;
}

 



 
