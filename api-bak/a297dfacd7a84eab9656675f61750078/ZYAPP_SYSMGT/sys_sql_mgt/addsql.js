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
//id:addsql
//name:创建SQL
//编写人：陈棋
//测试url：192.168.7.120/ds/api/addsql?openid=admin&app=zyapp_sysmgt&mod=sys_sql_mgt&org=zr&s=d&

var sqlId=sys.request.sqlid;
var content = sys.request.content;
var sql_Desc= sys.request.sql_desc;
var sql_Group = sys.request.sql_group;
  if (sqlId == null) {//验证必要条件
    sys.setRetData("1");
    return;
  }
  var sqlSel = "SELECT COUNT(*) CNT FROM sys_sqls WHERE sqlid = ?";
  var paramSel = [sqlId];   
  var resultCounta = sql.query(sqlSel,paramSel,"sqlset");

  var selResult = sys.result.sqlset;
  var selCount = "";
  for (r in selResult) {
    selCount = r.cnt;
  }
  if (selCount != "0") {//已存在该主键
    sys.setRetData("6");
    return;
  }

  var sqlIns = "INSERT INTO sys_sqls (sqlid,content,sql_desc,sql_group)VALUES(?,?,?,?)";
  var paramIns = [sqlId,content,sql_Desc,sql_Group];
  var insCount =sql.update(sqlIns,paramIns);
  if (insCount == 0) {
    sys.setRetData("5");
    return;
  }
  //设置缓存
  se.setCache(_CACHE_REGION_SYS_SQL_,sqlId,content,0);
//   sys.setSystemSqlCache(sqlId);
  sys.setRetData("0");