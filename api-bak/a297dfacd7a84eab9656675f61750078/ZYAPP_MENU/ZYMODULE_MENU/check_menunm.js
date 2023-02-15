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

//id:check_menunm
//name:获取子菜单一览
//测试url:http://192.168.7.120/ds/api/check_menunm?openid=admin&org=zr&app=ZYAPP_MENU&mod=ZYMODULE_MENU&s=d
var p_menuid=sys.request.p_menuid;
var menunm=sys.request.menunm;
// var sorting_order=sys.request.sorting_order;
var menuid=sys.request.menuid;
var orgid=sys.request.orgid;

if(menunm==null||orgid==null){
    sys.setRetData("1");
    return;
}
//标识menunm是否重复字段
var menunm_c=false;
// //标识sorting_order是否重复字段
var sorting_order_c=false;
//如果p_menuid为空,则选择一级菜单
if(p_menuid==null){
    var sql0="select a.menuid,a.p_menuid,a.levels,a.menu_icon,a.menunm,a.uri,a.sorting_order,a.menu_desc,a.orgid,a.status,a.createdt,a.updatedt from sys_menu a where levels='1' and orgid=?";
    var param0=[orgid];
    //全部查询结果
sql.query(sql0,param0,"result0");

//P_menuid不为空的情况
}else{
var sql="select menuid,p_menuid,levels,menu_icon,menunm,uri,sorting_order,menu_desc,orgid,status,createdt,updatedt from sys_menu where p_menuid=? and orgid=?";
var param=[p_menuid,orgid];
//全部查询结果
sql.query(sql,param,"result0");
}

var result0=sys.result.result0;
for(r in result0){
    if(r.menuid==menuid){
        break;
    }
    if(r.menunm==menunm){
        menunm_c=true;
    }
    // if(r.sorting_order==sorting_order){
    //     sorting_order_c=true;
    // }
}

var return_json=[{"menunm_c":menunm_c,"sorting_order_c":sorting_order_c}];
sys.addRetData(return_json,"result");
sys.setRetData("0","","result");