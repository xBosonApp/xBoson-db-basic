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
//name:机构application拖放菜单-复制
//id:savetropmenu

//获取参数
var menuid0 = sys.request.menuid;  //托的菜单的menuid
var p_menuid = sys.request.targetmenuid; //目标节点的menuid, 为null时是根节点

if(menuid0 == null){
  sys.setRetData("1");
  return;
}

//获取菜单信息(menuid0)
var getmenuinfo="select a.menu_icon,a.menunm,a.uri,a.roleid,a.menu_desc,b.orgid,a.pageid from sys_pl_menu_release a,sys_pl_application_release b where a.menuid=? and a.applicationid=b.applicationid and a.status='1' and b.status='1'";
var cnt=sql.query(getmenuinfo,[menuid0],"menuinfo_r");
if(cnt==0){
  sys.setRetData("1","获取菜单信息失败");
  return;
}
var menuinfo_r=sys.result.menuinfo_r;
//获取父菜单信息（p_menuid）  p_menuid为null时是根节点
var levels;
if(p_menuid!=null){
  var getpmenuinfo="select levels from sys_menu where menuid=?";
  var pcnt=sql.query(getpmenuinfo,[p_menuid],"pmenuinfo_r");
  if(pcnt==0){
    sys.setRetData("1","获取父菜单信息失败");
    return;
  }
  var pmenuinfo_r=sys.result.pmenuinfo_r;
  levels=sys.parseInt(pmenuinfo_r[0].levels)+1;
}else{
  levels=1;
}

//获取sorting_order
var getso="";
var socnt=0;
if(p_menuid!=null){
  getso="select menuid,sorting_order from sys_menu where p_menuid=? order by sorting_order desc";
  socnt=sql.query(getso,[p_menuid],"so_r");
}else{
  getso="select menuid,sorting_order from sys_menu where levels=1 order by sorting_order desc";
  socnt=sql.query(getso,[],"so_r");
}
var so_r=sys.result.so_r;
var sorting_order;
if(socnt==0){
  sorting_order=0;
}else{
  sorting_order=sys.parseInt(so_r[0].sorting_order)+1;
}
//将菜单信息插入到菜单表中
var insMenu="insert into sys_menu (menuid,p_menuid,menunm,levels,menu_icon,uri,sorting_order,roleid,menu_desc,orgid,status,createdt,updatedt,pageid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

var dt=date.currentTimeString();
var newMenuId = sys.uuid();
var insParams=[newMenuId,p_menuid,menuinfo_r[0].menunm,levels,menuinfo_r[0].menu_icon,menuinfo_r[0].uri,sorting_order,menuinfo_r[0].roleid,menuinfo_r[0].menu_desc,menuinfo_r[0].orgid,"1",dt,dt,menuinfo_r[0].pageid];

sql.update(insMenu,insParams,"1");
sql.query("select roleid from sys_pl_role_menu_release where menuid=?",[menuid0],"menurole");
var menuRole = sys.result["menurole"];
var menuRoleParams = [];
for (row in menuRole) {
  list.add(menuRoleParams,[row["roleid"],newMenuId,"1",dt,dt]);
}
if (sys.size(menuRoleParams) > 0) {
  sql.updateBatch("insert into sys_role_menu (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)",menuRoleParams,"1");
}
sql.commit();
//返回newmenuid
sys.addRetData([{"menuid":newMenuId}],"result");
sys.setRetData("0","","result");