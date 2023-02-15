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
var org=sys.request.org;
var typecdArr = sys.request.typecdArr;  //模型ID数组
if(typecdArr==null){
    sys.setRetData("1","添加开发权限时模型ID未指定");
    return;
}
typecdArr = sys.instanceFromJson(typecdArr);
var dt = date.currentTimeString();
// 为所有开发角色加上模型权限
var insRoleModel = "insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values (?,?,'1',?,?)";
var delRoleModel = "delete from sys_role_model where roleid = ? and typecd=?";

var selDevRole = "select roleid from sys_role where role_type='02' and status='1'";
sql.query(selDevRole,null,"devRole");
var batParams = [], delBatParams=[];
for(r in sys.result.devRole){
    for(typecd in typecdArr){
        list.add(batParams,[r.roleid,typecd,dt,dt]);
        list.add(delBatParams,[r.roleid,typecd]);
    }
}
sql.updateBatch(delRoleModel,delBatParams);
sql.updateBatch(insRoleModel,batParams);
// 更新缓存
for(r in sys.result.devRole){
    for(typecd in typecdArr){
        //se.setCache(_CACHE_REGION_SYS_AUTHORITY_,org+":"+r.roleid+":"+typecd,0,0);   
        // roleid:02:modelid
        se.setCache(_CACHE_REGION_RBAC_, r.roleid + ":02:" + typecd, 0, 0);
    }
}
sys.setRetData("0");