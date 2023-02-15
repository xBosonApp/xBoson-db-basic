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
var dict = 'qwertyuioplkjhgfdsazxcvbnm0987654321QWERTYUIOPLKJHGFDSAZXCVBNM';
var id_test = /^[a-zA-Z0-9]+$/;

var def_script = `// Created by xBoson system

function on_data(payload, dev) {
}

function on_cmd(cmd, dev) {
  return new Uint8Array(0);
}
`;

get_config();
db().collection("user").createIndex({owner:1});

db().collection("scenes").createIndex({owner:1});
db().collection("scenes").createIndex({share:1});
db().collection("scenes").createIndex({name:1});

db().collection("product").createIndex({scenes:1});
db().collection("product").createIndex({pid:1});

db().collection("script").createIndex({owner:1});
db().collection("script").createIndex({share:1});

db().collection("device").createIndex({product:1});
db().collection("device").createIndex({scenes:1});
db().collection("device").createIndex({devid:1});

db().collection("event_his").createIndex({devid:1});
db().collection("event_his").createIndex({scenes:1});
db().collection("event_his").createIndex({product:1});

db().collection("cmd_his").createIndex({devid:1});
db().collection("cmd_his").createIndex({scenes:1});
db().collection("cmd_his").createIndex({product:1});

db().collection("dev-data").createIndex({dev:1});


module.exports = {
  db        : db,
  open      : open,
  genid     : genid,
  productId : productId,
  mqid      : mqid,
  checkScene: checkScene,
  getShare  : getShare,
  defScript : defScript,
  mqttcf    : mqttcf,
  parseid   : parseid,
  deviceid  : deviceid,
  newid     : newid,
  testId    : testId,
};


function testId(i) {
  if (!id_test.test(i)) throw new Error("ID 格式只能是字母和数字");
}


function newid(s) {
  return mongodb.newObjectId(s);
}


function parseid(id) {
  var p = id.split('.');
  return {
    sid : p[1],
    pid : p[2],
    did : p[3],
  }
}


function mqttcf() {
  return get_config().exmqtt;
}


function defScript() {
  return def_script;
}


function getShare(str) {
  var sr = [];
  if (str) {
    var names = str.split(",");
    for (var i=0; i<names.length; ++i) {
      sr.push(names[i].trim());
    }
  }
  return sr;
}


function checkScene(userid, scenesid) {
  var sc = open('scenes').count({ 
    $or : [
      { owner : userid },
      { share : userid },
    ], 
    _id: scenesid,
  });
  if (!sc) {
    throw new Error("无权操作该场景 "+ scenesid);
  }
}


function productId(sid, pid) {
  return ['', sid, pid].join(".");
}


function deviceid(sid, pid, did) {
  return ['', sid, pid, did].join(".");
}


function mqid(sid, pid, did, type) {
  var a = ['', sid, pid];
  if (did) a.push(did);
  if (type) a.push(type);
  return a.join("/");
}


function genid() {
  var b = uuid.getBytes(uuid.v1obj());
  return b.toString('base58');
}


function open(tableName) {
  return db().collection(tableName);
}


function db() {
  var pconf = get_config();
  var mcli = mongodb.connect(pconf.mongodb);
  return mcli.db(pconf.dbname);
}


function get_config() {
  var conf_name = "iot-manager";
  var conf = cfg.get(conf_name);
  
  // 当配置文件不存在, 创建默认的配置文件
  if (!conf) {
    // 创建配置文件
    cfg.create({
      // 必须是全局配置模式
      'mode': cfg.MODE_GLOBAL,
      'name': conf_name,
      'desc': "IOT 基础设施",
      'create_time': new Date(),
    });
    // 创建配置内容
    cfg.putTemplate(conf_name, {
      'mongodb' : cfg.TYPE_STRING,
      'dbname'  : cfg.TYPE_STRING,
      'mqhost'  : cfg.TYPE_STRING,
      'mqport'  : cfg.TYPE_NUMBER,
      'exmqtt'  : cfg.TYPE_STRING,
    });
    // 配置项说明
    cfg.setDesc(conf_name, {
      'mongodb' : "MongoDB 连接 URL",
      'dbname'  : '数据库名',
      'mqhost'  : 'MQTT 服务器地址',
      'mqport'  : 'MQTT 服务器端口',
      'exmqtt'  : 'MQTT 外部连接地址'
    });
    conf = {
      mongodb : 'mongodb://localhost',
      dbname  : 'xboson-artemis-iot',
      mqhost  : 'localhost',
      mqport  : 1883,
      exmqtt  : 'localhost:1883'
    };
  }
  return conf;
}