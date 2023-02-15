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
// 清空系统租户缓存
se.delCache(_CACHE_REGION_TENANT_);
// 获取系统所有租户信息
//select orgid,org_type,init_db,pid,status from sys_tenant
var tenants = se.getCache(_CACHE_REGION_SYS_SQL_,"tenant0001");
var cnt = sql.query(tenants,[],"alltenants");
var alltenants = sys.result.alltenants;
//如果返回为空， 设置载入失败标记
// if(cnt==0){
//     se.setCache(_CACHE_REGION_TENANT_,_CACHE_KEY_READY_,false,0);
//     return;
// }
//缓存系统所有租户开始...  
var initializeOrgs = [];
//缓存开发商 机构id
var initVendor = [];

for(r in alltenants){
    //选出初始化db的机构
    if(r.init_db=="1"){
        list.add(initializeOrgs,r.orgid);
        //选出类型为开发商的机构
        if(r.org_type=="v"){
            list.add(initVendor,r.orgid);
        }
    }
}

se.setCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_,initializeOrgs,0);
se.setCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_V_,initVendor,0);
// se.setCache(_CACHE_REGION_TENANT_,"tenants",alltenants,0);
se.setCache(_CACHE_REGION_TENANT_,_CACHE_KEY_READY_,true,0);