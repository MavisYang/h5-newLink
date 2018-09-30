var timer;
var params={
    "type":11,
    "templateCode":'H5_GROUP_PET_TEMPLATE_VCODE_MSG',
    "wechatId":AuthProvider.getCookie('wechatId_h5'),
    "unionId":AuthProvider.getCookie('unionid_h5'),
};
var controller={
    //初始化首页
    init:function () {
        this.phoneGetCode();//
        this.submitHandle();   //提交信息
    },

    submitHandle:function () {
        $('.joinBtn').get(0).addEventListener('click',function () {
            var inputArr = $("input[type=text]")
            inputArr.map(function (i,v) {
                params[v.name] = v.value
            })
            if(!verifyHandle(params)){
                return
            }

            $('.joinBtn').attr('disabled',true)
            promiseXHR(API_PATH+'/basis-api/noauth/user/registUser',null,params, 'POST').then(function (res) {
                var resData = JSON.parse(res)
                $('.joinBtn').removeAttr('disabled')
                switch (resData.resultCode){
                    case '100':
                        //跳转页面，登录，获取token
                        var unionId = AuthProvider.getCookie('unionid_h5')
                        var username = 'unionid_'+unionId+'_type_11'
                        AuthProvider.onLogin(username,'').then(function(value){
                            window.location.href=redirect_URI+'newLink.html'
                        })
                        break;
                    case '02504021'://验证码已过期
                        verifyTopBox('验证码已过期')
                        break;
                    case '02504022'://验证码错误
                        verifyTopBox('验证码错误')
                        break;
                    case '02504017'://用户已存在
                        verifyTopBox('用户已存在')
                        break;
                    case '02504024'://手机号已存在
                        verifyTopBox('手机号已存在')
                        break;
                    default://02504102 02504022 02504030
                        verifyTopBox('提交失败')
                        break;
                }

            })
        })

    },


    phoneGetCode:function(){
        $('.getCode').on('click',function () {
            var phone = $('#phone').val();
            if(!isPhone(phone)) {
                verifyTopBox('手机号格式不正确')
            }else if($(this).text()=='获取验证码'&&phone!=''&&isPhone(phone)){
                codeCountDown(60)
                var url =API_PATH + '/basis-api/noauth/usermgmt/sendPhoneCode?_templateCode=H5_GROUP_PET_TEMPLATE_VCODE_MSG&_phone='+phone;
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (res) {
                        if (res.resultCode == '100') {
                            verifyTopBox('验证码已发出')
                        }
                    }
                })
            }
        })
    }


}

function verifyHandle(params){
    console.log(params,'params----')
    var flag=true
    if(params.phone.trim()==''){
        flag =false
        verifyTopBox('手机号不能为空')
        return
    }else if(!isPhone(params.phone)){
        flag =false
        verifyTopBox('手机号格式不正确')
        return
    }

    if(params.code.trim()==''){
        flag =false
        verifyTopBox('验证码不能为空')
        return
    }else if(!isCode(params.code)){
        flag =false
        verifyTopBox('验证码格式不正确')
        return
    }

    if(params.inviteCode.trim()==''){
        flag =false
        verifyTopBox('邀请码不能为空')
        return
    }
    return flag;

}

function codeCountDown(time) {
    // var time = 60
    timer = setInterval(function () {
        time--;
        if (time < 0) {
            clearInterval(timer)
            $('.getCode').text('获取验证码').attr('disabled',false).removeAttr('style');
        } else {
            let text = time + 's'
            $('.getCode').text(text).attr('disabled',true).css({opacity:1,color:'rgb(161, 161, 161)'});
        }
    }, 1000)
}
