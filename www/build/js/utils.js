var API_PATH = location.origin.includes('test')? 'http://test.gemii.cc:58080/lizcloud/api':
    location.origin.includes('dev')? 'http://dev.gemii.cc:58080/lizcloud/api'
        :'https://cloud.gemii.cc/lizcloud/api'

var redirect_URI='https://gp.molimami.com/userlink/';//绝对路径

function isPhone(str){
    let myreg = /^1[3-8]{1}\d{9}$/;
    if(myreg.test(str)){
        return true
    }
}

function isCode(str){
    let myreg = /^\d{6}$/;
    if(myreg.test(str)){
        return true
    }
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}

function verifyTopBox(text) {
    var branch = "<div class='verifyTopBox'>"+text+"</div>";
    $(".verifyBox").append(branch);
    setTimeout(function () {
        $('.verifyTopBox').remove()
    },2000)
}
