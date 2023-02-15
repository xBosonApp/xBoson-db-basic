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
// var org=sys.request.orgid;

//项目
var sqlItem="select roleid id,rolenm name,concat(roleid,rolenm) text from sys_role where role_type='02' order by createdt";

sql.query(sqlItem, null);
//app
var sql="select distinct a.roleid pid, a.appid id, b.appnm name,concat(b.appid,b.appnm) text from sys_role_api a,sys_apps  b where a.appid=b.appid";
sql.query(sql,null,"appR");

//项目和app关联
sys.setRetList(sys.result.result,sys.result.appR,[["id","pid"]],"children");
for(r in sys.result.result){
    map.put(r,"disabled",true);
}
sys.setRetData("0","","result");