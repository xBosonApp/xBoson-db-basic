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
//id:delbm002_bytable
//name:删除操纵定义(通过数据源id和表)

var did=sys.request.did;
var table_name=sys.request.table_name;

if(did==null||table_name==null){
    sys.setRetData("1");
    return;
}

// sys_bm002
var delSql="delete from sys_bm002 where did=? and tablenm=?";
sql.update(delSql,[did,table_name],"1");
// sys_role_model
var delSql2="delete from sys_role_model where typecd in (select modolcd from sys_bm002 where did=? and tablenm=?)";
sql.update(delSql2,[did,table_name],"1");

sql.commit();
// 更新缓存
sql.query("select modolcd from sys_bm002 where did=? and tablenm=?",[did,table_name]);
for(modolcd in sys.result.result){
    se.delCache(_CACHE_REGION_BIZ_MODEL_,modolcd);
}

sys.setRetData("0");