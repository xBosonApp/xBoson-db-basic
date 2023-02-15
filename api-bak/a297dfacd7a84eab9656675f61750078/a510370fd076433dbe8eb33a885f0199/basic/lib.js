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

var crypto      = require('crypto');
var config      = require("config");
var algorithm   = 'AES';
var ps          = 'fjdksql^aeir32ncxp';
var CONFIG_NAME = "flow-diagram";
var DB_NAME     = "flow-diagram";

if (config.get(CONFIG_NAME) == null) {
  config.create({
    'mode': cfg.MODE_ORG,
    'name': CONFIG_NAME,
    'desc': "流程图应用配置",
    'create_time': new Date(),
  });
}

config.putTemplate(CONFIG_NAME, {
  source: config.TYPE_STRING,
  db    : config.TYPE_STRING,
});

config.setDesc(CONFIG_NAME, {
  source: 'MongoDB 数据连接 URL',
  db    : '数据库名称 (可以空, 默认 '+ DB_NAME +')',
});


module.exports = {
  opendoc   : opendoc,
  encrypt   : encrypt,
  decode    : decode,
  checkAuth : checkAuth,
};


function checkAuth(sys, _id) {
  if (_id.indexOf(sys.getUserIdByPID()+'/') != 0) {
    sys.setRetData(1, '无权操作该文件');  
    return false;
  }
  return true;
}


function opendb() {
  var mongodb = require('mongodb');
  var cfg = config.get(CONFIG_NAME);
  var client = mongodb.connect(cfg.source);
  return client.db(cfg.db || DB_NAME);
}


function opendoc() {
  return opendb().collection("doc");
}


function encrypt(xml) {
  // console.log(xml)
  var cc = crypto.createCipher(algorithm, ps);
  var cdata = cc.update(xml).concat(cc.end());
  return cdata.toString();
}


function decode(b64) {
  try {
    var buf = crypto.toBytes(b64, 'base64url');
    var cd = crypto.createDecipher(algorithm, ps);
    var data = cd.update(buf).concat(cd.end());
    return data.toJavaString();
  } catch(e) {
    // throw e;
  }
  return b64;
}