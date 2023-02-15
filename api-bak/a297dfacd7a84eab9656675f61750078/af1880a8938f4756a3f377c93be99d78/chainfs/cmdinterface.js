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

var cmd = sys.request.cmd;
var lib = require("./lib");
var path = require("path");

//
// 组合命令表
//
var fn = {
  open: open,
}[cmd];

if (!fn) {
  sys.put("error", 'errUnknownCmd');
  sys.setRetData(1, 'unknow command');  
  return;
}

try {
  fn();
  sys.setRetData(0, 'ok');
} catch(err) {
  sys.put("error", [err.message]);
  sys.setRetData(1, err.stack);
  console.error(err);
  return;
}


function init() {
  sys.put('options', {});
  sys.put('api', 2.1);
  sys.put('cwd', {
    name  : 'Volumes',
    mime  : 'directory',
    hash  : '0',
    locked: 0,
    read  : 1,
    write : 1,
    phash : '',
    ts    : Date.now(),
    options : {},
  });
  var files = [];
  sys.put('files', files);
  
  var userid = sys.getUserIdByPID();
  var vol = lib.openTable('volume');
  var count = 0;
  var ownerlist = vol.find({
    owner : userid,
  });
  
  ownerlist.forEach(function(v) {
    files.push({
      name    : v.name,
      mime    : 'directory',
      hash    : lib.getHash(v._id, ''),
      locked  : 1,
      read    : 1,
      write   : 1,
      phash   : '0',
      ts      : v.ctime,
      volumeid: v._id,
      options : {},
    });
    ++count;
  });
  
  if (!count) {
    throw new Error("没有可用的数据卷, 请创建新的数据卷");
  }
}


function open() {
  if (sys.request.init || sys.request.target == '0') {
    init();
    return;
  }
  
  var targetHash = sys.request.target;
  var meta = lib.parseHash(targetHash);
  var vol = lib.getVolume(meta.vol);
  checkAuth(vol);
  
  var cwd = lib.getAttr(meta.vol +'/'+ meta.path);
  var files = [];
  sys.printValue(meta)
  
  if (cwd && cwd.isDir()) {
    var ds = cwd.containFiles();
    var phash = path.dirname(meta.path);
    if (phash) {
      phash = lib.getHash(meta.vol, phash);
    }
    
    for (var i=0; i<ds.length; ++i) {
      var full = meta.path +'/'+ ds[i];
      var m = { 
        path : full,
        vol  : meta.vol,
        hash : lib.getHash(meta.vol, full),
      };
      files[i] = toEL(lib.getAttr(full), m, phash);
    }
  }
  
  sys.put('cwd', toEL(cwd, meta));
  sys.put('files', files);
  sys.put('options', {});
}


function toEL(attr, meta, parent_hash) {
  if (!attr) return {};
  return {
    name    : attr.path,
    hash    : meta.hash,
    phash   : parent_hash,
    mime    : attr.isDir() ?'directory' :'file',
    ts      : attr.lastModify,
    size    : attr.size || 0,
    dirs    : attr.isDir() ? 1:0,
    read    : 1,
    write   : 1,
    locked  : 0,
    volumeid: meta.vol,
    options : {},
  };
}


function checkAuth(vol) {
  var userid = sys.getUserIdByPID();
  if (vol.owner == userid) return;
  if (vol.reader.find(userid)) return;
  if (vol.writer.find(userid)) return;
  throw new Error("无权访问目录");
}