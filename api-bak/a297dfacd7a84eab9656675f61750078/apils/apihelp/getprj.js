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
"use strict";
//ideprj 获取当前机构全部的项目信息列表，未区分该用户角色和项目管理者（查看用）
var flg = sys.request.flg; // flg!=null 返回ztree
var prjid = sys.request.prjid; // 项目id
var strSql = "";
var param = [];

if(prjid == null){
	prjid="";
}else{
  param=[prjid];
	prjid=" and prjid=? ";
}

// flg == null获取项目基本信息
if (flg == null) {
  strSql = "select prjid id,prjid nid,prjnm name,mark from sys_prj where status='1'"+prjid+"ORDER by createdt asc";
}else{  //ztree数据结构
	strSql = "select prjid id,prjid nid,0 pid,'1' flg,'true' parent,concat('（项目）',prjnm) name,mark from sys_prj where status='1'"+prjid+"ORDER by createdt asc";
}
sql.query(strSql,param,"result");
sys.setRetData("0","","result");