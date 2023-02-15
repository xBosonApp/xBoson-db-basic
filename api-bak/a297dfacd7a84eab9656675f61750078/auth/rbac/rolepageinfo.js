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
// rolepageinfo 角色页面信息
var pageid=sys.request.pageid;
var roleid=sys.request.roleid;
if(pageid==null){
  sys.setRetData("1","页面未指定");
  return;
}
if(roleid==null){
  sys.setRetData("1","角色未指定");
  return;
}
//页面信息
sql.query("select p.pageid,p.pagenm,r.roleid authorized from sys_page p left join sys_role_page r on p.pageid=r.pageid and r.roleid=? where p.pageid=?",[roleid,pageid],"pageinfo");

// 页面元素信息
sql.query("select e.pageid,e.elementid,e.elementnm,r.element_status from sys_page_element e left join sys_role_pe r on e.pageid=r.pageid and e.elementid=r.elementid and r.roleid=? where e.pageid=? order by e.pageid,e.elementid",[roleid,pageid],"elementinfo");

// 页面元素关联事件信息
var sqlApi="select srv.page_api_id,srv.pageid,srv.elementid,srv.appid,app.appnm,srv.moduleid,module.modulenm,srv.apiid,api.apinm,r.roleid authorized from sys_page_api srv left join sys_role_api r on r.roleid=? and srv.appid=r.appid and srv.moduleid=r.moduleid and srv.apiid=r.apiid,sys_apps app,sys_modules module,sys_apis api where srv.pageid=? and srv.appid=app.appid and srv.moduleid=module.moduleid and app.appid=module.appid and app.appid=api.appid and module.moduleid=api.moduleid and srv.apiid=api.apiid order by srv.pageid,srv.elementid";
sql.query(sqlApi,[roleid,pageid],"apiinfo");
var sqlModel="select srv.page_model_id,srv.pageid,srv.elementid,srv.modelid,model.modelnm,r.roleid authorized from sys_page_model srv left join sys_role_model r on r.roleid=? and r.typecd=srv.modelid,(select modolcd modelid,modolnm modelnm from sys_bm002 union select a.typecd modelid,b.typenm modelnm from sys_bm003 a,sys_bm001 b where a.typecd = b.typecd union select a.typecd modelid,b.typenm modelnm from sys_bm004 a,sys_bm001 b where a.typecd = b.typecd) model where srv.pageid=? and srv.modelid=model.modelid order by srv.pageid,srv.elementid";
sql.query(sqlModel,[roleid,pageid],"modelinfo");

// 整合事件信息到元素信息中
list.addAll(sys.result["apiinfo"],sys.result["modelinfo"]);
list.sort(sys.result["apiinfo"],"pageid","elementid");
sys.setRetList(sys.result["elementinfo"],sys.result["apiinfo"],[["pageid","pageid"],["elementid","elementid"]],"children");

// 下级页面信息
sql.query("select next.next_pageid next_pageid,page.pagenm pagenm,r.roleid authorized from sys_page_next next left join sys_role_page r on next.next_pageid=r.pageid and r.roleid=?,sys_page page where next.pageid=? and next.next_pageid=page.pageid",[roleid,pageid],"nextpages");

// 返回 页面信息，整合后的页面元素信息，下级页面信息
sys.setRetData("0",null,"pageinfo","elementinfo","nextpages");