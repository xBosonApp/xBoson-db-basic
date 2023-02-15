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
//id:updviewmodal
//name:修改视图模型定义
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
var chkpk="select typecd,table_json from sys_bm003 where typecd=?";
if(sql.query(chkpk,[typecd],"chkpk_r")==0){
    sys.setRetData("2");
    return;
}else{
    //判断是否存在物理表
    if(sys.trim(sys.result.chkpk_r[0].table_json)!=""){
        sys.setRetData("1","此模型已创建了物理表，不可修改！");
        return;
    }
}
//调接口获取typecontent,sqlparams
var msg=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"mddm_view","api":"gene_info"},{"s":"d","did":did,"editingtype":editingtype,"jsondata_select":jsondata_select,"fromcontent":fromcontent,"jsondata_where":jsondata_where,"sel_whe_columns":sel_whe_columns,"sqltext":sqltext,"chart_type":chart_type,"first_is_x":first_is_x});

sys.printValue(msg);
var _cc=sql.metaData("select levels,count(menuid) from sys_menu group by levels");
    sys.printValue(_cc);
if(msg.data.ret!="0"){
    sys.setRetData(msg.data.ret,msg.data.msg);
    return;
}
if(msg.data.typecontent!=null){
    typecontent=sys.jsonFromInstance(msg.data.typecontent);
}

var ins="update sys_bm003 set did=?,editingtype=?,jsondata_select=?,fromcontent=?,jsondata_where=?,sel_whe_columns=?,sqltext=?,typecontent=?,status=?,mark=?,updatedt=?,onlychart=? where typecd=?";

var params=[did,editingtype,jsondata_select,fromcontent,jsondata_where,sel_whe_columns,sqltext,typecontent,status,mark,dt,onlychart,typecd];
sql.update(ins,params);
// 更新缓存
var getRes = "select a.typecd,b.typenm name,a.table_json,a.did,a.editingtype,a.jsondata_select,a.fromcontent,a.jsondata_where,a.sel_whe_columns,a.sqltext,a.typecontent,a.onlychart from sys_bm003 a,sys_bm001 b where a.typecd=? and a.typecd=b.typecd";
sql.query(getRes,[typecd],"modelR");
map.put(sys.result.modelR[0],"org",org);
map.put(sys.result.modelR[0],"model_type","bm003");
se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,sys.result.modelR[0],0);

sys.setRetData("0");