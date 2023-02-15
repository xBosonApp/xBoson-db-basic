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
//id:sortmenu
//name:同级菜单排序

var menuid=sys.request.menuid;
var sorting_order=sys.request.sorting_order;

if(menuid==null||sorting_order==null){
    sys.setRetData("1");
    return;
}

var menuid_array=sys.split(menuid,",");
var sorting_order_array=sys.split(sorting_order,",");

if(sys.size(menuid_array)==sys.size(sorting_order_array)){
    var sql="update sys_menu set sorting_order=? where menuid=?";
    var params=[];
    var i=0;
    while(i<sys.size(menuid_array)){
        params=[sorting_order_array[i],menuid_array[i]];
        sql.update(sql,params,"1");
        i=i+1;
    }
    sql.commit();
    sys.setRetData("0");
}else{
    sys.setRetData("2");
    return;
}