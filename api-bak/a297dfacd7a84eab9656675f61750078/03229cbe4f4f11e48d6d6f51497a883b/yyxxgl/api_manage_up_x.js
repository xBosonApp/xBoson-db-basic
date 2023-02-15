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
//api上线
var org = sys.request.org;
var nodes = sys.request.nodesRes;
var params = [];
var inidstr = "";
var dt = sql.currentDBTimeString();
var sqls =" ";

if(null==nodes){ sys.setRetData("0","未执行任何修改！"); return ;}

var nodesp = sys.split(nodes,",");
for(i in nodesp) {
    var data = [];
    var tmp = sys.split(i,"--");
    list.add(data,dt);
    list.add(data,tmp[0]);
    list.add(data,tmp[1]);
    list.add(data,tmp[2]);
    list.add(params,data);
    inidstr = inidstr +",'"+ i + "'";
}

sqls =" UPDATE sys_api_content SET stability='50',updatedt=? WHERE contentid = (SELECT  contentid FROM sys_apis WHERE appid=? AND moduleid=? AND apiid=? ) ";
sql.updateBatch(sqls, params);

inidstr = sys.subString(inidstr,1);
//判断数据库类型
var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
if (dbType == "01"){
  sqls = "select appid,moduleid,apiid,content,zip from sys_apis a left join sys_api_content b on a.contentid = b.contentid and a.status='1' where concat(appid,'--',moduleid,'--',apiid) in ( "+inidstr+" ) ";
}
else if(dbType == "02"){
  sqls = "select appid,moduleid,apiid,content,zip from sys_apis a left join sys_api_content b on a.contentid = b.contentid and a.status='1' where appid + '--'+ moduleid+ '--'+ apiid in ( "+inidstr+" ) "; 
}
else if(dbType == "03"){
  sqls = "select appid,moduleid,apiid,content,zip from sys_apis a left join sys_api_content b on a.contentid = b.contentid and a.status='1' where appid|| '--'|| moduleid|| '--'|| apiid  in ( "+inidstr+" ) ";  
}

if(""!=inidstr){
  sql.query(sqls,null,"result");
  var results = sys.result["result"];
  
  for(r in results){
    var contentList = [r.content, org, r.zip];
    se.setCache(_CACHE_REGION_API_,sys.toLowerCase(r["appid"]+r["moduleid"]+r["apiid"]),contentList,0);
    se.sendApiPublish(r.appid, r.moduleid, r.apiid);
  }
}

sys.setRetData("0");