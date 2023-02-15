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

var id = sys.request.getString('_id');
var lib = require("./lib");

var coll = lib.db("analysis");
var a = coll.find({_id: id})[0];
if (!a) throw new Error("找不到分析项"+ id);

var cqls = lib.parseExp(a.cql);
var out = [];

for (var i=0; i<cqls.struct.length; ++i) {
  var st = cqls.struct[i];
  switch (st.type) {
    case 'plat':
      out.push(st.txt);
      break;
      
    case 'form-txt':
      var arg = sys.request.getMember(st.txt);
      if (!arg) {
        throw new Error("必须填写参数: "+ st.txt);
      }
      out.push(arg);
      break;
      
    default:
      throw new Error("不支持的表达式类型 "+ st.type);
  }
}

sys.put("data", out);
sys.setRetData(0);