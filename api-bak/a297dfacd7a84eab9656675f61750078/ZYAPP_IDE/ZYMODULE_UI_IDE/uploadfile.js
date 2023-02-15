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

var lib  = require("./lib");
var plib = require("path");
var uifs = require('fs').open();

var web   = sys.request.onweb;
var org   = sys.request.getSafePath('org');
var base  = sys.request.getString('path', 1, 299);
var unzip = sys.toBool(sys.request.unzip);

var msg     = [];
var code    = 0;
var success = 0;

org = lib.currentUserOrg(sys, org).id;
base = lib.getBasePath(se, org, base);

sys.request.multipart(function(f) {
  if (f.header.name != 'file') 
    return;
  if (!f.header.filename)
    return;
    
  var ext = plib.extname(f.header.filename);
  if (lib.blockFileTypes[ext]) {
    code = 1;
    msg.push("禁止上传文件 "+ f.header.filename +", 类型: "+ ext);
  } else {
    saveFile(f.header.filename, f.readBuffer());
  }
  
  // if (lib.fileTypes[ext] || f.header.filename == 'LICENSE') {
  //   saveFile(f.header.filename, f.readBuffer());
  // } else {
  //   ++code;
  //   msg.push("禁止上传文件 "+ f.header.filename +", 类型: "+ ext);
  // }
});


if (success > 0) {
  msg.push("成功上传了"+ success +"个文件");
}
sys.setRetData(code, msg.join(web? ";</br>": "; "));


function saveFile(fname, content) {
  var fullpath = plib.join(base, fname);
  var attr = uifs.readAttribute(fullpath);
  
  if (attr) {
    if (!attr.isFile()) {
      msg.push(fname +" 不是文件, 无法覆盖");
      return;
    }
    // 覆盖
    uifs.writeFile(fullpath, content);
    msg.push("文件 "+ fname +" 被覆盖");
  } else {
    msg.push("新建文件 "+ fname);
    uifs.writeFile(fullpath, content);
  }
  
  if (unzip && fname.endsWith('.zip')) {
    try {
      var stub = require('shell');
      var sh = stub.open();
      // 覆盖原有文件, 无输出, 需要操作系统支持 unzip 命令
      // 当使用集群系统时, 压缩包没有立即同步到本地, 会导致解压缩失败
      var process = sh.execute("sys/uz", [base, fname]);
      if (process.code == 0) {
        msg.push("压缩包 "+ fname +" 已经解压");
      } else {
        msg.push("压缩包 "+ fname +" 解压失败, 错误码:"+ process.code +'('+ process.output +')');
      }
    } catch(e) {
      msg.push("解压缩异常", e);
    }
  }
  ++success;
}