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

sql.update("DELETE FROM `test`.`t1` ");

sql.update("INSERT INTO `test`.`t1` (`id`) VALUES (1) ", [], true);
sql.update("INSERT INTO `test`.`t1` (`id`) VALUES (2) ", [], true);
sql.query("select * from test.t1", [], 't1');
sql.rollback();
sql.query("select * from test.t1", [], 't2');


if (sys.result.t2.length == 0) {
  sys.setRetData(0, 'ok', 't1', 't2');
} else {
  sys.setRetData(1, '事务不起作用', 't1', 't2');
}