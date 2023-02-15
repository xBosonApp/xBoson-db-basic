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
// 参数
var typecd=sys.request.typecd;

if(typecd == null){
    sys.setRetData("1");
    return;
}

// 检查类别索引是否是最底层索引
var chksql = "select typecd from sys_pl_cd1 where parentcd=?";
var count = sql.query(chksql,[typecd],"chk_r");
if(count > 0){
    sys.setRetData("2","类别索引不是最底层节点！");
    return;
}
// 执行sql
var sql="delete from sys_pl_cd1 where typecd=?";
sql.update(sql,[typecd]);

sys.setRetData("0");