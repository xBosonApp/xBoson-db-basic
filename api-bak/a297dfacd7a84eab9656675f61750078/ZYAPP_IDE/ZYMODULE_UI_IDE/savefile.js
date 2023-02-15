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

// sys.authorization('api.ide.code.modify.functions()');

var uilib = require("./lib");
var org   = sys.request.getSafePath('org');
var path  = sys.request.getSafePath('path');
var code  = sys.request.getString('content', 1, 20e6); // 20 MB
var basepath;

org = uilib.currentUserOrg(sys, org).id;
basepath = uilib.getBasePath(se, org, path);


var uifs = require('fs').open();
var attr = uifs.readAttribute(basepath);
if (!attr) {
  return sys.setRetData(1, "找不到文件:" + path);
}
if (!attr.isFile()) {
  return sys.setRetData(1, "不是文件:" + path);
}

//
// 读取源文件, 将源文件与修改后的文件做补丁
//
uifs.readFileContent(attr);
var original = attr.getContentToString();
var patch = createPatch(original, code);

if (patch == '') {
  sys.setRetData(0, "文件没有改变");
  return;
} 

//
// 将补丁代码写入历史记录, 补丁中含有对文件操作的语义.
//
var insertHis = `
  INSERT INTO sys_pl_log_uimodify
    (dt, patch, path, user_id) Values (?, ?, ?, ?)`;
try {
  sql.update(insertHis, [ date.currentDate(), patch, attr.path, sys.getUserIdByOpenId() ]);
} catch(err) {
  console.error(err);
  sys.put("patchError", err.message);
}


uifs.writeFile(basepath, code.getBytes("utf8"));
se.sendUIFileReload(basepath, 'change');
sys.setRetData(0, "文件保存成功");


function createPatch(oldText, newText) {
  var lastData = parseInt(attr.lastModify);
  var difflib = require('difflib');
  var opt = {
    fromfile      : 'Old File',
    tofile        : 'Modify',
    fromfiledate  : format(new Date(lastData)),
    tofiledate    : format(new Date()),
    lineterm      : '',
  };
  
  return difflib.unifiedDiff(
      oldText.split('\n'), 
      newText.split('\n'), opt).join('\n');
      
  /* diff-match-patch 生成的列模式 patch 不易阅读已经废弃
  var Diff_match  = require('diff-match-patch');
  var dmp         = new Diff_match();
  var diff        = dmp.diff_main(oldText, newText);
  var patchList   = dmp.patch_make(oldText, newText, diff);
  var patch       = dmp.patch_toText(patchList);
  return decodeURI(patch);
  */
}


function format(d) {
  return d.getFullYear() +'-'+ (d.getMonth()+1) +'-'+ d.getDate()
      +' '+ d.getHours() +':'+ d.getMinutes() +':'+ d.getSeconds();
}