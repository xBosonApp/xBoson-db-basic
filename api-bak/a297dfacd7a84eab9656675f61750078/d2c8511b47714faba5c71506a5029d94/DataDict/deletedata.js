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
//id:deletedata
//name:删除datatable数据

//获取参数
var typecd = sys.request.typecd; // tree节点的typecd

if(typecd == null){
    sys.setRetData("1");
    return;
}

var gettable = "select version,datatable from sys_mdm001 where typecd=?";

var gettable_cnt = sql.query(gettable, [typecd] , "table");

if(gettable_cnt == null){
    sys.setRetData("1");
    return;
}
var table = sys.result.table[0].datatable;

//如果表名为空，则返回
if(sys.trim(table) == ""){
    sys.setRetData("2");
    return;
}
if(table == "sys_mdm002"){
    var version = sys.request.version;
    var dictcd = sys.request.dictcd;
    if(dictcd == null || version == null){
        sys.setRetData("1");
        return;
    }
    //获取要删除的字典信息
    if(sql.query("select typecd,version,dictcd,dictnm,shortkey,mark,status from sys_mdm002 where typecd=? and dictcd=? and version=?",[typecd,dictcd,version],"oldR")==0){
        sys.setRetData("2","此字典不存在！");
        return;
    }
    var oldR=sys.result.oldR;
    var delSql="delete from sys_mdm002 where typecd=? and dictcd=? and version=?";
    var delSql_cnt = sql.update(delSql, [typecd, dictcd, version]);
    //sql.update 返回0
    if(delSql_cnt == null){
        sys.setRetData("2","删除异常");
    }else{
        //记录日志
        var before_json={
            "typecd":typecd,
            "version":version,
            "dictcd":dictcd,
            "dictnm":oldR[0].dictnm,
            "shortkey":oldR[0].shortkey,
            "mark":oldR[0].mark,
            "status":oldR[0].status
        };
        var after_json={};
        var log_res = http.platformPost({"app":"d2c8511b47714faba5c71506a5029d94","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00102",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
        if(log_res.data.ret!="0"){
            sys.setRetData(log_res.data.ret,log_res.data.msg);
            return;
        }
        sys.setRetData("0");
    }
    return;
}
else if(table == "sys_pl_mdm004"){
    var dbtype = sys.request.dbtype;
    var class0 = sys.request.class;
    if(dbtype == null || class0 == null){
        sys.setRetData("1");
    }
    var delSql="delete from sys_pl_mdm004 where typecd=? and dbtype=? and class=?";
    var delSql_cnt = sql.update(delSql, [typecd, dbtype, class0]);
    //sql.update 返回0
    if(delSql_cnt == null){
        sys.setRetData("2","删除异常");
    }else{
        sys.setRetData("0");
    }
    return;
}
else{
    //获取Insert模型ID
    sql.query("select modolcd from sys_bm002 where did=? and tablenm=? and isui='1' and sqltype='D'",["00000000000000000000000000000000",table],"modelcd_r");
    if(sys.size(sys.result.modelcd_r)==0){
        sys.setRetData("2","请先设置表的操纵模型信息！");
        return;
    }
    var params={"modolcd":sys.result.modelcd_r[0].modolcd};
    for(r in sys.request){
        if(r.key!="openid"&&r.key!="app"&&r.key!="mod"&&r.key!="org"&&r.key!="requestid"){
            map.put(params,r.key,r.value);
        }
    }
    //调接口执行操作模型
    var res=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"commapi","api":"excuteapi"},params);
    if(res.data.ret!="0"){
        sys.setRetData(res.data.ret,res.data.msg);
        return;
    }
    sys.setRetData("0");
}
if(table == "sys_mdm002"){
      //更新平台数据字典缓存
    var _sql = se.getCache(_CACHE_REGION_SYS_SQL_, "dict0008");
    sql.query(_sql, [typecd,sys.result.table[0].version], "_children");
    var _children = sys.result._children;
    se.setCache(_CACHE_REGION_MDM_, org+":"+typecd, _children, 0);
}