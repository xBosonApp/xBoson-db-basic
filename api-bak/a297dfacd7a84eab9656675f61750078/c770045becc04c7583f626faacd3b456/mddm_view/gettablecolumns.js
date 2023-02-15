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
//id:gettablecolumns
//name:获取指定表列信息
var org=sys.request.org;
var did=sys.request.did;
var table_name=sys.request.table_name;

if(did==null || table_name==null){
    sys.setRetData("1");
    return;
}
//查看此表在平台是否有数据集
var typecd=null;
var chkds="select typecd from sys_md_mm003 where en=? and did=? and status='1'";
var cnt=sql.query(chkds,[table_name,did],"typecd_r");
if(did=="00000000000000000000000000000000" && cnt==0){
    // 没有数据集的表
    // sys.setRetData("2");
    // return;
}
if(cnt!=0){
    typecd=sys.result.typecd_r[0].typecd;
}
//获取表的列信息
    //result[0].en 列英文名，result[0].cn 列中文名，result[0].datatype 列数据类型，
    //result[0].elemtype 元素标签类型，result[0].numrange 列数据长度，result[0].dict 列的数据字典
var result=[];

//如果typecd不为null，则从sys_md_mm002和sys_mdm003里获取表的列信息
if(typecd != null){
    // //获取表的typecd
    // var typecd=null;
    // var getTcd="select typecd from sys_md_mm003 where en=? and did=? and status='1'";
    // var cnt=sql.query(getTcd,[table_name,did],"typecd_r");
    // if(cnt==0){
    //     sys.setRetData("2");
    //     return;
    // }
    // typecd=sys.result.typecd_r[0].typecd;
    //根据typecd获取表的列信息
    var getCinfo="select a.en,a.cn,a.elemtype,b.datatype,b.numrange,b.dict from sys_md_mm002 a,sys_mdm003 b where a.typecd=? and a.decd=b.decd and a.status='1' and b.status='1' order by a.sorting";
    sql.query(getCinfo,[typecd],"cinfo_r");
    result=sys.result.cinfo_r;
    //类型转换
    // var typetrans=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0041.1");
    // for(r in result){
    //     for(t in typetrans){
    //       if(r.datatype==t.id){
    //           map.put(r,"datatype",t.name);
    //       }
    //     }
    // }
}
else{
    //获取did的数据库类型
    var dbtype=se.dbType();
    var dsource=se.getCache(_CACHE_REGION_JDBC_CONNECTION_,org+":"+did);
    if(dbtype==null || dbtype==""){
       sys.setRetData("2","获取数据库类型异常！");
       return;
    }
    //获取did的当前schema
    var schema_name=null;
    var req_msg=http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"outdatasource","api":"getouttables"},{"did":did});
    var msg=req_msg.data;
    if(msg.ret!="0"){
        sys.setRetData(msg.ret,msg.msg);
        return;
    }
    schema_name=msg.result[0].schema_name;
    //获取外部数据源表
    req_msg=http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"outdatasource","api":"getouttablecolumns"},{"did":did,"table_schema":schema_name,"table_name":table_name});
    msg=req_msg.data;
    if(msg.ret!="0"){
        sys.setRetData(msg.ret,msg.msg);
        return;
    }
    result=msg.result;
    //类型转换数据字典
    // var typetrans=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0041.1");
    var outToPlat=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+dbtype+"3");
    for(r in result){
        if(r.character_maximum_length != null && r.character_maximum_length != ""){
            map.put(r,"numrange",r.character_maximum_length);
        }else if(r.numeric_precision != "" && r.numeric_scale != ""){
            map.put(r,"numrange",r.numeric_precision+","+r.numeric_scale);
        }
        map.put(r,"en",r.column_name);
        map.put(r,"cn",r.column_comment);
        //类型转换
        var _tmp=null;
        //外部数据源类型转平台数据类型
        for(t in outToPlat){
           if(sys.toLowerCase(t.id)==sys.toLowerCase(r.data_type)){
               _tmp=t.name;
           }
        }
        //类型转换
        // for(t in typetrans){
        //   if(sys.toLowerCase(_tmp)==sys.toLowerCase(t.id)){
        //       _tmp=t.name;
        //   }
        // }
        map.put(r,"datatype",_tmp);
        map.put(r,"dict","");
        map.put(r,"elemtype","");
    }
}
//修改cn字段
for(r in result){
    if(r.cn==null||sys.trim(r.cn)==""){
        map.put(r,"cn_name",r.en);
    }else{
        map.put(r,"cn_name",r.cn);
    }
    map.put(r,"cn",r.cn+"("+r.en+")");
}
sys.addRetData(result,"result");
sys.setRetData("0","","result");