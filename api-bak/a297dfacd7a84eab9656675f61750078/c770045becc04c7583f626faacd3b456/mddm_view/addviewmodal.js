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
//id:addviewmodal
//name:添加视图模型定义
var org=sys.request.org;
var typecd=sys.request.typecd;
var did=sys.request.did;
var onlychart=sys.request.onlychart;//图表专用
var editingtype=sys.request.editingtype; //"1"为手动编辑SQL语句,"0"为非手动编辑
var jsondata_select=sys.request.jsondata_select;    //select部分的JSON
var fromcontent=sys.request.fromcontent;    //from字符串
var jsondata_where=sys.request.jsondata_where;  //where部分的JSON
var sel_whe_columns=sys.request.sel_whe_columns;  //选择的表和列
var sqltext=sys.request.sqltext;        //sql语句
var status=sys.request.status;
var mark=sys.request.mark;
var chart_type=sys.request.chart_type;  //手写SQL的图表类型
var first_is_x=sys.request.first_is_x;  //手写SQL的第一列是否为X轴
var dt=sys.currentTimeString();
var typecontent="";   //sql参数

if(chart_type==null){
    chart_type="pie,bar,line";
}
if(status==null){
    status="1";
}
if(onlychart==null){
    onlychart="0";
}
if(typecd==null||did==null||editingtype==null||sqltext==null){
    sys.setRetData("1");
    return;
}
//检查主键是否存在
var chkpk="select typecd from sys_bm003 where typecd=?";
if(sql.query(chkpk,[typecd],"chkpk_r")>0){
    sys.setRetData("2","主键重复");
    return;
}

//调接口获取typecontent,sqlparams
var msg=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"mddm_view","api":"gene_info"},{"s":"d","did":did,"editingtype":editingtype,"jsondata_select":jsondata_select,"fromcontent":fromcontent,"jsondata_where":jsondata_where,"sel_whe_columns":sel_whe_columns,"sqltext":sqltext,"chart_type":chart_type,"first_is_x":first_is_x});

sys.printValue(msg);
if(msg.data.ret!="0"){
    sys.setRetData(msg.data.ret,msg.data.msg);
    return;
}
if(msg.data.typecontent!=null){
    typecontent=sys.jsonFromInstance(msg.data.typecontent);
}

var ins="insert into sys_bm003(typecd,did,editingtype,jsondata_select,fromcontent,jsondata_where,sel_whe_columns,sqltext,typecontent,status,mark,createdt,updatedt,onlychart) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";


var params=[typecd,did,editingtype,jsondata_select,fromcontent,jsondata_where,sel_whe_columns,sqltext,typecontent,status,mark,dt,dt,onlychart];
sql.update(ins,params);
// 为所有开发角色加上模型权限
var typecdArr = [typecd];
typecdArr = sys.jsonFromInstance(typecdArr);
var GetRes = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"dev_auth"},{"typecdArr":typecdArr});
if(GetRes["data"].ret != "0"){
    sys.setRetData(GetRes["data"].ret,GetRes["data"].msg);
    return;
}
// 更新缓存
var getRes = "select a.typecd,b.typenm name,a.table_json,a.did,a.editingtype,a.jsondata_select,a.fromcontent,a.jsondata_where,a.sel_whe_columns,a.sqltext,a.typecontent from sys_bm003 a,sys_bm001 b where a.typecd=? and a.typecd=b.typecd";
sql.query(getRes,[typecd],"modelR");
map.put(sys.result.modelR[0],"org",org);
map.put(sys.result.modelR[0],"model_type","bm003");
se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,sys.result.modelR[0],0);
sys.setRetData("0");