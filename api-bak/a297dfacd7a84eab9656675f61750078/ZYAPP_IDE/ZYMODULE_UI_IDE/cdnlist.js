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

var base = '/web/cdn';
var uifs = require('fs').open();

var ret = readDir(base, true);
for (var i=0; i<ret.length; ++i) {
  var item = ret[i];
  item.files = readDir(item.path, false);
  item.readme = findReadme(item);
  
  for (var j=0; j<item.files.length; ++j) {
    var ver = item.files[j];
    if (ver.isdir) {
      ver.files = toFileList( readDir(ver.path, false) );
    }
  }
}

sys.put('data', ret);
sys.setRetData(0, 'ok');


function readDir(_path, _only_dir) {
  var dirs = uifs.readDir(_path);
  var ret = [];
  
  var itr = dirs.iterator();
  while (itr.hasNext()) {
    var file = itr.next();
    
    if (_only_dir == false || file.isDir()) {
      ret.push({
        name  : file.path,
        path  : _path +'/'+ file.path,
        isdir : file.isDir(),
      });
    }
  }
  return ret;
}

function findReadme(item) {
  for (var i=0; i<item.files.length; ++i) {
    if ('readme.md' == item.files[i].name.toLowerCase()) {
      return item.files[i].path;
    }
  }
  return false;
}

function toFileList(obj) {
  var list = [];
  for (var i=0; i<obj.length; ++i) {
    list.push(obj[i].path);
  }
  return list;
}