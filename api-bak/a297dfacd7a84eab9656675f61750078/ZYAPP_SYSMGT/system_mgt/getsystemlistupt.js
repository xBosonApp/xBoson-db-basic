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
//接口编写人:王莹莹
  //接口URL： getsystemlistupt

  // HTTP 请求参数
  var sysid = sys.request.sysid;
  
  //查询 sys_server 表
 if (sysid != null) {
  var sql = "select s.sysid,s.sysnm,s.ip,s.port,s.uri,s.inner_flag,s.pid,s.sys_desc,s.status,s.createdt,s.updatedt,(SELECT de0201039 FROM mdm_personal_info WHERE pid=s.pid) de0201039  from sys_system s where sysid = ?";
    var param = [sysid];
    var query = sql.query(sql,param);
    sys.setRetData("0","","result");
  }else {
    sys.setRetData("1");
  }