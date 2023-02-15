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
var roleid = sys.request.roleid;
var json = sys.request.json;    //{"pageid":"0",...}

if(roleid == null){
    sys.setRetData("1");
    return;
}
var jsonObj = sys.instanceFromJson(json);
if(jsonObj==null){
    sys.setRetData("0");
    return;
}

//检查角色ID是否存在
if(sql.query("select 1 from sys_role where roleid=?",[roleid])==0){
    sys.setRetData("2","角色ID不存在");
    return;
}

//删除原来的此roleid对应的页面权限
sql.update("delete from sys_role_page_auth where roleid=?",[roleid],"1");

//插入此roleid对应的页面权限
var dt = sys.currentTimeString();
var sql = "insert into sys_role_page_auth (roleid,pageid,page_auth,status,createdt,updatedt) values (?,?,?,?,?,?)";
var params=[];

for(entry in jsonObj){
    list.add(params,[roleid,entry.key,entry.value,"1",dt,dt]);
}

sql.updateBatch(sql,params,"1");

sql.commit();

sys.setRetData("0");