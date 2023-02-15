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
//id:getorgusers
//name:获取当前机构用户一览
//编写人：李宁
//测试url:http://192.168.7.120/ds/api/getorgusers?openid=admin&org=test1&app=auth&mod=role&s=d

var openid=sys.request.openid;
var org=sys.request.org;
// var orgid=sys.request.orgid;
var userid=sys.request.userid;
var usernm=sys.request.usernm;
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

var pid=sys.getUserPID(openid);
//判断用户登录类型
var adminflag=sys.getUserAdminFlag(openid,org);
//如果不是管理员登陆，不列出app，返回错误
// if(adminflag!="1"&&adminflag!="3"&&adminflag!="5"){
//     sys.setRetData("1100","用户不是管理员！");
//     return;
// }

var param=[org];

var sql="select distinct b.userid,a.de0201039 usernm,b.status from mdm_personal_info a , sys_userinfo b, sys_tenant_user c where a.pid=b.pid and b.pid=c.pid and c.orgid=? and a.status='1' and b.status='1' and c.status='1' ";

if(userid!=null){
    sql=sql+" and b.userid like ?";
    @param.add("%"+userid+"%");
}
if(usernm!=null){
    sql=sql+" and a.de0201039 like ?";
    @param.add("%"+usernm+"%");
}

if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}
sql=sql+" order by b.userid";
sql.queryPaging(sql,param,pagenum,pagesize);
sys.setRetData("0","","result");