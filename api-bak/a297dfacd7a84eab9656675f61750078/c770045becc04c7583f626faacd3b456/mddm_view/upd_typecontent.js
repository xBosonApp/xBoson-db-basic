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
var typecd=sys.request.modolcd;
var typecontent=sys.request.typecontent;
var org=sys.request.org;

if(typecd==null||typecontent==null){
    sys.setRetData("1");
    return;
}
//检查typecd是否存在
if(sql.query("select 1 from sys_bm001 where typecd=?",[typecd])==0){
    sys.setRetData("2",typecd+"类别编码不存在");
    return;
}
var flg="";
var sql1="select typecd from sys_bm003 where typecd=?"; //多维模型-数据视图
var sql2="select typecd from sys_bm004 where typecd=?"; //多维模型-维度视图

if(sql.query(sql1,[typecd])==1){
    flg="S";
}else if(sql.query(sql2,[typecd])==1){
    flg="SS";
}else{
    sys.setRetData("2",typecd+"模型不存在");
    return;
}
//检查此视图模型是否创建了物理表
var table_json=sys.instanceFromJson(sys.result.result[0].table_json);
if(table_json!=null&&table_json.en!=null){
    sys.setRetData("2","此模型已创建了物理表，不可修改");
    return;
}

//检查typecontent是否包含type和search
var typecontentObj=sys.instanceFromJson(typecontent);
if(typecontentObj.type==null||typecontentObj.search==null){
    sys.setRetData("2","typecontent格式错误");
    return;
}

var sql3="update sys_bm003 set typecontent=? where typecd=?";
var sql4="update sys_bm004 set typecontent=? where typecd=?";
var params=[typecontent,typecd];
if(flg=="S"){
    sql.update(sql3,params);
    // 更新缓存
    var getRes = "select a.typecd,b.typenm name,a.table_json,a.did,a.editingtype,a.jsondata_select,a.fromcontent,a.jsondata_where,a.sel_whe_columns,a.sqltext,a.typecontent from sys_bm003 a,sys_bm001 b where a.typecd=? and a.typecd=b.typecd";
    sql.query(getRes,[typecd],"modelR");
    map.put(sys.result.modelR[0],"org",org);
    map.put(sys.result.modelR[0],"model_type","bm003");
    se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,sys.result.modelR[0],0);
    
    sys.setRetData("0");
}else if(flg=="SS"){
    sql.update(sql4,params);
    
    // 更新缓存
    var getRes = "select a.typecd,b.typenm name,a.table_json,a.typecd_parent,a.tablesource,a.table_json,a.row_json,a.column_json,a.where_json,a.typecontent from sys_bm004 a,sys_bm001 b where a.typecd=? and a.typecd=b.typecd";
    sql.query(getRes,[typecd],"modelR");
    map.put(sys.result.modelR[0],"org",org);
    map.put(sys.result.modelR[0],"model_type","bm004");
    se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,sys.result.modelR[0],0);
    
    sys.setRetData("0");
}