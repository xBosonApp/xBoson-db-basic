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
var openid = sys.request.openid;
var typecd = sys.request.typecd;
var org = sys.request.org;

var userid = sys.getUserIdByOpenId(openid);

var table="";
if(typecd == null){
    sys.setRetData("1");
    return;
}
//获取要添加的表
var gettable = "select datatable from sys_md_mm001 where typecd = ?";
var cnt = sql.query(gettable, [typecd], "tableresult");
if(cnt == 0){
    sys.setRetData("2");
    return;
}
var tableresult = sys.result.tableresult;
table = tableresult[0].datatable;

if(table == "sys_md_mm002"){
    var decd = sys.request.decd;
    var en = sys.request.en;
    var cn = sys.request.cn;
    var mk = sys.request.mk;
    var must = sys.request.must;
    var dv = sys.request.dv;
    var status = sys.request.status;
    var mark = sys.request.mark;
    var elemtype = sys.request.elemtype;
    var version = sys.request.version;
    
    if(status == null){
        status = "1";
    }
    if(version == null){
        version = "v1.0";
    }
    //判断不为空的字段
    if(decd == null || en == null || cn == null || mk == null || must == null || version==null){
        sys.setRetData("1");
        return;
    }
    //en不可以_开头
    if(sys.startWith(en,"_")){
        sys.setRetData("2","英文名称不能以_开头");
        return;
    }
    //en不能以p_或数字开头  sql语句中使用p_表示参数
    if(sys.startWith(sys.toLowerCase(en),"p_")){
        sys.setRetData("1","列名不能以p_开头！");
        return;
    }
    if(sys.isNumber(sys.subStringTo(en,0,1))){
        sys.setRetData("1","列名不能以数字开头！");
        return;
    }
    //en不可以为openid,org,app,mod,cb,s,format,sys
    var _keyw=["openid","org","app","mod","cb","s","format","sys"];
    if(list.contain(_keyw,en)){
        sys.setRetData("1","列名不能为"+en);
        return;
    }
    //判断主键是否存在
    cnt = sql.query("select en from sys_md_mm002 where typecd = ?", [typecd],"result");
    if(cnt > 0){
        for(r in sys.result.result){
            if(sys.toLowerCase(r.en) == sys.toLowerCase(en)){
                sys.setRetData("1","英文名称已存在！");
                return;
            }
        }
    }
    //如果添加的列为主键则此字段为必填
    if(mk == "1" && must == "0"){
        sys.setRetData("2","主键字段不可为null");
        return;
    }
    //获取表的主键字段
    var getPKFields = "select en from sys_md_mm002 where typecd=? and mk = '1'";
    sql.query(getPKFields,[typecd],"pkfieldsR");
    var pkfieldsR = sys.result.pkfieldsR;
    var pkfields = "";
    for(p in pkfieldsR){
        pkfields =pkfields + p.en+",";
    }
    if(mk == "1"){
        pkfields=pkfields+en;
    }else{
        if(pkfields != ""){
            pkfields=sys.subStringTo(pkfields,0,sys.length(pkfields)-1);
        }
    }

    //自动生成sorting
    var sql_sort="select typecd from sys_md_mm002 where typecd=?";
    //--根据decd获取数据类型
    sql.query("select datatype,numrange from sys_mdm003 where decd=?",[decd],"datatypeR");
    var datatypeR = sys.result.datatypeR;
    if(sys.size(datatypeR) != 1){
        sys.setRetData("2","数据元编码不存在！");
        return;
    }
    var datatype_r = datatypeR[0].datatype;
    var numrange_r = datatypeR[0].numrange;
    if(sys.trim(datatype_r) == ""){
        sys.setRetData("2","数据元没有对应的数据类型！");
        return;
    }
    //--判断是否存在模型对应的物理表
    var _check = "select sys_md_mm003.typecd,sys_md_mm003.did,sys_md_mm003.en,sys_md_mm003.cn,sys_pl_drm_ds001.dbtype,sys_pl_drm_ds001.en drm_en from sys_md_mm003,sys_pl_drm_ds001 where typecd=? and sys_pl_drm_ds001.did =sys_md_mm003.did and sys_pl_drm_ds001.status='1' ";
    var _check_cnt = sql.query(_check,[typecd],"_check");
    //--若存在模型对应的物理表，则同时更新物理表
    if(_check_cnt > 0){
        
        //--检查都有哪些物理表，及其数据源
        var _tables = sys.result._check;

        //--循环更新物理表
        for(r in _tables){
            var str="";
            //从sys_mdm002获取数据类型
            var typecache = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+r.dbtype+"2");
            var _datatype = "";
             //转换数据类型
            for(d in typecache){
                if(d.id == datatype_r){
                    _datatype = d.name;
                }
            }
            var str_ctype="";
            var str_cdefault="";
            var str_cnull="";
            var str_comment="";
            //判断numrange是否为空
            if(sys.trim(numrange_r)==""){
                str_ctype=_datatype;
                // str=str+en+" "+_datatype+" ";
            }else{
                //trim,numrange
                var numrange = sys.trim(numrange_r);
                if(sys.contain(numrange,",")){
                    var numarr=sys.split(numrange,",");
                    //判断数组numarr个数
                    if(sys.size(numarr)==2 && sys.isNumber(numarr[0]) && sys.isNumber(numarr[1]) && sys.parseInt(numarr[0])>sys.parseInt(numarr[1])){
                        str_ctype=_datatype+"("+numarr[0]+","+numarr[1]+") ";
                        // str=str+en+" "+_datatype+"("+numarr[0]+","+numarr[1]+") ";
                    }else if(sys.size(numarr)==1 && sys.isNumber(numarr[0])){
                        str_ctype=_datatype+"("+numarr[0]+") ";
                        // str=str+en+" "+_datatype+"("+numarr[0]+") ";
                    }else if(sys.size(numarr) == 0){
                        str_ctype=_datatype;
                        // str=str+en+" "+_datatype+" ";
                    }else{
                        sys.setRetData("2",numrange_r+"格式错误！");
                        return;
                    }
                }else{
                    //判断是否为数字
                    if(sys.isNumber(sys.trim(numrange_r))){
                        str_ctype=_datatype+"("+sys.trim(numrange_r)+") ";
                        // str=str+en+" "+_datatype+"("+sys.trim(numrange_r)+") ";
                    }else{
                        sys.setRetData("2",numrange_r+"格式错误！");
                        return;
                    }
                }
            }
   
            if(must == "1"){
                str_cnull=" NOT NULL ";
                // str=str+" NOT NULL ";
            }else{
                str_cnull=" NULL ";
                // str=str+" NULL ";
            }
            str_comment="COMMENT '"+cn+"'";
            // str=str+"COMMENT '"+cn+"'";
            var checkTableExist="";     //检查物理表是否存在
            var selIndexSql="";     //检查主键是否存在
            var dropPK = "";    //删除主键
            var addPK = "";     //添加主键
            var addColumn="";   //添加列
            var checkColumn = "";   //检查列是否存在
            var selSchema="";   //获取当前schema
            //--拼sql语句
            //获取sql语句
            var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=?";
            //检查主键是否存在语句
            var sql0_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"07"],"sql0_r");
            if(sql0_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            checkTableExist=sys.result.sql0_r[0].sqltext;
            //检查主键是否存在语句
            var sql1_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"12"],"sql1_r");
            if(sql1_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            selIndexSql=sys.result.sql1_r[0].sqltext;
            //删除主键语句
            var sql2_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"13"],"sql2_r");
            if(sql2_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            dropPK=sys.result.sql2_r[0].sqltext;
            dropPK=sys.replace(dropPK,"tablenm",r.en);
            //添加主键语句
            var sql3_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"14"],"sql3_r");
            if(sql3_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            addPK=sys.result.sql3_r[0].sqltext;
            addPK=sys.replace(addPK,"tablenm",r.en);
            addPK=sys.replace(addPK,"fields",pkfields);
            //添加列信息语句
            var sql4_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"15"],"sql4_r");
            if(sql4_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            addColumn=sys.result.sql4_r[0].sqltext;
            addColumn=sys.replace(addColumn,"p_tablenm",r.en);
            addColumn=sys.replace(addColumn,"p_cnm",en);
            addColumn=sys.replace(addColumn,"p_ctype",str_ctype);
            addColumn=sys.replace(addColumn,"p_cdefault",str_cdefault);
            addColumn=sys.replace(addColumn,"p_cnull",str_cnull);
            addColumn=sys.replace(addColumn,"p_comment",str_comment);
            //检查列名是否存在语句
            var sql5_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"10"],"sql5_r");
            if(sql5_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            checkColumn=sys.result.sql5_r[0].sqltext;
            //获取当前schema语句
            var sql6_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"27"],"sql6_r");
            if(sql6_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            selSchema=sys.result.sql6_r[0].sqltext;
            
            var current_schema="";
            if(r.did != "00000000000000000000000000000000"){
                var iscatch=false;
                try{
                    sql.connection(r.did);
                }catch(e){
                    iscatch=true;
                }
                if(iscatch){
                    sys.setRetData("1","数据源（"+r.did+"）异常");
                    continue;
                }
                
            }else{
                current_schema=org;
            }
            
            //获取当前schema
            var selSchema_cnt=se.query(selSchema,null,"selschema_r",false);
            if(selSchema_cnt == 0){
                sys.setRetData("2","异常");
                return;
            }
            //如果不是平台连接，则获取当前schema
            if(current_schema==""){
                current_schema=sys.result.selschema_r[0].schema_name;
            }
            //检查表是否存在
            var checkTblExist_cnt=se.query(checkTableExist,[current_schema,r.en],"result");
            if(checkTblExist_cnt==0){
                continue;
            }
            //检查列名是否存在
            var checkColumn_cnt = se.query(checkColumn,[current_schema,r.en,en],"result",false);
            if(checkColumn_cnt != 0){
                sys.setRetData("2",r.en+"物理表已存在此列");
                return;
            }
            sql.update(addColumn,[],"1");
            //更改主键
            if(mk == "1"){
                //检查是否存在主键（r.drm_en不可用）
                var selIndexSql_cnt = se.query(selIndexSql,[current_schema,r.en],"checkpk"); 
                if(selIndexSql_cnt > 0){
                    var pk_index_name = sys.result.checkpk[0].pk_index_name;
                    dropPK = sys.replace(dropPK,"p_pk_index_name",pk_index_name);
                    sql.update(dropPK,[],"1");
                }
                if(pkfields != ""){
                    sql.update(addPK,[],"1");
                }
            }
            sql.commit();
            //恢复数据库连接
            if(r.did != "00000000000000000000000000000000"){
                sql.connection();
            }
        }
    }
    var sorting_cnt = sql.query(sql_sort,[typecd],"sql_sort");
    //添加到数据库
    var insert = "insert into sys_md_mm002(typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt,elemtype,version) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var dt = sys.currentTimeString();
    var params = [typecd,decd,en,cn,mk,must,dv,sorting_cnt,status,mark,dt,dt,elemtype,version];
    try{
        var num=sql.update(insert, params);
        if(num == 1){
            //记录日志
            var after_json={
                "typecd":typecd,
                "decd":decd,
                "en":en,
                "cn":cn,
                "mk":mk,
                "must":must,
                "dv":dv,
                "sorting":sorting_cnt,
                "status":status,
                "mark":mark,
                "elemtype":elemtype,
                "version":version
            };
            var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
                "typecd":typecd,
                "operation_type":"00202",
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
        }else{
            sys.setRetData("2");
        }
    }catch(e){
        // 抛出message
        sys.setRetData("5",e.cause.message);
    }
    
}
if(table == "sys_mdm003"){
    var decd = sys.request.decd;
    var en = sys.request.en;
    var cn = sys.request.cn;
    var datatype = sys.request.datatype;
    var numrange = sys.request.numrange;
    var format = sys.request.format;
    var unit = sys.request.unit;
    var dict = sys.request.dict;
    var dictnm = sys.request.dictnm;
    var status = sys.request.status;
    var mark = sys.request.mark;
    var isstd = sys.request.isstd;
    var version = sys.request.version;
    //判断不为空的字段
    if(decd == null || en == null || cn == null || datatype == null || status == null||version==null){
        sys.setRetData("1");
        return;
    }

    //根据类型转换获取数据类型
    var javatype="";
    var typetrans=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.004101");
    for(r in typetrans){
        if(r.id==datatype){
            javatype=r.name;
        }
    }
    //验证numrange 只能为数字，或 数字,数字
    if(numrange != null && (!sys.isNumber(numrange))){
        if(sys.contain(numrange,",")){
            //只有double的长度可以带逗号
            if(javatype != "Double"){
                sys.setRetData("2","数据长度格式错误");
                return;
            }
            var tmp_arr=sys.split(numrange+",123",",");
            if(sys.size(tmp_arr)!=3){
                sys.setRetData("2");
                return;
            }
            for(r in tmp_arr){
                if(!sys.isNumber(r)){
                    sys.setRetData("2");
                    return;
                }
            }
        }else{
            sys.setRetData("2","数据长度格式错误");
            return;
        }
    }
    //判断主键是否重复
    cnt = sql.query("select typecd from sys_mdm003 where decd=?",[decd],"prikey");
    if(cnt > 0){
        sys.setRetData("1","数据元编码已存在！");
        return;
    }
    //添加到数据库
    var insert = "insert into sys_mdm003(typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,createdt,updatedt,isstd,version) values  (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var dt = sys.currentTimeString();
    var params = [typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,dt,dt,isstd,version];
    var num=sql.update(insert, params);
    
    //记录日志
    var after_json={
        "typecd":typecd,
        "decd":decd,
        "en":en,
        "cn":cn,
        "datatype":datatype,
        "numrange":numrange,
        "format":format,
        "unit":unit,
        "dict":dict,
        "status":status,
        "mark":mark,
        "isstd":isstd,
        "version":version
    };
    // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","004","userid",userid,"createdt",dt,"before_json","","after_json",sys.jsonFromInstance(after_json),"orgid",org);
    var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
        "typecd":typecd,
        "operation_type":"00102",
        "before_json":"",
        "after_json":sys.jsonFromInstance(after_json)
    });
    if(log_res.data.ret!="0"){
        sys.setRetData(log_res.data.ret,log_res.data.msg);
        return;
    }
    if(num == 1){
      //操作数据集日志
      http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
      sys.setRetData("0");
      return;
    }else{
      sys.setRetData("999");
      return;
    }
}