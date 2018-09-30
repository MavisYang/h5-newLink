var controller={
    //初始化首页
    init:function () {
        this.clickGenerate();
        this.copyUrl()
    },

    clickGenerate:function () {
        $('#generate').on('click',function () {
            var oldUrl = $('#link').val()
            if(oldUrl==''){
                verifyTopBox('请输入原链接')
                return false
            }else{
                var url = API_PATH+'/taskadminapi/authsec/support/link/user';
                AuthProvider.getAccessToken().then(function (resolve, reject) {
                    return promiseXHR(url,{type: 'Bearer', value: resolve},{url:oldUrl}, 'POST')
                }).then(function (res) {
                    var resData = JSON.parse(res)
                    if(resData.resultCode=='100'){
                        $('.newlink').show()
                        $('.linkUrl').text(resData.resultContent.linkUrl)
                        $('#qrCodeImg').attr('src',resData.resultContent.qrCode)
                    }

                })
            }
        })

    },

    copyUrl:function() {
        var clipboard = new Clipboard('#copy_btn');
        clipboard.on('success', function(e) {
            verifyTopBox('复制成功')
            e.clearSelection();
        });
    }
}

