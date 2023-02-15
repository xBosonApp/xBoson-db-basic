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
//id:savesystemrole
//name:保存系统角色
//编写人：李宁
//测试url:

var sysid=sys.request.sysid;
var roleid=sys.request.roleid;//以逗号分隔的字符串
var orgid=sys.request.orgid;

var sql1="";
if(sysid==null||orgid==null){
  sys.setRetData("1");
  return;
}

sql1="delete from sys_system_role where sysid=?";
var param1=[sysid];
sql.update(sql1,param1);
//如果roleid==null,则清空系统在当前机构的所有角色之后返回
if(roleid==null){
  sys.setRetData("0");
  return;
}
//插入新角色
var sql2="insert into sys_system_role (sysid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
var dt=sys.currentTimeString();
//将roleid拆分成数组
var roleid_array=sys.split(roleid,",");
var lent=sys.size(roleid_array);
var i=0;
while(i<lent){
  var param2=[sysid,roleid_array[i],"1",dt,dt];
  sql.update(sql2,param2,"1");
  i=i+1;
}
sql.commit();

//更新缓存
// TODO: 多租户场景下，此处有已发布应用的时效性问题，考虑使用计划任务每天24点更新该缓存
var sqlSystemRole = se.getCache(_CACHE_REGION_SYS_SQL_,"auth0005");
var _cnt=sql.query(sqlSystemRole,[sysid,sysid,orgid,date.formattedTime(date.currentDate(), "yyyyMMdd")],"setcachedata");
var setcachedata=sys.result["setcachedata"];
if(_cnt>0){
  se.setCache(_CACHE_REGION_SYS_AUTHORITY_, orgid+":systems:"+sysid, setcachedata, 0);
}else{
  se.delCache(_CACHE_REGION_SYS_AUTHORITY_, orgid+":systems:"+sysid);
}

sys.setRetData("0");