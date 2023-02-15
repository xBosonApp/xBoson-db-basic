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
//id:getorgmenu
//name:获取指定机构menu

var org=sys.request.org;
var openid=sys.request.openid;
// var orgid=sys.request.orgid;
// var commonmenu_flag=sys.request.commonmenu_flag;

var pid=sys.getUserPID(openid);
//测试用
// pid="aff84ed550cd49679db26db06f2c6687";
//获取当前登录用户类型
var adminflag=sys.getUserAdminFlag(openid,org);

//如果是普通用户或管理员，不返回数据
// if(adminflag!="1"&&adminflag!="3"&&adminflag!="5"){
//     sys.setRetData("1100");
//     return;
// }
//如果登陆用户是机构管理员，且要获取的是通用菜单
// if(usertype[0].adminflag!="1"&&commonmenu_flag="1"){
//     //根据操作用户有哪些通用角色，返回哪些通用菜单
//   var ret=sys.getCommonMenus();

//   sys.addRetData(ret,"result");
//   sys.setRetData("0","","result");
// }

// var sql_new="select menuid,p_menuid,levels,menu_icon,menunm,uri,sorting_order,menu_desc,orgid,status,roleid,createdt,updatedt,case when status='1' then 'true' else 'false' end checked from sys_menu where levels=?";
// var param_new=['1'];
// sql.query(sql_new,param_new,"result1");
// var result1=sys.result.result1;

// param_new=['2'];
// sql.query(sql_new,param_new,"result2");
// var result2=sys.result.result2;

// param_new=['3'];
// sql.query(sql_new,param_new,"result3");
// var result3=sys.result.result3;

// param_new=['4'];
// sql.query(sql_new,param_new,"result4");
// var result4=sys.result.result4;

// param_new=['5'];
// sql.query(sql_new,param_new,"result5");
// var result5=sys.result.result5;

// param_new=['6'];
// sql.query(sql_new,param_new,"result6");
// var result6=sys.result.result6;

// param_new=['7'];
// sql.query(sql_new,param_new,"result7");
// var result7=sys.result.result7;

// param_new=['8'];
// sql.query(sql_new,param_new,"result8");
// var result8=sys.result.result8;

// param_new=['9'];
// sql.query(sql_new,param_new,"result9");
// var result9=sys.result.result9;

// param_new=['10'];
// sql.query(sql_new,param_new,"result10");
// var result10=sys.result.result10;

// sys.setRetList(result9,result10,[["menuid","p_menuid"]],"children");
// sys.setRetList(result8,result9,[["menuid","p_menuid"]],"children");
// sys.setRetList(result7,result8,[["menuid","p_menuid"]],"children");
// sys.setRetList(result6,result7,[["menuid","p_menuid"]],"children");
// sys.setRetList(result5,result6,[["menuid","p_menuid"]],"children");
// sys.setRetList(result4,result5,[["menuid","p_menuid"]],"children");
// sys.setRetList(result3,result4,[["menuid","p_menuid"]],"children");
// sys.setRetList(result2,result3,[["menuid","p_menuid"]],"children");
// sys.setRetList(result1,result2,[["menuid","p_menuid"]],"children");
// sys.addRetData(result1,"result");
// sys.setRetData("0","","result");


var sql_new="select menuid,p_menuid,levels,menu_icon,menunm,uri,sorting_order,menu_desc,orgid,status,roleid,createdt,updatedt,case when status='1' then 'true' else 'false' end checked from sys_menu";

sql.query(sql_new,null,"data");
var result = sys.transformTreeData(sys.result.data,"menuid","p_menuid","children");
sys.addRetData(result,"result");
sys.setRetData("0","","result");