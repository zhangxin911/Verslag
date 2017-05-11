

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


iTable.prototype.createHeader=function(){
	this.header=$('<div class="header"></div>');
	this.header.css({
		'z-index':103
	})
	this.header.insertBefore(this.container);
	 
}

iTable.prototype.fontFamily=function(){
	var select=this.createSelection(1,this.settings.fontFamily);
    	
}
iTable.prototype.createSelection=function(id,menus){
	 var selection;
	 var selectHead=$('<div id="'+id+'"></div>');
	 var selectUl=$('<ul id=""></ul>');
	 var selectLi;
	 console.log($.parseJSON(menus));
	 selectHead.text(JSON.stringify(menus));
	 for(var index in menus){
	 	
	 	selectLi=$('<li>'+index+'</li>');
	 	selectUl.append(selectLi);
	 }	  	 
	 selectHead.append(selectUl);
	 selection=selectHead	 
	 this.header.append(selection);
	 selectUl.hide();
	 selectHead.on('click',function(){
	 	
	 	$(this).children().toggle();
	 });
	 return selection;
}




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

function stopPropagation() {  
    var e = e || window.event;  
    if(e.stopPropagation) {
        e.stopPropagation();  
    } else {  
        e.cancelBubble = true; 
    }  
    } 

var settings={
	rowCount:100,
	cellCount:26,
	tIndex:1,
	fontFamily:{
		'黑体':'font_Black',
		'微软雅黑':'font_Mirco',
		'宋体':'font_Song',
		'楷体':'font_Kai'
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
$("#iTable1").selectable();
