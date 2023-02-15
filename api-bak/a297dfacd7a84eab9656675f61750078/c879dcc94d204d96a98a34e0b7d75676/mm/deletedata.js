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
var openid = sys.request.openid;
var org = sys.request.org;
var typecd = sys.request.typecd; // tree节点的typecd

var userid = sys.getUserIdByOpenId(openid);
if(typecd == null){
    sys.setRetData("1");
    return;
}

var gettable = "select datatable from sys_md_mm001 where typecd=?";

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
if(table == "sys_md_mm002"){
    var decd = sys.request.decd;
    var en = sys.request.en;
    var mk = sys.request.mk;
    
    if(decd == null || en == null || mk == null){
        sys.setRetData("1");
        return;
    }
    //检查要删除的数据集项是否存在
    if(sql.query("select typecd,decd,en,cn,mk,must,dv,sorting,elemtype,status,mark from sys_md_mm002 where typecd=? and decd=? and en=?",[typecd,decd,en],"oldR")==0){
        sys.setRetData("2","此数据集项不存在！");
        return;
    }
    var oldR=sys.result.oldR;
    //删除物理表中的字段
//--判断是否存在模型对应的物理表
    var _check = "select sys_md_mm003.typecd,sys_md_mm003.did,sys_md_mm003.en,sys_md_mm003.cn,sys_pl_drm_ds001.dbtype from sys_md_mm003,sys_pl_drm_ds001 where typecd=? and sys_pl_drm_ds001.did =sys_md_mm003.did and sys_pl_drm_ds001.status='1' ";
    var _check_cnt = sql.query(_check,[typecd],"_check");
//--若存在模型对应的物理表，则同时更新物理表
var _tmp_delTable = "";  //正在删除列的表
// try{
    if(_check_cnt > 0){
        //主键字段不可删除
        if(mk == "1"){
            sys.setRetData("1","主键字段不可删除");
            return;
        }
//--检查都有哪些物理表，及其数据源
        var _tables = sys.result._check;
        //检查要删除的列是否关联了索引
        for(r in _tables){
            //获取sql语句
            var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
            //查看此列是否存在索引语句
            var sql0_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"24"],"sql0_r");
            if(sql0_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            var checkColumnIndex = sys.result.sql0_r[0].sqltext;
            //获取当前schema
            var sql1_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"27"],"sql1_r");
            if(sql1_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            var selschema = sys.result.sql1_r[0].sqltext;
            //连接数据库
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
            var selschema_cnt=se.query(selschema,null,"selschema_r");
            if(selschema_cnt==0){
                sys.setRetData("2","异常");
                return;
            }
            if(current_schema!=""){
                current_schema=sys.result.selschema_r[0].schema_name;
            }
            var checkColumnIndex_cnt=se.query(checkColumnIndex,[current_schema,r.en,en],"columnindex",false);
            var columnindex = sys.result.columnindex;
            if(checkColumnIndex_cnt > 0){
                //提示存在关联索引
                sys.setRetData("2","此列在"+r.en+"表中存在索引，请先删除索引！");
                return;
            }
            //恢复数据库连接
            if(r.did != "00000000000000000000000000000000"){
                sql.connection();
            }
        }
//--循环更新物理表
        for(r in _tables){
            _tmp_delTable=r.en;
            //获取sql语句（检查表是否存在语句）
            var getSql = "select sqltext from sys_pl_mdm004 where typecd=? and dbtype=? and class=? and status='1'";
            //查看是否存在此列语句
            var sql0_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"10"],"sql0_r");
            if(sql0_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            var checkColumn = sys.result.sql0_r[0].sqltext;
            //获取当前schema语句
            var sql6_cnt = sql.query(getSql,["ZR.0014"+r.dbtype+"1",r.dbtype,"27"],"sql6_r");
            if(sql6_cnt == 0){
                sys.setRetData("2","获取sql语句失败");
                return;
            }
            var selSchema=sys.result.sql6_r[0].sqltext;
            
            var current_schema="";
            //连接数据库
            if(r.did != "00000000000000000000000000000000"){
                sql.connection(r.did);
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
            //查看是否存在此列
            var checkColumn_cnt = se.query(checkColumn,[current_schema,r.en,en],"checkColumn",false);
            if(checkColumn_cnt > 0){
                sql.update("alter table "+r.en+" drop column "+en,[],"1");
            }
            //恢复数据库连接
            if(r.did != "00000000000000000000000000000000"){
                sql.connection();
            }
        }
    }
    var delSql="delete from sys_md_mm002 where typecd=? and decd=? and en =?";
    var delSql_cnt = sql.update(delSql, [typecd, decd, en]);
    //sql.update 返回0
    if(delSql_cnt == null){
        sys.setRetData("2","删除异常");
    }else{
        //记录日志
        // var dt=sys.currentTimeString();
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
            "elemtype":oldR[0].elemtype
        };
        // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","009","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json","","orgid",org);
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00202",
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
    }
    return;
// }catch(error){
//     sys.setRetData("1","删除列失败，请检查"+_tmp_delTable+"表的索引是否关联了此列！");
//     return;
// }
    
}
if(table == "sys_mdm003"){
    var decd = sys.request.decd;
    if(decd == null){
        sys.setRetData("1");
    }
    //检查要删除的数据元是否存在
    if(sql.query("select typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,isstd from sys_mdm003 where decd=?",[decd],"oldR")==0){
        sys.setRetData("2","此数据元不存在！");
        return;
    }
    var oldR=sys.result.oldR;
    //检查数据元编码是否已在模型表中使用
    var checkUse = "select distinct b.typecd,b.typenm from sys_md_mm002 a,sys_md_mm001 b where a.decd=? and a.typecd=b.typecd and b.typecd in (select typecd from sys_md_mm003 where typecd=b.typecd and status='1')";
    var checkUse_cnt = sql.query(checkUse,[decd]);
    var result = sys.result.result;
    if(checkUse_cnt > 0){
        var tmp = "";
        //获取涉及到的表模型
        for(r in result){
            if(r.tblnum!="0"){
               tmp=tmp+r.typenm+","; 
            }
        }
        tmp = sys.subStringTo(tmp,0,sys.length(tmp)-1);
        sys.setRetData("2","此数据元编码已在数据集（"+tmp+"）中使用，不可删除！");
        return;
    }
    var delSql="delete from sys_mdm003 where typecd=? and decd=?";
    var delSql_cnt = sql.update(delSql, [typecd, decd]);
    //sql.update 返回0
    if(delSql_cnt == null){
        sys.setRetData("2","删除异常");
    }else{
        //记录日志
        // var dt=sys.currentTimeString();
        var before_json={
            "typecd":typecd,
            "decd":oldR[0].decd,
            "en":oldR[0].en,
            "cn":oldR[0].cn,
            "datatype":oldR[0].datatype,
            "numrange":oldR[0].numrange,
            "format":oldR[0].format,
            "unit":oldR[0].unit,
            "dict":oldR[0].dict,
            "status":oldR[0].status,
            "mark":oldR[0].mark,
            "isstd":oldR[0].isstd
        };
        // sys.bizLog("DS.SYS.03.07","id",sys.nextId(),"operation_type","006","userid",userid,"createdt",dt,"before_json",sys.jsonFromInstance(before_json),"after_json","","orgid",org);
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00102",
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
    }
    return;
}