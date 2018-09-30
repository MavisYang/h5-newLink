function promiseXHR  (url,token,data,type) {
    return  new Promise(function(resolve, reject) {
        var xhr=new XMLHttpRequest();
        xhr.open(type,url,true);
        if(typeof data === 'object'){
            xhr.setRequestHeader('Content-Type','application/json')
            data = JSON.stringify(data)
        }else {
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
        }
        if(token!=null){
            token.value = token.type == 'Basic' ? 'bGl6LWdyb3VwcGV0LWg1OnNlY3JldA==' : token.value
            xhr.setRequestHeader('Authorization',token.type+' '+token.value)
        }
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if (xhr.status>=200&&xhr.status<300||xhr.status==304) {
                    resolve(xhr.responseText)
                }else{
                    reject(xhr.responseText)
                }
            }
        }
        xhr.send(data);
    })
}

var AuthProvider={
    onLogin:function(username,password){
        const url = API_PATH+'/uaa/oauth/token'
        return promiseXHR(url,{type:'Basic',value:null},'grant_type=password&username='+username+'&password='+password,'POST')
            .then(function(res)  {
                const data = eval("("+ res +")")
                console.log(data,'data')
                AuthProvider.saveTokens(data.access_token,data.refresh_token,data.expires_in)
                return data
            }).catch(function(reject) {
                return 'error'
            })
    },
    getAccessToken(){
        if(!AuthProvider.getCookie('access_token_h5')){
            // 0e4555f4-b13d-404b-93d6-df9987408ee2
            return  AuthProvider.onRefreshToken()
        }else if (AuthProvider.getCookie('access_token_h5')=='wait'){
            return new Promise(function (resolve,reject) {
                setTimeout(function(){
                    AuthProvider.getAccessToken().then(function(res) {
                        resolve(res)
                    })
                },1900)
            })
        }else {
            return new Promise(function (resolve,reject) {
                resolve(AuthProvider.getCookie('access_token_h5'))
            })
        }
    },

    setWait:function(){
        let exp = new Date();
        exp.setTime(exp.getTime() + 2*1000)
        document.cookie = 'access_token_h5' + "="+ escape ('wait')+";expires=" + exp.toGMTString()+';path=/'
    },

    saveTokens:function(access_token,refresh_token,expires_in){
        let exp = new Date();
        exp.setTime(exp.getTime() + expires_in*1000)
        document.cookie = 'access_token_h5' + "="+ escape (access_token) + ";expires=" + exp.toGMTString()+';path=/';
        document.cookie = 'refresh_token_h5' + "="+ escape (refresh_token)+';path=/'
    },


    onRefreshToken() {
        const refreshToken = AuthProvider.getCookie('refresh_token_h5')
        const url = API_PATH+'/uaa/oauth/token'
        AuthProvider.setWait()
        return promiseXHR(url,{type:'Basic',value:null},'grant_type=refresh_token&refresh_token='+refreshToken,'POST')
            .then(function(res) {
                const data = eval("("+ res +")")
                AuthProvider.saveTokens(data.access_token,data.refresh_token,data.expires_in)
                return data.access_token
            }).catch(function(err){

            })
    },
    saveCookie:function(name,value,expires_in){
        let exp = new Date();
        exp.setTime(exp.getTime() + expires_in*24*60*60*1000)
        document.cookie = name+'='+escape(value)+";expires="+ exp.toGMTString()+';path=/';
    },
    getCookie(key) {
        var aCookie = document.cookie.split("; ");
        // console.log(aCookie);
        for (var i=0; i < aCookie.length; i++)
        {
            var aCrumb = aCookie[i].split("=");
            if (key == aCrumb[0])
                return unescape(aCrumb[1]);
        }
        return null;
    },
    deleteCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=AuthProvider.getCookie(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    },

}
// function  AuthProvider(){
//
//     this.onLogin=function({username,password}){
//         var self = this;
//         const url = API_PATH+'/uaa/oauth/token'
//         return promiseXHR(url,{type:'Basic',value:null},'grant_type=password&username='+username+'&password='+password,'POST')
//                 .then(function(res)  {
//                   const data = eval("("+ res +")")
//                     self.saveTokens(data.access_token,data.refresh_token,data.expires_in)
//                   return data
//                 }).catch(function(reject) {
//                   return 'error'
//             })
//     },
//         this.setWait=function(){
//         let exp = new Date();
//         exp.setTime(exp.getTime() + 2*1000)
//         document.cookie = 'access_token' + "="+ escape ('wait')+";expires=" + exp.toGMTString()+';path=/'
//     },
//
//     this.saveTokens=function(access_token,refresh_token,expires_in){
//     let exp = new Date();
//     exp.setTime(exp.getTime() + expires_in*1000)
//     document.cookie = 'access_token' + "="+ escape (access_token) + ";expires=" + exp.toGMTString()+';path=/';
//     document.cookie = 'refresh_token' + "="+ escape (refresh_token)+';path=/'
//   },
//
//
//
// }


