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

// Oracle
//sql.connection("1cf34e8c3c804d1cb5706fe3644acd8e");

// Mssql
sql.connection("3dcce12b2833434bae955e57b44b0070");

  
sql.queryPaging(`select id from test1 order by id`, [], 1, 30);
//sql.query(`select * from test1`, []);

sys.setRetData(0, 'ok', 'result');