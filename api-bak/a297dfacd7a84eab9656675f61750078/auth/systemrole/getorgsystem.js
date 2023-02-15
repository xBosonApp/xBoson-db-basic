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
//id:getorgsystem
//name:获取当前机构所有系统
//编写人:王莹莹
//测试url：http://192.168.7.120/ds/api/getorgdept?openid=admin&app=auth&mod=role&s=d&org=zr
 
var org=sys.request.org; 
var openid=sys.request.openid;
var orgid=sys.request.orgid;
var sysid=sys.request.sysid;
var sysnm=sys.request.sysnm;
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

var flag=sys.getUserAdminFlag(openid,org);
//如果不是管理员登陆，返回错误
// if(flag!="1"&&flag!="3"&&flag!="5"){
//     sys.setRetData("1100","用户不是管理员！");
//     return;
// }

var sql="select distinct b.sysid,a.createdt,b.sysnm,b.ip,b.port,b.uri,b.inner_flag,b.sys_desc,'有效' statusnm from sys_system_role a , sys_system b where a.sysid=b.sysid and  b.orgid = ? "
+" and a.status='1' and b.status='1'";

var param=[orgid];

if(sysid!=null){
    sql=sql+" and b.sysid like ?";
    @param.add("%"+sysid+"%");
}
if(sysnm!=null){
    sql=sql+" and b.sysnm like ?";
    @param.add("%"+sysnm+"%");
}
if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}
sql=sql+" order by a.createdt desc";
sql.queryPaging(sql,param,pagenum,pagesize);
sys.setRetData("0","","result");