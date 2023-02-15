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
//id:updatetabledata
//name:更新指定表数据
var openid = sys.request.openid;
var typecd = sys.request._typecd;
var did = sys.request._did;
var en = sys.request._en;
var org = sys.request.org;

if(typecd == null || did == null || en == null){
    sys.setRetData("1");
    return;
}

var request = sys.request;
var userid = sys.getUserIdByOpenId(openid);
//根据typecd查询sys_md_mm002获取表的字段
var getfields = "select en,mk,must from sys_md_mm002 where typecd = ?";
var getfields_cnt = sql.query(getfields,[typecd],"tablefields");
if(getfields_cnt == 0){
    sys.setRetData("2","数据异常，物理表没有对应的模型结构信息");
    return;
}
var tablefields=sys.result.tablefields;
//获取修改的字段参数及值
var keys = "";
var values=[];
var prikeyFields = "";
var prikeyValue = [];
var prikeyValue2 = [];
var must = [];
for(r in tablefields){
    if(r.must == "1"){
        list.add(must,r.en);
    }
    if(r.mk=="1"){
        prikeyFields = prikeyFields+" "+r.en+"=? and";
        list.add(prikeyValue,request["__"+r.en]==null?"":request["__"+r.en]);
        list.add(prikeyValue2,request[r.en]);
    }
    keys=keys+r.en+"=?,";
    list.add(values,request[r.en]);
}
//验证必填项是否输入
for (var i=0; i<must.length; ++i) {
    var r=must[i];
    if(request[r]==null){
        sys.setRetData("1","缺少参数："+r);
        return;
    }
}

// 字段
if(keys != ""){
    keys = sys.subStringTo(keys,0,sys.length(keys)-1);
}else{
    sys.setRetData("1");
    return;
}
// 主键
if(prikeyFields != ""){
    prikeyFields = sys.subStringTo(prikeyFields, 0, sys.length(prikeyFields)-3);
    for(r in prikeyValue){
        list.add(values,r);
    }
}
else{
    sys.setRetData("1","此表没有主键，不可修改！");
    return;
}

//判断数据源是平台还是第三方
if(did=="00000000000000000000000000000000"){
    //如果修改了主键，则判断主键是否重复
    if(prikeyFields != "" && JSON.stringify(prikeyValue) != JSON.stringify(prikeyValue2)){
        var checkPK_Sql = "select * from "+en+" where "+prikeyFields;
        var checkPK_Sql_cnt=sql.query(checkPK_Sql,prikeyValue2,"checkPK_R");
        if(checkPK_Sql_cnt > 0){
            sys.setRetData("2","主键重复");
            return;
        }
    }
    //更新SQL语句
    var updateSql="update "+en+" set "+keys + " where "+prikeyFields;
    try{
        var updateSql_cnt = sql.update(updateSql,values,"1");
        if(updateSql_cnt > 1){
            sys.setRetData("2","修改会影响多余一条的数据，请联系管理员");
            return;
        }
        sql.commit();
        sys.setRetData("0");
    }catch(e){
        // 抛出sql执行失败message
        sys.setRetData("2",e.cause.message);
    }
}else{
    var iscatch=false,catmsg="";
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常，请检查数据源配置");
        return;
    }
    //如果修改主键，则判断主键是否重复
    if(prikeyFields != "" && JSON.stringify(prikeyValue) != JSON.stringify(prikeyValue2)){
        var checkPK_Sql = "select * from "+en+" where "+prikeyFields;
        var checkPK_Sql_cnt=sql.query(checkPK_Sql,prikeyValue2,"checkPK_R");
        if(checkPK_Sql_cnt > 1){
            sys.setRetData("2","主键重复");
            return;
        }
    }
    //更新SQL语句
    var updateSql="update "+en+" set "+keys + " where "+prikeyFields;
    try{
        var updateSql_cnt = sql.update(updateSql,values,"1");
        if(updateSql_cnt > 1){
            sys.setRetData("2","修改会影响多余一条的数据，请联系管理员");
            return;
        }
        sql.commit();
        sys.setRetData("0");
    }catch(e){
        iscatch=true;
        catmsg=e.cause.message;
    }
    if(iscatch){
        // 抛出sql执行失败message
        sys.setRetData("2",catmsg);
        return;
    }
    //恢复连接
    sql.connection();
}

//记录日志
// var before_json={};
// var after_json={
//     "en":en,
//     "keys":keys,
//     "where":prikeyFields,
//     "values":values
// };
// // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","014","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json",sys.jsonFromInstance(after_json),"orgid",org);
// var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
//     "typecd":typecd,
//     "operation_type":"014",
//     "before_json":sys.jsonFromInstance(before_json),
//     "after_json":sys.jsonFromInstance(after_json)
// });
// if(log_res.data.ret!="0"){
//     sys.setRetData(log_res.data.ret,log_res.data.msg);
//     return;
// }