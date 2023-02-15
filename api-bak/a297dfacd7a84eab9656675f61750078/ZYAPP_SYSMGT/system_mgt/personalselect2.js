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
//系统下拉菜单
//deptselect2

var userid = sys.request.userid;
var orgid = sys.request.org;
var de0201039 = sys.request.de0201039;      //姓名
var de0201040 = sys.request.de0201040;      //性别
var de0201010 = sys.request.de0201010;      //电话号码
var de0201012 = sys.request.de0201012;      //电子邮件

var pagesize = sys.request.pagesize;
var pagenum = sys.request.pagenum;

var sqlSelect = "select p.pid, u.userid, p.de0201039, p.de0201040, p.de0201010, p.de0201012 from sys_tenant_user t, mdm_personal_info p, sys_userinfo u where p.pid = u.pid and p.pid = t.pid and u.pid = t.pid and p.status = '1' and u.status = '1' and t.status = '1' and  t.orgid=? ";

var params = [orgid];

if(userid != null) {
    sqlSelect = sqlSelect + " and userid like ?";
    list.add(params, "%"+userid+"%");
}
if(de0201039 != null){
    sqlSelect = sqlSelect + " and de0201039 like ?";
    list.add(params, "%"+de0201039+"%");
}
if(de0201040 != null){
    sqlSelect = sqlSelect + " and de0201040 = ?";
    list.add(params, de0201040);
}
if(de0201010 != null){
    sqlSelect = sqlSelect + " and de0201010 like ?";
    list.add(params, "%"+de0201010+"%");
}
if(de0201012 != null){
    sqlSelect = sqlSelect + " and de0201012 like ?";
    list.add(params, "%"+de0201012+"%");
}
if(pagenum == null){
    pagenum = 1;
}
if(pagesize == null){
    pagesize = 10;
}
sql.queryPaging(sqlSelect, params, pagenum, pagesize, "result");
sys.setRetData("0","","result");