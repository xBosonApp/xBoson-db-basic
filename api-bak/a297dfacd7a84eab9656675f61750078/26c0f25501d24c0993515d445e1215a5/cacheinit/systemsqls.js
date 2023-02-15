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
// 1. 清空缓存
se.delCache(_CACHE_REGION_SYS_SQL_);
//获取所有sql语句
var getallsystemsqls="select sqlid, content from sys_sqls";
var cnt=sql.query(getallsystemsqls,[],"allsqls");
//缓存sql语句开始
var allsqls=sys.result.allsqls;
for(s in allsqls){
    se.setCache(_CACHE_REGION_SYS_SQL_,s.sqlid,s.content,0);
}
se.setCache(_CACHE_REGION_SYS_SQL_,_CACHE_KEY_READY_,true,0);