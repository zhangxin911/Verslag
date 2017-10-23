"use strict" //严格模式

function iTable(tContainer, tSettings, tabs) {

    this.rowCount = tSettings.rowCount;

    this.cellCount = tSettings.cellCount;

    this.container = tContainer;

    this.settings = tSettings;

    this.tabs = tabs;

    var header, footer, curIndex, tools;

    this.moveLast;

    this.mergeTds=new Array();
}

iTable.prototype.createContent = function (tid) {

    var tId = tid || 1;

    var myContainer = this.container;

    myContainer.empty();

    var tb = $("<table class='dataTable' id='iTable" + tId + "'></table>");

    myContainer.append(tb);

    for (var i = 0; i < this.rowCount; i++) {

        var tr = this.createTr();

        var th = $('<th></th>');

        var colG = $('<colgroup></colgroup>');

        tr.append(th);

        for (var j = 0; j < this.cellCount + 1; j++) {

            var td = this.createTd('ftNormal fsize_14 font_Black','');

            if (j === 0) {

                var col = $('<col style="width:63px">');

            } else {

                var col = $('<col style="width:100px">');

            }

            colG.append(col);

            if (i === 0) {

                $("#iTable" + tId).append(colG);

            }

            tr.append(td);

        }

        $("#iTable" + tId).append(tr);

    }

    this.setIndex();

}

iTable.prototype.createTr = function () {

    var tr = $("<tr></tr>");

    return tr;

}

iTable.prototype.createTd = function (className, tdValue) {

    var td = $("<td>" + tdValue + "</td>");
    td.attr('class',className);
    return td;

}

iTable.prototype.createXaxis = function () {

    var xAxis = $("<div class='xOrder'></div>");

    xAxis.empty();

    var xTable = $("<table class='titleTable' id='titleTable'></table>");

    var th = $('<th></th>');

    xAxis.insertBefore(this.container);

    xAxis.append(xTable);

    var tr = $("<tr></tr>");

    tr.append(th);

    for (var i = 0; i < 1; i++) {

        var colG = $('<colgroup></colgroup>');

        for (var j = 0; j < this.cellCount + 1; j++) {

            var td = $("<td>" + IntToChr(j) + "</td>");

            if (j === 0) {

                var col = $('<col style="width:63px">');

            } else {

                var col = $('<col style="width:100px">');

            }

            colG.append(col);

            if (i === 0) {

                xTable.append(colG);

            }

            tr.append(td);

        }

        xTable.append(tr);

    }

}

iTable.prototype.createYaxis = function () {

    var yAxis = $("<div class='yOrder'></div>");

    var yTable = $("<table class='leftTable' id='leftTable'></table>");

    yAxis.empty();

    yAxis.insertBefore(this.container);

    yAxis.append(yTable);

    for (var i = 0; i < this.rowCount; i++) {

        var tr = $("<tr></tr>");

        for (var j = 0; j < 1; j++) {

            var th = $("<td>" + (i + 1) + "</td>");

            th.appendTo(tr);

        }

        yTable.append(tr);

    }

}

iTable.prototype.createTip = function () {

    var content = $('<div class="greyBlock"></div>'),

        tLeft = $('.yOrder'),

        tHead = $('.xOrder');

    var bLeft = tLeft.find('table tr:first td:first').outerWidth(),

        bTop = tHead.find('table tr:first td:first').outerHeight();

    content.css({
        'width': bLeft,
        'height': bTop,
    });


    $(this.container).append(content);

}

iTable.prototype.frameSelect = function () {

    var that=this;
    var coords;

    $('.dataTable tr td').each(function(){
        $(this).off('mouseover').on('mouseover',function(){
            coords=$(this);
            that.moveLast=$(this);
        });
    });

    $(this.container).off('mousedown').on('mousedown',function(event){

        var ev = window.event || arguments[0];

        var onCols = parseInt($(coords).attr('cols')) ;

        var onRows = parseInt($(coords).attr('rows')) ;

        var onCspan = parseInt($(coords).attr('colspan'))  || 1;

        var onRspan = parseInt($(coords).attr('rowspan'))  || 1;

        var xMin = onCols,yMin = onRows;

        var sleft = parseInt($(this).scrollLeft());

        var stop = parseInt($(this).scrollTop());

        var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());

        var oX = ev.clientX + sleft;

        var oY = ev.clientY - disHeight + stop;


        $(that.container).off('mousemove').on('mousemove',function(){

            var nCols = parseInt($(coords).attr('cols')) ;

            var nRows = parseInt($(coords).attr('rows')) ;

            var nCspan = parseInt($(coords).attr('colspan'))  || 1;

            var nRspan = parseInt($(coords).attr('rowspan'))  || 1;

            var expectX = nCols + nCspan-1;

            var expectY = nRows + nRspan-1;

            var xMax=expectX,yMax=expectY;

            var evt = window.event || arguments[0];
            var _x,_y;

            var moveCS=isNaN(Number(that.moveLast.attr('colspan')))?1:Number(that.moveLast.attr('colspan'));
            var moveRS= isNaN(Number(that.moveLast.attr('rowspan')))?1:Number(that.moveLast.attr('rowspan'));

            var moveX=Number(that.moveLast.attr('cols'))+moveCS-1;
            var moveY=Number(that.moveLast.attr('rows'))+moveRS-1;

            _x = (evt.x || evt.clientX);

            _y = (evt.y || evt.clientY);

            _x = _x + sleft;

            _y = _y + stop - disHeight;

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


           $('.dataTable tr td').removeClass('picked');

            for(var m=0;m<that.mergeTds.length;m++){
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
            var widthArr=[],heightArr=[];

            for(var i = startX; i <= endX ; i++) {
                for(var j = startY; j <= endY; j++) {
                            var id='#'+j+'-'+i;
                            $(id).addClass('picked');

                            if(i==startX){
                                totalHeight+=$('#'+j+'-'+startX).outerHeight();
                            }
                            if(j==startY){
                                totalWidth+=$('#'+startY+'-'+i).outerWidth();
                            }

                }

            }

            var sTop=$(this).scrollTop()-96;
            var sLeft=$(this).scrollLeft()-4;

            var top=$('#'+startY+'-'+startX).offset().top+sTop;
            var left=$('#'+startY+'-'+startX).offset().left+sLeft;

            that._setBlueBorder(top,left,totalWidth,totalHeight);

           // that.setBlueBorder($('.picked'));




            // if(_x-oX>20){
            //
            //     if(_y-oY>20){
            //         //E-S 东南
            //         xMin=onCols,yMin=onRows;
            //
            //     }else{
            //         //E-N 东北
            //        xMin=onCols,yMin=onRows + onRspan-1;
            //
            //     }
            // }else{
            //     if(_y-oY>20){
            //         // W-S 西南
            //         xMin=onCols+onCspan-1,yMin=onRows;
            //     }else{
            //         //W-N  西北
            //         xMin=onCols+onCspan-1,yMin=onRows+onRspan-1;
            //     }
            //
            // }
            //
            //
            //
            //
            // if(xMin<=xMax&&yMin<=yMax){
            //     for(var i = xMin; i <= xMax ; i++) {
            //         for(var j = yMin; j <= yMax; j++) {
            //             var id='#'+j+'-'+i;
            //
            //             $(id).addClass('picked');
            //
            //         }
            //
            //     }
            // }else if(xMin<=xMax&&yMin>yMax){
            //     for(var i = xMin; i <= xMax ; i++) {
            //         for(var j = yMax; j <= yMin; j++) {
            //             var id='#'+j+'-'+i;
            //             $(id).addClass('picked');
            //
            //         }
            //
            //     }
            // }else if(xMin>xMax&&yMin<yMax){
            //     for(var i = xMax; i <= xMin ; i++) {
            //         for(var j = yMin; j <= yMax; j++) {
            //             var id='#'+j+'-'+i;
            //
            //             $(id).addClass('picked');
            //
            //         }
            //
            //     }
            // }else{
            //     for(var i = xMax; i <= xMin ; i++) {
            //         for(var j = yMax; j <= yMin; j++) {
            //             var id='#'+j+'-'+i;
            //
            //             $(id).addClass('picked');
            //
            //         }
            //
            //     }
            //
            // }
            //


        });
        $(that.container).on('mouseup',function(){
            $(this).off('mousemove');
        });

    });
}



iTable.prototype.textArea=function(){
     var div=$('<div class="iTableInputHolder" id="iTableInputHolder"></div>');
     var textArea=$('<input type="text" class="iTableInput" id="iTableInput">');
     div.append(textArea);
     $(this.container).append(div);

}

iTable.prototype.setTextArea=function(visible){
    if($('.picked').length>0){
        var w = $('.picked').width();
        var h = $('.picked').height();
        var x = $('.picked').offset().left+$(this.container).scrollLeft();
        var y=$('.picked').offset().top+$(this.container).scrollTop()-parseInt($(this.container).css('margin-top'));

        if(visible===1){
            $('#iTableInputHolder').show();
        }else{
            $('#iTableInputHolder').hide();
        }

        $('#iTableInputHolder').css({
            'left':x,
            'top':y,
        });

        $('#iTableInput').css({
            'width':w,
            'height':h
        });
    }


}



iTable.prototype.hideTextArea=function(){
    $('#iTableInputHolder').hide();

}

iTable.prototype.fillExTextArea=function(eType,val,ex){

}

iTable.prototype.fillTextArea=function(eType,val){

    var that=this;
    switch(eType)
    {
        case 'dblclick':
            $('#iTableInput').val('');
            $(document).off('keydown');
            $('#iTableInput').focus().val(val);
            $("#iTableInput").on('change',function(){
                $('#ip_fx').val($(this).val());
                that.isExpress($('#iTableInput').val());
                event.stopPropagation();
            });
            $('#iTableInput').off('keyup').on('keyup',function(){
                if (event.keyCode === 13) {
                    var content = $('#iTableInput').val();
                    var curClass=$('.picked').attr('class');

                    $('.picked').html(that.typeToValue(curClass,content));

                    var pNode=$($('.picked').attr('pnode'));
                    var ex=pNode.attr('ex');
                    if(!!ex){
                        var exArr=ex.split('/');
                        var type=exArr[0];
                        var pValue=that.typeFormula(type,exArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').blur();
                    that.fillTd();
                    that.frameSelect();
                    that.keyCursor();
                    that.hideTextArea();
                }
            });
            break;
        case 'keymove':
            $('#iTableInput').focus();
            break;
        default:
            console.log('moren');
    }
}

iTable.prototype.isExpress=function(val){
    var textVal=val;

    if(textVal.match(/^\=/g)||textVal.match(/^\+/g)||textVal.match(/^\-/g)){
        //    /(\=|\+|\-|\*|\/)([a-z]|[A-Z])+([1-9]*)/g
        $('.dataTable tr td').off('dblclick');
        $(this.container).off('mousedown');
        var coordinates;
            $('.dataTable tr td').off('click').on('click',{coordinate:coordinates},function(event){

                $('#iTableInput').focus();
                var typePosition=Number($('#iTableInput').iGetFieldPos());
                event.data.coordinate=IntToChr(Number($(this).attr('cols'))-2)+$(this).attr('rows');
                if(typePosition===$('#iTableInput').val().length){
                      console.log(1);
                    if($('#iTableInput').val().slice(-1)==='+'||$('#iTableInput').val().slice(-1)==='-'||$('#iTableInput').val().slice(-1)==='*'||$('#iTableInput').val().slice(-1)==='/'){

                        $('#iTableInput').val($('#iTableInput').val()+event.data.coordinate);

                    }else{

                        var lastLength=String(_.last($('#iTableInput').val().split(/\=|\+|\-|\*|\//g))).length;
                        $('#iTableInput').iDelField(lastLength);
                        $('#iTableInput').iAddField(event.data.coordinate);

                    }
                }else{
                    if(($('#iTableInput').val()).charAt(typePosition+1).match(/\=|\+|\-|\*|\//g)){
                        console.log($('#iTableInput').val().charAt(typePosition));
                    }
                    // var v=$('#iTableInput').val();
                    // v=v.replace(getSelectionText(),event.data.coordinate);
                  //  $('#iTableInput').val(v);

                    $('#iTableInput').iAddField(event.data.coordinate);
                }


            });


    }else{
        this.fillTd();
        this.frameSelect();
    }
}






iTable.prototype.keyCursor = function () {

    var that = this;

    $(document).off('keydown').on('keydown', {

        time: "0",

        lastTd: "",

        fixX: "",

        fixY: "",

        keyCode: "",

        callZ: that

    }, typing);

}




function typing(event) {

    var sNode = $('.picked');

    var callZ = event.data.callZ;

    if ($('.picked').length == 1) {

        if (event.keyCode == '8' || event.keyCode == '18' || event.keyCode == '16' || event.keyCode == '9') {

            return;

        }

        callZ.setTextArea(1);

        callZ.fillTextArea('keymove');


        var nowX = parseInt($(sNode).attr('cols'));

        var nowY = parseInt($(sNode).attr('rows'));

        var colAdd = parseInt($(sNode).attr('colspan')) - 1 || 0;

        var rowAdd = parseInt($(sNode).attr('rowspan')) - 1 || 0;

        nowX += colAdd;

        nowY += rowAdd;


        event.data.time = parseInt(event.data.time) + 1;

        if (event.data.time == 1) {

            //获取第一次点击的单元格

            event.data.lastTd = sNode;

            event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

            event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

        }

        //↓

        if (event.keyCode == '13' || event.keyCode == '40') {


            if(event.target==$('#iTableInput')[0]){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.typeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1;i<exArr.length;i++){
                        var id='#'+exArr[i];

                        $(id).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }




            }


            if ($(event.data.lastTd)[0] != $(sNode)[0]) {

                if (event.data.fixX != nowX) {

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

                callZ.setBlueBorder($(id));

                callZ.setTextArea(0);

            } else {
                for(var i=0;i<callZ.mergeTds.length;i++){


                }



                // var _nowY = nowY + 1;
                //
                // var _nowX = nowX + 1;
                //
                // while (_nowY >= 0) {
                //
                //     while (_nowX >= 0) {
                //         var nid='#'+_nowY+'-'+_nowX;
                //
                //         var nextRowspan = parseInt($(nid).attr('rowspan'));
                //
                //         var nextColspan = parseInt($(nid).attr('colspan'));
                //
                //
                //         $(sNode).removeClass('picked');
                //
                //         //下一个单元格行列不合并
                //
                //         if (!nextRowspan && !nextColspan) {
                //             var nid='#'+nextY+'-'+nextX;
                //
                //             $(nid).addClass('picked');
                //
                //             callZ.setBlueBorder($(nid));
                //
                //             callZ.setTextArea(0);
                //
                //         }
                //
                //         //下一个单元格只列合并
                //
                //         if (!nextRowspan && nextColspan) {
                //
                //             var nid='#'+nextY+'-'+_nowX;
                //
                //             $(nid).addClass('picked');
                //
                //             callZ.setBlueBorder($(nid));
                //
                //             callZ.setTextArea(0);
                //
                //         }
                //
                //         //下一个单元格只行合并
                //
                //         if (nextRowspan && !nextColspan) {
                //
                //             var nid='#'+nextY+'-'+_nowX;
                //
                //             $(nid).addClass('picked');
                //
                //             callZ.setBlueBorder($(nid));
                //
                //             callZ.setTextArea(0);
                //
                //         }
                //
                //         //下一个单元格行列合并
                //
                //         if (nextRowspan && nextColspan) {
                //             var nid='#'+_nowY+'-'+_nowX;
                //
                //             $(nid).addClass('picked');
                //
                //             callZ.setBlueBorder($(nid));
                //
                //             callZ.setTextArea(0);
                //
                //         }
                //
                //         _nowX--;
                //
                //     }
                //
                //     _nowY--;
                //
                // }

            }

            event.data.keyCode = event.keyCode;

            callZ.lightCoor($('.picked'));

        }

        //→

        if (event.keyCode == '39') {

            if(event.target==$('#iTableInput')[0]){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.typeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1;i<exArr.length;i++){
                        var id='#'+exArr[i];

                        $(id).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }
            }

            if ($(event.data.lastTd)[0] != $(sNode)[0]) {

                if (event.data.fixY != nowY) {

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

                // $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                $(id).addClass('picked');

                callZ.setBlueBorder($(id));

                callZ.setTextArea(0);

            } else {

                var _nowY = nowY + 1;

                var _nowX = nowX + 1;

                while (_nowX >= 0) {

                    while (_nowY >= 0) {

                        var nid='#'+_nowY+'-'+_nowX;

                   //     var nextRowspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('rowspan'));

                        var nextRowspan = parseInt($(nid).attr('rowspan'));

                        // var nextColspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('colspan'));

                        var nextColspan = parseInt($(nid).attr('colspan'));

                        $(sNode).removeClass('picked');

                        //下一个单元格行列不合并

                        if (!nextRowspan && !nextColspan) {

                            var nid='#'+nextY+'-'+nextX;

                           // $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                            $(nid).addClass('picked');

                            callZ.setBlueBorder($(nid));

                            callZ.setTextArea(0);

                        }

                        //下一个单元格只行合并

                        if (!nextRowspan && nextColspan) {

                            var nid='#'+nextY+'-'+_nowX;

                           // $('td[cols=' + _nowX + '][rows=' + nextY + ']').addClass('picked');

                            $(nid).addClass('picked');

                            callZ.setBlueBorder($(nid));

                            callZ.setTextArea(0);

                        }

                        //下一个单元格只列合并

                        if (nextRowspan && !nextColspan) {

                            var nid='#'+_nowY+'-'+nextX;

                        //    $('td[cols=' + nextX + '][rows=' + _nowY + ']').addClass('picked');

                            $(nid).addClass('picked');

                            callZ.setBlueBorder($(nid));

                            callZ.setTextArea(0);

                        }

                        //下一个单元格行列合并

                        if (nextRowspan && nextColspan) {

                            var nid='#'+_nowY+'-'+_nowX;

                         //   $('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');

                            $(nid).addClass('picked');

                            callZ.setBlueBorder($(nid));

                            callZ.setTextArea(0);

                        }

                        _nowY--;

                    }

                    _nowX--;

                }

            }

            event.data.keyCode = event.keyCode;

            callZ.lightCoor($('.picked'));

        }

        //←

        if (event.keyCode == '37') {

            var r1 = 0,

                r2 = 0,

                r3 = 0;

            if(event.target==$('#iTableInput')[0]){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.typeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1;i<exArr.length;i++){
                        var id='#'+exArr[i];

                        $(id).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }
            }

            if ($(event.data.lastTd)[0] != $(sNode)[0]) {

                if (event.data.fixX != nowX) {

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

            var nextX = parseInt(nowX - 1);

            var nextY = parseInt(event.data.fixY);

            var id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

              //  $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                $(id).addClass('picked');

                callZ.setBlueBorder($(id));

                callZ.setTextArea(0);

            } else {

                var _nowY = nowY;

                var _nowX = nowX;

                while (_nowY >= 0) {

                    _nowX = nowX;

                    while (_nowX >= 0) {
                        var _nid='#'+_nowY+'-'+_nowX;

                        var nextRowspan = parseInt($(_nid).attr('rowspan'));

                        var nextColspan = parseInt($(_nid).attr('colspan'));

                        var lastColspan = parseInt($(sNode).attr('colspan')) - 1;

                        var lastRowspan = parseInt($(sNode).attr('rowspan')) - 1;

                        $(sNode).removeClass('picked');

                        //下一个单元格行列不合并

                        if (!nextRowspan && !nextColspan) {

                            var nid='#'+nextY+'-'+(nextX - lastColspan);

                          //  $('td[cols=' + (nextX - lastColspan) + '][rows=' + nextY + ']').addClass('picked');
                            $(nid).addClass('picked');

                            callZ.setBlueBorder($(nid));

                            callZ.setTextArea(0);


                        }

                        //下一个单元格只列合并

                        if (!nextRowspan && nextColspan) {

                            var nid='#'+nextY+'-'+(nextX - nextColspan + 1);

                            if ($(nid).length > 0) {

                                r1++;

                                if (r1 == 1) {

                               //     $('td[cols=' + (nextX - nextColspan + 1) + '][rows=' + nextY + ']').addClass('picked');
                                    $(nid).addClass('picked');

                                    callZ.setBlueBorder($(nid));

                                    callZ.setTextArea(0);

                                }

                            }

                        }

                        //下一个单元格只行合并

                        if (nextRowspan && !nextColspan) {
                            var nid='#'+_nowY+'-'+nextX;

                            if ($(nid).length > 0) {

                                r2++;

                                if (r2 == 1) {

                              //      $('td[cols=' + nextX + '][rows=' + _nowY + ']').addClass('picked');
                                    $(nid).addClass('picked');

                                    callZ.setBlueBorder($(nid));

                                    callZ.setTextArea(0);

                                }

                            }

                        }

                        //下一个单元格行列合并

                        if (nextRowspan && nextColspan) {
                            var nid='#'+_nowY+'-'+_nowX;
                            if ($(nid).length > 0) {

                                r3++;

                                if (r3 == 1) {


                                //    $('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');
                                    $(nid).addClass('picked');

                                    callZ.setBlueBorder($(nid));

                                    callZ.setTextArea(0);

                                }

                            }

                        }

                        _nowX--;

                    }

                    _nowY--;

                }

            }

            event.data.keyCode = event.keyCode;

            callZ.lightCoor($('.picked'));

        }

        //↑

        if (event.keyCode == '38') {

            var u1 = 0,

                u2 = 0,

                u3 = 0;

            if(event.target==$('#iTableInput')[0]){

                var curClass=$('.picked').attr('class');
                var ex=$('.picked').attr('ex');
                if(!ex){
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.typeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    $('#iTableInput').val(' ');
                }else{
                    $('.picked').html(callZ.typeToValue(curClass,$('#iTableInput').val()));

                    var exArr=ex.split('/');

                    for(var i=1;i<exArr.length;i++){
                        var id='#'+exArr[i];

                        $(id).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    $('#iTableInput').val(' ');
                }
            }

            if ($(event.data.lastTd)[0] != $(sNode)[0]) {

                if (event.data.fixX != nowX) {

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

             //   $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');
                $(id).addClass('picked');

                callZ.setBlueBorder($(id));

                callZ.setTextArea(0);

            } else {

                var _nowY = nowY;

                var _nowX = nowX;

                while (_nowX >= 0) {

                    _nowY = nowY;

                    while (_nowY >= 0) {
                        var _nid='#'+_nowY+'-'+_nowX;

                        var nextRowspan = parseInt($(_nid).attr('rowspan'));

                        var nextColspan = parseInt($(_nid).attr('colspan'));

                        var lastColspan = parseInt($(sNode).attr('colspan')) - 1;

                        var lastRowspan = parseInt($(sNode).attr('rowspan')) - 1;

                        $(sNode).removeClass('picked');

                        //下一个单元格行列不合并

                        if (!nextRowspan && !nextColspan) {

                            var nid='#'+(nextY - lastRowspan)+'-'+nextX;

                            //$('td[cols=' + nextX + '][rows=' + (nextY - lastRowspan) + ']').addClass('picked');

                            $(nid).addClass('picked');

                            callZ.setBlueBorder($(nid));

                            callZ.setTextArea(0);

                        }

                        //下一个单元格只列合并

                        if (!nextRowspan && nextColspan) {
                            var nid='#'+nextY+'-'+_nowX;

                            if ($(nid).length > 0) {

                                u1++;

                                if (u1 === 1) {



                                    $(nid).addClass('picked');

                                //    $('td[cols=' + _nowX + '][rows=' + nextY + ']').addClass('picked');

                                    callZ.setBlueBorder($(nid));

                                    callZ.setTextArea(0);

                                }

                            }

                        }

                        //下一个单元格只行合并

                        if (nextRowspan && !nextColspan) {

                            var nid='#'+_nowY+'-'+nextX;

                            if ($(nid).length > 0) {

                                u2++;

                                if (u2 === 1) {

                                   // $('td[cols=' + nextX + '][rows=' + _nowY + ']').addClass('picked');

                                    $(nid).addClass('picked');

                                    callZ.setBlueBorder($(nid));

                                    callZ.setTextArea(0);

                                }

                            }

                        }

                        //下一个单元格行列合并

                        if (nextRowspan && nextColspan) {

                            var nid='#'+_nowY+'-'+_nowX;

                            if ($(nid).length > 0) {

                                u3++;

                                if (u3 === 1) {


                                    //$('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');

                                    $(nid).addClass('picked');

                                    callZ.setBlueBorder($(nid));

                                    callZ.setTextArea(0);

                                }

                            }

                        }

                        _nowY--;

                    }

                    _nowX--;

                }

            }

            event.data.keyCode = event.keyCode;

            callZ.lightCoor($('.picked'));

        }



        if ($('.picked').length > 0) {

            var xCoo = Number($('.picked').attr('cols')) - 1,

                yCoo = Number($('.picked').attr('rows')) - 1;

            $('.disbox').text(IntToChr(xCoo) + String(yCoo + 1));

        }

    } else {

        return;

    }

}

iTable.prototype.getCurTable = function () {

    var t;

    t = this.container.find('table:visible');

    return t

}

iTable.prototype.setCss = function () {

    var viewWidth = $(window).width(),

        viewHeight = $(window).height();

    var tBody = this.getCurTable().parent(),

        tLeft = $('.yOrder'),

        tHead = $('.xOrder');

    var bLeft = tLeft.find('table tr:first td:first').outerWidth() + 1;

    var bTop = tHead.find('table tr:first td:first').outerHeight() + 1;

    tLeft.css({
        'height': viewHeight,
    });

    tHead.css({
        'width': viewWidth,
    });


    tBody.css({

        'margin-left': 4,

        'margin-top': bTop + 70,

        'width': viewWidth - 4,

        'height': viewHeight - bTop - 110,

        'overflow': 'scroll',

        'position': 'relative'

    });

    var that = this.container;

    $(window).resize(function () {

        var viewWidth = $(window).width();

        var viewHeight = $(window).height();

        that.width(viewWidth - 4);

        that.height(viewHeight - bTop - 113);
        $('.yOrder').height(viewHeight - bTop - 113);

    });

}

//滚动

iTable.prototype.tableScroll = function () {
    this.container.on('scroll',function(){
        var scrollY = $(this).scrollTop();

        var scrollX = $(this).scrollLeft();

        $(".yOrder table").css('margin-top', -scrollY);

        $(".xOrder table").css('margin-left', -scrollX);

    });


}

//填写表格

iTable.prototype.fillTd = function (tid) {

    var event = window.event || arguments[0];

    var tid = tid || 1;

    var that = this;

    $('#iTable' + tid).find('tr td').each(function () {

       $(this).off('dblclick').on('dblclick',{target:that,id:tid},that.tdDbClick);

       $(this).off('click').on('click',{target:that},that.tdClick);

    });

}


iTable.prototype.tdClick=function(event){

    $('#iTableInputHolder').hide();

    $('#iTableInput').blur();

    $('.picked').removeClass('picked');

    $(this).addClass('picked');

     event.data.target.setBlueBorder($(this));

    var xCoo = Number($(this).attr('cols')) - 1,

        yCoo = Number($(this).attr('rows')) - 1;

    if ($('.disbox').length > 0) {

        $('.disbox').text(IntToChr(xCoo) + String(yCoo + 1));

    }
    event.data.target.tdTofx($(this));
    event.data.target.lightCoor($(this));
    $('#ip_fx').blur();
}


iTable.prototype.tdDbClick=function(event){
    var tdText = $(this).text();
    var eType='dblclick';
    var ex=$(this).attr('ex');
    event.data.target.setTextArea(1);
    if(!!ex){
        event.data.target.fillExTextArea(eType,tdText,ex);
    }else{
        event.data.target.fillTextArea(eType,tdText);

    }

    $("#iTableInput").click(function () {
        return false;
    });

    $('#iTable' + event.data.id + ' tr td').not($(this)).click(function (event) {
        $('#iTableInput').blur();
    });
    stopPropagation();
}


iTable.prototype.blueBorder=function(){
    var wBorder = $('<div class="wBorder"></div>');
    wBorder.css({
        'top': 0,
        'left': 0,

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

    var corner = $('<div class="scorner"></div>');

    //红色

    var wrBorder = $('<div class="wrBorder"></div>');

    wrBorder.css({

        'top': 0,

        'left': 0,

        'display':'none'

    });

    var toprB = $('<div></div>');

    toprB.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(toprB);

    var leftrB = $('<div></div>');

    leftrB.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(leftrB);

    var rightrB = $('<div></div>');

    rightrB.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    wrBorder.append(rightrB);

    var bottomrB = $('<div></div>');

    bottomrB.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'red'

    });




    wrBorder.append(bottomrB);

    wBorder.append(bottomB);

    wBorder.append(corner);

    this.container.append(wBorder);

    this.container.append(wrBorder);


}


iTable.prototype.setRedBorder=function(obj){
    if($(obj).length>0){
        var topArr = [], leftArr = [];

        var topMin, leftMin, totalWidth = 0, totalHeight = 0;

        for (var i = 0; i < obj.length; i++) {

            var top = obj[i].offsetTop,

                left = obj[i].offsetLeft,

                width = obj[i].offsetWidth,

                height = obj[i].offsetHeight;

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

           // var col = parseInt($(obj[i]).attr('cols')) + parseInt($(obj[i]).attr('colspan'));

            topMin = _.min(topArr), leftMin = _.min(leftArr);

            if (top == _.min(topArr)) {

                totalWidth += width;

            }

            if (left == _.min(leftArr)) {

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

                'top': 0,

            });

            $('.wrBorder').find('div').eq(1).css({
                'width': totalWidth,

                'height': '2px',

                'left': 0,

                'top': totalHeight,
            });

            $('.wrBorder').find('div').eq(2).css({

                'width': '2px',

                'height': totalHeight,

                'left': 0,

                'top': 0,

            });

            $('.wrBorder').find('div').eq(3).css({
                'width': '2px',

                'height': totalHeight,

                'left': totalWidth,

                'top': 0,

            });

        }


    }else{

    }
}


iTable.prototype.hideReadBorder=function(){
    $('.wrBorder').hide();
}

iTable.prototype._setBlueBorder=function(top,left,totalWidth,totalHeight){
    $('.wBorder').css({

        'top': top,

        'left': left,

        'display': 'block'
    });

    $('.wBorder').find('div').eq(0).css({

        'width': totalWidth,

        'height': '2px',

        'left': 0,

        'top': 0,

    });

    $('.wBorder').find('div').eq(1).css({
        'width': totalWidth,

        'height': '2px',

        'left': 0,

        'top': totalHeight,
    });

    $('.wBorder').find('div').eq(2).css({

        'width': '2px',

        'height': totalHeight,

        'left': 0,

        'top': 0,

    });

    $('.wBorder').find('div').eq(3).css({
        'width': '2px',

        'height': totalHeight,

        'left': totalWidth,

        'top': 0,

    });

    $('.scorner').css({

        'top':  totalHeight - 2,

        'left': totalWidth - 2,

    });
}

iTable.prototype.setBlueBorder=function(obj){

       if($(obj).length>0){
           var topArr = [], leftArr = [];

           var topMin, leftMin, totalWidth = 0, totalHeight = 0;

           for (var i = 0; i < obj.length; i++) {

               var top = obj[i].offsetTop,

                   left = obj[i].offsetLeft,

                   width = obj[i].offsetWidth,

                   height = obj[i].offsetHeight;

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

               var col = parseInt($(obj[i]).attr('cols')) + parseInt($(obj[i]).attr('colspan'));

               topMin = _.min(topArr), leftMin = _.min(leftArr);

               if (top == _.min(topArr)) {

                   totalWidth += width;

               }

               if (left == _.min(leftArr)) {

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

                   'top': 0,

               });

               $('.wBorder').find('div').eq(1).css({
                   'width': totalWidth,

                   'height': '2px',

                   'left': 0,

                   'top': totalHeight,
               });

               $('.wBorder').find('div').eq(2).css({

                   'width': '2px',

                   'height': totalHeight,

                   'left': 0,

                   'top': 0,

               });

               $('.wBorder').find('div').eq(3).css({
                   'width': '2px',

                   'height': totalHeight,

                   'left': totalWidth,

                   'top': 0,

               });

               $('.scorner').css({

                   'top':  totalHeight - 2,

                   'left': totalWidth - 2,

               });

           }


       }else{

       }

}

iTable.prototype.cornerCopy=function(){
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

            var onCspan = parseInt($(coords).attr('colspan'))  || 1;

            var onRspan = parseInt($(coords).attr('rowspan'))  || 1;

            var oLeft=$(coords).offset().left;

            var oTop=$(coords).offset().top+parseInt($('.header').outerHeight());

            var oexpectX = onCols + onCspan-1;

            var oexpectY = onRows + onRspan-1;

            var xMin = oexpectX,yMin = oexpectY;

            var sleft = parseInt($(this).scrollLeft());

            var stop = parseInt($(this).scrollTop());

            var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());

            var oX = ev.clientX + sleft;

            var oY = ev.clientY - disHeight + stop;

            if($(coords).length>1){
                that.hideReadBorder();
                return;
            }


            $(that.container).on('mousemove', function () {
                var coords=$(that.moveLast);

                var nCols = parseInt($(coords).attr('cols')) ;

                var nRows = parseInt($(coords).attr('rows')) ;

                var nCspan = parseInt($(coords).attr('colspan'))  || 1;

                var nRspan = parseInt($(coords).attr('rowspan'))  || 1;

                if(nCspan>1||nRspan>1){
                    that.hideReadBorder();
                    return;
                }

                var expectX = nCols + nCspan-1;

                var expectY = nRows + nRspan-1;

                var xMax=expectX,yMax=expectY;

                var evt = window.event || arguments[0];
                var _x,_y;

                _x = (evt.x || evt.clientX);

                _y = (evt.y || evt.clientY);

                _x = _x + sleft;

                _y = _y + stop - disHeight;


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



                $('.dataTable tr td').removeClass('picked');

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
                that.setRedBorder($('.picked'));



            });
            $(document).off('mouseup').on('mouseup',function(){
                that.hideReadBorder();
                $('.picked').text(copyVal);
                $(this).off('mouseup');
                $(that.container).off('mousedown');
                $(that.container).off('mousemove');
                that.frameSelect();
            });


        });
    });
}


iTable.prototype.chooseRow=function(){
    var that=this;
    $('#leftTable tr td').on('click',function(){
        var index=$(this).parent().index()+1;

        var startYArr=[],endYArr=[];
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
        for(var i=0;i<=that.cellCount;i++){
            var id='#'+index+'-'+i;
            if(Number($(id).attr('rowspan'))>=2&&Number($(id).attr('colspan'))>=2){

            }else{
                $(id).addClass('picked');
            }

        }

        that.lightCoor($('.picked'));





    });
}

iTable.prototype.chooseCol=function(){
    var that=this;
    $('#titleTable tr td').on('click',function(){
        var index=Number($(this).index())+1;
        var startXArr=[],endXArr=[];

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
        for(var l=0;l<=that.rowCount;l++){
            var id='#'+l+'-'+index;
            if(Number($(id).attr('rowspan'))>=2&&Number($(id).attr('colspan'))>=2){

            }else{
                $(id).addClass('picked');
            }

        }
        that.lightCoor($('.picked'));

    });
}


iTable.prototype.getTdStyle=function(obj){
    var td=$(obj);
    if(td.length===1&&td.length>0){
        var classArr=(td.attr('class')).split(' ');

        for(var i=0;i<classArr.length;i++){
            if(!!classArr[i].match(/(((fsize_)[A-Za-z0-9_]+s*)+)/g)) {
                switch (classArr[i]) {
                    case 'fsize_10':
                        $('#fontSize').text('10')
                        break;
                    case 'fsize_12':
                        $('#fontSize').text('12')
                        break;
                    case 'fsize_14':
                        $('#fontSize').text('14')
                        break;
                    case 'fsize_16':
                        $('#fontSize').text('16')
                        break;
                    case 'fsize_18':
                        $('#fontSize').text('18')
                        break;
                    case 'fsize_20':
                        $('#fontSize').text('20');
                        break;

                }

            }else if(!!classArr[i].match(/(((font_)[A-Za-z0-9_]+s*)+)/g)) {
                switch (classArr[i]) {
                    case 'font_Song':
                        $('#fontFamily').text('宋体')
                        break;
                    case 'font_Black':
                        $('#fontFamily').text('黑体')
                        break;
                    case 'font_Kai':
                        $('#fontFamily').text('楷体')
                        break;
                    case 'font_Mirco':
                        $('#fontFamily').text('微软雅黑')
                        break;

                }

            }else if(!!classArr[i].match(/(((ft)[A-Za-z0-9_]+\s*)+)/g)) {
                switch (classArr[i]) {
                    case 'ftNormal':
                        $('#fillType').text('常规')
                        break;
                    case 'ftNumber':
                        $('#fillType').text('数字')
                        break;
                    case 'ftDate':
                        $('#fillType').text('日期')
                        break;
                    case 'ftAccount':
                        $('#fillType').text('会计专用')
                        break;
                    case 'ftPercent':
                        $('#fillType').text('百分比')
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

}

iTable.prototype.lightCoor = function (obj) {

    var target = obj;

    this.getTdStyle(obj);

    $('.leftTable tr td').removeClass('lCoo');

    $('.titleTable tr td').removeClass('lCoo');

    for (var t = 0; t < target.length; t++) {

        var cols = parseInt($(target).eq(t).attr('cols')) - 1;

        var rows = parseInt($(target).eq(t).attr('rows')) - 1;

        var cSpan = parseInt($(target).eq(t).attr('colspan')) - 1 || 0;

        var rSpan = parseInt($(target).eq(t).attr('rowspan')) - 1 || 0;

        for (var i = rows; i < rows + rSpan + 1; i++) {

            $('.leftTable').find('tr').eq(i).find('td').addClass('lCoo');

        }

        for (var j = cols; j < cols + cSpan + 1; j++) {

            $('.titleTable tr').find('td').eq(j - 1).addClass('lCoo');

        }

    }

}


iTable.prototype.listenHeight=function(){

    for(var j=0;j<this.rowCount;j++){
        var height=$('.dataTable tr').eq(j).find('th').height()-1;
        $('.leftTable tr').eq(j).find('td').height(height);
    }

}

//创建底部容器

iTable.prototype.createFooter = function () {

    this.footer = $('<div class="footer"></div>');

    this.container.after(this.footer);

    var addBox = $('<div class="addBox"><div class="addSheet"></div></div>');

    this.footer.append(addBox);

    var sheetQueue = $('<div class="sheetQueue"><div><dl class="sheetQueueDl"><dd class="sheet sheetDefault" id="sheet1">1</dd></dl></div></div>');

    this.footer.append(sheetQueue);

    var sheetFloat = $('<div class="sheetFloat"><span class="lSheet"></span><span class="rSheet"></span></div>');

    this.footer.append(sheetFloat);

    this.sheetWork();

}

//创建头部容器

iTable.prototype.createHeader = function () {

    this.header = $('<div class="header"></div>');

    this.tools = $('<div class="tools"></div>');

    this.header.append(this.tools);

    this.header.insertBefore(this.container);

}

//字体类型

iTable.prototype.fontFamily = function () {

    var menu = this.createSelection('fontFamily', this.settings.fontFamily);

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

}

//字体大小

iTable.prototype.fontSize = function () {

    var menu = this.createSelection('fontSize', this.settings.fontSize);

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

        that.listenHeight();

    });

    sel_a.mouseover(function () {

        $(this).css({

            'background': '#ECECEC'

        });

    });

    sel_a.mouseout(function () {

        $(this).css({

            'background': '#FFFFFF'

        });

    });

}

//字体粗细

iTable.prototype.fontBold = function () {

    var simMenu = this.createSimpleMenu('fbold');

    var sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffbold') ? $('.picked').removeClass('ffbold') : $('.picked').addClass('ffbold');

    });

}

//字体倾斜

iTable.prototype.fontItalic = function () {

    var simMenu = this.createSimpleMenu('fitalic');

    var sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffitalic') ? $('.picked').removeClass('ffitalic') : $('.picked').addClass('ffitalic');

    });

}

//字体下划线

iTable.prototype.fontOverline = function () {

    var simMenu = this.createSimpleMenu('foverline');

    var sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffoverline') ? $('.picked').removeClass('ffoverline') : $('.picked').addClass('ffoverline');

    });

}

//字体颜色

iTable.prototype.fontColor = function () {

    var select = this.createCellMenu('d_fcolor', 'fontColor', this.settings.fontColor);

    var td = $(select).find('table tr td');

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

}

//表格背景

iTable.prototype.bgColor = function () {

    var select = this.createCellMenu('d_fill', 'bgColor', this.settings.bgColor);

    var td = $(select).find('table tr td');

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

}

//字符对齐

iTable.prototype.textAlign = function () {

    var select = this.createCellMenu('f_align', 'textAlign', this.settings.textAlign);

    var td  = $(select).find('table tr td');

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

    td.mouseover(function () {

        $(this).css({

            'background': '#ECECEC'

        });

    });

    td.mouseout(function () {

        $(this).css({

            'background': '#FFFFFF'

        });

    });

}

//公式选择

iTable.prototype.express = function () {

    var select = this.createSelection('express', this.settings.express);

    var sel_a = $(select).find('ul li a');

    var that = this;

    sel_a.on('click', function () {

        var ways = $(this).attr('class').replace('fx_', '');

        that.formula(ways);

    });

}

iTable.prototype.fillType = function(){
    var select = this.createSelection('fillType', this.settings.fillType);
    var sel_a = $(select).find('ul li a');

    var that = this;

    sel_a.on('click', function () {

        var ways = $(this).attr('class').replace('ft_', '');

        that.setFilltype(ways);

    });
}

iTable.prototype.getFilltype=function(obj){

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
}

iTable.prototype.setFilltype=function(ways){
    switch (ways){
        case 'normal':
            this.ftNormal();
            break;
        case 'number':
            this.ftNumber();
            break;
        case 'date':
            this.ftDate();
            break;
        case 'account':
            this.ftAccount();
            break;
        case 'percent':
            this.ftPercent();
            break;
        case 'text':
            this.ftText();
            break;
        default:
            break;

    }
}

iTable.prototype.typeToValue=function(type,value){
         var objValue=value,value=Number(value);
         var newClasses=type.split(' ');
         for(var i=0;i<newClasses.length;i++){
             if(!!newClasses[i].match(/(((ft)[A-Za-z0-9_]+\s*)+)/g)){
            var newClass=newClasses[i];
            }
         }
        switch(newClass){
            case 'ftNormal':

                 return objValue;

            case 'ftNumber':

                 return value.toFixed(2);

            case 'ftAccount':

                 return '¥'+ value.toFixed(2);

            case  'ftPercent':

                 return (Math.round(Number(value) * 10000)/100).toFixed(2) + '%';

        }


}

iTable.prototype.ftNormal=function(){
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

                  var newVal=that.typeToValue(curClass,oldVal);

                  selThem.text(newVal);

                  selThem.addClass(curClass);

              }

          });

      }
}

iTable.prototype.ftNumber=function(){
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

                var newVal=that.typeToValue(curClass,oldVal);

                selThem.text(newVal);

                selThem.addClass(curClass);


            }

        });

    }
}

iTable.prototype.ftDate=function(){
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
}

iTable.prototype.ftAccount=function(){
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
}

iTable.prototype.ftPercent=function(){
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
}

iTable.prototype.ftText=function(){
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
}

//列插入

iTable.prototype.insertCol = function () {

    var simMenu = this.createSimpleMenu('editRowCol insertCol', '');

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

            for (var _y = 0; _y < that.rowCount + 1; _y++) {

                var time = 0;

                for (var _x = xMin; _x < xMax + 1; _x++) {

                    var index = xMin;



                  //  if ($('td[cols=' + xMin + '][rows=' + _y + ']').length > 0) {
                    if ($('#' + _y + '-' + xMin ).length > 0) {


                        //$('td[cols=' + xMin + '][rows=' + _y + ']').before('<td style="background:orange"></td>');
                        $('#' + _y + '-' + xMin ).before('<td style="background:orange"></td>');

                    } else {

                        while (index > -1) {

                          //  if ($('td[cols=' + index + '][rows=' + _y + ']').length > 0) {

                            if ($('#' + _y + '-' + index).length > 0) {

                                time++;

                                if (time === 1) {

                                //    $('td[cols=' + index + '][rows=' + _y + ']').after('<td style="background:orange"></td>');
                                    $('#' + _y + '-' + index).after('<td style="background:orange"></td>');
                                }

                            }

                            index--;

                        }

                    }

                }

            }

            that.cellCount = that.cellCount + xMax - xMin + 1;

            that.updateTop(index);

        } else {

            var xIndex = parseInt(sNode.attr('cols'));

            var yIndex = parseInt(sNode.attr('rows'));

            for (var i = 0; i < that.rowCount + 1; i++) {

                var time = 0;

                for (var j = xIndex; j > -1; j--) {

                   // var cols = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('cols'));

                    var cols = parseInt($('#'+i+'-'+j).attr('cols'));



                    if (cols === xIndex) {

                        // var cSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;
                        //
                        // var rSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                        var cSpan = parseInt($('#'+i+'-'+j).attr('colspan')) || 1;

                        var rSpan = parseInt($('#'+i+'-'+j).attr('rowspan')) || 1;

                        if (cSpan >= 2) {

                           // $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cSpan + 1);
                            $('#'+i+'-'+j).attr('colspan', cSpan + 1);

                        } else {

                            if (rSpan > 1) {

                                for (var r = i; r < i + rSpan; r++) {

                                   // $('td[cols=' + (j - cSpan) + '][rows=' + r + ']').after('<td style="background:orange"></td>');
                                    $('#' + r + '-' + (j - cSpan) ).after('<td style="background:orange"></td>');

                                }

                            } else {

                              //  $('td[cols=' + j + '][rows=' + i + ']').before('<td style="background:orange"></td>');
                                $('#' + i + '-' + j ).after('<td style="background:orange"></td>');

                            }

                        }

                    } else {

                    //    if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {

                        if ($('#' + i + '-' + j).length > 0) {

                            time++;

                            if (time === 1) {

                                // var cSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;
                                //
                                // var rSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                                var cSpan = parseInt($('#' + i + '-' + j).attr('colspan')) || 1;

                                var rSpan = parseInt($('#' + i + '-' + j).attr('rowspan')) || 1;

                                if (cSpan >= 2) {

                                    //不同行拓宽

                                    if (!(i < yIndex && (rSpan + i) > yIndex)) {

                                     //   $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cSpan + 1);

                                        $('#' + i + '-' + j).attr('colspan', cSpan + 1);


                                    }

                                }

                            }

                        }

                    }

                }

            }

            that.cellCount++;

            that.updateTop(xIndex);

        }

        that.setIndex();

        that.fillTd();

        that.keyCursor();


    });

}

//行插入

iTable.prototype.insertRow = function () {

    var simMenu = this.createSimpleMenu('editRowCol insertRow', '');

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

            for (var _y = yMin; _y < yMax + 1; _y++) {

                var tr = $('<tr></tr>');

                for (var _x = 0; _x < that.cellCount + 1; _x++) {

                    var th = $('<th></th>');

                    //if ($('td[cols=' + _x + '][rows=' + yMin + ']').length > 0) {
                    if ($('#' + yMin + '-' + _x ).length > 0) {

                        if (_x === 0) {

                            tr.append(th);

                        }

                        tr.append('<td style="background:orange"></td>');

                     //   $('td[cols=' + _x + '][rows=' + yMin + ']').parent().before(tr);

                        $('#' + yMin  + '-' + _x).parent().before(tr);

                    } else {

                        //$('td[cols=' + (_x - 1) + '][rows=' + yMin + ']').parent().after(tr);

                        $('#' + yMin + '-' + _x - 1 ).parent().before(tr);

                    }

                }

            }

        } else {

            var yIndex = parseInt(sNode.attr('rows'));

            var xIndex = parseInt(sNode.attr('cols'));

            for (var i = yIndex; i > -1; i--) {

                var tr = $('<tr></tr>');

                for (var j = 0; j < that.cellCount + 2; j++) {

                //    var rows = $('td[cols=' + j + '][rows=' + i + ']').attr('rows');

                    var rows = $('#' + i + '-' + j ).attr('rows');

                    if (rows === yIndex) {


                        if (j === 2) {

                            var th = $('<th></th>');

                            tr.append(th);

                        }

                       // var rSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                        var rSpan = parseInt($('#' + i + '-' + j ).attr('rowspan')) || 1;

                        if (rSpan >= 2) {

                         //   $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rSpan + 1);

                            $('#' + i + '-' + j ).attr('rowspan', rSpan + 1);

                        } else {

                            tr.append('<td style="background:orange"></td>');

                         //   $('td[cols=' + j + '][rows=' + i + ']').parent().before(tr);

                            $('#' + i + '-' + j ).parent().before(tr);

                        }

                    } else {

                       // if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
                            if ($('#' + i + '-' + j ).length > 0) {

                            // var rSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
                            //
                            // var cSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                                var rSpan = parseInt($('#' + i + '-' + j ).attr('rowspan')) || 1;

                                var cSpan = parseInt($('#' + i + '-' + j ).attr('colspan')) || 1;

                            if (rSpan >= 2) {

                               // if (parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rows')) + parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) - 1 >= yIndex) {
                                if (parseInt($('#' + i + '-' + j).attr('rows')) + parseInt($('#' + i + '-' + j).attr('rowspan')) - 1 >= yIndex) {

                                   // $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rSpan + 1);
                                    $('#' + i + '-' + j).attr('rowspan', rSpan + 1);

                                }

                            }

                        }

                    }

                }

            }

            that.rowCount++;

            that.updateLeft(yIndex);

        }

        that.setIndex();

        that.fillTd();

        that.keyCursor();



    });

}

//列删除

iTable.prototype.deleteCol = function () {

    var simMenu = this.createSimpleMenu('editRowCol delCol', '');

    var sel_a = $(simMenu).children(0);

    var that = this;

    sel_a.on('click', function () {

        var xArr = [],

            yArr = [];

        var xMax, xMin, yMax, yMin;

        var sNode = $('.picked');

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

        } else {

            var index = parseInt(sNode.attr('cols'));

            for (var i = 0; i < that.rowCount + 1; i++) {

                var time = 0;

                for (var j = index; j > -1; j--) {

                    //var cols = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('cols'));

                    var cols = parseInt($('#' + i + '-' + j).attr('cols'));

                    if (cols === index) {

                     //   var cSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                        var cSpan = parseInt($('#' + i + '-' + j ).attr('colspan')) || 1;

                        if (cSpan >= 2) {

                         //   $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cSpan - 1);
                            $('#' + i + '-' + j).attr('colspan', cSpan - 1);

                        } else {

                            //$('td[cols=' + j + '][rows=' + i + ']').remove();

                            $('#' + i + '-' + j).remove();

                        }

                    } else {

                        // if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
                            if ($('#' + i + '-' + j).length > 0) {

                            time++;

                            if (time === 1) {

                              //  var cSpan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                                var cSpan = parseInt($('#' + i + '-' + j + ']').attr('colspan')) || 1;

                                if (cSpan >= 2) {

                                   // $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cSpan - 1);

                                    $('#' + i + '-' + j ).attr('colspan', cSpan - 1);

                                }

                            }

                        }

                    }

                }

            }

            that.cellCount--;

            that.updateLeft(index);

        }

        that.setIndex();

        that.fillTd();

        that.keyCursor();

    });

}

//行删除

iTable.prototype.deleteRow = function () {

    var simMenu = this.createSimpleMenu('editRowCol delRow', '');

    var sel_a = $(simMenu).children(0);

    var that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked');

        if (sNode.length >= 2) {

        } else {

            var index = parseInt(sNode.attr('rows'));

            var yIndex = parseInt(sNode.attr('rows'));

            // var xIndex = parseInt($(obj).attr('cols'));

            for (var i = index; i > -1; i--) {

                //var tr=$('<tr></tr>');

                //var time = 0;

                for (var j = 0; j < that.cellCount; j++) {

                  //  var rows = $('td[cols=' + j + '][rows=' + i + ']').attr('rows');

                    var rows = $('#' + i + '-' + j ).attr('rows');

                    if (rows === index) {

                      //  var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                        var rspan = parseInt($('#' + i + '-' + j ).attr('rowspan')) || 1;

                        if (rspan >= 2) {

                           // $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan - 1);
                            $('#' + i + '-' + j).attr('rowspan', rspan - 1);

                        } else {

                           // $('td[cols=' + j + '][rows=' + i + ']').parent().remove();
                            $('#' + i + '-' + j ).parent().remove();

                        }

                    } else {

                        //if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {
                            if ($('#' + i + '-' + j ).length > 0) {

                          //  var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;
                             var rspan = parseInt($('#' + i + '-' + j ).attr('rowspan')) || 1;

                            if (rspan >= 2) {

                               // if (parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rows')) + parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) - 1 >= yIndex) {
                                if (parseInt($('#' + i + '-' + j ).attr('rows')) + parseInt($('#' + i + '-' + j ).attr('rowspan')) - 1 >= yIndex) {

                                 //   $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan - 1);
                                    $('#' + i + '-' + j).attr('rowspan', rspan - 1);

                                }

                            }

                        }

                    }

                }

            }

            that.rowCount--;

            that.updateLeft(index);

        }

        that.setIndex();

        that.fillTd();

        that.keyCursor();

    });

}

//输入触发公式
iTable.prototype.typeFormula=function(ways,data){
    switch (ways){
        case 'sum':
            return this.typeSum(data);
            break;
        case 'avg':
            return this.typeAvg(data);
            break;
        case 'count':
           // fxCount();
            break;
        case 'max':
            return this.typeMax(data);
            break;
        case 'min':
            return this.typeMin(data);
            break;
        default:
            break;
    }
}
iTable.prototype.typeSum=function(data){
    var sum=0;
    for(var i=1;i<data.length;i++){
        sum+=this.getFilltype($('#'+data[i]));
    }
    return sum;
}

iTable.prototype.typeAvg=function(data){
    var sum=0,avg=0;
    for(var i=1;i<data.length;i++){
        sum+=this.getFilltype($('#'+data[i]));
    }
    avg=sum/(data.length-1);
    return avg;
}

iTable.prototype.typeMax=function(data){
    var arr=[];
    for(var i=1;i<data.length;i++){
       arr.push(this.getFilltype($('#'+data[i])));
    }
    return _.max(arr);
}

iTable.prototype.typeMin=function(data){
    var arr=[];
    for(var i=1;i<data.length;i++){
        arr.push(this.getFilltype($('#'+data[i])));
    }
    return _.min(arr);
}

//点击触发公式

iTable.prototype.formula = function (ways) {

    switch (ways){
        case 'sum':
            this.fxSum();
            break;
        case 'avg':
            this.fxAvg();
            break;
        case 'count':
            this.fxCount();
            break;
        case 'max':
            this.fxMax();
            break;
        case 'min':
            this.fxMin();
            break;
        default:
            break;
    }
}


iTable.prototype.fxSum=function(){
       var that=this;
       if($('.picked').length>1){
           var sum=0;
           var rArr=[],cArr=[];
           var pArr=[];
           $('.picked').each(function(){
               var val=that.getFilltype($(this));
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
               console.log(_.uniq(rArr));

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
               console.log(_.uniq(cArr));

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

}

iTable.prototype.fxAvg=function(){
    var that=this;
    if($('.picked').length>1){
        var sum=0,pL=$('.picked').length,avg=0;
        var rArr=[],cArr=[];
        var pArr=[];
        $('.picked').each(function(){
            var val=that.getFilltype($(this));
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
            console.log(_.uniq(rArr));

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
            console.log(_.uniq(cArr));
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
    console.log(avg);
}

iTable.prototype.fxCount=function(){

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
            console.log(_.uniq(rArr));

        }else{
            var id='#'+rArr[0]+'-'+Number(_.last(cArr)+1);
            $(id).text(count);
        }

        if(_.uniq(cArr).length>1){
            console.log(_.uniq(cArr));
        }else{
            var id='#'+Number(_.last(rArr)+1)+'-'+cArr[0] ;
            $(id).text(count);
        }

    }
    console.log(count);
}

iTable.prototype.fxMax=function(){
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
            console.log(_.uniq(rArr));

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
            console.log(_.uniq(cArr));
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

}


iTable.prototype.fxMin=function(){
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
        var minValue=_.min(arr);
        if(_.uniq(rArr).length>1){
            console.log(_.uniq(rArr));

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
            console.log(_.uniq(cArr));
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
    console.log(_.min(arr));
}

//合并单元格

iTable.prototype.mergeTd = function () {

    var mergeBtn = this.createSimpleMenu('mergeBtn');

    var that = this;

    mergeBtn.on('click', function () {

        var $t = $('.dataTable');

        if ($("table", $t).length > 0) {

            alert("不支持嵌套表格！");

            return;

        }

        var sigDel = "sign4delete";

        var sigSel = "picked";

        $("th,td", $t).each(function () {

            var ridx = $("tr", $t).index($(this).parent("tr"));

            var cidx = $(this).parent().children("th,td").index(this);

            var rowspan = Number($(this).attr("rowspan")) || 1;

            var colspan = Number($(this).attr("colspan")) || 1;

            var isSel = $(this).hasClass(sigSel);

            if (rowspan <= 1 && colspan <= 1) return;

            $("tr", $t).each(function () {

                var idx = $("tr", $t).index(this);

                var arr, $td = $("<td>").addClass(isSel ? sigSel : sigDel);

                if (idx === ridx) {

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

            if (rIdx == rMin && cIdx == cMin){
                $(this).removeClass(sigDel).attr({

                    rowspan: rNum,

                    colspan: cNum

                });
                that.mergeTds.push($(this));
            }

            if ($(this).attr("rowspan") == 1) $(this).removeAttr("rowspan");

            if ($(this).attr("colspan") == 1) $(this).removeAttr("colspan");

        }).remove("." + sigDel);

        that.setIndex();

    });

}

//拆分单元格

iTable.prototype.splitTd = function () {

    var splitBtn = this.createSimpleMenu('splitBtn');

    var that = this;

    splitBtn.on('click', function () {

        var $t = $(".dataTable");

        if ($("table", $t).length > 0) {

            alert("不支持嵌套表格！");

            return;

        }

        var sigDel = "sign4delete";

        var sigSel = "picked";

        $("th,td", $t).each(function () {

            var ridx = $("tr", $t).index($(this).parent("tr"));

            var cidx = $(this).parent().children("th,td").index(this);

            var rowspan = Number($(this).attr("rowspan")) || 1;

            var colspan = Number($(this).attr("colspan")) || 1;

            var isSel = $(this).hasClass(sigSel);

            if (rowspan <= 1 && colspan <= 1) return;

            if (isSel) $(this).removeAttr("colspan").removeAttr("rowspan");

            // 跨格开插

            $("tr", $t).each(function () {

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

        $("th,td", $t).remove("." + sigDel);

        that.setIndex();

    });

}

//创建工具栏下拉菜单

iTable.prototype.createSelection = function (id, menus) {

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

        $(selectHead[0]).text($(this).text());

        $(selectHead[0]).attr('curClass', $(this).attr('class'));

    });

    return selectionBox;

}

iTable.prototype.dataSelection=function(json){
    var selectionBox = $('<div class="toolBox"></div>');

    var selectHead = $('<div></div>');

    var selectUl = $('<ul></ul>');

    var selectLi, aTab;
    for(var index in json){
        selectHead.text('配置菜单');
        aTab=$('<a class="dTab" id="'+json[index].id +'">'+ json[index].name + '</a></li>');
        selectLi = $('<li></li>');
        selectLi.append(aTab);
        selectUl.append(selectLi);
        var cb=json[index].callback
        aTab.on('click',{cb},function(event){
            event.data.callback();
        });

    }
    selectHead.after(selectUl);
    selectionBox.append(selectHead);

    this.tools.append(selectionBox);

    selectUl.hide();

    selectHead.on('click', function () {

        selectUl.toggle();

    });

    selectUl.find('li a').on('click', function () {

        $(selectHead[0]).text($(this).text());

        $(selectHead[0]).attr('curClass', $(this).attr('class'));

    });

    // return selectionBox;
}

//创建工具栏单个菜单

iTable.prototype.createSimpleMenu = function (className, text) {

    var menus = $('<div class="toolBox"></div>');

    var mText = text || '';

    var mClass = className;

    var simTool = $('<span class="' + mClass + '">' + mText + '</span>');

    menus.append(simTool);

    this.tools.append(menus);

    return menus;

}

//创建工具栏格子菜单

iTable.prototype.createCellMenu = function (dClass, className, menus) {

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

    for (var i = 0; i < arr1.length + 1; i++) {

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

}

//增加sheet

iTable.prototype.addSheet = function () {

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

        that.createContent(neId);

        that.fillTd(neId);

        i++;

        that.sheetWork();



    });

}

iTable.prototype.saveNewSheet=function(callback){

    if(callback){
        $('.addSheet').click(callback);
    }else{
        return;
    }
}

iTable.prototype.sheetWork = function () {

    var that = this;

    $('.sheet').on('click', function () {

        box.empty();

        var dId = $(this).attr('id');

        dId = dId.replace('sheet', '');

        dId = parseInt(dId);

        that.createContent(dId);

        that.fillTd(dId);

        $(this).addClass('sheetDefault').siblings().removeClass('sheetDefault');

        return false;

    });

    $('.sheet').on('dblclick', function () {

        var that = $(this);

        var ev = ev || window.event;

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

            if (tdText == content) {

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

}

//sheet移动

iTable.prototype.sheetMove = function () {

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

    function toNavLPos() {

        if (sDl.css('marginLeft') < sDl.css('width')) {

            sDl.animate({

                'margin-left': 100

            }, 100);

        } else {

            sDl.stop();

        }

    }

}

//设置坐标

iTable.prototype.setIndex = function () {

    var offsetLeftArray = new Array();

    var cell; // 单元格Dom

    var col; // 单元格实际所在列

    var cellStr; // 每个cell以row,col,rowSpan,colSpan,value形式

    var cellStrArray = [];

    var t = this.getCurTable();

    var id = (t.attr('id')).replace('iTable', '');

    var objTab = document.getElementById('iTable' + id);

    // 遍历第一次取出offsetLeft集合

    for (var i = 0,l=objTab.rows.length; i < l; i++) {

        for (var j = 0,_l=objTab.rows[i].cells.length; j < _l; j++) {

            cell = objTab.rows[i].cells[j];

            if (offsetLeftArray.contains(cell.offsetLeft) === -1)

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

            col = offsetLeftArray.contains(cell.offsetLeft);

            cellStr = i + ',' + col;

            cellStrArray.push(cellStr);

            // var coo = (i + 1) + ',' + (col + 1);
            //
            // var coo = cellStrArray[j];

            cell.setAttribute('rows', i + 1);

            cell.setAttribute('cols', col + 1);

            cell.setAttribute('id',i+1+'-'+(col+1));

        }

    }

}

//y轴更新

iTable.prototype.updateLeft = function (index) {

    $('.titleTable tbody tr').eq(index).find('td').append('<td></td>');

    for (var j = index; j < this.rowCount; j++) {

        //var td = $("<td>" + IntToChr(j) + "</td>");

        $('.titleTable tbody tr').eq(j).find('td').text(IntToChr(j));

    }

}

//x轴更新

iTable.prototype.updateTop = function (index) {

    var that = this;

    $('.titleTable colgroup').find('col').eq(index).after('<col style="width:100px">');

    $('.titleTable tbody tr').find('td').eq(index).after('<td></td>');

    for (var j = index; j < this.cellCount - 1; j++) {

        //var td = $("<td>" + IntToChr(j) + "</td>");

        $('.titleTable tbody tr').find('td').eq(j).text(IntToChr(j));

    }

}

//拖拽放宽列

iTable.prototype.largeCol = function () {

    var container = this.container;

    var that = this;

    var event = window.event || arguments[0];

    var exW = $('.yOrder').outerWidth();

    $('.titleTable tr td').each(function (event) {

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

                            var allH = $('.dataTable').outerHeight();

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

                                $('.dataTable colgroup col').eq(index).css('width', w + move);

                                $('.titleTable colgroup col').eq(index).css('width', w + move);

                                $(container).append(lLine);

                            }

                        });
                    }
                    $('body').mouseup(function (event) {

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

}

//拖拽放宽行

iTable.prototype.largeRow = function () {

    var container = this.container;

    var that = this;

    var event = window.event || arguments[0];

    var exH = $('.yOrder').outerHeight(),headerH=parseInt($(container).css('marginTop'));

    $('.leftTable tr td').each(function (event) {

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

                            var allW = $('.dataTable').outerWidth();

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

                                $('.dataTable tr th').eq(index).css('height', h + move + 1);

                                $('.leftTable td').eq(index).css('height', h + move);

                                $(container).append(lLine);

                            }

                        });
                    }



                    $('body').mouseup(function (event) {

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

}

//创建公式输入框

iTable.prototype.fillBlank = function () {

    var fxBox = $('<div class="fx"></div>');

    var fxInput = $('<input type="text" id="ip_fx">');

    var dis = $('<span class="disbox"></span>');

    fxBox.append(dis);

    fxBox.append(fxInput);

    this.header.append(fxBox);

    this.fillWork();

}

//输入操作

iTable.prototype.fillWork = function () {

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

}

//高亮蒙版

iTable.prototype.createMask = function (left, top, width, height, posX, posY) {

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

iTable.prototype.rMenus = function () {

    var that = this;

    var rMenus = this.createRMenus();

    var winH = $(window).height() - $(this.footer).outerHeight();

    var winW = $(window).width();

    $('.dataTable').contextmenu(function () {

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

            that.setBlueBorder($('.picked'));
        }else{
            $('.picked').removeClass('picked');
            $(that.moveLast).addClass('picked');
            that.setBlueBorder(that.moveLast);
        }

       //  that.setBlueBorder(that.moveLast);
        return false;

    });

}

iTable.prototype.createRMenus = function () {

    var menus = $('<div class="rmenu"></div>');

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

    var clearContent = this.clearContent();

    menus.append(clearContent);

    $('body').append(menus);

    $(document).on('click', function () {

        menus.hide();

        return false;

    });

    return menus;

}

iTable.prototype.cut = function (dataArr) {

    var cutDiv = $('<div class="menu-cut">剪切</div>');

    cutDiv.on('click', function () {

        var tdLength = $('.picked').length;

        $(this).parent().hide();

        if (tdLength <= 1) {

            dataArr.length = 0;

            var td = $('.picked')[0];

            dataArr.push($(td).text());

            $(td).text('');

        } else {

            dataArr.length = 0;

            for (var i = 0; i < tdLength; i++) {

                var tds = $('.picked')[i];

                dataArr.push($(tds));

                $(tds).text('');

            }

        }

    });

    return cutDiv;

}

iTable.prototype.copy = function () {

    var copyDiv = $('<div class="menu-copy">复制</div>');
    var dataArr=[];
    copyDiv.on('click', function () {

        var tdLength = $('.picked').length;

        $(this).parent().hide();

        if (tdLength <= 1) {

            dataArr.length = 0;

            var td = $('.picked')[0];

            dataArr.push($(td).text());

        } else {

            dataArr.length = 0;

            for (var i = 0; i < tdLength; i++) {

                var tds = $('.picked')[i];

                dataArr.push($(tds));

            }

        }

    });

    return copyDiv;

}

iTable.prototype.paste = function (dataArr) {

    var pasteDiv = $('<div class="menu-paste">粘贴</div>');

    pasteDiv.css({

        'padding': '2px 10px',

        'cursor': 'pointer'

    });

    pasteDiv.on('click', function () {

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

    return pasteDiv;

}

iTable.prototype._insert = function () {

    var insertDiv = $('<div class="menu-insert">插入</div>');

    var that = this;

    insertDiv.css({

        'padding': '2px 10px',

        'cursor': 'pointer'

    });

    insertDiv.on('click', function () {

        var ev = event || window.event;

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

iTable.prototype._delete = function () {

    var deleteDiv = $('<div class="menu-delete">删除</div>');

    deleteDiv.css({

        'padding': '2px 10px',

        'cursor': 'pointer'

    });

    return deleteDiv;

}


iTable.prototype.clearContent =function(){
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

}


iTable.prototype.tdTofx = function (obj) {

    var tdVal = obj.text();

    $('#ip_fx').val(tdVal);

}



iTable.prototype.getValue = function (arr) {

    arr = arr.toString();

    var xCoo = arr.replace(/[a-zA-Z]*/, ' '),

        yCoo = arr.replace(/[1-9]\d*/, ' ');

    yCoo = yCoo.charCodeAt(0) - 96;

    xCoo--, yCoo--;

    var value;

    var text = Number($('td[cols=' + xCoo + '][rows=' + yCoo + ']').text());

    if (typeof(text) != 'number') {

        value = 0;

    } else {

        (!!text) ? value = Number(text) : value = 0;

    }

    return value;

}

iTable.prototype.modal = function (_style, _content) {

    var modalBox = $('<div class="itModal"></div>');

    var mTitle = _style.title;

    var closeBtn = $('<a class="itModal-close">x</a>');

    var modalTitle = $('<div class="itModal-title">' + mTitle + '</div>');

    modalBox.css({

        'width': parseInt(_style.width),

        'height': parseInt(_style.width),

        'position': 'absolute',

        'top': '100px',

        'left': '500px',

        'background': 'red',

        //		'margin-left':-parseInt(_style.width)/2,

        //		'margin-top':-parseInt(_style.width)/2

    });

    modalTitle.append(closeBtn);

    modalBox.append(modalTitle);

    $('body').append(modalBox);

    //modalBox.on('mousedown',this.iDrag(event));

    this.iDrag(modalBox);

}




iTable.prototype.freezeBtn=function(){
   var btn=this.createSimpleMenu('fbold');
   this.tools.append(btn);
   var that=this;
   btn.on('click',{callZ:this},this.freezeTds);
}

iTable.prototype.freezeTd=function(){
    var colBox=$('<div id="fColBox"><div></div><table><colgroup></colgroup><tbody></tbody></table></div>');
    var rowBox=$('<div id="fRowBox"></div>');
    var bothBox=$('<div id="fBothBox"></div>');

    this.container.append(colBox);
    this.container.append(rowBox);
    this.container.append(bothBox);
    this.freezeBtn();
}


iTable.prototype.freezeTds=function(event){
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


             for(var j=0;j<=event.data.callZ.rowCount;j++){
                 var tr=$('<tr></tr>');
                 for(var i=0;i<xMin;i++){
                     var id='#'+j+'-'+i;

                     if(j>0){
                         tr.append($('.dataTable').find(id).clone());


                     }else{
                         tr.append($('.dataTable').find(id).clone());
                         $('#fColBox').find('colgroup').append($('.dataTable').find('colgroup col').eq(i).clone());
                         if(i>1){
                             fColTotalWidth+=parseInt($('.dataTable').find('colgroup col').eq(i).width());
                         }

                     }

                 }

                 $('#fColBox').find('div').append($('#leftTable tr').eq(j).clone());
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

}


iTable.prototype.leftBar = function () {

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

    this.leftBarHandle();

    //callback();

}

iTable.prototype.leftBarHandle = function (callback) {

    if (callback) {

        callback();

    }

}

iTable.prototype.charts = function () {

    this.createSimpleMenu('charts');

    this.chartsHandler();

}

iTable.prototype.chartsHandler = function (callback) {

    if (callback) {

        callback();

    }

}

iTable.prototype.dataSource = function () {

    this.createSimpleMenu('dataSource');

    this.dataSourceHandler();

}

iTable.prototype.dataSourceHandler = function (callback) {

    if (callback) {

        callback();

    }

}

iTable.prototype.dataSet = function () {

    this.createSimpleMenu('dataSet');

    this.dataSetHandler();

}

iTable.prototype.dataSetHandler = function (callback) {

    if (callback) {

        callback();

    }

}

iTable.prototype.dataSearch = function () {

    this.createSimpleMenu('dataSearch');

    this.dataSetHandler();

}

iTable.prototype.dataSearchHandler = function (callback) {

    if (callback) {

        callback();

    }

}

iTable.prototype.saveBtn=function(callback){
    var btn=$('<input type="button" class="saveBtn" value="保存">');
    var that=this;
    this.header.find('.tools').append(btn);
    btn.css({
        'float':'right',
        'margin-right':'10px',
        'margin-top':'6px'
    });
}

iTable.prototype.saveBtn.save=function(callback){
    $('.saveBtn').on('click',callback);
}
iTable.prototype.saveReport = function (callback) {
      // $('.saveBtn').on('click',callback);
    //if (callback) {

    $('.saveBtn').on('click',callback);

   // }

}


iTable.prototype.iDrag = function (obj) {

    var event = window.event || arguments[0];

    obj.on('mousedown', function (event) {

        var disX = event.clientX - this.offsetLeft;

        var disY = event.clientY - this.offsetTop;

        obj.on('mousemove', function (event) {

            obj.css({

                'left': event.clientX - disX,

                'top': event.clientY - disY

            });

        });

    });

    obj.on('mouseup', function () {

        obj.off('mousemove');

    });

}

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

//Input光标

function set_text_value_position(sPos) {

    var tObj = document.getElementById('tdInput');

    if (sPos < 0) sPos = tObj.value.length;

    if (tObj.setSelectionRange) { //兼容火狐,谷歌

        setTimeout(function () {

            tObj.setSelectionRange(sPos, sPos);

            tObj.focus();

        }, 0);

    } else if (tObj.createTextRange) { //兼容IE

        var rng = tObj.createTextRange();

        rng.move('character', sPos);

        rng.select();

    }

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

        if (array[i] == obj) {

            return i;

            break;

        }

    }

    return -1;

}

Array.prototype.contains = function (obj) {

    return containsArray(this, obj);

}

iTable.prototype.init = function () {

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

    this.listenHeight();

    tOption.fontFamily && this.fontFamily();

    tOption.fontSize && this.fontSize();

    tOption.fontBold && this.fontBold();

    tOption.fontItalic && this.fontItalic();

    tOption.fontOverLine && this.fontOverline();

    tOption.fontColor && this.fontColor();

    tOption.fontBgColor && this.bgColor();

    tOption.mergeTd && this.mergeTd();

    tOption.splitTd && this.splitTd();

    tOption.textAlign && this.textAlign();

    this.textArea();

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

    this.leftBar();

    this.charts();

    this.dataSource();

    this.dataSet();

    this.dataSearch();

    this.largeCol();

    this.largeRow();

    this.blueBorder();

    this.cornerCopy();

    this.saveBtn();

    this.fillType();

    this.chooseCol();

    this.chooseRow();

   // this.freezeTd();
}

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



}

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

}

var t = new iTable(box, settings, tabs);

t.init();

t.leftBarHandle(function () {

    console.log('do sth');

});
t.dataSelection({
    table1:{
        id:'table1',
        name:'全国报表',
        callback:function a(){
            console.log('1');
        }
    },
    table2:{
        id:'table2',
        name:'地方报表',
        callback:function b(){
            console.log('2');
        }
    },
    table3:{
        id:'table3',
        name:'其他报表',
        callback:other
    }
});

function other(){

}


//
// t.chartsHandler(function () {
//     $('.charts').on('click', function () {
//         initChartConfig(webBasePath);
//     });
// });
//
// t.dataSearchHandler(function () {
//     $('.dataSearch').on('click', function () {
//         initSearchConfig(webBasePath);
//     });
// });
// t.saveBtn.save(function() {
//       alert('11');
// });
t.saveReport(function() {
    alert('11');
});
// t.saveNewSheet(function(){
//     alert('save new sheet');
// })



