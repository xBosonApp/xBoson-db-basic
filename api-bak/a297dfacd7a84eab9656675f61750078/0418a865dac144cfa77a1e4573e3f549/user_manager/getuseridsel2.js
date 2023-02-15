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
var mailAtel="%"+sys.request.mailAtel+"%";

//判断数据库类型
var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
var sql1;
if(dbType == "01"){
     sql1="select b.userid as id, IFNULL(a.de0201039,'--') as name, a.de0201039 as text  from mdm_personal_info a , sys_userinfo b where a.pid=b.pid and a.de0201010 like ? or a.de0201012 like ? or b.userid like ?";
}else if(dbType == "02"){
    sql1="select b.userid as id, ISNULL(a.de0201039,'--') as name, a.de0201039 as text  from mdm_personal_info a , sys_userinfo b where a.pid=b.pid and a.de0201010 like ? or a.de0201012 like ? or b.userid like ?";
}else if(dbType == "03"){
     sql1="select b.userid as id, NVL(a.de0201039,'--') as name, a.de0201039 as text  from mdm_personal_info a , sys_userinfo b where a.pid=b.pid and a.de0201010 like ? or a.de0201012 like ? or b.userid like ?";
}

var param=[mailAtel,mailAtel,mailAtel];
sql.query(sql1,param,"result");
sys.setRetData("0","","result");