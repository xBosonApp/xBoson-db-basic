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
// liufengyuan

var userid = sys.request.userid;
var tel=sys.request.tel;//手机注册
var email=sys.request.email;//邮箱注册

if(userid==null&&tel==null&&email==null){
    sys.setRetData("1");
    return;
}


 if(null!=userid && 0< sql.query("select 2 from sys_userinfo where userid=?",[userid])) {
     // 用户已存在
     sys.addRetData([{"count":"0"}],"result"); 
     sys.setRetData("0","用户ID已经存在！","result");
     return;
 }

  if(null!=tel && 0<sql.query(" select 1 from sys_userinfo where tel=? ",[tel])) {
     // 用户已存在
     sys.addRetData([{"count":"0"}],"result"); 
     sys.setRetData("0","手机号码已被注册用户绑定！","result");
     return;
 }
 if(null!=email && 0<sql.query("select 1 from sys_userinfo where email=?",[email]))
 {
     // 用户已存在
     sys.addRetData([{"count":"0"}],"result"); 
     sys.setRetData("0","邮箱账号被注册用户绑定！","result");
     return;
 }
//  if(null!=tel && 0<sql.query(" select 1 from mdm_personal_info where de0201010=? ",[tel])) {
//      // 用户已存在
//      sys.addRetData([{"count":"0"}],"result"); 
//      sys.setRetData("0","手机号码已被注册用户绑定！","result");
//      return;
//  }

//   if(null!=email && 0<sql.query("select 1 from mdm_personal_info where de0201012=?",[email]))
//  {
//      // 用户已存在
//      sys.addRetData([{"count":"0"}],"result"); 
//      sys.setRetData("0","邮箱账号被注册用户绑定！","result");
//      return;
//  }
 
sys.addRetData([{"count":"1"}],"result");
sys.setRetData("0","","result");