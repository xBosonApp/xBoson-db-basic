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
var typecd = sys.request.typecd;
if(typecd == null){
    sys.setRetData("1");
    return;
}
//获取数据库表名称
var gettable = "select version,datatable from sys_mdm001 where typecd = ?";
var cnt = sql.query(gettable, [typecd], "tableresult");
var tableresult = sys.result.tableresult;

if(cnt == 0){
    sys.setRetData("2");
    return;
}
var table = tableresult[0].datatable;
if(sys.trim(table) == ""){
    sys.setRetData("2","根据typecd查出的datatable为空！");
    return;
}

//修改数据（暂时写固定数据）
if(table == "sys_mdm002"){
    var version = sys.request.version;
    var _version = sys.request._version;
    var dictcd = sys.request.dictcd;
    var _dictcd = sys.request._dictcd;
    var dictnm = sys.request.dictnm;
    var shortkey = sys.request.shortkey;
    var status = sys.request.status;
    var mark = sys.request.mark;
    //判断不为空的字段
    if(version == null || _version == null || _dictcd == null || dictcd == null || dictnm == null || status == null){
        sys.setRetData("1", "version,_version,_dictcd,dictcd,dictnm,status不可为空");
        return;
    }
    if(shortkey == null){
        shortkey = sys.getPinyinFirstLetter(dictnm);
    }
    //判断修改前的字典是否存在
    if(sql.query("select typecd,version,dictcd,dictnm,shortkey,mark,status from sys_mdm002 where typecd=? and dictcd=? and version=?",[typecd,_dictcd,_version],"oldR")==0){
        sys.setRetData("2","此字典不存在！");
        return;
    }
    var oldR=sys.result.oldR;
    //判断修改后的字典是否存在
    if(dictcd!=_dictcd){
        var _cnt = sql.query("select typecd from sys_mdm002 where typecd = ? and dictcd = ? and version=?", [typecd, dictcd, version], "prikey");
     
        if(_cnt != 0){
            sys.setRetData("1","主键已存在！");
            return;
        }
    }
    
    //修改
    var setdata = "update sys_mdm002 set version=?,dictcd=?,dictnm=?,shortkey=?,status=?,mark=?,updatedt=? where typecd=? and dictcd=? and version=?";
    var dt = sys.currentTimeString();
    var params = [version,dictcd,dictnm,shortkey,status,mark,dt,typecd,_dictcd,_version];
    var num = sql.update(setdata, params,"1");
    if(num == 0){
        sys.setRetData("1","dictcd,version已存在");
        return;
    }
    //记录日志
    var before_json={
        "typecd":typecd,
        "version":_version,
        "dictcd":_dictcd,
        "dictnm":oldR[0].dictnm,
        "shortkey":oldR[0].shortkey,
        "mark":oldR[0].mark,
        "status":oldR[0].status
    };
    var after_json={
        "typecd":typecd,
        "version":version,
        "dictcd":dictcd,
        "dictnm":dictnm,
        "shortkey":shortkey,
        "status":status,
        "mark":mark
    };
    var change_fields=[];
    
    if(before_json.dictcd!=(dictcd==null?"":dictcd)){
        list.add(change_fields,"dictcd");
    }
    if(before_json.dictnm!=(dictnm==null?"":dictnm)){
        list.add(change_fields,"dictnm");
    }
    if(before_json.version!=(version==null?"":version)){
        list.add(change_fields,"version");
    }
    if(before_json.shortkey!=(shortkey==null?"":shortkey)){
        list.add(change_fields,"shortkey");
    }
    if(before_json.status!=(status==null?"":status)){
        list.add(change_fields,"status");
    }
    if(before_json.mark!=(mark==null?"":mark)){
        list.add(change_fields,"mark");
    }
    if(sys.size(change_fields)==0){
        sql.rollback();
        sys.setRetData("无修改字段");
        return;
    }
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
    sql.commit();
    sys.setRetData("0");
}
else if(table == "sys_pl_mdm004"){
    var dbtype = sys.request.dbtype;
    var _dbtype = sys.request._dbtype;
    var class0 = sys.request.class;
    var _class = sys.request._class;
    var sqltext = sys.request.sqltext;
    var status = sys.request.status;
    var mark = sys.request.mark;
    //判断不为空的字段
    if(_dbtype == null || dbtype == null || _class==null || class0 == null || sqltext == null || status == null){
        sys.setRetData("1");
        return;
    }
    if(dbtype!=_dbtype || class0!= _class){
        //判断主键是否重复
        var _cnt = sql.query("select typecd from sys_pl_mdm004 where typecd=? and dbtype=? and class=?",[typecd,dbtype,class0],"prikey");
        if(_cnt != 0){
            sys.setRetData("1","主键已存在！");
            return;
        }
    }
     
    //修改
    var setdata = "update sys_pl_mdm004 set dbtype=?,class=?,sqltext=?,status=?,mark=?,updatedt=? where typecd=? and dbtype=? and class=?";
    var dt = sys.currentTimeString();
    var params = [dbtype,class0,sqltext,status,mark,dt,typecd,_dbtype,_class];
    var num = sql.update(setdata, params);
    if(num == 0){
        sys.setRetData("1","dbtype,class已存在");
        return;
    }
    sys.setRetData("0");
    return;
}
else{
    //获取Insert模型ID
    sql.query("select modolcd from sys_bm002 where did=? and tablenm=? and isui='1' and sqltype='U'",["00000000000000000000000000000000",table],"modelcd_r");
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
    // sys.printValue(sys.size(sys.bytes(sys.jsonFromInstance(_children),null)));
    // sys.printValue(org+":"+typecd);
    // sys.printValue(_children);
    se.setCache(_CACHE_REGION_MDM_, org+":"+typecd, _children, 0);
}