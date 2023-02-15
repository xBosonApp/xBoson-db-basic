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
sys.authorization('api.opc.manager.functions()');

var cid  = sys.request.getString("_id", 1);
var name = sys.requestParameterMap.name;
var type = sys.requestParameterMap.type;
var primary = sys.requestParameterMap.primary;

if (name.length <= 0 || (name.length != type.length) || (name.length != primary.length)) {
  sys.put("name", name.length);
  sys.put("type", type.length);
  sys.put("primary", primary.length);
  sys.ret(1);
  return;
}

var mapping = {};
for (var i=0; i<name.length; ++i) {
  var n = name[i];
  if (!n) {
    throw new Error("name 参数有空值, 第"+ (i+1) +"项");
  }
  if (!primary[i]) {
    throw new Error("primary 参数有空值, "+ name);
  }
  var t = parseInt(type[i]);
  if (isNaN(t)) {
    throw new Error("type 参数有空值, "+ name);
  }
  mapping[n] = {
    primary : primary[i],
    type    : t,
  };
}

var lib = require('../server/lib');
lib.opendb().collection('item').updateOne(
  {_id : cid},
  {$set:{
    mapping : mapping,
  }}
);
lib.updateVersion(cid);
sys.ret(0);