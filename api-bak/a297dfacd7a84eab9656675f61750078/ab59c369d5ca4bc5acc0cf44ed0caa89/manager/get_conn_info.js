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

var cid = sys.request.getString('_id', 1);
var lib = require("../server/lib");
var data = lib.getConn(cid);
var mapp = lib.getItemSetting(cid);

data.primary_column = mapp.primary_column;
data.val_column = mapp.val_column;
sys.put('data', data);
sys.put('mapping', mapp);

sys.setRetData(0);