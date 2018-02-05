"use strict" //严格模式

function ITable(tContainer, tSettings, tabs,mergeArray) {

    this.rowCount = Number(tSettings.rowCount);

    this.cellCount = Number(tSettings.cellCount);

    this.container = tContainer;

    this.settings = tSettings;

    this.tabs = tabs;

    this.header=null;
    this.footer=null;
    this.toolContainer={
        tools:null,
        fontFamily:null,
        fontSize:null,
        fillType:null
    };
    this.fillContainer={
        fillBlank:null,
        disBox:null
    };

    this.moveLast=null;
    this.table=null;
    this.tableInput={
        inputContainer:null,
        input:null
    };
    this.xBox={
        xOrder:null,
        xTable:null
    };
    this.yBox={
        yOrder:null,
        yTable:null
    };

    this.frameBorder={
        blueBorder:{
            topDiv:null,
            rightDiv:null,
            bottomDiv:null,
            leftDiv:null,
            blueBorderContainer:null
        },
        redBorder:{
           topDiv:null,
           rightDiv:null,
           bottomDiv:null,
           leftDiv:null,
           redBorderContainer:null
        },
        corner:null
    };

    this.mouseString={
        mouseMove:'mousemove',
        mouseDown:'mousedown',
        mouseOver:'mouseover',
        mouseUp:'mouseup',
        mouseEnter:'mouseenter',
        dblClick:'dblclick'
    };
    this.mergeTds=mergeArray || [];

    this.selectedArr=[];
}

ITable.prototype.CreateContent = function (tid) {

    var tId = tid || 1, myContainer = this.container;

    myContainer.empty();

    this.table = $("<table class='dataTable' id='iTable" + tId + "'></table>");

    myContainer.append(this.table);

    var tr,th,colG,col,td;

    for (var i = 0; i < this.rowCount; i++) {

        tr = this.CreateTr();
        th = $('<th></th>');
        colG = $('<colgroup></colgroup>');

        for (var j = 0; j <= this.cellCount; j++) {

            td = this.CreateTd('ftNormal fsize_14 font_Black','');

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
    return $("<tr></tr>");
};

ITable.prototype.CreateTd = function (className, tdValue) {
    return $("<td class="+className+">" + tdValue + "</td>");

};

ITable.prototype.CreateXAxis = function () {

    this.xBox.xOrder = $("<div class='xOrder'></div>");
    this.xBox.xTable = $("<table class='titleTable' id='titleTable'></table>");

    var th = $("<th></th>"), tr = $("<tr></tr>"), col;

    this.container.before(this.xBox.xOrder);

    this.xBox.xOrder.append(this.xBox.xTable);

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

                this.xBox.xTable.append(colG);

            }

        }

        this.xBox.xTable.append(tr);

    }

};

ITable.prototype.CreateYAxis = function () {

    this.yBox.yOrder = $("<div class='yOrder'></div>");
    this.yBox.yTable = $("<table class='leftTable' id='leftTable'></table>");

    this.container.before(this.yBox.yOrder);

    this.yBox.yOrder.append(this.yBox.yTable);

    for (var i = 0; i < this.rowCount; i++) {

        var tr = $("<tr></tr>");

        for (var j = 0; j < 1; j++) {

            var th = $("<td>" + (i + 1) + "</td>");

            tr.append(th);
        }

        this.yBox.yTable.append(tr);

    }

};

ITable.prototype.CreateTip = function () {

    var content = $("<div class='greyBlock'></div>"),
        bLeft =  this.yBox.yTable.find('tr:first td:first').outerWidth(), bTop = this.xBox.xTable.find('tr:first td:first').outerHeight();

    content.css({
        'width': bLeft,
        'height': bTop
    });
    $(this.container).append(content);

};

ITable.prototype.FrameSelect = function () {

    var that=this,coord,
    wB1=this.frameBorder.blueBorder.topDiv,
    wB2=this.frameBorder.blueBorder.bottomDiv,
    wB3=this.frameBorder.blueBorder.leftDiv,
    wB4=this.frameBorder.blueBorder.rightDiv;

    this.table.on(this.mouseString.mouseOver,function(){
        var event=event||arguments[0];
        coord=$(event.target);
        that.moveLast=$(event.target);
    });

    $(document).off(this.mouseString.mouseDown).on(this.mouseString.mouseDown,function(){
       // var event=event||arguments[0];

        var onCols = Number($(coord).attr('cols')) , onRows = Number($(coord).attr('rows')) , sTop , sLeft , top , left;

        $(document).off(that.mouseString.mouseMove).on(that.mouseString.mouseMove,function(){

            var moveCS=isNaN(Number(that.moveLast.attr('colspan')))?1:Number(that.moveLast.attr('colspan')),

                moveRS=isNaN(Number(that.moveLast.attr('rowspan')))?1:Number(that.moveLast.attr('rowspan')),

                moveX=Number(that.moveLast.attr('cols'))+moveCS-1, moveY=Number(that.moveLast.attr('rows'))+moveRS-1,

                startX,endX,startY,endY,totalWidth=0,totalHeight=0,tempId,startId,

                wB1Style,wB2Style,wB3Style,wB4Style;

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
            that.selectedArr.length=0;
            $('.picked').removeClass('picked');

            for(var m=0,len=that.mergeTds.length;m<len;m++){
                var mergeCS=isNaN(Number($(that.mergeTds[m]).attr('colspan')))?1:Number($(that.mergeTds[m]).attr('colspan')),
                    mergeRS=isNaN(Number($(that.mergeTds[m]).attr('rowspan')))?1:Number($(that.mergeTds[m]).attr('rowspan')),
                    mergeCol=Number($(that.mergeTds[m]).attr('cols')), mergeRow=Number($(that.mergeTds[m]).attr('rows')),
                    mergeX=Number($(that.mergeTds[m]).attr('cols'))+mergeCS-1, mergeY=Number($(that.mergeTds[m]).attr('rows'))+mergeRS-1;

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


            for(var i = startX; i <= endX ; i++) {
                for(var j = startY; j <= endY; j++) {
                    tempId='#'+j+'-'+i;
                    $(tempId).addClass('picked');
                    that.selectedArr.push(document.getElementById(j+'-'+i));
                            if(i===startX){
                                totalHeight+=$('#'+j+'-'+startX).outerHeight();
                            }
                            if(j===startY){
                                totalWidth+=$('#'+startY+'-'+i).outerWidth();
                            }
                }

            }

            sTop=that.container.scrollTop()-96;
            sLeft=that.container.scrollLeft()-4;

            console.log(that.selectedArr);

            startId='#'+startY+'-'+startX;
            top=Number($(startId).offset().top)+sTop+1;
            left=Number($(startId).offset().left)+sLeft+1;

            that.frameBorder.blueBorder.blueBorderContainer.css({
                'top': top,
                'left': left
            });

            wB1Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': 0 };
            wB2Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': totalHeight };
            wB3Style={ 'width': '2px', 'height': totalHeight, 'left': 0, 'top': 0 };
            wB4Style={ 'width': '2px', 'height': totalHeight, 'left': totalWidth, 'top': 0 };
            wB1.css(wB1Style); wB2.css(wB2Style); wB3.css(wB3Style); wB4.css(wB4Style);

            that.frameBorder.corner.css({

                'top':  totalHeight - 2,

                'left': totalWidth - 2

            });
            that.frameBorder.blueBorder.blueBorderContainer.show();
        });
        $(document).on(that.mouseString.mouseUp,function(){
            $(this).off(that.mouseString.mouseMove);
        });

    });
};



ITable.prototype.TextArea=function(){
     this.tableInput.inputContainer=$('<div class="iTableInputHolder" id="iTableInputHolder"></div>');
     this.tableInput.input=$('<input type="text" class="iTableInput" id="iTableInput">');
     this.tableInput.inputContainer.append(this.tableInput.input);
     $(this.container).append(this.tableInput.inputContainer);

};

ITable.prototype.SetTextArea=function(visible){
    if($('.picked').length>0){
        var w = $('.picked').width(), h = $('.picked').height(), x = $('.picked').offset().left+this.container.scrollLeft(),
            y = $('.picked').offset().top+this.container.scrollTop()-parseInt($(this.container).css('margin-top'));

        if(visible===1){
            this.tableInput.inputContainer.show();
        }else{
            this.tableInput.inputContainer.hide();
        }

        this.tableInput.inputContainer.css({'left':x, 'top':y});

        this.tableInput.input.css({'width':w,'height':h});
    }


};



ITable.prototype.HideTextArea=function(){
    this.tableInput.inputContainer.hide();
};

ITable.prototype.fillExTextArea=function(eType,val,ex){

};

ITable.prototype.FillTextArea=function(eType,val){

    var that=this;
    switch(eType)
    {
        case 'dblclick':
            this.tableInput.input.val('');
            $(document).off('keydown');
            this.tableInput.input.focus().val(val);
            this.tableInput.input.on('change',function(){
                $('#ip_fx').val($(this).val());
                that.IsExpress(that.tableInput.input.val());
                event.stopPropagation();
            });
            this.tableInput.input.off('keyup').on('keyup',function(){
                if (event.keyCode === 13) {
                    var content =$(this).val(),curClass=$('.picked').attr('class');

                    $('.picked').html(that.TypeToValue(curClass,content));

                    var pNode=$($('.picked').attr('pnode')),ex=pNode.attr('ex');
                    if(!!ex){
                        var exArr=ex.split('/');
                        var type=exArr[0];
                        var pValue=that.TypeFormula(type,exArr);
                        pNode.text(pValue);
                    }
                    $(this).blur();
                    that.FillTd();
                    that.FrameSelect();
                    that.KeyCursor();
                    that.HideTextArea();
                }
            });
            break;
        case 'keymove':
            this.tableInput.input.focus();
            break;
        default:
            break;
    }
};

ITable.prototype.IsExpress=function(val){
    var textVal=val;
    var that=this;

    if(textVal.match(/^\=/g)||textVal.match(/^\+/g)||textVal.match(/^\-/g)){
        //    /(\=|\+|\-|\*|\/)([a-z]|[A-Z])+([1-9]*)/g
        this.table.find('td').off('dblclick');
        $(this.container).off(that.mouseString.mouseDown);
        // var coordinates;
        this.table.find('td').off('click').on('click',{coordinate:null},function(event){

                that.tableInput.input.focus();
                var typePosition=Number(that.tableInput.input.iGetFieldPos());
                event.data.coordinate=IntToChr(Number($(this).attr('cols'))-2)+$(this).attr('rows');
                if(typePosition===that.tableInput.input.val().length){

                    if(that.tableInput.input.val().slice(-1)==='+'||that.tableInput.input.val().slice(-1)==='-'||that.tableInput.input.val().slice(-1)==='*'||that.tableInput.input.val().slice(-1)==='/'){

                        that.tableInput.input.val(that.tableInput.input.val()+event.data.coordinate);

                    }else{

                        var lastLength=String(_.last(that.tableInput.input.val().split(/\=|\+|\-|\*|\//g))).length;
                        that.tableInput.input.iDelField(lastLength);
                        that.tableInput.input.iAddField(event.data.coordinate);

                    }
                }else{
                    if((that.tableInput.input.val()).charAt(typePosition+1).match(/\=|\+|\-|\*|\//g)){

                    }
                    that.tableInput.input.iAddField(event.data.coordinate);
                }


            });


    }else{
        this.FillTd();
        this.FrameSelect();
    }
};

ITable.prototype.KeyCursor = function () {

    var that = this;

    $(document).off('keydown').on('keydown', {time: "0", lastTd: null, fixX: "", fixY: "", keyCode: "", callZ: that}, typing);

};

function typing(event) {

    var sNode = $('.picked'), callZ = event.data.callZ;

    if ($('.picked').length === 1) {

        if (event.keyCode === 8 || event.keyCode === 18 || event.keyCode === 16 || event.keyCode === 9) {

            return;

        }

        callZ.SetTextArea(1);

        callZ.FillTextArea('keymove');


        var nowX = Number($(sNode).attr('cols')), nowY = Number($(sNode).attr('rows')),

            colAdd = Number($(sNode).attr('colspan')) - 1 || 0, rowAdd = Number($(sNode).attr('rowspan')) - 1 || 0;


        event.data.time = Number(event.data.time) + 1;

        if (event.data.time === 1) {

            //获取第一次点击的单元格

            event.data.lastTd = sNode;

            event.data.fixX = Number($(event.data.lastTd).attr('cols'));

            event.data.fixY = Number($(event.data.lastTd).attr('rows'));

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
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    callZ.tableInput.input.val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){
                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    callZ.tableInput.input.val(' ');
                }

            }


            if (event.data.lastTd!==sNode) {

                if (event.data.fixX !== nowX) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                        event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '39':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '37':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '38':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;


            }

            var nextX = event.data.fixX, nextY = nowY + 1, id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            } else {
                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                     var mStartX=Number($(callZ.mergeTds[i]).attr('cols')),mEndX=mStartX+Number($(callZ.mergeTds[i]).attr('colspan'));
                     var mStartY=Number($(callZ.mergeTds[i]).attr('rows')),mEndY=mStartY+Number($(callZ.mergeTds[i]).attr('rowspan'));
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
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    callZ.tableInput.input.val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){

                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    callZ.tableInput.input.val(' ');
                }
            }

            if (event.data.lastTd!==sNode) {

                if (event.data.fixY !== nowY) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                        event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '13':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '40':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '37':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '38':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = nowX + 1, nextY = event.data.fixY, id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            }   else {
                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                    var mStartX=Number($(callZ.mergeTds[i]).attr('cols')),mEndX=mStartX+Number($(callZ.mergeTds[i]).attr('colspan'));
                    var mStartY=Number($(callZ.mergeTds[i]).attr('rows')),mEndY=mStartY+Number($(callZ.mergeTds[i]).attr('rowspan'));
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
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    callZ.tableInput.input.val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){
                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    callZ.tableInput.input.val(' ');
                }
            }

            if (event.data.lastTd!==sNode) {

                if (event.data.fixX !== nowX) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                        event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '13':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '40':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '38':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '39':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = nowX-1, nextY = Number(event.data.fixY), id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            } else {

                $('.picked').removeClass('picked');

                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                    var mStartX=Number($(callZ.mergeTds[i]).attr('cols')),mEndX=mStartX+Number($(callZ.mergeTds[i]).attr('colspan'));
                    var mStartY=Number($(callZ.mergeTds[i]).attr('rows')),mEndY=mStartY+Number($(callZ.mergeTds[i]).attr('rowspan'));
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
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));
                    var pNode=$($('.picked').attr('pnode'));
                    var pEx=pNode.attr('ex');
                    if(!!pEx){
                        var pExArr=pEx.split('/');
                        var type=pExArr[0];
                        var pValue=callZ.TypeFormula(type,pExArr);
                        pNode.text(pValue);
                    }
                    callZ.tableInput.input.val(' ');
                }else{
                    $('.picked').html(callZ.TypeToValue(curClass,callZ.tableInput.input.val()));

                    var exArr=ex.split('/');

                    for(var i=1,len=exArr.length;i<len;i++){
                        $('#'+exArr[i]).removeAttr('pnode');
                    }
                    $('.picked').removeAttr('ex');
                    callZ.tableInput.input.val(' ');
                }
            }


            if (event.data.lastTd!==sNode ) {

                if (event.data.fixX !== nowX) {

                    //不同单元格x坐标不同

                    if (!$(sNode).attr('colspan') && !$(sNode).attr('rowspan')) {

                        //区分跨行列时，单元格x坐标不同情况

                        event.data.lastTd = sNode;

                        event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                        event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    }

                }

            }

            var lastKey = String(event.data.keyCode);

            switch (lastKey) {

                case '13':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '40':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '37':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

                case '39':

                    event.data.lastTd = sNode;

                    event.data.fixX = Number($(event.data.lastTd).attr('cols'));

                    event.data.fixY = Number($(event.data.lastTd).attr('rows'));

                    break;

            }

            var nextX = event.data.fixX, nextY = nowY - 1, id='#'+nextY+'-'+nextX;

            if ($(id).length > 0) {

                $(sNode).removeClass('picked');

                $(id).addClass('picked');

                callZ.SetBlueBorder($(id));

                callZ.SetTextArea(0);

            } else {
                $('.picked').removeClass('picked');
                for(var i=0,len=callZ.mergeTds.length;i<len;i++){
                    var mStartX=Number($(callZ.mergeTds[i]).attr('cols')),mEndX=mStartX+Number($(callZ.mergeTds[i]).attr('colspan'));
                    var mStartY=Number($(callZ.mergeTds[i]).attr('rows')),mEndY=mStartY+Number($(callZ.mergeTds[i]).attr('rowspan'));
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

            var xCoo = Number($('.picked').attr('cols')) - 1, yCoo = Number($('.picked').attr('rows')) - 1;

            callZ.fillContainer.disBox.text(IntToChr(xCoo) + String(yCoo + 1));

        }

    } else {

        return;

    }

}

ITable.prototype.SetCss = function () {
    var thatContainer = this.container, viewWidth = $(window).width(), viewHeight = $(window).height(), tBody = this.table.parent(),
        bTop = this.xBox.xTable.find('tr:first td:first').outerHeight() + 1,that=this;

    this.yBox.yOrder.css({
        'height': viewHeight-153
    });

    this.xBox.xOrder.css({
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


    var viewWidth,viewHeight;

    $(window).resize(function () {

        viewWidth = $(window).width();

        viewHeight = $(window).height();

        thatContainer.width(viewWidth - 4);

        thatContainer.height(viewHeight - bTop - 113);

        that.yBox.yOrder.height(viewHeight - bTop);

    });

};
//滚动
ITable.prototype.TableScroll = function () {

    var that=this,scrollY=0,scrollX=0;

    this.container.on('scroll',function(){

        scrollY = Number(this.scrollTop);

        scrollX = Number(this.scrollLeft);

        that.yBox.yTable.css('margin-top', -scrollY);

        that.xBox.xTable.css('margin-left', -scrollX);


    });


};
//填写表格
ITable.prototype.FillTd = function (tid) {

    var tid = tid || 1, that = this;

    this.table.find('td').each(function () {

       $(this).off('dblclick').on('dblclick',{target:that,id:tid},that.TdDbClick);

       $(this).off('click').on('click',{target:that},that.TdClick);

    });

};

ITable.prototype.TdClick=function(event){

    if( event.data.target.tableInput.inputContainer.css('display')==='block'){

        $('.picked').text(event.data.target.tableInput.val());

        this.tableInput.inputContainer.hide();

        event.data.target.tableInput.input.blur();
    }

    $('.picked').removeClass('picked');

    $(this).addClass('picked');

    event.data.target.SetBlueBorder($(this));

    var xCoo = Number($(this).attr('cols')) - 1, yCoo = Number($(this).attr('rows')) - 1;

    event.data.target.fillContainer.disBox.text(IntToChr(xCoo) + String(yCoo + 1));

    event.data.target.TdToFx($(this));
    event.data.target.LightCooR($(this));
    $('#ip_fx').blur();
};

ITable.prototype.TdDbClick=function(event){
    var tdText = $(this).text(), eType='dblclick', ex=$(this).attr('ex');

    event.data.target.SetTextArea(1);
    if(!!ex){
        event.data.target.fillExTextArea(eType,tdText,ex);
    }else{
        event.data.target.FillTextArea(eType,tdText);
    }


    event.data.target.tableInput.input.click(function () {
        return false;
    });

    $('#iTable' + event.data.id).find('tr').find('td').not($(this)).click(function () {
        event.data.target.tableInput.input.blur();
    });
    stopPropagation();
};

ITable.prototype.BlueBorder=function(){

    this.frameBorder.blueBorder.blueBorderContainer=  $('<div class="wBorder" id="wBorder"></div>');
    this.frameBorder.blueBorder.blueBorderContainer.css({
        'top': 0,
        'left': 0
    });

    this.frameBorder.blueBorder.topDiv = $('<div></div>'); //top
    this.frameBorder.blueBorder.rightDiv = $('<div></div>');//right
    this.frameBorder.blueBorder.bottomDiv = $('<div></div>');//bottom
    this.frameBorder.blueBorder.leftDiv=$('<div></div>');//left

   //top
    this.frameBorder.blueBorder.topDiv.css({
        'height': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });
    this.frameBorder.blueBorder.blueBorderContainer.append( this.frameBorder.blueBorder.topDiv);

  //right

    this.frameBorder.blueBorder.rightDiv.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });

    this.frameBorder.blueBorder.blueBorderContainer.append( this.frameBorder.blueBorder.rightDiv);

    //bottom
    this.frameBorder.blueBorder.bottomDiv.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });
    this.frameBorder.blueBorder.blueBorderContainer.append(this.frameBorder.blueBorder.bottomDiv);

    //left

    this.frameBorder.blueBorder.leftDiv.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'rgb(82, 146, 247)'

    });

    this.frameBorder.blueBorder.blueBorderContainer.append( this.frameBorder.blueBorder.leftDiv);


    this.frameBorder.corner = $('<div class="scorner" id="scorner"></div>');

    //红色

    this.frameBorder.redBorder.redBorderContainer = $('<div class="wrBorder"></div>');

    this.frameBorder.redBorder.redBorderContainer.css({

        'top': 0,

        'left': 0,

        'display':'none'

    });

    this.frameBorder.redBorder.topDiv = $('<div></div>');

    this.frameBorder.redBorder.topDiv.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    this.frameBorder.redBorder.redBorderContainer.append(this.frameBorder.redBorder.topDiv);

    this.frameBorder.redBorder.rightDiv= $('<div></div>');

    this.frameBorder.redBorder.rightDiv.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    this.frameBorder.redBorder.redBorderContainer.append(this.frameBorder.redBorder.rightDiv);

    this.frameBorder.redBorder.bottomDiv = $('<div></div>');

    this.frameBorder.redBorder.bottomDiv.css({

        'height': '2px',

        'position': 'absolute',

        'background': 'red'

    });

    this.frameBorder.redBorder.redBorderContainer.append(this.frameBorder.redBorder.bottomDiv);

    this.frameBorder.redBorder.leftDiv = $('<div></div>');

    this.frameBorder.redBorder.leftDiv.css({

        'width': '2px',

        'position': 'absolute',

        'background': 'red'

    });
    this.frameBorder.redBorder.redBorderContainer.append(this.frameBorder.redBorder.leftDiv);

    this.frameBorder.blueBorder.blueBorderContainer.append(this.frameBorder.corner);

    this.container.append( this.frameBorder.blueBorder.blueBorderContainer);

    this.container.append(this.frameBorder.redBorder.redBorderContainer);


};

ITable.prototype.HideReadBorder=function(){
    this.frameBorder.redBorder.redBorderContainer.hide();
};

ITable.prototype.SetBlueBorder=function(obj){

       if($(obj).length>0){
           var topArr = [], leftArr = [],topMin, leftMin, totalWidth = 0, totalHeight = 0;

           for (var i = 0; i < obj.length; i++) {

               var top = Number(obj[i].offsetTop), left = Number(obj[i].offsetLeft),

                   width = Number(obj[i].offsetWidth), height = Number(obj[i].offsetHeight);

               if (top < _.min(topArr)) {

                   if (this.frameBorder.blueBorder.blueBorderContainer.length > 0) {

                       this.frameBorder.blueBorder.blueBorderContainer.hide();

                   }

               }

               if (left < _.min(leftArr)) {

                   if (this.frameBorder.blueBorder.blueBorderContainer.length > 0) {

                       this.frameBorder.blueBorder.blueBorderContainer.hide();

                   }

               }

               topArr.push(top);

               leftArr.push(left);

               topMin = _.min(topArr);

               leftMin = _.min(leftArr);

               if (top === _.min(topArr)) {

                   totalWidth += width;

               }

               if (left === _.min(leftArr)) {

                   totalHeight += height;

               }


               this.frameBorder.blueBorder.blueBorderContainer.css({'top': topMin, 'left': leftMin, 'display': 'block'});

               this.frameBorder.blueBorder.topDiv.css({'width': totalWidth, 'height': '2px', 'left': 0, 'top': 0});

               this.frameBorder.blueBorder.rightDiv.css({'width': totalWidth, 'height': '2px', 'left': 0, 'top': totalHeight});

               this.frameBorder.blueBorder.bottomDiv.css({'width': '2px', 'height': totalHeight, 'left': totalWidth, 'top': 0});

               this.frameBorder.blueBorder.leftDiv.css({'width': '2px', 'height': totalHeight, 'left': 0, 'top': 0});

               this.frameBorder.corner.css({'top':  totalHeight - 2, 'left': totalWidth - 2});

           }


       }else{

       }

};

ITable.prototype.CornerCopy=function(){
    var that=this,coord,
        wB1=this.frameBorder.redBorder.topDiv,
        wB2=this.frameBorder.redBorder.rightDiv,
        wB3=this.frameBorder.redBorder.bottomDiv,
        wB4=this.frameBorder.redBorder.leftDiv;

    this.table.on(that.mouseString.mouseOver,function(){
        var event=event||arguments[0];
        coord=$(event.target);
        that.moveLast=$(event.target);
    });

    this.frameBorder.corner.on(that.mouseString.mouseEnter,function(){

        $(this).css('cursor', 'crosshair');

        $(this).on(that.mouseString.mouseDown, function () {
            $(document).off(that.mouseString.mouseDown);

            // var event=event||arguments[0];

            var onCols = Number($(coord).attr('cols')) , onRows = Number($(coord).attr('rows')) , sTop , sLeft , top , left,
                copyVal=$(coord).html();

            if($(coord).length>1){
                that.HideReadBorder();
                return;
            }

            $(document).on(that.mouseString.mouseMove, function () {
                 var coords=$(that.moveLast);
                //
                 var nCols = Number($(coords).attr('cols')) , nRows = Number($(coords).attr('rows')) ;
                //
                 var nCSpan = Number($(coords).attr('colspan'))  || 1, nRSpan = Number($(coords).attr('rowspan'))  || 1;

                var moveCS=isNaN(Number(that.moveLast.attr('colspan')))?1:Number(that.moveLast.attr('colspan')),

                    moveRS=isNaN(Number(that.moveLast.attr('rowspan')))?1:Number(that.moveLast.attr('rowspan')),

                    moveX=Number(that.moveLast.attr('cols'))+moveCS-1, moveY=Number(that.moveLast.attr('rows'))+moveRS-1,

                    startX,endX,startY,endY,totalWidth=0,totalHeight=0,tempId,

                    wB1Style,wB2Style,wB3Style,wB4Style;

                if(onCols>nCols){
                      if(onRows===nRows){
                         // console.log('西');
                          startX=moveX;
                          endX=onCols;
                          startY=onRows;
                          endY=onRows;
                      }
                     if(onRows>nRows){

                        // console.log('西北');
                         startX=onCols;
                         endX=onCols;
                         startY=nRows;
                         endY=onRows;
                     }
                     if(onRows<nRows){
                        // console.log('西南');
                         startX=onCols;
                         endX=onCols;
                         startY=onRows;
                         endY=nRows;
                     }
                }else{
                    if(onRows===nRows){
                        //console.log('东');
                        startX=onCols;
                        endX=moveX;
                        startY=onRows;
                        endY=onRows;
                    }
                    if(onRows>nRows){
                       // console.log('东北');
                        startX=onCols;
                        endX=moveX;
                        startY=onRows;
                        endY=onRows;
                        if(onCols===nCols){
                            // console.log('北');
                            startX=onCols;
                            endX=onCols;
                            startY=nRows;
                            endY=onRows;
                        }
                    }
                    if(onRows<nRows){
                        //console.log('东南');
                        startX=onCols;
                        endX=onCols;
                        startY=onRows;
                        endY=nRows;
                        if(onCols===nCols){
                            // console.log('南');
                            startX=onCols;
                            endX=onCols;
                            startY=onRows;
                            endY=nRows;
                        }
                    }
                }

                $('.picked').removeClass('picked');

                for(var m=0,len=that.mergeTds.length;m<len;m++){
                    var mergeCS=isNaN(Number($(that.mergeTds[m]).attr('colspan')))?1:Number($(that.mergeTds[m]).attr('colspan')),
                        mergeRS=isNaN(Number($(that.mergeTds[m]).attr('rowspan')))?1:Number($(that.mergeTds[m]).attr('rowspan')),
                        mergeCol=Number($(that.mergeTds[m]).attr('cols')), mergeRow=Number($(that.mergeTds[m]).attr('rows')),
                        mergeX=Number($(that.mergeTds[m]).attr('cols'))+mergeCS-1, mergeY=Number($(that.mergeTds[m]).attr('rows'))+mergeRS-1;

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
                                       return true;
                                }

                            }

                        }

                    }


                }


                for(var i = startX; i <= endX ; i++) {
                    for(var j = startY; j <= endY; j++) {
                        tempId='#'+j+'-'+i;
                        $(tempId).addClass('picked');

                        if(i===startX){
                            totalHeight+=$('#'+j+'-'+startX).outerHeight();
                        }
                        if(j===startY){
                            totalWidth+=$('#'+startY+'-'+i).outerWidth();
                        }

                    }

                }

                sTop=that.container.scrollTop()-96;
                sLeft=that.container.scrollLeft()-4;

                var startId='#'+startY+'-'+startX;

                top=Number($(startId).offset().top)+sTop+1;
                left=Number($(startId).offset().left)+sLeft+1;

                that.frameBorder.redBorder.redBorderContainer.show();
                that.frameBorder.redBorder.redBorderContainer.css({
                    'top': top,
                    'left': left
                });

                wB1Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': 0 };
                wB2Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': totalHeight };
                wB3Style={ 'width': '2px', 'height': totalHeight, 'left': 0, 'top': 0 };
                wB4Style={ 'width': '2px', 'height': totalHeight, 'left': totalWidth, 'top': 0 };
                wB1.css(wB1Style); wB2.css(wB2Style); wB3.css(wB3Style); wB4.css(wB4Style);

                that.frameBorder.blueBorder.blueBorderContainer.show();


            });
            $(document).off(that.mouseString.mouseUp).on(that.mouseString.mouseUp,function(){
                that.HideReadBorder();
                $('.picked').text(copyVal);
                $(this).off(that.mouseString.mouseUp);
                $(document).off(that.mouseString.mouseDown);
                $(document).off(that.mouseString.mouseMove);
                that.FrameSelect();
            });


        });
    });
};


ITable.prototype.ChooseRow=function(){
    var that=this;
    var wB1=this.frameBorder.blueBorder.topDiv,
        wB2=this.frameBorder.blueBorder.bottomDiv,
        wB3=this.frameBorder.blueBorder.leftDiv,
        wB4=this.frameBorder.blueBorder.rightDiv;
    this.yBox.yTable.find('td').on('click',function(){
        var index=$(this).parent().index()+1;
        var totalHeight=0,totalWidth=0;
        $('.picked').removeClass('picked');

        for(var i=2,len=that.cellCount+1;i<=len;i++){
            var id='#'+index+'-'+i;
            if(Number($(id).attr('rowspan'))>=2&&Number($(id).attr('colspan'))>=2){
                totalWidth+=$(id).outerWidth();
            }else{
                totalHeight=$(id).outerHeight();
                totalWidth+=$(id).outerWidth();
                $(id).addClass('picked');
            }

        }

        var top=Number($(this).offset().top)+Number(that.container.scrollTop())-94;
        var left=Number($(this).offset().left+64);

        that.frameBorder.blueBorder.blueBorderContainer.css({
            'top': top,
            'left': left,
            'display':'block'
        });
        that.frameBorder.corner.css({
            'top': top,
            'left': totalWidth - 2
        });
        var wB1Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': 0 };
        var wB2Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': totalHeight };
        var wB3Style={ 'width': '2px', 'height': totalHeight, 'left': 0, 'top': 0 };
        var wB4Style={ 'width': '2px', 'height': totalHeight, 'left': totalWidth, 'top': 0 };
        wB1.css(wB1Style); wB2.css(wB2Style); wB3.css(wB3Style); wB4.css(wB4Style);

        that.LightCooR($('.picked'));

    });
};

ITable.prototype.ChooseCol=function(){
    var that=this;
    var wB1=this.frameBorder.blueBorder.topDiv,
        wB2=this.frameBorder.blueBorder.bottomDiv,
        wB3=this.frameBorder.blueBorder.leftDiv,
        wB4=this.frameBorder.blueBorder.rightDiv;
    this.xBox.xTable.find('td').on('click',function(){
        var index=Number($(this).index())+1;
        var totalHeight=0,totalWidth=0;
        $('.picked').removeClass('picked');

        for(var l=0,len=that.rowCount;l<=len;l++){
            var id='#'+l+'-'+index;
            if(Number($(id).attr('rowspan'))>=2&&Number($(id).attr('colspan'))>=2){
                  totalHeight+=$(id).outerHeight;
            }else{

                $(id).addClass('picked');
                totalWidth=$(id).outerWidth();
                totalHeight+=$(id).outerHeight();

            }

        }

        var top=Number($(this).offset().top)-70,left=Number($(this).offset().left)+Number(that.container.scrollLeft())-4;

        that.frameBorder.blueBorder.blueBorderContainer.css({
            'top': top,
            'left': left,
            'display':'block'
        });
        that.frameBorder.corner.css({
            'top': top,
            'left': totalWidth - 2
        });
        var wB1Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': 0 };
        var wB2Style={ 'width': totalWidth, 'height': '2px', 'left': 0, 'top': totalHeight };
        var wB3Style={ 'width': '2px', 'height': totalHeight, 'left': 0, 'top': 0 };
        var wB4Style={ 'width': '2px', 'height': totalHeight, 'left': totalWidth, 'top': 0 };
        wB1.css(wB1Style); wB2.css(wB2Style); wB3.css(wB3Style); wB4.css(wB4Style);

        that.LightCooR($('.picked'));

    });
};


ITable.prototype.GetTdStyle=function(obj){
    var td=$(obj);
    if(td.length===1&&td.length>0){
        var classArr=(td.attr('class')).split(' '),len=classArr.length;
        for(var i=0;i<len;i++){
            if(!!classArr[i].match(/(((fsize_)[A-Za-z0-9_]+s*)+)/g)) {
                switch (classArr[i]) {
                    case 'fsize_10':
                        this.toolContainer.fontSize.text('10');
                        break;
                    case 'fsize_12':
                        this.toolContainer.fontSize.text('12');
                        break;
                    case 'fsize_14':
                        this.toolContainer.fontSize.text('14');
                        break;
                    case 'fsize_16':
                        this.toolContainer.fontSize.text('16');
                        break;
                    case 'fsize_18':
                        this.toolContainer.fontSize.text('18');
                        break;
                    case 'fsize_20':
                        this.toolContainer.fontSize.text('20');
                        break;
                    default:
                        break;

                }

            }else if(!!classArr[i].match(/(((font_)[A-Za-z0-9_]+s*)+)/g)) {
                switch (classArr[i]) {
                    case 'font_Song':
                        this.toolContainer.fontFamily.text('宋体');
                        break;
                    case 'font_Black':
                        this.toolContainer.fontFamily.text('黑体');
                        break;
                    case 'font_Kai':
                        this.toolContainer.fontFamily.text('楷体');
                        break;
                    case 'font_Mirco':
                        this.toolContainer.fontFamily.text('微软雅黑');
                        break;
                    default:
                        break;

                }

            }else if(!!classArr[i].match(/(((ft)[A-Za-z0-9_]+\s*)+)/g)) {
                switch (classArr[i]) {
                    case 'ftNormal':
                        this.toolContainer.fillType.text('常规');
                        break;
                    case 'ftNumber':
                        this.toolContainer.fillType.text('数字');
                        break;
                    case 'ftDate':
                        this.toolContainer.fillType.text('日期');
                        break;
                    case 'ftAccount':
                        this.toolContainer.fillType.text('会计专用');
                        break;
                    case 'ftPercent':
                        this.toolContainer.fillType.text('百分比');
                        break;

                }

            }else if(!!classArr[i].match(/picked/g)){
                return;
            }else{
                this.toolContainer.fontFamily.text('黑体');
                this.toolContainer.fontSize.text('10');
                this.toolContainer.fillType.text('常规');
            }

        }
    }else{
        return;
    }

};

ITable.prototype.LightCooR = function (obj) {

    var target = obj;

    this.GetTdStyle(obj);

    this.yBox.yTable.find('tr').find('td').removeClass('lCoo');

    this.xBox.xTable.find('tr').find('td').removeClass('lCoo');

    for (var t = 0 , len=target.length; t < len; t++) {

        var cols = Number($(target).eq(t).attr('cols')) - 1, rows = Number($(target).eq(t).attr('rows')) - 1,

            cSpan = Number($(target).eq(t).attr('colspan')) - 1 || 0, rSpan = Number($(target).eq(t).attr('rowspan')) - 1 || 0;

        for (var i = rows,iLen=rows+rSpan+1; i < iLen; i++) {

            this.yBox.yTable.find('tr').eq(i).find('td').addClass('lCoo');

        }

        for (var j = cols,jLen=cols + cSpan + 1; j < jLen; j++) {

            this.xBox.xTable.find('tr').find('td').eq(j - 1).addClass('lCoo');

        }

    }

};


ITable.prototype.ListenHeight=function(){
    var len=this.rowCount,thHeight;
    for(var j=0;j<len;j++){
        thHeight=this.table.find('tr').eq(j).find('th').height()-1;
        this.yBox.yTable.find('tr').eq(j).find('td').height(thHeight);
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

    this.toolContainer.tools = $('<div class="tools"></div>');

    this.header.append(this.toolContainer.tools);

    this.header.insertBefore(this.container);

};

//字体类型

ITable.prototype.FontFamily = function () {

  //  var that=this;

    var menu= this.CreateSelection('fontFamily', this.settings.fontFamily);

    this.toolContainer.fontFamily=menu.find('#fontFamily');

    var sel_a = this.toolContainer.fontFamily.find('ul li a') , className, curClass, selThem;

    this.toolContainer.fontFamily.attr('defaultClass', sel_a.eq(0).attr('class'));

    sel_a.on('click', function () {

        className = $(this).attr('class');

        $('.picked').addClass(className);

        // that.selectedArr.map(function(element){
        //     console.log(element);
        // });

        var reg = new RegExp("(((font_)[A-Za-z0-9_]+\s*)+)", "g");

        curClass = $('.picked').attr('class');

        if (!!curClass) {

            curClass = curClass.replace(reg, className);

        } else {

            return;

        }

        curClass = _.uniq(curClass.split(' ')).join(' ');

        selThem = $('.picked');

        selThem.removeAttr('class');

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

    var menu = this.CreateSelection('fontSize', this.settings.fontSize),

        sel_a = menu.find('ul li a'),className, curClass, selThem ,that=this;

    this.toolContainer.fontSize=menu.find('#fontSize');

    this.toolContainer.fontSize.attr('defaultClass', sel_a.eq(0).attr('class'));

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

        selThem.removeAttr('class');

        selThem.addClass(curClass);

        that.ListenHeight();

    });

    sel_a.on('mouseover',function(){
        $(this).css('background','#ECECEC');
    });

    sel_a.on('mouseout',function(){
        $(this).css('background', '#FFFFFF');
    });

};

//字体粗细

ITable.prototype.FontBold = function () {

    var simMenu = this.CreateSimpleMenu('fbold'), sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffbold') ? $('.picked').removeClass('ffbold') : $('.picked').addClass('ffbold');

    });

};

//字体倾斜

ITable.prototype.FontItalic = function () {

    var simMenu = this.CreateSimpleMenu('fitalic'), sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffitalic') ? $('.picked').removeClass('ffitalic') : $('.picked').addClass('ffitalic');

    });

};

//字体下划线

ITable.prototype.FontOverLine = function () {

    var simMenu = this.CreateSimpleMenu('foverline'), sel_a = simMenu.children(0);

    sel_a.on('click', function () {

        $('.picked').hasClass('ffoverline') ? $('.picked').removeClass('ffoverline') : $('.picked').addClass('ffoverline');

    });

};

//字体颜色

ITable.prototype.FontColor = function () {

    var select = this.CreateCellMenu('d_fcolor', 'fontColor', this.settings.fontColor), td = $(select).find('td'), className, curClass, selThem;

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

        selThem.removeAttr('class');

        selThem.addClass(curClass);

    });

};

//表格背景

ITable.prototype.BgColor = function () {

    var select = this.CreateCellMenu('d_fill', 'bgColor', this.settings.bgColor), td = $(select).find('td'), className, curClass, selThem;

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

        selThem.removeAttr('class');

        selThem.addClass(curClass);

    });

};

//字符对齐

ITable.prototype.TextAlign = function () {

    var select = this.CreateCellMenu('f_align', 'textAlign', this.settings.textAlign), td  = $(select).find('td'), className, curClass, selThem;

    td.css('background', '#FFFFFF');

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

        selThem.removeAttr('class');

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

    var select = this.CreateSelection('express', this.settings.express), sel_a = $(select).find('ul li a'), that = this;

    sel_a.on('click', function () {

        var ways = $(this).attr('class').replace('fx_', '');

        that.Formula(ways);

    });

};

ITable.prototype.FillType = function(){
    var select = this.CreateSelection('fillType', this.settings.fillType), sel_a = $(select).find('ul li a'), that = this;

    this.toolContainer.fillType=select.find('#fillType');
    sel_a.on('click', function () {

        var ways = $(this).attr('class').replace('ft_', '');

        that.SetFillType(ways);

    });
};

ITable.prototype.GetFillType=function(obj){

        var newValue;

        if($(obj).hasClass('ftNormal')){

            if(isNaN(Number($(obj).text()))){
                newValue= $(obj).text();
                return newValue;
            }else{
                newValue= Number($(obj).text());
                return newValue;
            }


        }else if($(obj).hasClass('ftNumber')){

            newValue= Number($(obj).text());
            return newValue;

        }else if($(obj).hasClass('ftDate')){

            return ;

        }else if($(obj).hasClass('ftAccount')){

            newValue=$(obj).text().replace('¥','');

            return newValue;

        }else if($(obj).hasClass('ftPercent')){

            newValue=Number($(obj).text().replace('%','')*100);

            return  newValue;

        }else if($(obj).hasClass('ftText')){
            return ;
        }else{
            newValue=Number($(obj).text());
            return newValue;
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
         var objValue=value , numValue=Number(value) , newClasses=type.split(' ') , newClass , newValue;

         for(var i=0,len=newClasses.length;i<len;i++){
             if(!!newClasses[i].match(/(((ft)[A-Za-z0-9_]+\s*)+)/g)){
                 newClass=newClasses[i];
            }
         }

        switch(newClass){
            case 'ftNormal':
                 newValue=objValue;
                 return newValue;

            case 'ftNumber':
                 newValue=numValue.toFixed(2);
                 return newValue;

            case 'ftAccount':
                 newValue= '¥'+ numValue.toFixed(2);
                 return newValue;

            case  'ftPercent':
                 newValue= (Math.round(Number(numValue) * 10000)/100).toFixed(2) + '%';
                 return newValue;

        }


};

ITable.prototype.FtNormal=function(){
    var that=this;
      if($('.picked').length>0){
          $('.picked').each(function(){
              var className, curClass, selThem;
              if(!$(this).hasClass('ftNormal')){

                  className = 'ftNormal';

                  $(this).addClass(className);

                  var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                  curClass = $(this).attr('class');

                  if (!curClass) {
                      return;
                  } else {

                      curClass = curClass.replace(reg, className);

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
            var className, curClass,selThem;

            if ($(this).hasClass('ftNumber')) {
            } else {
                className = 'ftNumber';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!curClass) {
                    return;
                } else {

                    curClass = curClass.replace(reg, className);

                }

                curClass = _.uniq(curClass.split(' ')).join(' ');

                selThem = $(this);

                $(this).removeAttr('class');

                var oldVal = selThem.text();

                var newVal = that.TypeToValue(curClass, oldVal);

                selThem.text(newVal);

                selThem.addClass(curClass);


            }

        });

    }
};

ITable.prototype.FtDate=function(){
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass,selThem;
            if(!$(this).hasClass('ftDate')){
                className = 'ftDate';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!curClass) {
                    return;
                } else {
                    curClass = curClass.replace(reg, className);
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
            var className, curClass,selThem;
            if(!$(this).hasClass('ftAccount')){
                className = 'ftAccount';

                $(this).addClass(className);

                var reg = new RegExp("(((ft)[A-Za-z0-9_]+\s*)+)", "g");

                curClass = $(this).attr('class');

                if (!curClass) {

                    return;

                } else {

                    curClass = curClass.replace(reg, className);

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
            var className, curClass,selThem;
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

                var newVal=(Math.round(Number($(this).text()) * 10000)/100).toFixed(2) + '%';

                $(this).text(newVal);

            }

        });

    }
};

ITable.prototype.FtText=function(){
    if($('.picked').length>0){
        $('.picked').each(function(){
            var className, curClass,selThem;
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

    var simMenu = this.CreateSimpleMenu('editRowCol insertCol', ''), sel_a = simMenu.children(0), that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked') , xArr = [], yArr = [] , xMax, xMin , yMax, yMin,sLength=sNode.length;

        if (sLength >= 2) {

            for (var i = 0; i < sLength; i++) {

                var cols = Number(sNode.eq(i).attr('cols')) , rows = Number(sNode.eq(i).attr('rows'));

                var cAdd = Number(sNode.eq(i).attr('colspan')) || 1 , rAdd = Number(sNode.eq(i).attr('rowspan')) || 1;

                cols = cols + cAdd - 1;

                rows = rows + rAdd - 1;

                xArr.push(cols);

                yArr.push(rows);

                xMax = _.max(xArr); xMin = _.min(xArr); yMax = _.max(yArr); yMin = _.min(yArr);
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

            var xIndex = Number(sNode.attr('cols')) , col = $('<col style="width:100px">');

            for (var i = 1; i < that.rowCount + 1;) {
                if ($('#' + i + '-' + xIndex).length > 0) {
                    var cSpan = Number($('#' + i + '-' + xIndex).attr('colspan')),rSpan = Number($('#' + i + '-' + xIndex).attr('rowspan'));
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
                        var mStartX = Number($(that.mergeTds).eq(j).attr('cols')), mStartY = Number($(that.mergeTds).eq(j).attr('rows')),
                            mCSpan = Number($(that.mergeTds).eq(j).attr('colspan')), mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan')),
                            mEndX = mStartX + mCSpan;


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

    var simMenu = this.CreateSimpleMenu('editRowCol insertRow', ''), sel_a = simMenu.children(0), that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked'), xArr = [], yArr = [], xMax, xMin, yMax, yMin;

        if (sNode.length >= 2) {

            for (var i = 0; i < sNode.length; i++) {

                var cols = Number(sNode.eq(i).attr('cols')),rows = Number(sNode.eq(i).attr('rows'));

                var cAdd = Number(sNode.eq(i).attr('colspan')) || 1,rAdd = Number(sNode.eq(i).attr('rowspan')) || 1;

                cols = cols + cAdd - 1;

                rows = rows + rAdd - 1;

                xArr.push(cols);

                yArr.push(rows);

                xMax = _.max(xArr); xMin = _.min(xArr); yMax = _.max(yArr); yMin = _.min(yArr);

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

            var yIndex = Number(sNode.attr('rows')),tr = $('<tr></tr>');

            for (var i = 0; i <= that.cellCount;) {
                 if(i===0){
                     var th = $('<th></th>');
                     tr.append(th);
                     i++;
                 }else{
                     if ($('#' + yIndex + '-' + i).length > 0) {
                         var cSpan = Number($('#' + yIndex + '-' + i).attr('colspan')),rSpan = Number($('#' + yIndex + '-' + i).attr('rowspan'));
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
                             var mStartX = Number($(that.mergeTds).eq(j).attr('cols')), mStartY = Number($(that.mergeTds).eq(j).attr('rows')),
                                 mCSpan = Number($(that.mergeTds).eq(j).attr('colspan')), mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan'));

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

    var simMenu = this.CreateSimpleMenu('editRowCol delCol', ''),sel_a = simMenu.children(0),that = this;

    sel_a.on('click', function () {

        // var xArr = [],
        //
        //     yArr = [];
        //
        // var xMax, xMin, yMax, yMin;

        var sNode = $('.picked');
        if (sNode.length >= 2) {

        } else {


            var xIndex = Number(sNode.attr('cols'));

            for (var i = 1; i < that.rowCount + 1;) {
                if ($('#' + i + '-' + xIndex).length > 0) {
                    var cSpan = Number($('#' + i + '-' + xIndex).attr('colspan')), rSpan = Number($('#' + i + '-' + xIndex).attr('rowspan'));
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
                        var mStartX = Number($(that.mergeTds).eq(j).attr('cols')), mStartY = Number($(that.mergeTds).eq(j).attr('rows')),
                            mCSpan = Number($(that.mergeTds).eq(j).attr('colspan')), mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan')),
                            mEndX = mStartX + mCSpan;


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

    var simMenu = this.CreateSimpleMenu('editRowCol delRow', ''), sel_a = simMenu.children(0), that = this;

    sel_a.on('click', function () {

        var sNode = $('.picked');

        if (sNode.length >= 2) {

        } else {

            var yIndex = Number(sNode.attr('rows'));

            for (var i = 1; i <= that.cellCount+1;) {

                    if ($('#' + yIndex + '-' + i).length > 0) {
                        var cSpan = Number($('#' + yIndex + '-' + i).attr('colspan')), rSpan = Number($('#' + yIndex + '-' + i).attr('rowspan'));
                        if (rSpan >= 2) {
                            $('#' + yIndex + '-' + i).attr('rowspan', rSpan - 1);
                            i+=cSpan;
                        } else {

                            $('#' + yIndex + '-' + i).remove();
                            i++;
                        }
                    }else{

                        for (var j = 0; j <= that.mergeTds.length; j++) {
                            var mStartX = Number($(that.mergeTds).eq(j).attr('cols')),mStartY = Number($(that.mergeTds).eq(j).attr('rows')),
                                mCSpan = Number($(that.mergeTds).eq(j).attr('colspan')),mRSpan = Number($(that.mergeTds).eq(j).attr('rowspan')),
                                mEndY = mStartY + mRSpan;

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
    for(var i=1,len=data.length;i<len;i++){
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
           var sum=0,rArr=[],cArr=[],pArr=[];
           $('.picked').each(function(){
               var val=that.GetFillType($(this)),nowRow=Number($(this).attr('rows')),nowCol=Number($(this).attr('cols'));
               rArr.push(nowRow);
               cArr.push(nowCol);
               if(isNaN(val)){
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
        var sum=0,pL=$('.picked').length,avg=0,rArr=[],cArr=[],pArr=[];
        $('.picked').each(function(){
            var val=that.GetFillType($(this)),nowRow=Number($(this).attr('rows')),nowCol=Number($(this).attr('cols'));
            rArr.push(nowRow);
            cArr.push(nowCol);
            if(isNaN(val)){
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
        var count=0,rArr=[],cArr=[];
        $('.picked').each(function(){
            var val=Number($(this).text()),nowRow=Number($(this).attr('rows')),nowCol=Number($(this).attr('cols'));
            rArr.push(nowRow);
            cArr.push(nowCol);
            if(!isNaN(val)&&val!==0){
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
        var arr=[],rArr=[],cArr=[],pArr=[];
        $('.picked').each(function(){
            var val=Number($(this).text()),nowRow=Number($(this).attr('rows')),nowCol=Number($(this).attr('cols'));
            rArr.push(nowRow);
            cArr.push(nowCol);
            if(!isNaN(val)&&val!==0){
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
        var arr=[],rArr=[],cArr=[],pArr=[];
        $('.picked').each(function(){
            var val=Number($(this).text()),nowRow=Number($(this).attr('rows')),nowCol=Number($(this).attr('cols'));
            rArr.push(nowRow);
            cArr.push(nowCol);

            if(!isNaN(val)&&val!==0){
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

    var mergeBtn = this.CreateSimpleMenu('mergeBtn'),that = this;

    mergeBtn.on('click', function () {

        var $t = that.table;

        if ($("table", $t).length > 0) {

            alert("不支持嵌套表格！");

            return;

        }

        var sigDel = "sign4delete", sigSel = "picked";

        $("th,td", $t).each(function () {

            var rIdx = $("tr", $t).index($(this).parent("tr")), cIdx = $(this).parent().children("th,td").index(this),

                rowSpan = Number($(this).attr("rowspan")) || 1, colSpan = Number($(this).attr("colspan")) || 1,

                isSel = $(this).hasClass(sigSel);

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

        var rMin = 10000, cMin = 10000, rMax = 0, cMax = 0, rNum, cNum;

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

            var rIdx = $("tr", $t).index($(this).parent("tr")),cIdx = $(this).parent().children("th,td").index(this);

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

    var splitBtn = this.CreateSimpleMenu('splitBtn'),that = this;

    splitBtn.on('click', function () {

        var $t = that.table;

        if ($("table", $t).length > 0) {

            alert("不支持嵌套表格！");

            return;

        }

        var sigDel = "sign4delete",sigSel = "picked";

        $("th,td", $t).each(function () {

            var rIdx = $("tr", $t).index($(this).parent("tr")),

                cIdx = $(this).parent().children("th,td").index(this),

                rowSpan = Number($(this).attr("rowspan")) || 1,

                colSpan = Number($(this).attr("colspan")) || 1,

                isSel = $(this).hasClass(sigSel);

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

    var selectionBox = $('<div class="toolBox"></div>'), selectHead = $('<div id="' + id + '"></div>'), selectUl = $('<ul></ul>'), selectLi, arr = [];

    for (var menu in menus) {

        if(menus.hasOwnProperty(menu)){
            arr.push(menu);

            selectHead.text(arr[0]);

            selectLi = '<li><a class="' + menus[menu] + '">' + menu + '</a></li>';

            selectUl.append(selectLi);
        }


    }

    selectHead.after(selectUl);

    selectionBox.append(selectHead);

    this.toolContainer.tools.append(selectionBox);

    selectUl.hide();

    selectHead.on('click', function () {

        selectUl.toggle();

    });

    selectUl.find('li a').on('click', function () {

        selectHead.text($(this).text());

        selectHead.attr('curClass', $(this).attr('class'));

    });

    return selectionBox;

};


//创建工具栏单个菜单

ITable.prototype.CreateSimpleMenu = function (className, text) {

    var menus = $('<div class="toolBox"></div>'), mText = text || '', mClass = className, simTool = $('<span class="' + mClass + '">' + mText + '</span>');

    menus.append(simTool);

    this.toolContainer.tools.append(menus);

    return menus;

};

//创建工具栏格子菜单

ITable.prototype.CreateCellMenu = function (dClass, className, menus) {

    var selectionBox = $('<div class="toolBox"></div>'), selectHead = $('<div class="' + dClass + '"></div>'), selectTb = $('<table class="' + className + '"></table>'),

        selectTr = $('<tr></tr>'), selectTd , arr1 = [], arr2 = [];

    for (var menu in menus) {

        if(menus.hasOwnProperty(menu)){

            arr1.push(menus[menu].tdclass);

            arr2.push(menus[menu].fclass);
        }

    }

    for (var i = 0, len =arr1.length+1; i < len; i++) {

        selectTd = $('<td class="' + arr1[i] + '"><a class="' + arr2[i] + '"></a></td>');

        selectTr.append(selectTd);

        if ((i + 1) % 5 === 0 && (i + 1) !== 0) {

            selectTb.append(selectTr);

            selectTr = $('<tr></tr>');

        } else {

            selectTb.append(selectTr);

        }

    }

    selectHead.after(selectTb);

    selectionBox.append(selectHead);

    this.toolContainer.tools.append(selectionBox);

    selectTb.hide();

    selectHead.on('click', function () {

        selectTb.toggle();

    });

    return selectionBox;

};

//增加sheet

ITable.prototype.AddSheet = function () {

    var i = 2, box = this.container, that = this;

    $('.addSheet').click(function () {

        box.empty();

        var dd = $("<dd class='sheet sheetDefault' id=sheet" + i + ">sheet" + i + "</dd>"),curId = $(".sheetDefault").attr('id');

        curId = curId.replace('sheet', '');

        curId = Number(curId);

        $("#sheet" + curId).removeClass('sheetDefault');

        var neId = Number(curId) + 1;

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

        var dId = $(this).attr('id').replace('sheet', '');

        dId = Number(dId);

        that.CreateContent(dId);

        that.FillTd(dId);

        $(this).addClass('sheetDefault').siblings().removeClass('sheetDefault');

        return false;

    });

    $('.sheet').on('dblclick', function () {

        var that = $(this), ev = event || window.event , tdWidth = that.width() , tdHeight = that.height() , tdText = that.text();

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

    var lSheet = $('.lSheet'), rSheet = $('.rSheet'),sDl = $(".sheetQueuedDl"),num = 0;

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

    var offsetLeftArray = [];

    var cell; // 单元格Dom

    var col; // 单元格实际所在列

    var cellStr; // 每个cell以row,col,rowSpan,colSpan,value形式

    var cellStrArray = [];

    var t = this.table;

    var id = (t.attr('id')).replace('iTable', ''), objTab = document.getElementById('iTable' + id);

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

            col = containsArray(offsetLeftArray,cell.offsetLeft);

            cellStr = i + ',' + col;

            cellStrArray.push(cellStr);

            cell.setAttribute("rows", i + 1);

            cell.setAttribute("cols" , col + 1);

            cell.setAttribute("id",(i+1)+'-'+(col+1));

        }

    }

};

//col更新
ITable.prototype.UpdateTableCol=function(){

    for (var j = 0,len=this.cellCount; j <= len; j++) {

        this.table.find('col').eq(j).attr('id','t'+j);

    }
};

//y轴更新

ITable.prototype.UpdateLeft = function (index,type) {

    switch (type){

        case 'add':

            this.yBox.yTable.find('tr').eq(index).after('<tr><td></td></tr>');

            for (var j = index,len=this.rowCount; j < len; j++) {

                this.yBox.yTable.find('tr').eq(j).find('td').text(j+1);

            }
            break;

        case 'delete':

            this.yBox.yTable.find('tr').eq(index).remove();

            for (var j = 0,len=this.rowCount; j < len; j++) {

                this.yBox.yTable.find('tr').eq(j).find('td').text(j+1);

            }

            break;
        default:
            break;

    }
    this.LargeRow();
};

//x轴更新

ITable.prototype.UpdateTop = function (index,type) {
    var len;
    switch (type) {
        case 'add':
            this.xBox.xTable.find('colgroup').find('col').eq(index).after('<col style="width:100px">');

            this.xBox.xTable.find('tbody').find('tr').find('td').eq(index).after('<td></td>');

            len=this.cellCount;

            for (var j = index; j <= len; j++) {

                this.xBox.xTable.find('tbody').find('tr').find('td').eq(j).text(IntToChr(j));

            }
            break;

        case 'delete':
            this.xBox.xTable.find('colgroup').find('col').eq(index).remove();

            this.xBox.xTable.find('tbody').find('tr').find('td').eq(index).remove();

            len=this.cellCount;

            for (var j = 1; j <= len; j++) {

                this.xBox.xTable.find('tbody').find('tr').find('td').eq(j).text(IntToChr(j));

            }
            break;
        default:
            break;
    }
    this.LargeCol();
};

//拖拽放宽列

ITable.prototype.LargeCol = function () {

    var container = this.container,that = this, event = window.event || arguments[0], exW =(this.xBox.xOrder).outerWidth();

    this.xBox.xTable.off(that.mouseString.mouseMove).on(that.mouseString.mouseMove,function(){
         var event = window.event || arguments[0];

         var w = $(event.target).width();

         var x = event.clientX - exW;

        if($(event.target).offset().left+w-exW<x+10){
            $(event.target).css({
                cursor:'col-resize'
            });

            $(event.target).off(that.mouseString.mouseDown).on(that.mouseString.mouseDown, function (event) {

                $(document).off(that.mouseString.mouseDown);

                var index = $(this).index();

                var lLine = $('<div class="lline"></div>');

                var sL=Number($(that.container).scrollLeft());

                var w = $(this).width()+sL;

                var x = event.clientX - exW+sL;

                if($(this).offset().left+w-exW<x+10){

                    $('body').on(that.mouseString.mouseMove,function (event) {

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

                            that.xBox.xTable.find('colgroup').find('col').eq(index).css('width', w + move);

                            $(container).append(lLine);

                        }

                    });
                }
                $('body').on(that.mouseString.mouseUp,function () {

                    $('body').off(that.mouseString.mouseMove);

                    lLine.remove();

                    that.FrameSelect();
                });

            });

        }else{
            $(event.target).css({
                cursor:'default'
            });
        }

    });

};

//拖拽放宽行

ITable.prototype.LargeRow = function () {

    var container = this.container, that = this , exH = this.yBox.yOrder.outerHeight(), headerH=parseInt($(container).css('marginTop'));

    this.yBox.yTable.off(that.mouseString.mouseMove).on(that.mouseString.mouseMove,function(){

        var event = window.event || arguments[0];

        var h = $(event.target).height(),y = event.clientY - exH;

        if($(event.target).offset().top+h-exH<y+6) {

            $(event.target).css({
                cursor: 'row-resize'
            });

            $(event.target).off(that.mouseString.mouseDown).on(that.mouseString.mouseDown, function (event) {

                $(document).off(that.mouseString.mouseDown);

                var index = $(this).parent().index();

                var lLine = $('<div class="rline"></div>');

                var sT=Number($(that.container).scrollTop());

                var h = $(this).height()+sT;

                var y = event.clientY - exH+sT;


                if($(this).offset().top+h-exH<y+10) {

                    $('body').on(that.mouseString.mouseMove,function (event) {

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

                            that.yBox.yTable.find('td').eq(index).css('height', tempMove_1);

                            $(container).append(lLine);

                        }

                    });
                }



                $('body').on(that.mouseString.mouseUp,function () {

                    $('body').off(that.mouseString.mouseMove);

                    lLine.remove();

                    that.FrameSelect();

                });

            });

        }else{
            $(event.target).css({
                cursor:'default'
            });
        }
    });
};

//创建公式输入框

ITable.prototype.FillBlank = function () {

    var fxBox = $('<div class="fx"></div>'), fxInput = $('<input type="text" id="ip_fx">');
    this.fillContainer.disBox = $('<span class="disbox" id="disbox"></span>');

    fxBox.append(this.fillContainer.disBox);

    fxBox.append(fxInput);

    this.header.append(fxBox);

    //this.FillWork();

};

// //输入操作
//
// ITable.prototype.FillWork = function () {
//
//     var ev = window.event || arguments[0];
//
//     var ifx = $('#ip_fx');
//
//     var pValue, nValue;
//
//     var pArr, nArr, cArr;
//
//     var endText;
//
//     var res, delRes;
//
//     var delText;
//
//     var reg, flReg;
//
//     var that = this;
//
//     var calText;
//
//     ifx.keyup(function (ev) {
//
//         pValue = ifx.val();
//
//         flReg = /^\=|\+|\-|\*|\/|\(|\)/;
//
//         reg = /^\=((((\(*([a-zA-Z]([1-9]\d*))\)*|([1-9]\d*))(\+|-|\/|\*))*(([1-9]\d*)|([a-zA-Z]([1-9]\d*))*\)*))|([a-zA-Z]([1-9]\d*)))/;
//
//         res = pValue.match(reg);
//
//         if ((!!res) && (!!res[0])) {
//
//             endText = res[0].toString();
//
//             pArr = endText.split(flReg);
//
//             for (var i = 0; i < pArr.length; i++) {
//
//                 if (!!pArr[i]) {
//
//                     if (String(nValue).indexOf(pArr[i]) <= -1) {
//
//                         lightTd(pArr[i]);
//
//                         cLightTd(pArr[i].substr(0, pArr[i].length - 1));
//
//                     }
//
//                 }
//
//             }
//
//         }
//
//         if ($('.picked').length > 1) {
//
//             return;
//
//         } else {
//
//             $('.picked').text(pValue);
//
//         }
//
//         //删除
//
//         // if ((ev.keyCode === 8)) {
//         //
//         //     delRes = nValue.match(/([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*/);
//         //
//         //     if (!!nValue) {
//         //
//         //         dArr = nValue.split(flReg);
//         //
//         //         cArr = pValue.split(flReg);
//         //
//         //         delTmp = getUniqueSet(cArr, dArr);
//         //
//         //         if (!!delTmp[1]) {
//         //
//         //             cLightTd(delTmp[1]);
//         //
//         //         }
//         //
//         //     }
//         //
//         // }
//         //
//         // if ((ev.keyCode === 13)) {
//         //
//         //     this.blur();
//         //
//         //     var allValue = pValue;
//         //
//         //     calRes = allValue.match(reg);
//         //
//         //     if ((!!calRes) && (!!calRes[0])) {
//         //
//         //         fText = calRes[0].toString();
//         //
//         //         allArr = fText.split(flReg);
//         //
//         //         for (var i = 0; i < allArr.length; i++) {
//         //
//         //             if (!!allArr[i]) {
//         //
//         //                 var tmp = allArr[i];
//         //
//         //                 var tmpVal = String(that.getValue(allArr[i]));
//         //
//         //                 allValue = allValue.replace(tmp, tmpVal);
//         //
//         //             }
//         //
//         //         }
//         //
//         //         calText = allValue;
//         //
//         //         calText = calText.substring(1);
//         //
//         //         var result = dal2Rpn(calText);
//         //
//         //         $('.picked').text(result);
//         //
//         //         $('.mask').remove();
//         //
//         //     }
//         //
//         // }
//
//         ifx.onkeydown(function (ev) {
//
//             nValue = ifx.val();
//
//         });
//
//     });
//
// };

//高亮蒙版

ITable.prototype.CreateMask = function (left, top, width, height, posX, posY) {

    var mask = $('<div class="mask"></div>'), color = getRandomColor();

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

    var that = this, rMenus = this.CreateRMenus(), winH = $(window).height() - this.footer.outerHeight(), winW = $(window).width();

    this.table.contextmenu(function () {

        var ev = event || window.event,

            oX = ev.clientX , oY = ev.clientY,

            mH = $(rMenus).height(), mW = $(rMenus).width();

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

    var $copyDiv = $('<div class="menu-copy">复制</div>'),dataArr=[];
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

    // var that = this;


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



// ITable.prototype.getValue = function (arr) {
//
//     arr = arr.toString();
//
//     var xCoo = arr.replace(/[a-zA-Z]*/, ' '), yCoo = arr.replace(/[1-9]\d*/, ' ');
//
//     yCoo = yCoo.charCodeAt(0) - 96;
//
//     xCoo--;yCoo--;
//
//     var value,text = Number($('#'+yCoo+'-'+xCoo).text());
//
//
//     if (typeof(text) !== 'number') {
//
//         value = 0;
//
//     } else {
//
//         (!!text) ? value = Number(text) : value = 0;
//
//     }
//
//     return value;
//
// };

ITable.prototype.freezeBtn=function(){
   var btn=this.CreateSimpleMenu('fbold');
   this.toolContainer.tools.append(btn);
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

             $('#fColBox').find('td').css({
                'height':'20px'
             });



    }else{
        return;
    }

};


// //高亮单元格
//
// function lightTd(tmp) {
//
//     var posY = tmp.match(/^[a-zA-Z]{1}/gi),posX = tmp.match(/\+?[1-9][0-9]*$/g);
//
//     posY = posY.toString();
//
//     posY = posY.toLocaleLowerCase().charCodeAt(0) - 96;
//
//     posY--;
//
//     posX = posX.toString() - 1;
//
//     if (posY === null || posX === null || posY.length === 0 || String(posY).length === 0) {
//
//         return;
//
//     }
//
//     var lTd = $('td[cols=' + (posX + 1) + '][rows=' + (posY + 1) + ']');
//
//     var width = lTd[0].offsetWidth, height = lTd[0].offsetHeight, left = lTd[0].offsetLeft, top = lTd[0].offsetTop;
//
//     t.CreateMask(left, top, width, height, posX, posY);
//
// }

//随机颜色

function getRandomColor() {

    return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);

}

// //取消高亮
//
// function cLightTd(tmp) {
//
//     var posY = tmp.match(/^[a-zA-Z]{1}/gi),posX = tmp.match(/\+?[1-9][0-9]*$/g);
//
//     posY = posY.toString();
//
//     posY = posY.toLocaleLowerCase().charCodeAt(0) - 96;
//
//     if (posY === null || posX === null || posY.length === 0 || String(posX).length === 0) {
//
//         return;
//
//     }
//
//     posY--;
//
//     posX = posX.toString() - 1;
//
//     $('[mpos="' + posX + '-' + posY + '"]').remove();
//
// }
//
// //字符串取异
//
// function getUniqueSet(setA, setB) {
//
//     var temp = {};
//
//     for (var i = 0, len = setA.length; i < len; i++) {
//
//         temp[setA[i]] = 0;
//
//     }
//
//     for (var j = 0, len = setB.length; j < len; j++) {
//
//         if (typeof temp[setB[j]] === 'undefined') {
//
//             temp[setB[j]] = 0;
//
//         } else {
//
//             temp[setB[j]]++;
//
//         }
//
//     }
//
//     //output
//
//     var ret = [];
//
//     for (var item in temp) {
//
//         !temp[item] && ret.push(item);
//
//     }
//
//     return ret;
//
// }

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

    var start = 65,str = '';

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

          //  break;

        }

    }

    return -1;

}


ITable.prototype.Init = function () {

    var tOption = this.tabs;

    this.CreateContent();

    this.CreateXAxis();

    this.CreateYAxis();

    this.SetCss();

    this.TextArea();

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

    this.LargeCol();

    this.LargeRow();

    this.CornerCopy();

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






