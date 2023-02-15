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
var org = sys.request.org;
var typecd = sys.request.typecd;

if(typecd == null){
    sys.setRetData("1");
    return;
}


var table="";
//获取数据库表名称
var gettable = "select datatable from sys_md_mm001 where typecd = ?";
var cnt = sql.query(gettable, [typecd], "tableresult");
var tableresult = sys.result.tableresult;

if(cnt == 0){
    sys.setRetData("2");
    return;
}
table = tableresult[0].datatable;

//修改数据（暂时写固定数据）
if(table == "sys_md_mm002"){
    var decd = sys.request.decd;
    var _decd = sys.request._decd;
    var en = sys.request.en;
    var _en = sys.request._en;
    var cn = sys.request.cn;
    var mk = sys.request.mk;
    var _mk = sys.request._mk;
    var _must = sys.request._must;
    var must = sys.request.must;
    // var sorting = sys.request.sorting;
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
    var iscatch=false,catmsg="";
    //判断不为空的字段
    if(_decd == null || decd == null || _en == null || en == null ||cn ==null ||
    mk == null ||must == null || _mk == null){
        sys.setRetData("1", "_decd,decd,_en,en,cn,mk,_mk,must不可为空");
        return;
    }
    //en不可以_开头
    if(sys.startWith(en,"_")){
        sys.setRetData("2","英文名称不能以_开头");
        return;
    }
    //列名不能以p_或数字开头
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
    //检查要修改的数据集项是否存在
    if(sql.query("select typecd,decd,en,cn,mk,must,dv,sorting,elemtype,status,mark,version from sys_md_mm002 where typecd=? and decd=? and en=?",[typecd,_decd,_en],"oldR")==0){
        sys.setRetData("2","此数据集项不存在！");
        return;
    }
    var oldR=sys.result.oldR;
    //判断表英文名是否存在
    if(en != _en){
        var _cnt = sql.query("select en from sys_md_mm002 where typecd = ?", [typecd], "prikey");
        if(_cnt != 0){
            for(r in sys.result.prikey){
                if(sys.toLowerCase(r.en) == sys.toLowerCase(en)){
                    sys.setRetData("1","英文名称已存在！");
                    return;
                }
            }
        }
    }
    //如果添加的列为主键则此字段为必填
    if(mk == "1" && must == "0"){
        sys.setRetData("2","主键字段不可为null");
        return;
    }
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

    //获取表的主键字段
    var getPKFields = "select en from sys_md_mm002 where typecd=? and en != ? and mk = '1' ";
    sql.query(getPKFields,[typecd,_en],"pkfieldsR");
    var pkfieldsR = sys.result.pkfieldsR;
    var pkfields = "";
    for(p in pkfieldsR){
        pkfields = pkfields + p.en+",";
    }
    if(mk == "1"){
        pkfields=pkfields+en;
    }else{
        if(pkfields != ""){
            pkfields=sys.subStringTo(pkfields,0,sys.length(pkfields)-1);
        }
    }
    //--若存在模型对应的物理表，则同时更新物理表
    if(_check_cnt > 0){
        //--检查都有哪些物理表，及其数据源
        var _tables = sys.result._check;
        
        var must_change = false;
        if(must != _must){
            must_change = true;
        }
        
        var mk_change = false;
        if(mk != _mk){
            mk_change = true;
        }
        //--循环更新物理表
        for(r in _tables){
            //从缓存获取数据类型
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
                    }else{
                        sys.setRetData("2",numrange_r+"格式错误！");
                        return;
                    }
                }
            }
            if(dv != null){
                str_cdefault="DEFAULT '"+dv+"' ";
            }
            if(must == "1"){
                str_cnull=" NOT NULL ";
            }else{
                str_cnull=" NULL ";
            }
            //是否必填没变化，则不修改
            if(!must_change){
                str_cnull = "";
            }
            
            str_comment="COMMENT '"+cn+"'";
            
            var checkTableExist="";     //检查物理表是否存在
            //判断是否存在旧列
            var checkColumn = "";
            var alterKey = "";  //修改列语句
            var dropPK = "";    //删除主键
            var addPK = "";     //添加主键
            var selIndexSql = "";   //select主键索引
            var renameColumn = "";  //修改列名
            var selSchema="";   //获取当前schema
            var addColumn=""; //添加列
            //获取sql语句
            var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=?";
            //检查表是否存在语句
            var sql7_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"07"],"sql7_r");
            if(sql7_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            checkTableExist=sys.result.sql7_r[0].sqltext;
            //检查列名是否存在语句
            var sql0_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"10"],"sql0_r");
            if(sql0_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            checkColumn=sys.result.sql0_r[0].sqltext;
            //检查主键是否存在并返回主键语句
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
            //修改列信息（不包括列名）语句
            var sql4_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"11"],"sql4_r");
            if(sql4_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            alterKey=sys.result.sql4_r[0].sqltext;
            alterKey=sys.replace(alterKey,"p_tablenm",r.en);
            alterKey=sys.replace(alterKey,"p_cnm",en);
            alterKey=sys.replace(alterKey,"p_ctype",str_ctype);
            alterKey=sys.replace(alterKey,"p_cdefault",str_cdefault);
            alterKey=sys.replace(alterKey,"p_cnull",str_cnull);
            alterKey=sys.replace(alterKey,"p_comment",str_comment);
            //修改列名语句
            var sql5_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"04"],"sql5_r");
            if(sql5_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            renameColumn=sys.result.sql5_r[0].sqltext;
            renameColumn=sys.replace(renameColumn,"p_tablenm",r.en);
            renameColumn=sys.replace(renameColumn,"p_oldnm",_en);
            renameColumn=sys.replace(renameColumn,"p_newnm",en);
            renameColumn=sys.replace(renameColumn,"p_ctype",str_ctype);
            renameColumn=sys.replace(renameColumn,"p_cdefault",str_cdefault);
            renameColumn=sys.replace(renameColumn,"p_cnull",str_cnull);
            renameColumn=sys.replace(renameColumn,"p_comment",str_comment);
            //获取当前schema语句
            var sql6_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"27"],"sql6_r");
            if(sql6_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            selSchema=sys.result.sql6_r[0].sqltext;
            //添加列信息语句
            var sql8_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"15"],"sql8_r");
            if(sql8_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            addColumn=sys.result.sql8_r[0].sqltext;
            addColumn=sys.replace(addColumn,"p_tablenm",r.en);
            addColumn=sys.replace(addColumn,"p_cnm",en);
            addColumn=sys.replace(addColumn,"p_ctype",str_ctype);
            addColumn=sys.replace(addColumn,"p_cdefault",str_cdefault);
            addColumn=sys.replace(addColumn,"p_cnull",str_cnull);
            addColumn=sys.replace(addColumn,"p_comment",str_comment);
                
            //连接数据源
            var current_schema="";
            if(r.did != "00000000000000000000000000000000"){
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
            
            //如果不是平台连接，则获取当前schema
            var selSchema_cnt=se.query(selSchema,null,"selschema_r",false);
            if(selSchema_cnt == 0){
                sys.setRetData("2","异常");
                return;
            }
            
            if(current_schema==""){
                current_schema=sys.result.selschema_r[0].schema_name;
            }
            //检查表是否存在
            var checkTblExist_cnt=se.query(checkTableExist,[current_schema,r.en],"result");
            if(checkTblExist_cnt==0){
                continue;
            }
            //判断_en是否存在
            var checkColumn_cnt = se.query(checkColumn,[current_schema,r.en,_en],"checkColumn",false);
            try{
                if(checkColumn_cnt == 0){
                    //如果要修改的列不存在，则添加列
                    sql.update(addColumn,[],"1");
                }else{
                    //判断是否改列名(改列名用change，否则用alter 或 modify)
                    if(en != _en){
                        //修改之前先判断列名是否重复
                        var checkColumn_cnt_i = se.query(checkColumn,[current_schema,r.en,en],"checkColumn_i",false);
                        if(checkColumn_cnt_i > 0){
                            sys.setRetData("2","已存在此英文名称");
                            return;
                        }
                        //修改列名
                        sql.update(renameColumn,[],"1");
                    }
                    //修改列信息
                    sql.update(alterKey,[],"1");
                }
            }catch(e){
                iscatch=true;
                catmsg=e.cause.message;
            }
            if(iscatch){
                sql.rollback();
                sys.setRetData("2",catmsg);
                return;
            }
            //修改主键 (主键改变时，或修改主键字段时)
            if(mk_change || mk=="1"){
                //检查是否存在主键
                var selIndexSql_cnt = se.query(selIndexSql,[current_schema,r.en],"checkpk",false);              
                if(selIndexSql_cnt > 0){
                    var pk_index_name = sys.result.checkpk[0].pk_index_name;
                    dropPK = sys.replace(dropPK,"p_pk_index_name",pk_index_name);
                    sql.update(dropPK,[],"1");
                }
                if(pkfields != ""){
                    try{
                        sql.update(addPK,[],"1");
                    }catch(e){
                         iscatch=true;   
                    }
                    if(iscatch){
                        sql.rollback();
                        sys.setRetData("2","修改主键失败，修改主键后可能会存在重复记录");
                        return;
                    }
                }    
            }
            sql.commit();
            //恢复数据库连接
            if(r.did != "00000000000000000000000000000000"){
                sql.connection();
            }
        }
    }
    //修改sys_md_mm002数据集模型表里对应的记录
    var setdata = "update sys_md_mm002 set decd=?,en=?,cn=?,mk=?,must=?,status=?,mark=?,updatedt=?,elemtype=?,version=? where typecd=? and decd=? and en=?";
    var dt = sys.currentTimeString();
    var params = [decd,en,cn,mk,must,status,mark,dt,elemtype,version,typecd,_decd,_en];
    try{
        var num = sql.update(setdata, params);
        if(num == 0){
            sys.setRetData("1","decd,en已存在");
            return;
        }
        //记录日志
        var before_json={
            "typecd":typecd,
            "decd":oldR[0].decd,
            "en":oldR[0].en,
            "cn":oldR[0].cn,
            "mk":oldR[0].mk,
            "must":oldR[0].must,
            "dv":oldR[0].dv,
            "status":oldR[0].status,
            "mark":oldR[0].mark,
            "elemtype":oldR[0].elemtype,
            "version":oldR[0].version
        };
        var after_json={
            "typecd":typecd,
            "decd":decd,
            "en":en,
            "cn":cn,
            "mk":mk,
            "must":must,
            "dv":dv,
            "status":status,
            "mark":mark,
            "elemtype":elemtype,
            "version":version
        };

        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00202",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
        if(log_res.data.ret!="0"){
            sys.setRetData(log_res.data.ret,log_res.data.msg);
            return;
        }
        sys.setRetData("0");
    }catch(e){
        // 抛出message
        sys.setRetData("5",e.cause.message);
    }
    
}
if(table == "sys_mdm003"){
    var decd = sys.request.decd;
    var _decd = sys.request._decd;
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
    
    var parm = { _decd:'类别编码', decd:'数据元编码', en:'英文名', cn:'中文名', version:'版本', datatype:'数据类型',status:'状态'};
    
    for (var k in parm) {
      if (!sys.request[k]) {
        sys.setRetData(1, parm[k]+' 不能为空！');
        return;
      } 
    }
    //判断不为空的字段
    // if(_decd == null || decd == null || en == null || cn == null || datatype == null || status == null||version==null){
    //     sys.setRetData("1",);
    //     return;
    // }
    //检查数据元编码是否已在模型表中使用
    if(sql.query("select typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,isstd,version from sys_mdm003 where decd=?",[_decd],"dt_nr")==0){
        sys.setRetData("2","数据元已被删除！");
        return;
    }
    var before_json={
        "typecd":sys.result.dt_nr[0].typecd,
        "decd":sys.result.dt_nr[0].decd,
        "en":sys.result.dt_nr[0].en,
        "cn":sys.result.dt_nr[0].cn,
        "datatype":sys.result.dt_nr[0].datatype,
        "numrange":sys.result.dt_nr[0].numrange,
        "format":sys.result.dt_nr[0].format,
        "unit":sys.result.dt_nr[0].unit,
        "dict":sys.result.dt_nr[0].dict,
        "status":sys.result.dt_nr[0].status,
        "mark":sys.result.dt_nr[0].mark,
        "isstd":sys.result.dt_nr[0].isstd,
        "version":sys.result.dt_nr[0].version
    };
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
    var change_fields=[];
    if(before_json.decd!=(decd==null?"":decd)){
        list.add(change_fields,"decd");
        // change_fields=change_fields+"数据元编码(decd),";
    }
    if(before_json.en!=(en==null?"":en)){
        list.add(change_fields,"en");
        // change_fields=change_fields+"英文名称(en),";
    }
    if(before_json.cn!=(cn==null?"":cn)){
        list.add(change_fields,"cn");
        // change_fields=change_fields+"中文名称(cn),";
    }
    if(before_json.datatype!=(datatype==null?"":datatype)){
        list.add(change_fields,"datatype");
        // change_fields=change_fields+"数据类型(datatype),";
    }
    if(before_json.numrange!=(numrange==null?"":numrange)){
        list.add(change_fields,"numrange");
        // change_fields=change_fields+"数据长度(numrange),";
    }
    if(before_json.format!=(format==null?"":format)){
        list.add(change_fields,"format");
        // change_fields=change_fields+"显示格式(format),";
    }
    if(before_json.unit!=(unit==null?"":unit)){
        list.add(change_fields,"unit");
        // change_fields=change_fields+"单位(unit),";
    }
    if(before_json.dict!=(dict==null?"":dict)){
        list.add(change_fields,"dict");
        // change_fields=change_fields+"数据字典(dict),";
    }
    if(before_json.status!=(status==null?"":status)){
        list.add(change_fields,"status");
        // change_fields=change_fields+"状态(status),";
    }
    if(before_json.mark!=(mark==null?"":mark)){
        list.add(change_fields,"mark");
        // change_fields=change_fields+"说明(mark),";
    }
    if(before_json.isstd!=(isstd==null?"":isstd)){
        list.add(change_fields,"isstd");
        // change_fields=change_fields+"是否标准(isstd),";
    }
    if(before_json.version!=(version==null?"":version)){
        list.add(change_fields,"version");
        // change_fields=change_fields+"版本(version),";
    }
    
    if(sys.size(change_fields)==0){
        sys.setRetData("1","无修改信息");
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
    if(numrange != null && (!sys.isNumber(numrange))){
        if(sys.size(sys.split(numrange,"\\d+,\\d+"))>0){
            sys.setRetData("2","数据长度:"+numrange+"格式错误");
            return;
        }
    }
    if(numrange != null && sys.contain(numrange,",")){
        //只有double的长度可以带逗号
        if(javatype != "Double"){
            sys.setRetData("2","数据长度格式错误");
            return;
        }
    }
    //检查numrange精度是否变小
    var numrangeWrong=false;
    var tmp_numrange=numrange==null?"":numrange;
    if(sys.result.dt_nr[0].numrange!=tmp_numrange){
        var before=sys.split(sys.result.dt_nr[0].numrange,",");
        var after=sys.split(tmp_numrange,",");
        //整数部分比较
        if(sys.parseInt(before[0])>sys.parseInt(after[0])){
            numrangeWrong=true;
        }
        //小数部分比较
        if(sys.size(before)==2 && sys.size(after)==1){
            numrangeWrong=true;
        }else if(sys.size(before)==2 && sys.size(after)==2 && sys.parseInt(before[1])>sys.parseInt(after[1])){
            numrangeWrong=true;
        }
    }
    //如果修改了数据元编码或数据类型或减小了数据长度，则判断此数据元是否已被数据集使用
    if(sys.result.dt_nr[0].datatype!=datatype || numrangeWrong || decd!=_decd){
        var checkUse = "select distinct b.typecd,b.typenm from sys_md_mm002 a,sys_md_mm001 b where a.decd=? and a.typecd=b.typecd and b.typecd in (select typecd from sys_md_mm003 where typecd=b.typecd and status='1')";
        var checkUse_cnt = sql.query(checkUse,[_decd],"checkuse_r");
        var checkuse_r = sys.result.checkuse_r;
        if(checkUse_cnt > 0){
            var tmp = "";
            //获取涉及到的表模型
            for(r in checkuse_r){
                if(r.tblnum != "0"){
                    tmp=tmp+r.typenm+",";
                }
            }
            tmp = sys.subStringTo(tmp,0,sys.length(tmp)-1);
            sys.setRetData("2","此数据元编码已在数据集（"+tmp+"）中使用，不可修改！请新建一个数据元");
            return;
        }
    }
    
    if(_decd!=decd){
         //判断主键是否重复
        var _cnt = sql.query("select typecd from sys_mdm003 where decd=?",[decd],"prikey");
        if(_cnt != 0){
            sys.setRetData("1","数据元编码已存在！");
            return;
        }
    }
    //修改
    var setdata = "update sys_mdm003 set decd=?,en=?,cn=?,datatype=?,numrange=?,format=?,unit=?,dict=?,status=?,mark=?,updatedt=?,isstd=?,version=? where typecd=? and decd=?";
    var dt = sys.currentTimeString();
    var params = [decd,en,cn,datatype,numrange,format,unit,dict,status,mark,dt,isstd,version,typecd,_decd];
    var num = sql.update(setdata, params);
    
    //记录日志
    
    // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","005","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json",sys.jsonFromInstance(after_json),"orgid",org);
    var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
        "typecd":typecd,
        "operation_type":"00102",
        "before_json":sys.jsonFromInstance(before_json),
        "after_json":sys.jsonFromInstance(after_json),
        "operation_detail":change_fields
    });
    if(log_res.data.ret!="0"){
        sys.setRetData(log_res.data.ret,log_res.data.msg);
        return;
    }
    if(num == 0){
        sys.setRetData("1","decd已存在");
        return;
    }
    
    //操作数据集日志
    http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});

    sys.setRetData("0");
    return;
}