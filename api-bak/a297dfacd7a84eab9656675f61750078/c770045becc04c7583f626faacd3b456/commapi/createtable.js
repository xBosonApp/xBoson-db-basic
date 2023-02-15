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
//id:createtable
//name:根据业务模型创建表

//根据返回的通用结构type创建数据元和数据集，然后创建表
// "en": "en4",
// "cn": "统计C",
// "view": "是否显示:1",
// "ro": "是否只读:1",
// "must": "是否必须输入(sys_md_mm002):1",
// "search": "是否检索条件:1",
// "elemtype": "元素标签类型",
// "datatype": "数据类型",
// "numrange": "数据长度",
// "format": "显示格式",
// "unit": "单位",
// "dict": "字典类别(typecd)",
// "chart": "pie"

var did=sys.request.did;    //选择的数据源
var typecd=sys.request.typecd;  //业务模型id
var dedir=sys.request.dedir;    //数据元目录
var dsdir=sys.request.dsdir;    //数据集目录
var table_en=sys.request.en;  //创建的表英文名
var table_cn=sys.request.cn;  //创建的表中文名

var typecontent="";    //type结构信息
var decode="00";  //数据元小分类code
var dt=sys.currentTimeString();

if(did==null||typecd==null||dedir==null||dsdir==null||table_en==null||table_cn==null){
    sys.setRetData("1");
    return;
}
var cnt=0;
//检查数据元类别和数据集类别是否存在
cnt=sql.query("select typecd from sys_md_mm001 where (typecd=? OR typecd=?) and status='1'",[dedir,dsdir],"chk_exist");
if(cnt!=2){
    if(cnt==0){
        sys.setRetData("2","数据元目录和数据集目录不存在或状态为无效！");
        return;
    }else if(cnt==1){
        if(sys.result.chk_exist[0].typecd==dedir){
            sys.setRetData("2","数据集目录不存在或状态为无效！");
            return;
        }else{
            sys.setRetData("2","数据元目录不存在或状态为无效！");
            return;
        }
    }else{
        sys.setRetData("2","异常！");
        return;
    }
}
//检查数据集里是否有字段
cnt=sql.query("select en from sys_md_mm002 where typecd=?",[dsdir],"chk_fields");
if(cnt>0){
    sys.setRetData("2","数据集非空，请选择一个空的数据集！");
    return;
}
//检查数据元编码前缀（typecd+"."+decd1）是否存在
var selDedir = "select decd from sys_mdm003 where decd like ?";
while(true){
    var selDedir_cnt = sql.query(selDedir,[dedir+"."+decode+"%"],"dedir_r");
    if(selDedir_cnt > 0){
        decode=sys.parseInt(decode)+1;
        if(decode<10){
            decode="0"+decode;
        }else if(decode<100){
            decode=""+decode;
        }else{
            sys.setRetData("2","请更换一个数据元");
            return;
        }
    }else{
        break;
    }
}

//获取typecd是哪个表 sys_bm003 , sys_bm004
var typecd_tbl="";
cnt=sql.query("select typecontent from sys_bm003 where typecd=? and status='1'",[typecd],"typecontent_r");
if(cnt==0){
    cnt=sql.query("select typecontent from sys_bm004 where typecd=? and status='1'",[typecd],"typecontent_r");
    if(cnt==0){
        sys.setRetData("2");
        return;
    }
    typecd_tbl="sys_bm004";
}else{
    typecd_tbl="sys_bm003";
}
var typecontentObj=sys.instanceFromJson(sys.result.typecontent_r[0].typecontent);
//添加status，createdt,updatedt
var hasStatus=false,hasCreatedt=false,hasUpdatedt=false;
for(r in typecontentObj.type){
    if(r.en=="status"){
        hasStatus=true;
    }
    if(r.en=="createdt"){
        hasCreatedt=true;
    }
    if(r.en=="updatedt"){
        hasUpdatedt=true;
    }
}
if(!hasStatus){
    list.add(typecontentObj.type,{
        "en":"status",
        "cn":"状态",
        "mk":"0",
        "must":"1",
        "elemtype":"text",
        "datatype":"CHAR",
        "numrange":"1",
        "format":"",
        "unit":"",
        "dict":""
    });
}
if(!hasCreatedt){
    list.add(typecontentObj.type,{
        "en":"createdt",
        "cn":"创建时间",
        "mk":"0",
        "must":"1",
        "elemtype":"date2",
        "datatype":"DATETIME",
        "numrange":"",
        "format":"",
        "unit":"",
        "dict":""
    });
}
if(!hasUpdatedt){
    list.add(typecontentObj.type,{
        "en":"updatedt",
        "cn":"更新时间",
        "mk":"0",
        "must":"1",
        "elemtype":"date2",
        "datatype":"DATETIME",
        "numrange":"",
        "format":"",
        "unit":"",
        "dict":""
    });
}
//创建数据元和数据集SQL语句
var deSql="insert into sys_mdm003(typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,'1',?,?,?)";
var dsSql="insert into sys_md_mm002(typecd,decd,en,cn,mk,must,dv,sorting,elemtype,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,'1',?,?,?)";
//循环typecontentObj.type，获取deSql,dsSql的批量插入参数
var deParams=[];
var dsParams=[];
var i=1;
for(r in typecontentObj.type){
    //deParams
    var _i=i;
    if(i<10){
        _i="00"+i;
    }else if(i>9&&i<100){
        _i="0"+i;
    }else{
        _i=i;
    }
    var _decd=dedir+"."+decode+"."+_i+".00";
    //日期时间类型，长度为空
    var _numrange=r.numrange;
    if(r.datatype=="DATETIME"){
        _numrange=null;
    }
    var _de_params=[dedir,_decd,r.en,r.cn,r.datatype,_numrange,r.format,r.unit,r.dict,null,dt,dt];
    list.add(deParams,_de_params);
    //dsParams
    var _ds_params=[dsdir,_decd,r.en,r.cn,'0',r.must,null,i-1,r.elemtype,null,dt,dt];
    list.add(dsParams,_ds_params);
    i=i+1;
}
//创建数据元和数据集
sql.updateBatch(deSql,deParams,"1");
sql.updateBatch(dsSql,dsParams,"1");
sql.commit();
//调接口创建物理表
var msg=http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"tableandindex","api":"createtable"},{"s":"d","typecd":dsdir,"did":did,"en":table_en,"cn":table_cn,"status":"1"});
if(msg.data.ret!="0"){
    //返回出错信息
    sys.printValue(msg);
    sys.setRetData(msg.data.ret,msg.data.msg);
    return;
}
//更新sys_bm003表此条记录的table_json字段
var table_json={"dedir":dedir,"dsdir":dsdir,"did":did,"en":table_en,"cn":table_cn};
var sqlUpd="update "+typecd_tbl+" set table_json=? where typecd=? and status='1'";
sql.update(sqlUpd,[sys.jsonFromInstance(table_json),typecd]);
// 更新缓存
var ModelCache = se.getCache(_CACHE_REGION_BIZ_MODEL_,typecd);
map.put(ModelCache,"table_json",sys.jsonFromInstance(table_json));
se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,ModelCache,0);
sys.setRetData("0");