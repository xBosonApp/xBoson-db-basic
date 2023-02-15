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
//测试URI：http://192.168.7.120:8088/ds/api/setpersonalinfo?app=mdm&mod=personalinfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=4D9B903E44D59731115B753385111C8DFE0D5ED45808A0B6189583762793D778&s=d&mdk=67e05361d9194e8695c4ad2e89a7c14a&userkeylocal=0bd5fd7b742146ccabcf8089fbc95139&pid=9
//接口URL： setpersonalinfo
//王莹莹
 // HTTP 请求参数
  var pid = sys.request.pid;
  var de0201039 = sys.request.de0201039;
  var de0201040 = sys.request.de0201040;
  var de0201005 = sys.request.de0201005;
  var de0201015 = sys.request.de0201015;
  var de0201025 = sys.request.de0201025;
  var de0201018 = sys.request.de0201018;
  var de0201030 = sys.request.de0201030;
  var de0201003 = sys.request.de0201003;
  var de0201010 = sys.request.de0201010;
  var de0201012 = sys.request.de0201012;
  var de020100901h = sys.request.de020100901h;
  var de020100902h = sys.request.de020100902h;
  var de020100903h = sys.request.de020100903h;
  var de020100904h = sys.request.de020100904h;
  var de020100905h = sys.request.de020100905h;
  var de020100906h = sys.request.de020100906h;
  var de0201047h = sys.request.de0201047h;
  var de020100901x = sys.request.de020100901x;
  var de020100902x = sys.request.de020100902x;
  var de020100903x = sys.request.de020100903x;
  var de020100904x = sys.request.de020100904x;
  var de020100905x = sys.request.de020100905x;
  var de020100906x = sys.request.de020100906x;
  var de0201047x = sys.request.de0201047x;
  var de0810007 = sys.request.de0810007;
  var de0201001 = sys.request.de0201001;
  var de0201052 = sys.request.de0201052;
  var de0201041 = sys.request.de0201041;
  var de0210042 = sys.request.de0210042;
  var contact_pid = sys.request.contact_pid;
  var former_name = sys.request.former_name;
  var status = sys.request.status;
  var openId = sys.request.openid;
  var pId = sys.getUserPID(openId);
  var orgid = sys.request.org;

 //更改mdm_personal_info表
//判断不为空
 if(pid == null){
    sys.setRetData("1");
    return;
  }
   //去掉多余的字符时间字段
    
     //判断是否为数字 和是否满足8位
     if(de0201005!=null){
        de0201005=sys.replace(de0201005,"-","");
  if(!(sys.isNumber(de0201005)&&sys.length(de0201005)==8)){
        sys.setRetData("2");
        return;
      }
     }
     if(de0201001!=null){
      de0201001=sys.replace(de0201001,"-","");
  if(!(sys.isNumber(de0201001)&&sys.length(de0201001)==8)){
        sys.setRetData("2");
        return;
     }
     }
var sqlM_B_CUpd1 = "update mdm_personal_info set de0201039=?,de0201040=?,de0201005=?,de0201015=?,de0201025=?,de0201018=?,"+
        "de0201030 =?,de0201003 =?,de0201010 =?,de0201012 =?,de020100901h =?,de020100902h =?,de020100903h = ?,de020100904h =?,"+
        "de020100905h =?,de020100906h = ?,de0201047h =?,de020100901x = ?,de020100902x =?,de020100903x = ?,"+
        "de020100904x =?,de020100905x =?,de020100906x =?,de0201047x =?,de0810007 = ?,de0201001 = ?,de0201052 =?,"+
        "de0201041 =?,de0210042 =?,contact_pid =?,former_name =?,status =?,update_orgid =?,"+
        "update_pid =? ";
var sqlM_B_CUpd2 = "";
var sqlWhere = " where pid = ?";
var paramUpd = [de0201039,de0201040,de0201005,de0201015,de0201025,de0201018,de0201030,de0201003,de0201010,de0201012,
           de020100901h,de020100902h,de020100903h,de020100904h,de020100905h,de020100906h,de0201047h,
           de020100901x,de020100902x,de020100903x,de020100904x,de020100905x,de020100906x,de0201047x,
           de0810007,de0201001,de0201052,de0201041,de0210042,contact_pid,former_name,status,
           orgid,pId];
//获取当前时间
sqlM_B_CUpd2 = sqlM_B_CUpd2 + ",updatedt = ?";
 @paramUpd.add(sys.getCurrentTimeString());
var sqlM_B_CUpd = sqlM_B_CUpd1 + sqlM_B_CUpd2 + sqlWhere;
@paramUpd.add(pid);
var updCount = sql.update(sqlM_B_CUpd,paramUpd);
if (updCount == 0) {
      sys.setRetData("5");
      return;
    }
  sys.setRetData("0");