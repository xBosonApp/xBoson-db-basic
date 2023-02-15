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
//id:setdatasource
//修改数据源
var dn=sys.request.dn;
var did=sys.request.did;
var owner=sys.request.owner;
var dbtype=sys.request.dbtype;
var en=sys.request.en;
var cn=sys.request.cn;
var url=sys.request.url;
var user_name=sys.request.user_name;
var pass=sys.request.pass;
var flg=sys.request.flg;
var mark=sys.request.mark;
var status=sys.request.status;
var dhost=sys.request.dhost;
var dport=sys.request.dport;
var pool_enabled=sys.request.pool_enabled;
var prop=sys.request.prop;

if(dn==null||did==null||owner==null||dbtype==null||dhost==null||dport==null){
  sys.setRetData("1");
  return;
}
if (pass == '********') {
  sys.setRetData("1", "密码已经被保护,修改设置须提供正确的密码或留空");
  return;
}
if(pool_enabled==null){
    pool_enabled="0";
}
if(pool_enabled=="1" && prop==null){
  sys.setRetData("1");
  return;
}
//为status赋初值
if(status==null){
    status="1";
}
//如果是非平台，在flg必须是第三方
if(flg==null){
   flg="1"; 
}
if(!se.isPlatformOrg()){
    flg="1";
    //如果是非平台，则url不可是本地url
    var localDbMap=se.localDb();
    if(url != null && sys.contain(url,localDbMap.url)){
        sys.setRetData("2");
        return;
    }
}

var sqlUpt="update sys_pl_drm_ds001 set dn=?,owner=?,dbtype=?,en=?,cn=?,url=?,user_name=?,pass=?,mark=?,status=?,flg=?,dhost=?,dport=?,pool_enabled=?,prop=?,updatedt=? where did=?";

var dt = sys.currentTimeString();
var paramUpd = [dn,owner,dbtype,en,cn,url,user_name,pass,mark,status,flg,dhost,dport,pool_enabled,prop,dt,did];
var updCount = sql.update(sqlUpt,paramUpd);
if (updCount == 0) {
  sys.setRetData("5");
  return;
}
//更新缓存
var getSql=se.getCache(_CACHE_REGION_SYS_SQL_,"conn0002");
sql.query(getSql,[did],"cacheR");
var cacheR=sys.result.cacheR;
if(sys.size(cacheR) > 0){
  var cacheRMap = cacheR[0];
  map.remove(cacheRMap, "orgid");
  se.setCache(_CACHE_REGION_JDBC_CONNECTION_, owner + ":" + did, cacheRMap, 0); 
} else {
  se.delCache(_CACHE_REGION_JDBC_CONNECTION_, owner + ":" + did);
}
    
sys.setRetData("0");