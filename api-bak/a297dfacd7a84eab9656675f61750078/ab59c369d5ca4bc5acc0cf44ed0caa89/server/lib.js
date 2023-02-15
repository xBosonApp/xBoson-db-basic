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

var crypto  = require('crypto');
var mongodb = require('mongodb');
var uuid    = require('uuid');

var root_key = "JgxypAyG/T6asrIawR8k";
var _api = "/xboson/openapp/a297dfacd7a84eab9656675f61750078/ab59c369d5ca4bc5acc0cf44ed0caa89/server/api";

var ch_dict = 'qwertyuiop[]asdfghjkl;zxcvbnm,./1234567890-=`~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:ZXCVBNM<>?';

var upsert = {upsert: true};

var default_db_conf = {
  host : 'localhost:3306', 
  user : 'root', 
  pass : '', 
  sql  : 'select select now()',
  schema : '', 
};

// init config
get_config();


// 加密解密格式: base64url(16字节iv + AES 加密数据)
module.exports = {
  decode : decode,
  encode : encode,
  generateKey   : generateKey,
  updateKey     : updateKey,
  findClient    : findClient,
  createClient  : createClient,
  deleteClient  : deleteClient,
  listClient    : listClient,
  getConn       : getConn,
  setConn       : setConn,
  onSendData    : onSendData,
  getItemSetting: getItemSetting,
  getItemData   : getItemData,
  updateState   : updateState,
  opendb        : db,
  updateVersion : updateVersion,
};



function db() {
  var pconf = get_config();
  var mcli = mongodb.connect(pconf.mongodb);
  return mcli.db(pconf.dbname);
}


function listClient(query) {
  return db().collection('key').find(query);
}


function updateState(cid) {
  db().collection('key').updateOne({_id: cid}, {$set: {last: Date.now()}}, upsert);
}


//
// 表 key : { _id: 客户端id, key: rootkey 加密的数据 }
//
function findClient(cid) {
  var r = onlyOne( db().collection('key').find({ _id: cid }) );
  return JSON.parse( decode(root_key, r.key).toJavaString() );
}


function createClient(desc) {
  if (!desc) {
    desc = '服务器'+ db().collection('key').count();
  }
  var clientid = uuid.zip();
  var key = updateKey(clientid, desc);
  setConn(clientid, default_db_conf);
  return { clientid: clientid, key: key };
}


function deleteClient(cid) {
  var find = {_id:cid};
  db().collection('key').deleteOne(find);
  db().collection('db-connect').deleteOne(find);
  db().collection('item').deleteOne(find);
}


function updateKey(clientid, desc) {
  var secret = gen_secret();
  var key = generateKey(clientid, secret);
  var sets = {key: key};
  if (desc) sets.desc = desc;
  db().collection('key').updateOne({_id: clientid}, {$set: sets}, upsert);
  return key;
}


//
// 表 db-connect : { _id:客户端id, host, user, pass, schema, sql, version }
//
function getConn(cid) {
  return onlyOne(db().collection('db-connect').find({ _id: cid }));
}


function setConn(cid, conf) {
  delete conf.version;
  db().collection('db-connect').updateOne(
    {_id: cid}, {
      $set: conf,
      $inc: { version: 1 },
    }, upsert);
}


function updateVersion(cid) {
  db().collection('db-connect').updateOne(
    {_id: cid}, {
      $inc: { version: 1 },
    }, upsert);
}


//
// 表 item : { _id: 客户端id, 
//    meta : [metaData] 列的元数据描述, 
//    data : [rowData] 行数据, 
//    primary_column : 主键列名, 
//    val_column : 数据列名, 
//    mapping : {
//      name : opc item 名称 { 
//        primary :对应db中的主键值, 
//        type : opc类型枚举
//      }
//    } opc-db 数据映射
// }
// metaData : {name:列名, typename:类型名, type:类型整形枚举} 
// rowData : {name:val, name:val} 当前行所有列的名字和当前值
//
// d : {meta, data}
//
function onSendData(cid, d) {
  var up = { meta : d.meta, data: d.data };
  db().collection('item').updateOne({_id : cid}, {$set : up}, upsert);
}


// 读取 item 的全部配置
function getItemSetting(cid) {
  return onlyOne(db().collection('item').find({_id:cid}));
}


// 返回 'getitem' 接口数据
function getItemData(cid) {
  var sett = getItemSetting(cid);
  var data = [];
  var dbdata = {};
  for (var r=0; r < sett.data.length; ++r) {
    dbdata[ sett.data[r][sett.primary_column] ] = sett.data[r][sett.val_column];
  }
  for (var opcname in sett.mapping) {
    var m = sett.mapping[opcname];
    data.push({
      name : opcname, 
      val  : dbdata[m.primary], 
      type : m.type,
    });
  }
  return data;
}


function gen_secret() {
  var buf = [];
  for (var i=0; i<32; ++i) {
    buf[i] = ch_dict[parseInt(Math.random() * ch_dict.length)];
  }
  return buf.join('');
}


function onlyOne(arr) {
  if (arr.length <= 0) {
    throw new Error("Cannot found any one");
  }
  if (arr.length != 1) {
    throw new Error("Result data not only one");
  }
  return arr[0];
}


// 生成服务器配置文件中的 key, root_key 必须和服务端匹配
function generateKey(client_id, secret) {
  var key = JSON.stringify({
    host      : get_config().host,
    api       : _api,
    client_id : client_id,
    secret    : secret,
  });
  return encode(root_key, key);
}


function decode(pass, data) {
  var ddata = crypto.toBytes(data, 'base64url');
  if (ddata.length() % 16 > 0) {
    throw new Error("AES数据错误, 数据长度不是 16 的倍数, "+ ddata.length());
  }
  var iv = ddata.sub(0, 16);
  var ps = crypto.generateAesPass(pass);
  var cd = crypto.createDecipher("AES/CBC/PKCS5Padding", ps, iv);
  var buf = [];
  buf.push(cd.update(ddata.sub(16)));
  buf.push(cd.end());
  return crypto.joinBytes(buf);
}


function encode(pass, data) {
  var iv = crypto.generateAesIV();
  var ps = crypto.generateAesPass(pass);
  var cc = crypto.createCipher("AES/CBC/PKCS5Padding", ps, iv);
  var buf = [iv];
  buf.push(cc.update(data));
  buf.push(cc.end());
  var cdata = crypto.joinBytes(buf);
  return cdata.toString("base64url");
}


function get_config() {
  var cfg = require("config");
  var conf_name = "opc-server-manager";
  var conf = cfg.get(conf_name);
  
  // 当配置文件不存在, 创建默认的配置文件
  if (!conf) {
    // 创建配置文件
    cfg.create({
      'mode': cfg.MODE_GLOBAL,
      'name': conf_name,
      'desc': "OPC 服务器管理",
      'create_time': new Date(),
    });
    // 创建配置内容
    cfg.putTemplate(conf_name, {
      'host'    : cfg.TYPE_STRING,
      'mongodb' : cfg.TYPE_STRING,
      'dbname'  : cfg.TYPE_STRING,
    });
    // 配置项说明
    cfg.setDesc(conf_name, {
      'host'    : "PAAS 主机:端口号, opc 使用该主机名连接 paas.",
      'mongodb' : "MongoDB 连接 URL",
      'dbname'  : 'MongoDB 数据库名',
    });
    conf = {
      host    : 'localhost:8080',
      mongodb : 'mongodb://localhost',
      dbname  : 'opc-server-manager',
    };
  }
  return conf;
}