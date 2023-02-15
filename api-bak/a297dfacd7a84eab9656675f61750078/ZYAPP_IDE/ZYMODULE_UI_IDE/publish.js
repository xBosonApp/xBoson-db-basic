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

var uilib = require("./lib");
var org   = sys.request.getSafePath('org');
var up    = sys.requestParameterMap['up[]'];
var down  = sys.requestParameterMap['down[]'];
var min   = sys.toBool(sys.request.min);

var count = 0;
var uifs = require('fs').open();
org = uilib.currentUserOrg(sys, org).id;

// try {
  each_arr(up, do_up);
  each_arr(down, do_down);
  sys.setRetData(0, count + " 个文件已操作");
// } catch(e) {
//   sys.printValue(e.stack);
//   sys.setRetData(1, e.message);
// }


function each_arr(arr, _fn) {
  if (!arr) return;
  for (var i=0; i<arr.length; ++i) {
    _fn(arr[i]);
  }
}


function do_up(file) {
  var src = uilib.formatPath(se, '/t', org, file);
  var dst = uilib.formatPath(se, '/ui', org, file);
  copy(src, dst);
}


function copy(src, to) {
  var sfs = uifs.readAttribute(src);
  var tfs = uifs.readAttribute(to);
  
  if (sfs == null) {
    throw new Error("找不到文件 " + src);
  }
  
  if (sfs.isFile()) {
    if (tfs != null && tfs.isFile() == false)
      throw new Error("不能将文件发布到目录 " + to);
      
    uifs.readFileContent(sfs);
    var code;
    if (min) {
      code = minify(src, sfs);
    } else {
      code = sfs.getFileContent();
    }
    uifs.writeFile(to, code);
  } 
  else if (sfs.isDir()) {
    if (tfs != null && tfs.isDir() == false)
      throw new Error("不能将目录发布到文件 " + to);
      
    uifs.makeDir(to);
    
    var itr = sfs.containFiles().iterator();
    while (itr.hasNext()) {
      var subname = itr.next();
      copy(src + "/" + subname, to + '/' + subname);
    }
  }
  ++count;
  se.sendUIFileReload(to, 'change');
}


function minify(file, fd) {
  var path = require('path');
  
  switch (path.extname(file)) {
    case '.js':
    case '.javascript':
      var mc = uilib.jsmin(fd.getContentToString());
      if (mc.error) throw mc.error;
      return mc.code;
    
    case '.css':
      var cs = uilib.cssmin(fd.getContentToString());
      if (cs.errors && cs.errors.length) 
          throw new Error(cs.errors.join(','));
      return cs.styles;
      
    default:
      return fd.getFileContent();
  }
}


function do_down(file) {
  var dst = uilib.formatPath(se, '/ui', org, file);
  _delete(dst);
}


function _delete(file) {
  var fs = uifs.readAttribute(file);
  if (fs == null) {
    throw new Error("找不到文件 " + file);
  }
  if (fs.isFile()) {
    uifs.delete(fs.path);
  } else {
    var itr = fs.containFiles().iterator();
    while (itr.hasNext()) {
      var subname = itr.next();
      _delete(file + "/" + subname);
    }
    uifs.delete(fs.path);
  }
  ++count;
}