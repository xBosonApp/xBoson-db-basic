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

var lib = require('./lib');
var db = lib.opendb();
var coll = db.collection('_prj');
var owner = sys.getUserIdByPID();

var where = {_id:_id, owner:owner};
var prj = coll.find(where)[0];
if (!prj) {
  sys.setRetData(1, '项目不存在, 或无权访问');
  return;
}

var mongodb = require('mongodb');
var c = mongodb.connect(prj.url).db(prj.db).collection(prj.coll).count();
if (c > 0) {
  sys.setRetData(1, '项目中有数据, 不能删除');
  return;
} 

coll.deleteOne(where);
sys.setRetData(0, '项目已删除');