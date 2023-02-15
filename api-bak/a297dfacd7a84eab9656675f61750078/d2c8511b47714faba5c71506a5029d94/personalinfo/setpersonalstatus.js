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
//接口编写人：王莹莹
  //测试URI：http://192.168.7.223:8080/ds/api/setpersonalstatus?app=MDM&org=&mod=EWATERWBS&s=d&openid=admin&app=mdm&mod=personalinfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=B8AF0D4A3A0F8FAA947169B79EDB6924F394F18008D033CA8687B3D624E62D5A&s=d&userkeylocal=1a6adf01f4b14af4a783acdabd67f129
  //waterricekcd=001&w&status=0
  //接口名称：更改个人状态信息
  //功能说明：根据主键查询到个人信息，更改其状态信息
  //接口URL： setpersonalstatus
  // HTTP 请求参数
  var pid = sys.request.pid;
  var status = sys.request.status;

  var params=[status,pid];
//sql语句
  if (pid == null || status == null) {
    sys.setRetData("1");
    return;
  }
  var sqlUpdStatus = "update mdm_personal_info SET status = ? where pid = ?";
  var paramStatus = [status,pid];
  var updCount = sql.update(sqlUpdStatus,paramStatus);
  if (updCount == 0) {
    sys.setRetData("5");
    return;
  }
  sys.setRetData("0");