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
//id:deletetable
//name:删除指定物理表
var openid = sys.request.openid;
var org = sys.request.org;
var typecd = sys.request.typecd;
var did = sys.request.did;
var en = sys.request.en;

//验证参数
if(typecd == null || did==null ||en==null){
    sys.setRetData("1");
    return;
}
if(sys.startWith(sys.toLowerCase(en),"sys_") || sys.startWith(sys.toLowerCase(en),"mdm_")){
    var adminFlag = sys.getUserAdminFlag();
    if(adminFlag!='1'){
        sys.setRetData("1","sys_,mdm_开头的表暂不允许删除");
        return;
    }
}
var userid = sys.getUserIdByOpenId(openid);
//验证表是否存在
var check = "select typecd,did,en,cn,mark,status from sys_md_mm003 where typecd=? and did=? and en=?";
var check_cnt = sql.query(check,[typecd,did,en],"check");
if(check_cnt == 0){
    sys.setRetData("1","表不存在");
    return;
}
//获取数据源id对应的数据库物理名称和数据库类型
//获取数据库类型等
var getinfo = "select dbtype from sys_pl_drm_ds001 where did=? ";
var getinfo_params = [did];
if(did != "00000000000000000000000000000000"){
    getinfo = getinfo + " and owner=? and status='1'";
    list.add(getinfo_params,org);
}
var getinfo_cnt = sql.query(getinfo,getinfo_params,"dbinfo");
if(getinfo_cnt==0){
    sys.setRetData("2");
    return;
}
var endbtype = sys.result.dbinfo;
// var dbschema = endbtype[0].en;      //数据源schema
var dbtype = endbtype[0].dbtype;    //数据源数据库类型

//获取sql语句（检查表是否存在语句）
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//检查表是否存在语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"07"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
//删除表语句
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"20"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
//获取当前schema语句
var sql2_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql2_r");
if(sql2_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var selSql = sys.result.sql0_r[0].sqltext; //检查表是否存在语句
var delSql = sys.result.sql1_r[0].sqltext;  //删除表语句
var getschema = sys.result.sql2_r[0].sqltext;   //当前schema语句


//连接外部数据源
var schema_name="";
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
    //获取外部数据源schema
    var getschema_cnt=se.query(getschema,null,"schemanm_r");
    if(getschema_cnt==0){
        sys.setRetData("1","获取schema异常");
        return;
    }
    schema_name=sys.result.schemanm_r[0].schema_name;
}else{
    schema_name=org;
}
var _cnt = se.query(selSql,[schema_name,en],"result",false);
if(_cnt == 0){
    // sys.setRetData("1","表不存在");
    // return;
}else{
    //物理表存在则删除表
    delSql=sys.replace(delSql,"p_tablenm",schema_name+"."+en);
    sql.update(delSql,[]);
}
//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}
//删除sys_md_mm003表中对应的记录
var del003 = "delete from sys_md_mm003 where typecd=? and did=? and en = ?";
sql.update(del003,[typecd,did,en]);
//调接口删除操纵模型
var res=http.platformGet({
    "app":"c770045becc04c7583f626faacd3b456",
    "mod":"dmlm",
    "api":"delbm002_bytable"
  },{
    "did":did,
    "table_name":en
  });
if(res.data.ret!="0"){
    sys.setRetData("2","删除操纵模型失败!"+res.data.msg);
    return;
}
        

//记录日志
// var dt=sys.currentTimeString();
var before_json={
    "typecd":typecd,
    "did":did,
    "en":en,
    "cn":sys.result.check[0].cn,
    "mark":sys.result.check[0].mark,
    "status":sys.result.check[0].status
};
// sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","012","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json","","orgid",org);
var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
    "typecd":typecd,
    "operation_type":"00303",
    "before_json":sys.jsonFromInstance(before_json),
    "after_json":""
});
if(log_res.data.ret!="0"){
    sys.setRetData(log_res.data.ret,log_res.data.msg);
    return;
}

//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});

sys.setRetData("0");