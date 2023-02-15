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

var name    = sys.request.getString('name', 1, 99);
var url     = sys.request.getString('url', 1, 255);
var mdb     = sys.request.getString('db', 1, 255);
var basedir = sys.request.getString('basedir', 1, 255);
var org     = sys.request.getString('orgid', 1, 99);
var roles   = sys.requestParameterMap['roles[]'];
var nonemtp = sys.request.isTrue('nonemtp'); // 允许非空目录

var uuid = require("uuid");
var lib = require('./lib');
var db = lib.opendb();
var mcoll = uuid.zip();

basedir = lib.normalize(basedir);
if (basedir == '/') {
  return sys.setRetData(1, '不能在根目录中创建项目');
}

lib.currentUserOrg(sys, org);
basedir = lib.getBasePath(se, org, basedir);
var uifs = require('fs').open();
var attr = uifs.readAttribute('/t/'+ basedir);
if (!attr) {
  return sys.setRetData(1, "目录不存在" + basedir);
} else if (!attr.isDir()) {
  return sys.setRetData(1, "不是目录" + basedir);
} else if (attr.containFiles().size()) {
  if (!nonemtp) {
    return sys.setRetData(1, "不是空目录");
  }
}

var mongodb = require('mongodb');
var c = mongodb.connect(url).db(mdb).collection(mcoll).count();

if (c) {
  sys.setRetData(1, '不能在非空数据库中创建项目, 请重试');
  return;
}

if (db.collection('_prj').count({name:name}) > 0) {
  sys.setRetData(1, '项目名称冲突, 请修改');
  return;
}

db.collection('_prj').insert({
  _id     : uuid.zip(),
  name    : name,
  url     : url,
  db      : mdb,
  coll    : mcoll,
  owner   : sys.getUserIdByPID(),
  roles   : roles || [],
  basedir : basedir,
  orgid   : org,
});

sys.setRetData(0, '项目已经创建');