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

var volid = sys.request.getString('v', 1, 99);
var path = sys.request.getSafePath('p');
var lib = require("./lib");
var selfuser = sys.getUserIdByPID();

var v = lib.openVolumeRead(selfuser, volid);
var canwrite = v.owner == selfuser || v.writer.indexOf(selfuser) >= 0;
var arr;

try {
  arr = lib.openDir(volid +'/'+ path);
} catch(err) {
  if (err.message.indexOf("not exist")) {
    sys.setRetData(1, '文件不存在: '+ path);
  } else {
    sys.setRetData(1, err.message);
  }
  return;
}

var ret = [];
var itr = arr.iterator();
while (itr.hasNext()) {
  var inf = itr.next();
  ret.push({
    name  : inf.name,
    type  : inf.isDir() ? 'folder' : 'file',
    size  : inf.size,
    ctime : inf.lastModify,
    owner : v.owner,
    r     : 1,
    w     : canwrite, 
  });
}

sys.put('data', ret);
sys.setRetData(0, 'ok');