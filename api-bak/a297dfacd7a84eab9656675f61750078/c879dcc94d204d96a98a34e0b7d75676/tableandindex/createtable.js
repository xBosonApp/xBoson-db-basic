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
//id: createtable
//name: 根据模型创建物理表
var openid = sys.request.openid;
var org = sys.request.org;
var typecd = sys.request.typecd;  //模型编码
var did = sys.request.did;      //数据库id
var en = sys.request.en;        //要创建的表英文名称
var cn = sys.request.cn;        //要创建的表中文名称
var status = sys.request.status;
var mark = sys.request.mark;
var retsql = sys.request.retsql;    //只返回创建表语句，不创建表 [1,0] 
var addsql = sys.request.addsql;  //手写sql部分

var create_model = sys.request.create_model;  //是否同时创建操纵模型  [1,0]
var cerror;

if(status == null){
    status = "1";
}
//验证参数
if(typecd==null || did == null || en == null){
    sys.setRetData("1");
    return;
}
var userid = sys.getUserIdByOpenId(openid);
var dt = sys.currentTimeString();
//表名不能以sys_或数字开头
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
//判断数据源是否是平台
// var dbschema = "";   //数据库schema
var dbtype = "" ;   //数据库类型
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
// dbschema = sys.result.dbinfo[0].en;   //数据库schema
dbtype = sys.result.dbinfo[0].dbtype;    //数据库类型
//判断该模型对应did数据库是否存在此表
var check = "select typecd from sys_md_mm003 where typecd = ? and did=? and en=?";
var check_cnt = sql.query(check, [typecd,did,en],"checktable");
if(check_cnt != 0){
    sys.setRetData("2","表物理名称已存在！");
    return;
}
//创建数据表
//获取表注释
var tablecomment = "";
if(mark != null){
    tablecomment = mark;
}else{
    var getcomment = "select typenm from sys_md_mm001 where typecd=?";
    sql.query(getcomment,[typecd],"tablecomment");
    var tablec = sys.result.tablecomment;
    if(sys.size(tablec)>0){
        tablecomment = tablec[0].typenm;
    }else{
        sys.setRetData("1");
        return;
    }
}
//获取模型结构
var getmodal = "select sys_md_mm002.decd, sys_md_mm002.en, sys_md_mm002.cn,sys_md_mm002.mk,sys_md_mm002.must,sys_md_mm002.sorting,sys_md_mm002.dv,sys_mdm003.datatype,sys_mdm003.numrange from sys_md_mm002 ,sys_mdm003 where sys_md_mm002.decd = sys_mdm003.decd and sys_md_mm002.typecd=? and sys_md_mm002.status='1' and sys_mdm003.status='1' order by sys_md_mm002.sorting asc";
var getmodal_cnt = sql.query(getmodal,[typecd],"modal");
if(getmodal_cnt==0){
    sys.setRetData("2","typecd对应的模型结构表没有数据");
    return;
}
//从sys_mdm002获取数据类型
// var gettypes = "select dictcd id,dictnm name from sys_mdm002 where typecd=? and status='1'";
// sql.query(gettypes, ["ZR.0014"+dbtype+"2"], "typecache");
// var typecache = sys.result.typecache;
var typecache = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+dbtype+"2");
sys.printValue(_ORGID_PLATFORM_+":ZR.0014"+dbtype+"2");
var modal = sys.result.modal;
var str_arr = [];
var prikey = "";
for(r in modal){
    var _datatype = "";
    var is_null = "";
    var is_default = "";
    var is_comment = "";
    //检查数据类型
    if(sys.trim(r.datatype)==""){
        sys.setRetData("2",r.en+"列的数据类型为空！");
        return;
    }
    //转换数据类型
    for(d in typecache){
        if(d.id == r.datatype){
            _datatype = d.name;
        }
    }
    if(_datatype==""){
        sys.setRetData("2",r.datatype+"转换数据库类型时异常！");
        return;
    }
    
    //判断numrange是否为空
    if(sys.trim(r.numrange)==""){
        _datatype=_datatype;
    }else{
        //trim,numrange
        var numrange = sys.trim(r.numrange);
        if(sys.contain(numrange,",")){
            var numarr=sys.split(numrange,",");
            //判断数组numarr个数
            if(sys.size(numarr)==2 && sys.isNumber(numarr[0]) && sys.isNumber(numarr[1]) && sys.parseInt(numarr[0])>sys.parseInt(numarr[1])){
                _datatype=_datatype+"("+numarr[0]+","+numarr[1]+")";
            }else if(sys.size(numarr)==1 && sys.isNumber(numarr[0])){
                _datatype=_datatype+"("+numarr[0]+")";
            }else if(sys.size(numarr) == 0){
                _datatype=_datatype;
            }else{
                sys.setRetData("2",r.numrange+"格式错误！");
                return;
            }
        }else{
            //判断是否为数字
            if(sys.isNumber(sys.trim(r.numrange))){
                _datatype=_datatype+"("+sys.trim(r.numrange)+") ";
            }else{
                sys.setRetData("2",r.numrange+"格式错误！");
                return;
            }
        }
    }
    if(r.dv != ""){
        is_default="DEFAULT '"+r.dv+"' ";
    }
    if(r.must == "1"){
        is_null=" NOT NULL ";
    }else{
        is_null=" NULL ";
    }
    is_comment="'"+r.cn+"'";
    var _tmp = {"cname":r.en,"ctype":_datatype,"cdefault":is_default,"cnull":is_null,"comment":is_comment};
    list.add(str_arr,_tmp);
    //判断是否主键
    if(r.mk == "1"){
        prikey=prikey+r.en+",";
    }
}
//去除str和prikey最后一个逗号
// str=sys.subStringTo(str,0,sys.length(str)-1);
if(prikey != ""){
    prikey=sys.subStringTo(prikey,0,sys.length(prikey)-1);
}

// 07:判断表是否存在语句
// 21:创建表语句
// 22:创建表注释语句
// 23:创建列注释语句
// 27:获取数据源schema Sql语句
var createsql = "",
    checkTableExist = "",
    cre_t_comment = "",
    cre_c_comment = "",
    getSchemaSql = "";
//获取sql语句
if(true){
    var getSql = "select class,sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and status='1' and class in ('07','21','22','23','27')";

    sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype],"sql_r");
    
    for(r in sys.result.sql_r){
        if(r.class=="21"){
            createsql=r.sqltext;
        }
        else if(r.class=="07"){
            checkTableExist=r.sqltext;
        }
        else if(r.class=="22"){
            cre_t_comment=r.sqltext;
        }
        else if(r.class=="23"){
            cre_c_comment=r.sqltext;
        }
        else if(r.class=="27"){
            getSchemaSql=r.sqltext;
        }
    }
    
    if(createsql==""||checkTableExist==""||getSchemaSql==""){
       sys.setRetData("2","获取sql语句失败");
       return;
    }
}

//动态生成创建表语句
var str="";
var ctype_boolean = false;  //createsql语句是否存在p_ctype参数
var cdefault_boolean = false;   //createsql语句是否存在p_cdefault参数
var cnull_boolean = false;   //createsql语句是否存在p_cnull参数
var comment_boolean = false;   //createsql语句是否存在p_comment参数
var cre_column_comment = [];    //创建列注释语句
for(r in str_arr){
    //列名
    if(sys.contain(createsql,"p_cnm")){
        str=str+r.cname+" ";
    }else{
        sys.setRetData("2","sql语句：创建表语句有误！");
        return;
    }
    //列类型
    if(sys.contain(createsql,"p_ctype")){
        str=str+r.ctype+" ";
        ctype_boolean=true;
    }
    //列默认值
    if(sys.contain(createsql,"p_cdefault")){
        str=str+r.cdefault+" ";
        cdefault_boolean=true;
    }
    //列是否为null
    if(sys.contain(createsql,"p_cnull")){
        str=str+r.cnull+" ";
        cnull_boolean=true;
    }
    //列注释
    if(sys.contain(createsql,"p_comment")){
        str=str+" COMMENT "+r.comment+" ";
        comment_boolean=true;
    }
    str=str+",";
    
    //创建列注释
    if(cre_c_comment != ""){
        var _tmp = cre_c_comment;
        _tmp = sys.replace(_tmp,"p_tnm",en);
        _tmp = sys.replace(_tmp,"p_cnm",r.cname);
        _tmp = sys.replace(_tmp,"p_comm",r.comment);
        list.add(cre_column_comment,_tmp);
    }
}
str=sys.subStringTo(str,0,sys.length(str)-1);

createsql=sys.replace(createsql,"p_tablenm",en);
createsql=sys.replace(createsql,"p_cnm",str);

if(ctype_boolean){
    createsql=sys.replace(createsql,"p_ctype","");
}
if(cdefault_boolean){
    createsql=sys.replace(createsql,"p_cdefault","");
}
if(cnull_boolean){
    createsql=sys.replace(createsql,"p_cnull","");
}
if(comment_boolean){
    createsql=sys.replace(createsql,"p_comment","");
}
//主键字段
if(sys.contain(createsql,"p_pkfields")){
    if(prikey!=""){
        createsql=sys.replace(createsql,"p_pkfields",",primary key ("+prikey+")");
    }else{
        createsql=sys.replace(createsql,"p_pkfields","");
    }
}
//表注释
if(sys.contain(createsql,"p_tcomment")){
    createsql=sys.replace(createsql,"p_tcomment","'"+tablecomment+"'");
}
//创建表注释
if(cre_t_comment != ""){
    cre_t_comment = sys.replace(cre_t_comment,"p_tablenm",en);
    cre_t_comment = sys.replace(cre_t_comment,"p_comm","'"+tablecomment+"'");
}
//获取数据库连接(如果在本地库，则不需要连接数据源)
var schema_name="";
if(did != "00000000000000000000000000000000"){
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常，请检查数据源配置");
        return;
    }
    //获取外部数据源schema
    var gss_cnt=se.query(getSchemaSql, null, "schema_r");
    if(gss_cnt==0){
        sys.setRetData("2","获取schema异常！");
        return;
    }
    schema_name=sys.result.schema_r[0].schema_name;
}else{
    schema_name=org;
}
var iscatch=false;
try{
    //判断表是否存在
    if(se.query(checkTableExist,[schema_name,en],"checkTableExist",false)>0){
        sys.setRetData("20","表物理名称对应的物理表已存在！");
        return;
    }
    
    //返回创建表语句
    if(retsql=="1"){
        sys.addRetData(createsql,"result");
        sys.setRetData("0","","result");
        return;
    }
    
    if(addsql!=null){
        createsql=createsql+" "+addsql;
    }
    //创建表
    sql.update(createsql,[],"1");
    //创建表和列注释
    if(sys.size(cre_column_comment)>0){
        for(r in cre_column_comment){
            sql.update(r,[],"1");
        }
    }
    if(cre_t_comment != ""){
        sql.update(cre_t_comment,[],"1");
    }
    sql.commit();
    //恢复数据连接
    if(did != "00000000000000000000000000000000"){
        sql.connection();
    }
    
    //向sys_md_mm003中插入一条数据
    var insert003 = "insert into sys_md_mm003 (typecd,did,en,cn,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
    var insertparams = [typecd,did,en,cn,status,mark,dt,dt];
    sql.update(insert003,insertparams);
    
    //记录日志
    var after_json={
        "typecd":typecd,
        "did":did,
        "en":en,
        "cn":cn,
        "status":status,
        "mark":mark
    };
    // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","010","userid",userid,"createdt",dt,"before_json","","after_json",sys.jsonFromInstance(after_json),"orgid",org);
    var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
        "typecd":typecd,
        "operation_type":"00301",
        "before_json":"",
        "after_json":sys.jsonFromInstance(after_json)
    });
    if(log_res.data.ret!="0"){
        sys.setRetData(log_res.data.ret,log_res.data.msg);
        return;
    }
    
    //操作数据集日志
    http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
    sys.setRetData("0");
}catch(e){
    iscatch=true;
    cerror = e;
    throw e;
}
if(iscatch){
    sys.setRetData("2","执行创建表语句失败，请检查参数！"+ cerror.message);
    return;
}

// //创建默认操纵模型
// if(create_model=="1"){
//     try{
//         var res=http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"dmlm","api":"generate_default"},{
//         "typecd":typecd,
//         "did":did,
//         "en":en
//       });
//         if(res.data.ret!="0"){
//             sys.setRetData("2","生成默认操纵模型失败!"+res.data.msg);
//         }
//     }catch(e){
//         sys.setRetData("2","生成默认操纵模型失败!");
//     }
// }