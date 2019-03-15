/* 
================
===== 验证 =====
================
*/
function Base(){
	this.phoneReg = /^1[34578]{1}\d{9}$/;	//手机号验证
}

Base.prototype.phoneValid = function(str){
	return this.phoneReg.test(str);
}

function Fn(){}
Fn.prototype = new Base();



/* 
====================
===== 账号登录 =====
====================
*/
function LoginModule(){
	Base.call(this);
}

LoginModule.prototype = new Fn();

//记住密码
LoginModule.prototype.remPass = function(){
	var $remBox = $(".rem-pass");
	$remBox.click(function(){
		$(this).find(".radio").toggleClass("selected");
	});

	return this;
};

//登录验证
LoginModule.prototype.loginValid = function(){
	var $user = $(".l-form .username");
	var $pass = $(".l-form .password");
	var $loginBtn = $(".l-form .btn-login");
	var _this = this;

	$loginBtn.click(function(){
		if(!$user.val()){
			$user.addClass("error").siblings(".err-tips").html("不能为空").show();
			return false;
		}else if(!_this.phoneValid($user.val())){
			$user.addClass("error").siblings(".err-tips").html("该手机号不存在").show();
			return false;
		}else if(!$pass.val()){
			$pass.addClass("error").siblings(".err-tips").html("不能为空").show();
			return false;
		}else{
			$pass.removeClass("error").siblings(".err-tips").hide();
			$user.removeClass("error").siblings(".err-tips").hide();
			
			//登录数据请求
			$.ajax({
				type:'post',
				url:"../../index.php?m=Home&c=Api&a=dologin",
				data:{'logonName':$user.val(),'key':$pass.val()},
				success:function(ret){
					if (ret.status == 1) {
						window.location.href = "logined.html";
					}else{
						alert(ret.info);
					}
				}
			})
			
		}
	});

	return this;
};



/* 
====================
===== 注册账号 =====
====================
*/
function RegisterModule(){
	Base.call(this);
	this.timer = null;
	this.timeSize = 30;
	this.initTime = this.timeSize;
}

RegisterModule.prototype = new Fn();

//注册验证
RegisterModule.prototype.registerValid = function(){
	var $sureBtn = $(".b-sure");//注册按钮
	var $inputs = $(".l-form input");
	var $user = $(".l-form .username");
	var $pass = $(".l-form .password");
	var $passConf = $(".l-form .password-conf");
	var $phone = $(".l-form .phone");
	var $vCode = $(".l-form .verify-code");
	var $bSend = $(".b-send");//发送短信验证
	var _this = this;
	
	/*注册动作执行*/
	$sureBtn.click(function(){
		$inputs.removeClass("error").siblings(".err-tips").hide();
		if(!$user.val()){
			$user.addClass("error").siblings(".err-tips").show();
			return false;
		}else if($pass.val().length < 6){
			$pass.addClass("error").siblings(".err-tips").show();
			return false;
		}else if($pass.val() !== $passConf.val()){
			$passConf.addClass("error").siblings(".err-tips").show();
			return false;
		}else if(!$phone.val()){
			$phone.addClass("error").siblings(".err-tips").html("手机号不能为空").show();
			return false;
		}else if(!_this.phoneValid($phone.val())){
			$phone.addClass("error").siblings(".err-tips").html("手机号不存在").show();
			return false;
		}else if(!$vCode.val()){
			$vCode.addClass("error");
			return false;
		}

		//注册数据发送
		$.ajax({
			type:'post',
			url:"../../index.php?m=Home&c=Api&a=register",
			data:$('#form-register').serialize(),
			success:function(ret){
				var ret = $.parseJSON(ret);
				if (ret.code == 0) {
					window.location = "register_succ.html";
					return false;
				}
				alert(ret.reason);
			}
		})
		
	});

	$bSend.click(function(event){
		$inputs.removeClass("error").siblings(".err-tips").hide();
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event = window.event;
			event.cancelBubble = true;
		}
		if(!$user.val()){
			$user.addClass("error").siblings(".err-tips").show();
			return false;
		}else if($pass.val().length < 6){
			$pass.addClass("error").siblings(".err-tips").show();
			return false;
		}else if($pass.val() !== $passConf.val()){
			$passConf.addClass("error").siblings(".err-tips").show();
			return false;
		}else if(!_this.phoneValid($phone.val())){
			$phone.addClass("error").siblings(".err-tips").show();
			return false;
		}
		_this.sendVerCode($phone.val());
	});

	return this;
};

//验证码
RegisterModule.prototype.sendVerCode = function($phone){
	var $sendBtn = $(".l-form .b-send");
	var _this = this;

	clearInterval(_this.timer);
	$sendBtn.addClass("hasSend");
	$sendBtn.html(_this.timeSize + "s后再次发送");
	_this.timer = setInterval(function(){
		_this.timeSize--;
		$sendBtn.html(_this.timeSize + "s后再次发送");
		if(_this.timeSize == 0){
			clearInterval(_this.timer);
			_this.timeSize = _this.initTime;
			$sendBtn.removeClass("hasSend");
			$sendBtn.html("重新发送验证码");
		}
	},1000);
	
	
	/*发送短信验证码*/
	$.ajax({
		type:'post',
		url:"../../index.php?m=Home&c=Api&a=sms",
		data:{'phone':$phone},
		success:function(ret){
			var ret = $.parseJSON(ret);
			alert(ret.reason);
	
		}
	})
}



/* 
====================
===== 修改密码 =====
====================
*/
function AccountModule(){
	Base.call(this);
	this.timer = null;
	this.timeSize = 30;
	this.initTime = this.timeSize;
}

AccountModule.prototype = new Fn();

//账户恢复
AccountModule.prototype.accountValid = function(){
	var $inputs = $(".s-ac input");
	var $phone = $(".s-ac .username");
	var $vCode = $(".s-ac .verify-code");
	var $sureBtn = $(".s-ac .b-sure");
	var $bSend = $(".s-ac .b-send");
	var _this = this;
	var inval = $(".s-ac .invalid");
	var val = $(".s-ac .valid");

	inval.click(function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event = window.event;
			event.cancelBubble = true;
		}
	});

	$phone.blur(function(){
		val.hide();
		var $msg = $phone.siblings(".invalid");
		if(!$phone.val()){
			$phone.addClass("error");
			$msg.html("手机号不能为空").show();
			return false;
		}else if(!_this.phoneValid($phone.val())){
			$phone.addClass("error");
			$msg.html("无效手机号").show();
			return false;
		}else{
			$phone.removeClass("error");
			val.show();
			$msg.hide();
		}
	});

	$sureBtn.click(function(){
		$inputs.siblings(".invalid").hide();
		$phone.removeClass("error");
		if(!$phone.val()){
			$phone.addClass("error").siblings(".invalid").html("手机号不能为空").show();
			return false;
		}
		if(!_this.phoneValid($phone.val())){
			$phone.addClass("error").siblings(".invalid").html("无效手机号").show();
			return false;
		}

		if(!$vCode.val()){
			$vCode.siblings(".invalid").show();
			return false;
		}
		window.location = "password_change.html";
	});

	$bSend.click(function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event = window.event;
			event.cancelBubble = true;
		}
		if(!_this.phoneValid($phone.val())){
			$phone.siblings(".invalid").show();
			return false;
		}
		_this.sendVerCode();
	});

	return this;
};

//输入框切换
AccountModule.prototype.tabStep = function(){
	var $inputsWrap = $(".s-form p");
	var $inputs = $(".s-form input");

	$inputs.each(function(){
		if($(this).val()) $(this).siblings(".tip").hide();
	});

	$inputsWrap.click(function(){
		$(this).find(".tip").hide();
		$(this).find("input").focus();
	});

	$inputs.focus(function(){
		$(this).siblings(".tip").hide();
	}).blur(function(){
		if(!$(this).val()) $(this).siblings(".tip").show();
	});

	return this;
};

//密码明暗文切换
AccountModule.prototype.passStatus = function(){
	var passIcon = $(".info-form .pass-icon");
	
	passIcon.click(function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event = window.event;
			event.cancelBubble = true;
		}
	});

	passIcon.mousedown(function(){
		$(this).addClass("pub");
		$(this).siblings(".pub-pass").val($(this).siblings(".pri-pass").val()).show();
		$(this).siblings(".pri-pass").hide();
	}).mouseup(function(){
		$(this).removeClass("pub");
		$(this).siblings(".pri-pass").show();
		$(this).siblings(".pub-pass").hide();
	});

	return this;
};

//修改验证
AccountModule.prototype.passChangeValid = function(){
	var $inputs = $(".s-pc input");
	var $pass = $(".s-pc .password");
	var $passConf = $(".s-pc .password-conf");
	var $sureBtn = $(".s-pc .b-sure");

	$pass.blur(function(){
		var $invMsg = $pass.siblings(".invalid");
		var $vMsg = $pass.siblings(".valid");
		$vMsg.hide();
		$invMsg.hide();
		if($pass.val().length < 6){
			$invMsg.show();
			return false;
		}else{
			$vMsg.show();
			$invMsg.hide();
		}
	});
	$passConf.blur(function(){
		var $invMsg = $passConf.siblings(".invalid");
		var $vMsg = $passConf.siblings(".valid");
		$vMsg.hide();
		$invMsg.hide();
		if($passConf.val() !== $pass.val()){
			$invMsg.show();
			return false;
		}else{
			$vMsg.show();
			$invMsg.hide();
		}
	});

	$sureBtn.click(function(){
		$inputs.siblings(".invalid").hide();
		if($pass.val().length < 6){
			$pass.siblings(".invalid").show();
			return false;
		}else if($pass.val() !== $passConf.val()){
			$passConf.siblings(".invalid").show();
			return false;
		}
		window.location = "account_succ.html";
	});

	return this;
};

//验证码
AccountModule.prototype.sendVerCode = function(){
	var $sendBtn = $(".s-ac .b-send");
	var _this = this;

	clearInterval(_this.timer);
	$sendBtn.addClass("hasSend");
	$sendBtn.html(_this.timeSize + "s后再次发送");
	_this.timer = setInterval(function(){
		_this.timeSize--;
		$sendBtn.html(_this.timeSize + "s后再次发送");
		if(_this.timeSize == 0){
			clearInterval(_this.timer);
			_this.timeSize = _this.initTime;
			$sendBtn.removeClass("hasSend");
			$sendBtn.html("重新发送验证码");
		}
	},1000);
}

/* 
==========================
===== 预约维修与安装 =====
==========================
*/
function AppoModule(){}
//检查安全码过期
function checkSecurityCode($code){
	if ($code == 3002){
		window.location.href='../../index.php?m=Home&c=Member&a=doLogout';
	}
}
//输入框切换
AppoModule.prototype.tabStep = function(){    
	var step = $(".s-steps .step .i");
    $(".step1 .btn-next").click(function(){
    	$(".step1").hide();
        $(".step2").show();
        step.eq(0).removeClass("active");
        step.eq(1).addClass("active");
    });
    $(".step2 .btn-prev").click(function(){
		$(".step2").hide();
        $(".step1").show();
        step.eq(1).removeClass("active");
        step.eq(0).addClass("active");
    });
    

    
    /*预约保修提交*/
    $(".step2 #btn-serviceorder").click(function(){
		$.ajax({
			type:'post',
			url:"../../index.php?m=Home&c=Service&a=postorder",
			data:$('#form-serviceorder').serialize(),
			success:function(ret){
				checkSecurityCode(ret.code);
				if (ret.code == 0 && ret) {
			    	$(".s-steps").hide();
			    	$(".step2").hide();
			    	$(".step3").show();
			    	$('.d-ordercode').text(ret.data)
				}else{
					alert(ret.reason);
					return false;
				}
			}
		});
    	
		
    });

    
//    $(".step2 .btn-finish").click(function(){
//    	$(".s-steps").hide();
//    	$(".step2").hide();
//    	$(".step3").show();
//    });

    /*购买渠道切换*/
	$(".bt-group span").click(function(){
		var selectid=$(this).attr('selectid');
		$('.bt-group').find('input').val(selectid);
        $(".bt-group span").removeClass("selected");
        $('.buyshop').hide()
        $(this).addClass("selected");
        $("#"+selectid).show();
        
    });
	/*购买商店*/
	$('.buyshop').change(function(){
		$('.d-buyShop').val($(this).find("option:selected").attr('storeid'));
		$('.d-buyShopName').val($(this).val());
	})
	
	
	/*动态获取产品型号,搜索联想*/
    $('body').on('change','.product-type',function(){
    	var _target = $(this).parents('.p-type').find("input");
    		
    	if ($(this).attr('id') =='product-type-repair') {
    		getFault($(this).find('option:checked').attr('itemcode'));
    	}
    	
		_target.autocompleter('destroy');
		_target.val('');
		$.ajax({
			type:'post',
			url:"../../index.php?m=Home&c=Service&a=promodel",
			data:{'itemcode':$(this).find('option:selected').attr('itemcode')},
			beforeSend :function(){
				_target.attr('disabled','true');
			},
			success:function(ret){
				if (ret.code == 0) {
					var _item = ret.data.item;
					var option = '';
					var model = [];
					for(var i=0;i<_item.length;i++){
						var option_obj={};
						option_obj.value=_item[i].itemcode;
						option_obj.label=_item[i].itemname;
						model.push(option_obj);
					}
					_target.removeAttr('disabled');
					_target.autocompleter({ 
			            source: model,
			            limit:9
			        });
				}
			}
		})
    })
    
    /* 动态获取故障现象 */
    function getFault($parent){
		var _ini_aprent;
		$.ajax({
			type:'post',
			url:"../../index.php?m=Home&c=Service&a=fault",
			data:{'parent':$parent},
			success:function(ret){
				if (ret.code == 0) {
					var _item = ret.data.item;
					var option = '<option value="">请选择故障现象</option>';
					if (_item.length > 0){
						
						_ini_aprent = _item[0].itemcode;
						for(var i=0;i<_item.length;i++){
							option += '<option value="'+_item[i].itemcode+'" code='+_item[i].itemcode+'>'+_item[i].itemname+'</option>';
						}
						
					}
					$('#product-fault-repair').empty().append(option);
					
				}
			}
		})		
	}
	
	/* 触发省份，获取城市，县 */
	$('.d-prov').change(function(){
		var node = $(this).val();
		getCity(node);
		
	})
	
	/*触发城市，获取县*/
	$('.d-city').change(function(){
		var node = $(this).val();
		getCounty(node)
	})	
	
	/*获取城市数据*/
	function getCity($parent){
		var _ini_aprent;
		$.ajax({
			type:'post',
			url:"../../index.php?m=Home&c=Service&a=city",
			data:{'parent':$parent},
			async:false,
			success:function(ret){
				if (ret.code == 0) {
					var _item = ret.data.item;
					var option = '';
					
					_ini_aprent = _item[0].itemcode;
					for(var i=0;i<_item.length;i++){
						option += '<option value="'+_item[i].itemcode+'" code='+_item[i].itemcode+'>'+_item[i].itemname+'</option>';
					}
					$('.d-city').empty().append(option);
					
				}
			}
		})
		getCounty(_ini_aprent)
	}
	/*获取县数据*/
	function getCounty($parent){
		$.ajax({
			type:'post',
			url:"../../index.php?m=Home&c=Service&a=county",
			data:{'parent':$parent},		
			success:function(ret){
				if (ret.code == 0) {
					var _item = ret.data.item;
					var option = '';
					for(var i=0;i<_item.length;i++){
						option += '<option value="'+_item[i].itemcode+'">'+_item[i].itemname+'</option>';
					}
					$('.d-area').empty().append(option);
				}
			}
		})
	}
	
	return this;
};

//表单验证
AppoModule.prototype.proValid = function(){
	var $cont = $(".req");
	var $phone = $(".b-phone");

	function checkLen(e){
		event = event || window.event;
		if($cont.val().length >= 60 && event.keyCode != 116 && event.keyCode != 8){
			$cont.val($cont.val().substring(0,60));
			return false;
		}
	}
	$(document).keyup(function(e){checkLen(e)});
	$(document).keypress(function(e){checkLen(e)});
	$(document).keydown(function(e){checkLen(e)});

	$phone.focus(function(){
		$(document).keydown(function(event){
			event = event || window.event;
			if(event.keyCode == 32) return false;
		});
	});

	return this;
};

//表单重置
AppoModule.prototype.reset = function(){
	var $reset = $(".btn-reset");
	$reset.click(function(){
		var $form = $(this).parents(".s-form");
		$form.find("input").val("");

		//产品选择
		var $buyshop = $form.find(".buyshop");
		$form.find(".bt-group span").eq(0).addClass("selected").siblings().removeClass("selected");
		$buyshop.eq(0).show().siblings(".buyshop").hide();
		$buyshop.eq(0).find("option").eq(0).attr("selected","true");
		$buyshop.eq(1).find("option").eq(0).attr("selected","true");
		$form.find(".b-pt option").eq(0).attr("selected","true");
		$form.find(".b-bad option").eq(0).attr("selected","true");

		//地区选择
		$form.find(".d-prov option").eq(0).attr("selected","true");
		$form.find(".d-city").find("option").not(":first-child").remove();
		$form.find(".d-area").find("option").not(":first-child").remove();
		$form.find(".d-city option").eq(0).html("城市").attr({selected:true,value:""}).removeAttr("code");
		$form.find(".d-area option").eq(0).html("区/县").attr({selected:true,value:""});
	});
};



/* 
====================
===== 授权网点 =====
====================
*/
function SiteModule(){}

//导航切换
SiteModule.prototype.tabStep = function(){
	var $site = $(".tab-title li");
	var $cont = $(".tab-cont");
	$site.click(function(){
		var _cls = this.className;
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");
		$cont.hide();
		$cont.filter("."+_cls).show();
	});
	return this;
};