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
var orgid=sys.request.orgid;

if(menuid==null||sorting_order==null||orgid==null){
    sys.setRetData("1");
    return;
}

var menuid_array=strutil.split(menuid,",");
var sorting_order_array=strutil.split(sorting_order,",");

if(menuid_array.~size==sorting_order_array.~size){
    
    var sql="update sys_menu set sorting_order=? where menuid=?";
    var params=[];
    var i=0;
    while(i<menuid_array.~size){
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