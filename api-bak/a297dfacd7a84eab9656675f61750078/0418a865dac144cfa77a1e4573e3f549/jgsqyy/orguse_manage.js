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
//wangyingying
var applicationid=sys.request.applicationid;
var orgid=sys.request.org_id;

if(null==orgid){
  sys.setRetData("1");
  return;
}

var sqls="delete from sys_pl_org_application where orgid=?";
sql.update(sqls,[orgid],"1");

if(applicationid!=null){
  //插入新应用
  sqls="insert into sys_pl_org_application (orgid,applicationid,expiration,status,createdt,updatedt) values (?,?,?,?,?,?)";

  var dt = sys.currentTimeString();
  var applicationid_array=sys.split(applicationid,",");
  var i=0;
  while(i<sys.size(applicationid_array)){
    sql.update(sqls,[orgid,applicationid_array[i],"00000000","1",dt,dt],"1");
    i=i+1;
  }
}
sql.commit();
sys.setRetData("0");