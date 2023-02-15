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

// 激活30天试用, 才可进行jdbc访问
// sys.printValue(http.post("http://localhost:9200/_license/start_trial?acknowledge=true", null, null, 'json'));

sql.connection('0d7e27c10a8940ce9510d7d1d8171419');
sql.query("select * from a", [], 's1');
sys.setRetData(0, 'ok', 's1');