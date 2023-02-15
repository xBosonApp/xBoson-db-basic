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
//保留一周日志
//系统日志
var sql1 = "delete from sys_pl_log_system where log_time<date_sub(curdate(),interval 7 day)";
//系统异常
var sql2 = "delete from sys_pl_log_system_error where log_time<date_sub(curdate(),interval 7 day)";
// 登陆访问
var sql3 = "delete from sys_pl_log_access where log_time<date_sub(curdate(),interval 7 day)";
//未授权日志
var sql4 = "delete from sys_pl_log_unauth where log_time<date_sub(curdate(),interval 7 day)";
//	请求日志
//var sql5 = "delete from sys_pl_log_request where log_time<date_sub(curdate(),interval 7 day)";
var sql5 = 'delete from sys_pl_log_request where createdt < date_sub(curdate(), interval 7 day)'

sql.update(sql1,[],"r1");
sql.update(sql2,[],"r2");
sql.update(sql3,[],"r3");
sql.update(sql4,[],"r4");
sql.update(sql5,[],"r5");
var ls = [];
list.add(ls,sys.result.r1);
list.add(ls,sys.result.r2);
list.add(ls,sys.result.r3);
list.add(ls,sys.result.r4);
list.add(ls,sys.result.r5);
sys.addRetData(ls,"result");
sys.setRetData("0","","result");