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
//id:adddimensionmodel
//name:添加维度模型定义
var org=sys.request.org;
var typecd=sys.request.typecd;
var typecd_parent=sys.request.typecd_parent;
var tablesource=sys.request.tablesource;    //数据来源的表名
var row_json=sys.request.row_json;
var column_json=sys.request.column_json;
var where_json=sys.request.where_json;
var status='1';
var mark=null;
var dt=sys.currentTimeString();

if(typecd==null||typecd_parent==null||row_json==null||column_json==null){
    sys.setRetData("1");
    return;
}
//调接口获取typecontent
var typecontent="";
var msg=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"mddm_dimension","api":"gene_info"},{"s":"d","typecd_parent":typecd_parent,"tablesource":tablesource,"row_json":row_json,"column_json":column_json,"where_json":where_json});
if(msg.code==200 && msg.data.ret=="0"){
    typecontent=msg.data.typecontent;
}else{
    sys.printValue(msg);
    sys.setRetData(msg.data.ret,msg.data,msg);
    return;
}

var sql="insert into sys_bm004(typecd,typecd_parent,tablesource,row_json,column_json,where_json,typecontent,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?)";
var params=[typecd,typecd_parent,tablesource,row_json,column_json,where_json,typecontent,status,mark,dt,dt];
sql.update(sql,params);

// 为所有开发角色加上模型权限
var typecdArr = [typecd];
typecdArr = sys.jsonFromInstance(typecdArr);
var GetRes = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"dev_auth"},{"typecdArr":typecdArr});
sys.printValue(GetRes);
if(GetRes["data"].ret != "0"){
    sys.setRetData(GetRes["data"].ret,GetRes["data"].msg);
    return;
}
// 更新缓存
var getRes = "select a.typecd,b.typenm name,a.typecd_parent,a.tablesource,a.table_json,a.row_json,a.column_json,a.where_json,a.typecontent from sys_bm004 a,sys_bm001 b where a.typecd=? and a.typecd=b.typecd";
sql.query(getRes,[typecd],"modelR");
map.put(sys.result.modelR[0],"org",org);
map.put(sys.result.modelR[0],"model_type","bm004");
se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,sys.result.modelR[0],0);

sys.setRetData("0");