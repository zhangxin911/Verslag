	
 CreateTable(40,26,1);
 CreateLeft(40,1);
 CreateTitle(1,26);
		function fillTd(id){
		
		
		var id=parseInt(id);
		console.log('#dataTable'+id);
		$('#dataTable'+id).find('td').each(function(){
		   
			$(this).dblclick(function(){
			
			var that=$(this);
			var ev= ev || window.event; 
			                          
            that.attr('id','tttt')
            
            var tdWidth=that.width()-2;
            var tdHeight=that.height()-4;
            var tdText=that.text();
           
            var tdInput=$("<input type='text'  id='tdInput' class='tdInput' style='border:1px solid red;' value='"+ tdText +"'></input>");
            
            tdInput.width(tdWidth);
            tdInput.height(tdHeight);

            that.html(tdInput);
           
            set_text_value_position(tdInput, -1); 
            
   
             
		    $('.tdInput').blur(function(){ 
		    	var content=$('.tdInput').val(); 
		    	$('.tdInput').remove();		    	
		    	if(tdText==content){	    	
		    	$('#tttt').html(content);		    			    	
		    	$("#tttt").removeAttr('id');		    	
		    	}else{
		    	$('#tttt').html(content);		   
		    	$("#tttt").removeAttr('id');
		    	}
		    	 
		    	event.stopPropagation();
		    });
 
		  $(".tdInput").keyup(function(){
		    		if(event.keyCode == 13){ 
		    			$('.tdInput').blur();
		    		}
		    		});
		});
		
		
		 $(this).click(function(){
		 	
		 	
		 	 $('.dataTable').find('td').removeClass('tdOn');
	 	$(this).addClass('tdOn');
//		 	
		    $("#dataTable tr td").removeAttr('id');
   	        $(this).attr('id','qqq');
   	       
         });
		
		
		
		});
 	
		}
	
	fillTd(1);
	
		function set_text_value_position(obj, spos){
    var tobj = document.getElementById('tdInput');
    if(spos<0)
            spos = tobj.value.length;
    if(tobj.setSelectionRange){ //兼容火狐,谷歌
            setTimeout(function(){
                tobj.setSelectionRange(spos, spos);
                tobj.focus();}
                ,0);
    }else if(tobj.createTextRange){ //兼容IE
            var rng = tobj.createTextRange();
            rng.move('character', spos);
            rng.select();
    }
}
		
		//获取鼠标坐标
function mouseCoords(ev) 
{  var ev= ev || window.event; 
if(ev.pageX || ev.pageY){ 
return {x:ev.pageX, y:ev.pageY}; 
} 
return{ 
x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
y:ev.clientY + document.body.scrollTop - document.body.clientTop 
}; 
} 


 
     
       //select
     (function(){
     	
     	//字体类型
     	function fontfamilySelect(){
     		var cName;
     		 var ipt_ff=document.getElementById('ipt_ff');
	 var ul_ff=document.getElementById('ul_ff');
		var lis=ul_ff.children;
		var bd=document.getElementsByTagName('body');
		
		ipt_ff.onclick=function(){
			ul_ff.style.display='block';
			ul_fcolor.style.display = "none";
			ul_fs.style.display = "none";
			
			if(document.all){
				window.event.cancelBubble = true;
			}else{
				event.stopPropagation();
			}

		}
		
		 
		for(var i=0;i<lis.length;i++){
			lis[i].setAttribute('Oindex',i);
			lis[i].onclick=function(){
				ul_ff.style.display='none';

				ipt_ff.innerHTML=this.children[0].innerHTML;
				//console.log($('#qqq'));
				cName=this.children[0].className;
					$('#qqq').addClass(cName);
				var  reg= new RegExp("(((font_)[A-Za-z0-9_]+\s*)+)","g");
				
				cClass=$('#qqq').attr('class');

 


				cClass=cClass.replace(reg,cName);
				var arr = cClass.split(' ');
                removeDuplicatedItem(arr);
               function removeDuplicatedItem(ar) {
                 var ret = [];

              for (var i = 0, j = ar.length; i < j; i++) {
        if (ret.indexOf(ar[i]) === -1) {
            ret.push(ar[i]);
        }
    }
    ret=ret.join(' ');
    
    cClass=ret;
    return cClass
}		 
				$('#qqq').removeAttr('class');
			     $('#qqq').addClass(cClass);
				
				
				
				
				if(document.all){
					window.event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}

				
				
			}
			lis[i].onmouseover=function(){
				var Oindex=Number(this.getAttribute('Oindex'))+1;
				this.children[0].style.background='#ECECEC';
				

			}
			lis[i].onmouseout=function(){
				var Oindex=Number(this.getAttribute('Oindex'))+1;
				this.children[0].style.background='#FFFFFF';
				 

			}

		}
		return cName; 
		}
     	
     	//字体大小
		function fontsizeSelect(){
			var cName;
			 var ipt_fs =document.getElementById('ipt_fs');
	 var ul_fs =document.getElementById('ul_fs');
		var lis=ul_fs.children;
		 
		ipt_fs.onclick=function(){
			ul_fs.style.display='block';
			ul_fcolor.style.display = "none";
			 
			ul_ff.style.display = "none";
			
			
			if(document.all){
				window.event.cancelBubble = true;
			}else{
				event.stopPropagation();
			}

		}
		
		 
		for(var i=0;i<lis.length;i++){
			lis[i].setAttribute('Oindex',i);
			lis[i].onclick=function(){
				//console.log(cClass);
				ul_fs.style.display='none';

				ipt_fs.innerText=this.children[0].innerText;
				cName=this.children[0].className;
				
				$('#qqq').addClass(cName);
	
				
				var  reg= new RegExp("(((fsize_)[A-Za-z0-9_]+\s*)+)","g");
				 
				cClass=$('#qqq').attr('class');


				cClass=cClass.replace(reg,cName);
		
	
	var arr = cClass.split(' ');
 removeDuplicatedItem(arr);
     function removeDuplicatedItem(ar) {
    var ret = [];

    for (var i = 0, j = ar.length; i < j; i++) {
        if (ret.indexOf(ar[i]) === -1) {
            ret.push(ar[i]);
        }
    }
    ret=ret.join(' ');
 
    return ret;
    
    cClass=ret;
}
     
				$('#qqq').removeAttr('class');
			     $('#qqq').addClass(cClass);
				
				
				if(document.all){
					window.event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
			}
			lis[i].onmouseover=function(){
				var Oindex=Number(this.getAttribute('Oindex'))+1;
				this.children[0].style.background='#ECECEC';
				

			}
			lis[i].onmouseout=function(){
				var Oindex=Number(this.getAttribute('Oindex'))+1;
				this.children[0].style.background='#FFFFFF';
				 

			}

		}
		
  
	}
		
		//字体颜色
		function fontcolorSelect(){	
			 var ipt_fcolor =document.getElementById('ipt_fcolor');
	         var ul_fcolor =document.getElementById('ul_fcolor');
		
	 
		ipt_fcolor.onclick=function(){
			ul_fcolor.style.display='table-cell';
			
			ul_fs.style.display = "none";
			ul_ff.style.display = "none";
			if(document.all){
				window.event.cancelBubble = true;
			}else{
				event.stopPropagation();
			}

		}
		$('#ul_fcolor').find('td').each(function(){
			$(this).click(function(){
				//console.log($(this).attr('class'));
				ul_fcolor.style.display = "none";
				var cName=$(this).attr('class');
					$('#qqq').addClass(cName);	
				var  reg= new RegExp("(((fc_)[A-Za-z0-9_]+\s*)+)","g");
				
				cClass=$('#qqq').attr('class');
				 
				cClass=cClass.replace(reg,cName);
				 console.log(cClass);
				
				
  	var arr = cClass.split(' ');
 removeDuplicatedItem(arr);
     function removeDuplicatedItem(ar) {
    var ret = [];
    for (var i = 0, j = ar.length; i < j; i++) {
        if (ret.indexOf(ar[i]) === -1) {
            ret.push(ar[i]);
        }
    }
    ret=ret.join(' ');
 
    return ret;
    
    cClass=ret;
}
 
			$('#qqq').removeAttr('class');
			     $('#qqq').addClass(cClass);
			if(document.all){
					window.event.cancelBubble = true;
				}else{
					event.stopPropagation();
				}
			});
		});
		 
		}
    
        (function fontbold(){
        	$('.fbold').click(function(){
        		$('#qqq').hasClass('ffbold')?$('#qqq').removeClass('ffbold'):$('#qqq').addClass('ffbold');
        		
        	});
        	
      })();
    (function fontitalic(){
        	$('.fitalic').click(function(){
        		$('#qqq').hasClass('ffitalic')?$('#qqq').removeClass('ffitalic'):$('#qqq').addClass('ffitalic');
        		
        	});
        	
      })();
    
    
    (function foverline(){
        	$('.foverline').click(function(){
        		$('#qqq').hasClass('ffoverline')?$('#qqq').removeClass('ffoverline'):$('#qqq').addClass('ffoverline');
        		
        	});
        	
      })();
    
    
    
    
	document.onclick = function(){
			ul_fcolor.style.display = "none";
			ul_fs.style.display = "none";
			ul_ff.style.display = "none";
		};
	 fontfamilySelect();
     fontsizeSelect();
     fontcolorSelect();	
     
     })();
      
      
      //ctable
     function CreateTable(rowCount,cellCount,tIndex){ 
     var num=tIndex;
     var tb=$("<table class='dataTable' id='dataTable"+tIndex+"'></table>");
     $(".dataTable_container").append(tb);
         
     for(var i=0;i<rowCount;i++)
     {
        var tr=CreateTr();
        $("#dataTable"+tIndex).append(tr);
        
        for(var j=0;j<cellCount;j++)
        {
        	
        	
           var td=CreateTd('fileDiv','');
           td.attr('r_col',j+1);
           td.attr('r_row',i+1);
           //td.attr('sheetnum',i);
           tr.append(td);
           
        }
        
        
     }
    //console.log(tId);
    }
      
    function CreateTr(className){
    	var tr=$("<tr class='"+className+"'></tr>");
    	return tr;
    }
    
    
    function CreateTd(className,tdValue){
    	
    	var td=$("<td class='"+className+"'>"+tdValue+"</td>")
        return td;
    }
    
  function CreateTitle(rowCount,cellCount)
     { 
     
     
     for(var i=0;i<rowCount;i++)
     {
        var tr=$("<tr></tr>");
        
        tr.appendTo($("#titleTable"));
       
        for(var j=0;j<cellCount;j++)
        {
        	var th=$("<th>"+String.fromCharCode((65+j))+"</th>");
            
　　

           
           th.attr('reportcol',j+1);
           th.attr('reportrow',i+1);
          // td.attr('sheetnum',i);
          th.appendTo(tr);
        }
        
     }
    
    }


      function CreateLeft(rowCount,cellCount)
     { 
     
     
     for(var i=0;i<rowCount;i++)
     {
        var tr=$("<tr></tr>");
        tr.appendTo($("#leftTable"));
        for(var j=0;j<cellCount;j++)
        {
           var td=$("<td>"+(i+1)+"</td>");
           td.appendTo(tr);
        }
     }
    
    }
     
     
     
     
     
     (function addSheet(){
     	var i=2;
     	
     	$('#sheet1').on('click',function(){
     			
     			//console.log($(this));
     			$(this).addClass('sheetdefault').siblings().removeClass('sheetdefault');
     			
     			$('.dataTable_container').children().hide();
     			$('#dataTable1').show();
     			
     			return false;
     		});
     	$('.addSheet').click(function(){
     		CreateTable(40,26,i);
     		$('.dataTable_container').children().hide();
     	   
     	    
     		var dd=$("<dd class='sheet sheetdefault' id=sheet"+i+">sheet"+i+"</dd>");
     		var curId=$(".sheetdefault").attr('id');
     		curId=parseInt(curId.substr(-1));
     		
     		
     		$("#sheet"+curId).removeClass('sheetdefault');
     		
     		var neId=parseInt(curId)+1;
     		
     		 $("#dataTable"+neId).show();
     		 fillTd(neId);
     		console.log(neId);
     		
     		$('.sheetqueuedl').append(dd);
     		 
     		
     		dd.on('click',function(){
     			
     			//console.log($(this));
     			var dId=$(this).attr('id');
     			dId=dId.substr(-1);
     		 
     			$(this).addClass('sheetdefault').siblings().removeClass('sheetdefault');
     			$('.dataTable_container').children().hide();
     			
     			
     			$("#dataTable"+dId).show();
     			
     			
     			return false;
     		});
     		i++;
     		
     		//$("#sheet"+(curId+1)).addClass('sheetdefault');
     		
     		
     	});
     
        
      
     })();
     
 
     
     
     
     

     $(document).ready(function(){
     	$(".dataTable_container").height($(window).height()-170);
     	console.log($(window).height());
     	console.log($(".dataTable_container").height());
     	$(window).resize(function(){
$(".dataTable_container").height($(window).height()-170);

});
     	
    
//  $(".dataTable_container").niceScroll({
//  	 cursorcolor: "#ccc",//#CC0071 光标颜色
//              cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
//              touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
//              cursorwidth: "10px", //像素光标的宽度
//              cursorborder: "0", // 	游标边框css定义
//              cursorborderradius: "5px",//以像素为光标边界半径
//              autohidemode: false //是否隐藏滚动条
//
//  });
//  $(".dataTable_container").getNiceScroll().resize();
    $(".dataTable_container").scroll(function(){
    	var scrollY=$(".dataTable_container").scrollTop();
    	var scrollX=$(".dataTable_container").scrollLeft();
    	
    	$(".yOrder").css('top',-scrollY+30);
    	$(".xOrder").css('left',-scrollX);
      
    });
   
　 
    
});


   $(function(){
            // 显示已选单元格编号
            function ShowSelected()
            {
                    var result = $("#select-result").empty();
                    var isEmpty = true;
                    var tds = $("th,td", $("#dataTable1"));
                    tds.filter(".ui-selected").each(function(){
                        result.append("#" + (tds.index(this) + 1) + " ");
                        isEmpty = false;
                    });
                    if (isEmpty) result.append("无");
            }
             
            // 使表格可选
            $("#dataTable1").selectable({stop: ShowSelected});
             
            // 合并单元格按钮
            $("#btnMerge").click(function(){
                var $t = $("#dataTable1");
                 
                if ($("table", $t).length > 0) {
                    alert("不支持嵌套表格！");
                    return;
                }
                 
                var sigDel = "sign4delete";  // 删除标记，用作类名
                var sigSel = "ui-selected";  // 选中标记，用作类名
                 
                // 补充单元格以便后继正确计算坐标
                $("th,td", $t).each(function(){
                    // 坐标要实时计算，因会实时补充
                    var ridx = $("tr", $t).index($(this).parent("tr"));
                    var cidx = $(this).parent().children("th,td").index(this);
                    var rowspan = Number($(this).attr("rowspan")) || 1;
                    var colspan = Number($(this).attr("colspan")) || 1;
                    var isSel = $(this).hasClass(sigSel);
                    // 非选单元格拆出的单元格要加删除标记
                     
                    if (rowspan <= 1 && colspan <= 1)
                        return;
                    // 跨格开插
                    $("tr", $t).each(function(){
                        var idx = $("tr", $t).index(this);
                        var arr, $td = $("<td>").addClass(isSel ? sigSel : sigDel);
                         
                        if (idx == ridx) {
                            // 本行在 [cidx] 后插入 colspan-1 个
                             
                            arr = $();  // 准备待插单元格
                            for (var i=0; i < colspan-1; i++)
                                arr = arr.add($td.clone());
                            // 插入
                            $("th,td", this).eq(cidx).after(arr);
                             
                        } else if (ridx < idx && idx < ridx + rowspan) {
                            // 以下行在 [cidx] 前插入 colspan 个
                             
                            arr = $();  // 准备待插单元格
                            for (var i=0; i < colspan; i++)
                                arr = arr.add($td.clone());
                            // 插入
                            if (cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0)
                                $("th,td", this).eq(cidx - 1).after(arr);
                            else if ($("th,td", this).eq(cidx).length > 0)
                                $("th,td", this).eq(cidx).before(arr);
                            else
                                $(this).prepend(arr);
                        }
                    });
                });
                 
                var rmin = 10000, cmin = 10000;
                var rmax = 0    , cmax = 0    ;
                var rnum        , cnum        ;
                // 计算起始和跨距
                $("th,td", $t).filter("." + sigSel).each(function(){
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
                $("th,td", $t).each(function(){
                    var ridx = $("tr", $t).index($(this).parent("tr"));
                    var cidx = $(this).parent().children("th,td").index(this);
                    // 标记单元格待删
                    if (rmin <= ridx && ridx <= rmax
                     && cmin <= cidx && cidx <= cmax)
                        $(this).addClass(sigDel);
                    // 处理被选左上角单元格
                    if (ridx == rmin && cidx == cmin)
                        $(this).removeClass(sigDel).attr({rowspan: rnum, colspan: cnum});
                    // 清理残余
                    if ($(this).attr("rowspan") == 1) $(this).removeAttr("rowspan");
                    if ($(this).attr("colspan") == 1) $(this).removeAttr("colspan");
                }).remove("." + sigDel);
                // 移除标记单元格
                 
                ShowSelected();  // 更新选择结果文字
            });
             
            // 拆分单元格按钮
            $("#btnSplit").click(function(){
                var $t = $("#dataTable1");
                 
                if ($("table", $t).length > 0) {
                    alert("不支持嵌套表格！");
                    return;
                }
                 
                var sigDel = "sign4delete";  // 删除标记，类名，自定义
                var sigSel = "ui-selected";  // 选中标记，类名，jQuery UI 定义
                 
                // 补充单元格以便后继正确计算坐标
                $("th,td", $t).each(function(){
                    // 坐标要实时计算，因会实时补充
                    var ridx = $("tr", $t).index($(this).parent("tr"));
                    var cidx = $(this).parent().children("th,td").index(this);
                    var rowspan = Number($(this).attr("rowspan")) || 1;
                    var colspan = Number($(this).attr("colspan")) || 1;
                    var isSel = $(this).hasClass(sigSel);
                    // 非选单元格拆出的单元格要加删除标记
                     
                    if (rowspan <= 1 && colspan <= 1)
                        return;
                     
                    if (isSel)
                        $(this).removeAttr("colspan").removeAttr("rowspan");
                     
                    // 跨格开插
                    $("tr", $t).each(function(){
                        var idx = $("tr", $t).index(this);
                        var arr, $td = $("<td>");
                         
                        if (!isSel)
                            $td.addClass(sigDel);
                         
                        if (idx == ridx) {
                            // 本行在 [cidx] 后插入 colspan-1 个
                             
                            arr = $();  // 准备待插单元格
                            for (var i=0; i < colspan-1; i++)
                                arr = arr.add($td.clone());
                             
                            $("th,td", this).eq(cidx).after(arr);
                             
                        } else if (ridx < idx && idx < ridx + rowspan) {
                            // 以下行在 [cidx] 前插入 colspan 个
                             
                            arr = $();  // 准备待插单元格
                            for (var i=0; i < colspan; i++)
                                arr = arr.add($td.clone());
                             
                            if (cidx > 0 && $("th,td", this).eq(cidx - 1).length > 0)
                                $("th,td", this).eq(cidx - 1).after(arr);
                            else if ($("th,td", this).eq(cidx).length > 0)
                                $("th,td", this).eq(cidx).before(arr);
                            else
                                $(this).prepend(arr);
                        }
                    });
                });
                 
                // 重新获取以取到删者并删之
                $("th,td", $t).remove("." + sigDel);
                 
                ShowSelected();  // 更新选择结果文字
            });
        });

