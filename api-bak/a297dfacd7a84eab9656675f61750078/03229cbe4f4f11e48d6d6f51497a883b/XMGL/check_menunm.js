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
var p_menuid=sys.request.p_menuid;
var menunm=sys.request.menunm;
var menuid=sys.request.menuid;

if(menunm==null){
    sys.setRetData("1","菜单名称为空");
    return;
}
//标识menunm是否重复字段
var menunm_c=false;
// //标识sorting_order是否重复字段
var sorting_order_c=false;
//如果p_menuid为空,则选择一级菜单
if(p_menuid==null){
    var sql0="select menuid,p_menuid,levels,menu_icon,menunm,uri,pageid,sorting_order,menu_desc,status,createdt,updatedt from sys_menu where levels='1'";
    var param0=[];
    //全部查询结果
    sql.query(sql0,param0,"result0");
//p_menuid不为空的情况
}else{
    var sql="select menuid,p_menuid,levels,menu_icon,menunm,uri,pageid,sorting_order,menu_desc,status,createdt,updatedt from sys_menu where p_menuid=?";
    var param=[p_menuid];
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
}

var return_json=[{"menunm_c":menunm_c,"sorting_order_c":sorting_order_c}];
sys.addRetData(return_json,"result");
sys.setRetData("0","","result");