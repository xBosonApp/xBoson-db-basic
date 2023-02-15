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

// try {
//   sql.update('Insert Into test (a) values (1)', [], '1');
//   sql.commit();
// } catch(e) {
//   sys.put("error", e.message);
//   sql.rollback();
// }

// update 第三个参数是 '0' 表示使用自动递交模式
sql.update('Insert Into test.t1 (id, zip) values (?,?)', [5, 11], '0');

// 在自动递交模式中调用该方法会抛出异常
sql.commit();

sys.setRetData(0, 'Do nothing.');