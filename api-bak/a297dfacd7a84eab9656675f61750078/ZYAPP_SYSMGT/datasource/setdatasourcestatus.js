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
var did=sys.request.did;
var status=sys.request.status;
var owner=sys.request.org;

if(did==null||status==null){
  sys.setRetData("1");
  return;
}

var sqlUpd="update sys_pl_drm_ds001 set status=?,updatedt=? where did=?";
var dt = sys.currentTimeString();
var paramUP=[status,dt,did];
var Updcount=sql.update(sqlUpd,paramUP);

if (Updcount == 0) {
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