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
//id:getrolemenu
//name:获取包含指定角色的菜单

var org=sys.request.org;
var openid=sys.request.openid;
var roleid=sys.request.roleid;
//adminflag
var adminflag=sys.getUserAdminFlag(openid,org);
//如果是普通用户，不返回数据
// if(adminflag!="1"&&adminflag!="3"&&adminflag!="5"){
//     sys.setRetData("1100");
//     return;
// }
//获取所有菜单
var menusql="select menuid,p_menuid,levels,menu_icon,menunm,uri,sorting_order,menu_desc,orgid,status,roleid,createdt,updatedt from sys_menu order by levels,sorting_order";
sql.query(menusql,[]);
var menulist=sys.result.result;
//循环menulist,增加checked字段（有指定roleid的checked为true）
for(r in menulist){
    var boo=false;
    if(r.status=='1'){
        if(sys.contain(r.roleid,roleid)){
            boo=true;
        }
    }
    if(boo){
        map.put(r,"checked",true);
    }else{
        map.put(r,"checked",false);
    }
}

for(var i=0;i<9;i++){
   for(r in menulist){
        if(r.checked==false){
            for(t in menulist){
                if(t.p_menuid == r.menuid && t.checked==true){
                    map.put(r,"checked",true);
                }
            }
        }
    }
}
sys.setRetData("0","","result");