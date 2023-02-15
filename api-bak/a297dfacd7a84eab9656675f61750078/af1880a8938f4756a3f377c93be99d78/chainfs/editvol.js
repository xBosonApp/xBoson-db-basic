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

var selfuser = sys.getUserIdByPID();
var id     = sys.request.getString('_id', 1, 99);
var name   = sys.request.getString('name', 3, 99);
var reader = toJsArr(sys.requestParameterMap.reader);
var writer = toJsArr(sys.requestParameterMap.writer);

var lib = require("./lib");
var vol = lib.openTable('volume');

vol.updateOne({
  _id   : id,
  owner : selfuser,
}, { $set: {
  reader : reader,
  writer : writer,
  name   : name,
}});

sys.printValue(reader)
sys.setRetData(0, 'ok');


function toJsArr(x) {
  if (!x) return [];
  var ret = [];
  for (var i=0; i<x.length; ++i) {
    if (!sys.getUserPID(x[i])) {
      throw new Error("无效的用户: "+ x[i]);
    }
    ret[i] = x[i];
  }
  return ret;
}