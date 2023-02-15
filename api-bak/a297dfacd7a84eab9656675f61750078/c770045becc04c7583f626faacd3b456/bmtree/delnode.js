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
//delnode
//删除类别节点

var typecd = sys.request.typecd;
var org = sys.request.org;

if(typecd == null){
    sys.setRetData("1");
    return;
}

var typecd_lc=sys.toUpperCase(typecd);
if(typecd_lc=="MDDM.MDM.AUTH" || typecd_lc=="BM.MDDM" || typecd_lc=="BM.DMLM" || typecd_lc=="BM"){
    sys.setRetData("2","此节点不可以删除");
    return;
}

//检查节点是否为底层节点
var chkSql = "select typecd from sys_bm001 where parentcd=?";
var cnt = sql.query(chkSql,[typecd]);
if(cnt>0){
    sys.setRetData("2","此节点不是底层节点！");
    return;
}

//删除bm001
var delSql = "delete from sys_bm001 where typecd=?";
sql.update(delSql,[typecd],"1");
//删除bm003（视图定义表）
var delSql_bm003 = "delete from sys_bm003 where typecd=?";
sql.update(delSql_bm003,[typecd],"1");
//删除bm004（维度定义表）
var delSql_bm004 = "delete from sys_bm004 where typecd=?";
sql.update(delSql_bm004,[typecd],"1");

//删除模型权限(sys_role_model)
sql.update("delete from sys_role_model where typecd=?",[typecd],"1");
sql.commit();

//清模型缓存
se.delCache(_CACHE_REGION_BIZ_MODEL_,typecd);
//清模型权限缓存
var tmp_keys = se.cacheKeys(_CACHE_REGION_SYS_AUTHORITY_,org+":*:"+typecd);
se.delCache(_CACHE_REGION_SYS_AUTHORITY_,tmp_keys);
sys.setRetData("0");