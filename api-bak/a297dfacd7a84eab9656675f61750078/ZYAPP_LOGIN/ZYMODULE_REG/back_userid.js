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
var tel =sys.requset.tel;
var email =sys.requset.email;
var valwords =sys.requset.valwords;


if(null!=tel && valwords==cache.get("valwords", "valwords"+tel)){
    sql.query("select userid from sys_userinfo a left join mdm_personal_info b on a.pid=b.pid where b.de0201010=? ",[tel],"tel");
    //send_phone(tel,"亲：您的平台账号为:"+sys.result.tel[0].userid+"请谨慎保管好！不要泄露他人！");
    //记录日志？
    cache.del("valwords", "valwords"+tel);
    sys.setRetData("0","您的账号已发送到您的手机，请查收！");    
    return;
}


if(null!=email && valwords==cache.get("valwords", "valwords"+email)){
    sql.query("select userid from sys_userinfo a left join mdm_personal_info b on a.pid=b.pid where b.de0201012=?",[email],"email");
    //send_email(email,"亲：您的平台账号为:"+sys.result.email[0].userid+"请谨慎保管好！不要泄露他人！");
    //记录日志？
    cache.del("valwords", "valwords"+email);
    sys.setRetData("0","您的账号已发送到您的邮箱，请查收！");    
    return;
}


sys.setRetData("1","操作失败！");