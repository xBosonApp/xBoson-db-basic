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

//id:setsqlupt
//name:同步sql
//编写人：陈棋
//测试url：192.168.7.120/ds/api/setsqlupt?openid=admin&app=zyapp_sysmgt&mod=sys_sql_mgt&org=zr&s=d&

var sqlId=sys.request.sqlid;
if (sqlId == null) {
  sys.setRetData("1");
  return;
}
var sqlquery="SELECT sqlid,content,sql_desc,sql_group From sys_sqls WHERE sqlid = ?";
var paramSel=[sqlId];
sql.query(sqlquery,paramSel);
sys.setRetData("0","","result");