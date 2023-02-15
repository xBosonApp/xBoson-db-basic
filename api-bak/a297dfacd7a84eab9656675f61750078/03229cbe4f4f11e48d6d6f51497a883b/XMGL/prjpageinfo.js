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
//prjpageinfo
var pageid=sys.request.pageid;
var prjid=sys.request.prjid;
if(pageid==null){
    sys.setRetData("1","页面ID为空");
    return;
}
if(prjid==null){
    sys.setRetData("1","项目ID为空");
    return;
}
//页面信息
sql.query("select pageid,pagenm,prjid,page_path,status from sys_page where pageid=? and prjid=?",[pageid,prjid],"pageinfo");

// 页面元素信息
sql.query("select pageid,elementid,elementnm from sys_page_element where pageid=? order by pageid,elementid",[pageid],"elementinfo");

// 页面元素关联事件信息
var sqlApi="select srv.page_api_id,srv.pageid,srv.elementid,srv.appid,app.appnm,srv.moduleid,module.modulenm,srv.apiid,api.apinm from sys_page_api srv,sys_apps app,sys_modules module,sys_apis api where srv.pageid=? and srv.appid=app.appid and srv.moduleid=module.moduleid and app.appid=module.appid and app.appid=api.appid and module.moduleid=api.moduleid and srv.apiid=api.apiid order by srv.pageid,srv.elementid";
sql.query(sqlApi,[pageid],"apiinfo");
var slqModel="select srv.page_model_id,srv.pageid,srv.elementid,srv.modelid,model.modelnm from sys_page_model srv,(select modolcd modelid,modolnm modelnm from sys_bm002 union select a.typecd modelid,b.typenm modelnm from sys_bm003 a,sys_bm001 b where a.typecd = b.typecd union select a.typecd modelid,b.typenm modelnm from sys_bm004 a,sys_bm001 b where a.typecd = b.typecd) model where srv.pageid=? and srv.modelid=model.modelid order by srv.pageid,srv.elementid";
sql.query(slqModel,[pageid],"modelinfo");

// 整合事件信息到元素信息中
list.addAll(sys.result["apiinfo"],sys.result["modelinfo"]);
list.sort(sys.result["apiinfo"],"pageid","elementid");
sys.setRetList(sys.result["elementinfo"],sys.result["apiinfo"],[["pageid","pageid"],["elementid","elementid"]],"children");

// 下级页面信息
sql.query("select next.next_pageid next_pageid,page.pagenm pagenm from sys_page_next next,sys_page page where next.pageid=? and next.next_pageid=page.pageid",[pageid],"nextpages");

// 返回 页面信息，整合后的页面元素信息，下级页面信息
sys.setRetData("0","","pageinfo","elementinfo","nextpages");