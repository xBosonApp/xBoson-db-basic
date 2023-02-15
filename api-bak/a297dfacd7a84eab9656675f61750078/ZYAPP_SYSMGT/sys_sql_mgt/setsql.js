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
//id:setsql
  //name:修改sql
  //编写人：陈棋
  //测试url：192.168.7.120/ds/api/setsql?openid=admin&app=zyapp_sysmgt&mod=sys_sql_mgt&org=zr&s=d&
  var sqlId = sys.request.sqlid;
  var sql_Desc = sys.request.sql_desc;
  var content = sys.request.content;
  var sql_Group = sys.request.sql_group;
  if (sqlId == null) {
    sys.setRetData("1");
    return;
  }
  var sqlUpd = "UPDATE sys_sqls SET content = ?,sql_desc = ?,sql_group = ? where sqlid = ?";
  var paramUpd = [content,sql_Desc,sql_Group,sqlId];
  var updCount = sql.update(sqlUpd,paramUpd);
  if (updCount == 0) {
    sys.setRetData("5");
  }else {
    se.setCache(_CACHE_REGION_SYS_SQL_,sqlId,content,0);
    // sys.setSystemSqlCache(sqlId);
    sys.setRetData("0");
  }