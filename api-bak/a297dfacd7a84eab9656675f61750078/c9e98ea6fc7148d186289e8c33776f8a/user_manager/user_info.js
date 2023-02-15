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
//liufengyuan
var org=sys.request.org;
var pid = sys.request.pid;
var openid= sys.request.openid;

if(null==pid){
    pid=sys.getUserPID(openid);
}
var sqls = "select pid,de0201039,de0201040, de0201005,de0201015,de0201025,de0201018,de0201030,de0201010,de0201012,de020100901h,de020100902h,de020100903h,de020100904h,de020100905h,de020100906h,de0201047h,de020100901x,de020100902x,de020100903x,de020100904x,de020100905x,de020100906x,de0201047x,de0810007, de0201001,de0201052,de0201041,de0210042,contact_pid,former_name,status,create_orgid,create_pid,createdt,update_orgid,update_pid,updatedt,(SELECT de0201039 FROM mdm_personal_info WHERE pid=a.contact_pid) contact_name,(SELECT de0201039 FROM mdm_personal_info WHERE pid=a.create_pid) create_pidnm,(SELECT de0201039 FROM mdm_personal_info WHERE pid=a.update_pid) update_pidnm from mdm_personal_info a  where pid = ?";

var user_flg = sys.getUserAdminFlag();  //获取当前用户管理员标记
var user_id = sys.getUserIdByPID([pid]);  //获取修改目标用户ID
var admin_flg = sys.getUserAdminFlag(user_id[pid], _ORGID_PLATFORM_);  //获取修改目标用户管理员标记
//判断是否超级管理员
if (user_flg!='1' && admin_flg=='1') {
  sys.setRetData("1", "没有获取此用户信息权限 = " + user_flg);
  return;
}

if (pid != null) {
sql.query(sqls,[pid]);
sys.setRetData("0","","result");
for(r in sys.result.result){
     if(r.de0201005 != ""){
            var a=sys.formattedTime(sys.parseDate(r.de0201005,"yyyyMMdd"),"yyyy-MM-dd HH:mm:ss");
        map.put(r,"de0201005",a);
        // a=sys.formattedTime(sys.parseDate(r.de0201001,"yyyyMMdd"),"yyyy-MM-dd HH:mm:ss");
        // map.put(r,"de0201001",a);
     }
     if(r.de0201001 != ""){
        //     var a=sys.formattedTime(sys.parseDate(r.de0201005,"yyyyMMdd"),"yyyy-MM-dd HH:mm:ss");
        // map.put(r,"de0201005",a);
        var a=sys.formattedTime(sys.parseDate(r.de0201001,"yyyyMMdd"),"yyyy-MM-dd HH:mm:ss");
        map.put(r,"de0201001",a);
     }
     
    }
return;
}
sys.setRetData("1","查询异常！请联系管理员！");