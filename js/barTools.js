
	var dtC=$(".dataTable_container");
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