"use strict" //严格模式

function ITable(tContainer, tSettings, tabs,mergeArray) {

    this.rowCount = Number(tSettings.rowCount);

    this.cellCount = Number(tSettings.cellCount);

    this.container = tContainer;

    this.settings = tSettings;

    this.tabs = tabs;



    this.header=null;
    this.footer=null;
    this.tools=null;
    this.moveLast=null;
    this.table=null;

    this.mergeTds=mergeArray || new Array();
}

ITable.prototype.CreateContent = function (tid) {

    var tId = tid || 1;

    var myContainer = this.container;

    myContainer.empty();

    this.table = $("<table class='dataTable' id='iTable" + tId + "'></table>");

    myContainer.append(this.table);

    for (var i = 0; i < this.rowCount; i++) {

        var tr = this.CreateTr();

        var th = $('<th></th>');

        var colG = $('<colgroup></colgroup>');

        var col;

        for (var j = 0; j <= this.cellCount; j++) {

            var td = this.CreateTd('ftNormal fsize_14 font_Black','');

            if (j === 0) {

                col = $("<col style='width:63px' id='t0'>");

                tr.append(th);

            } else {

                col = $("<col style='width:100px' id='t"+j+"'>");

                tr.append(td);
            }

            colG.append(col);

            if (i === 0) {

                this.table.append(colG);

            }



        }

        this.table.append(tr);

    }

    this.SetIndex();

};

ITable.prototype.CreateTr = function () {
    var tr = $("<tr></tr>");
    return tr;
};

ITable.prototype.CreateTd = function (className, tdValue) {

    var td = $("<td>" + tdValue + "</td>");
    td.addClass(className);
    return td;

};

ITable.prototype.CreateXAxis = function () {

    var xAxis = $("<div class='xOrder'></div>");

    var xTable = $("<table class='titleTable' id='titleTable'></table>");

    var th = $("<th></th>");

    var col;

    this.container.before(xAxis);

    xAxis.append(xTable);

    var tr = $("<tr></tr>");

    tr.append(th);

    for (var i = 0; i < 1; i++) {

        var colG = $("<colgroup></colgroup>");

        for (var j = 0; j <= this.cellCount; j++) {

            var td = $("<td>" + IntToChr(j-1) + "</td>");

            if (j === 0) {

                col = $("<col style='width:63px'>");

                tr.append(th);

            } else {

                col = $("<col style='width:100px' id='c"+j+"'>");

                tr.append(td);

            }

            colG.append(col);

            if (i === 0) {

                xTable.append(colG);

            }



        }

        xTable.append(tr);

    }

};

ITable.prototype.CreateYAxis = function () {

    var yAxis = $("<div class='yOrder'></div>");

    var yTable = $("<table class='leftTable' id='leftTable'></table>");

    this.container.before(yAxis);

    yAxis.append(yTable);

    for (var i = 0; i < this.rowCount; i++) {

        var tr = $("<tr></tr>");

        for (var j = 0; j < 1; j++) {

            var th = $("<td>" + (i + 1) + "</td>");

            th.appendTo(tr);

        }

        yTable.append(tr);

    }

};

ITable.prototype.CreateTip = function () {

    var content = $("<div class='greyBlock'></div>"),

        tLeft = $('.yOrder'),

        tHead = $('.xOrder');

    var bLeft = tLeft.find('table tr:first td:first').outerWidth(),

        bTop = tHead.find('table tr:first td:first').outerHeight();

    content.css({
        'width': bLeft,
        'height': bTop
    });


    $(this.container).append(content);

};

ITable.prototype.FrameSelect = function () {

    var that=this;
    var coords;

    var wB1=$('#wBorder').find('div').eq(0),
        wB2= $('#wBorder').find('div').eq(1),
        wB3= $('#wBorder').find('div').eq(2),
        wB4=$('#wBorder').find('div').eq(3);

    this.table.find('td').each(function(){
        $(this).off('mouseover').on('mouseover',function(){
            coords=$(this);
            that.moveLast=$(this);
        });
    });

    $(this.container).off('mousedown').on('mousedown',function(){

        var onCols = parseInt($(coords).attr('cols')) ;

        var onRows = parseInt($(coords).attr('rows')) ;

        var sTop,sLeft,top,left;



        $(that.container).off('mousemove').on('mousemove',function(){

            var moveCS=isNaN(Number(that.moveLast.attr('colspan')))?1:Number(that.moveLast.attr('colspan'));

            var moveRS=isNaN(Number(that.moveLast.attr('rowspan')))?1:Number(that.moveLast.attr('rowspan'));

            var moveX=Number(that.moveLast.attr('cols'))+moveCS-1;

            var moveY=Number(that.moveLast.attr('rows'))+moveRS-1;

            var startX,endX,startY,endY;

            if(onCols<moveX){
                startX=onCols;
                endX=moveX;
            }else{
                startX=Number(that.moveLast.attr('cols'));
                endX=onCols;

            }
            if(onRows<moveY){
                startY=onRows;
                endY=moveY;
            }else{
                startY=Number(that.moveLast.attr('rows'));
                endY=onRows;
            }


            that.table.find('td').removeClass('picked');

            for(var m=0,len=that.mergeTds.length;m<len;m++){
                var mergeCS=isNaN(Number($(that.mergeTds[m]).attr('colspan')))?1:Number($(that.mergeTds[m]).attr('colspan'));
                var mergeRS=isNaN(Number($(that.mergeTds[m]).attr('rowspan')))?1:Number($(that.mergeTds[m]).attr('rowspan'));

                var mergeCol=Number($(that.mergeTds[m]).attr('cols'));
                var mergeRow=Number($(that.mergeTds[m]).attr('rows'));
                var mergeX=Number($(that.mergeTds[m]).attr('cols'))+mergeCS-1;
                var mergeY=Number($(that.mergeTds[m]).attr('rows'))+mergeRS-1;

                if(startX>mergeX){
                    //out 开始点在右边
                }else{
                    //开始点在左边
                    if(endX<mergeCol){
                        //out 终止点在上边
                    }else{
                        if(startY>mergeY){
                               //out  开始点在下面
                        }else{
                              if(endY<mergeY&&startY<mergeRow){
                                  //out
                              }else{
                              startX<Number($(that.mergeTds[m]).attr('cols'))?startX=startX:startX=Number($(that.mergeTds[m]).attr('cols'));
                              startY<Number($(that.mergeTds[m]).attr('rows'))?startY=startY:startY=Number($(that.mergeTds[m]).attr('rows'));
                              endX<mergeX?endX=mergeX:endX=endX;
                              endY<mergeY?endY=mergeY:endY=endY;
                              }

                        }

                    }

                }


            }

            var totalWidth=0,totalHeight=0;
            for(var i = startX; i <= endX ; i++) {
                for(var j = startY; j <= endY; j++) {
                            var id='#'+j+'-'+i;
                            $(id).addClass('picked');

                            if(i===startX){
                                totalHeight+=$('#'+j+'-'+startX).outerHeight();
                            }
                            if(j===startY){
                                totalWidth+=$('#'+startY+'-'+i).outerWidth();
                            }

                }

            }

            sTop=Number(this.scrollTop) ;
            sLeft=Number(this.scrollLeft) ;

            // top=Number($('#'+startY+'-'+startX).offset().top)+sTop;
            top=Number(document.getElementById(startY+'-'+startX).offsetTop)+sTop;
            // left=Number($('#'+startY+'-'+startX).offset().left)+sLeft;
            left=Number(document.getElementById(startY+'-'+startX).offsetLeft)+sLeft;

            $('#wBorder').css({

                'top': top,

                'left': left,

                'display': 'block'
            });

            wB1.css({

                'width': totalWidth,

                'height': '2px',

                'left': 0,

                'top': 0

            });

            wB2.css({
                'width': totalWidth,

                'height': '2px',

                'left': 0,

                'top': totalHeight
            });

            wB3.css({

                'width': '2px',

                'height': totalHeight,

                'left': 0,

                'top': 0

            });

            wB4.css({
                'width': '2px',

                'height': totalHeight,

                'left': totalWidth,

                'top': 0

            });

            $('#scorner').css({

                'top':  totalHeight - 2,

                'left': totalWidth - 2

            });

        });
        $(that.container).on('mouseup',function(){
            $(this).off('mousemove');
        });

    });
};



ITable.prototype.TextArea=function(){
     var div=$('<div class="iTableInputHolder" id="iTableInputHolder"></div>');
     var textArea=$('<input type="text" class="iTableInput" id="iTableInput">');
     div.append(textArea);
     $(this.container).append(div);

};

ITable.prototype.SetTextArea=function(visible){
    if($('.picked').length>0){
        var w = $('.picked').width();
        var h = $('.picked').height();
        var x = $('.picked').offset().left+this.container.scrollLeft();
        var y=$('.picked').offset().top+this.container.scrollTop()-parseInt($(this.container).css('margin-top'));

        if(visible===1){
            $('#iTableInputHolder').show();
        }else{
            $('#iTableInputHolder').hide();
        }

        $('#iTableInputHolder').css({
            'left':x,
            'top':y
        });

        $('#iTableInput').css({
            'width':w,
            'height':h
        });
    }


};



ITable.prototype.HideTextArea=function(){
    $('#iTableInputHolder').hide();

};

ITable.prototype.fillExTextArea=function(eType,val,ex){

};

ITable.prototype.FillTextArea=function(eType,val){

    var that=this;
    switch(eType)
    {
        case 'dblclick':
            $('#iTableInput').val('');
            $(document).off('keydown');
            $('#iTableInput').focus().val(val);
            $("#iTableInput").on('change',function(){
                $('#ip_fx').val($(this).val());
                that.IsExpress($('#iTableInput').val());
                event.stopPropagation();
            });
            $('#iTableInput').off('keyup').on('keyup',function(){
                if (event.keyCode === 13) {
                    var content = $('#iTableInput').val();
                    var curClass=$('.picked').attr('class');

                    $('.picked').html(that.TypeToValue(curClass,content));

                    var pNode=$($('.picked').attr('pnode'));
                    var ex=pNode.attr('ex');
                    if(!!ex){
                        var exArr=ex.split('/');
                        var type=exArr[0];
                        var pValue=that.TypeFormula(type,exArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').blur();
                    that.FillTd();
                    that.FrameSelect();
                    that.KeyCursor();
                    that.HideTextArea();
                }
            });
            break;
        case 'keymove':
            $('#iTableInput').focus();
            break;
        default:

    }
};

ITable.prototype.IsExpress=function(val){
    var textVal=val;

    if(textVal.match(/^\=/g)||textVal.match(/^\+/g)||textVal.match(/^\-/g)){
        //    /(\=|\+|\-|\*|\/)([a-z]|[A-Z])+([1-9]*)/g
        this.table.find('td').off('dblclick');
        $(this.container).off('mousedown');
        var coordinates;
            this.table.find('td').off('click').on('click',{coordinate:coordinates},function(event){

                $('#iTableInput').focus();
                var typePosition=Number($('#iTableInput').iGetFieldPos());
                event.data.coordinate=IntToChr(Number($(this).attr('cols'))-2)+$(this).attr('rows');
                if(typePosition===$('#iTableInput').val().length){

                    if($('#iTableInput').val().slice(-1)==='+'||$('#iTableInput').val().slice(-1)==='-'||$('#iTableInput').val().slice(-1)==='*'||$('#iTableInput').val().slice(-1)==='/'){

                        $('#iTableInput').val($('#iTableInput').val()+event.data.coordinate);

                    }else{

                        var lastLength=String(_.last($('#iTableInput').val().split(/\=|\+|\-|\*|\//g))).length;
                        $('#iTableInput').iDelField(lastLength);
                        $('#iTableInput').iAddField(event.data.coordinate);

                    }
                }else{
                    if(($('#iTableInput').val()).charAt(typePosition+1).match(/\=|\+|\-|\*|\//g)){

                    }
                    // var v=$('#iTableInput').val();
                    // v=v.replace(getSelectionText(),event.data.coordinate);
                  //  $('#iTableInput').val(v);

                    $('#iTableInput').iAddField(event.data.coordinate);
                }


            });


    }else{
        this.FillTd();
        this.FrameSelect();
    }
};



ITable.prototype.KeyCursor = function () {

    var that = this;

    $(document).off('keydown').on('keydown', {

        time: "0",

        lastTd: null,

        fixX: "",

        fixY: "",

        keyCode: "",

        callZ: that

    }, typing);

};




function typing(event) {

    var sNode = $('.picked');

    var callZ = event.data.callZ;

    if ($('.picked').length === 1) {

        if (event.keyCode === 8 || event.keyCode === 18 || event.keyCode === 16 || event.keyCode === 9) {

            return;

        }

        callZ.SetTextArea(1);

        callZ.FillTextArea('keymove');


        var nowX = parseInt($(sNode).attr('cols'));

        var nowY = parseInt($(sNode).attr('rows'));

        var colAdd = parseInt($(sNode).attr('colspan')) - 1 || 0;

        var rowAdd = parseInt($(sNode).attr('rowspan')) - 1 || 0;


        event.data.time = Number(event.data.time) + 1;

        if (event.data.time === 1) {

            //获取第一次点击的单元格

            event.data.lastTd = sNode;

            event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

            event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

        }


        var tableInput=document.getElementById('iTableInput');
        //↓

        if (event.keyCode === 13 || event.keyCode === 40) {

            nowX += colAdd;

            nowY += rowAdd;

            if(event.target===tableInput){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){
                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }




            }


            if (event.data.lastTd!==sNode) {

                if (event.data.fixX !== nowX) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                        event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '39':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '37':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '38':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = event.data.fixX;

            var nextY = nowY + 1;

            var id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            } else {
                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                     var mStartX=Number(callZ.mergeTds[i].attr('cols')),mEndX=mStartX+Number(callZ.mergeTds[i].attr('colspan'));
                     var mStartY=Number(callZ.mergeTds[i].attr('rows')),mEndY=mStartY+Number(callZ.mergeTds[i].attr('rowspan'));
                     if(mStartX<=nextX&&mEndX>nextX&&mStartY<=nextY&&mEndY>nextY){
                         $(callZ.mergeTds[i]).addClass('picked');
                         callZ.SetBlueBorder($('.picked'));
                         callZ.SetTextArea(0);
                    }
                }
            }



            event.data.keyCode = event.keyCode;

            callZ.LightCooR($('.picked'));

        }

        //→

        if (event.keyCode === 39) {

            nowX += colAdd;

            nowY += rowAdd;

            if(event.target===tableInput){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){

                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }
            }

            if (event.data.lastTd!==sNode) {

                if (event.data.fixY !== nowY) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                        event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '13':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '40':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '37':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '38':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = nowX + 1;

            var nextY = event.data.fixY;

            var id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            }   else {
                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                    var mStartX=Number(callZ.mergeTds[i].attr('cols')),mEndX=mStartX+Number(callZ.mergeTds[i].attr('colspan'));
                    var mStartY=Number(callZ.mergeTds[i].attr('rows')),mEndY=mStartY+Number(callZ.mergeTds[i].attr('rowspan'));
                    if(mStartX<=nextX&&mEndX>nextX&&mStartY<=nextY&&mEndY>nextY){
                        $(callZ.mergeTds[i]).addClass('picked');
                        callZ.SetBlueBorder($('.picked'));
                        callZ.SetTextArea(0);
                    }
                }


            }

            event.data.keyCode = event.keyCode;

            callZ.LightCooR($('.picked'));

        }

        //←

        if (event.keyCode === 37) {

            var nowX=Number($('.picked').attr('cols'));

            if(event.target===tableInput){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){
                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }
            }

            if (event.data.lastTd!==sNode) {

                if (event.data.fixX !== nowX) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                        event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '13':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '40':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '38':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '39':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = nowX-1;

            var nextY = parseInt(event.data.fixY);

            var id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            } else {

                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                    var mStartX=Number(callZ.mergeTds[i].attr('cols')),mEndX=mStartX+Number(callZ.mergeTds[i].attr('colspan'));
                    var mStartY=Number(callZ.mergeTds[i].attr('rows')),mEndY=mStartY+Number(callZ.mergeTds[i].attr('rowspan'));
                    if(mStartX<nextX&&mEndX>=nextX&&mStartY<nextY&&mEndY>=nextY){
                        $(callZ.mergeTds[i]).addClass('picked');
                        callZ.SetBlueBorder($('.picked'));
                        callZ.SetTextArea(0);
                    }
                }

            }

            event.data.keyCode = event.keyCode;

            callZ.LightCooR($('.picked'));

        }

        //↑

        if (event.keyCode === 38) {

            var nowY=Number($('.picked').attr('rows'));

            if(event.target===tableInput){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){
                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }
            }


            if (event.data.lastTd!==sNode ) {

                if (event.data.fixX !== nowX) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                        event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '13':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '40':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '37':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

                case '39':

                    event.data.lastTd = sNode;

                    event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                    event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = event.data.fixX;

            var nextY = nowY - 1;

            var id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            } else {
                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                    var mStartX=Number(callZ.mergeTds[i].attr('cols')),mEndX=mStartX+Number(callZ.mergeTds[i].attr('colspan'));
                    var mStartY=Number(callZ.mergeTds[i].attr('rows')),mEndY=mStartY+Number(callZ.mergeTds[i].attr('rowspan'));
                    if(mStartX<=nextX&&mEndX>nextX&&mStartY<=nextY&&mEndY>nextY){
                        $(callZ.mergeTds[i]).addClass('picked');
                        callZ.SetBlueBorder($('.picked'));
                        callZ.SetTextArea(0);
                    }
                }

            }

            event.data.keyCode = event.keyCode;

            callZ.LightCooR($('.picked'));

        }



        if ($('.picked').length > 0) {

            var xCoo = Number($('.picked').attr('cols')) - 1,

                yCoo = Number($('.picked').attr('rows')) - 1;

            $('#disbox').text(IntToChr(xCoo) + String(yCoo + 1));

        }

    } else {

        return;

    }

};

ITable.prototype.SetCss = function () {

    var thatContainer = this.container;

    var viewWidth = $(window).width(),

        viewHeight = $(window).height();

    var tBody = this.table.parent(),

        tLeft = $('.yOrder'),

        tHead = $('.xOrder');

    var bTop = tHead.find('table tr:first td:first').outerHeight() + 1;

    tLeft.css({
        'height': viewHeight-153
    });

    tHead.css({
        'width': viewWidth
    });


    tBody.css({

        'margin-left': 4,

        'margin-top': bTop + 70,

        'width': viewWidth - 4,

        'height': viewHeight - bTop - 113,

        'overflow': 'scroll',

        'position': 'relative'

    });



    $(window).resize(function () {

        var viewWidth = $(window).width();

        var viewHeight = $(window).height();

        thatContainer.width(viewWidth - 4);

        thatContainer.height(viewHeight - bTop - 113);

        $('.yOrder').height(viewHeight - 153);

    });

};

//滚动

ITable.prototype.TableScroll = function () {
    this.container.on('scroll',function(){
        var scrollY = this.scrollTop;

        var scrollX = this.scrollLeft;

        $(".yOrder").find("table").css('margin-top', -scrollY);

        $(".xOrder").find("table").css('margin-left', -scrollX);

    });


};

//填写表格

ITable.prototype.FillTd = function (tid) {

    var tid = tid || 1;

    var that = this;

    this.table.find('td').each(function () {

       $(this).off('dblclick').on('dblclick',{target:that,id:tid},that.TdDbClick);

       $(this).off('click').on('click',{target:that},that.TdClick);

    });

};


ITable.prototype.TdClick=function(event){

    if($('#iTableInputHolder').css('display')==='block'){

        $('.picked').text($('#iTableInput').val());

        $('#iTableInputHolder').hide();

        $('#iTableInput').blur();
    }

    $('.picked').removeClass('picked');

    $(this).addClass('picked');

     event.data.target.SetBlueBorder($(this));

    var xCoo = Number($(this).attr('cols')) - 1,

        yCoo = Number($(this).attr('rows')) - 1;

    if ($('#disbox').length > 0) {

        $('#disbox').text(IntToChr(xCoo) + String(yCoo + 1));

    }


    event.data.target.TdToFx($(this));
    event.data.target.LightCooR($(this));
    $('#ip_fx').blur();
};


ITable.prototype.TdDbClick=function(event){
    var tdText = $(this).text();
    var eType='dblclick';
    var ex=$(this).attr('ex');
    event.data.target.SetTextArea(1);
    if(!!ex){
        event.data.target.fillExTextArea(eType,tdText,ex);
    }else{
        event.data.target.FillTextArea(eType,tdText);

    }

    $("#iTableInput").click(function () {
        return false;
    });

    $('#iTable' + event.data.id).find('tr').find('td').not($(this)).click(function () {
        $('#iTableInput').blur();
    });
    stopPropagation();
};


ITable.prototype.BlueBorder=function(){
    var wBorder = $('<div class="wBorder" id="wBorder"></div>');
    wBorder.css({
        'top': 0,
        'left': 0

    });

    var topB = $('<div></div>');

    topB.css({
        'height': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });
    wBorder.append(topB);

    var leftB = $('<div></div>');

    leftB.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });

    wBorder.append(leftB);

    var rightB = $('<div></div>');

    rightB.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });

    wBorder.append(rightB);

    var bottomB = $('<div></div>');

    bottomB.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });

    var corner = $('<div class="scorner" id="scorner"></div>');

    //红色

    var wrBorder = $('<div class="wrBorder"></div>');

    wrBorder.css({

        'top': 0,

        'left': 0,

        'display':'none'

    });

    var topRB = $('<div></div>');

    topRB.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(topRB);

    var leftRB = $('<div></div>');

    leftRB.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(leftRB);

    var rightRB = $('<div></div>');

    rightRB.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(rightRB);

    var bottomRB = $('<div></div>');

    bottomRB.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(bottomRB);

    wBorder.append(bottomB);

    wBorder.append(corner);

    this.container.append(wBorder);

    this.container.append(wrBorder);


};


ITable.prototype.SetRedBorder=function(obj){
    if($(obj).length>0){
        var topArr = [], leftArr = [];

        var topMin, leftMin, totalWidth = 0, totalHeight = 0;

        for (var i = 0; i < obj.length; i++) {

            var top = Number(obj[i].offsetTop),

                left = Number(obj[i].offsetLeft),

                width = Number(obj[i].offsetWidth),

                height = Number(obj[i].offsetHeight);

            if (top < _.min(topArr)) {

                if ($('.wrBorder').length > 0) {

                    $('.wrBorder').hide();

                }

            }

            if (left < _.min(leftArr)) {

                if ($('.wrBorder').length > 0) {

                    $('.wrBorder').hide();

                }

            }

            topArr.push(top);

            leftArr.push(left);

            topMin = _.min(topArr), leftMin = _.min(leftArr);

            if (top === _.min(topArr)) {

                totalWidth += width;

            }

            if (left === _.min(leftArr)) {

                totalHeight += height;

            }


            $('.wrBorder').css({

                'top': topMin,

                'left': leftMin,

                'display': 'block'
            });

            $('.wrBorder').find('div').eq(0).css({

                'width': totalWidth,

                'height': '2px',

                'left': 0,

                'top': 0

            });

            $('.wrBorder').find('div').eq(1).css({
                'width': totalWidth,

                'height': '2px',

                'left': 0,

                'top': totalHeight
            });

            $('.wrBorder').find('div').eq(2).css({

                'width': '2px',

                'height': totalHeight,

                'left': 0,

                'top': 0

            });

            $('.wrBorder').find('div').eq(3).css({
                'width': '2px',

                'height': totalHeight,

                'left': totalWidth,

                'top': 0

            });

        }


    }else{

    }
};


ITable.prototype.HideReadBorder=function(){
    $('.wrBorder').hide();
};

ITable.prototype.SetBlueBorder=function(obj){

       if($(obj).length>0){
           var topArr = [], leftArr = [];

           var topMin, leftMin, totalWidth = 0, totalHeight = 0;

           for (var i = 0; i < obj.length; i++) {

               var top = Number(obj[i].offsetTop),

                   left = Number(obj[i].offsetLeft),

                   width = Number(obj[i].offsetWidth),

                   height = Number(obj[i].offsetHeight);

               if (top < _.min(topArr)) {

                   if ($('.wBorder').length > 0) {

                       $('.wBorder').hide();

                   }

               }

               if (left < _.min(leftArr)) {

                   if ($('.wBorder').length > 0) {

                       $('.wBorder').hide();

                   }

               }

               topArr.push(top);

               leftArr.push(left);

             //  var col = parseInt($(obj[i]).attr('cols')) + parseInt($(obj[i]).attr('colspan'));

               topMin = _.min(topArr), leftMin = _.min(leftArr);

               if (top === _.min(topArr)) {

                   totalWidth += width;

               }

               if (left === _.min(leftArr)) {

                   totalHeight += height;

               }


               $('.wBorder').css({

                   'top': topMin,

                   'left': leftMin,

                   'display': 'block'
               });

               $('.wBorder').find('div').eq(0).css({

                   'width': totalWidth,

                   'height': '2px',

                   'left': 0,

                   'top': 0

               });

               $('.wBorder').find('div').eq(1).css({
                   'width': totalWidth,

                   'height': '2px',

                   'left': 0,

                   'top': totalHeight
               });

               $('.wBorder').find('div').eq(2).css({

                   'width': '2px',

                   'height': totalHeight,

                   'left': 0,

                   'top': 0

               });

               $('.wBorder').find('div').eq(3).css({
                   'width': '2px',

                   'height': totalHeight,

                   'left': totalWidth,

                   'top': 0

               });

               $('.scorner').css({

                   'top':  totalHeight - 2,

                   'left': totalWidth - 2

               });

           }


       }else{

       }

};

ITable.prototype.CornerCopy=function(){
    var that=this;

    $('.scorner').on('mouseenter',function(){

        $(this).css('cursor', 'crosshair');

        $(this).on('mousedown', function () {
            $(that.container).off('mousedown');

            var ev = window.event || arguments[0];

            var coords=$('.picked');

            var copyVal=$(coords).html();

            var tdWidth=parseInt($(coords).width());

            var tdHeight=parseInt($(coords).height());

            var onCols = parseInt($(coords).attr('cols')) ;

            var onRows = parseInt($(coords).attr('rows')) ;

            var onCSpan = parseInt($(coords).attr('colspan'))  || 1;

            var onRSpan = parseInt($(coords).attr('rowspan'))  || 1;



            var oExpectX = onCols + onCSpan-1;

            var oExpectY = onRows + onRSpan-1;

            var xMin = oExpectX,yMin = oExpectY;

            var sLeft = parseInt(this.scrollLeft);

            var sTop = parseInt(this.scrollTop);

            var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());

            var oX = ev.clientX + sLeft;

            var oY = ev.clientY - disHeight + sTop;

            if($(coords).length>1){
                that.HideReadBorder();
                return;
            }


            $(that.container).on('mousemove', function () {
                var coords=$(that.moveLast);

                var nCols = parseInt($(coords).attr('cols')) ;

                var nRows = parseInt($(coords).attr('rows')) ;

                var nCSpan = parseInt($(coords).attr('colspan'))  || 1;

                var nRSpan = parseInt($(coords).attr('rowspan'))  || 1;

                if(nCSpan>1||nRSpan>1){
                    that.HideReadBorder();
                    return;
                }

                var expectX = nCols + nCSpan-1;

                var expectY = nRows + nRSpan-1;

                var xMax=expectX,yMax=expectY;

                var evt = window.event || arguments[0];
                var _x,_y;

                _x = (evt.x || evt.clientX);

                _y = (evt.y || evt.clientY);

                _x = _x + sLeft;

                _y = _y + sTop - disHeight;


                if(_x-oX>=0){

                    if(_y<=oY&&_y>=oY-tdHeight){
                         //E
                        yMax=yMin;

                    }

                    if(_y<oY&&_y<oY-tdHeight){
                        //E-N
                        yMax=yMin;
                    }

                    if(_y>oY){
                        //E-S
                        yMax=yMin;
                    }

                }else{
                    if(_y<=oY&&_y>=oY-tdHeight&&_x+tdWidth<oX){
                        //W
                        yMax=yMin;
                    }
                    if(_y<oY&&_y<oY-tdHeight&&_x+tdWidth<oX){
                        //W-N
                        yMax=yMin;
                    }
                    if(_y>oY&&_x+tdWidth<oX){
                        //W-S
                        yMax=yMin;
                    }
                    if(_y<oY&&_y<oY-tdHeight&&_x+tdWidth>oX){
                        //N
                        xMax=xMin;
                    }
                    if(_y>oY&&_x+tdWidth>=oX){
                        //S
                        xMax=xMin;
                    }

                }



                that.table.find('td').removeClass('picked');

                if(xMin<=xMax&&yMin<=yMax){
                    for(var i = xMin; i <= xMax ; i++) {
                        for(var j = yMin; j <= yMax; j++) {
                            var id='#'+j+'-'+i;
                            $(id).addClass('picked');

                        }

                    }
                }else if(xMin<=xMax&&yMin>yMax){
                    for(var i = xMin; i <= xMax ; i++) {
                        for(var j = yMax; j <= yMin; j++) {
                            var id='#'+j+'-'+i;
                            $(id).addClass('picked');

                        }

                    }
                }else if(xMin>xMax&&yMin<yMax){
                    for(var i = xMax; i <= xMin ; i++) {
                        for(var j = yMin; j <= yMax; j++) {
                            var id='#'+j+'-'+i;

                            $(id).addClass('picked');

                        }

                    }
                }else{
                    for(var i = xMax; i <= xMin ; i++) {
                        for(var j = yMax; j <= yMin; j++) {
                            var id='#'+j+'-'+i;

                            $(id).addClass('picked');

                        }

                    }

                }
                that.SetRedBorder($('.picked'));



            });
            $(document).off('mouseup').on('mouseup',function(){
                that.HideReadBorder();
                $('.picked').text(copyVal);
                $(this).off('mouseup');
                $(that.container).off('mousedown');
                $(that.container).off('mousemove');
                that.FrameSelect();
            });


        });
    });
};


ITable.prototype.ChooseRow=function(){
    var that=this;
    $('#leftTable').find('td').on('click',function(){
        var index=$(this).parent().index()+1;

       // var startYArr=[],endYArr=[];
        $('.picked').removeClass('picked');

        if(that.mergeTds.length>=1){

            // for(var j=0;j<that.mergeTds.length;j++){
            //
            //     var tdStartRow=Number($(that.mergeTds[j]).attr('rows'));
            //     var tdEndRow=Number($(that.mergeTds[j]).attr('rows'))+Number($(that.mergeTds[j]).attr('rowspan'));
            //
            //
            //     if(tdStartRow<=index&&tdEndRow>=index){
            //         startYArr.push(tdStartRow);
            //         endYArr.push(tdEndRow);
            //     }
            //
            // }
            // var minY=_.min(startYArr),maxY=_.max(endYArr);
            // for(var n=minY;n<maxY;n++){
            //     for(var m=0;m<that.cellCount;m++){
            //         var id='#'+n+'-'+m;
            //         $(id).addClass('picked');
            //     }
            //
            // }

        }else{
            // for(var i=0;i<that.cellCount;i++){
            //     var id='#'+index+'-'+i;
            //     $(id).addClass('picked');
            //
            // }
        }
        for(var i=0,len=that.cellCount;i<=len;i++){
            var id='#'+index+'-'+i;
            if(Number($(id).attr('rowspan'))>=2&&Number($(id).attr('colspan'))>=2){

            }else{
                $(id).addClass('picked');
            }

        }

        that.LightCooR($('.picked'));

    });
};

ITable.prototype.ChooseCol=function(){
    var that=this;
    $('#titleTable').find('td').on('click',function(){
        var index=Number($(this).index())+1;
       // var startXArr=[],endXArr=[];

        $('.picked').removeClass('picked');

        if(that.mergeTds.length>=1){

            // for(var j=0;j<that.mergeTds.length;j++){
            //
            //     var tdStartCol=Number($(that.mergeTds[j]).attr('cols'));
            //     var tdEndCol=Number($(that.mergeTds[j]).attr('cols'))+Number($(that.mergeTds[j]).attr('colspan'));
            //
            //     if(tdStartCol<=index&&tdEndCol>=index){
            //         startXArr.push(tdStartCol);
            //         endXArr.push(tdEndCol);
            //     }
            //
            // }
            // var minX=_.min(startXArr),maxX=_.max(endXArr);
            //
            // for(var m=0;m<that.rowCount;m++){
            //     for(var n=minX;n<maxX;n++){
            //         var id='#'+m+'-'+n;
            //
            //         $(id).addClass('picked');
            //     }
            //
            // }
        }else{
            // for(var l=0;l<that.rowCount;l++){
            //     var id='#'+l+'-'+index;
            //     $(id).addClass('picked');
            // }
        }
        for(var l=0,len=that.rowCount;l<=len;l++){
            var id='#'+l+'-'+index;
            if(Number($(id).attr('rowspan'))>=2&&Number($(id).attr('colspan'))>=2){

            }else{
                $(id).addClass('picked');
            }

        }
        that.LightCooR($('.picked'));

    });
};


ITable.prototype.GetTdStyle=function(obj){
    var td=$(obj);
    if(td.length===1&&td.length>0){
        var classArr=(td.attr('class')).split(' ');
        var len=classArr.length;
        for(var i=0;i<len;i++){
            if(!!classArr[i].match(/(((fsize_)[A-Za-z0-9_]+s*)+)/g)) {
                switch (classArr[i]) {
                    case 'fsize_10':
                        $('#fontSize').text('10');
                        break;
                    case 'fsize_12':
                        $('#fontSize').text('12');
                        break;
                    case 'fsize_14':
                        $('#fontSize').text('14');
                        break;
                    case 'fsize_16':
                        $('#fontSize').text('16');
                        break;
                    case 'fsize_18':
                        $('#fontSize').text('18');
                        break;
                    case 'fsize_20':
                        $('#fontSize').text('20');
                        break;

                }

            }else if(!!classArr[i].match(/(((font_)[A-Za-z0-9_]+s*)+)/g)) {
                switch (classArr[i]) {
                    case 'font_Song':
                        $('#fontFamily').text('宋体');
                        break;
                    case 'font_Black':
                        $('#fontFamily').text('黑体');
                        break;
                    case 'font_Kai':
                        $('#fontFamily').text('楷体');
                        break;
                    case 'font_Mirco':
                        $('#fontFamily').text('微软雅黑');
                        break;

                }

            }else if(!!classArr[i].match(/(((ft)[A-Za-z0-9_]+\s*)+)/g)) {
                switch (classArr[i]) {
                    case 'ftNormal':
                        $('#fillType').text('常规');
                        break;
                    case 'ftNumber':
                        $('#fillType').text('数字');
                        break;
                    case 'ftDate':
                        $('#fillType').text('日期');
                        break;
                    case 'ftAccount':
                        $('#fillType').text('会计专用');
                        break;
                    case 'ftPercent':
                        $('#fillType').text('百分比');
                        break;

                }

            }else if(!!classArr[i].match(/picked/g)){
                return;
            }else{
                $('#fontFamily').text('黑体');
                $('#fontSize').text('10');
                $('#fillType').text('常规');
            }

        }
    }else{
        return;
    }

};

ITable.prototype.LightCooR = function (obj) {

    var target = obj;

    this.GetTdStyle(obj);

    $('#leftTable').find('tr').find('td').removeClass('lCoo');

    $('#titleTable').find('tr').find('td').removeClass('lCoo');

    for (var t = 0; t < target.length; t++) {

        var cols = parseInt($(target).eq(t).attr('cols')) - 1;

        var rows = parseInt($(target).eq(t).attr('rows')) - 1;

        var cSpan = parseInt($(target).eq(t).attr('colspan')) - 1 || 0;

        var rSpan = parseInt($(target).eq(t).attr('rowspan')) - 1 || 0;

        for (var i = rows,iLen=rows+rSpan+1; i < iLen; i++) {

            $('#leftTable').find('tr').eq(i).find('td').addClass('lCoo');

        }

        for (var j = cols,jLen=cols + cSpan + 1; j < jLen; j++) {

            $('#titleTable').find('tr').find('td').eq(j - 1).addClass('lCoo');

        }

    }

};


ITable.prototype.ListenHeight=function(){
    var len=this.rowCount;
    for(var j=0;j<len;j++){
        var height=this.table.find('tr').eq(j).find('th').height()-1;
        $('#leftTable').find('tr').eq(j).find('td').height(height);
    }

};

//创建底部容器

ITable.prototype.CreateFooter = function () {

    this.footer = $('<div class="footer"></div>');

    this.container.after(this.footer);

    var addBox = $('<div class="addBox"><div class="addSheet"></div></div>');

    this.footer.append(addBox);

    var sheetQueue = $('<div class="sheetQueue"><div><dl class="sheetQueueDl"><dd class="sheet sheetDefault" id="sheet1">1</dd></dl></div></div>');

    this.footer.append(sheetQueue);

    var sheetFloat = $('<div class="sheetFloat"><span class="lSheet"></span><span class="rSheet"></span></div>');

    this.footer.append(sheetFloat);

    this.SheetWork();

};

//创建头部容器

ITable.prototype.CreateHeader = function () {

    this.header = $('<div class="header"></div>');

    this.tools = $('<div class="tools"></div>');

    this.header.append(this.tools);

    this.header.insertBefore(this.container);

};

//字体类型

ITable.prototype.FontFamily = function () {

    var menu = this.CreateSelection('fontFamily', this.settings.fontFamily);

    var sel_a = $(menu).find('ul li a');

    $(menu).find('#fontFamily').attr('defaultClass', sel_a.eq(0).attr('class'));

    var className, curClass;

    var selThem;

    sel_a.on('click', function () {

        className = $(this).attr('class');

        $('.picked').addClass(className);

        var reg = new RegExp("(((font_)[A-Za-z0-9_]+\s*)+)", "g");

        curClass = $('.picked').attr('class');

        if (!!curClass) {

            curClass = curClass.replace(reg, className);

        } else {

            return;

        }

        curClass = _.uniq(curClass.split(' ')).join(' ');

        selThem = $('.picked');

        $('.picked').removeAttr('class');

        selThem.addClass(curClass);

    });

    sel_a.on('mouseover',function(){
        $(this).css({
            'background': '#ECECEC'
        });
    });

    sel_a.on('mouseout',function(){
        $(this).css({
            'background': '#FFFFFF'
        });
    });

};

//字体大小

ITable.prototype.FontSize = function () {

    var menu = this.CreateSelection('fontSize', this.settings.fontSize);

    var sel_a = $(menu).find('ul li a');

    $(menu).find('#fontFamily').attr('defaultClass', sel_a.eq(0).attr('class'));

    var className, curClass;

    var selThem;

    var that=this;

    sel_a.on('click', function () {

        className = $(this).attr('class');

        $('.picked').addClass(className);

        var reg = new RegExp("(((fsize_)[A-Za-z0-9_]+\s*)+)", "g");

        curClass = $('.picked').attr('class');

        if (!!curClass) {

            curClass = curClass.replace(reg, className);

        } else {

            return;

        }

        curClass = _.uniq(curClass.split(' ')).join(' ');

        selThem = $('.picked');

        $('.picked').removeAttr('class');

        selThem.addClass(curClass);

        that.ListenHeight();

    });

    sel_a.on('mouseover',function(){
        $(this).css({
            'background': '#ECECEC'
        });
    });

    sel_a.on('mouseout',function(){
        $(this).css({
            'background': '#FFFFFF'
        });
    });

};

//字体粗细

ITable.prototype.FontBold = function () {

    var simMenu = this.CreateSimpleMenu('fbold');

    var sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffbold') ? $('.picked').removeClass('ffbold') : $('.picked').addClass('ffbold');

    });

};

//字体倾斜

ITable.prototype.FontItalic = function () {

    var simMenu = this.CreateSimpleMenu('fitalic');

    var sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffitalic') ? $('.picked').removeClass('ffitalic') : $('.picked').addClass('ffitalic');

    });

};

//字体下划线

ITable.prototype.FontOverLine = function () {

    var simMenu = this.CreateSimpleMenu('foverline');

    var sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffoverline') ? $('.picked').removeClass('ffoverline') : $('.picked').addClass('ffoverline');

    });

};

//字体颜色

ITable.prototype.FontColor = function () {

    var select = this.CreateCellMenu('d_fcolor', 'fontColor', this.settings.fontColor);

    var td = $(select).find('td');

    var className, curClass;

    var selThem;

    td.on('click', function () {

        className = $(this).find('a').attr('class');

        $('.picked').addClass(className);

        var reg = new RegExp("(((fc_)[A-Za-z0-9_]+\s*)+)", "g");

        curClass = $('.picked').attr('class');

        if (!!curClass) {

            curClass = curClass.replace(reg, className);

        } else {

            return;

        }

        curClass = _.uniq(curClass.split(' ')).join(' ');

        selThem = $('.picked');

        $('.picked').removeAttr('class');

        selThem.addClass(curClass);

    });

};

//表格背景

ITable.prototype.BgColor = function () {

    var select = this.CreateCellMenu('d_fill', 'bgColor', this.settings.bgColor);

    var td = $(select).find('td');

    var className, curClass;

    var selThem;

    td.on('click', function () {

        className = $(this).attr('class');

        $('.picked').addClass(className);

        var reg = new RegExp("(((ffill_)[A-Za-z0-9_]+\s*)+)", "g");

        curClass = $('.picked').attr('class');

        if (!!curClass) {

            curClass = curClass.replace(reg, className);

        } else {

            return;

        }

        curClass = _.uniq(curClass.split(' ')).join(' ');

        selThem = $('.picked');

        $('.picked').removeAttr('class');

        selThem.addClass(curClass);

    });

};

//字符对齐

ITable.prototype.TextAlign = function () {

    var select = this.CreateCellMenu('f_align', 'textAlign', this.settings.textAlign);

    var td  = $(select).find('td');

    var className, curClass;

    var selThem;

    td.css({
        'background': '#FFFFFF'
    });

    td.on('click', function () {

        className = $(this).attr('class');

        $('.picked').addClass(className);

        var reg = new RegExp("(((falign_)[A-Za-z0-9_]+\s*)+)", "g");

        curClass = $('.picked').attr('class');

        if (!!curClass) {

            curClass = curClass.replace(reg, className);

        } else {

            return;

        }

        curClass = _.uniq(curClass.split(' ')).join(' ');

        selThem = $('.picked');

        $('.picked').removeAttr('class');

        selThem.addClass(curClass);

    });

    td.on('mouseover',function(){
        $(this).css({
            'background': '#ECECEC'
        });
    });

    td.on('mouseout',function(){
        $(this).css({
            'background': '#FFFFFF'
        });
    });


};

//公式选择

ITable.prototype.Express = function () {

    var select = this.CreateSelection('express', this.settings.express);

    var sel_a = $(select).find('ul li a');

    var that = this;

    sel_a.on('click', function () {

        var ways = $(this).attr('class').replace('fx_', '');

        that.Formula(ways);

    });

};

ITable.prototype.FillType = function(){
    var select = this.CreateSelection('fillType', this.settings.fillType);
    var sel_a = $(select).find('ul li a');

    var that = this;

    sel_a.on('click', function () {

        var ways = $(this).attr('class').replace('ft_', '');

        that.SetFillType(ways);

    });
};

ITable.prototype.GetFillType=function(obj){

        if($(obj).hasClass('ftNormal')){

            if(isNaN(Number($(obj).text()))){
                return $(obj).text();
            }else{
                return Number($(obj).text());
            }


        }else if($(obj).hasClass('ftNumber')){

            return Number($(obj).text());

        }else if($(obj).hasClass('ftDate')){

            return;

        }else if($(obj).hasClass('ftAccount')){

            return $(obj).text().replace('¥','');

        }else if($(obj).hasClass('ftPercent')){

            return  Number($(obj).text().replace('%','')*100);

        }else if($(obj).hasClass('ftText')){
            return;
        }else{
            return Number($(obj).text());
        }
};

ITable.prototype.SetFillType=function(ways){
    switch (ways){
        case 'normal':
            this.FtNormal();
            break;
        case 'number':
            this.FtNumber();
            break;
        case 'date':
            this.FtDate();
            break;
        case 'account':
            this.FtAccount();
            break;
        case 'percent':
            this.FtPercent();
            break;
        case 'text':
            this.FtText();
            break;
        default:
            break;

    }
};

ITable.prototype.TypeToValue=function(type,value){
         var objValue=value,value=Number(value);
         var newClasses=type.split(' ');
         for(var i=0,len=newClasses.length;i<len;i++){
             if(!!newClasses[i].match(/(((ft)[A-Za-z0-9_]+\s*)+)/g)){
            var newClass=newClasses[i];
            }
         }
         var newValue;
        switch(newClass){
            case 'ftNormal':
                 newValue=objValue;
                 return newValue;

            case 'ftNumber':
                 newValue=value.toFixed(2);
                 return newValue;

            case 'ftAccount':
                 newValue= '¥'+ value.toFixed(2);
                 return newValue;

            case  'ftPercent':
                 newValue= (Math.round(Number(value) * 10000)/100).toFixed(2) + '%';
                 return newValue;

        }


};

ITable.prototype.FtNormal=function(){
    var that=this;
      if($('.picked').length>0){
          $('.picked').each(function(){
              var className, curClass;
              var selThem;
              if(!$(this).hasClass('ftNormal')){

                  className = 'ftNormal';

                  $(this).addClass(className);

                  var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                  curClass = $(this).attr('class');

                  if (!!curClass) {

                      curClass = curClass.replace(reg, className);

                  } else {
                      return;
                  }

                  curClass = _.uniq(curClass.split(' ')).join(' ');

                  selThem = $(this);

                  $(this).removeAttr('class');

                  var oldVal=selThem.text();

                  var newVal=that.TypeToValue(curClass,oldVal);

                  selThem.text(newVal);

                  selThem.addClass(curClass);

              }

          });

      }
};

ITable.prototype.FtNumber=function(){
    var that=this;
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass;

            var selThem;

            if(!$(this).hasClass('ftNumber')){
                className = 'ftNumber';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!!curClass) {

                    curClass = curClass.replace(reg, className);

                } else {
                    return;
                }

                curClass = _.uniq(curClass.split(' ')).join(' ');

                selThem = $(this);

                $(this).removeAttr('class');

                var oldVal=selThem.text();

                var newVal=that.TypeToValue(curClass,oldVal);

                selThem.text(newVal);

                selThem.addClass(curClass);


            }

        });

    }
};

ITable.prototype.FtDate=function(){
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass;

            var selThem;
            if(!$(this).hasClass('ftDate')){
                className = 'ftDate';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!!curClass) {
                    curClass = curClass.replace(reg, className);
                } else {
                    return;
                }

                curClass = _.uniq(curClass.split(' ')).join(' ');

                selThem = $(this);

                $(this).removeAttr('class');

                selThem.addClass(curClass);

                var date=new Date();
                var year=date.getFullYear(),month=date.getMonth()+1,day=date.getDate();
                var time=year+'/'+month+'/'+day;
                $(this).text(time);


            }

        });

    }
};

ITable.prototype.FtAccount=function(){
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass;

            var selThem;
            if(!$(this).hasClass('ftAccount')){
                className = 'ftAccount';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!!curClass) {

                    curClass = curClass.replace(reg, className);

                } else {

                    return;

                }

                curClass = _.uniq(curClass.split(' ')).join(' ');

                selThem = $(this);

                $(this).removeAttr('class');

                selThem.addClass(curClass);

                var prefix='¥';
                $(this).text(prefix);

            }

        });

    }
};

ITable.prototype.FtPercent=function(){
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass;

            var selThem;
            if(!$(this).hasClass('ftPercent')){
                className = 'ftPercent';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!!curClass) {

                    curClass = curClass.replace(reg, className);

                } else {

                    return;

                }

                curClass = _.uniq(curClass.split(' ')).join(' ');

                selThem = $(this);

                $(this).removeAttr('class');

                selThem.addClass(curClass);

                var newVal=(Math.round(Number($(this).text()) * 10000)/100).toFixed(2) + '%'
                $(this).text(newVal);

            }

        });

    }
};

ITable.prototype.FtText=function(){
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass;

            var selThem;
            if(!$(this).hasClass('ftText')){
                className = 'ftText';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!!curClass) {

                    curClass = curClass.replace(reg, className);

                } else {

                    return;

                }

                curClass = _.uniq(curClass.split(' ')).join(' ');

                selThem = $(this);

                $(this).removeAttr('class');

                selThem.addClass(curClass);

            }

        });

    }
};

//列插入

ITable.prototype.InsertCol = function () {

    var simMenu = this.CreateSimpleMenu('editRowCol insertCol', '');

    var sel_a = simMenu.children(0);

    var that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked');

        var xArr = [], yArr = [];

        var xMax, xMin, yMax, yMin;

        if (sNode.length >= 2) {

            for (var i = 0; i < sNode.length; i++) {

                var cols = parseInt(sNode.eq(i).attr('cols'));

                var rows = parseInt(sNode.eq(i).attr('rows'));

                var cAdd = parseInt(sNode.eq(i).attr('colspan')) || 1;

                var rAdd = parseInt(sNode.eq(i).attr('rowspan')) || 1;

                cols = cols + cAdd - 1;

                rows = rows + rAdd - 1;

                xArr.push(cols);

                yArr.push(rows);

                xMax = _.max(xArr), xMin = _.min(xArr), yMax = _.max(yArr), yMin = _.min(yArr);
            }
            //
            // for (var _y = 0; _y < that.rowCount + 1; _y++) {
            //
            //     var time = 0;
            //
            //     for (var _x = xMin; _x < xMax + 1; _x++) {
            //
            //         var index = xMin;
            //
            //         if ($('#' + _y + '-' + xMin ).length > 0) {
            //
            //             $('#' + _y + '-' + xMin ).before('<td style="background:orange"></td>');
            //
            //         } else {
            //
            //             while (index > -1) {
            //
            //                 if ($('#' + _y + '-' + index).length > 0) {
            //
            //                     time++;
            //
            //                     if (time === 1) {
            //                         $('#' + _y + '-' + index).after('<td style="background:orange"></td>');
            //                     }
            //
            //                 }
            //
            //                 index--;
            //
            //             }
            //
            //         }
            //
            //     }
            //
            // }
            //
            // that.cellCount = that.cellCount + xMax - xMin + 1;
            //
            // that.updateTop(index,'add');

        } else {

            var xIndex = parseInt(sNode.attr('cols'));

            var col = $('<col style="width:100px">');

            for (var i = 1; i < that.rowCount + 1;) {
                if ($('#' + i + '-' + xIndex).length > 0) {
                    var cSpan = Number($('#' + i + '-' + xIndex).attr('colspan'));
                    var rSpan = Number($('#' + i + '-' + xIndex).attr('rowspan'));
                    if (cSpan >= 2) {
                        $('#' + i + '-' + xIndex).attr('colspan', cSpan + 1);
                        that.table.find('col').eq(xIndex).after(col);
                        i+=rSpan;
                    } else {
                        $('#' + i + '-' + xIndex).after('<td style="background:orange"></td>');
                        that.table.find('col').eq(xIndex).after(col);
                        i++;
                    }
                } else {

                    for (var j = 0; j <= that.mergeTds.length; j++) {
                        var mStartX = Number($(that.mergeTds).eq(j).attr('cols'));
                        var mStartY = Number($(that.mergeTds).eq(j).attr('rows'));
                        var mCSpan = Number($(that.mergeTds).eq(j).attr('colspan'));
                        var mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan'));
                        var mEndX = mStartX + mCSpan;


                        if (mStartX <= xIndex && mEndX >= xIndex && mStartY === i) {
                             $(that.mergeTds).eq(j).attr('colspan',mCSpan+1);
                            that.table.find('col').eq(xIndex).after(col);
                             i += mRSpan;
                        }
                    }

                }

            }

            that.cellCount++;

            that.UpdateTop(xIndex,'add');

        }

        that.SetIndex();

        that.FillTd();

        that.KeyCursor();


    });

};

//行插入

ITable.prototype.InsertRow = function () {

    var simMenu = this.CreateSimpleMenu('editRowCol insertRow', '');

    var sel_a = simMenu.children(0);

    var that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked');

        var xArr = [],

            yArr = [];

        var xMax, xMin, yMax, yMin;

        if (sNode.length >= 2) {

            for (var i = 0; i < sNode.length; i++) {

                var cols = parseInt(sNode.eq(i).attr('cols'));

                var rows = parseInt(sNode.eq(i).attr('rows'));

                var cAdd = parseInt(sNode.eq(i).attr('colspan')) || 1;

                var rAdd = parseInt(sNode.eq(i).attr('rowspan')) || 1;

                cols = cols + cAdd - 1;

                rows = rows + rAdd - 1;

                xArr.push(cols);

                yArr.push(rows);

                xMax = _.max(xArr), xMin = _.min(xArr), yMax = _.max(yArr), yMin = _.min(yArr);

            }
            //
            // for (var _y = yMin; _y < yMax + 1; _y++) {
            //
            //     var tr = $('<tr></tr>');
            //
            //     for (var _x = 0; _x < that.cellCount + 1; _x++) {
            //
            //         var th = $('<th></th>');
            //
            //         //if ($('td[cols=' + _x + '][rows=' + yMin + ']').length > 0) {
            //         if ($('#' + yMin + '-' + _x ).length > 0) {
            //
            //             if (_x === 0) {
            //
            //                 tr.append(th);
            //
            //             }
            //
            //             tr.append('<td style="background:orange"></td>');
            //
            //          //   $('td[cols=' + _x + '][rows=' + yMin + ']').parent().before(tr);
            //
            //             $('#' + yMin  + '-' + _x).parent().before(tr);
            //
            //         } else {
            //
            //             //$('td[cols=' + (_x - 1) + '][rows=' + yMin + ']').parent().after(tr);
            //
            //             $('#' + yMin + '-' + _x - 1 ).parent().before(tr);
            //
            //         }
            //
            //     }
            //
            // }

        } else {

            var yIndex = parseInt(sNode.attr('rows'));
            var tr = $('<tr></tr>');

            for (var i = 0; i <= that.cellCount;) {

                 if(i===0){
                     var th = $('<th></th>');
                     tr.append(th);
                     i++;
                 }else{
                     if ($('#' + yIndex + '-' + i).length > 0) {
                         var cSpan = Number($('#' + yIndex + '-' + i).attr('colspan'));
                         var rSpan = Number($('#' + yIndex + '-' + i).attr('rowspan'));
                         if (rSpan >= 2) {
                             $('#' + yIndex + '-' + i).attr('rowspan', rSpan + 1);
                             i+=cSpan;
                         } else {
                             tr.append('<td style="background:orange"></td>');
                             $('#' + yIndex + '-' + i).parent().after(tr);
                             i++;
                         }
                     }else{
                         for (var j = 0; j <= that.mergeTds.length; j++) {
                             var mStartX = Number($(that.mergeTds).eq(j).attr('cols'));
                             var mStartY = Number($(that.mergeTds).eq(j).attr('rows'));
                             var mCSpan = Number($(that.mergeTds).eq(j).attr('colspan'));
                             var mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan'));

                             var mEndY = mStartY + mRSpan;

                             if (mStartY <= yIndex && mEndY >= yIndex && mStartX === i) {
                                 $(that.mergeTds).eq(j).attr('rowspan',mRSpan+1);
                                 i += mCSpan;
                             }
                         }


                     }
                 }

            }
            that.rowCount++;

            that.UpdateLeft(yIndex,'add');

        }

        that.SetIndex();

        that.FillTd();

        that.KeyCursor();



    });

};

//列删除

ITable.prototype.DeleteCol = function () {

    var simMenu = this.CreateSimpleMenu('editRowCol delCol', '');

    var sel_a = simMenu.children(0);

    var that = this;

    sel_a.on('click', function () {

        var xArr = [],

            yArr = [];

        var xMax, xMin, yMax, yMin;

        var sNode = $('.picked');

        if (sNode.length >= 2) {


        } else {


            var xIndex = parseInt(sNode.attr('cols'));

            for (var i = 1; i < that.rowCount + 1;) {
                if ($('#' + i + '-' + xIndex).length > 0) {
                    var cSpan = Number($('#' + i + '-' + xIndex).attr('colspan'));
                    var rSpan = Number($('#' + i + '-' + xIndex).attr('rowspan'));
                    if (cSpan >= 2) {
                        $('#' + i + '-' + xIndex).attr('colspan', cSpan - 1);
                        $('#' + 't' + xIndex).remove();
                        i+=rSpan;
                    } else {
                        console.log(i,xIndex);
                        $('#' + i + '-' + xIndex).remove();
                        $('#' + 't' + xIndex).remove();
                        i++;
                    }
                } else {

                    for (var j = 0; j <= that.mergeTds.length; j++) {
                        var mStartX = Number($(that.mergeTds).eq(j).attr('cols'));
                        var mStartY = Number($(that.mergeTds).eq(j).attr('rows'));
                        var mCSpan = Number($(that.mergeTds).eq(j).attr('colspan'));
                        var mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan'));
                        var mEndX = mStartX + mCSpan;


                        if (mStartX <= xIndex && mEndX >= xIndex && mStartY === i) {
                            $(that.mergeTds).eq(j).attr('colspan',mCSpan-1);
                            $('#' + 't' + xIndex).remove();

                            i += mRSpan;
                        }
                    }

                }

            }


            that.cellCount--;

            that.UpdateTableCol();

            that.UpdateTop(xIndex,'delete');

        }

        that.SetIndex();

        that.FillTd();

        that.KeyCursor();

    });

};

//行删除

ITable.prototype.DeleteRow = function () {

    var simMenu = this.CreateSimpleMenu('editRowCol delRow', '');

    var sel_a = simMenu.children(0);

    var that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked');

        if (sNode.length >= 2) {

        } else {

            var yIndex = parseInt(sNode.attr('rows'));

            for (var i = 1; i <= that.cellCount+1;) {

                    if ($('#' + yIndex + '-' + i).length > 0) {
                        var cSpan = Number($('#' + yIndex + '-' + i).attr('colspan'));
                        var rSpan = Number($('#' + yIndex + '-' + i).attr('rowspan'));
                        if (rSpan >= 2) {
                            $('#' + yIndex + '-' + i).attr('rowspan', rSpan - 1);
                            i+=cSpan;
                        } else {

                            $('#' + yIndex + '-' + i).remove();
                            i++;
                        }
                    }else{

                        for (var j = 0; j <= that.mergeTds.length; j++) {
                            var mStartX = Number($(that.mergeTds).eq(j).attr('cols'));
                            var mStartY = Number($(that.mergeTds).eq(j).attr('rows'));
                            var mCSpan = Number($(that.mergeTds).eq(j).attr('colspan'));
                            var mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan'));

                            var mEndY = mStartY + mRSpan;

                            if (mStartY <= yIndex && mEndY >= yIndex && mStartX === i) {
                                $(that.mergeTds).eq(j).attr('rowspan',mRSpan-1);
                                i += mCSpan;
                            }
                        }


                    }


            }
            that.table.find('tr').each(function(){
                if($(this).html()===''){
                    $(this).remove();
                }

            });

            that.rowCount--;

            that.UpdateLeft(yIndex,'delete');

        }

        that.SetIndex();

        that.FillTd();

        that.KeyCursor();

    });

};



//输入触发公式
ITable.prototype.TypeFormula=function(ways,data){
    switch (ways){
        case 'sum':
            return this.TypeSum(data);
            break;
        case 'avg':
            return this.TypeAvg(data);
            break;
        case 'count':
           // fxCount();
            break;
        case 'max':
            return this.TypeMax(data);
            break;
        case 'min':
            return this.TypeMin(data);
            break;
        default:
            break;
    }
};
ITable.prototype.TypeSum=function(data){
    var sum=0;
    for(var i=1;i<data.length;i++){
        sum+=this.GetFillType($('#'+data[i]));
    }
    return sum;
};

ITable.prototype.TypeAvg=function(data){
    var sum=0,avg=0;
    for(var i=1,len=data.length;i<len;i++){
        sum+=this.GetFillType($('#'+data[i]));
    }
    avg=sum/(data.length-1);
    return avg;
};

ITable.prototype.TypeMax=function(data){
    var arr=[];
    for(var i=1,len=data.length;i<len;i++){
       arr.push(this.GetFillType($('#'+data[i])));
    }
    return _.max(arr);
};

ITable.prototype.TypeMin=function(data){
    var arr=[];
    for(var i=1,len=data.length;i<len;i++){
        arr.push(this.GetFillType($('#'+data[i])));
    }
    return _.min(arr);
};

//点击触发公式

ITable.prototype.Formula = function (ways) {

    switch (ways){
        case 'sum':
            this.FxSum();
            break;
        case 'avg':
            this.FxAvg();
            break;
        case 'count':
            this.FxCount();
            break;
        case 'max':
            this.FxMax();
            break;
        case 'min':
            this.FxMin();
            break;
        default:
            break;
    }
};


ITable.prototype.FxSum=function(){
       var that=this;
       if($('.picked').length>1){
           var sum=0;
           var rArr=[],cArr=[];
           var pArr=[];
           $('.picked').each(function(){
               var val=that.GetFillType($(this));
               var nowRow=parseInt($(this).attr('rows')),nowCol=parseInt($(this).attr('cols'));
               rArr.push(nowRow),cArr.push(nowCol);
               if(val===NaN){
                   val=0;
               }else{
                   sum+=val;
               }
               pArr.push($(this).attr('id'));

           });
           if(_.uniq(rArr).length>1){

           }else{
               var id='#'+rArr[0]+'-'+Number(_.last(cArr)+1);
               $(id).text(sum);
               $(id).attr('ex','sum');
               _.map(pArr,function(num){
                   var ex=$(id).attr('ex');
                   ex+='/'+num;
                   $('#'+num).attr('pNode',id);
                   $(id).attr('ex',ex);
               });
           }

           if(_.uniq(cArr).length>1){

           }else{
               var id='#'+Number(_.last(rArr)+1)+'-'+cArr[0] ;
               $(id).text(sum);
               $(id).attr('ex','sum');
               _.map(pArr,function(num){
                   var ex=$(id).attr('ex');
                   ex+='/'+num;
                   $('#'+num).attr('pNode',id);
                   $(id).attr('ex',ex);
               });
           }


       }

};

ITable.prototype.FxAvg=function(){
    var that=this;
    if($('.picked').length>1){
        var sum=0,pL=$('.picked').length,avg=0;
        var rArr=[],cArr=[];
        var pArr=[];
        $('.picked').each(function(){
            var val=that.GetFillType($(this));
            var nowRow=parseInt($(this).attr('rows')),nowCol=parseInt($(this).attr('cols'));
            rArr.push(nowRow),cArr.push(nowCol);
            if(val===NaN){
                val=0;
            }else{
                sum+=val;
            }
            pArr.push($(this).attr('id'));
        });
        avg=sum/pL;

        if(_.uniq(rArr).length>1){

        }else{
            var id='#'+rArr[0]+'-'+Number(_.last(cArr)+1);
            $(id).text(avg);
            $(id).attr('ex','avg');
            _.map(pArr,function(num){
                var ex=$(id).attr('ex');
                ex+='/'+num;
                $('#'+num).attr('pNode',id);
                $(id).attr('ex',ex);
            });
        }

        if(_.uniq(cArr).length>1){

        }else{
            var id='#'+Number(_.last(rArr)+1)+'-'+cArr[0] ;
            $(id).text(avg);
            $(id).attr('ex','avg');
            _.map(pArr,function(num){
                var ex=$(id).attr('ex');
                ex+='/'+num;
                $('#'+num).attr('pNode',id);
                $(id).attr('ex',ex);
            });
        }

    }

};

ITable.prototype.FxCount=function(){

    if($('.picked').length>1){
        var count=0;
        var rArr=[],cArr=[];
        $('.picked').each(function(){
            var val=Number($(this).text());
            var nowRow=parseInt($(this).attr('rows')),nowCol=parseInt($(this).attr('cols'));
            rArr.push(nowRow),cArr.push(nowCol);
            if(!isNaN(val)&&val!=0){
                count++;
            }else{
               return;
            }

        });

        if(_.uniq(rArr).length>1){

        }else{
            var id='#'+rArr[0]+'-'+Number(_.last(cArr)+1);
            $(id).text(count);
        }

        if(_.uniq(cArr).length>1){

        }else{
            var id='#'+Number(_.last(rArr)+1)+'-'+cArr[0] ;
            $(id).text(count);
        }

    }

};

ITable.prototype.FxMax=function(){
    if($('.picked').length>1){
        var arr=[];
        var rArr=[],cArr=[];
        var pArr=[];
        $('.picked').each(function(){
            var val=Number($(this).text());
            var nowRow=parseInt($(this).attr('rows')),nowCol=parseInt($(this).attr('cols'));
            rArr.push(nowRow),cArr.push(nowCol);
            if(!isNaN(val)&&val!=0){
                arr.push(val);
            }else{
                return;
            }
            pArr.push($(this).attr('id'));
        });
        var maxValue=_.max(arr);
        if(_.uniq(rArr).length>1){

        }else{
            var id='#'+rArr[0]+'-'+Number(_.last(cArr)+1);
            $(id).text(maxValue);
            $(id).attr('ex','max');
            _.map(pArr,function(num){
                var ex=$(id).attr('ex');
                ex+='/'+num;
                $('#'+num).attr('pNode',id);
                $(id).attr('ex',ex);
            });
        }

        if(_.uniq(cArr).length>1){

        }else{
            var id='#'+Number(_.last(rArr)+1)+'-'+cArr[0] ;
            $(id).text(maxValue);
            $(id).attr('ex','max');
            _.map(pArr,function(num){
                var ex=$(id).attr('ex');
                ex+='/'+num;
                $('#'+num).attr('pNode',id);
                $(id).attr('ex',ex);
            });
        }

    }

};


ITable.prototype.FxMin=function(){
    if($('.picked').length>1){
        var arr=[];
        var rArr=[],cArr=[];
        var pArr=[];
        $('.picked').each(function(){
            var val=Number($(this).text());
            var nowRow=parseInt($(this).attr('rows')),nowCol=parseInt($(this).attr('cols'));
            rArr.push(nowRow);
            cArr.push(nowCol);

            if(!isNaN(val)&&val!=0){
                arr.push(val);
            }else{
                return;
            }
            pArr.push($(this).attr('id'));
        });
        var minValue=_.min(arr);
        if(_.uniq(rArr).length>1){

        }else{
            var id='#'+rArr[0]+'-'+Number(_.last(cArr)+1);
            $(id).text(minValue);
            $(id).attr('ex','min');
            _.map(pArr,function(num){
                var ex=$(id).attr('ex');
                ex+='/'+num;
                $('#'+num).attr('pNode',id);
                $(id).attr('ex',ex);
            });
        }

        if(_.uniq(cArr).length>1){

        }else{
            var id='#'+Number(_.last(rArr)+1)+'-'+cArr[0] ;
            $(id).text(minValue);
            $(id).attr('ex','min');
            _.map(pArr,function(num){
                var ex=$(id).attr('ex');
                ex+='/'+num;
                $('#'+num).attr('pNode',id);
                $(id).attr('ex',ex);
            });
        }

    }
};

//合并单元格

ITable.prototype.MergeTd = function () {

    var mergeBtn = this.CreateSimpleMenu('mergeBtn');

    var that = this;

    mergeBtn.on('click', function () {

        var $t = that.table;

        if ($("table", $t).length > 0) {

            alert("不支持嵌套表格！");

            return;

        }

        var sigDel = "sign4delete";

        var sigSel = "picked";

        $("th,td", $t).each(function () {

            var rIdx = $("tr", $t).index($(this).parent("tr"));

            var cIdx = $(this).parent().children("th,td").index(this);

            var rowSpan = Number($(this).attr("rowspan")) || 1;

            var colSpan = Number($(this).attr("colspan")) || 1;

            var isSel = $(this).hasClass(sigSel);

            if (rowSpan <= 1 && colSpan <= 1) return;

            $("tr", $t).each(function () {

                var idx = $("tr", $t).index(this);

                var arr, $td = $("<td>").addClass(isSel ? sigSel : sigDel);

                if (idx === rIdx) {

                    // 本行在 [cidx] 后插入 colspan-1 个

                    arr = $(); // 准备待插单元格

                    for (var i = 0; i < colSpan - 1; i++)

                        arr = arr.add($td.clone());

                    // 插入

                    $("th,td", this).eq(cIdx).after(arr);

                } else if (rIdx < idx && idx < rIdx + rowSpan) {

                    // 以下行在 [cidx] 前插入 colspan 个

                    arr = $(); // 准备待插单元格

                    for (var i = 0; i < colSpan; i++)

                        arr = arr.add($td.clone());

                    // 插入

                    if (cIdx > 0 && $("th,td", this).eq(cIdx - 1).length > 0) $("th,td", this).eq(cIdx - 1).after(arr);

                    else if ($("th,td", this).eq(cIdx).length > 0) $("th,td", this).eq(cIdx).before(arr);

                    else $(this).prepend(arr);

                }

            });

        });

        var rMin = 10000,

            cMin = 10000;

        var rMax = 0,

            cMax = 0;

        var rNum, cNum;

        // 计算起始和跨距

        $("th,td", $t).filter("." + sigSel).each(function () {

            var rIdx = $("tr", $t).index($(this).parent("tr"));

            rMin = rIdx < rMin ? rIdx : rMin;

            rMax = rIdx > rMax ? rIdx : rMax;

            var cIdx = $(this).parent().children("th,td").index(this);

            cMin = cIdx < cMin ? cIdx : cMin;

            cMax = cIdx > cMax ? cIdx : cMax;

        });

        rNum = rMax - rMin + 1;

        cNum = cMax - cMin + 1;

        // 合并单元格

        $("th,td", $t).each(function () {

            var rIdx = $("tr", $t).index($(this).parent("tr"));

            var cIdx = $(this).parent().children("th,td").index(this);

            if (rMin <= rIdx && rIdx <= rMax && cMin <= cIdx && cIdx <= cMax) $(this).addClass(sigDel);

            if (rIdx === rMin && cIdx === cMin){
                $(this).removeClass(sigDel).attr({

                    rowspan: rNum,

                    colspan: cNum

                });
                that.mergeTds.push(this);

            }

            if (Number($(this).attr("rowspan")) === 1) $(this).removeAttr("rowspan");

            if (Number($(this).attr("colspan")) === 1) $(this).removeAttr("colspan");

        }).remove("." + sigDel);

        that.SetIndex();

    });

};

//拆分单元格

ITable.prototype.SplitTd = function () {

    var splitBtn = this.CreateSimpleMenu('splitBtn');

    var that = this;

    splitBtn.on('click', function () {

        var $t = that.table;

        if ($("table", $t).length > 0) {

            alert("不支持嵌套表格！");

            return;

        }

        var sigDel = "sign4delete";

        var sigSel = "picked";

        $("th,td", $t).each(function () {

            var rIdx = $("tr", $t).index($(this).parent("tr"));

            var cIdx = $(this).parent().children("th,td").index(this);

            var rowSpan = Number($(this).attr("rowspan")) || 1;

            var colSpan = Number($(this).attr("colspan")) || 1;

            var isSel = $(this).hasClass(sigSel);

            if (rowSpan <= 1 && colSpan <= 1) return;

            if (isSel){

                $(this).removeAttr("colspan").removeAttr("rowspan");

                that.mergeTds=_.without(that.mergeTds,this);
            }

            // 跨格开插

            $("tr", $t).each(function () {

                var idx = $("tr", $t).index(this);

                var arr, $td = $("<td>");

                if (!isSel) $td.addClass(sigDel);

                if (idx === rIdx) {

                    // 本行在 [cidx] 后插入 colspan-1 个

                    arr = $(); // 准备待插单元格

                    for (var i = 0; i < colSpan - 1; i++)

                        arr = arr.add($td.clone());

                    $("th,td", this).eq(cIdx).after(arr);

                } else if (rIdx < idx && idx < rIdx + rowSpan) {

                    // 以下行在 [cidx] 前插入 colspan 个

                    arr = $(); // 准备待插单元格

                    for (var i = 0; i < colSpan; i++)

                        arr = arr.add($td.clone());

                    if (cIdx > 0 && $("th,td", this).eq(cIdx - 1).length > 0) $("th,td", this).eq(cIdx - 1).after(arr);

                    else if ($("th,td", this).eq(cIdx).length > 0) $("th,td", this).eq(cIdx).before(arr);

                    else $(this).prepend(arr);

                }

            });

        });

        $("th,td", $t).remove("." + sigDel);

        that.SetIndex();

    });

};

//创建工具栏下拉菜单

ITable.prototype.CreateSelection = function (id, menus) {

    var selectionBox = $('<div class="toolBox"></div>');

    var selectHead = $('<div id="' + id + '"></div>');

    var selectUl = $('<ul></ul>');

    var selectLi, arr = [];

    for (var index in menus) {

        arr.push(index);

        selectHead.text(arr[0]);

        selectLi = $('<li><a class="' + menus[index] + '">' + index + '</a></li>');

        selectUl.append(selectLi);

    }

    selectHead.after(selectUl);

    selectionBox.append(selectHead);

    this.tools.append(selectionBox);

    selectUl.hide();

    selectHead.on('click', function () {

        selectUl.toggle();

    });
    // $(selectUl).slimScroll({
    //     height: '100px'
    // });

    selectUl.find('li a').on('click', function () {

        selectHead.text($(this).text());

        selectHead.attr('curClass', $(this).attr('class'));

    });

    return selectionBox;

};


//创建工具栏单个菜单

ITable.prototype.CreateSimpleMenu = function (className, text) {

    var menus = $('<div class="toolBox"></div>');

    var mText = text || '';

    var mClass = className;

    var simTool = $('<span class="' + mClass + '">' + mText + '</span>');

    menus.append(simTool);

    this.tools.append(menus);

    return menus;

};

//创建工具栏格子菜单

ITable.prototype.CreateCellMenu = function (dClass, className, menus) {

    var selectionBox = $('<div class="toolBox"></div>');

    var selectHead = $('<div class="' + dClass + '"></div>');

    var selectTb = $('<table class="' + className + '"></table>');

    var selectTr = $('<tr></tr>');

    var selectTd;

    var arr1 = [],

        arr2 = [];

    for (var index in menus) {

        arr1.push(menus[index].tdclass);

        arr2.push(menus[index].fclass);

    }

    for (var i = 0,len=arr1.length+1; i < len; i++) {

        selectTd = $('<td class="' + arr1[i] + '"><a class="' + arr2[i] + '"></a></td>');

        selectTr.append(selectTd);

        if ((i + 1) % 5 === 0 && (i + 1) != 0) {

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

    selectHead.on('click', function () {

        selectTb.toggle();

    });

    return selectionBox;

};

//增加sheet

ITable.prototype.AddSheet = function () {

    var i = 2;

    var box = this.container;

    var that = this;

    $('.addSheet').click(function () {

        box.empty();

        var dd = $("<dd class='sheet sheetDefault' id=sheet" + i + ">sheet" + i + "</dd>");

        var curId = $(".sheetDefault").attr('id');

        curId = curId.replace('sheet', '');

        curId = parseInt(curId);

        $("#sheet" + curId).removeClass('sheetDefault');

        var neId = parseInt(curId) + 1;

        $('.sheetQueueDl').append(dd);

        that.CreateContent(neId);

        that.FillTd(neId);

        i++;

        that.SheetWork();

    });

};


ITable.prototype.SheetWork = function () {

    var that = this;

    $('.sheet').on('click', function () {

        box.empty();

        var dId = $(this).attr('id');

        dId = dId.replace('sheet', '');

        dId = parseInt(dId);

        that.CreateContent(dId);

        that.FillTd(dId);

        $(this).addClass('sheetDefault').siblings().removeClass('sheetDefault');

        return false;

    });

    $('.sheet').on('dblclick', function () {

        var that = $(this);

        var ev = event || window.event;

        var tdWidth = that.width();

        var tdHeight = that.height();

        var tdText = that.text();

        var stInput = $("<input type=\'text' class='stInput'  value='" + tdText + "'>");

        stInput.width(tdWidth - 2);

        stInput.height(tdHeight - 2);

        that.html(stInput);

        stInput.select();

        $('.stInput').blur(function () {

            var content = $('.stInput').val();

            if (tdText === content) {

                $(this).parent().html(content);

            } else {

                $(this).parent().html(content);

            }

            $('.stInput').remove();

            event.stopPropagation();

        });

        $(".stInput").keyup(function (ev) {

            if (ev.keyCode === 13) {

                $('.stInput').blur();

            }

        });

    });

};

//sheet移动

ITable.prototype.SheetMove = function () {

    var lSheet = $('.lSheet');

    var rSheet = $('.rSheet');

    var sDl = $(".sheetQueuedDl");

    var num = 0;

    rSheet.click(function () {

        num === sDl.find('dd').length - 1 ? num = sDl.find('dd').length - 1 : num++;

        toNavRPos();

    });

    lSheet.click(function () {

        num === 0 ? num = 0 : num--;

        toNavRPos();

    });

    function toNavRPos() {

        sDl.stop().animate({

            'margin-left': -num * 80

        }, 100);

    }



};

//设置坐标

ITable.prototype.SetIndex = function () {

    var offsetLeftArray = new Array();

    var cell; // 单元格Dom

    var col; // 单元格实际所在列

    var cellStr; // 每个cell以row,col,rowSpan,colSpan,value形式

    var cellStrArray = [];

    var t = this.table;

    var id = (t.attr('id')).replace('iTable', '');

    var objTab = document.getElementById('iTable' + id);

    // 遍历第一次取出offsetLeft集合

    for (var i = 0,l=objTab.rows.length; i < l; i++) {

        for (var j = 0,_l=objTab.rows[i].cells.length; j < _l; j++) {

            cell = objTab.rows[i].cells[j];

            if (containsArray(offsetLeftArray,cell.offsetLeft) === -1)

                offsetLeftArray.push(cell.offsetLeft);

        }

    }

    offsetLeftArray.sort(function (x, y) {

        return parseInt(x) - parseInt(y);

    });

    // 遍历第二次生成cellStrArray

    for (var i = 0,l = objTab.rows.length; i < l; i++) {

        for (var j = 0,_l = objTab.rows[i].cells.length; j < _l; j++) {

            cell = objTab.rows[i].cells[j];

            // col = offsetLeftArray.contains(cell.offsetLeft);

            col = containsArray(offsetLeftArray,cell.offsetLeft);

            cellStr = i + ',' + col;

            cellStrArray.push(cellStr);

            cell.setAttribute('rows', i+1);

            cell.setAttribute('cols', col + 1);

            cell.setAttribute('id',i+1+'-'+(col+1));

        }

    }

};

//col更新
ITable.prototype.UpdateTableCol=function(){

    for (var j = 0,len=this.cellCount; j <= len; j++) {

        this.table.find('col').eq(j).attr('id','t'+j);

    }
}


//y轴更新

ITable.prototype.UpdateLeft = function (index,type) {

    switch (type){
        case 'add':

            $('#leftTable').find('tr').eq(index).after('<tr><td></td></tr>');

            for (var j = index,len=this.rowCount; j < len; j++) {

                $('#leftTable').find('tr').eq(j).find('td').text(j+1);

            }
            break;
        case 'delete':
            $('#leftTable').find('tr').eq(index).remove();

            for (var j = 0,len=this.rowCount; j < len; j++) {

                $('#leftTable').find('tr').eq(j).find('td').text(j+1);

            }

            break;
    }



    this.LargeRow();
};

//x轴更新

ITable.prototype.UpdateTop = function (index,type) {
    switch (type) {
        case 'add':
            $('#titleTable').find('colgroup').find('col').eq(index).after('<col style="width:100px">');

            $('#titleTable').find('tbody').find('tr').find('td').eq(index).after('<td></td>');
            var len=this.cellCount;
            for (var j = index; j <= len; j++) {

                $('#titleTable').find('tbody').find('tr').find('td').eq(j).text(IntToChr(j));

            }

            break;
        case 'delete':
            $('#titleTable').find('colgroup').find('col').eq(index).remove();

            $('#titleTable').find('tbody').find('tr').find('td').eq(index).remove();

            var len=this.cellCount;

            for (var j = 1; j <= len; j++) {

                $('#titleTable').find('tbody').find('tr').find('td').eq(j).text(IntToChr(j));

            }
            break;
    }

    this.LargeCol();
};

//拖拽放宽列

ITable.prototype.LargeCol = function () {

    var container = this.container;

    var that = this;

    var event = window.event || arguments[0];

    var exW = $('.yOrder').outerWidth();

    $('#titleTable').find('tr').find('td').each(function (event) {

        $(this).off('mousemove').on('mousemove',function(event){

            var w = $(this).width();

            var x = event.clientX - exW;

            if($(this).offset().left+w-exW<x+20){
                $(this).css({
                    cursor:'col-resize'
                });

                $(this).off('mousedown').on('mousedown', function (event) {

                    var index = $(this).index();

                    var lLine = $('<div class="lline"></div>');

                    var sL=Number($(that.container).scrollLeft());

                    var w = $(this).width()+sL;

                    var x = event.clientX - exW+sL;

                    if($(this).offset().left+w-exW<x+20){

                        $('body').mousemove(function (event) {

                            var allH = that.table.outerHeight();

                            var l = event.clientX - exW;

                            var move = l - x;

                            if (w + move < 20) {

                                return;

                            } else {

                                lLine.css({

                                    'height': allH,

                                    'left': event.clientX+sL,

                                    'width':'1px',

                                    'border-left':'1px dashed #000'

                                });

                                that.table.find('colgroup').find('col').eq(index).css('width', w + move);

                                $('#titleTable').find('colgroup').find('col').eq(index).css('width', w + move);

                                $(container).append(lLine);

                            }

                        });
                    }
                    $('body').mouseup(function () {

                        $('body').off('mousemove');

                        lLine.remove();

                    });

                });

            }else{
                $(this).css({
                    cursor:'default'
                })
            }

        });




    });

};

//拖拽放宽行

ITable.prototype.LargeRow = function () {

    var container = this.container;

    var that = this;

    var exH = $('.yOrder').outerHeight(),headerH=parseInt($(container).css('marginTop'));

    $('#leftTable').find('tr').find('td').each(function () {

        // var event = window.event || arguments[0];

        $(this).off('mousemove').on('mousemove',function(event){

            var h = $(this).height();

            var y = event.clientY - exH;

            if($(this).offset().top+h-exH<y+6) {

                $(this).css({
                    cursor: 'row-resize'
                });

                $(this).off('mousedown').on('mousedown', function (event) {

                    var index = $(this).parent().index();

                    var lLine = $('<div class="rline"></div>');

                    var sT=Number($(that.container).scrollTop());

                    var h = $(this).height()+sT;

                    var y = event.clientY - exH+sT;


                    if($(this).offset().top+h-exH<y+10) {

                        $('body').mousemove(function (event) {

                            var allW = that.table.outerWidth();

                            var l = event.clientY - exH;

                            var move = l - y;

                            if (h + move < 20) {

                                return;

                            } else {

                                lLine.css({

                                    'width': allW,

                                    'top': event.clientY+sT-headerH,

                                    'border-top':'1px dashed #000',

                                    'height':1

                                });

                                var tempMove=h + move + 1,tempMove_1=h+move;

                                that.table.find('tr').find('th').eq(index).css('height',tempMove);

                                $('#leftTable').find('td').eq(index).css('height', tempMove_1);

                                $(container).append(lLine);

                            }

                        });
                    }



                    $('body').mouseup(function () {

                        $('body').off('mousemove');

                        lLine.remove();


                    });

                });




            }else{
                $(this).css({
                    cursor: 'default'
                });
            }
        });



    });

};

//创建公式输入框

ITable.prototype.FillBlank = function () {

    var fxBox = $('<div class="fx"></div>');

    var fxInput = $('<input type="text" id="ip_fx">');

    var dis = $('<span class="disbox" id="disbox"></span>');

    fxBox.append(dis);

    fxBox.append(fxInput);

    this.header.append(fxBox);

    this.FillWork();

};

//输入操作

ITable.prototype.FillWork = function () {

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

    ifx.keyup(function (ev) {

        pValue = ifx.val();

        flReg = /^\=|\+|\-|\*|\/|\(|\)/;

        reg = /^\=((((\(*([a-zA-Z]([1-9]\d*))\)*|([1-9]\d*))(\+|-|\/|\*))*(([1-9]\d*)|([a-zA-Z]([1-9]\d*))*\)*))|([a-zA-Z]([1-9]\d*)))/;

        res = pValue.match(reg);

        if ((!!res) && (!!res[0])) {

            endText = res[0].toString();

            pArr = endText.split(flReg);

            for (var i = 0; i < pArr.length; i++) {

                if (!!pArr[i]) {

                    if (String(nValue).indexOf(pArr[i]) <= -1) {

                        lightTd(pArr[i]);

                        cLightTd(pArr[i].substr(0, pArr[i].length - 1));

                    }

                }

            }

        }

        if ($('.picked').length > 1) {

            return;

        } else {

            $('.picked').text(pValue);

        }

        //删除

        // if ((ev.keyCode === 8)) {
        //
        //     delRes = nValue.match(/([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*/);
        //
        //     if (!!nValue) {
        //
        //         dArr = nValue.split(flReg);
        //
        //         cArr = pValue.split(flReg);
        //
        //         delTmp = getUniqueSet(cArr, dArr);
        //
        //         if (!!delTmp[1]) {
        //
        //             cLightTd(delTmp[1]);
        //
        //         }
        //
        //     }
        //
        // }
        //
        // if ((ev.keyCode === 13)) {
        //
        //     this.blur();
        //
        //     var allValue = pValue;
        //
        //     calRes = allValue.match(reg);
        //
        //     if ((!!calRes) && (!!calRes[0])) {
        //
        //         fText = calRes[0].toString();
        //
        //         allArr = fText.split(flReg);
        //
        //         for (var i = 0; i < allArr.length; i++) {
        //
        //             if (!!allArr[i]) {
        //
        //                 var tmp = allArr[i];
        //
        //                 var tmpVal = String(that.getValue(allArr[i]));
        //
        //                 allValue = allValue.replace(tmp, tmpVal);
        //
        //             }
        //
        //         }
        //
        //         calText = allValue;
        //
        //         calText = calText.substring(1);
        //
        //         var result = dal2Rpn(calText);
        //
        //         $('.picked').text(result);
        //
        //         $('.mask').remove();
        //
        //     }
        //
        // }

        ifx.onkeydown(function (ev) {

            nValue = ifx.val();

        });

    });

};

//高亮蒙版

ITable.prototype.CreateMask = function (left, top, width, height, posX, posY) {

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

};

ITable.prototype.rMenus = function () {

    var that = this;

    var rMenus = this.CreateRMenus();

    var winH = $(window).height() - $(this.footer).outerHeight();

    var winW = $(window).width();

    this.table.contextmenu(function () {

        var ev = event || window.event;

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
        if($('.picked').length>1){

            that.SetBlueBorder($('.picked'));
        }else{
            $('.picked').removeClass('picked');
            $(that.moveLast).addClass('picked');
            that.SetBlueBorder(that.moveLast);
        }

       //  that.SetBlueBorder(that.moveLast);
        return false;

    });

};

ITable.prototype.CreateRMenus = function () {

    var $menus = $('<div class="rmenu"></div>');

    var dataArr = [];

    var cut = this.Cut(dataArr);

    $menus.append(cut);

    var copy = this.Copy();

    $menus.append(copy);

    var paste = this.Paste(dataArr);

    $menus.append(paste);

    var _insert = this._insert(dataArr);

    $menus.append(_insert);

    var _delete = this._delete(dataArr);

    $menus.append(_delete);

    var clearContent = this.ClearContent();

    $menus.append(clearContent);

    $('body').append($menus);

    $(document).on('click', function () {

        $menus.hide();

        return false;

    });

    return $menus;

};

ITable.prototype.Cut = function (dataArr) {

    var $cutDiv = $('<div class="menu-cut">剪切</div>');

    $cutDiv.on('click', function () {

        var tdLength = $('.picked').length;

        $(this).parent().hide();

        if (tdLength <= 1) {

            dataArr.length = 0;

            var td = $('.picked').eq(0);

            dataArr.push($(td).text());

            $(td).text('');

        } else {

            dataArr.length = 0;

            for (var i = 0; i < tdLength; i++) {

                var tds = $('.picked').eq(i);

                dataArr.push($(tds));

                $(tds).text('');

            }

        }

    });

    return $cutDiv;

};

ITable.prototype.Copy = function () {

    var $copyDiv = $('<div class="menu-copy">复制</div>');
    var dataArr=[];
    $copyDiv.on('click', function () {

        var tdLength = $('.picked').length;

        $(this).parent().hide();

        if (tdLength <= 1) {

            dataArr.length = 0;

            var td = $('.picked').eq(0);

            dataArr.push($(td).text());

        } else {

            dataArr.length = 0;

            for (var i = 0; i < tdLength; i++) {

                var tds = $('.picked').eq(i);

                dataArr.push($(tds));

            }

        }

    });

    return $copyDiv;

};

ITable.prototype.Paste = function (dataArr) {

    var $pasteDiv = $('<div class="menu-paste">粘贴</div>');

    $pasteDiv.css({

        'padding': '2px 10px',

        'cursor': 'pointer'

    });

    $pasteDiv.on('click', function () {

        $(this).parent().hide();

        var tdLength = $('.picked').length;

        if (tdLength <= 1) {

            $('.picked').text(dataArr[0]);

        } else {

            for (var i = 0; i < tdLength; i++) {

                //           removeUied();

                //           var tds=$('.picked')[i];

                //           dataArr.push($(tds));

                //           $(tds).text('');

            }

        }

    });

    return $pasteDiv;

};

ITable.prototype._insert = function () {

    var $insertDiv = $('<div class="menu-insert">插入</div>');

    var that = this;

    $insertDiv.css({

        'padding': '2px 10px',

        'cursor': 'pointer'

    });

    // $insertDiv.on('click', function () {
    //
    //     var ev = event || window.event;
    //
    //     var winW = $(window).width();
    //
    //     var winH = $(window).height();
    //
    //     var toolsDiv = $('<div></div>');
    //
    //     var toolsTitle = $('<div><span>插入</span></div>');
    //
    //     toolsDiv.append(toolsTitle);
    //
    //     toolsDiv.css({
    //
    //         'position': 'absolute',
    //
    //         'top': '50%',
    //
    //         'left': '50%',
    //
    //         'width': '200px',
    //
    //         'background': '#ffffff'
    //
    //     });
    //
    //     $(that.container).append(toolsDiv);
    //
    // });

    return $insertDiv;

};

ITable.prototype._delete = function () {

    var deleteDiv = $('<div class="menu-delete">删除</div>');

    deleteDiv.css({

        'padding': '2px 10px',

        'cursor': 'pointer'

    });

    return deleteDiv;

};


ITable.prototype.ClearContent =function(){
    var clearDiv=$('<div class="menu-delete">清空内容</div>');

    clearDiv.on('click',function(){

            if($('.picked').length<0){
                return;
            }else{
                $('.picked').each(function(){
                    $(this).html('');
                });
            }

    });
    return clearDiv;

};


ITable.prototype.TdToFx = function (obj) {

    var tdVal = obj.text();

    $('#ip_fx').val(tdVal);

};



ITable.prototype.getValue = function (arr) {

    arr = arr.toString();

    var xCoo = arr.replace(/[a-zA-Z]*/, ' '),

        yCoo = arr.replace(/[1-9]\d*/, ' ');

    yCoo = yCoo.charCodeAt(0) - 96;

    xCoo--, yCoo--;

    var value;

    var text = Number($('#'+yCoo+'-'+xCoo).text());


    if (typeof(text) != 'number') {

        value = 0;

    } else {

        (!!text) ? value = Number(text) : value = 0;

    }

    return value;

};

ITable.prototype.freezeBtn=function(){
   var btn=this.CreateSimpleMenu('fbold');
   this.tools.append(btn);
   btn.on('click',{callZ:this},this.freezeTds);
};

ITable.prototype.freezeTd=function(){
    // var colBox=$('<div id="fColBox"><div></div><table><colgroup></colgroup><tbody></tbody></table></div>');
    // var rowBox=$('<div id="fRowBox"></div>');
    var bothBox=$('<div id="fBothBox"></div>');

    // this.container.append(colBox);
    // this.container.append(rowBox);
    this.container.append(bothBox);
    this.freezeBtn();
};


ITable.prototype.freezeTds=function(event){
    if($('.picked').length>0){
        var xArr=[],yArr=[],xMin,xMax,yMin,yMax;
        var fColTotalWidth=0,fColSingleWidth=0;
        $('.picked').each(function(){
            xArr.push(Number($(this).attr('cols')));
            yArr.push(Number($(this).attr('rows')));
        });
        xMin=_.min(xArr),xMax=_.max(xArr),yMin=_.min(yArr),yMax=_.max(yArr);

        // for(var i=xMin;i<xMax;i++){
        //     for(var j=yMin;j<yMax;j++){
        //      var id='#'+j+'-'+i;
        //      var cloneTd=$(id).clone();
        //         console.log(cloneTd);  
        //     }
        // }


             for(var j=0,len=event.data.callZ.rowCount;j<=len;j++){
                 var tr=$('<tr></tr>');
                 for(var i=0;i<xMin;i++){
                     var id='#'+j+'-'+i;

                     if(j>0){
                         tr.append($('.dataTable').find(id).clone());


                     }else{
                         tr.append($('.dataTable').find(id).clone());
                         $('#fColBox').find('colgroup').append($('.dataTable').find('colgroup').find('col').eq(i).clone());
                         if(i>1){
                             fColTotalWidth+=parseInt($('.dataTable').find('colgroup').find('col').eq(i).width());
                         }

                     }

                 }

                 $('#fColBox').find('div').append($('#leftTable').find('tr').eq(j).clone());
                 $('#fColBox').find('tbody').append(tr);
             }


             $('#fColBox').css({
                'position':'fixed',
                'top':94,
                'width':fColTotalWidth,
                'z-index':290,
                'height':$(event.data.callZ.container).css('height')
             });

             $('#fColBox td').css({
                'height':'20px'
             });



    }else{
        return;
    }

};


ITable.prototype.LeftBar = function () {

    var box = $('<div class="leftbar"></div>');

    var span = $('<span class="ltoggle tl"></span>');

    box.append(span);

    $('body').append(box);

    span.on('click', function () {

        var l = parseInt($('.leftbar').css('left'));

        if (l < 0) {

            $('.leftbar').stop().animate({

                left: "0px"

            });

            $('.ltoggle').removeClass('tr').addClass('tl')

        } else {

            $('.leftbar').stop().animate({

                left: "-400px"

            });

            $('.ltoggle').removeClass('tl').addClass('tr')

        }

    });

    this.LeftBarHandle();

    //callback();

};

ITable.prototype.LeftBarHandle = function (callback) {

    if (callback) {

        callback();

    }

};

ITable.prototype.charts = function () {

    this.CreateSimpleMenu('charts');

    this.chartsHandler();

};

ITable.prototype.chartsHandler = function (callback) {

    if (callback) {

        callback();

    }

};

ITable.prototype.dataSource = function () {

    this.CreateSimpleMenu('dataSource');

    this.dataSourceHandler();

};

ITable.prototype.dataSourceHandler = function (callback) {

    if (callback) {

        callback();

    }

};

ITable.prototype.dataSet = function () {

    this.CreateSimpleMenu('dataSet');

    this.dataSetHandler();

};

ITable.prototype.dataSetHandler = function (callback) {

    if (callback) {

        callback();

    }

};

ITable.prototype.dataSearch = function () {

    this.CreateSimpleMenu('dataSearch');

    this.dataSetHandler();

};



// iTable.prototype.saveBtn=function(callback){
//     var btn=$('<input type="button" class="saveBtn" value="保存">');
//     var that=this;
//     this.header.find('.tools').append(btn);
//     btn.css({
//         'float':'right',
//         'margin-right':'10px',
//         'margin-top':'6px'
//     });
// };
//
// iTable.prototype.saveBtn.save=function(callback){
//     $('.saveBtn').on('click',callback);
// };
// iTable.prototype.saveReport = function (callback) {
//       // $('.saveBtn').on('click',callback);
//     //if (callback) {
//
//     $('.saveBtn').on('click',callback);
//
//    // }
//
// };

//input鼠标选中
function getSelectionText() {
    if(window.getSelection) {
        return window.getSelection().toString();
    } else if(document.selection && document.selection.createRange) {
        return document.selection.createRange().text;
    }
    return '';
}


//高亮单元格

function lightTd(tmp) {

    var posY = tmp.match(/^[a-zA-Z]{1}/gi);

    var posX = tmp.match(/\+?[1-9][0-9]*$/g);

    posY = posY.toString();

    posY = posY.toLocaleLowerCase().charCodeAt(0) - 96;

    posY--;

    posX = posX.toString() - 1;

    if (posY === null || posX === null || posY.length === 0 || String(posY).length === 0) {

        return;

    }

    var lTd = $('td[cols=' + (posX + 1) + '][rows=' + (posY + 1) + ']');

    var width = lTd[0].offsetWidth,

        height = lTd[0].offsetHeight;

    var left = lTd[0].offsetLeft,

        top = lTd[0].offsetTop;

    t.CreateMask(left, top, width, height, posX, posY);

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

    if (posY === null || posX === null || posY.length === 0 || String(posX).length === 0) {

        return;

    }

    posY--;

    posX = posX.toString() - 1;

    $('[mpos="' + posX + '-' + posY + '"]').remove();

}

//字符串取异

function getUniqueSet(setA, setB) {

    var temp = {};

    for (var i = 0, len = setA.length; i < len; i++) {

        temp[setA[i]] = 0;

    }

    for (var j = 0, len = setB.length; j < len; j++) {

        if (typeof temp[setB[j]] === 'undefined') {

            temp[setB[j]] = 0;

        } else {

            temp[setB[j]]++;

        }

    }

    //output

    var ret = [];

    for (var item in temp) {

        !temp[item] && ret.push(item);

    }

    return ret;

}

//取消冒泡

function stopPropagation(e) {

    var e = window.event || arguments[0];

    if (e.stopPropagation) {

        e.stopPropagation();

    } else {

        e.cancelBubble = true;

    }

}


//数字转字母 27->AA

function IntToChr(index) {

    var start = 65;

    var str = '';

    if (Math.floor(index / 26) > 0) {

        str += IntToChr(Math.floor(index / 26) - 1);

    }

    str += String.fromCharCode(index % 26 + start);

    return str;

}

function containsArray(array, obj) {

    for (var i = 0; i < array.length; i++) {

        if (array[i] === obj) {

            return i;

            break;

        }

    }

    return -1;

}

// Array.prototype.contains = function (obj) {
//
//     return containsArray(this, obj);
//
// };

ITable.prototype.Init = function () {

    var tOption = this.tabs;

    this.CreateContent();

    this.CreateXAxis();

    this.CreateYAxis();

    this.SetCss();

    this.FillTd();

    this.TableScroll();

    this.CreateTip();

    this.CreateFooter();

    this.CreateHeader();

    this.ListenHeight();

    tOption.fontFamily && this.FontFamily();

    tOption.fontSize && this.FontSize();

    tOption.fontBold && this.FontBold();

    tOption.fontItalic && this.FontItalic();

    tOption.fontOverLine && this.FontOverLine();

    tOption.fontColor && this.FontColor();

    tOption.fontBgColor && this.BgColor();

    tOption.mergeTd && this.MergeTd();

    tOption.splitTd && this.SplitTd();

    tOption.textAlign && this.TextAlign();

    this.TextArea();

    this.Express();

    this.InsertCol();

    this.InsertRow();

    this.DeleteCol();

    this.DeleteRow();

    this.AddSheet();

    this.SheetMove();

    this.SetIndex();

    this.FillBlank();

    this.rMenus();

    this.BlueBorder();

    this.FrameSelect();

    this.KeyCursor();

    this.LeftBar();

    this.charts();

    this.dataSource();

    this.dataSet();

    this.dataSearch();

    this.LargeCol();

    this.LargeRow();



    this.CornerCopy();

    // this.saveBtn();

    this.FillType();

    this.ChooseCol();

    this.ChooseRow();

    this.freezeTd();
};

var settings = {

    rowCount: 100,

    cellCount: 100,

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

            'fclass': 'fc_yellow'

        },

        'green': {

            'tdclass': 'ffc_green',

            'fclass': 'fc_green'

        },

        'orange': {

            'tdclass': 'ffc_orange',

            'fclass': 'fc_orange'

        },

        'blue': {

            'tdclass': 'ffc_blue',

            'fclass': 'fc_blue'

        },

        'aqua': {

            'tdclass': 'ffc_aqua',

            'fclass': 'fc_aqua'

        },

        'purple': {

            'tdclass': 'ffc_purple',

            'fclass': 'fc_purple'

        },

        'black': {

            'tdclass': 'ffc_black',

            'fclass': 'fc_black'

        },

        'white': {

            'tdclass': 'ffc_white',

            'fclass': 'fc_white'

        },

        'grey': {

            'tdclass': 'ffc_grey',

            'fclass': 'fc_grey'

        }

    },

    bgColor: {

        'red': {

            'tdclass': 'ffill_red',

            'fclass': 'fill_red'

        },

        'yellow': {

            'tdclass': 'ffill_yellow',

            'fclass': 'fill_yellow'

        },

        'green': {

            'tdclass': 'ffill_green',

            'fclass': 'fill_green'

        },

        'orange': {

            'tdclass': 'ffill_orange',

            'fclass': 'fill_orange'

        },

        'blue': {

            'tdclass': 'ffill_blue',

            'fclass': 'fill_blue'

        },

        'aqua': {

            'tdclass': 'ffill_aqua',

            'fclass': 'fill_aqua'

        },

        'purple': {

            'tdclass': 'ffill_purple',

            'fclass': 'fill_purple'

        },

        'black': {

            'tdclass': 'ffill_black',

            'fclass': 'fill_black'

        },

        'white': {

            'tdclass': 'ffill_white',

            'fclass': 'fill_white'

        },

        'grey': {

            'tdclass': 'ffill_grey',

            'fclass': 'fill_grey'

        }

    },

    textAlign: {

        'left': {

            'tdclass': 'falign_left',

            'fclass': 'ffalign_left'

        },

        'center': {

            'tdclass': 'falign_center',

            'fclass': 'ffalign_center'

        },

        'right': {

            'tdclass': 'falign_right',

            'fclass': 'ffalign_right'

        }

    },

    express: {

        'sum': 'fx_sum',

        'avg': 'fx_avg',

        'count': 'fx_count',

        'max': 'fx_max',

        'min': 'fx_min'

    },
    fillType: {

        '常规': 'ft_normal',

        '数字': 'ft_number',

        '日期': 'ft_date',

        '会计专用': 'ft_account',

        '百分比': 'ft_percent',

        '文本': 'ft_text'

    }



};

var box = $('.box');

var tabs = {

    fontColor: true,

    fontFamily: true,

    fontSize: true,

    fontBold: true,

    fontItalic: true,

    fontOverLine: true,

    fontBgColor: true,

    mergeTd: true,

    splitTd: true,

    textAlign: true,

};

var t = new ITable(box, settings, tabs);

t.Init();






