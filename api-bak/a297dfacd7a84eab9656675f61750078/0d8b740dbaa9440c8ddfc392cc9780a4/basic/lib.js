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

var graph   = require("graph");
var mongodb = require('mongodb');
var cfg     = require("config");
var uuid    = require("uuid");

var dbName = "graph-system";

module.exports = {
  db        : db,
  gid       : gid,
  open      : open,
  parseExp  : parseExp,
};


function parseExp(t) {
  var r = { names:{}, struct:[] };
  var st = 0;
  var p = 0;
  
  if (!t) return r;
  
  for (var i=0; i<t.length; ++i) {
    var c = t[i];
    
    switch (st) {
      case 0:
        if (c == '$') {
          st = -1;
        }
        break;
      
      case -1:
        if (c == '{') {
          r.struct.push({
            type : 'plat',
            txt  : t.substring(p, i-1),
          });
          p = i+1;
          st = 1;
        } else {
          st = 0;
        }
        break;
      
      case 1:
        if (c == '}') {
          var name = t.substring(p, i);
          r.struct.push({
            type : 'form-txt',
            txt  : name,
          });
          r.names[name] = true;
          p = i+1;
          st = 0;
        }
        else if (c == '{' || c == '$') {
          throw new Error(
            "表达式错误, 不应该有 '"+ c +"', 在 "+ i +' 字符');
        }
        break;
    }
  }
  
  if (st == 1) throw new Error(
    "表达式错误, 缺少 '}', 在 "+ i +' 字符');
    
  if (p < t.length) {
    r.struct.push({
      type : 'plat',
      txt  : t.substring(p, i),
    });
  }
  return r;
}


function gid() {
  return uuid.zip(uuid.v1obj());
}


function t(cql) {
  var sess = open();
  var data = [];
  var r2 = sess.query(cql);
  while (r2.hasNext()) {
    data.push(r2.next());
  } 
  sess.close();
  return data;
}


function open(uri, user, pass) {
  return graph.connect(uri, user, pass);
}


function db(collName) {
  var pconf = get_config();
  var mcli = mongodb.connect(pconf.mongodb);
  var db = mcli.db(dbName);
  if (!collName) {
    return db;
  }
  return db.collection(collName);
}



function get_config() {
  var conf_name = "graph-system";
  var conf = cfg.get(conf_name);
  
  // 当配置文件不存在, 创建默认的配置文件
  if (!conf) {
    // 创建配置文件
    cfg.create({
      'mode': cfg.MODE_ORG,
      'name': conf_name,
      'desc': "图-应用",
      'create_time': new Date(),
    });
    // 创建配置内容
    cfg.putTemplate(conf_name, {
      'mongodb' : cfg.TYPE_STRING,
    });
    // 配置项说明
    cfg.setDesc(conf_name, {
      'mongodb' : "MongoDB 连接 URL",
    });
    conf = {
      mongodb : 'mongodb://localhost', 
    };
  }
  return conf;
}