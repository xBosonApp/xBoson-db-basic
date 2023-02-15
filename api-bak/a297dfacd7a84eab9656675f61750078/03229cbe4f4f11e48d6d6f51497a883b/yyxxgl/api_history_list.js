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
var appnm = sys.request.appnm;
var modnm = sys.request.modnm;
var apinm = sys.request.apinm;
var apizt = sys.request.apizt;
var kfz = sys.request.kfz;
var prjid = sys.request.prjid;
var dt1 = sys.request.dtstart;
var dt2 = sys.request.dtend;
if(prjid==null){
  sys.setRetData("1");
  return;
}
var params = [];
if(dt1==null){
  dt2 = date.formattedTime(sys.currentDate(), "yyyy-MM-dd");
  dt1 = date.plusString(dt2,"yyyy-MM-dd", -30,"d");
}
var sqls ="select (select userid from sys_userinfo where pid=a.pid) userid,a.updatedt,(select appnm from sys_apps where appid=b.appid) appnm, (select modulenm from sys_modules where appid=b.appid and moduleid=b.moduleid) modnm, b.apiid,b.apinm,a.updatecmt,a.stability from (select contentid as hisid,contentid,pid,updatedt,updatecmt,stability from sys_api_content union all select hisid,contentid,pid,updatedt,updatecmt,stability from sys_api_his_content) a , sys_apis b ,(select distinct aa.appid appid from sys_role_api aa, (select bb.roleid roleid from sys_role_ug bb,sys_prj cc,sys_ug dd,sys_role ee where cc.prjid=? and cc.ugid=bb.ugid and bb.ugid=dd.ugid and bb.roleid=ee.roleid ) prjrole where aa.roleid=prjrole.roleid ) c where a.contentid=b.contentid and b.appid=c.appid ";

list.add(params,prjid);
if(appnm!=null){
 sqls = sqls +" and b.appid=? ";
 list.add(params,appnm);
}
if(modnm!=null){
  sqls = sqls +" and b.moduleid=? ";
  list.add(params,modnm);
}
if(apinm!=null){
  sqls = sqls +" and b.apiid=? ";
  list.add(params,apinm);
}
if(apizt!=null){
  sqls = sqls +" and a.stability=? ";
  list.add(params,apizt);
}
sqls = sqls +" and a.updatedt>=? and a.updatedt<=? order by a.updatedt desc";
list.add(params,dt1);
list.add(params,dt2);
sql.query(sqls,params);
sys.setRetData("0","","result");