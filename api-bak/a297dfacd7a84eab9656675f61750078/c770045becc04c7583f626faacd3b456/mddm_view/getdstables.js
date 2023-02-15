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
//id:getdstables
//name:获取指定数据源的表
var did=sys.request.did;
var msg;

if(did==null){
    sys.setRetData("1");
    return;
}
//存储表
//result[0].table_name 表名，result[0].table_comment 表注释
var result=[];
//如果是平台数据源，且为非平台机构，则从sys_md_mm003表里获取表
if(did=="00000000000000000000000000000000" && !se.isPlatformOrg()){
    var gettbl="select typecd,en table_name,cn table_comment from sys_md_mm003 where did=? and status='1'";
    sql.query(gettbl,[did]);
    result=sys.result.result;
}
//是外部数据源
else{
    //获取did的当前schema
    var schema_name=null;
    var req_msg=http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"outdatasource","api":"getouttables"},{"did":did});
    msg=req_msg.data;
    if(msg.ret!="0"){
        sys.setRetData(msg.ret,msg.msg);
        return;
    }
    schema_name=msg.result[0].schema_name;
    //获取外部数据源表
    req_msg=http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"outdatasource","api":"getouttables"},{"did":did,"schema_name":schema_name});
    msg=req_msg.data;
    if(msg.ret!="0"){
        sys.setRetData(msg.ret,msg.msg);
        return;
    }
    result=msg.result;
}

//返回select2数据源
var data = [];
for(r in result){
    var _en=r.table_name;
    var _cn=r.table_comment;
    if(sys.trim(_cn)==""){
        _cn=_en;
    }
    var _tmp = {"id":_en,"name":_cn+"("+_en+")","cn_name":_cn,"text":_en+"("+_cn+")"};
    list.add(data,_tmp);
}
sys.addRetData(data,"data");
sys.addRetData(result,"result");
sys.setRetData("0","","result","data");