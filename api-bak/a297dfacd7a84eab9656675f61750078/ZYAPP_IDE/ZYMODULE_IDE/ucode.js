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
sys.authorization('api.ide.code.modify.functions()');

// HTTP 请求参数
var contentId = sys.request.contentid;
var content = sys.request.content;
var cmt = sys.request.updatecmt;
var openId = sys.request.openid;
var org = sys.request.org;
var updatedt = sys.request.updatedt;


// 验证必要参数
if(content == null){
    sys.setRetData("1","请填入一些代码！");
    return;
}
if (contentId == null || openId == null) {
  sys.setRetData("1");
  return;
}
//判断注释长度
if(sys.length(cmt) > 250){
    sys.setRetData("1","注释长度超过了250");
}

// 获取PID
var pId = sys.getUserPID(openId);

var hisId = sys.getUUID();

var sqlHisContent = "insert into sys_api_his_content (hisid, contentid, stability, updatecmt, pid, updatedt, content) select ?, contentid, stability, updatecmt, pid, updatedt, content from sys_api_content where contentid = ?";
var paramHisContent = [hisId, contentId];

// 根据请求数据更新 apis 数据
var sqlApi = "update sys_apis set updatedt = ? where contentid = ?";
var param = [sys.getCurrentTimeString(), contentId];

// 更新 api_content 数据
var sqlApiContent = "update sys_api_content SET content = ?, updatecmt = ?, pid = ?, updatedt = ? ";

//判断要修改的api的状态
var sqlSta = "select stability from sys_api_content where contentid=?";
sql.query(sqlSta,[contentId],"stability");
var stabi = sys.result.stability;
// if(stabi[0].stability=="50" || stabi[0].stability=="60"){
    sqlApiContent = sqlApiContent + ", stability = '00' where contentid = ?";
// }else{
//     sqlApiContent = sqlApiContent + " where contentid = ?";
// }


var updHisContentCnt = sql.update(sqlHisContent, paramHisContent, "1");
if (updHisContentCnt == 0) {
  sql.rollback();
  sys.setRetData("5");
  return;
}
var updApiCnt = sql.update(sqlApi, param, "1");
if (updApiCnt == 0) {
  sql.rollback();
  sys.setRetData("5");
  return;
}
var updApiContentCnt = sql.update(sqlApiContent, paramApiContent, "1");
if (updApiContentCnt == 0) {
  sql.rollback();
  sys.setRetData("5");
  return;
}

// 提交事务
sql.commit();


sys.setRetData("0");