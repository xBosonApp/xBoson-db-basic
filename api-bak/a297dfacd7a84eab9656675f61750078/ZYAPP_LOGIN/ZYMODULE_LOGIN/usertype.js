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
// usertype
// 获取用户类型，各种管理员或普通用户等
// 参数：openid

var openid = sys.request.openid;
var orgid = sys.request.org;
// var pid = sys.getUserPID(openid);
// var sql = "select adminflag from sys_userinfo where pid=? and status='1'";
// var param = [pid];
// var cnt=sql.query(sql, param);
// if(cnt<1){
//     sys.setRetData("2");
//     return;
// }
var adminFlag=sys.getUserAdminFlag(openid,orgid);
// var adminFlag=sys.getUserAdminFlag(openid);
sys.addRetData([{adminflag:adminFlag}],"result");
sys.setRetData("0","","result");