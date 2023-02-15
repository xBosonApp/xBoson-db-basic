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

var _id = sys.request.getString('_id', 1, 99);
var name  = sys.request.getString('name', 1, 99);
var roles = sys.requestParameterMap['roles[]'];

var lib = require('./lib');
var db = lib.opendb();
var coll = db.collection('_prj');

if (coll.count({name:name, _id:{$ne:_id}}) > 0) {
  sys.setRetData(1, '项目名称冲突, 请修改');
  return;
}

var owner = sys.getUserIdByPID();

var up = coll.updateOne({_id:_id, owner:owner}, {
  $set: {
    name : name,
    roles : roles,
  }
});

if (up.getModifiedCount() < 0) {
  sys.setRetData(1, '失败, 项目不存在, 或无权操作');
}
sys.setRetData(0, '项目已经修改');