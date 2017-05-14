

function iTable(tContainer,tSettings){
	this.rowCount=tSettings.rowCount;
	this.cellCount=tSettings.cellCount;
	this.tIndex=tSettings.tIndex;
	this.container=tContainer;
	this.settings=tSettings;
	var header,footer;
}


iTable.prototype.createContent=function(){
	var num = ~~(this.tIndex);
	var myContainer=this.container;	
	myContainer.html('');
	var tb = $("<table class='dataTable' id='iTable" + this.tIndex + "'></table>");
	myContainer.append(tb);
 
	for (var i = 0; i < this.rowCount; i++) {
			var tr = this.createTr();
			$("#iTable" + this.tIndex).append(tr);
			for (var j = 0; j < this.cellCount; j++) {
				var td = this.createTd('','');
                  
				tr.append(td);
			}


		}
	
		
}

iTable.prototype.createTr=function() {
		var tr = $("<tr></tr>");
		return tr;
	}
iTable.prototype.createTd=function(className,tdValue){
	
		var td = $("<td class="+className+">"+tdValue+"</td>")
		return td;
}
iTable.prototype.createXaxis=function(){
	   
	   var xAxis=$("<div class='xOrder'></div>");
	   xAxis.html('');
	   var xTable=$("<table class='titleTable'></table>"); 
	   var xTdWidth=[];
	   var curT=this.getCurTable();
	   var firTds=curT.find('tr:first td');
	   
	   
	   
	   xAxis.insertBefore(this.container);
	   xAxis.html(xTable);
	   for (var i = 0; i < 1; i++) {
			var tr = $("<tr></tr>");

			tr.appendTo($(".titleTable"));

			for (var j = 0; j < this.cellCount; j++) {
				var th = $("<td>" + String.fromCharCode((65 + j)) + "</td>");
//              th.css({
//              	'max-width':firTds[j].offsetWidth,
//              	'min-width':firTds[j].offsetWidth
//              })
				th.appendTo(tr);
			}

		}
//	    for(j=0;j<firTds.length;j++){
//	   	  xTdWidth.push(firTds[j].offsetWidth);
//	    }
	     

}
iTable.prototype.createYaxis=function(){
	 var yAxis=$("<div class='yOrder'></div>");
	 var yTable=$("<table class='leftTable'></table>"); 
	   
	   yAxis.html('');
	   yAxis.insertBefore(this.container);
	   yAxis.html(yTable);
	   for (var i = 0; i < this.rowCount; i++) {
			var tr = $("<tr></tr>");

			tr.appendTo($(".leftTable"));

			for (var j = 0; j < 1; j++) {
				var th = $("<td>" + (i + 1) + "</td>");

				th.appendTo(tr);
			}

		}
}
iTable.prototype.createTip=function(){
	var content=$('<div></div>');
	tLeft=$('.yOrder');
	tHead=$('.xOrder');
	 
	bLeft=tLeft.find('table tr:first td:first').outerWidth();
	bTop=tHead.find('table tr:first td:first').outerHeight(); 
	content.css({
		'position':'fixed',
		'background':'#f5f5f5',
		'z-index':101,
		'top':'0',
		'left':'0',
		'width':bLeft,
		'height':bTop,
		'border-right':'1px solid #AAAAAA',
		'border-bottom':'1px solid #AAAAAA',
		'margin-top':'70px'
	});
	content.insertBefore(this.container);
}


iTable.prototype.getCurTable=function(){
	 var t;
	 t=this.container.find('table:visible');
	 return t
}

iTable.prototype.setCss=function(){
	var viewWidth=$(window).width();
	var viewHeight=$(window).height();
	tBody=this.getCurTable().parent();
	
	tLeft=$('.yOrder');
	tHead=$('.xOrder');
	 
	bLeft=tLeft.find('table tr:first td:first').outerWidth()+1;
	bTop=tHead.find('table tr:first td:first').outerHeight()+1; 
	 
	
	tLeft.css({
		'position':'fixed',
		'z-index':'99',
		'background':'#f5f5f5',
		'height':viewHeight,
		'overflow':'hidden',
		'left':'0'
	});
	tHead.css({
		'position':'fixed',
		'z-index':'100',
		'background':'#f5f5f5',
		'width':viewWidth-bLeft,
		'overflow':'hidden',
		'margin-left':bLeft,
		'margin-top':'70px',
		'top':'0'
	});
	
	tBody.css({
		'margin-left':bLeft,
		'margin-top':bTop+70,
		'width':viewWidth-bLeft,
		'height':viewHeight-bTop-110,
		'overflow':'scroll'
	});
	
	var that=this.container;
	$(window).resize(function(){
		var viewWidth=$(window).width();
        var viewHeight=$(window).height();

		
		that.width(viewWidth-bLeft);
	    that.height(viewHeight-bTop);
	});
	 
}

iTable.prototype.tableScroll=function(){
	   this.container.scroll(function(){
			var scrollY = $(this).scrollTop();
			var scrollX = $(this).scrollLeft();

			$(".yOrder table").css('margin-top', -scrollY);
			$(".xOrder table").css('margin-left', -scrollX);

		}); 
}
 

//填写表格
iTable.prototype.fillTd=function(){
 
        var id=1;
         
		$('#iTable1 tr').find('td').each(function() {
             
			$(this).dblclick(function(){

				var that = $(this);
				var ev = ev || window.event;
				that.attr('fid', 'tttt')

				var tdWidth = that.width();
				var tdHeight = that.height();
				var tdText = that.text();

				var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'></input>");

				tdInput.width(tdWidth);
				tdInput.height(tdHeight);

				that.html(tdInput);

				set_text_value_position(tdInput, -1);
 
 
				$('.tdInput').blur(function() {
					var content = $('.tdInput').val();
					
					if (tdText == content) {
 
                        $(this).parent().html(content);
                       
					} else {
 
                        $(this).parent().html(content);
                        
					}
                    $('.tdInput').remove();
                    
					event.stopPropagation();
				});

				$(".tdInput").keyup(function(ev) {
					if (ev.keyCode == 13) {
						$('.tdInput').blur();
					}
				});
				
				
				$('#iTable'+id+' tr td').click(function(){
					$('.tdInput').blur();
				});
				
			});


			$(this).click(function() {
                
                var tr=$(this).parent();
				$('.dataTable').find('td').removeClass('ui-selected');
				$(this).addClass('ui-selected');
				//		 	
				$(".dataTable tr td").removeAttr('chosed');
				$(this).attr('chosed', 'clickone');
             
			});



		});

	
}
//创建底部容器
iTable.prototype.createFooter=function(){
	this.footer=$('<div class="footer"></div>');
	this.footer.css({
		'z-index':102
	})
	this.container.after(this.footer);
	
	var addBox=$('<div class="addBox"><div class="addSheet"></div></div>');
	this.footer.append(addBox);
	
	var sheetQueue=$('<div class="sheetqueue"><div><dl class="sheet"><dd class="sheet" id="sheet1">1</dd></dl></div></div>');
	this.footer.append(sheetQueue);
}

//创建头部容器
iTable.prototype.createHeader=function(){
	this.header=$('<div class="header"></div>');
	this.header.css({
		'z-index':103
	})
	this.header.insertBefore(this.container);
	 
}
//字体类型
iTable.prototype.fontFamily=function(){
	var select=this.createSelection('fontFamily',this.settings.fontFamily);
	var sel_a=$(select[0]).find('ul li a');
    var className,curClass;
    var selThem;
     
	sel_a.on('click',function(){
       
        removeUied(); 
        
        className=$(this).attr('class');
        $('.ui-selected').addClass(className);
        
		var reg = new RegExp("(((font_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
				curClass = curClass.replace(reg,className);
			} else {
				return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
        selThem=$('.ui-selected');
		$('.ui-selected').removeAttr('class');
		 
		selThem.addClass(curClass);
	});  
	
	 
	
	sel_a.mouseover(function(){
		  $(this).css({'background':'#ECECEC'});
		  
	});
	sel_a.mouseout(function(){
		 $(this).css({'background':'#FFFFFF'});
	});	

	
}
//字体大小
iTable.prototype.fontSize=function(){
	var select=this.createSelection('fontSize',this.settings.fontSize);
	var sel_a=$(select[0]).find('ul li a');
    var className,curClass;
    var selThem;
     
	sel_a.on('click',function(){
		
        removeUied(); 
        
        className=$(this).attr('class');
        $('.ui-selected').addClass(className);
        
		var reg = new RegExp("(((fsize_)[A-Za-z0-9_]+\s*)+)", "g");

		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
				curClass = curClass.replace(reg,className);
			} else {
				return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
        selThem=$('.ui-selected');
		$('.ui-selected').removeAttr('class');
		 
		selThem.addClass(curClass);
	});  
	
	 
	
	sel_a.mouseover(function(){
		  $(this).css({'background':'#ECECEC'});
		  
	});
	sel_a.mouseout(function(){
		 $(this).css({'background':'#FFFFFF'});
	});	
}
//字体粗细
iTable.prototype.fontBold=function(){
	var simMenu=this.createSimpleMenu('fbold');
	var sel_a=$(simMenu[0]).children(0);     
	sel_a.on('click',function(){
        removeUied();       
       	$('.ui-selected').hasClass('ffbold') ? $('.ui-selected').removeClass('ffbold') : $('.ui-selected').addClass('ffbold');

	});  
	
}
//字体倾斜
iTable.prototype.fontItalic=function(){
	var simMenu=this.createSimpleMenu('fitalic');
	var sel_a=$(simMenu[0]).children(0);     
	sel_a.on('click',function(){
        removeUied();       
       	$('.ui-selected').hasClass('ffitalic') ? $('.ui-selected').removeClass('ffitalic') : $('.ui-selected').addClass('ffitalic');

	});  
	
}
//字体下划线
iTable.prototype.fontOverline=function(){
	var simMenu=this.createSimpleMenu('foverline');
	var sel_a=$(simMenu[0]).children(0);     
	sel_a.on('click',function(){
        removeUied();       
       	$('.ui-selected').hasClass('ffoverline') ? $('.ui-selected').removeClass('ffoverline') : $('.ui-selected').addClass('ffoverline');

	});  
	
}

iTable.prototype.fontColor=function(){
	var select=this.createCellMenu('fontColor',this.settings.fontColor);
	var td=$(select[0]).find('table tr td');
	var className,curClass;
    var selThem;
    
	td.on('click',function(){
		removeUied(); 
        
        className=$(this).find('a').attr('class');
        $('.ui-selected').addClass(className);
        
		var reg = new RegExp("(((fc_)[A-Za-z0-9_]+\s*)+)", "g");
		
		curClass = $('.ui-selected').attr('class');
		if(!!curClass) {
				curClass = curClass.replace(reg,className);
			} else {
				return;
		}
		var arr = curClass.split(' ');
		curClass = removeDuplicatedItem(arr);
        selThem=$('.ui-selected');
		$('.ui-selected').removeAttr('class');
		 
		selThem.addClass(curClass);
	});
}

//创建工具栏下拉菜单
iTable.prototype.createSelection=function(id,menus){
	 var selection=$('<div class="toolBox"></div>');
	 var selectHead=$('<div id="'+id+'"></div>');
	 var selectUl=$('<ul id=""></ul>');
	 var selectLi,arr=[];	 
	 
	 for(var index in menus){
	 	 arr.push(index);
	 	 selectHead.text(arr[0]);	 	  	 	   
	 	 selectLi=$('<li><a class="'+menus[index]+'">'+index+'</a></li>');	 	  	 	
	 	 selectUl.append(selectLi);
	 }	  	 
	 selectHead.after(selectUl);
	
	 
	 selection.append(selectHead);	 
	 this.header.append(selection);
	 selectUl.hide();
	 selectHead.on('click',function(){ 	
	 selectUl.toggle();	 
	 });
	 
	 selectUl.find('li a').on('click',function(){
       
	 	$(selectHead[0]).text($(this).text());
	 })
	 return selection;
}

//创建工具栏单个菜单
iTable.prototype.createSimpleMenu=function(className){
	var menus=$('<div class="toolBox"></div>');
	var simTool=$('<span class="'+className+'"></span>');
	menus.append(simTool);
	this.header.append(menus);
	return menus;
}
//创建工具栏格子菜单
iTable.prototype.createCellMenu=function(className,menus){
	
	var selection=$('<div class="toolBox"></div>');
	var selectHead=$('<div id=ipt_ffill></div>');
	var selectTb=$('<table class="'+className+'"></table>');
	var selectTr=$('<tr></tr>');
	var selectTd,length=JSONLength(menus);
	var arr1=[],arr2=[]
	 for(var index in menus){
	 	    arr1.push(menus[index].tdclass);
	 	    arr2.push(menus[index].fclass);          
//       	selectTd=$('<td class="'+menus[index].tdclass+'"><a class="'+menus[index].fclass+'"></a></td>');	    
	 }
	 for(var i=0;i<arr1.length+1;i++){
	 	selectTd=$('<td class="'+arr1[i]+'"><a class="'+arr2[i]+'"></a></td>');
	 	selectTr.append(selectTd);
	 	if(i%5==0&&i!=0){
	 	
	 	selectTb.append(selectTr);
	 	selectTr=$('<tr></tr>');
	 	 
	 	}
	 	
	 }
	 
	 selectHead.after(selectTb);
	 selection.append(selectHead);
	 this.header.append(selection);
	 
	 selectTb.hide();
	 selectHead.on('click',function(){
	 	selectTb.toggle();
	 });
	 return selection;
	 
}


//input光标
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
//获取key个数
function JSONLength(obj) {
var size = 0, key;
for (key in obj) {
if (obj.hasOwnProperty(key)) size++;
}
return size;
};

function removeUied(){
	$('.ui-selected').find('tr').removeClass('ui-selected');
    $('.ui-selected').find('tbody').removeClass('ui-selected');
}

var settings={
	rowCount:100,
	cellCount:26,
	tIndex:1,
	fontFamily:{
		'黑体':'font_Black',
		'宋体':'font_Song',
		'楷体':'font_Kai',
		'微软雅黑':'font_Mirco'

	},
	fontSize:{
		'10':'fsize_10',
		'12':'fsize_12',
		'14':'fsize_14',
		'16':'fsize_16',
		'18':'fsize_18',
		'20':'fsize_20'
	},
	fontBold:1,
	fontColor:{
		'red':{
			    'tdclass':'ffc_red',
			    'fclass' :'fc_red'
			  },
		'yellow':{
			'tdclass':'ffc_yellow',
			'fclass':'fc_yellow',
		}
		,
		'green':{
			'tdclass':'ffc_green',
			'fclass':'fc_green',
		},
		'orange':{
			'tdclass':'ffc_orange',
			'fclass':'fc_orange',
		},
		'blue':{
			'tdclass':'ffc_blue',
			'fclass':'fc_blue',
		},
		'aqua':{
			'tdclass':'ffc_aqua',
			'fclass':'fc_aqua',
		},
		'purple':{
			'tdclass':'ffc_purple',
			'fclass':'fc_purple',
		},
		'black':{
			'tdclass':'ffc_black',
			'fclass':'fc_black',
		},
		'white':{
			'tdclass':'ffc_white',
			'fclass':'fc_white',
		},
		'grey':{
			'tdclass':'ffc_grey',
			'fclass':'fc_grey',
		}
	}
}
 
var box=$('.box'); 
var t=new iTable(box,settings);

t.createContent();
t.createXaxis();
t.createYaxis();
t.setCss();
t.fillTd();
t.tableScroll();
t.createTip();
t.createFooter();
t.createHeader();
//

t.fontFamily();
t.fontSize();
t.fontBold();
t.fontItalic();
t.fontOverline();
t.fontColor();
$("#iTable1").selectable();