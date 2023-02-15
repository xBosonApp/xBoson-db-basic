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
var cfg = require("config");
var mongodb = require('mongodb');
var uuid = require("uuid");

// 创建字典表索引
db().collection("dicts").createIndex({nm:1});
// db().collection("dicts").dropIndex({"dict.ver":-1});
db().collection("dicts").createIndex({"dict.ver":-1} );
// db().collection("dicts").dropIndex({"dict.data.cd":1});
// db().collection("dicts").createIndex({"dict.data.cd":1}, { unique: true } );
db().collection("dicts").createIndex({"dict.data.cd":1, "dict.data.nm":1});

// 创建术语表索引
// db().collection("terms").createIndex({share:1});
// db().collection("terms").createIndex({name:1});

module.exports = {
  db        : db,
  open      : open,
  genid     : genid,
};

// 根ID（UUID）
function genid() {
  var b = uuid.getBytes(uuid.v1obj());
  return b.toString('base58');
}
// 返回数据表对象
function open(tableName) {
  return db().collection(tableName);
}
// 连接数据库
function db() {
  var pconf = cfg.get("xboson-saas");
  var mcli = mongodb.connect(pconf.mongodb);
  return mcli.db(pconf.dbname_mdm);
}