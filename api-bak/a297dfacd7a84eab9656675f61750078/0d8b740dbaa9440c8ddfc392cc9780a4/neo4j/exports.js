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
"use strict";

// 导出 csv 格式
// n, 1, 2, 3 
//    实体行, 1:实体名, 2:属性名, 3:属性值
// r, 1, 2, 3
//    关系行, 1:实体, 2:关系, 3:实体
// l, 1, 2, 3
//    关系属性, 1:关系, 2:属性名, 3:属性值

var id = sys.request.getString("_id");
var conninfo = lib.db("conn-list").find({_id: id})[0];
if (!conninfo) {
  return sys.ret(1, "不是有效连接 "+ id);
}

var all_entity = 'MATCH (x) RETURN x';
var all_rel = 'MATCH ()-[x]->() RETURN x';

sys.setRetData(0, 'Do nothing.');