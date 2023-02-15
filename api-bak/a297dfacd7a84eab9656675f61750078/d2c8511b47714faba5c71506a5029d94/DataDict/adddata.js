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
//id:adddata
//添加数据

var org=sys.request.org;
var typecd = sys.request.typecd;
if(typecd == null){
    sys.setRetData("1");
    return;
}
//获取要添加的表

var gettable = "select version,datatable from sys_mdm001 where typecd = ?";
var gettable_cnt = sql.query(gettable, [typecd], "tableresult");
var tableresult = sys.result.tableresult;

if(gettable_cnt == 0){
    sys.setRetData("2");
    return;
}
var table = tableresult[0].datatable;
if(sys.trim(table) == ""){
    sys.setRetData("2","根据typecd查出的datatable为空！");
    return;
}
//获取参数并添加（暂时写固定数据）
if(table == "sys_mdm002"){
    var version = sys.request.version;
    var dictcd = sys.request.dictcd;
    var dictnm = sys.request.dictnm;
    var shortkey = sys.request.shortkey;
    var status = sys.request.status;
    var mark = sys.request.mark;
    //判断不为空的字段
    if(dictcd == null || dictnm == null || status == null || version == null){
        sys.setRetData("1", "dictcd,dictnm,status,version不可为空");
        return;
    }
    if(shortkey == null){
        shortkey = sys.getPinyinFirstLetter(dictnm);
    }
    //判断主键是否存在
    var cnt = sql.query("select typecd from sys_mdm002 where typecd = ? and dictcd = ? and version = ?", [typecd, dictcd, version], "prikey");
    if(cnt > 0){
        sys.setRetData("1","主键已存在！");
        return;
    }
    //添加到数据库
    var insert = "insert into sys_mdm002(typecd,version,dictcd,dictnm,shortkey,status,mark,createdt,updatedt) values  (?,?,?,?,?,?,?,?,?)";
    var dt = sys.currentTimeString();
    var params = [typecd,version,dictcd,dictnm,shortkey,status,mark,dt,dt];
    var num=sql.update(insert, params);
    if(num == 1){
        //记录日志
        var before_json={};
        var after_json={
            "typecd":typecd,
            "version":version,
            "dictcd":dictcd,
            "dictnm":dictnm,
            "shortkey":shortkey,
            "status":status,
            "mark":mark
        };
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
    }else{
        sys.setRetData("999");
        return;
    }
}
else if(table == "sys_mdm003"){
    var decd = sys.request.decd;
    var en = sys.request.en;
    var cn = sys.request.cn;
    var datatype = sys.request.datatype;
    var numrange = sys.request.numrange;
    var format = sys.request.format;
    var unit = sys.request.unit;
    var dict = sys.request.dict;
    var status = sys.request.status;
    var mark = sys.request.mark;
    //判断不为空的字段
    if(decd == null || en == null || cn == null || datatype == null || dict == null || status == null){
        sys.setRetData("1");
        return;
    }
    //判断主键是否重复
    var cnt = sql.query("select typecd from sys_mdm003 where typecd=? and decd=?",[typecd,decd],"prikey");
    if(cnt > 0){
        sys.setRetData("1","主键已存在！");
        return;
    }
    //添加到数据库
    var insert = "insert into sys_mdm003(typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,createdt,updatedt) values  (?,?,?,?,?,?,?,?,?,?,?,?)";
    var dt = sys.currentTimeString();
    var params = [typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,dt,dt];
    var num=sql.update(insert, params);
    if(num == 1){
        sys.setRetData("0");
        return;
    }else{
        sys.setRetData("999");
        return;
    }
}
else if(table == "sys_pl_mdm004"){
    var dbtype = sys.request.dbtype;
    var class0 = sys.request.class;
    var sqltext = sys.request.sqltext;
    var status = sys.request.status;
    var mark = sys.request.mark;
    //判断不为空的字段
    if(dbtype == null || class0 == null || sqltext == null || status == null){
        sys.setRetData("1");
        return;
    }
    //判断主键是否重复
    var cnt = sql.query("select typecd from sys_pl_mdm004 where typecd=? and dbtype=? and class=?",[typecd,dbtype,class0],"prikey");
    if(cnt > 0){
        sys.setRetData("1","主键已存在！");
        return;
    }
    //添加到数据库
    var insert = "insert into sys_pl_mdm004(typecd,dbtype,class,sqltext,mark,status,createdt,updatedt) values  (?,?,?,?,?,?,?,?)";
    var dt = sys.currentTimeString();
    var params = [typecd,dbtype,class0,sqltext,mark,status,dt,dt];
    var num=sql.update(insert, params);
    if(num == 1){
        sys.setRetData("0");
        return;
    }else{
        sys.setRetData("999");
        return;
    }
}
else{
    //获取Insert模型ID
    sql.query("select modolcd from sys_bm002 where did=? and tablenm=? and isui='1' and sqltype='I'",["00000000000000000000000000000000",table],"modelcd_r");
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
    sql.query(_sql, [typecd,tableresult[0].version], "_children");
    var _children = sys.result._children;
    se.setCache(_CACHE_REGION_MDM_,org+":"+typecd, _children, 0);
}