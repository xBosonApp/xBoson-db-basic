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
  //接口名称：同步个人信息
  //接口URL： getpersonalinfoupt

  // HTTP 请求参数
  var pid = sys.request.pid;
  //查询 mdm_personal_info 表
  if (pid != null) {
    var sql = "select pid,de0201039,de0201040,de0201005,de0201015,de0201025,de0201018,de0201030,de0201010,"+
              "de0201012,de020100901h,de020100902h,de020100903h,de020100904h,de020100905h,de020100906h,"+
              "de0201047h,de020100901x,de020100902x,de020100903x,de020100904x,de020100905x,de020100906x,"+
              "de0201047x,de0810007,de0201001,de0201052,de0201041,de0210042,contact_pid,(SELECT de0201039 FROM mdm_personal_info WHERE pid=a.contact_pid) contact_name,"+
              "former_name,status,"+
              "create_orgid,create_pid,createdt,update_orgid,update_pid,updatedt from mdm_personal_info a where pid = ?";
    var param = [pid];
    var query = sql.query(sql,param);
    var result=sys.result.result;
    if(query > 0){
      if(result[0].de0201005 !=""){
         //时间加入—— 用于显示
        var y=sys.subStringTo(result[0].de0201005,0,4);
        y=y+"-";
        var m=sys.subStringTo(result[0].de0201005,4,6);
        m=m+"-";
        var d=sys.subStringTo(result[0].de0201005,6,8);
        var date=y+m+d;
        map.put(result[0],"de0201005",date);
      }
      if(result[0].de0201001 !=""){
        var y0=sys.subStringTo(result[0].de0201001,0,4);
        y0=y0+"-";
        var m0=sys.subStringTo(result[0].de0201001,4,6);
        m0=m0+"-";
        var d0=sys.subStringTo(result[0].de0201001,6,8);
        var date1=y0+m0+d0;
        map.put(result[0],"de0201001",date1);
      }
    }
    sys.setRetData("0","","result");
  }else{
     sys.setRetData("1","查询异常！请联系管理员！"); 
  }