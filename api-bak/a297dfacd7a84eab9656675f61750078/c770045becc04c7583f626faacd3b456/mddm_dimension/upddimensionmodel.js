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
//id:upddimensionmodel
//name:修改维度模型定义
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

if(typecd==null||typecd_parent==null||row_json==null||column_json==null||status==null){
    sys.setRetData("1");
    return;
}

//检查模型ID是否存在
if(sql.query("select 1 from sys_bm001 where typecd=?",[typecd])==0){
    sys.setRetData("2",typecd+"类别编码不存在");
    return;
}
if(sql.query("select table_json from sys_bm004 where typecd=?",[typecd])==0){
    sys.setRetData("2",typecd+"多维模型不存在");
    return;
}
//检查此多维模型是否创建了物理表
var table_json=sys.instanceFromJson(sys.result.result[0].table_json);
if(table_json!=null&&table_json.en!=null){
    sys.setRetData("2","此多维模型已创建了物理表，不可修改");
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

var sql="update sys_bm004 set tablesource=?,row_json=?,column_json=?,where_json=?,typecontent=?,status=?,mark=?,updatedt=? where typecd=?";
var params=[tablesource,row_json,column_json,where_json,typecontent,status,mark,dt,typecd];
sql.update(sql,params);
// 更新缓存
var getRes = "select a.typecd,b.typenm name,a.table_json,a.typecd_parent,a.tablesource,a.table_json,a.row_json,a.column_json,a.where_json,a.typecontent from sys_bm004 a,sys_bm001 b where a.typecd=? and a.typecd=b.typecd";
sql.query(getRes,[typecd],"modelR");
map.put(sys.result.modelR[0],"org",org);
map.put(sys.result.modelR[0],"model_type","bm004");
se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,sys.result.modelR[0],0);
sys.setRetData("0");