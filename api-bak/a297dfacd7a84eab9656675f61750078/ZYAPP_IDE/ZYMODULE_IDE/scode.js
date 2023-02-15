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

// 获取 API/API历史 内容
// 用户在 IDE 选择一个 API 请求显示内容。
// 参数：
//    contentid 或者 hisid
// http://localhost:8080/ds/ide/content?app=mdm&org=zr&s=d&openid=dean&contentid=&hisid=
// HTTP 请求参数
var contentId = sys.request.contentid;
var hisId = sys.request.hisid;

// 验证必要参数
if (contentId == null && hisId == null) {
  sys.setRetData("1");
  return;
}

var sqlApiContent = "";
var paramApiContent = [];
var returnKey = "content";
if (contentId != null && contentId != "") {
  sqlApiContent = "select api.contentid,api.content, api.stability, api.updatecmt, api.updatedt, person.de0201039 person from sys_api_content api left join mdm_personal_info person on api.pid = person.pid where contentid = ?";
  paramApiContent = [contentId];
} else if (hisId != null && hisId != "") {
  sqlApiContent = "select api.content, api.stability, api.updatecmt, person.de0201039 person, api.updatedt from sys_api_his_content api left join mdm_personal_info person on api.pid = person.pid where hisid = ?";
  paramApiContent = [hisId];
}

var cnt = sql.query(sqlApiContent, paramApiContent, returnKey);
if (cnt == 0) {
  sys.setRetData("2");
} else {
  //返回help_info字段
  sql.query("select help_info from sys_apis where contentid=?",[sys.result.content[0].contentid],"help_info_r");

  if(sys.size(sys.result.help_info_r)>0){
      map.put(sys.result.content[0],"help_info",sys.result.help_info_r[0].help_info);
  }
  sys.setRetData("0", "", returnKey);
}