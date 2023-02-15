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
  //测试URI：http://192.168.7.120:8088/ds/api/setorgstatus?app=mdm&mod=orginfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=D9FFCE321C12A3ADE69B734CBF4CD9722E4BC7445C39F3D7A43C6788DB7E0B3D&s=d&mdk=3ee3341ea05541e1a50fcf0877dad850&userkeylocal=27bcc0f1d17649828a95e9016b41778a&status=0&orgid=wyyceshi
  //接口名称：更改机构状态信息
  //功能说明：根据主键查询到机构信息，更改其状态信息
  //接口URL： setorgstatus
  // HTTP 请求参数
  var orgid = sys.request.orgid;
  var status = sys.request.status;

  var params=[status,orgid];
//sql语句
  if (orgid == null || status == null) {
    sys.setRetData("1");
    return;
  }
  var sqlUpdStatus = "update mdm_org SET status = ? where orgid = ?";
  var paramStatus = [status,orgid];
  var updCount = sql.update(sqlUpdStatus,paramStatus);
  if (updCount == 0) {
    sys.setRetData("5");
    return;
  }
  sys.setRetData("0");