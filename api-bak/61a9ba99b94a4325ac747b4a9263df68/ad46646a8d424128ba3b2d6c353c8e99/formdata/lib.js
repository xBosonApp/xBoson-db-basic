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
var conf = cfg.get("xboson-saas");

// 创建索引（表单类型）
db().collection("datas").createIndex({type:1});

module.exports = {
  db        : db,
  open      : open,
  genid     : genid,
  getSession: getSession
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
  var mcli = mongodb.connect(conf.mongodb);
  return mcli.db(conf.dbname_form);
}

// 获取微信登录 session
function getSession(req,cache){
  // var token = req.getHeader('token');
  var token = req.getString("tk")
  if(!token) return null;
  return cache.get(conf.cache_region, token);
}