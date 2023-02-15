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
//id:apilog
//name:获取日志信息

var appid=sys.request.appid;
var moduleid=sys.request.moduleid;
var apiid=sys.request.apiid;

var pagecnt=sys.request.pagecnt;
var pagenum = sys.request.pagenum;
var pNDefualt = 1;//默认pagenum值

var sqlSel;
var paramSel = [appid,moduleid,apiid];

sqlSel="SELECT a.contentid,r.pid,r.updatecmt,r.updatedt,(SELECT de0201039  FROM "+
" mdm_personal_info WHERE pid=r.pid) AS name,(SELECT u.image_path FROM sys_userinfo u "+
" WHERE pid=r.pid) AS image_path FROM sys_apis a,((select contentid,pid,updatecmt,"+
" updatedt from sys_api_content) union (select contentid,pid,updatecmt,updatedt from "+
" sys_api_his_content)) r WHERE a.contentid = r.contentid AND a.appid= ? AND "+
" a.moduleid =? AND a.apiid=? order by r.updatedt desc ";
 
if (pagenum == null) {
  	pagenum = pNDefualt;
  }
var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,sys.parseInt(pagecnt),"result");
sys.setRetData("0","","result");