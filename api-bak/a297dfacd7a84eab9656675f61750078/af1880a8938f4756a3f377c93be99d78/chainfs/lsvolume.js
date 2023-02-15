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

//
// 无参数, 列出当前用户可访问的卷, 并返回权限描述符
//
var lib = require("./lib");
var selfuser = sys.getUserIdByPID();
var ret = {};
var count = 0;

var vol = lib.openTable('volume');
add(vol.find({ owner : selfuser }), 1, 1);
add(vol.find({ writer : selfuser }), 1, 1);
add(vol.find({ reader : selfuser }), 0, 1);

if (count > 0) {
  sys.put('data', ret);
  sys.setRetData(0, 'ok');
} else {
  sys.setRetData(1, '没有可用的数据卷');
}


function add(arr, w, r) {
  for (var i=0; i<arr.length; ++i) {
    if (ret[arr[i]._id]) continue;
    ret[arr[i]._id] = {
      id    : arr[i]._id,
      name  : arr[i].name,
      r     : r,
      w     : w,
      ctime : arr[i].ctime,
      type  : 'vol',
      size  : 0,
      owner : arr[i].owner,
    };
  }
  count += arr.length;
}