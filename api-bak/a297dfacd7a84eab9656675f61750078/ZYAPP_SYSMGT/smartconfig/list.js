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

var c = require('config');
var where = {}; // 即使是空值也会被认为是查询条件

if (sys.request.name) {
  where.name = sys.request.name;
}

var list = c.list(sys.request.pagenum, sys.request.size, where);
var count = c.size(where);

sys.put('data', list);
sys.put('data_count', count);
sys.put('count', count);
sys.setRetData(0, 'ok');