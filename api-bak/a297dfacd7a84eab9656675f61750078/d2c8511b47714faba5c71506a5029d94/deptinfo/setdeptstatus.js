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
  //测试URI：http://192.168.7.120:8088/ds/api/setdeptstatus?app=MDM&mod=deptinfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=8BBA5A60F1401532DA446580F91D8408BAEA85AEECC8E36B7F536B59F6E1A4B9&s=d&mdk=bee7b095e9d3469ca2ed1f78e6721c6f&userkeylocal=77d69c8dd4ac468db299f31fe02ac5b4&status=1&deptid=taylor
  //接口名称：更改部门状态信息
  //接口URL： setdeptstatus
  // HTTP 请求参数
  var deptid = sys.request.deptid;
  var status = sys.request.status;

  var params=[status,deptid];
//sql语句
  if (deptid == null || status == null) {
    sys.setRetData("1");
    return;
  }
  var sqlUpdStatus = "update mdm_dept SET status = ? where deptid = ?";
  var paramStatus = [status,deptid];
  var updCount = sql.update(sqlUpdStatus,paramStatus);
  if (updCount == 0) {
    sys.setRetData("5");
    return;
  }
  sys.setRetData("0");