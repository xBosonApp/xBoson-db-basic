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

var s = "Select * From sys_pl_boson_coin Where user_id = ?";
var p = [ sys.getUserIdByPID() ];

if (sql.query(s, p) < 1) {
  var i = `INSERT INTO sys_pl_boson_coin
            ( user_id,
              coin,
              createdt,
              updatedt)
            VALUES
            ( ?, 0, now(), now() )`;
  sql.update(i, p);
  sql.query(s, p);
  
  var lib = require("./lib");
  lib.push({
    user: p[0],
    coin: 0,
    act : 'init',
  });
}

sys.setRetData(0, 'ok', 'result');