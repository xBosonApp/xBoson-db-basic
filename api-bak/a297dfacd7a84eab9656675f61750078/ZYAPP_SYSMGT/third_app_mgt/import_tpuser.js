/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var org = sys.request.org;
var tp_appid = sys.request.tp_appid;
var is_create_platuser = sys.request.is_create_platuser;    //是否创建平台用户
var operation = sys.request.operation;  //insert delete
var is_just_return_data = sys.request.is_just_return_data;    //只返回数据
var file_name = sys.request.file_name;  //csv文件名
var file_charset = sys.request.charset; //字符集
// CSV参数
var delimiter = sys.request.delimiter;  // 分隔符（delimiter）
var quoteChar = sys.request.quoteChar;  // 引号符号（quoteChar）
var escape = sys.request.escape;    // 转义符号（escape）
// CSV文件头(userid,uid,email,tel)

var dt = sys.currentTimeString();
var create_pid = sys.getUserPID(sys.request.openid);

if(tp_appid == null || file_name == null || file_charset == null){
    sys.setRetData("1");
    return;
}

// tp_appid是否存在
if(sql.query("select 1 from sys_pl_tp_app where tp_appid=? and orgid=?",[tp_appid,org])==0){
    sys.setRetData("2","当前机构下不存在此应用ID");
    return;
}
// 分隔符
if(delimiter == "01"){
    delimiter = ",";
}else if(delimiter == "02"){
    delimiter = "\t";
}else if(delimiter == "03"){
    delimiter = ";";
}
// 引号符号
if(quoteChar == "01"){
    quoteChar = "\"";
}else if(quoteChar == "02"){
    quoteChar = "'";
}
// 解析CSV文件，返回数据
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
var CsvData = sys.csvToList([path,file_name,file_charset],delimiter,quoteChar,escape,[],0);
if(is_just_return_data=="1"){
    sys.addRetData(CsvData,"result");
    sys.setRetData("0","","result");
    return;
}
if(sys.size(CsvData) == 0){
    sys.setRetData("2","CSV文件内容为空");
    return;
}
if(!map.containsKey(CsvData[0],"userid")){
    sys.setRetData("2","CSV文件中需要包含平台用户ID(userid)");
    return;
}
if(!map.containsKey(CsvData[0],"uid")){
    sys.setRetData("2","CSV文件中需要包含第三方应用用户ID(uid)");
    return;
}
// 导入添加
if(operation=="insert"){
    // CSV文件中userid,uid是否重复
    var duplicate = {"userid":[],"uid":[]};
    var tmpList_userid=[],tmpList_uid=[];
    
    var ur = "^[a-zA-Z][a-zA-Z0-9_-]{3,15}$";//用户id
	var emailr = "\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";//email
	var telr = "^(13[0-9]|14[57]|15[0-9]|17[0678]|18[0-9])[0-9]{8}$";//手机号码
    for(r in CsvData){
        if(r.userid==null||r.uid==null){
            sys.setRetData("2","userid和uid不可为空");
            return;
        }
        //验证userid,password,email,tel
        if(!sys.regexMatches(ur,r.userid)){
            sys.setRetData("2","CSV文件中userid：'"+r.userid+"'不合法，（字母开头，4-16位）");
            return;
        }
        if(sys.trim(r.email)!=""&&!sys.regexMatches(emailr,r.email)){
            sys.setRetData("2","CSV文件中email：'"+r.email+"'不合法");
            return;
        }
        if(sys.trim(r.tel)!=""&&!sys.regexMatches(telr,r.tel)){
            sys.setRetData("2","CSV文件中tel：'"+r.tel+"'不合法");
            return;
        }
        //userid
        if(list.contain(tmpList_userid,r.userid)){
            list.add(duplicate.userid,r.userid);
        }else{
            list.add(tmpList_userid,r.userid);
        }
        //uid
        if(list.contain(tmpList_uid,r.uid)){
            list.add(duplicate.uid,r.uid);
        }else{
            list.add(tmpList_uid,r.uid);
        }
    }
    if(sys.size(duplicate.userid)>0||sys.size(duplicate.uid)>0){
        sys.addRetData("80","code");
        sys.addRetData(duplicate,"result");
        sys.setRetData("0","CSV文件中userid,uid有重复：","code","result");
        return;
    }
    //userid-pid
    var checkSql = "select a.userid,a.pid from sys_userinfo a,sys_tenant_user b where b.orgid=? and a.pid=b.pid  and a.userid in (";
    var inUserid = "";
    for(r in tmpList_userid){
        inUserid = inUserid+",'"+r+"'";
    }
    checkSql = checkSql+sys.subString(inUserid,1)+")";
    sql.query(checkSql,[org]);
    //sys_pl_tp_app_uid
    var ins = "insert into sys_pl_tp_app_uid (tp_appid,pid,uid,status,createdt,updatedt) values (?,?,?,'1',?,?)";
    var batch_params = [];
    //同时创建平台用户时
    if(is_create_platuser=="1"){
        if(sys.size(sys.result.result)>0){
            sys.addRetData("81","code");
            sys.setRetData("0","已存在的平台用户ID(userid)：","code","result");
            return;
        }
        // sys_userinfo
        var ins_userinfo = "insert into sys_userinfo(pid,userid,password,multiflag,tel,email,status,createdt,updatedt,password_dt) values(?,?,?,?,?,?,?,?,?,?)";
        var params_userinfo=[];
        // mdm_personal_info
        var ins_personal = "insert into mdm_personal_info (pid,status,createdt,updatedt,create_pid,update_pid,create_orgid,update_orgid,de0201010,de0201012) values(?,?,?,?,?,?,?,?,?,?)";
        var params_personal=[];
        // sys_tenant_user
        var ins_tenant_user = "insert into sys_tenant_user (orgid,status,admin_flag,createdt,updatedt,pid) values(?,?,?,?,?,?)";
        var params_tenant_user=[];
        for(r in CsvData){
            var passwd = sys.encodePlatformPassword(r.userid,dt,sys.toLowerCase(sys.md5("000000")));
            var uuid = sys.uuid();
            list.add(params_userinfo,[uuid,r.userid,passwd,"0",r.tel,r.email,"1",dt,dt,dt]);
            list.add(params_personal,[uuid,"1",dt,dt,create_pid,create_pid,org,org,r.tel,r.email]);
            list.add(params_tenant_user,[org,"1","0",dt,dt,uuid]);
            list.add(batch_params,[tp_appid,uuid,r.uid,dt,dt]);
        }
        sql.updateBatch(ins_userinfo,params_userinfo,"1");
        sql.updateBatch(ins_personal,params_personal,"1");
        sql.updateBatch(ins_tenant_user,params_tenant_user,"1");
    }
    //不创建平台用户时，userid列需要是有效的userid
    else{
        var noExist_userid = [];
        var Exist_userid = [];
        for(r in sys.result.result){
            list.add(Exist_userid,r.userid);
        }
        for(r in tmpList_userid){
            if(!list.contain(Exist_userid,r)){
                list.add(noExist_userid,r);
            }
        }
        if(sys.size(noExist_userid)>0){
            sys.addRetData("82","code");
            sys.addRetData(noExist_userid,"result");
            sys.setRetData("0","不存在的平台用户ID(userid)：","code","result");
            return;
        }
        //为batch_params赋值
        var userid_pid_mapping = {};    //useid和pid映射Map
        for(r in sys.result.result){
            map.put(userid_pid_mapping,r.userid,r.pid);
        }
        for(r in CsvData){
            list.add(batch_params,[tp_appid,userid_pid_mapping[r.userid],r.uid,dt,dt]);
        }
    }
    //sys_pl_tp_app_uid 主键是否重复 
    var sel = "select b.userid from sys_pl_tp_app_uid a, sys_userinfo b where a.tp_appid=? and a.pid=b.pid and b.userid in (";
    for(r in CsvData){
        sel=sel+"'"+r.userid+"',";
    }
    sel=sys.subStringTo(sel,0,sys.length(sel)-1);
    sel=sel+")";
    if(sql.query(sel,[tp_appid])>0){
        sys.addRetData("83","code");
        sys.setRetData("0","在此应用下，以下平台用户ID已存在！","code","result");
        return;
    }
    sel = "select a.uid from sys_pl_tp_app_uid a, sys_userinfo b where a.tp_appid=? and a.pid=b.pid and a.uid in (";
    for(r in CsvData){
        sel=sel+"'"+r.uid+"',";
    }
    sel=sys.subStringTo(sel,0,sys.length(sel)-1);
    sel=sel+")";
    if(sql.query(sel,[tp_appid])>0){
        sys.addRetData("83","code");
        sys.setRetData("0","在此应用下，以下第三方应用用户ID已存在！","code","result");
        return;
    }
    var cnt = sql.updateBatch(ins,batch_params,"1");
    sql.commit();
    sys.setRetData("0","导入成功,导入"+cnt+"条");
}
// 导入删除
else if(operation=="delete"){
    var del_sql = "delete from sys_pl_tp_app_uid where tp_appid=? and uid=? and pid in (select pid from sys_userinfo where userid=?)";
    var del_params=[];
    for(r in CsvData){
        list.add(del_params,[tp_appid,r.uid,r.userid]);
    }
    var cnt = sql.updateBatch(del_sql,del_params);
    sys.setRetData("0","导入成功,删除"+cnt+"条");
}
else{
    sys.setRetData("2","操作类型参数错误！");
    return;
}