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
//id:delbm002
//name:删除操纵定义

var modolcd=sys.request.modolcd;

if(modolcd==null){
    sys.setRetData("1");
    return;
}

// sys_bm002
var delSql="delete from sys_bm002 where modolcd=?";
sql.update(delSql,[modolcd]);
// sys_role_model
var delSql2="delete from sys_role_model where typecd=?";
sql.update(delSql2,[modolcd]);

// 更新缓存
se.delCache(_CACHE_REGION_BIZ_MODEL_,modolcd);

sys.setRetData("0");