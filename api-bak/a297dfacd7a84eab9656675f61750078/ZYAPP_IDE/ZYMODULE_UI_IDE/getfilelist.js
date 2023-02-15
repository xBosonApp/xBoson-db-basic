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
var org  = sys.request.getSafePath('org');
var path = sys.request.getSafePath('path');
var in_publish_mode = sys.request.double == 'double';
var is_t_branch     = sys.request.branch != 'ui';
var org_name;

var uilib = require("./lib");
path = uilib.normalize(path);

if (in_publish_mode) {
  var t  = get_formated_result('/t');
  var ui = get_formated_result('/ui');
  sys.addRetData(t, 't');
  sys.addRetData(ui, 'ui');
  sys.setRetData(0, "both list ok.", "t", "ui");
  return;
}


var ret = get_formated_result(is_t_branch ? '/t': '/ui', true);
sys.addRetData(ret, "result");
sys.setRetData(0, "list ok", "result");
return;

    
function get_formated_result(branch, add_web_if_need) {
  var basepath = uilib.formatPath(se, branch, org, path);
  var files = readDir(basepath);
  
  if (add_web_if_need && se.isPlatformOrg() && path == '/') {
    uilib.setSpecialDir(files);
  }
  
  // 前端会把文件夹放在前面
  files.sort(files_sorter);
  var ret;
  
  if (path == '/') {
    ret = create_root_data(files);
  } else {
    ret = files;
  }
  return ret;
}


function create_root_data(files) {
  var root = {
    name     : current_org_name(),
    path     : path,
    open     : true,
    isParent : true,
    children : files
  };
  return root;
}


function current_org_name() {
  if (org_name) 
    return org_name;
    
  org_name = uilib.currentUserOrg(sys, org).name;
  return org_name;
}


// 前端会把文件夹放在前面
function files_sorter(a, b) {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  else return 0;
}


function readDir(basepath) {
  var files = [];
  try {
    var uifs = require('fs').open();
    var dirs = uifs.readDir(basepath);
    var base = path == '/' ? '/' : path +'/';
    
    var itr = dirs.iterator();
    while (itr.hasNext()) {
      var info = itr.next();
      files.push({
        children : [],
        name     : info.path,
        path     : base + info.path,
        isParent : info.isDir(),
      });
    }
  } catch(err) {
    sys.put("error-message", err.message);
  }
  return files;
}