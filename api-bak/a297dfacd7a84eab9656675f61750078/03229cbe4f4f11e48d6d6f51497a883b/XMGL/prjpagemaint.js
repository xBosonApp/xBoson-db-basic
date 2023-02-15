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
//prjpagemaint
var requestJson = sys.requestJson;
if (requestJson == null || sys.size(requestJson) == 0){
  sys.setRetData("1","JSON请求数据为空");
  return;
}
var op_type=requestJson.op_type;
var prjid=requestJson.prjid;
var pageid=requestJson.pageid;
var pagenm=requestJson.pagenm;
var page_path=requestJson.page_path;
var elementinfo=requestJson.elementinfo;
var nextpages=requestJson.nextpages;
var orgid=sys.request.org;
// --------------------------------------
// 验证
// --------------------------------------
// 验证必要参数
if (op_type==null) {
	sys.setRetData("1","维护类型为空");
	return;
}
if (op_type!="i" && op_type!="u" && op_type!="d") {
	sys.setRetData("2","维护类型不合法");
	return;
}
if (prjid==null) {
	sys.setRetData("1","项目ID为空");
	return;
}
if (pageid==null) {
	sys.setRetData("1","页面ID为空");
	return;
}
if ((op_type=="i" || op_type=="u") && pagenm==null) {
	sys.setRetData("1","页面名称为空");
	return;
}
if ((op_type=="i" || op_type=="u") && page_path==null) {
	sys.setRetData("1","页面路径为空");
	return;
}
var sqlEleIns="insert into sys_page_element (pageid,elementid,elementnm,status,createdt,updatedt) values (?,?,?,?,?,?)";
var sqlApi="insert into sys_page_api (page_api_id,pageid,elementid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?,?,?)";
var sqlModel="insert into sys_page_model (page_model_id,pageid,elementid,modelid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
var sqlNP="insert into sys_page_next (pageid,next_pageid,status,createdt,updatedt) values (?,?,?,?,?)";
var eleInsParams=[];
var apiParams=[];
var modelParams=[];
var npParams=[];
var dt = date.currentTimeString();
if (op_type=="i" || op_type=="u") {
  if (elementinfo==null) {
    sys.setRetData("1","页面元素信息为空");
    return;
  } else {
    for (var element in elementinfo) {
      var eleId = element.elementid;
      var eleNm = element.elementnm;
      list.add(eleInsParams,[pageid,eleId,eleNm,"1",dt,dt]);
      if (element.children != null) {
        for (var srv in element.children) {
          var appid=srv.appid;
          var moduleid=srv.moduleid;
          var apiid=srv.apiid;
          var modelid=srv.modelid;
          if (modelid==null) {
            list.add(apiParams,[sys.nextId(),pageid,eleId,appid,moduleid,apiid,"1",dt,dt]);
          } else {
            list.add(modelParams,[sys.nextId(),pageid,eleId,modelid,"1",dt,dt]);
          }
        }
      }
    }
  }
}

// 验证页面ID
var responseInfo = http.platformGet({app:"03229cbe4f4f11e48d6d6f51497a883b",mod:"XMGL",api:"prjpagereplicationcheck"},{pageid:pageid});
if (op_type=="i") {
  // 新增页面
  if (responseInfo.data.ret!="11"){
    sys.setRetData(responseInfo.data.ret, responseInfo.data.msg);
    return;
  }
} else if (op_type=="u" || op_type=="d") {
  // 更新页面
  if (responseInfo.data.ret!="8"){
    sys.setRetData(responseInfo.data.ret, responseInfo.data.msg);
    return;
  }
}

// 页面间关联
if ((op_type=="i" || op_type=="u") && nextpages!=null && sys.size(nextpages) > 0) {
  for (var np in nextpages) {
    // 页面ID存在验证
    responseInfo = http.platformGet({app:"03229cbe4f4f11e48d6d6f51497a883b",mod:"XMGL",api:"prjpagereplicationcheck"},{pageid:np.next_pageid});
    if (responseInfo.data.ret!="8") {
      sys.setRetData(responseInfo.data.ret, responseInfo.data.msg);
      return;
    } else {
      list.add(npParams,[pageid,np.next_pageid,"1",dt,dt]);
    }
  }
}

// --------------------------------------
// 新增页面
// --------------------------------------
if (op_type=="i") {
  // 页面表
  var sqlPage="insert into sys_page (pageid,pagenm,prjid,page_path,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
  sql.update(sqlPage,[pageid,pagenm,prjid,page_path,"1",dt,dt],"1");

  // 页面元素表
  if (sys.size(eleInsParams)>0) {
	sql.updateBatch(sqlEleIns,eleInsParams,"1");
  }

  // 页面服务关联表
  if (sys.size(apiParams)>0) {
	sql.updateBatch(sqlApi,apiParams,"1");
  }
  if (sys.size(modelParams)>0) {
	sql.updateBatch(sqlModel,modelParams,"1");
  }

  // 页面间关联表 insert all
  if (sys.size(npParams)>0){
    sql.updateBatch(sqlNP,npParams,"1");
  }
  sql.commit();
  se.setCache(_CACHE_REGION_PAGE_, orgid + ":" + pageid, requestJson, 0);
} else if (op_type=="u") {
// --------------------------------------
// 更新页面
// --------------------------------------
  // 页面表
  var sqlPage="update sys_page set pagenm=?,page_path=?,updatedt=? where pageid=?";
  sql.update(sqlPage,[pagenm,page_path,dt,pageid],"1");

  // 页面元素表
  sql.update("delete from sys_page_element where pageid=?",[pageid],"1");
  // 页面服务关联表
  sql.update("delete from sys_page_api where pageid=?",[pageid],"1");
  sql.update("delete from sys_page_model where pageid=?",[pageid],"1");

  // 页面间关联表 delete all
  sql.update("delete from sys_page_next where pageid=?",[pageid],"1");

  // 页面元素表
  if (sys.size(eleInsParams)>0) {
    sql.updateBatch(sqlEleIns,eleInsParams,"1");
  }

  // 页面服务关联表
  if (sys.size(apiParams)>0) {
    sql.updateBatch(sqlApi,apiParams,"1");
  }
  if (sys.size(modelParams)>0) {
    sql.updateBatch(sqlModel,modelParams,"1");
  }

  // 页面间关联表 insert all
  if (sys.size(npParams)>0){
    sql.updateBatch(sqlNP,npParams,"1");
  }
  sql.commit();
  se.setCache(_CACHE_REGION_PAGE_, orgid + ":" + pageid, requestJson, 0);
} else if (op_type=="d") {
// --------------------------------------
// 删除页面
// --------------------------------------
  // 页面表
  sql.update("delete from sys_page where pageid=?",[pageid],"1");

  // 删除前获取将要删除的页面元素ID，更新权限数据使用
  //sql.query("select elementid from sys_page_element where pageid=?",[pageid],"elementid_tobedel");
  // 页面元素表
  sql.update("delete from sys_page_element where pageid=?",[pageid],"1");

  // 删除前获取将要删除的页面服务ID，更新权限数据使用
  //sql.query("select appid,moduleid,apiid,modalid from sys_page_srv where pageid=?",[pageid],"srv_tobedel");
  // 页面服务关联表
  sql.update("delete from sys_page_api where pageid=?",[pageid],"1");
  sql.update("delete from sys_page_model where pageid=?",[pageid],"1");

  // 页面间关联表 delete all
  sql.update("delete from sys_page_next where pageid=? or next_pageid=?",[pageid,pageid],"1");

  // 删除菜单表里使用该页面的pageid
  sql.update("update sys_menu set pageid=null where pageid=?",[pageid],"1");
  sql.commit();
  se.delCache(_CACHE_REGION_PAGE_, orgid + ":" + pageid);
}

var sqlRole="select ugrole.roleid roleid from sys_prj prj,sys_ug ug,sys_role_ug ugrole,sys_role role where prj.prjid=? and prj.ugid=ug.ugid and prj.ugid=ugrole.ugid and ugrole.roleid=role.roleid and prj.status='1' and ug.status='1' and ugrole.status='1' and role.status='1'";
sql.query(sqlRole, [prjid], "roleidSet");
var roleidSet = sys.result["roleidSet"];
if (!sys.isEmpty(roleidSet)) {
	var roleid=roleidSet[0]["roleid"];
	sql.query("select prj.prjid from sys_prj prj,sys_ug ug,sys_role_ug rug,sys_role role where rug.roleid=? and rug.ugid=prj.ugid and rug.ugid=ug.ugid and role.roleid=rug.roleid and prj.status='1' and ug.status='1' and rug.status='1' and role.status='1'",[roleid],"allprjwithsameug");
	var allprjwithsameug=sys.result["allprjwithsameug"];
	var sqlAllData="";
	var l = sys.size(allprjwithsameug);
	for (var i=0;i<l;i++) {
	  if (i==l-1) {
	    sqlAllData=sqlAllData+" p.prjid='"+allprjwithsameug[i]["prjid"]+"')";
	  } else {
	    sqlAllData=sqlAllData+" p.prjid='"+allprjwithsameug[i]["prjid"]+"' or";
	  }
	}
  sql.query("select p.pageid from sys_page p where p.status='1' and ("+sqlAllData,null,"rolepage");
  var rParams=[];
  for(row in sys.result["rolepage"]){
    list.add(rParams,[roleid,row["pageid"],"1",dt,dt]);
  }
	sql.update("delete from sys_role_page where roleid=?",[roleid],"1");
	sql.updateBatch("insert into sys_role_page (roleid,pageid,status,createdt,updatedt) values (?,?,?,?,?)",rParams,"1");

	sql.query("select e.pageid,e.elementid from sys_page_element e,sys_page p where e.pageid=p.pageid and p.status='1' and e.status='1' and ("+sqlAllData,null,"roleelement");
	var rEParams=[];
  for(row in sys.result["roleelement"]){
    list.add(rEParams,[roleid,row["pageid"],row["elementid"],"1","1",dt,dt]);
  }
	sql.update("delete from sys_role_pe where roleid=?",[roleid],"1");
	sql.updateBatch("insert into sys_role_pe (roleid,pageid,elementid,element_status,status,createdt,updatedt) values (?,?,?,?,?,?,?)",rEParams,"1");

// 	sql.query("select a.appid,a.moduleid,a.apiid from sys_page_api a,sys_page_element e,sys_page p where e.pageid=p.pageid and a.pageid=e.pageid and a.elementid=e.elementid and p.status='1' and a.status='1' and e.status='1' and ("+sqlAllData,null,"roleapi");
// 	var rAParams=[];
//   for(row in sys.result["roleapi"]){
//     var notFound = true;
//     for (r in rAParams) {
//       if (r[1]==row["appid"] && r[2]==row["moduleid"] && r[3]==row["apiid"]) {
//         notFound = false;
//         break;
//       }
//     }
//     if (notFound) {
//       list.add(rAParams,[roleid,row["appid"],row["moduleid"],row["apiid"],"1",dt,dt]);
//     }
//   }
// 	sql.update("delete from sys_role_api where roleid=?",[roleid],"1");
// 	sql.updateBatch("insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)",rAParams,"1");

// 	sql.query("select a.modelid from sys_page_model a,sys_page_element e,sys_page p where e.pageid=p.pageid and a.pageid=e.pageid and a.elementid=e.elementid and p.status='1' and a.status='1' and e.status='1' and ("+sqlAllData,null,"rolemodel");
// 	var rMParams=[];
//   for(row in sys.result["rolemodel"]){
//     var notFound = true;
//     for (r in rMParams) {
//       if (r[1]==row["modelid"]) {
//         notFound = false;
//         break;
//       }
//     }
//     if (notFound) {
//       list.add(rMParams,[roleid,row["modelid"],"1",dt,dt]);
//     }
//   }
// 	sql.update("delete from sys_role_model where roleid=?",[roleid],"1");
// 	sql.updateBatch("insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)",rMParams,"1");
	sql.commit();

	// 更新角色缓存
	http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"00"});
}

sys.setRetData("0");