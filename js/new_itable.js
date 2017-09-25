    "use strict" //严格模式

    function iTable(tContainer, tSettings, tabs) {

        this.rowCount = tSettings.rowCount;

        this.cellCount = tSettings.cellCount;

        this.container = tContainer;

        this.settings = tSettings;

        this.tabs = tabs;

        var header, footer, curIndex, tools;

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

            var colg = $('<colgroup></colgroup>');

            tr.append(th);

            for (var j = 0; j < this.cellCount + 1; j++) {

                var td = this.createTd('', '');

                if (j == 0) {

                    var col = $('<col style="width:63px">');

                } else {

                    var col = $('<col style="width:100px">');

                }

                colg.append(col);

                if (i == 0) {

                    $("#iTable" + tId).append(colg);

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

        var td = $("<td class=" + className + ">" + tdValue + "</td>");

        return td;

    }

    iTable.prototype.createXaxis = function () {

        var xAxis = $("<div class='xOrder'></div>");

        xAxis.empty();

        var xTable = $("<table class='titleTable'></table>");

        var curT = this.getCurTable();

        var th = $('<th></th>');

        xAxis.insertBefore(this.container);

        xAxis.append(xTable);

        var tr = $("<tr></tr>");

        tr.append(th);

        for (var i = 0; i < 1; i++) {

            var colg = $('<colgroup></colgroup>');

            for (var j = 0; j < this.cellCount + 1; j++) {

                var td = $("<td>" + IntToChr(j) + "</td>");

                if (j == 0) {

                    var col = $('<col style="width:63px">');

                } else {

                    var col = $('<col style="width:100px">');

                }

                colg.append(col);

                if (i == 0) {

                    xTable.append(colg);

                }

                tr.append(td);

            }

            xTable.append(tr);

        }

    }

    iTable.prototype.createYaxis = function () {

        var yAxis = $("<div class='yOrder'></div>");

        var yTable = $("<table class='leftTable'></table>");

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

        //	content.insertBefore(this.container);

        $(this.container).append(content);

    }

    iTable.prototype.frameSelect = function () {
        var coords;
        var that=this;
       //$(this.container).on('mousedown', areaChoose);
        $('.dataTable tr td').each(function(){
            $(this).on('mouseover',function(){
                 coords=$(this);
            });
        });

        $(this.container).on('mousedown',function(){
            var originTd=$(coords);

            var ev = window.event || arguments[0];

            var onCols = parseInt($(coords).attr('cols')) ;

            var onRows = parseInt($(coords).attr('rows')) ;

            var onCspan = parseInt($(coords).attr('colspan'))  || 1;

            var onRspan = parseInt($(coords).attr('rowspan'))  || 1;

            var expectX = onCols + onCspan-1;

            var expectY = onRows + onRspan-1;

            var xMin = expectX,yMin = expectY;

            var sleft = parseInt($(this).scrollLeft());

            var stop = parseInt($(this).scrollTop());

            var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());

            var oX = ev.clientX + sleft;

            var oY = ev.clientY - disHeight + stop;


            $(that.container).on('mousemove',function(){

                var nCols = parseInt($(coords).attr('cols')) ;

                var nRows = parseInt($(coords).attr('rows')) ;

                var nCspan = parseInt($(coords).attr('colspan'))  || 1;

                var nRspan = parseInt($(coords).attr('rowspan'))  || 1;

                var expectX = nCols + nCspan-1;

                var expectY = nRows + nRspan-1;

                var xMax=expectX,yMax=expectY;

                var evt = window.event || arguments[0];
                var _x,_y;

                _x = (evt.x || evt.clientX);

                _y = (evt.y || evt.clientY);

                _x = _x + sleft;

                _y = _y + stop - disHeight;


               if(_x-oX>40){

                   if(_y-oY>40){
                       //E-S 东南
                       xMin=onCols,yMin=onRows;
                   }else{
                       //E-N 东北
                       xMin=onCols,yMin=onRows + onRspan-1;
                   }
               }else{
                   if(_y-oY>40){
                       // W-S 西南
                        xMin=onCols+onCspan-1,yMin=onRows;
                   }else{
                       //W-N  西北
                        xMin=onCols+onCspan-1,yMin=onRows+onRspan-1;
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



            });
            $(that.container).on('mouseup',function(){
                $(this).off('mousemove');
            })
        });
    }


    function tdHover(event){

        var coords=event.data.target;
        console.log(event.data.target);

        // $('.dataTable tr td').each(function(){
        //     $(this).on('mouseover',function(){
        //         console.log($(this));
        //
        //     });
        //
        // });



    }


    function areaChoose() {

        var cWidth = parseInt($(this.container).width());

        var cHeight = parseInt($(this.container).height());

        var disWidth = parseInt($('.yOrder').outerWidth());

        var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());

        var that = t;

        var fileNodes = $('.dataTable tr td');

        var isSelect = true;

        var ev = window.event || arguments[0];

        var sleft = parseInt($(this).scrollLeft());

        var stop = parseInt($(this).scrollTop());

        var oX = ev.clientX + sleft;

        var oY = ev.clientY - disHeight + stop;

        //	var selDiv = $('<div class="mapdiv"></div>');

        if ($('.wrBorder').length > 0) {

            $('.wrBorder').hide();

        }

        //	selDiv.css({
        //
        //		'position': 'absolute',
        //
        //		'width': '0px',
        //
        //		'height': '0px',
        //
        //		'font-size': '0px',
        //
        //		'margin': '0px',
        //
        //		'padding': '0px',
        //
        //		'border': '1px solid #1ab394',
        //
        //		'background-color': '#4acfb4',
        //
        //		'z-index': '1000',
        //
        //		'filter': 'alpha(opacity:60)',
        //
        //		'opacity': '0.6',
        //
        //		'display': 'none',
        //
        //		'left': oX,
        //
        //		'top': oY
        //
        //	});
        //
        //	$(this).append(selDiv);

        $('.wBorder').remove();

        var _x = null;

        var _y = null;

        var mergeArr = [];

        // $(fileNodes).each(function(){
        //
        //     if($(this).offset().left+$(this).width()>oX&&$(this).offset().left<oX&&$(this).offset().top+$(this).height()>oY&&$(this).offset().top<oY){
        //         console.log($(this).offset().top,oY);
        //     }
        // });

        $(that.container).on('mousemove', function () {

            var evt = window.event || arguments[0];

            var xArr = [],

                yArr = [];

            var sleft = $(this).scrollLeft();

            var stop = $(this).scrollTop();

            if (isSelect) {

                //				if(selDiv.css('display') == "none") {

                //					selDiv.css('display', 'none');

                //				}

                _x = (evt.x || evt.clientX);

                _y = (evt.y || evt.clientY);

                _x = _x + sleft;

                _y = _y + stop - disHeight;

                //			selDiv.css({
                //
                //				'left': Math.min(_x, oX),
                //
                //				'top': Math.min(_y, oY),
                //
                //				'width': Math.abs(_x - oX),
                //
                //				'height': Math.abs(_y - oY)
                //
                //			});

                if (_x + 86 >= cWidth) {

                    sleft += 100;

                    $(that.container).scrollLeft(sleft);

                } else {

                    sleft -= 100;

                    $(that.container).scrollLeft(sleft);

                }

                //			var _l = parseInt(selDiv.css('left'));
                //
                //			var _t = parseInt(selDiv.css('top'));
                var _l = parseInt(Math.min(_x, oX));

                var _t = parseInt(Math.min(_y, oY));
                //			var _w = selDiv.width(),
                //
                //				_h = selDiv.height();

                var _w = Math.abs(_x - oX),

                    _h = Math.abs(_y - oY);

                $(fileNodes).on('mouseover',function(){
                     console.log($(this));
                     $(document).on('mouseup',function(){
                        $(fileNodes).off('mouseover');
                     });
                     event.stopPropagation();
                });

                for (var i = 0; i < fileNodes.length; i++) {

                    var sl = fileNodes[i].offsetWidth + fileNodes[i].offsetLeft;

                    var st = fileNodes[i].offsetHeight + fileNodes[i].offsetTop;

                    if (sl > _l && st > _t && fileNodes[i].offsetLeft < _l + _w && fileNodes[i].offsetTop < _t + _h) {

                        var nCols = parseInt($(fileNodes[i]).attr('cols')) ;

                        var nRows = parseInt($(fileNodes[i]).attr('rows')) ;

                        var nCspan = parseInt($(fileNodes[i]).attr('colspan'))  || 1;

                        var nRspan = parseInt($(fileNodes[i]).attr('rowspan'))  || 1;

                        var expectX = nCols + nCspan;

                        var expectY = nRows + nRspan;

                        xArr.push(nCols);

                        yArr.push(nRows);

                        xArr.push(expectX);

                        yArr.push(expectY);

                        xArr=_.uniq(xArr);

                        yArr=_.uniq(yArr)


                        var xMax = _.max(xArr),

                            xMin = _.min(xArr),

                            yMax = _.max(yArr),

                            yMin = _.min(yArr);

                        var top = $(fileNodes[i])[0].offsetTop,

                            left = $(fileNodes[i])[0].offsetLeft,

                            width = $(fileNodes[i])[0].offsetWidth,

                            height = $(fileNodes[i])[0].offsetHeight;

                        $(fileNodes[i]).addClass('picked');

                    } else {

                        $(fileNodes[i]).removeClass('picked');

                    }


                }
                // if(xMax<=yMax){
                //     for(var i = xMin; i < (xMax + 1); i++) {
                //     	for(var j = yMin; j < (yMax + 1); j++) {
                //     		// if($('td[cols=' + (i + 1) + '][rows=' + (j + 1) + ']').length > 0&&!$('td[cols=' + (i + 1) + '][rows=' + (j + 1) + ']').hasClass('picked')) {
                //     			$('td[cols=' + i  + '][rows=' + j + ']').addClass('picked');
                //     		// }
                //
                //     	}
                //
                //     }
                // }else{
                //     for(var i = xMin; i < (xMax + 1); i++) {
                //     	for(var j = yMin; j < (yMax + 1); j++) {
                //     		// if($('td[cols=' + (i + 1) + '][rows=' + (j + 1) + ']').length > 0&&!$('td[cols=' + (i + 1) + '][rows=' + (j + 1) + ']').hasClass('picked')) {
                //
                //     			$('td[cols=' + i  + '][rows=' + j + ']').addClass('picked');
                //
                //     		// }
                //
                //     	}
                //
                //     }
                // }



                that.wBorderSelect($('.picked'));

                that.lightCoor($('.picked'));



            }

        });

        $(document).off('mouseup').on('mouseup', function () {

            isSelect = false;

            //selDiv && selDiv.remove();

        });

    }



    iTable.prototype.keyCursor = function () {

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

        var sNode = $('.picked');

        var callZ = event.data.callz;

        if ($('.picked').length == 1) {

            if (event.keyCode == '8' || event.keyCode == '18' || event.keyCode == '16' || event.keyCode == '9') {

                return;

            }

            var that = $(this);

            var tdText = $('.picked').text();

            var tdWidth = $('.picked').width();

            var tdHeight = $('.picked').height();

            var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'>");

            if (!$('.picked input').length) {

                $('.picked').html(tdInput);

            }

            tdInput.width(tdWidth - 2);

            tdInput.height(tdHeight - 2);

            tdInput.focus();

            var nowX = parseInt($(sNode).attr('cols'));

            var nowY = parseInt($(sNode).attr('rows'));

            var colAdd = parseInt($(sNode).attr('colspan')) - 1 || 0;

            var rowAdd = parseInt($(sNode).attr('rowspan')) - 1 || 0;

            nowX += colAdd;

            nowY += rowAdd;

            event.data.time = parseInt(event.data.time) + 1;

            if (event.data.time === 1) {

                //获取第一次点击的单元格

                event.data.lastTd = sNode;

                event.data.fixX = parseInt($(event.data.lastTd).attr('cols'));

                event.data.fixY = parseInt($(event.data.lastTd).attr('rows'));

            }

            //↓

            if (event.keyCode == '13' || event.keyCode == '40') {

                if (event.target == $('body')[0]) {

                    tdInput.remove();

                }

                if (event.target != $('body')[0]) {

                    $('.picked').html($(event.target).val());

                    $(event.target).blur(function () {

                        $(this).remove();

                    });

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

                if ($('td[cols=' + nextX + '][rows=' + nextY + ']').length > 0) {

                    $(sNode).removeClass('picked');

                    $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                    callZ.wBorder($('td[cols=' + nextX + '][rows=' + nextY + ']'));

                } else {

                    var _nowY = nowY + 1;

                    var _nowX = nowX + 1;

                    while (_nowY >= 0) {

                        while (_nowX >= 0) {

                            var nextRowspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('rowspan'));

                            var nextColspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('colspan'));

                            $(sNode).removeClass('picked');

                            //下一个单元格行列不合并

                            if (!nextRowspan && !nextColspan) {

                                $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格只列合并

                            if (!nextRowspan && nextColspan) {

                                $('td[cols=' + _nowX + '][rows=' + nextY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格只行合并

                            if (nextRowspan && !nextColspan) {

                                $('td[cols=' + _nowX + '][rows=' + nextY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格行列合并

                            if (nextRowspan && nextColspan) {

                                $('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            _nowX--;

                        }

                        _nowY--;

                    }

                }

                event.data.keyCode = event.keyCode;

                callZ.lightCoor($('.picked'));

            }

            //→

            if (event.keyCode == '39') {

                if (event.target == $('body')[0]) {

                    tdInput.remove();

                }

                if (event.target != $('body')[0]) {

                    $('.picked').html($(event.target).val());

                    $(event.target).blur(function () {

                        $(this).remove();

                    });

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

                if ($('td[cols=' + nextX + '][rows=' + nextY + ']').length > 0) {

                    $(sNode).removeClass('picked');

                    $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                    callZ.wBorder($('td[cols=' + nextX + '][rows=' + nextY + ']'));

                } else {

                    var _nowY = nowY + 1;

                    var _nowX = nowX + 1;

                    while (_nowX >= 0) {

                        while (_nowY >= 0) {

                            var nextRowspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('rowspan'));

                            var nextColspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('colspan'));

                            $(sNode).removeClass('picked');

                            //下一个单元格行列不合并

                            if (!nextRowspan && !nextColspan) {

                                $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格只行合并

                            if (!nextRowspan && nextColspan) {

                                $('td[cols=' + _nowX + '][rows=' + nextY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格只列合并

                            if (nextRowspan && !nextColspan) {

                                $('td[cols=' + nextX + '][rows=' + _nowY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格行列合并

                            if (nextRowspan && nextColspan) {

                                $('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

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

                if (event.target == $('body')[0]) {

                    tdInput.remove();

                }

                if (event.target != $('body')[0]) {

                    $('.picked').html($(event.target).val());

                    $(event.target).blur(function () {

                        $(this).remove();

                    });

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

                if ($('td[cols=' + nextX + '][rows=' + nextY + ']').length > 0) {

                    $(sNode).removeClass('picked');

                    $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                    callZ.wBorder($('.picked'));

                } else {

                    var _nowY = nowY;

                    var _nowX = nowX;

                    while (_nowY >= 0) {

                        _nowX = nowX;

                        while (_nowX >= 0) {

                            var nextRowspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('rowspan'));

                            var nextColspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('colspan'));

                            var lastColspan = parseInt($(sNode).attr('colspan')) - 1;

                            var lastRowspan = parseInt($(sNode).attr('rowspan')) - 1;

                            $(sNode).removeClass('picked');

                            //下一个单元格行列不合并

                            if (!nextRowspan && !nextColspan) {

                                $('td[cols=' + (nextX - lastColspan) + '][rows=' + nextY + ']').addClass('picked');

                                callZ.wBorder($('td[cols=' + (nextX - lastColspan) + '][rows=' + nextY + ']'));

                            }

                            //下一个单元格只列合并

                            if (!nextRowspan && nextColspan) {

                                if ($('td[cols=' + (nextX - nextColspan + 1) + '][rows=' + nextY + ']').length > 0) {

                                    r1++;

                                    if (r1 == 1) {

                                        $('td[cols=' + (nextX - nextColspan + 1) + '][rows=' + nextY + ']').addClass('picked');

                                        callZ.wBorder($('.picked'));

                                    }

                                }

                            }

                            //下一个单元格只行合并

                            if (nextRowspan && !nextColspan) {

                                if ($('td[cols=' + nextX + '][rows=' + _nowY + ']').length > 0) {

                                    r2++;

                                    if (r2 == 1) {

                                        $('td[cols=' + nextX + '][rows=' + _nowY + ']').addClass('picked');

                                        callZ.wBorder($('.picked'));

                                    }

                                }

                            }

                            //下一个单元格行列合并

                            if (nextRowspan && nextColspan) {

                                if ($('td[cols=' + _nowX + '][rows=' + _nowY + ']').length > 0) {

                                    r3++;

                                    if (r3 == 1) {

                                        $('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');

                                        callZ.wBorder($('.picked'));

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

                if (event.target == $('body')[0]) {

                    tdInput.remove();

                }

                if (event.target != $('body')[0]) {

                    $('.picked').html($(event.target).val());

                    $(event.target).blur(function () {

                        $(this).remove();

                    });

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

                if ($('td[cols=' + nextX + '][rows=' + nextY + ']').length > 0) {

                    $(sNode).removeClass('picked');

                    $('td[cols=' + nextX + '][rows=' + nextY + ']').addClass('picked');

                    callZ.wBorder($('.picked'));

                } else {

                    var _nowY = nowY;

                    var _nowX = nowX;

                    while (_nowX >= 0) {

                        _nowY = nowY;

                        while (_nowY >= 0) {

                            var nextRowspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('rowspan'));

                            var nextColspan = parseInt($('td[cols=' + _nowX + '][rows=' + _nowY + ']').attr('colspan'));

                            var lastColspan = parseInt($(sNode).attr('colspan')) - 1;

                            var lastRowspan = parseInt($(sNode).attr('rowspan')) - 1;

                            $(sNode).removeClass('picked');

                            //下一个单元格行列不合并

                            if (!nextRowspan && !nextColspan) {

                                $('td[cols=' + nextX + '][rows=' + (nextY - lastRowspan) + ']').addClass('picked');

                                callZ.wBorder($('.picked'));

                            }

                            //下一个单元格只列合并

                            if (!nextRowspan && nextColspan) {

                                if ($('td[cols=' + _nowX + '][rows=' + nextY + ']').length > 0) {

                                    u1++;

                                    if (u1 == 1) {

                                        $('td[cols=' + _nowX + '][rows=' + nextY + ']').addClass('picked');

                                        callZ.wBorder($('.picked'));

                                    }

                                }

                            }

                            //下一个单元格只行合并

                            if (nextRowspan && !nextColspan) {

                                if ($('td[cols=' + nextX + '][rows=' + _nowY + ']').length > 0) {

                                    u2++;

                                    if (u2 == 1) {

                                        $('td[cols=' + nextX + '][rows=' + _nowY + ']').addClass('picked');

                                        callZ.wBorder($('.picked'));

                                    }

                                }

                            }

                            //下一个单元格行列合并

                            if (nextRowspan && nextColspan) {

                                if ($('td[cols=' + _nowX + '][rows=' + _nowY + ']').length > 0) {

                                    u3++;

                                    if (u3 == 1) {

                                        $('td[cols=' + _nowX + '][rows=' + _nowY + ']').addClass('picked');

                                        callZ.wBorder($('.picked'));

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

        this.container.scroll(function () {

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
        ;

        var that = this;

        $('#iTable' + tid).find('tr td').each(function () {

            $(this).dblclick(function () {

                var tdWidth = $(this).width();

                var tdHeight = $(this).height();

                var tdText = $(this).text();

                var tdInput = $("<input type='text'  id='tdInput' class='tdInput'  value='" + tdText + "'>");

                tdInput.width(tdWidth - 2);

                tdInput.height(tdHeight - 2);

                $(this).html(tdInput);

                set_text_value_position(tdInput, -1);

                $('.tdInput').keyup(function () {

                    $('#ip_fx').val($(this).val());

                });

                $('.tdInput').blur(function () {

                    var content = $('.tdInput').val();

                    if (tdText == content) {

                        $(this).parent().html(content);

                    } else {

                        $(this).parent().html(content);

                    }

                    $('.tdInput').remove();

                });

                $(".tdInput").keyup(function (event) {

                    if (event.keyCode == 13) {

                        $('.tdInput').blur();

                        $(document).on('keyup', typing);

                    }

                });

                $(".tdInput").click(function (event) {

                    return false;

                });



                $('#iTable' + tid + ' tr td').not($(this)).click(function (event) {

                    $('.tdInput').blur();

                });

            });
            // $(this).on('mouseover',function(){
            //    console.log($(this));
            // });

            $(this).click(function () {

                var tr = $(this).parent();

                $('.picked').removeClass('picked');

                $('.wBorder').remove();

                $(this).addClass('picked');

                that.wBorder($(this));

                //t.createMask(left, top, width, height,'','');

                var xCoo = Number($(this).attr('cols')) - 1,

                    yCoo = Number($(this).attr('rows')) - 1;

                if ($('.disbox').length > 0) {

                    $('.disbox').text(IntToChr(xCoo) + String(yCoo + 1));

                }

                that.tdTofx($(this));

                that.lightCoor($(this));

                $('#ip_fx').blur();

            });



        });

    }

    iTable.prototype.wBorderSelect = function (obj) {

        var topArr = [],

            leftArr = [];

        var topMin, leftMin, totalWidth = 0,

            totalHeight = 0;

        for (var i = 0; i < obj.length; i++) {

            var top = obj[i].offsetTop,

                left = obj[i].offsetLeft,

                width = obj[i].offsetWidth,

                height = obj[i].offsetHeight;

            if (top < _.min(topArr)) {

                if ($('.wsBorder').length > 0) {

                    $('.wsBorder').remove();

                }

            }

            if (left < _.min(leftArr)) {

                if ($('.wsBorder').length > 0) {

                    $('.wsBorder').remove();

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

            var wsBorder = $('<div class="wsBorder"></div>');

            wsBorder.css({

                'width': totalWidth,

                'height': height + 6,

                'top': topMin,

                'left': leftMin

            });

            var topsB = $('<div></div>');

            topsB.css({

                'width': totalWidth,

                'height': '2px',

                'position': 'absolute',

                'left': leftMin,

                'top': topMin,

                'background': 'rgb(82, 146, 247)'

            });

            var bottomsB = $('<div></div>');

            bottomsB.css({

                'width': totalWidth,

                'height': '2px',

                'position': 'absolute',

                'left': leftMin,

                'top': topMin + totalHeight,

                'background': 'rgb(82, 146, 247)'

            });

            var leftB = $('<div></div>');

            leftB.css({

                'width': '2px',

                'height': totalHeight,

                'position': 'absolute',

                'left': leftMin,

                'top': topMin,

                'background': 'rgb(82, 146, 247)'

            });

            var rightB = $('<div></div>');

            rightB.css({

                'width': '2px',

                'height': totalHeight,

                'position': 'absolute',

                'left': leftMin + totalWidth,

                'top': topMin,

                'background': 'rgb(82, 146, 247)'

            });

            var corner = $('<div class="scorner"></div>');

            corner.css({

                'top': topMin + totalHeight - 2,

                'left': leftMin + totalWidth - 2,

            });

        }

        //	if(wsBorder.length > 0) {

        wsBorder.append(topsB);

        wsBorder.append(bottomsB);

        wsBorder.append(leftB);

        wsBorder.append(rightB);

        wsBorder.append(corner);

        this.container.append(wsBorder);

        //	}

    }

    iTable.prototype.wBorder = function (obj) {

        var that = this;

        if ($('.wsBorder').length > 0) {

            $('.wsBorder').remove();

        }

        if ($('.wBorder').length > 0) {

            $('.wBorder').remove();

        }

        if ($('.wrBorder').length > 0) {

            $('.wrBorder').remove();

        }

        if ($(obj).length > 0) {

            var width = $(obj)[0].offsetWidth,

                height = $(obj)[0].offsetHeight;

            var left =$(obj)[0].offsetLeft,

                top = $(obj)[0].offsetTop;

            var wBorder = $('<div class="wBorder"></div>');

            wBorder.css({

                'width': width,

                'height': height + 6,

                'top': 0,

                'left': 0

            });

            var topB = $('<div></div>');

            topB.css({

                'width': width,

                'height': '2px',

                'position': 'absolute',

                'left': left,

                'top': top,

                'background': 'rgb(82, 146, 247)'

            });

            wBorder.append(topB);

            var leftB = $('<div></div>');

            leftB.css({

                'width': '2px',

                'height': height,

                'position': 'absolute',

                'left': left,

                'top': top,

                'background': 'rgb(82, 146, 247)'

            });

            wBorder.append(leftB);

            var rightB = $('<div></div>');

            rightB.css({

                'width': '2px',

                'height': height,

                'position': 'absolute',

                'left': parseInt(left + width),

                'top': top,

                'background': 'rgb(82, 146, 247)'

            });

            wBorder.append(rightB);

            var bottomB = $('<div></div>');

            bottomB.css({

                'width': width,

                'height': '2px',

                'position': 'absolute',

                'left': left,

                'top': top + height,

                'background': 'rgb(82, 146, 247)'

            });

            var corner = $('<div class="corner"></div>');

            corner.css({

                'top': top + height - 2,

                'left': left + width - 2,

            });

            //红色

            var wrBorder = $('<div class="wrBorder"></div>');

            wrBorder.css({

                'width': width,

                'height': height + 6,

                'top': 0,

                'left': 0

            });

            var toprB = $('<div></div>');

            toprB.css({

                'width': width,

                'height': '2px',

                'position': 'absolute',

                'left': left,

                'top': top,

                'background': 'red'

            });

            wrBorder.append(toprB);

            var leftrB = $('<div></div>');

            leftrB.css({

                'width': '2px',

                'height': height,

                'position': 'absolute',

                'left': left,

                'top': top,

                'background': 'red'

            });

            wrBorder.append(leftrB);

            var rightrB = $('<div></div>');

            rightrB.css({

                'width': '2px',

                'height': height,

                'position': 'absolute',

                'left': parseInt(left + width),

                'top': top,

                'background': 'red'

            });

            wrBorder.append(rightrB);

            var bottomrB = $('<div></div>');

            bottomrB.css({

                'width': width,

                'height': '2px',

                'position': 'absolute',

                'left': left,

                'top': top + height,

                'background': 'red'

            });

            wrBorder.append(bottomrB);

            wBorder.append(bottomB);

            wBorder.append(corner);

            this.container.append(wBorder);

            this.container.append(wrBorder);

        }

        var oHeight = parseInt($('.wBorder').find('div').eq(1).css('height'));

        var oWidth = parseInt($('.wBorder').find('div').eq(0).css('width'));

        corner.on('mouseenter', function () {

            $(this).css('cursor', 'crosshair');

            $(this).on('mousedown', function () {

                $(that.container).off('mousedown');

                // var cWidth = parseInt($(this.container).width());
                //
                // var cHeight = parseInt($(this.container).height());
                //
                // var disWidth = parseInt($('.yOrder').outerWidth());
                //
                // var disHeight = parseInt($('.xOrder').outerHeight()) + parseInt($('.header').outerHeight());
                //
                // var fileNodes = $('.dataTable tr td');
                //
                // var isSelect = true;

                var ev = window.event || arguments[0];

                var sleft = parseInt($(this).scrollLeft());

                var stop = parseInt($(this).scrollTop());

                var oX = ev.clientX + sleft;

                var oY = ev.clientY - disHeight + stop;

                $('.dataTable tr td').off('click');

                var _x = null;

                var _y = null;

                var _text = $('.picked').text();

                var direction;

                //          var selDiv = $('<div class="mapdiv"></div>');

                //	selDiv.css({

                //		'position': 'absolute',

                //		'width': '0px',

                //		'height': '0px',

                //		'font-size': '0px',

                //		'margin': '0px',

                //		'padding': '0px',

                //		'border': '1px solid #1ab394',

                //		'background-color': '#4acfb4',

                //		'z-index': '1000',

                //		'filter': 'alpha(opacity:60)',

                //		'opacity': '0.6',

                //		'display': 'none',

                //		'left': oX,

                //		'top': oY

                //	});

                //			$(that.container).append(selDiv);

                $(that.container).on('mousemove', function () {

                    var evt = window.event || arguments[0];

                    var xArr = [],

                        yArr = [];

                    var sleft = $(this).scrollLeft();

                    var stop = $(this).scrollTop();

                    //							if(selDiv.css('display') == "none") {

                    //								selDiv.css('display', '');

                    //							}

                    _x = (evt.x || evt.clientX);

                    _y = (evt.y || evt.clientY);

                    _x = _x + sleft;

                    _y = _y + stop - disHeight;

                    //				selDiv.css({

                    //					'left': Math.min(_x, oX) ,

                    //					'top': Math.min(_y, oY),

                    //					'width': Math.abs(_x - oX),

                    //					'height': Math.abs(_y - oY)

                    //				});

                    if ($('.wBorder').length > 0) {

                        if (Math.abs(_y - oY) > 10 && Math.abs(_x - oX) < 10) {

                            direction = 'vertical';

                            var tdH = 0;

                            var moveH = Math.abs(_y - oY) + Math.min(_y, oY) - oHeight - 2;

                            var t1 = parseInt($('.wBorder').find('div').eq(0).css('top'));

                            var t3 = parseInt($('.wBorder').find('div').eq(3).css('top'));

                            var h2 = parseInt($('.wBorder').find('div').eq(1).css('height'));

                            var topA = [],

                                topB = [];

                            if (t1 >= moveH) {

                                $('.dataTable tr td').each(function () {

                                    if ($(this).offset().top <= moveH && $(this).offset().top + $(this).offset().height >= Math.min(_y, oY) && $(this).offset().left >= parseInt($('.wBorder').find('div').eq(1).css('left')) && $(this).offset().left <= parseInt($('.wBorder').find('div').eq(1).css('left')) + 96) {

                                        //

                                        tdH += parseInt($(this)[0].offsetHeight);

                                        topA.push($(this).offset().top);

                                        $('.wrBorder').find('div').eq(1).css('height', tdH);

                                        $('.wrBorder').find('div').eq(2).css('height', tdH);

                                        $('.wrBorder').find('div').eq(0).css('top', t3);

                                        $('.wrBorder').find('div').eq(1).css('top', _.first(_.uniq(topA)) + h2);

                                        $('.wrBorder').find('div').eq(2).css('top', _.first(_.uniq(topA)) + h2);

                                        $('.wrBorder').find('div').eq(3).css('top', _.first(_.uniq(topA)) + h2);

                                        $('.wBorder').find('.corner').css('top', $('.wrBorder').find('div').eq(0).css('top'));

                                    }

                                });

                            } else {

                                $('.dataTable tr td').each(function () {

                                    if ($(this).offset().top <= moveH && $(this).offset().top + $(this).offset().height >= Math.min(_y, oY) && $(this).offset().left >= parseInt($('.wBorder').find('div').eq(1).css('left')) && $(this).offset().left <= parseInt($('.wBorder').find('div').eq(1).css('left')) + 96) {

                                        tdH += parseInt($(this)[0].Height);

                                        topB.push($(this).offset().top);

                                        $('.wrBorder').find('div').eq(1).css('height', tdH);

                                        $('.wrBorder').find('div').eq(2).css('height', tdH);

                                        $('.wrBorder').find('div').eq(0).css('top', $('.wBorder').find('div').eq(1).css('top'));

                                        $('.wrBorder').find('div').eq(1).css('top', $('.wBorder').find('div').eq(1).css('top'));

                                        $('.wrBorder').find('div').eq(2).css('top', $('.wBorder').find('div').eq(2).css('top'));

                                        var m = parseInt($('.wrBorder').find('div').eq(1).css('top')) + parseInt($('.wrBorder').find('div').eq(1).css('height'));

                                        $('.wrBorder').find('div').eq(3).css('top', m - 2);

                                        $('.wBorder').find('.corner').css('top', m - 2);

                                    }

                                });

                            }

                        }

                        if (Math.abs(_x - oX) >= 10 && Math.abs(_y - oY) <= 10) {

                            direction = 'horizontal';

                            var tdW = 0;

                            var moveW = Math.abs(_x - oX) + Math.min(_x, oX) - oWidth + 4;

                            var l1 = parseInt($('.wBorder').find('div').eq(0).css('left'));

                            var l3 = parseInt($('.wBorder').find('div').eq(3).css('left'));

                            var w2 = parseInt($('.wBorder').find('div').eq(1).css('height'));

                            var leftA = [],

                                leftB = [];

                            if (Math.min(_x, oX) < l1) {

                                $('.dataTable tr td').each(function () {

                                    var tdL = $(this).offset().left,

                                        _tdW = $(this)[0].offsetWidth,

                                        tdT = $(this).offset().top,

                                        _tdH = $(this)[0].offsetHeight;

                                    var w3t = parseInt($('.wBorder').find('div').eq(3).css('top'));

                                    var w0t = parseInt($('.wBorder').find('div').eq(0).css('top'));

                                    var w1l = parseInt($('.wBorder').find('div').eq(1).css('left'));

                                    if (tdL < w1l && tdL >= Math.min(_x, oX) && (tdT + _tdH <= w3t) && (tdT + 4 > w0t)) {

                                        tdW += parseInt($(this)[0].offsetWidth);

                                        leftA.push($(this).offset().left);

                                        $('.wrBorder').find('div').eq(0).css('width', tdW);

                                        $('.wrBorder').find('div').eq(3).css('width', tdW);

                                        $('.wrBorder').find('div').eq(0).css('left', _.first(_.uniq(leftA)));

                                        $('.wrBorder').find('div').eq(3).css('left', _.first(_.uniq(leftA)));

                                        $('.wrBorder').find('div').eq(2).css('left', _.first(_.uniq(leftA)));

                                        //$('.wrBorder').find('div').eq(1).css('left', $('.wBorder').find('div').eq(1).css('left'));

                                        //var n = parseInt($('.wrBorder').find('div').eq(0).css('left')) + parseInt($('.wrBorder').find('div').eq(0).css('width'));

                                        //$('.wrBorder').find('div').eq(2).css('left', n - 2);

                                        //$('.wBorder').find('.corner').css('l', n - 2);

                                    }

                                });

                            } else {

                                $('.dataTable tr td').each(function () {

                                    var tdL = $(this).offset().left,

                                        _tdW = $(this)[0].offsetWidth,

                                        tdT = $(this).offset().top,

                                        _tdH = $(this)[0].offsetHeight;

                                    var w3t = parseInt($('.wBorder').find('div').eq(3).css('top'));

                                    var w0t = parseInt($('.wBorder').find('div').eq(0).css('top'));

                                    var w1l = parseInt($('.wBorder').find('div').eq(1).css('left'));

                                    if (tdL > w1l && (tdL) <= (Math.min(_x, oX) + Math.abs(_x - oX)) && (tdT + _tdH <= w3t) && (tdT + 4 > w0t)) {

                                        tdW += parseInt($(this)[0].offsetWidth);

                                        leftB.push($(this).offset().left);

                                        $('.wrBorder').find('div').eq(0).css('width', tdW);

                                        $('.wrBorder').find('div').eq(3).css('width', tdW);

                                        $('.wrBorder').find('div').eq(1).css('left', $('.wBorder').find('div').eq(1).css('left'));

                                        var n = parseInt($('.wrBorder').find('div').eq(0).css('left')) + parseInt($('.wrBorder').find('div').eq(0).css('width'));

                                        $('.wrBorder').find('div').eq(2).css('left', n - 2);

                                        $('.wBorder').find('.corner').css('l', n - 2);

                                    }

                                });

                            }

                        }

                    }

                });

                $(document).off('mouseup').on('mouseup', function () {

                    $(that.container).off('mousemove');

                    switch (direction) {

                        case 'vertical':

                            $('.wBorder').find('div').eq(1).css('height', $('.wrBorder').find('div').eq(1).css('height'));

                            $('.wBorder').find('div').eq(2).css('height', $('.wrBorder').find('div').eq(2).css('height'));

                            $('.wBorder').find('div').eq(1).css('top', $('.wrBorder').find('div').eq(1).css('top'));

                            $('.wBorder').find('div').eq(2).css('top', $('.wrBorder').find('div').eq(2).css('top'));

                            $('.wBorder').find('div').eq(3).css('top', $('.wrBorder').find('div').eq(3).css('top'));

                            $('.wBorder').find('div').eq(0).css('top', $('.wrBorder').find('div').eq(0).css('top'));

                            var t3 = parseInt($('.wBorder').find('div').eq(3).css('top'));

                            var t0 = parseInt($('.wBorder').find('div').eq(0).css('top'));

                            var l1 = parseInt($('.wBorder').find('div').eq(1).css('left'));

                            var l2 = parseInt($('.wBorder').find('div').eq(2).css('left'));

                            $('.dataTable tr td').each(function () {

                                if ($(this)[0].offsetTop <= t3 && $(this)[0].offsetTop >= t0 &&

                                    $(this)[0].offsetLeft >= l1 && $(this)[0].offsetLeft < l2) {

                                    $($(this)[0]).text(_text);

                                }

                            });

                            $(that.container).on('mousedown', areaChoose);

                            break;

                        case 'horizontal':

                            $('.wBorder').find('div').eq(0).css('width', $('.wrBorder').find('div').eq(0).css('width'));

                            $('.wBorder').find('div').eq(3).css('width', $('.wrBorder').find('div').eq(3).css('width'));

                            $('.wBorder').find('div').eq(0).css('left', $('.wrBorder').find('div').eq(0).css('left'));

                            $('.wBorder').find('div').eq(3).css('left', $('.wrBorder').find('div').eq(3).css('left'));

                            $('.wBorder').find('div').eq(1).css('left', $('.wrBorder').find('div').eq(1).css('left'));

                            $('.wBorder').find('div').eq(2).css('left', $('.wrBorder').find('div').eq(2).css('left'));

                            var t3 = parseInt($('.wBorder').find('div').eq(3).css('top'));

                            var t0 = parseInt($('.wBorder').find('div').eq(0).css('top'));

                            var l1 = parseInt($('.wBorder').find('div').eq(1).css('left'));

                            var l2 = parseInt($('.wBorder').find('div').eq(2).css('left'));

                            $('.dataTable tr td').each(function () {

                                if ($(this)[0].offsetTop <= t3 && $(this)[0].offsetTop >= t0 &&

                                    $(this)[0].offsetLeft >= l1 && $(this)[0].offsetLeft < l2) {

                                    $($(this)[0]).text(_text);

                                }

                            });

                            $(that.container).on('mousedown', areaChoose);

                            break;

                        default:

                            break;

                    }

                    $('.dataTable tr td').on('click', function () {

                        var tr = $(this).parent();

                        $('.picked').removeClass('picked');

                        $('.wBorder').remove();

                        $(this).addClass('picked');

                        that.wBorder($(this));

                        //t.createMask(left, top, width, height,'','');

                        var xCoo = Number($(this).attr('cols')) - 1,

                            yCoo = Number($(this).attr('rows')) - 1;

                        if ($('.disbox').length > 0) {

                            $('.disbox').text(IntToChr(xCoo) + String(yCoo + 1));

                        }

                        that.tdTofx($(this));

                        that.lightCoor($(this));

                        $('#ip_fx').blur();

                    });

                    // $(that.container).off('mousemove');

                });

            });

        });

    }

    iTable.prototype.lightCoor = function (obj) {

        var target = obj;

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



    //创建底部容器

    iTable.prototype.createFooter = function () {

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

    iTable.prototype.createHeader = function () {

        this.header = $('<div class="header"></div>');

        this.header.css({

            'z-index': 103

        })

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

    //字体大小

    iTable.prototype.fontSize = function () {

        var menu = this.createSelection('fontSize', this.settings.fontSize);

        var sel_a = $(menu).find('ul li a');

        $(menu).find('#fontFamily').attr('defaultClass', sel_a.eq(0).attr('class'));

        var className, curClass;

        var selThem;

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

        var sel_a = $(simMenu).children(0);

        sel_a.on('click', function () {

            $('.picked').hasClass('ffbold') ? $('.picked').removeClass('ffbold') : $('.picked').addClass('ffbold');

        });

    }

    //字体倾斜

    iTable.prototype.fontItalic = function () {

        var simMenu = this.createSimpleMenu('fitalic');

        var sel_a = $(simMenu).children(0);

        sel_a.on('click', function () {

            $('.picked').hasClass('ffitalic') ? $('.picked').removeClass('ffitalic') : $('.picked').addClass('ffitalic');

        });

    }

    //字体下划线

    iTable.prototype.fontOverline = function () {

        var simMenu = this.createSimpleMenu('foverline');

        var sel_a = $(simMenu).children(0);

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

        var td = $(select).find('table tr td');

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

    //列插入

    iTable.prototype.insertCol = function () {

        var simMenu = this.createSimpleMenu('editRowCol insertCol', '');

        var sel_a = $(simMenu).children(0);

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

                  //  xMax = xArr.max(), xMin = xArr.min(), yMax = yArr.max(), yMin = yArr.min();

                    xMax = _.max(xArr), xMin = _.min(xArr), yMax = _.max(yArr), yMin = _.min(yArr);
                }

                for (var _y = 0; _y < that.rowCount + 1; _y++) {

                    var time = 0;

                    for (var _x = xMin; _x < xMax + 1; _x++) {

                        var index = xMin;

                        if ($('td[cols=' + xMin + '][rows=' + _y + ']').length > 0) {

                            $('td[cols=' + xMin + '][rows=' + _y + ']').before('<td style="background:orange"></td>');

                        } else {

                            while (index > -1) {

                                if ($('td[cols=' + index + '][rows=' + _y + ']').length > 0) {

                                    time++;

                                    if (time == 1) {

                                        $('td[cols=' + index + '][rows=' + _y + ']').after('<td style="background:orange"></td>');

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

                        var cols = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('cols'));

                        if (cols == xIndex) {

                            var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                            var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                            if (cspan >= 2) {

                                $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan + 1);

                            } else {

                                if (rspan > 1) {

                                    for (var r = i; r < i + rspan; r++) {

                                        $('td[cols=' + (j - cspan) + '][rows=' + r + ']').after('<td style="background:orange"></td>');

                                    }

                                } else {

                                    $('td[cols=' + j + '][rows=' + i + ']').before('<td style="background:orange"></td>');

                                }

                            }

                        } else {

                            if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {

                                time++;

                                if (time == 1) {

                                    var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                                    var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                                    if (cspan >= 2) {

                                        //不同行拓宽

                                        if (!(i < yIndex && (rspan + i) > yIndex)) {

                                            $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan + 1);

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

            //that.updateTop();

        });

    }

    //行插入

    iTable.prototype.insertRow = function () {

        var simMenu = this.createSimpleMenu('editRowCol insertRow', '');

        var sel_a = $(simMenu).children(0);

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

                        if ($('td[cols=' + _x + '][rows=' + yMin + ']').length > 0) {

                            if (_x == 0) {

                                tr.append(th);

                            }

                            tr.append('<td style="background:orange"></td>');

                            $('td[cols=' + _x + '][rows=' + yMin + ']').parent().before(tr);

                        } else {

                            $('td[cols=' + (_x - 1) + '][rows=' + yMin + ']').parent().after(tr);

                        }

                    }

                }

            } else {

                var yIndex = parseInt(sNode.attr('rows'));

                var xIndex = parseInt(sNode.attr('cols'));

                for (var i = yIndex; i > -1; i--) {

                    var tr = $('<tr></tr>');

                    for (var j = 0; j < that.cellCount + 2; j++) {

                        var rows = $('td[cols=' + j + '][rows=' + i + ']').attr('rows');

                        if (rows == yIndex) {

                            //console.log(rows,j);

                            if (j == 2) {

                                var th = $('<th></th>');

                                tr.append(th);

                            }

                            var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                            if (rspan >= 2) {

                                $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan + 1);

                            } else {

                                tr.append('<td style="background:orange"></td>');

                                $('td[cols=' + j + '][rows=' + i + ']').parent().before(tr);

                            }

                        } else {

                            if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {

                                var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                                var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                                if (rspan >= 2) {

                                    if (parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rows')) + parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) - 1 >= yIndex) {

                                        $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan + 1);

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

            //that.updateLeft();

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

                        var cols = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('cols'));

                        if (cols == index) {

                            var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                            if (cspan >= 2) {

                                $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan - 1);

                            } else {

                                $('td[cols=' + j + '][rows=' + i + ']').remove();

                            }

                        } else {

                            if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {

                                time++;

                                if (time == 1) {

                                    var cspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('colspan')) || 1;

                                    if (cspan >= 2) {

                                        $('td[cols=' + j + '][rows=' + i + ']').attr('colspan', cspan - 1);

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

                        var rows = $('td[cols=' + j + '][rows=' + i + ']').attr('rows');

                        if (rows == index) {

                            var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                            if (rspan >= 2) {

                                $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan - 1);

                            } else {

                                $('td[cols=' + j + '][rows=' + i + ']').parent().remove();

                            }

                        } else {

                            if ($('td[cols=' + j + '][rows=' + i + ']').length > 0) {

                                var rspan = parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) || 1;

                                if (rspan >= 2) {

                                    if (parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rows')) + parseInt($('td[cols=' + j + '][rows=' + i + ']').attr('rowspan')) - 1 >= yIndex) {

                                        $('td[cols=' + j + '][rows=' + i + ']').attr('rowspan', rspan - 1);

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

    //单元格上的公式区域

    iTable.prototype.formula = function (ways) {

        var func = ways;

        var target = $('.picked')[0];

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

        $('.fxInput').keyup(function () {

            var ev = ev || event;

            var endValue = $(this).val();

            if (ev.keyCode == 13) {

                endValue.split();

                $(this).blur();

                $(this).parent().remove();

            }

        });

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

            $("th,td", $t).filter("." + sigSel).each(function () {

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

            $("th,td", $t).each(function () {

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

        var selectLi, arr = [],aTab;
        for(var index in json){
            selectHead.text('配置菜单');
            aTab=$('<a class="dTab" id="'+json[index].id +'">'+ json[index].name + '</a></li>');

            selectLi = $('<li></li>');
            selectLi.append(aTab);
            selectUl.append(selectLi);
            var callback=json[index].callback;
            aTab.on('click',{callback},function(event){
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

        var selectTd, length = JSONLength(menus);

        var arr1 = [],

            arr2 = [];

        for (var index in menus) {

            arr1.push(menus[index].tdclass);

            arr2.push(menus[index].fclass);

        }

        for (var i = 0; i < arr1.length + 1; i++) {

            selectTd = $('<td class="' + arr1[i] + '"><a class="' + arr2[i] + '"></a></td>');

            selectTr.append(selectTd);

            if ((i + 1) % 5 == 0 && (i + 1) != 0) {

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

    iTable.prototype.sheetWork = function () {

        var that = this;

        $('.sheet').on('click', function () {

            box.empty();

            var dId = $(this).attr('id');

            dId = dId.replace('sheet', '');

            dId = parseInt(dId);

            that.createContent(dId);

            that.fillTd(dId);

            $(this).addClass('sheetdefault').siblings().removeClass('sheetdefault');

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

                if (ev.keyCode == 13) {

                    $('.stInput').blur();

                }

            });

        });

    }

    //sheet移动

    iTable.prototype.sheetMove = function () {

        var lsheet = $('.lsheet');

        var rsheet = $('.rsheet');

        var sDl = $(".sheetqueuedl");

        var num = 0;

        rsheet.click(function () {

            num == sDl.find('dd').length - 1 ? num = sDl.find('dd').length - 1 : num++;

            toNavRPos();

        });

        lsheet.click(function () {

            num == 0 ? num = 0 : num--;

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

        for (var i = 0; i < objTab.rows.length; i++) {

            for (var j = 0; j < objTab.rows[i].cells.length; j++) {

                cell = objTab.rows[i].cells[j];

                if (offsetLeftArray.contains(cell.offsetLeft) == -1)

                    offsetLeftArray.push(cell.offsetLeft);

            }

        }

        offsetLeftArray.sort(function (x, y) {

            return parseInt(x) - parseInt(y);

        });

        // 遍历第二次生成cellStrArray

        for (var i = 0; i < objTab.rows.length; i++) {

            for (var j = 0; j < objTab.rows[i].cells.length; j++) {

                cell = objTab.rows[i].cells[j];

                col = offsetLeftArray.contains(cell.offsetLeft);

                cellStr = i + ',' + col;

                cellStrArray.push(cellStr);

                var coo = (i + 1) + ',' + (col + 1);

                var coo = cellStrArray[j];

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

            var td = $("<td>" + IntToChr(j) + "</td>");

            $('.titleTable tbody tr').eq(j).find('td').text(IntToChr(j));

        }

    }

    //x轴更新

    iTable.prototype.updateTop = function (index) {

        var that = this;

        $('.titleTable colgroup').find('col').eq(index).after('<col style="width:100px">');

        $('.titleTable tbody tr').find('td').eq(index).after('<td></td>');

        for (var j = index; j < this.cellCount - 1; j++) {

            var td = $("<td>" + IntToChr(j) + "</td>");

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

            $(this).off('mousedown').on('mousedown', function (event) {

                var index = $(this).index();

                var sline = $('<div class="sline"></div>');

                var lline = $('<div class="lline"></div>');

                var h = $(this).height();

                var w = $(this).width();

                var x = event.clientX - exW;

                sline.css({

                    'left': x,

                    'height': h

                });

                $(this).append(sline);

                $('body').mousemove(function (event) {

                    var allH = $('.dataTable').outerHeight();

                    var l = event.clientX - exW;

                    var move = l - x;

                    if (w + move < 20) {

                        return;

                    } else {

                        lline.css({

                            'height': allH,

                            'left': event.clientX

                        });

                        $('.dataTable colgroup col').eq(index).css('width', w + move);

                        $('.titleTable colgroup col').eq(index).css('width', w + move);

                        $(container).append(lline);

                    }

                });

                $('body').mouseup(function (event) {

                    $('body').off('mousemove');

                    $(lline).remove();

                    $(sline).remove();

                });

            });

        });

    }

    //拖拽放宽行

    iTable.prototype.largeRow = function () {

        var container = this.container;

        var that = this;

        var event = window.event || arguments[0];

        var exH = $('.yOrder').outerHeight();

        $('.leftTable tr td').each(function (event) {

            $(this).off('mousedown').on('mousedown', function (event) {

                var index = $(this).parent().index();

                var sline = $('<div class="sline"></div>');

                var lline = $('<div class="rline"></div>');

                var h = $(this).height();

                var w = $(this).width();

                var y = event.clientY - exH;

                sline.css({

                    'top': y,

                    'height': 1,

                    'float': 'none',

                    'width': w

                });

                $(this).append(sline);

                $('body').mousemove(function (event) {

                    var allW = $('.dataTable').outerWidth();

                    var l = event.clientY - exH;

                    var move = l - y;

                    if (h + move < 20) {

                        return;

                    } else {

                        lline.css({

                            'width': allW,

                            'top': event.clientY

                        });

                        $('.dataTable tr th').eq(index).css('height', h + move + 1);

                        $('.leftTable td').eq(index).css('height', h + move);

                        $(container).append(lline);

                    }

                });

                $('body').mouseup(function (event) {

                    $('body').off('mousemove');

                    $(lline).remove();

                    $(sline).remove();

                });

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

            if ((ev.keyCode == 8)) {

                delRes = nValue.match(/([a-zA-Z]([1-9]\d*))(((\-|\+|\*|\\){1}([a-zA-Z]{1})(([1-9]\d*){1})))*/);

                if (!!nValue) {

                    dArr = nValue.split(flReg);

                    cArr = pValue.split(flReg);

                    delTmp = getUniqueSet(cArr, dArr);

                    if (!!delTmp[1]) {

                        cLightTd(delTmp[1]);

                    }

                }

            }

            if ((ev.keyCode == 13)) {

                this.blur();

                var allValue = pValue;

                calRes = allValue.match(reg);

                if ((!!calRes) && (!!calRes[0])) {

                    fText = calRes[0].toString();

                    allArr = fText.split(flReg);

                    for (var i = 0; i < allArr.length; i++) {

                        if (!!allArr[i]) {

                            var tmp = allArr[i];

                            var tmpVal = String(that.getValue(allArr[i]));

                            allValue = allValue.replace(tmp, tmpVal);

                        }

                    }

                    calText = allValue;

                    calText = calText.substring(1);

                    var result = dal2Rpn(calText);

                    $('.picked').text(result);

                    $('.mask').remove();

                }

            }

            ifx.keydown(function (ev) {

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

        var rMenus = this.createRmenus();

        var winH = $(window).height() - $(this.footer).outerHeight();

        var winW = $(window).width();

        $('.dataTable').contextmenu(function () {

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

        $('.dataTable').find('tr td').each(function () {

            $(this).contextmenu(function () {

                var arr = $('.picked');

                var obj = this;

                var has = containsArray(arr, obj);

                if (has == -1) {

                    $('.dataTable').find('td').removeClass('picked');

                }

                $(this).addClass('picked');

            });

        })

    }

    iTable.prototype.createRmenus = function () {

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

    iTable.prototype._delete = function () {

        var deleteDiv = $('<div class="menu-delete">删除</div>');

        deleteDiv.css({

            'padding': '2px 10px',

            'cursor': 'pointer'

        });

        return deleteDiv;

    }

    iTable.prototype.tdTofx = function (obj) {

        var tdVal = obj.text();

        var fx = $('#ip_fx');

        fx.val(tdVal);

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

        var menu = this.createSimpleMenu('charts');

        this.chartsHandler();

    }

    iTable.prototype.chartsHandler = function (callback) {

        if (callback) {

            callback();

        }

    }

    iTable.prototype.dataSource = function () {

        var menu = this.createSimpleMenu('dataSource');

        this.dataSourceHandler();

    }

    iTable.prototype.dataSourceHandler = function (callback) {

        if (callback) {

            callback();

        }

    }

    iTable.prototype.dataSet = function () {

        var menu = this.createSimpleMenu('dataSet');

        this.dataSetHandler();

    }

    iTable.prototype.dataSetHandler = function (callback) {

        if (callback) {

            callback();

        }

    }

    iTable.prototype.dataSearch = function () {

        var menu = this.createSimpleMenu('dataSearch');

        this.dataSetHandler();

    }

    iTable.prototype.dataSearchHandler = function (callback) {

        if (callback) {

            callback();

        }

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



    //高亮单元格

    function lightTd(tmp) {

        var posY = tmp.match(/^[a-zA-Z]{1}/gi);

        var posX = tmp.match(/\+?[1-9][0-9]*$/g);

        posY = posY.toString();

        posY = posY.toLocaleLowerCase().charCodeAt(0) - 96;

        posY--;

        posX = posX.toString() - 1;

        if (posY == null || posX == null || posY.length == 0 || String(posY).length == 0) {

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

        if (posY == null || posX == null || posY.length == 0 || String(posX).length == 0) {

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

    function set_text_value_position(spos) {

        var tobj = document.getElementById('tdInput');

        if (spos < 0) spos = tobj.value.length;

        if (tobj.setSelectionRange) { //兼容火狐,谷歌

            setTimeout(function () {

                tobj.setSelectionRange(spos, spos);

                tobj.focus();

            }, 0);

        } else if (tobj.createTextRange) { //兼容IE

            var rng = tobj.createTextRange();

            rng.move('character', spos);

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

    //

    function JSONLength(obj) {

        var size = 0,

            key;

        for (key in obj) {

            if (obj.hasOwnProperty(key)) size++;

        }

        return size;

    };

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

        this.leftBar();

        this.charts();

        this.dataSource();

        this.dataSet();

        this.dataSearch();

        this.largeCol();

        this.largeRow();


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
        console.log('other');
    }