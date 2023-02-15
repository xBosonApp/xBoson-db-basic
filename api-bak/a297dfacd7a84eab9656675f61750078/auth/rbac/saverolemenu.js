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
// // saverolemenu 保存角色菜单 - 自动获取菜单关联页面所关联的页面元素和服务
// var requestJson = sys.requestJson;
// if (requestJson == null || sys.size(requestJson) == 0){
//   sys.setRetData("1", "JSON请求数据为空");
//   return;
// }

// var roleid = requestJson.roleid;
// var menus = requestJson.menus;

// var menuParams = [];
// var pageParams = [];
// var pageElementParams = [];
// var apiParams = [];
// var modelParams = [];
// var pageids = [];
// var dt = date.currentTimeString();

// // 获取菜单数据和菜单关联的页面ID
// if (!sys.isEmpty(menus)) {
//   for (row in menus) {
//     list.add(menuParams, [roleid, row.menuid, "1", dt, dt]);
//     if (!sys.isEmpty(row.pageid)) {
//       list.add(pageids, row.pageid);
//     }
//   }
// }

// // 获取菜单关联的页面以及页面关联的下级页面
// // 用while循环反复查询，过程中提出已经查到的pageid，直到查不到结果为止
// var sqlNextPage="select next.next_pageid from sys_page_next next,sys_page page where next.pageid=page.pageid and page.status='1' and (";
// var rolePages=[];
// var stillHaveNextPages = true;
// while (stillHaveNextPages) {
//   stillHaveNextPages = false;
//   var pageidSize = sys.size(pageids);
//   if (pageidSize > 0) {
//     var sqlNextPageTmp=sqlNextPage;
//     var cnt = 0;
//     // 获取一批next_pageid
//     for (row in pageids) {
//       cnt++;
//       // 过滤已经检索过的pageid
//       if (!list.contain(rolePages, row)) {
// 	    list.add(rolePages, row);
//         if (cnt == pageidSize) {
//           sqlNextPageTmp = sqlNextPageTmp + " next.pageid='"+row+"')";
//         } else {
//           sqlNextPageTmp = sqlNextPageTmp + " next.pageid='"+row+"' or";
//         }
//       }
//     }
//     sql.query(sqlNextPageTmp, null, "getpages");

//     if (sys.size(sys.result.getpages) > 0) {
//       stillHaveNextPages=true;
//       // 为下一次while循环更换下一批条件pageid为next_pageid的值
//       pageids = [];
//       for (nextPage in sys.result.getpages) {
//         list.add(pageids, nextPage.next_pageid);
//       }
//     }
//   }
// }
// for (row in rolePages) {
//   list.add(pageParams,[roleid,row,"1",dt,dt]);
// }

// // 获取所有页面元素
// var pageElements = [];
// var rolePagesSize = sys.size(rolePages);
// if (rolePagesSize > 0) {
//   var sqlPageElement = "select pageid,elementid from sys_page_element where (";
//   var cnt = 0;
//   for (row in rolePages) {
//     cnt++;
//     if (cnt == rolePagesSize) {
//       sqlPageElement = sqlPageElement + " pageid='"+row+"')";
//     } else {
//       sqlPageElement = sqlPageElement + " pageid='"+row+"' or";
//     }
//   }
//   sqlPageElement = sqlPageElement + " and status='1'";
//   sql.query(sqlPageElement, null, "pageelements");
//   for (row in sys.result.pageelements) {
//     list.add(pageElementParams, [roleid, row.pageid, row.elementid, "1", "1", dt, dt]);
//   }
//   pageElements = sys.result.pageelements;
// }

// // 获取所有关联的API和模型
// var pageElementsSize = sys.size(pageElements);
// if (pageElementsSize > 0) {
//   var sqlApi = "select distinct page.appid,page.moduleid,page.apiid from sys_page_api page,sys_apps app,sys_modules module,sys_apis api where (";
//   var sqlModel = "select distinct page.modelid from sys_page_model page,sys_bm002 bm002,sys_bm003 bm003,sys_bm004 bm004 where (";
//   var cnt = 0;
//   var sqlTmp = "";
//   for (row in pageElements) {
//     cnt++;
//     if (cnt == pageElementsSize) {
//       sqlTmp = sqlTmp + " (page.pageid='"+row.pageid+"' and page.elementid='"+row.elementid+"') )";
//     } else {
//       sqlTmp = sqlTmp + " (page.pageid='"+row.pageid+"' and page.elementid='"+row.elementid+"') or";
//     }
//   }
//   sqlApi = sqlApi + sqlTmp + " and page.appid=app.appid and page.moduleid=module.moduleid and page.apiid=api.apiid and app.appid=module.appid and app.appid=api.appid and module.moduleid=api.moduleid and page.status='1' and app.status='1' and module.status='1' and api.status='1'";
//   sqlModel = sqlModel + sqlTmp + " and (page.modelid=bm002.modolcd or page.modelid=bm003.typecd or page.modelid=bm004.typecd) and bm002.status='1' and bm003.status='1' and bm004.status='1' and page.status='1'";
//   sql.query(sqlApi, null, "pageapis");
//   sql.query(sqlModel, null, "pagemodels");
//   for (row in sys.result.pageapis) {
//     list.add(apiParams, [roleid, row.appid, row.moduleid, row.apiid, "1", dt, dt]);
//   }
//   for (row in sys.result.pagemodels) {
//     list.add(modelParams, [roleid, row.modelid, "1", dt, dt]);
//   }
// }

// // 角色菜单关联表
// sql.update("delete from sys_role_menu where roleid=?", [roleid], "1");
// if (sys.size(menuParams) > 0) {
//   sql.updateBatch("insert into sys_role_menu (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)", menuParams, "1");
// }

// // 角色页面关联表 -- 含next_pageid
// sql.update("delete from sys_role_page where roleid=?", [roleid], "1");
// if (sys.size(pageParams) > 0) {
//   sql.updateBatch("insert into sys_role_page (roleid,pageid,status,createdt,updatedt) values (?,?,?,?,?)", pageParams, "1");
// }

// // 角色页面元素关联表
// sql.update("delete from sys_role_pe where roleid=?", [roleid], "1");
// if (sys.size(pageElementParams) > 0) {
//   sql.updateBatch("insert into sys_role_pe (roleid,pageid,elementid,element_status,status,createdt,updatedt) values (?,?,?,?,?,?,?)", pageElementParams, "1");
// }

// // 角色API关联表
// sql.update("delete from sys_role_api where roleid=?", [roleid], "1");
// if (sys.size(apiParams) > 0) {
//   sql.updateBatch("insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)", apiParams, "1");
// }

// // 角色模型关联表
// sql.update("delete from sys_role_model where roleid=?", [roleid], "1");
// if (sys.size(modelParams) > 0) {
//   sql.updateBatch("insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)", modelParams, "1");
// }

// sql.commit();
// sys.setRetData("0");



// saverolemenu 保存角色菜单 - 自动获取菜单关联页面所关联的页面元素和服务
//
// 概要：先整理出所有在本API执行之后DB应该有的数据，然后全删除全添加
// 细节：sys_role_menu sys_role_page sys_role_pe sys_role_api sys_role_model
// 如果直接保存菜单Tree数据而没有具体的页面配置数据，则所有页面及其关联页面按最大权限来保存到响应的各个角色关联表中
// 为避免菜单上新页面点开页面权限配置页面看到的是全部无权限（因sys_role_page无相应数据），而不点开直接保存时是最大权限（参考上一条）的矛盾，UI上，用户在菜单Tree上点击一个带pageid的叶子节点时，如果该节点是勾选状态，并且该pageid不存在于sys_role_page中时，提示先保存菜单Tree数据然后再进行点击，这样保证每个新页面在点开页面权限配置之前都在sys_role_page中保存了最大权限。
// sys_role_menu：根据请求中的menus全删除全添加
// sys_role_page及其它表：如果请求的数据包含具体的权限配置信息，则使用该信息；否则，如果sys_role_page中没有，代表此前没有该页面的权限信息，按最大权限设置，反之，保留目前该页面的权限数据
// 逻辑：
// 按照菜单Tree直接关联的pageid(pageids)，递归获取所有有关联的页面ID
// 去除未授权的pageid   (unAuthorizedPage) ==>(rolePages)
// 循环上一步获得的所有pageid，如果传过来的有，用传过来的数据，如果没有，用DB中原保存的数据(existingAuthorizedPages)，再没有，就是新页面，取最大权限(maxAuthorizedPages)
var requestJson = sys.requestJson;
if (requestJson == null || sys.size(requestJson) == 0){
  sys.setRetData("1", "JSON请求数据为空");
  return;
}

var roleid = requestJson.roleid;
var menus = requestJson.menus;	// 用户本次确认的勾选菜单数据数组，含pageid（如果menu上有）
var pages = requestJson.pages;	// 所有用户点击过的页面数据数组

var pageids = [];
var pageMap = {};	// 便捷查询使用
var unAuthorizedPage = [];  // 未授权的pageid

var menuParams = [];
var pageParams = [];
var pageElementParams = [];
var apiParams = [];
var modelParams = [];

var dt = date.currentTimeString();

// 获取菜单数据和菜单关联的页面ID
if (!sys.isEmpty(menus)) {
  for (row in menus) {
    list.add(menuParams, [roleid, row.menuid, "1", dt, dt]);
  }
}
if (!sys.isEmpty(pages)) {
  for (row in pages) {
    list.add(pageids, row.pageid);
    var tmpMap = null;
    if (row.elementinfo!=null || row.nextpages!=null) {
      tmpMap = {"elementinfo": row.elementinfo, "nextpages": row.nextpages};
    }
    map.put(pageMap, row.pageid, tmpMap);
    if (row.nextpages != null) {
      for (next in row.nextpages) {
        if (next.authorized == null) {
          list.add(unAuthorizedPage, next.next_pageid);
        }
      }
    }
  }
}

// 获取菜单关联的页面以及页面关联的下级页面
// 用while循环反复查询，过程中提出已经查到的pageid，直到查不到结果为止（递归查询）
var sqlNextPage="select next.next_pageid from sys_page_next next,sys_page page where next.pageid=page.pageid and page.status='1' and (";
var rolePages=[];
var stillHaveNextPages = true;
while (stillHaveNextPages) {
  stillHaveNextPages = false;
  var pageidSize = sys.size(pageids);
  if (pageidSize > 0) {
    var sqlNextPageTmp="";
    // 获取一批next_pageid
    for (row in pageids) {
      // 过滤已经检索过的pageid
      if (!list.contain(rolePages, row)) {
        list.add(rolePages, row);
        sqlNextPageTmp = sqlNextPageTmp + " next.pageid='"+row+"' or";
      }
    }
    if (sys.length(sqlNextPageTmp) > 0) {
      sqlNextPageTmp = sys.subStringTo(sqlNextPageTmp, 0, sys.length(sqlNextPageTmp)-3);
      sqlNextPageTmp = sqlNextPage + sqlNextPageTmp + ")";
      sql.query(sqlNextPageTmp, null, "getpages");

      if (sys.size(sys.result.getpages) > 0) {
        stillHaveNextPages=true;
        // 为下一次while循环更换下一批条件pageid为next_pageid的值
        pageids = [];
        for (nextPage in sys.result.getpages) {
          list.add(pageids, nextPage.next_pageid);
        }
      }
    }
  }
}
// 过滤掉未授权的next_page
var tmpRolePages = [];
for (row in rolePages) {
  if (!list.contain(unAuthorizedPage, row)) {
    list.add(pageParams,[roleid,row,"1",dt,dt]);
    list.add(tmpRolePages,row);
  }
}
rolePages = tmpRolePages;

var existingAuthorizedPages = [];	// 临时存储需要获取用户先前配置的数据的pageid
var maxAuthorizedPages = [];		// 临时存储需要获取最大权限数据的pageid
sql.query("select pageid from sys_role_page where roleid=?",[roleid],"existingpage");
var existingpage = sys.result.existingpage;
for (row in rolePages) {
  var setPageInfo = pageMap[row];
  if (setPageInfo != null) {
    // 用户已配置
    if (setPageInfo.elementinfo != null) {
      for (ele in setPageInfo.elementinfo) {
        list.add(pageElementParams, [roleid, row, ele.elementid, ele.element_status, "1", dt, dt]);
        var ec = ele.children;
        if (ec != null) {
          for (srv in ec) {
	    if (srv.authorized != null) {
              if (srv.modelid==null) {
                list.add(apiParams, [roleid, srv.appid, srv.moduleid, srv.apiid, "1", dt, dt]);
              } else {
                list.add(modelParams, [roleid, srv.modelid, "1", dt, dt]);
              }
	    }
          }
        }
      }
    }
  } else {
    // 用户未配置
    if (list.contain(existingpage, row)) {
      // sys_role_page中存在，用户先前配置的数据
      list.add(existingAuthorizedPages, row);
    } else {
      // sys_role_page中不存在，取最大权限
      list.add(maxAuthorizedPages, row);
    }
  }
}

// ----先前配置权限数据获取 开始----
// 页面元素
var existingRolePageElements = [];
var existingRolePagesSize = sys.size(existingAuthorizedPages);
if (existingRolePagesSize > 0) {
  var sqlExistingPageElement = "select pageid,elementid,element_status from sys_role_pe where roleid=? and (";
  var cnt = 0;
  for (row in existingAuthorizedPages) {
    cnt++;
    if (cnt == existingRolePagesSize) {
      sqlExistingPageElement = sqlExistingPageElement + " pageid='"+row+"')";
    } else {
      sqlExistingPageElement = sqlExistingPageElement + " pageid='"+row+"' or";
    }
  }
  sql.query(sqlExistingPageElement, [roleid], "existingpageelements");
  for (row in sys.result.existingpageelements) {
    list.add(pageElementParams, [roleid, row.pageid, row.elementid, row.element_status, "1", dt, dt]);
    if (row.element_status == "1") {
      list.add(existingRolePageElements, row);
    }
  }
}

// 获取所有关联的API和模型
var existingRolePageElementsSize = sys.size(existingRolePageElements);
if (existingRolePageElementsSize > 0) {
  // 先取出全部关联服务在与role_api和role_model对照去掉不存在的
  var sqlApi = "select distinct page.appid,page.moduleid,page.apiid from sys_page_api page,sys_apps app,sys_modules module,sys_apis api,sys_role_api role where (";
  var sqlModel = "select distinct page.modelid from sys_page_model page,sys_bm002 bm002,sys_bm003 bm003,sys_bm004 bm004,sys_role_model role where (";
  var cnt = 0;
  var sqlTmp = "";
  for (row in maxAuthorizedPageElements) {
    cnt++;
    if (cnt == pageElementsSize) {
      sqlTmp = sqlTmp + " (page.pageid='"+row.pageid+"' and page.elementid='"+row.elementid+"') )";
    } else {
      sqlTmp = sqlTmp + " (page.pageid='"+row.pageid+"' and page.elementid='"+row.elementid+"') or";
    }
  }
  sqlApi = sqlApi + sqlTmp + " and page.appid=app.appid and page.moduleid=module.moduleid and page.apiid=api.apiid and app.appid=module.appid and app.appid=api.appid and module.moduleid=api.moduleid and page.status='1' and app.status='1' and module.status='1' and api.status='1'";
  sqlApi = sqlApi + " and role.roleid=? and role.appid=page.appid and role.moduleid=page.moduleid and role.apiid=page.apiid and role.status='1'";
  sqlModel = sqlModel + sqlTmp + " and (page.modelid=bm002.modolcd or page.modelid=bm003.typecd or page.modelid=bm004.typecd) and bm002.status='1' and bm003.status='1' and bm004.status='1' and page.status='1'";
  sqlModel = sqlModel + " and role.roleid=? and role.typecd=page.modelid";
  sql.query(sqlApi, [roleid], "existingpageapis");
  sql.query(sqlModel, [roleid], "existingpagemodels");
  for (row in sys.result.existingpageapis) {
    list.add(apiParams, [roleid, row.appid, row.moduleid, row.apiid, "1", dt, dt]);
  }
  for (row in sys.result.existingpagemodels) {
    list.add(modelParams, [roleid, row.modelid, "1", dt, dt]);
  }
}
// ----先前配置权限数据获取 结束----

// ----最大权限数据获取 开始----
// 获取所有页面元素
var maxAuthorizedPageElements = [];
var rolePagesSize = sys.size(maxAuthorizedPages);
if (rolePagesSize > 0) {
  var sqlPageElement = "select pageid,elementid from sys_page_element where (";
  var cnt = 0;
  for (row in maxAuthorizedPages) {
    cnt++;
    if (cnt == rolePagesSize) {
      sqlPageElement = sqlPageElement + " pageid='"+row+"')";
    } else {
      sqlPageElement = sqlPageElement + " pageid='"+row+"' or";
    }
  }
  sqlPageElement = sqlPageElement + " and status='1'";
  sql.query(sqlPageElement, null, "pageelements");
  maxAuthorizedPageElements = sys.result.pageelements;
  for (row in maxAuthorizedPageElements) {
    list.add(pageElementParams, [roleid, row.pageid, row.elementid, "1", "1", dt, dt]);
  }
}

// 获取所有关联的API和模型
var pageElementsSize = sys.size(maxAuthorizedPageElements);
if (pageElementsSize > 0) {
  var sqlApi = "select distinct page.appid,page.moduleid,page.apiid from sys_page_api page,sys_apps app,sys_modules module,sys_apis api where (";
  var sqlModel = "select distinct page.modelid from sys_page_model page,sys_bm002 bm002,sys_bm003 bm003,sys_bm004 bm004 where (";
  var cnt = 0;
  var sqlTmp = "";
  for (row in maxAuthorizedPageElements) {
    cnt++;
    if (cnt == pageElementsSize) {
      sqlTmp = sqlTmp + " (page.pageid='"+row.pageid+"' and page.elementid='"+row.elementid+"') )";
    } else {
      sqlTmp = sqlTmp + " (page.pageid='"+row.pageid+"' and page.elementid='"+row.elementid+"') or";
    }
  }
  sqlApi = sqlApi + sqlTmp + " and page.appid=app.appid and page.moduleid=module.moduleid and page.apiid=api.apiid and app.appid=module.appid and app.appid=api.appid and module.moduleid=api.moduleid and page.status='1' and app.status='1' and module.status='1' and api.status='1'";
  sqlModel = sqlModel + sqlTmp + " and (page.modelid=bm002.modolcd or page.modelid=bm003.typecd or page.modelid=bm004.typecd) and bm002.status='1' and bm003.status='1' and bm004.status='1' and page.status='1'";
  sql.query(sqlApi, null, "pageapis");
  sql.query(sqlModel, null, "pagemodels");
  for (row in sys.result.pageapis) {
    list.add(apiParams, [roleid, row.appid, row.moduleid, row.apiid, "1", dt, dt]);
  }
  for (row in sys.result.pagemodels) {
    list.add(modelParams, [roleid, row.modelid, "1", dt, dt]);
  }
}
// ----最大权限数据获取 结束----

// 筛除可能的重复服务
var apiParamsNew = [];
var modelParamsNew = [];
for (row in apiParams) {
  var notFound = true;
  var app = row[1];
  var mod = row[2];
  var api = row[3];
  for (rowNew in apiParamsNew) {
    if (app == rowNew[1] && mod == rowNew[2] && api == rowNew[3]) {
      notFound = false;
      break;
    }
  }
  if (notFound) {
    list.add(apiParamsNew, row);
  }
}
for (row in modelParams) {
  var notFound = true;
  var modelid = row[1];
  for (rowNew in modelParamsNew) {
    if (modelid == rowNew[1]) {
      notFound = false;
      break;
    }
  }
  if (notFound) {
    list.add(modelParamsNew, row);
  }
}

// 角色菜单关联表
sql.update("delete from sys_role_menu where roleid=?", [roleid], "1");
if (sys.size(menuParams) > 0) {
  sql.updateBatch("insert into sys_role_menu (roleid,menuid,status,createdt,updatedt) values (?,?,?,?,?)", menuParams, "1");
}

// 角色页面关联表 -- 含next_pageid
sql.update("delete from sys_role_page where roleid=?", [roleid], "1");
if (sys.size(pageParams) > 0) {
  sql.updateBatch("insert into sys_role_page (roleid,pageid,status,createdt,updatedt) values (?,?,?,?,?)", pageParams, "1");
}

// 角色页面元素关联表
sql.update("delete from sys_role_pe where roleid=?", [roleid], "1");
if (sys.size(pageElementParams) > 0) {
  sql.updateBatch("insert into sys_role_pe (roleid,pageid,elementid,element_status,status,createdt,updatedt) values (?,?,?,?,?,?,?)", pageElementParams, "1");
}

// 角色API关联表
// by JYM. 不可删除
// sql.update("delete from sys_role_api where roleid=?", [roleid], "1");
if (sys.size(apiParamsNew) > 0) {
  sql.updateBatch("insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE updatedt = now()", 
    apiParamsNew, "1");
}

// 角色模型关联表
// by JYM. 不可删除
//sql.update("delete from sys_role_model where roleid=?", [roleid], "1");
if (sys.size(modelParamsNew) > 0) {
  sql.updateBatch("insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?) ON DUPLICATE KEY UPDATE updatedt = now()", modelParamsNew, "1");
}
sql.commit();

// 更新角色缓存
http.platformGet({"app":"auth","mod":"rbac","api":"reloadrolecache"},{"roleid":roleid,"reload_type":"00"});
sys.setRetData("0", '模型/API/菜单/页面元素 已经更新!');