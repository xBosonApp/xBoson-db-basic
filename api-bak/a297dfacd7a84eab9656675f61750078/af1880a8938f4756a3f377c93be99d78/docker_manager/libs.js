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

var docker   = require('docker');
var config   = require('config');
var CFG_NAME = "docker-manager";

if (config.get(CFG_NAME) == null) {
  config.create({
    'mode': cfg.MODE_ORG,
    'name': CFG_NAME,
    'desc': "docker数据存储配置",
    'create_time': new Date(),
  });
}

config.putTemplate(CFG_NAME, {
  'source': config.TYPE_STRING,
  'db'    : config.TYPE_STRING,
});

config.setDesc(CFG_NAME, {
  'source': '数据源 URL',
  'db'    : '数据库名称',
});


module.exports = {
  docker    : docker,
  saveHost  : saveHost,
};


function saveHost(url, auth, tls) {
}