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
//id:orgmenu
//name:获取机构菜单列表
var orgid=sys.request.org;
var pid=sys.getUserPID();
//sys.printValue("PID: " + pid + ", ORG: " + orgid);
var s;
var parm;

if (sys.getUserAdminFlag() === '1') {
  s = `select
          menu.menuid,
          menu.p_menuid,
          menu.levels,
          menu.menu_icon,
          menu.menunm,
          menu.pageid,
          menu.uri,
          menu.sorting_order,
          menu.orgid 
        from sys_menu menu
        where menu.status='1' 
        and (menu.pageid is not null or menu.uri is not null)`;
  sys.put("isRoot", true);
  parm = [];
} else {
  s="select menu.menuid,menu.p_menuid,menu.levels,menu.menu_icon,menu.menunm,menu.pageid,menu.uri,menu.sorting_order,menu.orgid ";
  s=s+"from sys_menu menu,";
  s=s+"    (select distinct rm.menuid ";
  s=s+"    from sys_role_menu rm,";
  s=s+"        (select ur.roleid ";
  s=s+"        from sys_user_role ur,sys_role role ";
  s=s+"        where ur.pid=? and ur.roleid=role.roleid and ur.status='1' and role.status='1' ";
  s=s+"        union ";
  s=s+"        select ur.roleid ";
  s=s+"        from sys_user_role ur,sys_pl_org_application oa,sys_pl_role_release role,sys_pl_application_release a ";
  s=s+"        where ur.pid=? and ur.roleid=role.roleid and ur.status='1' and role.status='1' and oa.applicationid=role.applicationid and oa.applicationid=a.applicationid and oa.orgid=? and oa.status='1' and a.status='1'";
  s=s+"        union ";
  s=s+"        select rug.roleid ";
  s=s+"        from sys_role_ug rug,sys_role role,sys_ug ug,sys_ug_user user ";
  s=s+"        where user.pid=? and user.ugid=rug.ugid and rug.ugid=ug.ugid and rug.roleid=role.roleid and role.status='1' and user.status='1' and rug.status='1' and ug.status='1'";
  s=s+"        union ";
  s=s+"        select rug.roleid ";
  s=s+"        from sys_role_ug rug,sys_ug ug,sys_ug_user user,sys_pl_org_application oa,sys_pl_role_release role,sys_pl_application_release a ";
  s=s+"        where user.pid=? and user.ugid=rug.ugid and rug.ugid=ug.ugid and rug.roleid=role.roleid and role.status='1' and user.status='1' and rug.status='1' and ug.status='1' and oa.applicationid=role.applicationid and oa.applicationid=a.applicationid and oa.orgid=? and oa.status='1' and a.status='1'";
  s=s+"        ) userrole ";
  s=s+"    where rm.roleid=userrole.roleid and rm.status='1'";
  s=s+"    ) rolemenu ";
  s=s+"where menu.menuid=rolemenu.menuid and menu.status='1' and (menu.pageid is not null or menu.uri is not null)";
  parm = [pid,pid,orgid,pid,pid,orgid];
}

  sql.query(s, parm, "rolemenu");
  var retRoleMenu = sys.result["rolemenu"];
  if (sys.isEmpty(retRoleMenu)) {
    sys.addRetData([],"result");
    sys.setRetData("0","","result");
    return;
  }

  for (row in retRoleMenu) {
    var app_flag = "0";   //appflag
    var uriStr = "";
    var rowOrgId = row["orgid"];
    if (!sys.isEmpty(row.pageid)) {
      var pageInfo = se.getCache(_CACHE_REGION_PAGE_, rowOrgId + ":" + row.pageid);
      if (pageInfo!=null) {
        uriStr = pageInfo.page_path;
        //为uri加前缀（平台：paas/, 非平台：saas/orgid/, 第三方不用加）
        if(se.isPlatformOrg(rowOrgId)){
          uriStr="paas/emptymain.html#"+uriStr;
        } else {
          uriStr="saas/"+rowOrgId+"/"+uriStr;
        }
      }
    } else {
      var uri_str=sys.toLowerCase(row.uri);
      //第三方app_flag==1
      if (sys.startWith(uri_str, "http:") || sys.startWith(uri_str, "https:")) {
        app_flag = "1";
        uriStr = row.uri;
      } else {
        //为uri加前缀（平台：paas/, 非平台：saas/orgid/, 第三方不用加）
        if(se.isPlatformOrg(rowOrgId)){
          uriStr="paas/emptymain.html#"+row.uri;
        } else {
          uriStr="saas/"+rowOrgId+"/"+row.uri;
        }
      }
    }
    map.put(row, "uri", uriStr);
    map.put(row, "appflag", app_flag);
  }
  //5.获取机构所有有效菜单
  // var sql_All;
  // if (sys["xboson"] != null) {
    var sql_All="select menuid,menunm,p_menuid,sorting_order,levels,menu_icon "
               +"from "+ orgid +".sys_menu where status='1'";
  // } else {
  //   var sql_All="select menuid,menunm,p_menuid,sorting_order,levels,menu_icon from sys_menu where status='1'";
  // }
  sql.query(sql_All,null,"all_menus");

  //6.获取底层菜单关联的所有菜单
  var concat_menus=sys.getRelatedTreeData(sys.result.all_menus,retRoleMenu,"menuid","p_menuid");
  //sys.addRetData(concat_menus,"concat_menus");
  //7.转换为带children的tree格式
  var result=sys.transformTreeData(concat_menus,"menuid","p_menuid","children");

  //设置机构cookie
  // http.setCookie("org",orgid,-1);
  //返回数据
  sys.addRetData(result,"result");
  sys.setRetData("0",null,"result");
// }