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
//id:getorgdept
//name:获取当前机构所有部门
//编写人:李宁
//测试url：http://192.168.7.120/ds/api/getorgdept?openid=admin&app=auth&mod=role&s=d&org=zr
 
var openid=sys.request.openid;
var orgid=sys.request.orgid;
var deptcd=sys.request.deptcd;
var deptnm=sys.request.deptnm;
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;
var org=sys.request.org;

var pid=sys.getUserPID(openid);
//判断用户登录类型
var adminflag=sys.getUserAdminFlag(openid,org);
//如果不是管理员登陆，不列出app，返回错误
// if(adminflag!="1"&&adminflag!="3"&&adminflag!="5"){
//     sys.setRetData("1100","用户不是管理员！");
//     return;
// }

var sql="select deptid,deptcd,deptnm,status from mdm_dept  ";
sql=sql+" where orgid=? and status='1'";
// var sql="select deptid,deptcd,deptnm,status from mdm_dept where orgid=?";
var param=[org];

if(deptcd!=null){
    sql=sql+" and deptcd like ?";
    @param.add("%"+deptcd+"%");
}
if(deptnm!=null){
    sql=sql+" and deptnm like ?";
    @param.add("%"+deptnm+"%");
}
if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}
sql=sql+" order by deptcd";
sql.queryPaging(sql,param,pagenum,pagesize);
sys.setRetData("0","","result");