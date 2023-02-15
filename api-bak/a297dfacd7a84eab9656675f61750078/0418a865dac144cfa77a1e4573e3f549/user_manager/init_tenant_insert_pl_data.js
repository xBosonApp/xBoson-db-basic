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
//init_tenamt_insert_pl_data
//向平台表插入数据（初始化租户之后）

var org = sys.request.org;
var operation_pid = sys.getUserPID();
var orgid = sys.request.orgid;  //创建的租户id
var dt = date.currentTimeString();
var pid = sys.uuid();

var roleid="";  //管理员角色id
try{
  sql.connection("00000000000000000000000000000000");
  //平台表：mdm_personal_info, sys_userinfo, sys_tenant_user
  //获取机构信息
  var getorginfo = "select a.de0810013j orgnm, a.de0810011 orgnm2, b.org_type from mdm_org a,sys_tenant b  where a.orgid=? and  a.status='1' and b.status='1'";
  var getorginfo_cnt = sql.query(getorginfo,[orgid],"orginfo_r");
  if(getorginfo_cnt == 0){
      sys.setRetData("2","获取机构信息异常");
      return;
  }
  var orginfo_r = sys.result.orginfo_r;
  var orgnm=orginfo_r[0].orgnm;   //机构名称
  var orgnm2=orginfo_r[0].orgnm2; //机构第二名称
  var org_type=orginfo_r[0].org_type; //机构类型（v:开发商，t:租户）
  
  //获取机构人员信息（此人员只属于一个机构）
  var getorgperson="select a.pid from sys_tenant_user a where a.orgid=? and (select count(*) from sys_tenant_user b where b.pid=a.pid)=1";
  sql.query(getorgperson,[orgid],"orgperson_r");
  var orgperson_r=sys.result.orgperson_r;
  var inperson_str="";
  for(r in orgperson_r){
    inperson_str=inperson_str+",'"+r.pid+"'";
  }
  inperson_str=sys.subString(inperson_str,1);
  //如果有此机构人员的数据则先删除
  if(inperson_str != ""){
    var del1="delete from mdm_personal_info where pid in ("+inperson_str+")";
    sql.update(del1,[],"1");
    
    var del2="delete from sys_userinfo where pid in ("+inperson_str+")";
    sql.update(del2,[],"1");
    
    var del3="delete from sys_pl_tp_app_uid where pid in ("+inperson_str+")";
    sql.update(del3,[],"1");
  }
  
  //mdm_personal_info
  var ins1="insert into mdm_personal_info (pid,de0201039,status,create_orgid,create_pid,createdt,updatedt) values (?,?,'1',?,?,?,?)";
  var param=[pid,orgnm+"管理员",org,operation_pid,dt,dt];
  sql.update(ins1,param,"1");
  
  //sys_userinfo
  var ins2="insert into sys_userinfo (pid,userid,password,password_dt,multiflag,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
  //获取所有userid
  var alluserid=[];
  var getAllUserID="select userid from sys_userinfo";
  sql.query(getAllUserID,[],"alluserid_r");
  var alluserid_r=sys.result.alluserid_r;
  for(auid in alluserid_r){
      list.add(alluserid,auid.userid);
  }
  //生成唯一userid   admin+机构名称首字母+两位随机数
  var userid="";
  var orgnm_pinyin=sys.toLowerCase(sys.pinyinFirstLetter(orgnm));
  var flag=true;
  userid="admin-"+orgnm_pinyin;
  while(flag){
      if(!list.contain(alluserid,userid)){
          flag=false;
      }else{
          userid="admin-"+orgnm_pinyin+sys.randomNumber(2);
      }
  }
  //生成密码，与userid相同，并加密
  
  var passwd = sys.encodePlatformPassword(userid,dt,sys.toLowerCase(sys.md5(userid)));//加密
  
  var ins2_params=[pid,userid,passwd,dt,"0","1",dt,dt];
  sql.update(ins2,ins2_params,"1");
  
  //sys_tenant_user
  //先删除orgid对应的记录
  var del3="delete from sys_tenant_user where orgid=?";
  sql.update(del3,[orgid],"1");
  //然后添加管理员
  var ins3="insert into sys_tenant_user (orgid,pid,admin_flag,status,createdt,updatedt) values (?,?,?,?,?,?)";
  var ins3_params=[];
  if(org_type=="v"){
      ins3_params=[orgid,pid,"5","1",dt,dt];
  }else if(org_type=="t"){
      ins3_params=[orgid,pid,"3","1",dt,dt];
  }
  
  sql.update(ins3,ins3_params,"1");
  
  // sql.commit();
  
  //机构表  sys_role, sys_user_role, mdm_dept, sys_user_dept
  
  //mdm_dept
  // var ins01="insert into "+orgid+".mdm_dept (deptid, deptnm, orgid, status, createdt, updatedt) values (?,?,?,?,?,?)";
  // var deptid=sys.uuid();
  // var ins01_params=[deptid,"默认部门",orgid,"1",dt,dt];
  // sql.update(ins01,ins01_params,"1");
  
  //sys_user_dept
  // var ins04="insert into "+orgid+".sys_user_dept (pid, deptid, status, createdt, updatedt) values (?,?,?,?,?)";
  // var ins04_params=[pid,deptid,"1",dt,dt];
  // sql.update(ins04,ins04_params,"1");
  
  //sys_role
  var ins02="insert into "+orgid+".sys_role (roleid, rolenm, op_type, role_type, role_desc, orgid, status, createdt, updatedt) values (?,?,?,?,?,?,?,?,?)";
  roleid=sys.uuid();
  var ins02_params=[roleid,"管理员角色","0","01","",orgid,"1",dt,dt];
  sql.update(ins02,ins02_params,"1");
  
  //sys_user_role
  var ins03="insert into "+orgid+".sys_user_role (pid, roleid, status ,createdt,updatedt) values (?,?,?,?,?)";
  var ins03_params=[[pid,roleid,"1",dt,dt]];
  //获取租户拥有的application的角色
  var getAppRole = "select b.roleid from sys_pl_org_application a, sys_pl_role_release b where a.applicationid=b.applicationid and a.orgid=? and a.status='1' and b.status='1'";
  sql.query(getAppRole,[orgid],"approle");
  var approle=sys.result.approle;
  //将租户拥有的application的role付给管理员
  for(r in approle){
      var _tmp = [pid,r.roleid,"1",dt,dt];
      list.add(ins03_params,_tmp);
  }
  sql.updateBatch(ins03,ins03_params,"1");
  // 机构应用菜单
  sql.query("select distinct rls.menuid,rls.menu_icon,rls.menunm,rls.pageid,rls.uri,rls.menu_desc,a.orgid from sys_pl_menu_release rls,sys_pl_role_menu_release rm,sys_pl_org_application oa,sys_pl_role_release r,sys_pl_application_release a where rls.menuid=rm.menuid and rm.status='1' and rm.roleid=r.roleid and oa.applicationid=r.applicationid and oa.applicationid=a.applicationid and oa.orgid=? and oa.status='1' and r.status='1' and a.status='1'",[orgid],"menus");
  sql.query("select distinct rm.roleid,rls.menuid from sys_pl_menu_release rls,sys_pl_role_menu_release rm,sys_pl_org_application oa,sys_pl_role_release r,sys_pl_application_release a where rls.menuid=rm.menuid and rm.status='1' and rm.roleid=r.roleid and oa.applicationid=r.applicationid and oa.applicationid=a.applicationid and oa.orgid=? and oa.status='1' and r.status='1' and a.status='1'",[orgid],"menuroles");
  var menuParams = [];
  var roleMenuParams = [];
  var menuidCacheMap = {};
  for (row in sys.result["menus"]) {
    var newMenuId = sys.uuid();
    list.add(menuParams,[newMenuId,1,row["menu_icon"],row["menunm"],row["pageid"],row["uri"],row["menu_desc"],row["orgid"],"1",dt,dt]);
    map.put(menuidCacheMap,row["menuid"],newMenuId);
  }
  for (row in sys.result["menuroles"]) {
    var newMenuId = map.get(menuidCacheMap,row["menuid"]);
    if (newMenuId != null) {
      list.add(roleMenuParams,[row["roleid"],newMenuId,"1",dt,dt]);
    }
  }
  sql.update("delete from "+orgid+".sys_menu",null,"1");
  if (sys.size(menuParams) > 0) {
    sql.updateBatch("insert into "+orgid+".sys_menu (menuid,levels,menu_icon,menunm,pageid,uri,menu_desc,orgid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?)",menuParams,"1");
  }
  if (sys.size(roleMenuParams) > 0) {
    sql.updateBatch("insert into "+orgid+".sys_role_menu (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)",roleMenuParams,"1");
  }
}catch(e){
  sql.rollback;
  throw e;
  sys.setRetData("2","初始化租户管理员异常:"+ e.message);
  return;
}

sql.commit();

//更改开发商或租户菜单层级
// {
//     //删除levels==1的根菜单（开发商）
//     sql.update("delete from "+orgid+".sys_menu where levels=1",null);
//     //获取机构所有菜单
//     var getallmenu="select menuid,p_menuid,levels from "+orgid+".sys_menu";
//     sql.query(getallmenu,null,"allmenu_r");
//     var allmenu_r=sys.result.allmenu_r;
    
//     for(r in allmenu_r){
//         if(r.levels=="2"){
//             map.put(r,"p_menuid",null);
//         }
//         map.put(r,"levels",sys.parseInt(r.levels)-1);
//     }
//     //更新菜单层级
//     var sql_menu="update "+orgid+".sys_menu set levels=?,p_menuid=?,status='1' where menuid=?";
//     var param_menu=[];
//     //批量更新参数
//     for(r in allmenu_r){
//         var tmp_list=[r.levels,r.p_menuid,r.menuid];
//         list.add(param_menu,tmp_list);
//     }
//     sql.updateBatch(sql_menu,param_menu,"1");
    
//     sql.commit();
// }

//首页菜单加上管理员角色
// {
//     var addmenurole="update "+orgid+".sys_menu set roleid=?,orgid=? where menunm='首页' and levels=1";
//     sql.update(addmenurole,[roleid,orgid]);
// }
sys.setRetData("0");