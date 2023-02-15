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
var userid =sys.request.userid;
var newpassword=sys.request.newpassword;
var valwords=sys.request.valwords;
var tel=sys.request.tel;
var email=sys.request.email;
var dt = sys.getCurrentTimeString();
var passwd = sys.encodePlatformPassword(userid,dt,newpassword);//获取密码
var sqls = " update sys_userinfo set password=? , password_dt=? where userid=? ";
var parms=[passwd,dt,userid];

if("1"==sys.request.adminflag) {
    //管理员重置
    if(sql.update(sqls,parms)>0) {
        sys.setRetData("0","密码重置成功！");return;
    }
    else{
        sys.setRetData("1","密码重置异常！");return;
    }
    
}

if(email==tel || null==userid || null==valwords) 
{
    sys.setRetData("1","请输入各向信息！");
    return;
}

var tmp = null==email?tel:email;
var count =sql.query("select 1 from mdm_personal_info a LEFT JOIN sys_userinfo b on a.pid=b.pid  AND a.status=1 AND b.status=1 WHERE b.userid=? AND (a.de0201010=? or a.de0201012=?)",[userid,tmp,tmp]);

if(count>0) {
    if(valwords==cache.get("valwords", "valwords"+tmp))
    {
        if(sql.update(sqls,parms)>0) 
        {
            cache.del("valwords", "valwords"+tmp)
            sys.setRetData("0","密码重置成功！");
            return;
        }
    }
    sys.setRetData("1","验证码 失效/不正确！");
    return;
}
sys.setRetData("1","用户与验证方式不匹配！");