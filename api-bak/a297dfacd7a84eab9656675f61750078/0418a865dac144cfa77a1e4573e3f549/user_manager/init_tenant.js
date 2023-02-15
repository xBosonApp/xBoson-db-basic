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
//id:init_tenant
//name:初始化租户

var presetid=sys.request.presetid;  //预设id
var orgid=sys.request.orgid;    //租户ID
var flag=sys.request.flag;      //1：强制初始化

if(presetid==null || orgid==null ){
    sys.setRetData("1");
    return;
}
sql.connection("00000000000000000000000000000000");
//判断orgid是否存在
var checkOrgid="select a.orgid from mdm_org a,sys_tenant b where a.orgid=b.orgid and a.orgid=? and a.status='1' and b.status='1'";
var checkOrgid_cnt=sql.query(checkOrgid,[orgid],"checkorgid_r");
if(checkOrgid_cnt==0){
    sys.setRetData("2","租户状态为无效，或不存在");
    return;
}
//获取数据库类型
var getinfo = "select dbtype from sys_pl_drm_ds001 where did='00000000000000000000000000000000' ";
var getinfo_cnt = sql.query(getinfo,[],"dbinfo");
if(getinfo_cnt==0){
    sys.setRetData("2");
    return;
}
var dbtype = sys.result.dbinfo[0].dbtype;    //数据库类型
//获取Sql语句(创建数据库，删除数据库)
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//创建数据库语句
var getCreDBSql_cnt=sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"25"],"credbsql_r");
if(getCreDBSql_cnt==0){
    sys.setRetData("2","获取sql语句（创建数据库）失败");
    return;
}
var credbsql=sys.result.credbsql_r[0].sqltext;
credbsql=sys.replace(credbsql,"p_dbnm",orgid);
//删除数据库语句
var getDelDBSql_cnt=sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"26"],"deldbsql_r");
if(getDelDBSql_cnt==0){
    sys.setRetData("2","获取sql语句（删除数据库）失败");
    return;
}
var deldbsql=sys.result.deldbsql_r[0].sqltext;
deldbsql=sys.replace(deldbsql,"p_dbnm",orgid);
//检查schema是否存在语句
getDelDBSql_cnt=sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"28"],"chkdbsql_r");
if(getDelDBSql_cnt==0){
    sys.setRetData("2","获取sql语句（检查数据库是否存在）失败");
    return;
}
var chkdbsql=sys.result.chkdbsql_r[0].sqltext;
//强制初始化
if(flag=="1"){
//     sys.setRetData("1","此机构暂时不允许重置");
//     return;
    // if(orgid=="a297dfacd7a84eab9656675f61750078" || orgid=="a084b36beb854dc5b78fdc2cfed084ff" || orgid=="bcae0467a8e740569eb985bc7fac2742" || orgid=="ca6991bd260c447bb5b9f12d07a803fd" || orgid=="f6f4cbfd4e3340249ef1db13dbfe5b23" || orgid=="b63ff18bcca54a099a230c5b433ba239" || orgid=="d44d49360c224b828edd792c34456fd5"){
    //     sys.setRetData("1","此机构暂时不允许重置");
    //     return;
    // }else{
        getDelDBSql_cnt=se.query(chkdbsql,[orgid]);
        if(getDelDBSql_cnt>0){
            sql.update(deldbsql,[],"1");
        }
    // }
}

//创建数据库
    
    //执行创建数据库
sql.update(credbsql,[]);

sql.update("update sys_tenant set init_db=?,presetid=? where orgid=?",["1",presetid,orgid]);

//获取预设表(sys_pl_init_tbl)
var getPreTbl="select a.presetid,a.sorting,a.typecd,a.did,a.en,b.typenm from sys_pl_init_tbl a,sys_md_mm001 b where a.presetid=? and a.typecd=b.typecd and a.status='1' and b.status='1'";
sql.query(getPreTbl,[presetid],"pretbl_r");
var pretbl_r=sys.result.pretbl_r;

var typecd_str="(";     //typecd in条件
var sorting_str="(";    //sorting in条件
for(r in pretbl_r){
    typecd_str=typecd_str+"'"+r.typecd+"',";
    sorting_str=sorting_str+r.sorting+",";
}
typecd_str=sys.subStringTo(typecd_str,0,sys.length(typecd_str)-1);
sorting_str=sys.subStringTo(sorting_str,0,sys.length(sorting_str)-1);
typecd_str=typecd_str+")";
sorting_str=sorting_str+")";
//获取预设表列信息(sys_md_mm002,sys_mdm003)
var getTblFields = "select ds.typecd,ds.en,ds.cn,ds.must,ds.mk,ds.dv,ds.sorting,de.datatype,de.numrange from sys_md_mm002 ds,sys_mdm003 de where ds.typecd in "+typecd_str+"  and ds.decd=de.decd and ds.status='1' and de.status='1' order by ds.typecd,ds.sorting asc";

sql.query(getTblFields,[],"tblfields");
var tblfields=sys.result.tblfields;
//获取预设表索引信息（sys_md_mm004）
var getTblIndexs="select typecd,en,fields from sys_md_mm004 where typecd in "+typecd_str+"  and status='1'";
sql.query(getTblIndexs,[],"tbindexs");
var tbindexs = sys.result.tbindexs;
//获取预设表的预设数据（sys_pl_init_data）
var getTbData="select * from sys_pl_init_data where presetid=? and sorting in "+sorting_str+"  and status='1'";
sql.query(getTbData,[presetid],"tbdata");
var tbdata = sys.result.tbdata;
//生成数组result [ [{tblnm(表中文名):'',tblen(表英文名):'',en(列名):'',cn(列中文名):'',must(必填):'',mk(主键):'',dv(默认值):'',datatype(数据类型):'',pdatatype(平台数据类型):'',comment(列的注释):'',mk_str(表的所有主键字符串):''，indexs(表的索引):[{name(索引名):'',content(索引内容):''},{}]} ,{} ,{}], [],[] ]
var result=[];  //用来存放所有表的所有列信息及所有索引信息
var data=[];    //用来存放预设表数据

//从sys_mdm002获取数据类型
// var gettypes = "select dictcd id,dictnm name from sys_mdm002 where typecd=? and status='1'";
// sql.query(gettypes, ["ZR.0014"+dbtype+"2"], "typecache");
// var typecache = sys.result.typecache;
var typecache = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+dbtype+"2");
var typetranscache = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.004101");
//循环所有预设表
for(r in pretbl_r){
    var tmp_arr=[];     //存放一个表的所有列信息
    var prikey="";      //存放一个表的主键字段(以逗号分隔形式)
    var prikey_arr=[];  //存放一个表的主键字段(以数组形式)
    var index_cont=[];  //存放一个表的索引信息
    
    //insert into xxx (column_fields) values (?,?,?...(value_fields))   参数：column_value
    //select * from xxx where prikey_fields 
    var column_fields="";
    var value_fields="";
    var column_value=[];
    var prikey_fields="";
    
    
    
    //循环所有预设表对应的所有模型的所有列信息
    for(f in tblfields){
        if(r.typecd==f.typecd){
            //转换数据类型
            var _datatype="";
            for(t in typecache){
                if(t.id==f.datatype){
                    _datatype=t.name;
                }
            }
            if(_datatype==""){
                sys.setRetData("2",r.typenm+"模型中的"+f.en+"字段的数据类型转换后为空");
                return;
            }
            //判断numrange是否为空
            if(sys.trim(f.numrange)==""){
                _datatype=_datatype;
            }else{
                //trim,numrange
                var numrange = sys.trim(f.numrange);
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
                        sys.setRetData("2",f.numrange+"格式错误！");
                        return;
                    }
                }else{
                    //判断是否为数字
                    if(sys.isNumber(sys.trim(f.numrange))){
                        _datatype=_datatype+"("+sys.trim(f.numrange)+") ";
                    }else{
                        sys.setRetData("2",f.numrange+"格式错误！");
                        return;
                    }
                }
            }
            var is_default="";
            var is_null="";
            var is_comment="";
            if(f.dv != ""){
                is_default="DEFAULT '"+f.dv+"' ";
            }
            if(f.must == "1"){
                is_null=" NOT NULL ";
            }else{
                is_null=" NULL ";
            }
            is_comment="'"+f.cn+"'";
            
            var tmp_map={"tblnm":r.typenm,"tblen":r.en,"en":f.en,"cn":f.cn,"must":is_null,"mk":f.mk,"dv":is_default,"datatype":_datatype,"pdatatype":f.datatype,"comment":is_comment};
            
            list.add(tmp_arr,tmp_map);
            //判断是否主键
            if(f.mk == "1"){
                prikey=prikey+f.en+",";
                list.add(prikey_arr,{"en":f.en,"datatype":f.datatype,"numrange":f.numrange});
            }
        }
    }
    
    //循环所有表索引信息
    for(idx in tbindexs){
        if(idx.typecd==r.typecd){
            var tmp_idxmap={"name":idx.en,"content":idx.fields};
            list.add(index_cont,tmp_idxmap);
        }
    }
    
    if(prikey != ""){
        prikey=sys.subStringTo(prikey,0,sys.length(prikey)-1);
        prikey_fields=sys.replace(prikey,",","=? and ");
        prikey_fields=prikey_fields+"=?";
    }
    for(ta in tmp_arr){
        map.put(ta,"mk_str",prikey);
        map.put(ta,"indexs",index_cont);
        column_fields=column_fields+ta.en+",";
        value_fields=value_fields+"?,";
    }
    
    column_fields=sys.subStringTo(column_fields,0,sys.length(column_fields)-1);
    value_fields=sys.subStringTo(value_fields,0,sys.length(value_fields)-1);
    
    //循环预设表里的数据
    var getdata="select * from "+r.en+" where "+prikey_fields;
    for(td in tbdata){
        var prikey_value=[];
        if(r.presetid==td.presetid && r.sorting==td.sorting ){
            var temp=[];
            var pk_num=sys.size(prikey_arr);
            sys.printValue(pk_num);
            var co_num=sys.size(tmp_arr);
            if(pk_num>0){
                for(var i=0;i<pk_num;i++){
                    var tmp_en="en";
                    var tmp_value;
                    if(i<10){
                        tmp_en=tmp_en+"0"+i;
                    }else{
                        tmp_en+i;
                    }
                    //数据类型是decimal的把参数类型转为double
                    var tmp_datatype=prikey_arr[i].datatype;
                    var tmp_numrange=prikey_arr[i].numrange;
                    var tmp_datatypenm="";
                    for(_tmp_tcache in typetranscache){
                        if(_tmp_tcache.id==tmp_datatype){
                            tmp_datatypenm=_tmp_tcache.name;
                        }
                    }
                    if(tmp_datatypenm=="Double"){
                        if(sys.contain(tmp_numrange,",")){
                            tmp_value=sys.parseDouble(td[tmp_en]);
                        }else{
                            tmp_value=sys.parseInt(td[tmp_en]);
                        }
                    }else{
                        tmp_value=td[tmp_en];
                    }
                    list.add(prikey_value,tmp_value);
                }
                var getdata_cnt=sql.query(getdata,prikey_value,"getdata_r");
                if(getdata_cnt==0){
                    sys.setRetData("2","获取预设表（"+r.en+"）数据异常 sql:"+getdata+" , 参数:"+prikey_value);
                    return;
                }
                var getdata_r=sys.result.getdata_r[0];
                for(ta in tmp_arr){
                    //数据类型是decimal的把参数类型转为double
                    var _ttcnm="";
                    for(_ttc in typetranscache){
                        if(_ttc.id==ta.pdatatype){
                            _ttcnm=_ttc.name;
                        }
                    }
                    if(_ttcnm=="Double"){
                        if(getdata_r[ta.en]==""){
                            list.add(temp,null);
                        }else{
                            list.add(temp,sys.parseDouble(getdata_r[ta.en]));
                        }
                    }else{
                        list.add(temp,getdata_r[ta.en]);
                    }
                }
            }else{
                for(var i=0;i<co_num;i++){
                    var tmp_en="en";
                    if(i<10){
                        tmp_en=tmp_en+"0"+i;
                    }else{
                        tmp_en+i;
                    }
                    for(ta in tmp_arr){
                        //数据类型是decimal的把参数类型转为double
                        var _ttcnm="";
                        for(_ttc in typetranscache){
                            if(_ttc.id==ta.pdatatype){
                                _ttcnm=_ttc.name;
                            }
                        }
                        if(_ttcnm=="Double"){
                            if(td[tmp_en]==""){
                                list.add(temp,null);
                            }else{
                                list.add(temp,sys.parseDouble(td[tmp_en]));
                            }
                        }else{
                            list.add(temp,td[tmp_en]);
                        }
                    }
                    list.add(temp,td[tmp_en]);
                }
            }
            list.add(column_value,temp);
        }
    }
    var insql="insert into "+orgid+"."+r.en+" ("+column_fields+") values ("+value_fields+")";
    var data_map={"insql":insql,"batch_params":column_value};
    list.add(data,data_map);
    list.add(result,tmp_arr);
}

//获取sql语句
//创建表语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"21"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句(创建表)失败");
    return;
}
var cre_tb_sql = sys.result.sql0_r[0].sqltext;
//判断表是否存在语句
var sql1_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"07"],"sql1_r");
if(sql1_cnt == 0){
    sys.setRetData("2","获取sql语句（判断表是否存在）失败");
    return;
}
var checkTableExist = sys.result.sql1_r[0].sqltext;
//创建表注释语句
var sql2_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"22"],"sql2_r");
var cre_t_comment = "";
if(sql2_cnt == 1){
    cre_t_comment = sys.result.sql2_r[0].sqltext;
}
//创建列注释语句
var sql3_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"23"],"sql3_r");
var cre_c_comment = "";
if(sql3_cnt == 1){
    cre_c_comment = sys.result.sql3_r[0].sqltext;
}
//创建索引语句
var sql4_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"09"],"sql4_r");
if(sql4_cnt == 0){
    sys.setRetData("2","获取sql语句（创建索引）失败");
    return;
}
var creIndex = sys.result.sql4_r[0].sqltext;

//循环result创建表
for(tblInfo in result){
    var createsql = cre_tb_sql;
    //动态生成创建表语句
    var str="";
    var ctype_boolean = false;  //createsql语句是否存在p_ctype参数
    var cdefault_boolean = false;   //createsql语句是否存在p_cdefault参数
    var cnull_boolean = false;   //createsql语句是否存在p_cnull参数
    var comment_boolean = false;   //createsql语句是否存在p_comment参数
    var cre_column_comment = [];    //创建列注释语句
    var indexinfo_arr=[];           //一个表的索引信息
    var cre_index = [];             //创建索引语句
    
    var prikey="";
    var tblnm="";
    var tblen="";
    for(r in tblInfo){
        prikey=r.mk_str;
        tblnm=r.tblnm;
        tblen=r.tblen;
        indexinfo_arr=r.indexs;
        //列名
        if(sys.contain(createsql,"p_cnm")){
            str=str+r.en+" ";
        }else{
            sys.setRetData("2","sql语句：创建表语句有误！");
            return;
        }
        //列类型
        if(sys.contain(createsql,"p_ctype")){
            str=str+r.datatype+" ";
            ctype_boolean=true;
        }
        //列默认值
        if(sys.contain(createsql,"p_cdefault")){
            str=str+r.dv+" ";
            cdefault_boolean=true;
        }
        //列是否为null
        if(sys.contain(createsql,"p_cnull")){
            str=str+r.must+" ";
            cnull_boolean=true;
        }
        //列注释
        if(sys.contain(createsql,"p_comment")){
            str=str+" COMMENT "+r.comment+" ";
            comment_boolean=true;
        }
        str=str+",";
        
        //创建列注释语句
        if(cre_c_comment != ""){
            var _tmp = cre_c_comment;
            _tmp = sys.replace(_tmp,"p_tnm",orgid+"."+r.tblen);
            _tmp = sys.replace(_tmp,"p_cnm",r.en);
            _tmp = sys.replace(_tmp,"p_comm",r.comment);
            list.add(cre_column_comment,_tmp);
        }
    }
    str=sys.subStringTo(str,0,sys.length(str)-1);
    
    createsql=sys.replace(createsql,"p_tablenm",orgid+"."+tblen);
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
    //表注释（数组）
    if(sys.contain(createsql,"p_tcomment")){
        createsql=sys.replace(createsql,"p_tcomment","'"+tblnm+"'");
    }
    //创建表注释语句
    if(cre_t_comment != ""){
        cre_t_comment = sys.replace(cre_t_comment,"p_tablenm",orgid+"."+tblen);
        cre_t_comment = sys.replace(cre_t_comment,"p_comm","'"+tblnm+"'");
    }
    //创建索引语句(数组)
    for(idx in indexinfo_arr){
        var tmp_creIndex = creIndex;
        tmp_creIndex=sys.replace(tmp_creIndex,"p_idname",idx.name);
        tmp_creIndex=sys.replace(tmp_creIndex,"p_tname",orgid+"."+tblen);
        tmp_creIndex=sys.replace(tmp_creIndex,"p_fields",idx.content);
        list.add(cre_index,tmp_creIndex);
    }
    

    //mysql use 语法
    // sql.update("use " + orgid,[]);
    //判断表是否存在
    var checkTableExist_cnt = sql.query(checkTableExist,[orgid,tblen],"checkTableExist");
    if(checkTableExist_cnt>0){
        sys.setRetData("2",tblen+" 物理表已存在！");
        return;
    }
    
    
    //创建表
    sql.update(createsql,[],"1");
    //创建表注释和列注释
    for(r in cre_column_comment){
        sql.update(r,[],"1");
    }
    if(cre_t_comment != ""){
        sql.update(cre_t_comment,[],"1");
    }
    //创建索引
    for(r in cre_index){
        sql.update(r,[],"1");
    }
    
}
//向表中添加预设数据
    for(d in data){
        // sys.printValue(d.insql,d.batch_params);
        sql.updateBatch(d.insql,d.batch_params,"1");
    }

sql.commit();
//调接口初始化或重置租户管理员
//var msg=sys.httpGet(null,"0418a865dac144cfa77a1e4573e3f549","user_manager","init_tenant_insert_pl_data",
//  "orgid",orgid,"s","d");
var msg = http.platformGet({
  "app":"0418a865dac144cfa77a1e4573e3f549",
  "mod":"user_manager","api":"init_tenant_insert_pl_data"},
  {"orgid":orgid, "s":"d"});
  
sys.printValue(msg);
if(msg.data.ret != "0"){
    sys.setRetData("1","初始化租户管理员异常");
    return;
}
//调接口清除机构在平台的数据
//msg=sys.httpGet(null,"0418a865dac144cfa77a1e4573e3f549","user_manager","cleardata","orgid",orgid,"s","d");
var msg = http.platformGet({
  "app":"0418a865dac144cfa77a1e4573e3f549",
  "mod":"user_manager","api":"cleardata"},
  {"orgid":orgid, "s":"d"});

sys.printValue(msg);
if(msg.data.ret != "0"){
    sys.setRetData("1","清除机构在平台的数据异常");
    return;
}

// (x) 调接口创建机构文件夹
// var uri=se.getCache(_CACHE_REGION_TP_APP_,"dfe437babe4c44e08bf2634aeff97cc9").uri;
// msg=sys.httpGet(uri,null,null,"neworg","orgid",orgid,"s","d");
// sys.printValue(msg);
// if(msg.ret != 0 && msg.ret != 10){
//     sys.setRetData("1","创建机构文件夹异常，请确认平台NODE服务地址是否正确");
//     return;
// }

// 创建机构文件夹
var uifs = require('fs').open();
uifs.makeDir("/t/saas/" + orgid);

//缓存开发商或租户
{
    var tenants = se.getCache(_CACHE_REGION_SYS_SQL_,"tenant0001");
    sql.query(tenants,[],"alltenants");
    var alltenants = sys.result.alltenants;
    var initializeOrgs = [];
    var initVendor = [];  //缓存开发商 机构id
    for(r in alltenants){
        //选出初始化db的机构
        if(r.init_db=="1"){
            list.add(initializeOrgs,r.orgid);
            //选出类型为开发商的机构
            if(r.org_type=="v"){
                list.add(initVendor,r.orgid);
            }
        }
    }
    se.setCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_,initializeOrgs,0);   //所有机构
    se.setCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_V_,initVendor,0);     //开发商
}
    //返回flag
sys.addRetData([{"flag":"1"}],"result");
sys.setRetData("0","","result");