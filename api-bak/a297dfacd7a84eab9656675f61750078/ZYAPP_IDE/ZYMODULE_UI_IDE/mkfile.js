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

var uilib  = require("./lib");
var org    = sys.request.getSafePath('org');
var isfile = sys.request.isTrue('type');
var name   = sys.request.getSafePath('filenm');
var path   = sys.request.getSafePath('path');
var ext    = sys.request.getString('ext_name', 0);
  
if (isfile && ext) name = name + '.' + ext;

org = uilib.currentUserOrg(sys, org).id;
var basepath = uilib.getBasePath(se, org, path + '/' + name);


var uifs = require('fs').open();
var attr = uifs.readAttribute(basepath);
if (attr) {
  return sys.setRetData(1, "目录/文件已存在:" + path);
}

if (isfile) {
  var content = "";
  
  switch (ext) {
    case 'css': case 'js': case 'less': case 'sass': case 'scss':
      content = '/* Create By xBoson System */'; break;
    case 'html': case 'htm': 
      content = '<!-- Create By xBoson System -->'; break;
    case 'md':
      content = '# [TITLE]\n> Create By xBoson System\n'; break;
    case 'vue':
      content = '<!-- Create By xBoson System -->\n\n<template></template>'+
        '\n\n<script>\nexport default {\n}\n</script>\n\n<style scoped>\n</style>';
      break;
  }
  
  uifs.writeFile(basepath, content.getBytes("utf8"));
  se.sendUIFileReload(basepath, 'addfile');
} else {
  uifs.makeDir(basepath);
}

sys.setRetData(0, "创建了 " + name + (isfile ? ' 文件' : ' 目录'));