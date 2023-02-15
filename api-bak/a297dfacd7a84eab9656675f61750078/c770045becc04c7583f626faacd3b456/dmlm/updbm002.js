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
//id:addbm002
//name:添加操纵定义
var org=sys.request.org;
var modolcd=sys.request.modolcd;    //业务模型id
var modolnm=sys.request.modolnm;    //业务模型名称
var dstypecd=sys.request.typecd;    //数据集模型id
var did=sys.request.did;            //数据源id
var tablenm=sys.request.tablenm;    //表名
var sqltype=sys.request.sqltype;    //sql操纵类型（D,U,I）
var status=sys.request.status;
var mark=sys.request.mark;
var jsondata_str=sys.request.jsondata;
var isui=sys.request.isui;  //是否用于动态ui
var dt=sys.currentTimeString();

if(modolnm==null || dstypecd==null || sqltype==null || jsondata_str==null || status==null || modolcd==null || tablenm==null){
    sys.setRetData("1");
    return;
}
//检查主键是否存在
var checkpk="select modolcd from sys_bm002 where modolcd=?";
if(sql.query(checkpk,[modolcd])==0){
    sys.setRetData("2","业务模型编码不存在！");
    return;
}
// 检查模型ID是否存在
// var check_res = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"unique_check"},{"typecd":modolcd});
// sys.printValue(check_res);
// if(check_res["data"].ret == "0"){
//     if(check_res["data"].result[0].isUnique){
//     }else{
//         sys.setRetData("2","模型ID已存在，请更换模型ID");
//         return;
//     }
// }else{
//     sys.setRetData(check_res["data"].ret,check_res["data"].msg);
//     return;
// }
//调接口生成SQL语句
var msg=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"dmlm","api":"generating_sql"},{"s":"d","typecd":dstypecd,"sqltype":sqltype,"did":did,"tablenm":tablenm,"jsondata":jsondata_str}).data;
if(msg.ret != "0"){
    sys.setRetData(msg.ret,msg.msg);
    return;
}
//测试
// sys.printValue(msg);
var sqltext="";
var sqlparams="";
var typecontent="";
if(msg.result!=null && sys.size(msg.result)>0){
    sqltext=msg.result[0].sqltext;
    sqlparams=msg.result[0].sqlparams;
    typecontent=msg.result[0].typecontent;
}else{
    sys.setRetData("1","生成SQL语句异常");
    return;
}

var ins="update sys_bm002 set modolnm=?,did=?,tablenm=?,sqltype=?,sqltext=?,sqlparams=?,jsondata=?,typecontent=?,isui=?,status=?,mark=?,updatedt=? where modolcd=?";

//获取物理表和数据源id
// var tablenmdid=sys.split(tablenm,",");
// if(sys.size(tablenmdid)!=2){
//     sys.setRetData("2","获取物理表参数异常");
//     return;
// }
// tablenm=tablenmdid[0];
// var did=tablenmdid[1];

var params=[modolnm,did,tablenm,sqltype,sqltext,sqlparams,jsondata_str,typecontent,isui,status,mark,dt,modolcd];

sql.update(ins,params);

// 更新缓存
var getRes = "select modolcd typecd,modolnm name,dstypecd,did,tablenm,sqltype,sqltext,sqlparams,typecontent,isui from sys_bm002 where modolcd=?";
sql.query(getRes,[modolcd],"modelR");
map.put(sys.result.modelR[0],"org",org);
map.put(sys.result.modelR[0],"model_type","bm002");
se.setCache(_CACHE_REGION_BIZ_MODEL_,modolcd,sys.result.modelR[0],0);

sys.setRetData("0");