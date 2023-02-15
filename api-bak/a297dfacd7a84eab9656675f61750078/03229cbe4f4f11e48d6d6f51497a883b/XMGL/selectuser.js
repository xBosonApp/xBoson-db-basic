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
//id:selectuser
//name:获取选择项目(角色)的人员信息
//编写人：王莹莹

var roleid=sys.request.roleid;
var status = sys.request.status;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;//默认pagenum值
var PSDefualt = 10;//默认pagesize值
var orgid = sys.request.org;

  //查询 sys_role 表
  //判断不为空的字段
 if(roleid == null){
     sys.setRetData("1");
      return;
   }
   var sqlSel;
  
 sqlSel ="SELECT r.roleid,u.pid,i.userid,p.de0201039,p.de0201040,p.de0201005,"+
 "p.de0201030,p.de0810007 from sys_user_role u,sys_role r ,sys_userinfo i, "+
 " mdm_personal_info p where u.roleid = r.roleid and u.pid = i.pid and p.pid=u.pid "+
 " and r.roleid = ? and r.orgid=?";
  var paramSel = [roleid,orgid];          
 if (pagenum == null) {
  	pagenum = pNDefualt;
  }
  if (pagesize == null) {
  	pagesize = PSDefualt;
  }
var queryPagingCount = sql.queryPaging(sqlSel,paramSel,pagenum,pagesize,"result");
 sys.setRetData("0","","result");