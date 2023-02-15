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
var orgid = sys.request.org;
//查询 mdm_org 表
if (null!=deptid) {
    var sqls = "select deptid,deptcd,deptnm,orgid,de0201039_pid,de0201039,higher_deptid,dept_level,de020100905,de020100906,de020100901,de020100902,de020100903,de020100904,de0201038,de0201047,de0201010,de0201008,de0201012,de0201054,de0201046,de0810009,de0810010,de0810046,de0810001,de0810005,de0810006,de0810008,de0810030,de0810031,de0810032,de0810041,de0810044,de0810050,de0810051,status,create_orgid,create_pid,update_orgid,update_pid,createdt,updatedt from mdm_dept where deptid = ? and create_orgid=?";
    
    if(sql.query(sqls,[deptid,orgid],"result")>0) {
        sys.setRetData("0","","result");
        for(r in sys.result.result){
           if(r.de0810009 != ""){
            var a=sys.formattedTime(sys.parseDate(r.de0810009,"yyyyMMdd"),"yyyy-MM-dd HH:mm:ss");
        map.put(r,"de0810009",a);
        }
      }
return;
  }
}   
 sys.setRetData("1");