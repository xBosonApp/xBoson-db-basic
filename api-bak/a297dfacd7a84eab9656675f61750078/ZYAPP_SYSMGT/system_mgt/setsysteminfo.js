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
//王莹莹
 // HTTP 请求参数
  var sysid = sys.request.sysid;
  var sysnm = sys.request.sysnm;
  var ip = sys.request.ip;
  var port = sys.request.port;
  var uri = sys.request.uri;
  var inner_flag = sys.request.inner_flag;
  var orgid = sys.request.org;
  var pid = sys.request.pid;
  var sys_desc = sys.request.sys_desc;
  var status = sys.request.status;
  

 //更改sys_system表
//判断不为空
 if (sysid == null || sysnm == null || status ==null) {
    sys.setRetData("1");
    return;
  }
var sqlM_B_CUpd1 = "update sys_system set sysnm=?,ip=?,port=?,uri=?,inner_flag=?,pid=?,sys_desc=?,status =? ";
var sqlM_B_CUpd2 = "";
var sqlWhere = " where sysid = ?";
var paramUpd = [sysnm,ip,port,uri,inner_flag,pid,sys_desc,status];
//获取当前时间
sqlM_B_CUpd2 = sqlM_B_CUpd2 + ",updatedt = ?";
 @paramUpd.add(sys.currentTimeString());
var sqlM_B_CUpd = sqlM_B_CUpd1 + sqlM_B_CUpd2 + sqlWhere;
@paramUpd.add(sysid);
var updCount = sql.update(sqlM_B_CUpd,paramUpd);

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
    // sys.setSystemCache(sysid);
}
  sys.setRetData("0");