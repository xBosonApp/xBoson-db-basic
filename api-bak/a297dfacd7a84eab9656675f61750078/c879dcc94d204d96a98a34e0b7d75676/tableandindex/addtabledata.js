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
//id：addtabledata
//name:添加指定表的数据
var openid = sys.request.openid;
var org = sys.request.org;
var typecd = sys.request._typecd;
var did = sys.request._did;
var en = sys.request._en;

var request = sys.request;

//验证参数
if(typecd == null || did == null || en == null){
    sys.setRetData("1");
    return;
}
var userid = sys.getUserIdByOpenId(openid);
//根据typecd查询sys_md_mm002获取表的字段
var getfields = "select en,mk,must from sys_md_mm002 where typecd = ?";
var getfields_cnt = sql.query(getfields,[typecd],"tablefields");
if(getfields_cnt == 0){
    sys.setRetData("2","数据异常，物理表没有对应的模型结构信息");
    return;
}
var tablefields=sys.result.tablefields;
//获取添加的字段参数及值
var keys = "";
var values=[];
var prikeyFields = "";
var prikeyValue = [];
var mark = "";
var must = [];
for(r in tablefields){
    if(r.must == "1"){
        list.add(must,r.en);
    }
    if(r.mk=="1"){
        prikeyFields = prikeyFields+" "+r.en+"=? and";
        list.add(prikeyValue,request[r.en]);
    }
    keys=keys+r.en+",";
    list.add(values,request[r.en]);
    mark = mark+"?,";
}
//验证必填项是否输入
for (var i=0; i<must.length; ++i) {
    var r=must[i];
    // if(r == 'status')
    //     sys.printValue(typeof(r));
    if(request[r]==null){
        // sys.printValue(JSON.stringify(request),request[r],request.status,request[String(r)],typeof(r));
        sys.setRetData("1","缺少参数："+r);
        return;
    }
}
if(keys != ""){
    keys = sys.subStringTo(keys,0,sys.length(keys)-1);
    mark = sys.subStringTo(mark,0,sys.length(mark)-1);
}
// for(r in tablefields){
//     if(r.mk != "1"){
//         keys=keys+r.en+",";
//         list.add(values,request[r.en]);
//         mark = mark+"?,";
//     }else if(r.mk=="1"){
//         prikeyFields = prikeyFields+" "+r.en+"=? and";
//         list.add(prikeyValue,request[r.en]);
//     }
// }

// if(keys != ""){
//     keys = sys.subStringTo(keys,0,sys.size(keys)-1);
//     mark = sys.subStringTo(mark,0,sys.size(keys)-1);
// }


//获取操作的数据源schema和dbtype
var getinfo = "select dbtype, en from sys_pl_drm_ds001 where did=? and status='1'";
var params = [did];
if(did!="00000000000000000000000000000000"){
    getinfo=getinfo+" and owner=?";
    params=[did,org];
}
var getinfo_cnt = sql.query(getinfo,params,"dbinfo");
if(getinfo_cnt==0){
    sys.setRetData("2");
    return;
}
dbtype = sys.result.dbinfo[0].dbtype;    //数据库类型

//判断数据源是平台还是第三方
if(did=="00000000000000000000000000000000"){
    //如果有主键，则判断主键是否重复
    if(prikeyFields != ""){
        prikeyFields = sys.subStringTo(prikeyFields,0,sys.length(prikeyFields)-3);
        var checkPK_Sql = "select * from "+en+" where "+prikeyFields;
        var checkPK_Sql_cnt=sql.query(checkPK_Sql,prikeyValue,"checkPK_R");
        if(checkPK_Sql_cnt > 0){
            sys.setRetData("2","主键重复");
            return;
        }
    }
    //添加SQL语句
    var insertSql="";
    if(keys != ""){
        insertSql = "insert into "+en+" ("+keys+") values "+"("+mark+")";
        try{
            sql.update(insertSql,values);
            sys.setRetData("0");
        }catch(e){
            // 抛出sql执行失败message
            sys.setRetData("2",e.cause.message);
        }
    }
}else{
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("1","连接数据源异常");
        return;
    }
    //如果有主键，则判断主键是否重复
    if(prikeyFields != ""){
        prikeyFields = sys.subStringTo(prikeyFields,0,sys.length(prikeyFields)-3);
        var checkPK_Sql = "select * from "+en+" where "+prikeyFields;
        var checkPK_Sql_cnt=sql.query(checkPK_Sql,prikeyValue,"checkPK_R");
        if(checkPK_Sql_cnt > 0){
            sys.setRetData("2","主键重复");
            return;
        }
    }
    //添加SQL语句
    var insertSql="";
    if(keys != ""){
        insertSql = "insert into "+en+" ("+keys+") values "+"("+mark+")";
        try{
            sql.update(insertSql,values);
            sys.setRetData("0");
        }catch(e){
            // 抛出sql执行失败message
            sys.setRetData("2",e.cause.message);
        }
    }
}

//记录日志
// var after_json={
//     "en":en,
//     "keys":keys,
//     "values":values
// };
// // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","013","userid",userid,"createdt",dt,"before_json","","after_json",sys.jsonFromInstance(after_json),"orgid",org);
// var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
//     "typecd":typecd,
//     "operation_type":"013",
//     "before_json":"",
//     "after_json":sys.jsonFromInstance(after_json)
// });
// if(log_res.data.ret!="0"){
//     sys.setRetData(log_res.data.ret,log_res.data.msg);
//     return;
// }