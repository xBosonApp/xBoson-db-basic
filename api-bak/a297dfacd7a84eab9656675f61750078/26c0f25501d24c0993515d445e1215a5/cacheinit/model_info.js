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
// 清空已有缓存
se.delCache(_CACHE_REGION_BIZ_MODEL_);
//获取所有初始化db的机构
var orgs=se.getCache(_CACHE_REGION_TENANT_,_CACHE_KEY_INIT_ORG_);

//缓存操纵模型sql
var bm002Sql=se.getCache(_CACHE_REGION_SYS_SQL_,"model0001");
//缓存视图模型sql
var bm003Sql=se.getCache(_CACHE_REGION_SYS_SQL_,"model0002");
//缓存多维模型sql
var bm004Sql=se.getCache(_CACHE_REGION_SYS_SQL_,"model0003");

if(bm002Sql==null||bm003Sql==null||bm004Sql==null){
    se.setCache(_CACHE_REGION_BIZ_MODEL_,_CACHE_KEY_READY_,false,0);
    return;
}

// 使用单独连接避免替换 Schema
sql.connection("00000000000000000000000000000000");

// 循环机构
//操纵模型
for(org in orgs){
    var getbm002 = sys.replace(bm002Sql, "sys_bm002", org+".sys_bm002");
    try{
        sql.query(getbm002,null,"bm002R");
    }catch(e){
        continue;
    }
    sys.printValue("bm002:"+org+" "+sys.size(sys.result.bm002R));
    for(r in sys.result.bm002R){
        map.put(r,"org",org);
        map.put(r,"model_type","bm002");
        se.setCache(_CACHE_REGION_BIZ_MODEL_,r["typecd"],r,0);
    }
}
// 循环机构
// 视图模型
for(org in orgs){
    var getbm003 = sys.replace(bm003Sql, "sys_bm003", org+".sys_bm003");
    getbm003 = sys.replace(getbm003, "sys_bm001", org+".sys_bm001");
    try{
        sql.query(getbm003,null,"bm003R");
    }catch(e){
        continue;
    }
    sys.printValue("bm003:"+org+" "+sys.size(sys.result.bm003R));
    for(r in sys.result.bm003R){
        map.put(r,"org",org);
        map.put(r,"model_type","bm003");
        se.setCache(_CACHE_REGION_BIZ_MODEL_,r["typecd"],r,0);
    }
}
// 循环机构
// 多维模型
for(org in orgs){
    var getbm004 = sys.replace(bm004Sql, "sys_bm004", org+".sys_bm004");
    getbm004 = sys.replace(getbm004, "sys_bm001", org+".sys_bm001");
    try{
        sql.query(getbm004,null,"bm004R");
    }catch(e){
        continue;
    }
    sys.printValue(getbm004);
    sys.printValue("bm004:"+org+" "+sys.size(sys.result.bm004R));
    for(r in sys.result.bm004R){
        map.put(r,"org",org);
        map.put(r,"model_type","bm004");
        se.setCache(_CACHE_REGION_BIZ_MODEL_,r["typecd"],r,0);
    }
}
se.setCache(_CACHE_REGION_BIZ_MODEL_, _CACHE_KEY_READY_, true, 0);