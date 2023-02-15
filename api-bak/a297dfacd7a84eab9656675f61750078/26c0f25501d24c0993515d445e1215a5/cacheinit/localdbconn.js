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
var localDbInfo = se.localDb();
var url = localDbInfo["url"];
var user = localDbInfo["user"];
var pass = localDbInfo["password"];
var dbtype = localDbInfo["dbtype"];
var owner = localDbInfo["owner"];

var sqlUpd = "update sys_pl_drm_ds001 set owner=?,dbtype=?,url=?,user_name=?,pass=?,updatedt=? where did=?";
var paramUpd = [owner,dbtype,url,user,pass,sys.currentTimeString(),"00000000000000000000000000000000"];
sql.update(sqlUpd, paramUpd);
//更新缓存
//从缓存获取执行sql
var getSql="select did,owner orgid,url conn_url,user_name conn_user,pass conn_pwd,dbtype from  sys_pl_drm_ds001 where status='1' and did='00000000000000000000000000000000'";

//获取所有可用的数据服务连接
var cnt=sql.query(getSql,null);
var dataServices=sys.result["result"];
//缓存db连接...
for(r in dataServices){
    var orgid = r["orgid"];
    var did = r["did"];
    map.remove(r, "orgid");
    se.setCache(_CACHE_REGION_JDBC_CONNECTION_, orgid + ":" + did ,r, 0);
}

sys.setRetData("0");