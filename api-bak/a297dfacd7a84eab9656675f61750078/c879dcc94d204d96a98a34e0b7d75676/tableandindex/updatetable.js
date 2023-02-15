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
//id:updatetable
//name:根据模型更新物理表
var openid = sys.request.openid;
var org = sys.request.org;
var typecd = sys.request.typecd;  //模型编码
var did = sys.request.did;      //数据源id
var en = sys.request.en;        //要修改的表英文名称
var _en = sys.request._en;      //修改之前的表英文名称
var cn = sys.request.cn;        //要修改的表中文名称
var status = sys.request.status;
var mark = sys.request.mark;
var version = sys.request.version;

//提供扩展性
var retsql = sys.request.retsql;    //返回修改表SQL 1,0
var addsql = sys.request.addsql;    //添加SQL内容
if(status == null){
    status = "1";
}
if(typecd==null || did == null || en == null || _en == null){
    sys.setRetData("1");
    return;
}
var userid = sys.getUserIdByOpenId(openid);
var dt = sys.currentTimeString();
//表名不能以sys_开头
if(se.isPlatformOrg()){
}else{
    if(sys.startWith(sys.toLowerCase(en),"sys_")){
        sys.setRetData("1","表名不能以sys_开头！");
        return;
    }
}

if(sys.isNumber(sys.subStringTo(en,0,1))){
    sys.setRetData("1","表名不能以数字开头！");
    return;
}
//获取表注释
var tablecomment = "";

var getcomment = "select typenm from sys_md_mm001 where typecd=?";
sql.query(getcomment,[typecd],"tablecomment");
var tablec = sys.result.tablecomment;
if(sys.size(tablec)>0){
    tablecomment = tablec[0].typenm;
    if(mark != null){
        tablecomment = tablecomment + mark;
    }
}else{
    sys.setRetData("1");
    return;
}

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
// var dbschema = sys.result.dbinfo[0].en;   //数据库schema
var dbtype = sys.result.dbinfo[0].dbtype;    //数据库类型
//判断该模型对应did数据库是否存在此表
var check = "select typecd,did,en,cn,status,mark from sys_md_mm003 where typecd = ? and did=? and en=?";
var check_cnt = sql.query(check, [typecd,did,_en],"checktable");
if(check_cnt == 0){
    sys.setRetData("2","表不存在！");
    return;
}

//获取sql语句（检查表是否存在语句，更新表名语句）
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//检查表是否存在语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"07"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var strucsql=sys.result.sql0_r[0].sqltext; 
//更新表名语句
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"06"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var altable =sys.result.sql1_r[0].sqltext;
//更新表注释语句
var sql2_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"22"],"sql2_r");

var alt_tcomm = "";
if(sql2_cnt == 1){
    alt_tcomm = sys.result.sql2_r[0].sqltext;
    alt_tcomm = sys.replace(alt_tcomm,"p_tablenm",en);
    alt_tcomm = sys.replace(alt_tcomm,"p_comm","'"+tablecomment+"'");
}
//获取schema语句
var sql3_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"27"],"sql3_r");
if(sql3_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getSchemaSql=sys.result.sql3_r[0].sqltext; 

var iscatch=false,catchmsg="";
//连接外部数据源
var schema_name="";
if(did != "00000000000000000000000000000000"){
    iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常，请检查数据源配置");
        return;
    }
    //获取数据源schema
    var gss_cnt=se.query(getSchemaSql,null,"schema_r");
    if(gss_cnt==0){
        sys.setRetData("2","获取schema异常！");
        return;
    }
    schema_name=sys.result.schema_r[0].schema_name;
}else{
    schema_name=org;
    //平台db为oracle时
    if(se.dbType()=="03"){
        schema_name=sys.subStringTo(org,0,16);
    }
}
//判断要修改的表是否存在
if(se.query(strucsql,[schema_name,_en],"chek")==0){
    sys.setRetData("2","表不存在");
    return;
}

if(en != _en){
    //如果改表名了，判断表名是否重复
    var strucsql_cnt = se.query(strucsql,[schema_name,en],"chek",false);
    if(strucsql_cnt > 0){
        sys.setRetData("1","已存在此表，请更换表名");
        return;
    }
}
//修改物理表
altable = sys.replace(altable,"p_oldnm",schema_name+"."+_en);
//oracle时p_newnm不加schema
if(dbtype=="03"){
    altable = sys.replace(altable,"p_newnm",en);
}else{
    altable = sys.replace(altable,"p_newnm",schema_name+"."+en);
}
//如果retsql=="1"，则返回sql
if(retsql=="1"){
    sys.addRetData(altable,"result");
    sys.setRetData("0","","result");
    return;
}
//拼接自定义的sql
if(addsql!=null){
    altable=altable+" "+addsql;
}
try{
    //两个表名一样，且addsql为null，则不执行 修改表名sql
    if(en==_en&&addsql==null){
    }else{
        sql.update(altable,[],"1"); 
    }
}catch(e){
    iscatch=true;
    catchmsg=e.cause.message;
}
if(iscatch){
    sys.setRetData("2","SQL异常："+altable+" "+catchmsg);
    return;
}

//修改表注释
// sql.update(alt_tcomm,[],"1");
sql.commit();

//恢复连接
if(did != "00000000000000000000000000000000"){
    sql.connection();
}
//修改sys_md_mm003表中对应的记录
var upd003 = "update sys_md_mm003 set en = ?, cn=?, status = ?, mark=? where typecd=? and did=? and en=?";
var upd003_params = [en,cn,status,mark,typecd,did,_en];
sql.update(upd003,upd003_params);

//记录日志
var before_json={
    "typecd":typecd,
    "did":did,
    "en":sys.result.checktable[0].en,
    "cn":sys.result.checktable[0].cn,
    "status":sys.result.checktable[0].status,
    "mark":sys.result.checktable[0].mark,
    "version":sys.result.checktable[0].version
};
var after_json={
    "typecd":typecd,
    "did":did,
    "en":en,
    "cn":cn,
    "status":status,
    "mark":mark,
    "version":version
};
// sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","011","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json",sys.jsonFromInstance(after_json),"orgid",org);
var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
    "typecd":typecd,
    "operation_type":"00302",
    "before_json":sys.jsonFromInstance(before_json),
    "after_json":sys.jsonFromInstance(after_json)
});
if(log_res.data.ret!="0"){
    sys.setRetData(log_res.data.ret,log_res.data.msg);
    return;
}
//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});

sys.setRetData("0");