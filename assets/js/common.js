const baseUrl = 'https://hcisx.iwoyou.cn';
var table = layui.table;
//const baseUrl = 'http://www.hctest.com';
let takeOpen = null;

//写入cookie
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//删除cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function isLogin(username) {
    if (!username) {
        location.href = './login.html'
    }
    document.getElementsByClassName('username')[0].innerHTML = username;
}


// tableRender({

//     url:baseUrl + '....'
// })
function loginOut() {
    delCookie('username');
    location.href = './login.html'
}
var tak = getStore('takeOpen')
takeOpen = tak ? tak : null;

function gaiPwd() {
    layer.open({
        title: '修改密码',
        area: ['320px', '300px'],
        btn: ['确认', '取消'],
        content: $('#pwdTpl').html(),
        btn1(index, layero) {
            // return false;
            var data = {
                password: $('#password').val(),
                repassword: $('#repassword').val()
            }
            if (!data.password || !data.repassword) {
                alert('不能为空');
                return false;
            } else if (data.password == data.repassword) {
                var url = '/hcms/user/edit_pwd';
                promiseSovl(url, 'post', data).then(function (res) {
                    if (res.code == 0) {
                        layer.msg('修改成功', { time: 2000 }, function () {
                            delCookie('username');
                            location.href = '/login.html'
                        })
                    } else {
                        alert(res.msg)
                    }
                });
            } else {
                alert('输入不一致，请重新输入');
                return false;
            }
        },
        btn2(index, layero) {
            // return false
        }
    })
}

//封装通用请求方法promise
function promiseSovl(purl, method, data) {
    var datas = data ? data : {};
    var md = method == 'post' ? 'post' : 'get';
    var murl = purl.indexOf(baseUrl) == -1 ? baseUrl + purl : purl;
    // if (purl.indexOf('https') == -1){
    //     var url = baseUrl + purl;
    // }else {
    //     url = purl
    // }
    // console.log(murl)
    if (md.toLowerCase() == 'get') {
        datas.token = takeOpen;
    } else {
        murl += '?token=' + takeOpen
    }
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: murl,
            type: md,
            data: datas,
            dataType: 'json',
            success: (res) => {
                // console.log(res)
                if (res.code == 10000) {
                    // layer.load();
                    layer.alert('登录超时，请重新登录', { shade: 0.5, title: false, closeBtn: false }, function () {
                        if (top.document.getElementsByClassName("layui-side")[0]) {
                            if (location.pathname.indexOf('login') == -1)
                                top.location.href = '/login.html';
                        } else {
                            if (location.pathname.indexOf('login') == -1)
                                location.href = '/login.html';
                        }
                    })
                } else {
                    resolve(res);
                }
            },
            error: (res) => {
                reject(res);
            }
        });
    });
}
// 用户菜单访问记录start

var parentDome = parent.document.getElementsByClassName("layui-side")[0];
if (parentDome) {
    var pageUrl = $(".layui-side .layui-nav .layui-this", window.parent.document).find('.layui-menu-tips').attr('layuimini-href');
    var laythis = parentDome.getElementsByClassName('layui-this')[1];
    if (laythis)
        var pageName = laythis.getElementsByClassName('layui-left-nav')[0].innerText;
} else {
    var pageName = $('title').text();
    var pathname = location.pathname;
    var ind = pathname.indexOf('page');
    var pageUrl = pathname.substr(ind);
}
var userData = {
    menu_name: pageName,
    href: pageUrl,
    token: takeOpen
}
var menuUrl = '/hcms/user/visit_log';
promiseSovl(menuUrl, 'post', userData).then(function (res) { });
// 用户菜单访问记录end

// 封装layui table方法
function tableRender(param) {
    var obj = param.where ? param.where : {};
    obj.token = takeOpen;
    if (param.page) {
        param.limit = param.limit ? param.limit : 10;
        param.limits = param.limits ? param.limits : [10, 20, 30, 40, 50, 60];
    } else {
        param.limit = '';
        param.limits = '';
    }
    param.height = param.height ? param.height : 600;
    param.toolbar = param.toolbar ? param.toolbar : ''
    param.defaultToolbar = param.defaultToolbar ? param.defaultToolbar : false
    var index = table.render({
        elem: param.elem,
        url: param.url,
        id: param.id,
        height: param.height,
        toolbar: param.toolbar,
        defaultToolbar: param.defaultToolbar,
        where: obj,
        cols: param.cols,
        // even:true,
        // skin:'row',
        size: param.size,
        page: param.page,
        limit: param.limit,
        limits: param.limits,
        done: function (res) {
            if (res.code == 10000) {
                layer.alert('登录超时，请重新登录', { shade: 0.5, title: false, closeBtn: false }, function () {
                    if (top.document.getElementsByClassName("layui-side")[0]) {
                        if (location.pathname.indexOf('login') == -1)
                            top.location.href = '/login.html';
                    } else {
                        if (location.pathname.indexOf('login') == -1)
                            location.href = '/login.html';
                    }
                })
            }
            if (param.done)
                param.done(res);
        }
    });
    return index;
}

// layer子页面获取iframe弹窗获取路径#后边的值
function getArgument() {
    var n = parent.document.getElementsByTagName('iframe').length - 1;
    var iframes = parent.document.getElementsByTagName('iframe')[n]
    if (iframes)
        var urlArr = iframes.getAttribute('src').split('#')[1]
    else
        var urlArr = location.hash.split('#')[1];
    if (urlArr)
        var urls = urlArr.split('&');
    else
        var urls = []
    var obj = {};
    for (var i = 0; i < urls.length; i++) {
        var ary = urls[i].split('=');
        obj[ary[0]] = ary[1];
    }
    return obj
}

// 设置localStorage
function setStore(key, value, expire) {
    var exp = expire ? expire : 1000 * 60 * 60 * 24;
    var obj = {
        data: value,
        time: Date.now(),
        expire: exp
    };
    try {
        localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
        if (isQuotaExceeded(e)) {
            console.error("Error: 本地存储超过限制");
            localStorage.clear();
        } else {
            console.error("Error: 保存到本地存储失败");
        }
    }
}

function isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e) {
        if (e.code) {
            switch (e.code) {
                case 22:
                    quotaExceeded = true;
                    break;
                case 1014: // Firefox 
                    if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                        quotaExceeded = true;
                    }
                    break;
            }
        } else if (e.number === -2147024882) { // IE8 
            quotaExceeded = true;
        }
    }
    return quotaExceeded;
}
// 获取localStorage
function getStore(key) {
    var val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
}

// 删除localStorage
function removeStore(key) {
    localStorage.removeItem(key);
}
// 重置localStorage
function resetStore(key, value) {
    removeStore(key);
    setStore(key, value);
}


/* 列表开始 */
//模板引擎
function tplInit(data) {
    laytpl(listTpl).render(data, function (html) {
        $('.jlul').html(html);
    });
}

// 格式化form数据
function formData(ele) {
    var elem = ele ? ele : '.jlul';
    var dome = $(elem).find('[name]')
    var obj = {};
    dome.each(function () {
        var name = $(this).attr('name');
        var val = $(this).val();
        if (name)
            obj[name] = val;
    });
    return obj;
}
// 格式化form数据
function formSubData() {
    var obj = {};
    $('.jlul [name]').each(function () {
        var name = $(this).attr('subname');
        var val = $(this).val();
        if (name)
            obj[name] = val;
    });
    return obj;
}
// 列表赋值方法
function dataRender(data, ele) {
    if (!data) {
        form.render();
        return;
    }
    var el = ele ? ele : '.jlul';
    var dome = $(el).find('[name]')
    dome.each(function () {
        var name = $(this).attr('name');
        var val = data[name];
        if (name && val) {
            $(this).val(val);
        }
    })
    form.render();
}

// 列表赋值方法
function dataSubRender(data, ele) {
    if (!data) {
        form.render();
        return;
    }
    var el = ele ? ele : '.jlul';
    var dome = $(el).find('[subname]')
    dome.each(function () {
        var name = $(this).attr('subname');
        var val = data[name];
        if (name && val) {
            $(this).val(val);
        }
    })
    form.render();
}

//窗口大小改变时，列表不错乱
function listDataRender(data) {
    var w1 = Math.floor($('.jlul').width());
    num = Math.floor(w1 / 280)
    console.log(num)
    num = num >= 6 ? 5 : num
    var doubleData = [];
    var singleData = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].type == 1) {
            doubleData.push(data[i]);
        } else {
            singleData.push(data[i]);
        }
    }
    if (doubleData.length > 0) {
        if (num == 3) {
            singleData.splice(3, 0, doubleData[0]);
            singleData.splice(5, 0, doubleData[1]);
        } else {
            singleData.splice(num, 0, doubleData[0], doubleData[1]);
        }
    }

    for (var i = 0; i <= 5; i++) {
        var cla = 'jlul' + i;
        $('.jlul').removeClass(cla)
    }
    var classNa = 'jlul' + num
    $('.jlul').addClass(classNa)
    return singleData;
}
function listReisze(ele) {
    var elem = ele ? ele : '.jlul';
    var w1 = Math.floor($(elem).width());
    var num = Math.floor(w1 / 297)
    num = num >= 6 ? 5 : num;
    for (var i = 0; i <= 5; i++) {
        var cla = 'jlul' + i;
        $(elem).removeClass(cla)
    }
    var classNa = 'jlul' + num
    $(elem).addClass(classNa)
}

// 调用layui日期时间控件
function dateRender(ele) {
    laydate.render({
        elem: ele,
        type: 'datetime'
    });
}
/* 列表结束 */


//完工方法
function finishWork(data) {
    var url = '/hcms/dispatch/complete_hts';
    layer.confirm('确定要将任务单号：《' + data.ht_num + '》设置为完工状态？', {
        title: false,
        closeBtn: 0,
    }, function () {
        promiseSovl(url, 'get', data).then(function (res) {
            if (res.code == 0) {
                layer.msg(res.msg);
                location.reload();
            }
        })
    })

}

//下拉复选框
function checkSelect(ele, name, data) {
    xmSelect.render({
        el: ele,
        name: name,
        data: data,
        toolbar: {
            show: true,
        }
    })
}

//下拉复选框
function radioSelect(ele, name, data) {
    xmSelect.render({
        el: ele,
        name: name,
        radio: true,
        data: data,
        toolbar: {
            show: true,
        }
    })
}

/*
param.url  // table数据接口
param.data // 所需要传的参数
param.length // 所有数据的长度
param.export // 回调函数
*/
function exportAllData(param) {
    param.data = param.data ? param.data : {}
    param.data.page = 1
    param.data.limit = 200
    var len = Math.ceil(param.length / param.data.limit);
    var alDatas = [];
    for (var i = 0; i < len; i++) {
        param.data.page = i + 1
        promiseSovl(param.url, 'get', param.data).then(function (res) {
            if (res.code == 0) {
                alDatas = alDatas.concat(res.data);
                if (alDatas.length >= param.length) {
                    param.export(alDatas)
                }
            }
            console.log(alDatas)
        });
    }
}

// 相同弹框
function listAddtpl(title, laytplUrl) {
    layer.open({
        type: 2,
        title: title,
        area: ["50%", "70%"],
        content: laytplUrl,
        success: (res) => {
        }
    })
}
// 这是导出的例子
// $('.export').click(function(){
//     var ind = layer.load(0,{shade:0.5})
//     exportAllData({
//         url: tableIns.config.url,
//         data:{
//                 al_station: '太龙,山立,伟治,松大',
//                 start: '',
//                 end: '',
//                 station: '',
//                 ht_num: '',
//                 car_num: ''
//             },
//         length: alldata.count,
//         export (res) {
//             layer.close(ind)
//             console.log(res)
//             table.exportFile(tableIns.config.id,res,'xls')
//         }
//     })
// })