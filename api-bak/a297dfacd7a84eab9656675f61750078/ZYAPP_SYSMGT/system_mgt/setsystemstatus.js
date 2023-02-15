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
  //接口名称：更改系统状态信息
  //接口URL： setsystemstatus
  // HTTP 请求参数
  var sysid = sys.request.sysid;
  var status = sys.request.status;

  var params=[status,sysid];
//sql语句
  if (sysid == null || status == null) {
    sys.setRetData("1");
    return;
  }
  var sqlUpdStatus = "update sys_system SET status = ? where sysid = ?";
  var paramStatus = [status,sysid];
  var updCount = sql.update(sqlUpdStatus,paramStatus);
  if (updCount == 0) {
    sys.setRetData("5");
    return;
  }else{
      //更新缓存
    var sysinfoSql=se.getCache(_CACHE_REGION_SYS_SQL_,"sys0002");
    var cnt=sql.query(sysinfoSql,[sysid],"sysinfo");
    var sysinfo=sys.result.sysinfo;
    if(cnt>0){
        se.setCache(_CACHE_REGION_SYSTEM_,sysid,sysinfo[0],0);
    }
  }
  sys.setRetData("0");