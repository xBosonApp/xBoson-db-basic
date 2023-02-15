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
//判断数据库类型
var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
var sql;
var v = 2;
if(dbType == "01"){
  sql="select orgid as id, IFNULL(de0810013j,'--') as name, concat(orgid, '(', IFNULL(de0810013j,'--'), ')') as text from mdm_org where status='1'";
}else if(dbType == "02"){
  sql="select orgid as id, ISNULL(de0810013j,'--') as name, orgid + '(' + ISNULL(de0810013j,'--') + ')' as text from mdm_org where status='1'";
}else if(dbType == "03"){
  sql="select orgid as id, NVL(de0810013j,'--') as name, orgid ||'('|| NVL(de0810013j,'--') || ')' as text from mdm_org where status='1'";
}
sql.query(sql, null, "result");
sys.setRetData("0", "", "result");