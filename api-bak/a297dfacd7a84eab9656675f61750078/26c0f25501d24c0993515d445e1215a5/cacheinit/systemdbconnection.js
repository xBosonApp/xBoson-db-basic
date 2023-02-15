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
// 清空已有缓存
se.delCache(_CACHE_REGION_JDBC_CONNECTION_);
//从缓存获取执行sql
var getSql=se.getCache(_CACHE_REGION_SYS_SQL_,"conn0001");

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
//设置缓存完成标记
se.setCache(_CACHE_REGION_JDBC_CONNECTION_,_CACHE_KEY_READY_,true,0);