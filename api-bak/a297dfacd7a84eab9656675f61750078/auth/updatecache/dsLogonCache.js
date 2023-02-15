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
//更新openid缓存里的org_role_id_list
var org=sys.request.org;
var pids=sys.request.pids;    //多个pid，以逗号分隔

if(pids==null || sys.trim(pids)==""){
    sys.setRetData("0");
    return;
}
//获取用户角色sql语句（sys_user_role，sys_dept_role）
var getuserole="select roleid from sys_user_role where pid=? and status='1'";
var getdeptrole="select roleid from sys_dept_role where deptid in (select deptid from sys_user_dept where pid=?)";

var pid_list=sys.split(pids,",");
// sys.printValue(pid_list);
//循环一个或多个pid
for(r in pid_list){
    //pid对应的多个openid
    var openid_list=se.getCache(_CACHE_REGION_LOGON_,r);
    if(openid_list==null){
        continue;
    }
    // sys.printValue(openid_list);
    //获取用户角色
    sql.query(getuserole,[r],"userole");
    sql.query(getdeptrole,[r],"deptrole");
    //循环一个或多个openid
    for(o in openid_list){
        var openid_cache=se.getCache(_CACHE_REGION_LOGON_,o);
        if(openid_cache==null){
            continue;
        }
        // sys.printValue(openid_cache);
        //将用户角色添加到缓存
        var tmp=[];
        for(ur in sys.result.userole){
            list.add(tmp,{"orgid":org,"roleid":ur.roleid});
        }
        for(dr in sys.result.deptrole){
            //使tmp中的项不重复
            if(!list.contain(tmp,{"orgid":org,"roleid":dr.roleid})){
                list.add(tmp,{"orgid":org,"roleid":dr.roleid});
            }
        }
        // sys.printValue(tmp);
        //将tmp覆盖缓存中的org_role_id_list
        
        map.put(openid_cache,"org_role_id_list",tmp);
        // map.put(openid_cache,"or",tmp);
        //覆盖openid缓存
        se.setCache(_CACHE_REGION_LOGON_,o,openid_cache,null);
    }
}
sys.setRetData("0");