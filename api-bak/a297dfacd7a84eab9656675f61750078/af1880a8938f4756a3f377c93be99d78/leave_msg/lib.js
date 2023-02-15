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

var config  = require("config");
var CFG_NAME = 'leave-message';

if (config.get(CFG_NAME) == null) {
  config.create({
    'mode': cfg.MODE_GLOBAL,
    'name': CFG_NAME,
    'desc': "留言系统配置",
    'create_time': new Date(),
  });
}

config.putTemplate(CFG_NAME, {
  mdb : config.TYPE_STRING,
});

config.setDesc(CFG_NAME, {
  mdb : 'MongoDB 连接 URL',
});


module.exports = {
  openTable : openTable,
};


function openTable() {
  var mongodb = require('mongodb');
  var client  = mongodb.connect(config.get(CFG_NAME).mdb);
  return client.db("leave-message").collection("msg");
}