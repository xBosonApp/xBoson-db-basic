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
var prjid = sys.request.getString('prjid', 1, 99);
var _id  = sys.request.getString('_id', 1, 99);

var lib = require("../prjmgr/lib");
var coll = lib.openprj(sys, prjid);

var dr = coll.deleteOne({
  _id  : _id,
  type : 'app',
});

lib.returnMgDelinfo(sys, dr);