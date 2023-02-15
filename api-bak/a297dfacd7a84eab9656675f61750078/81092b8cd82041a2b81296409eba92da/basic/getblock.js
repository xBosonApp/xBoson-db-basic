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

var chain_id = sys.request.getString('chain_id', 1, 45);
var key = sys.request.getString('key', 1, 99);

var bc = require("chain");
var chain = bc.open("id://"+ chain_id);
var block = chain.search(key);

sys.addRetData(block, 'block');
sys.addRetData(chain.size(), 'size');
sys.setRetData(0, 'ok', 'block', 'size');