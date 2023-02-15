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
//id: creatededs
//name: 创建数据集数据元

var org = sys.request.org;

var dedir = sys.request.dedir;  //数据元目录
var dsdir = sys.request.dsdir;  //数据集目录

var decd0 = sys.request.decd0;  //数据元编码业务大类
var decd1 = sys.request.decd1;  //数据元编码业务小类

var did = sys.request.did;
var table_schema = sys.request.table_schema;
var table_name = sys.request.table_name;

var column = sys.request.column;    //要添加数据元数据集的列名（以逗号分隔的字符串）

var is_cre_ds = sys.request.is_cre_ds;  //是否同时创建数据集（1，0）
// is_cre_ds = "1";  //始终创建数据集

var is_cre_tbl_link = sys.request.is_cre_tbl_link;  //是否同时创建表映射（1,0）

var dt = "";
//验证必需参数
if(dedir == null || did == null || table_schema == null || table_name == null || column == null){
    sys.setRetData("1");
    return;
}
//如果同时创建数据集，验证必需参数
if(is_cre_ds=="1" && dsdir == null){
    sys.setRetData("1");
    return;
}
var column_arr = sys.split(column,",");
//检查dedir，dsdir参数
// if(!sys.startWith(sys.toLowerCase(dedir),"de.")){
//     sys.setRetData("2","dedir参数格式错误");
//     return;
// }
// if(!sys.startWith(sys.toLowerCase(dsdir),"ds.")){
//     sys.setRetData("2","dsdir参数格式错误");
//     return;
// }
// //验证decd1为两位数字
if(sys.length(decd1) != 2 || (!sys.isNumber(decd1))){
    sys.setRetData("2","业务小类编码为两位数字");
    return;
}

//检查数据元，数据集目录对应的typecd是否分别连接sys_mdm003,sys_md_mm002表
var check_dir = "select typecd from sys_md_mm001 where typecd=? and datatable=?";
var check_dedir_cnt = sql.query(check_dir,[dedir,"sys_mdm003"],"check_dedir_r");
if(check_dedir_cnt == 0){
    sys.setRetData("2","数据元目录不正确！");
    return;
}
//同时创建数据集时
if(is_cre_ds=="1"){
    var check_dsdir_cnt = sql.query(check_dir,[dsdir,"sys_md_mm002"],"check_dsdir_r");
    if(check_dsdir_cnt == 0){
        sys.setRetData("2","数据集目录不正确！");
        return;
    }
}


//向sys_mdm_003（数据元）及sys_md_mm002（数据集模型）表添加数据的SQL语句
var insde = "insert into sys_mdm003 (typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,'1',?,?,?)";
var insde_params=[];
var insds = "insert into sys_md_mm002 (typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,'1',?,?,?)";
var insds_params=[];

//检查数据元编码前缀（decd0+"."+decd1）是否存在
var selDedir = "select decd from sys_mdm003 where decd like ?";
var selDedir_cnt = sql.query(selDedir,[decd0+"."+decd1+"%"],"dedir_r");
if(selDedir_cnt > 0){
    sys.setRetData("2","数据元编码前缀（"+decd0+"."+decd1+"）已存在,请更换！");
    return;
}

//取列名对应的列的信息的SQL语句
    //首先获取数据源id对应的数据库的类型
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
var dbtype = sys.result.dbinfo[0].dbtype;
//从缓存获取数据类型
var typecache = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+dbtype+"3");
//从sys_pl_mdm005获取数据类型
// var gettypes = "select sdatatype,pdatatype from sys_pl_mdm005 where typecd=? and status='1'";
// sql.query(gettypes, ["ZR.0014"+dbtype+"3"], "typecache");
// var typecache = sys.result.typecache;
var datatype_arr = typecache;

//根据数据库类型不同，获取不同的sql语句
//获取sql语句
var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
//获取列信息SQL语句
var sql0_cnt = sql.query(getSql,["ZR.0014"+dbtype+"1",dbtype,"16"],"sql0_r");
if(sql0_cnt == 0){
    sys.setRetData("2","获取sql语句失败");
    return;
}
var getColumnInfo=sys.result.sql0_r[0].sqltext;
//循环列，分别向sys_mdm003,sys_md_mm002插入数据
var seq_num = 0;    //数据元编码序列号（三位数字）
var sorting = 1;    //列的顺序
for(r in column_arr){
    dt = sys.currentTimeString();   //当前时间字符串
    var seq = "";
    seq_num = seq_num + 1;
    if(seq_num >= 10 && seq_num <=99){
        seq = "0"+seq_num;
    }else if(seq_num < 10){
        seq = "00"+seq_num;
    }else if(seq_num >99 && seq_num < 1000){
        seq = "" + seq_num;
    }
    //验证r不为空
    if(sys.trim(r) == ""){
        sys.setRetData("2");
        return;
    }
    //连接数据源
    if(did != "00000000000000000000000000000000"){
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
    }
    //获取getColumnInfo中的参数个数
    var getColumnInfo_params=[table_schema,table_name,r];
    var tmp_str=sys.replace(getColumnInfo,"?","??");
    var param_cnt=sys.length(tmp_str)-sys.length(getColumnInfo);
    if(param_cnt==2){
      getColumnInfo_params=[table_name,r];
    }
    var getColumnInfo_cnt = se.query(getColumnInfo,getColumnInfo_params,"columninfo_r",false);
    //验证是否存在此列
    if(getColumnInfo_cnt == 0){
        sys.setRetData("2","列"+r+"不存在");
        return;
    }
    //恢复数据库连接
    if(did != "00000000000000000000000000000000"){
        sql.connection();
    }
    //获取列信息
    var columninfo_r = sys.result.columninfo_r;
    var data_type = columninfo_r[0].data_type;  //数据类型
    var numeric_precision = columninfo_r[0].numeric_precision;     //精度
    var numeric_scale = columninfo_r[0].numeric_scale;
    var character_maximum_length = columninfo_r[0].character_maximum_length;    //字符长度
    var column_type = columninfo_r[0].column_type;  //列的类型
    var is_nullable = columninfo_r[0].is_nullable;  //列是否可为null
    var column_default = columninfo_r[0].column_default;  //列的默认值
    // var column_key = columninfo_r[0].column_key;  //列是否为主键
    // var column_comment = columninfo_r[0].column_comment;    //列注释
    var column_comment = "";
    //向数据元表插入数据
    // insde = "insert into sys_mdm_003 (typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,'1',?,?,?)";
    var decd = decd0+"."+decd1+"."+seq+".00";   //数据元编码
    //转换数据类型为平台的数据类型
    var dataType = "";
    for(dtype in datatype_arr){
        if(sys.toLowerCase(dtype.id) == sys.toLowerCase(data_type)){
            dataType = dtype.name;
            break;
        }
    }
    //numrange
    var numrange = "";
    if(character_maximum_length != null && character_maximum_length != ""){
        numrange = character_maximum_length;
    }else{
        if(numeric_scale != "" && numeric_precision != ""){
            numrange = numeric_precision+","+numeric_scale;
        }
    }
    list.add(insde_params,[dedir,decd,r,r,dataType,numrange,"","","",column_comment,dt,dt]);
    
    //同时创建数据集时
    if(is_cre_ds=="1"){
        //向数据集表插入数据
        // insds = "insert into sys_md_mm002 (typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,'1',?,?,?)";
        var mk = "0";   //是否主键
        var must = "0"; //是否必填
        var dv = "";    //默认值
        if(sys.toLowerCase(is_nullable) == "no"){
            must = "1";
        }
        if(column_default != null && column_default!= ""){
            dv = column_default;
        }
        list.add(insds_params,[dsdir,decd,r,r,mk,must,dv,sorting,column_comment,dt,dt]);
        sorting = sorting + 1;
    }
}

//数据元
sql.updateBatch(insde,insde_params,"1");
//同时创建数据集时
if(is_cre_ds=="1"){
    sql.updateBatch(insds,insds_params,"1");
}

//向数据集和表的映射表中添加一条数据 （sys_md_mm003）
if(is_cre_tbl_link=="1"){
    var mm003="insert into sys_md_mm003 (typecd,did,en,cn,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
    dt = date.currentTimeString();
    var mm003_params=[dsdir,did,table_name,table_name,'1',null,dt,dt];
    sql.update(mm003,mm003_params,"1");
}

sql.commit();
//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":dsdir});

sys.setRetData("0");