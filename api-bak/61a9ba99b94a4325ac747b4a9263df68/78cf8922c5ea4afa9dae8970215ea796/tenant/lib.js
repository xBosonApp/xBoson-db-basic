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
var pconf = cfg.get("xboson-saas");

// 创建租户管理表索引
// db().collection("tenant-org").dropIndex({"member.pid":1});
// db().collection("tenant-org").createIndex({"member.pid":1});
// 创建租户订单表索引
// db().collection("tenant-order").dropIndex({"item.app":1} );
db().collection("tenant-order").createIndex({"item.app":1});

module.exports = {
  db        : db,
  open      : open,
  open_crm  : open_crm,
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

// 客户关系数据库的表
function open_crm(tableName) {
  return db_crm().collection(tableName);
}

// 连接数据库
function db() {
  var mcli = mongodb.connect(pconf.mongodb);
  return mcli.db(pconf.dbname_operate);
}

// 客户关系数据库
function db_crm(){
  var mcli = mongodb.connect(pconf.mongodb);
  return mcli.db(pconf.dbname_crm);
}