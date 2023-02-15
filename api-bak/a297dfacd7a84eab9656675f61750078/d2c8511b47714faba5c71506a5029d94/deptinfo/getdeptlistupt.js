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
  //测试URI：http://192.168.7.120:8088/ds/api/getdeptlistupt?app=MDM&mod=deptinfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=8BBA5A60F1401532DA446580F91D8408BAEA85AEECC8E36B7F536B59F6E1A4B9&s=d&mdk=bee7b095e9d3469ca2ed1f78e6721c6f&userkeylocal=77d69c8dd4ac468db299f31fe02ac5b4&deptid=test
  //接口URL： getdeptlistfoupt

  // HTTP 请求参数
  var deptid = sys.request.deptid;
  
  //查询 mdm_org 表
  if (deptid != null) {
    var sql = "select deptid,deptcd,deptnm,orgid,de0201039_pid,de0201039,higher_deptid,dept_level,de020100905,"+
          "de020100906,de020100901,de020100902,de020100903,de020100904,de0201038,de0201047,de0201010,de0201008,"+
          "de0201012,de0201054,de0201046,de0810009,de0810010,de0810046,de0810001,de0810005,de0810006,de0810008,"+
          "de0810030,de0810031,de0810032,de0810041,de0810044,de0810050,de0810051,status,create_orgid,create_pid,"+
          "update_orgid,update_pid,createdt,updatedt from mdm_dept where deptid = ?";
    var param = [deptid];
    var query = sql.query(sql,param);
    var result=sys.result.result;
    if(query > 0){
      if(result[0].de0810009 !=""){
         //时间加入—— 用于显示
        var y=sys.subStringTo(result[0].de0810009,0,4);
        y=y+"-";
        var m=sys.subStringTo(result[0].de0810009,4,6);
        m=m+"-";
        var d=sys.subStringTo(result[0].de0810009,6,8);
        var date=y+m+d;
        map.put(result[0],"de0810009",date);
      }
    }
    sys.setRetData("0","","result");
  }else {
    sys.setRetData("1");
  }