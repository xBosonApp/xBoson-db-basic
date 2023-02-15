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

var Digest      = require('digest');
var file_system = require('fs');
var config      = require("config");
var mongodb     = require("mongodb");
var bc          = require('chain');
var plib        = require("path");
var configFile  = 'chain-fs';


function init() {
  if (config.get(configFile) == null) {
    config.create({
      'mode': config.MODE_ORG,
      'name': configFile,
      'desc': "区块链网盘配置",
      'create_time': new Date(),
    });
  }
  
  
  config.putTemplate(configFile, {
    'mongo_uri'   : config.TYPE_STRING,
    'mdb'         : config.TYPE_STRING,
    'hdfs_uri'    : config.TYPE_STRING,
    'file_base'   : config.TYPE_STRING,
  });
  
  
  config.setDesc(configFile, {
    'mongo_uri'   : 'mongodb 连接,文件元数据存储库',
    'mdb'         : '数据库名称',
    'hdfs_uri'    : 'HDFS 连接, 文件系统',
    'file_base'   : '文件系统根目录',
  });
}


function getConfig() {
  var cfg = config.get(configFile);
  if (!cfg) {
    throw "配置文件不存在";
  }
  return cfg;
}


function openFS() {
  return file_system.openURI(getConfig().hdfs_uri);
}


function openDir(path) {
  var cfg = getConfig();
  var fs = openFS();
  return fs.readDir(cfg.file_base+'/'+path);
}


function createDir(vol_id, path) {
  var fullpath = getConfig().file_base +'/'+ vol_id +'/'+ path;
  openFS().makeDir(fullpath);
}


function getHash(vol_id, path) {
  return vol_id +'_'+ Buffer.from(path).toString('base64');
}


function parseHash(hash) {
  var i = hash.indexOf('_');
  if (i < 0) throw new Error("bad hash");
  var p = Buffer.from(hash.substring(i+1), 'base64').toString('utf8');
  if (p.indexOf("..") >= 0) throw new Error("bad path");
  return {
    vol  : hash.substring(0, i),
    path : p,
    hash : hash,
  }
}


function getVolume(vol_id) {
  var vol = openTable('volume').find({ _id: vol_id });
  if (!vol[0]) throw new Error("Cannot find volume "+ vol_id);
  return vol[0];
}


function getAttr(vol_id, path) {
  return openFS().readAttribute(getConfig().file_base +'/'+ vol_id +'/'+ path);
}


function move(vol_id, s, t) {
  var base = getConfig().file_base +'/'+ vol_id +'/'; 
  return openFS().move(base + s, base + t);
}


function rm(vol_id, path) {
  return openFS().delete(getConfig().file_base +'/'+ vol_id +'/'+ path);
}


function openTable(tableName) {
  var cfg = getConfig();
  var client  = mongodb.connect(cfg.mongo_uri);
  return client.db(cfg.mdb).collection(tableName);
}


function openChain(volobj) {
  return bc.open('id://'+ volobj.bc);
}


function openVolumeRead(user_id, vol_id) {
  var volt = openTable('volume');
  var v = volt.find({ _id : vol_id, $or: 
    [{owner:user_id}, {reader:user_id}, {writer:user_id}] })[0];
  if (!v) {
    throw new Error('没有权限');
  }
  return v;
}


function openVolumeWrite(user_id, vol_id) {
  var volt = openTable('volume');
  var v = volt.find({ _id : vol_id, $or: 
    [{owner:user_id}, {writer:user_id}] })[0];
  if (!v) {
    throw new Error('没有权限');
  }
  return v;
}


function openInput(vol_id, path) {
  return openFS().openInputStream(getConfig().file_base +'/'+ vol_id +'/'+ path);
}


function openOutput(vol_id, path) {
  return openFS().openOutputStream(getConfig().file_base +'/'+ vol_id +'/'+ path);
}


// cmap = lib.openTable("chain-map");
// chain = lib.openChain(volumeObject);
function getBlock(chain, cmap, vol_id, path) {
  var cmapid = chain_map_id(vol_id, path);
  var tmp = cmap.find({_id: cmapid});
  if (!tmp || !tmp[0] || !tmp[0].chainkey) {
    throw new Error("获取验证区块失败 卷:"+ vol_id +', 路径:'+ path);
  }
  var chainkey = tmp[0].chainkey;
  var block = chain.search(chainkey);
  block.data = JSON.parse(block.data);
  return block;
}


function chain_map_id(vol_id, path) {
  return Buffer.from(plib.join(vol_id, path)).toString('base64');
}


module.exports = {
  openFS          : openFS,
  init            : init,
  openTable       : openTable,
  openDir         : openDir,
  getAttr         : getAttr,
  openChain       : openChain,
  createDir       : createDir,
  getHash         : getHash,
  getVolume       : getVolume,
  parseHash       : parseHash,
  openVolumeRead  : openVolumeRead,
  openVolumeWrite : openVolumeWrite,
  move            : move,
  rm              : rm,
  openInput       : openInput,
  openOutput      : openOutput,
  getBlock        : getBlock,
  chain_map_id    : chain_map_id,
};