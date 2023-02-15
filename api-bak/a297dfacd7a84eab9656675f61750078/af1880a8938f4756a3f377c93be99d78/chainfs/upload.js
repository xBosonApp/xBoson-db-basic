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

var volid    = sys.request.getString('v', 1, 99);
var path     = sys.request.getSafePath('p');
var lib      = require("./lib");
var Digest   = require('digest');
var plib     = require("path");
var selfuser = sys.getUserIdByPID();
var msg      = [];

var v = lib.openVolumeWrite(selfuser, volid);
var chain = lib.openChain(v);
var cmap = lib.openTable("chain-map");

if (sys.request.contentType() == 'application/octet-stream') {
  var bodystream = sys.request.openStream();
  var filename = decodeURIComponent(sys.request.getHeader('X-File-Name'));
  var filesize = parseInt(sys.request.getHeader('X-File-Size'));
  
  writeFile(filename, function(output) {
    bodystream.pipe(output);
  }, filesize);
  
} else {
  sys.request.multipart(function(item) {
    writeFile(item.header.filename, function(output) {
      item.readTo(output);
    });
  });
}


sys.put("data", msg);
sys.setRetData(0, 'ok');


function writeFile(filename, bind_func, filesize) {
  if (!filename) throw new Error("没有文件名");
  var full = plib.join(path, filename);
  var del = false;
  try {
    var attr = lib.getAttr(volid, full);
    if (attr) {
      throw new Error("文件已经存在");
    }
    
    var md5 = Digest.md5();
    var sha1 = Digest.sha1();
    var sha5 = Digest.sha512();
    
    var out = lib.openOutput(volid, full);
    var md5out = md5.bind(sha1.bind(sha5.bind(out)));
    del = true;
    bind_func(md5out);
    md5out.close();
    if (filesize && filesize != md5.updatedBytes()) {
      throw new Error("文件长度不匹配, 上传失败");
    }
    
    var info = {
      'md5'     : md5.digest().toHex(),
      'sha1'    : sha1.digest().toHex(),
      'sha512'  : sha5.digest().toHex(),
      'bytes'   : md5.updatedBytes(),
      'path'    : full,
      'who'     : selfuser,
      'volume'  : volid,
    };
    var key = chain.push(JSON.stringify(info));
    cmap.insert({
      _id      : lib.chain_map_id(volid, full),
      chainkey : key.toString(),
    });
      
    msg.push({ file: full, ok: 1 });
    
  } catch(err) {
    var str = err.message;
    var i = str.indexOf('at org.');
    if (i > 0) {
      str = str.substr(0, i);
    }
    
    msg.push({ file: full, ok: 0, msg: str });
    if (del) {
      try {
        lib.rm(volid, full);
      } catch(err) {}
    }
  }
}