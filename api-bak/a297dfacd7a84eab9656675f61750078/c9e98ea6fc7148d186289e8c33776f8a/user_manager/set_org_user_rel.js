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
var userid=sys.request.userid;
var orgid = sys.request.org;
var dt = sys.getCurrentTimeString();

// var openid = sys.request.openid;
// var adminFlag=sys.getUserAdminFlag(openid,orgid);
// if("0"!=adminFlag)
// {
    if(null==userid||null==orgid)
    {
        sys.setRetData("1");
        return;
    }
    
    if(0<sql.query("select pid from sys_userinfo where userid=?",[userid],"userid")){
        var pid = sys.result.userid[0].pid;
        var count =sql.query("select * from sys_tenant_user where orgid=? and pid=? ",[orgid,pid]);
        if(0<count) {
            sys.setRetData("1","本机构下用户已存在！");
            return;
        } else if(0==count) {
            count = sql.update("insert into sys_tenant_user (orgid,pid,status,admin_flag,createdt,updatedt) values(?,?,?,?,?,?)",[orgid,pid,"1","0",dt,dt]);
            if(count>0) {
                sys.setRetData("0","用户授权机构成功！");
                return;
            }
        }
    }
    sys.setRetData("1","用户授权机构失败！");
    return;
    
// }

// sys.setRetData("1","权限不足！");