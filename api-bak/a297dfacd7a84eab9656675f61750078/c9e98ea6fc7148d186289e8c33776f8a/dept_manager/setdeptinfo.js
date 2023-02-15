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
// HTTP 请求参数
var deptid = sys.request.deptid;
var deptcd = sys.request.deptcd;
var deptnm = sys.request.deptnm;
var orgid = sys.request.orgid;
var de0201039_pid = sys.request.de0201039_pid;
var de0201039 = sys.request.de0201039;
var higher_deptid = sys.request.higher_deptid;
var dept_level = sys.request.dept_level;
var de020100905 = sys.request.de020100905;
var de020100906 = sys.request.de020100906;
var de020100901 = sys.request.de020100901;
var de020100902 = sys.request.de020100902;
var de020100903 = sys.request.de020100903;
var de020100904 = sys.request.de020100904;
var de0201038 = sys.request.de0201038;
var de0201047 = sys.request.de0201047;
var de0201010 = sys.request.de0201010;
var de0201008 = sys.request.de0201008;
var de0201012 = sys.request.de0201012;
var de0201054 = sys.request.de0201054;
var de0201046 = sys.request.de0201046;
var de0810009 = sys.request.de0810009;
var de0810010 = sys.request.de0810010;
var de0810046 = sys.request.de0810046;
var de0810001 = sys.request.de0810001;
var de0810005 = sys.request.de0810005;
var de0810006 = sys.request.de0810006;
var de0810008 = sys.request.de0810008;
var de0810030 = sys.request.de0810030;
var de0810031 = sys.request.de0810031;
var de0810032 = sys.request.de0810032;
var de0810041 = sys.request.de0810041;
var de0810044 = sys.request.de0810044;
var de0810050 = sys.request.de0810050;
var de0810051 = sys.request.de0810051;
var status = sys.request.status;
var openId = sys.request.openid;
var pId = sys.getUserPID(openId);
var org = sys.request.org;

//更改mdm_dept表
//判断不为空
//判断不为空
if(deptid == null){
sys.setRetData("1");
return;
}
//去掉多余的字符时间字段
//判断是否为数字 和是否满足8位
if(de0810009!=null){
    de0810009=sys.replace(de0810009,"-","");
    if(!(sys.isNumber(de0810009)&&sys.length(de0810009)==8)){
        sys.setRetData("2");
        return;
    }
}
var sqls = " update mdm_dept set deptcd =?,deptnm =?,orgid =?,de0201039_pid =?,de0201039 =?,higher_deptid =?,dept_level =?,de020100905 =?,de020100906 =?,de020100901 =?,de020100902 = ?,de020100903 =?,de020100904 =?,de0201038 =?,de0201047 = ?,de0201010 =?,de0201008 = ?,de0201012 =?,de0201054 = ?,de0201046 =?,de0810009 =?,de0810010 =?,de0810046 =?,de0810001 =?,de0810005 =?,de0810006 =?,de0810008 =?,de0810030 =?,de0810031 =?,de0810032 =?,de0810041 =?,de0810044 =?,de0810050 =?,de0810051 =?,status =?,update_orgid =?,update_pid =? ,updatedt = ? where deptid = ?";

var param = [deptcd,deptnm,orgid,de0201039_pid,de0201039,higher_deptid,dept_level,de020100905,de020100906,de020100901,de020100902,de020100903,de020100904,de0201038,de0201047,de0201010,de0201008,de0201012,de0201054,de0201046,de0810009,de0810010,de0810046,de0810001,de0810005,de0810006,de0810008,de0810030,de0810031,de0810032,de0810041,de0810044,de0810050,de0810051,status,org,pId];

@param.add(sys.getCurrentTimeString());
@param.add(deptid);

var updCount = sql.update(sqls,param);
if (updCount > 0) {
  sys.setRetData("0");
  return;
}
sys.setRetData("5");