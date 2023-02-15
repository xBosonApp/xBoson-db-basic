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
var finds = sys.request.getString('content');
var cs    = sys.request.isTrue('casesensitive');
var onlyFileName = sys.request.casesensitive === null;

org = uilib.currentUserOrg(sys, org).id;
var ret = {
  name : "Find: " + finds,
  open : true,
  path : '',
  children: [],
};
sys.addRetData(ret, "result");


if (se.isPlatformOrg()) {
  if (onlyFileName) {
    findFileName('/t');
    findFileName('/web', true);
  } else {
    findContent('/t');
    findContent("/web", true);
  }
} else {
  if (onlyFileName) {
    findFileName('/t/saas' + org);
  } else {
    findContent('/t/saas' + org);
  }
}


function findFileName(basepath, use_prefix) {
  var uifs = require('fs').open();
  var finderResult = uifs.findPath(basepath + '*' + finds + '*');
  var files = finderResult.files;
  add_to_result(basepath, files, use_prefix);
}


function findContent(basepath, use_prefix) {
  var uifs = require('fs').open();
  var finderResult = uifs.findContent(basepath, finds, cs);
  var files = finderResult.files;
  add_to_result(basepath, files, use_prefix);
}


function add_to_result(basepath, files, use_prefix) {
  var itr = files.iterator();
  
  while (itr.hasNext()) {
    var file = itr.next();
    var p = use_prefix ? file : file.substr(basepath.length);
    var n = file.substr(file.lastIndexOf('/')+1);
    ret.children.push({
      name : n,
      path : p,
    });
  }
}

sys.setRetData(0, "ok", "result");