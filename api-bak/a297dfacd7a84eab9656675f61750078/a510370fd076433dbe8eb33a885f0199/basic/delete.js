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

var filename = sys.request.getString('_id', 1, 45);
var lib = require("./lib");
var doc = lib.opendoc();

if (!lib.checkAuth(sys, filename))
  return;

var ret = doc.deleteOne({
  _id: filename,
});

if (ret.getDeletedCount()) {
  sys.setRetData(0, '文件已删除', 'data');
} else {
  sys.setRetData(1, '找不到文件 '+ filename);
}