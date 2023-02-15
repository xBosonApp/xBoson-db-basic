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
  //测试URI：http://192.168.7.120:8088/ds/api/getorglistupt?app=MDM&mod=orginfo&org=f6f4cbfd4e3340249ef1db13dbfe5b23&openid=95F35EBB37A63844F6AAE6174F2E07ED1969FBA50CAC2B0B7922E405B3776367&s=d&mdk=bdf6bc13c43243e1aa34f2c5da16c179&userkeylocal=425ab67e6afd472b9f036a7827fe44b4&orgid=wyyceshi
  //接口URL： getorginfoupt

  // HTTP 请求参数
  var orgid = sys.request.orgid;
  
  //查询 mdm_org 表
  if (orgid != null) {
    var sql = "select orgid,de0810013j,de0810011,de0810052,de0810022,de0201039f_pid,de0201039f,de0810081,de0810024,"+
          "de0810027,de0810028,de0810016,reg_org,reg_cd,de0810082,de020100905,de020100906,de020100901,de020100902,"+
          "de020100903,de020100904,de0201038,de0201047,de0201010,de0201008,de0201012,de0201054,de0201046,de0810009,"+
          "de0810029,de0810010,de0810046,higher_orgid,nationality_cd,de0201039t,de0810013t,de0201039tx,de0900053,de0810001,"+
          "de0810005,de0810006,de0810008,de0810030,de0810031,de0810032,de0810041,de0810044,de0810050,de0810051,de0810043,"+
          "category,status,create_orgid,create_pid,update_orgid,update_pid,createdt,updatedt from mdm_org where orgid = ?";
    var param = [orgid];
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