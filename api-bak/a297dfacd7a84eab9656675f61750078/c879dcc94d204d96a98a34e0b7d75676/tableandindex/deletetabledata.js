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
//id:deletetabledata
//name:删除指定表一条数据
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
//根据typecd查询sys_md_mm002获取表的主键
var getfields = "select en from sys_md_mm002 where typecd = ?";
var getfields_cnt = sql.query(getfields,[typecd]);
if(getfields_cnt == 0){
    sys.setRetData("2","数据异常，物理表没有主键，不可删除数据");
    return;
}
var pkResult=sys.result.result;

//where条件主键
var where = " where ";
var haspk = false;
var whereValue = [];
for(r in pkResult){
    if(r.mk == "1"){
        haspk = true;
        //判断主键参数
        if(request[r.en] == null){
            where = where +"("+ r.en + " is null or "+ r.en + "='') and ";
        }else{
            where = where + r.en + "=? and ";
            list.add(whereValue,request[r.en]);
        }
    }
}

if(!haspk){
    //where条件全字段
    for(r in pkResult){
        if(request[r.en] == null){
            where = where +"("+ r.en + " is null or "+ r.en + "='') and ";
        }else{
            where = where + r.en + "=? and ";
            list.add(whereValue,request[r.en]);
        }
    }
}
where = sys.subStringTo(where, 0, sys.length(where)-4);

//delete语句
var delSql = "delete from "+en+where;
//连接外部数据源
if(did != "00000000000000000000000000000000"){
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常！");
        return;
    }
}
sql.update(delSql,whereValue);
//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}
//记录日志
// var dt=sys.currentTimeString();
// var before_json={
//     "typecd":typecd,
//     "did":did,
//     "en":en,
//     "where":whereValue
// };
// // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","015","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json","","orgid",org);
// var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
//     "typecd":typecd,
//     "operation_type":"015",
//     "before_json":sys.jsonFromInstance(before_json),
//     "after_json":""
// });
// if(log_res.data.ret!="0"){
//     sys.setRetData(log_res.data.ret,log_res.data.msg);
//     return;
// }
sys.setRetData("0");