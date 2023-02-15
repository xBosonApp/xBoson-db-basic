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
// 清空api缓存
se.delCache(_CACHE_REGION_API_);
//获取release的api
// var releaseApisSql="select api.appid,api.moduleid,api.apiid,content.content from sys_api_release api join sys_api_content_release content on api.contentid=content.contentid join sys_pl_biz_application biz on biz.applicationid = api.applicationid and biz.status='1' and biz.biz_status='20' where api.status='1' ";
//获取所有初始化db的开发商机构
var orgs=se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_V_);
var releaseApisSql = se.getCache(_CACHE_REGION_SYS_SQL_, "ide0004");
if(releaseApisSql==null){
  se.setCache(_CACHE_REGION_API_,_CACHE_KEY_READY_,false,0);
  return;
}

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

for(org in orgs){
  var tmpSql = sys.replace(releaseApisSql, "sys_apps", org+".sys_apps");
  tmpSql = sys.replace(tmpSql, "sys_modules", org+".sys_modules");
  tmpSql = sys.replace(tmpSql, "sys_apis", org+".sys_apis");
  tmpSql = sys.replace(tmpSql, "sys_api_content", org+".sys_api_content");
  tmpSql = sys.replace(tmpSql, "sys_api_his_content", org+".sys_api_his_content");
  sys.printValue("vvvvvvvvvvvv"+tmpSql+"vvvvvvvvvvvv");
  
  sql.query(tmpSql, null);
  var releaseApis=sys.result["result"];
  //设置缓存
  for(r in releaseApis){
    var contentList = [r["content"], org, r.zip];
    se.setCache(_CACHE_REGION_API_,sys.toLowerCase(r["appid"]+r["moduleid"]+r["apiid"]),contentList,0);
  }
}

se.setCache(_CACHE_REGION_API_,_CACHE_KEY_READY_,true,0);
// sql.query(releaseApisSql,[]);
// var releaseApis=sys.result.result;
// //设置api缓存
// for(r in releaseApis){
//     se.setCache(_CACHE_REGION_COMM_API_,sys.toLowerCase(r.appid+r.moduleid+r.apiid),r.content,0);
// }