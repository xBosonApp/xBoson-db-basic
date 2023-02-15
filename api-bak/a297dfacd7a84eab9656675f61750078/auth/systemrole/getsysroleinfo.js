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
//id:getsysroleinfo
//name:获取系统指定机构角色一览
//测试url：
var sysid=sys.request.sysid;
var orgid=sys.request.orgid;

sys.printValue(sys.getUserOrgList(sys.request.openid));
if(orgid==null || sysid==null){
    sys.setRetData("1");
    return;
}

var param=[sysid,orgid];
//选取当前机构下所有角色(普通角色) ， 及复选框字段  ，角色状态不为1的不可选
var sql="select case a.status when '1' then 'false' else 'true' end as disabled ,a.roleid,a.rolenm,";
sql=sql+"case when b.sysid is null then 'false' else 'true' end as checked";
sql=sql+" from sys_role a left join sys_system_role b on a.roleid=b.roleid and b.sysid=? where a.orgid=? and a.role_type='01'";
sql.query(sql,param);
//获取系统拥有的角色
var getsysrole="select roleid from sys_system_role where sysid=?";
sql.query(getsysrole,[sysid],"sysrole");
var sysrole=sys.result.sysrole;
//获取应用角色
var getapprole="select b.roleid,b.rolenm from sys_pl_org_application a,sys_pl_role_release b where a.applicationid=b.applicationid and a.orgid=?";
sql.query(getapprole,[orgid],"approle");
//增加checked和disabled属性
for(r in sys.result.approle){
    var flag=false;
    for(d in sysrole){
        if(r.roleid==d.roleid){
            flag=true;
            break;
        }
    }
    if(flag){
        map.put(r,"checked","true");
    }else{
        map.put(r,"checked","false");
    }
    map.put(r,"disabled","false");
}
sys.setRetData("0","","result","approle");