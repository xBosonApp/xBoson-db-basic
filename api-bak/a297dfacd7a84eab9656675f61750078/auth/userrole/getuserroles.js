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
//id：getuserroles
//name:获取当前用户角色一览
//编写人：李宁
//测试url:http://192.168.7.120/ds/api/getuserroles?openid=admin&org=zr&app=auth&mod=role&s=d&pid=test1

var openid=sys.request.openid;
var orgid=sys.request.orgid;
var userid=sys.request.userid;
var org=sys.request.org;

var adminflag=sys.getUserAdminFlag(openid,org);
var operatioin_pid=sys.getUserPID(openid);

if(orgid==null||userid==null){
    sys.setRetData("1");
    return;
}
//获取pid
var pid="";
var sql0="select pid from sys_userinfo where userid=?";
var param0=[userid];
sql.query(sql0,param0,"user_pid");
var user_pid=sys.result.user_pid;
for(r in user_pid){
    pid=r.pid;
}

if(pid==null||pid==''){
    sys.setRetData("2");
    return;
}

if(orgid==null){
    sys.setRetData("1");
    return;
}
var param=[pid,orgid];
//选取当前机构下所有角色(普通角色) ， 及用户角色复选框字段  ，角色状态不为1的不可选
var sql="select case a.status when '1' then 'false' else 'true' end as disabled ,a.roleid,a.rolenm,a.comm_flag,";
sql=sql+"case when b.pid is null then 'false' else 'true' end as checked";
sql=sql+" from sys_role a left join sys_user_role b on a.roleid=b.roleid and b.pid=? where a.orgid=? and (a.comm_flag != '1' or a.comm_flag is null) and a.role_type = '01'";

sql.query(sql,param);

// //获取平台通用角色
var ret = [];
sys.addRetData(ret,"comm_role");

//获取机构应用角色
    var approleSql = "select sys_pl_role_release.roleid id, sys_pl_role_release.rolenm name from sys_pl_org_application , sys_pl_application_release ,sys_pl_role_release where sys_pl_org_application.applicationid=sys_pl_application_release.applicationid and  sys_pl_org_application.applicationid = sys_pl_role_release.applicationid and sys_pl_role_release.applicationid=sys_pl_application_release.applicationid and sys_pl_org_application.orgid=? and sys_pl_org_application.status='1' and sys_pl_application_release.status='1' and sys_pl_role_release.status='1'";
    sql.query(approleSql, [org], "approle");
    var approle = sys.result.approle;
    var approle_Auth = [];
    if(sys.size(approle) == 0){
        sys.setRetData("0","","result","comm_role","retdata");
        return;
    }
    //非管理员仅列出他有的角色
    // if(adminflag!='1' && adminflag!='3' && adminflag!='5'){
    //     var authtmp = "select roleid from sys_user_role where pid=?";
    //     var authcnt = sql.query(authtmp, [operatioin_pid], "authresult");
    //     var authresult = sys.result.authresult;
    //     if(authcnt != 0){
    //         for(r in approle){
    //             for(a in authresult){
    //                 if(a.roleid == r.id){
    //                     list.add(approle_Auth, r);
    //                     break;
    //                 }
    //             }
    //         }
    //     }
    // }else{
        approle_Auth=approle;
    // }
//设置复选框状态
    var authtmp1 = "select roleid from sys_user_role where pid=? and status = '1'";
    var authcnt1 = sql.query(authtmp1, [pid], "authresult1");
    var authresult1 = sys.result.authresult1;
        if(authcnt1 != 0){
            for(r in approle_Auth){
                var match=false;
                for(a in authresult1){
                    if(a.roleid == r.id){
                        match=true;
                        break;
                    }
                }
                if(match){
                    map.put(r, "checked",true);
                }else{
                    map.put(r, "checked",false);
                }
            }
        }
    sys.addRetData(approle_Auth, "app_role");
    sys.setRetData("0","","result","comm_role","app_role");