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

var cql = sys.request.cql;
var tpl = sys.request.tpl;

var lib = require("./lib");
if (!cql) {
  var id = sys.request.getString('_id');
  
  var coll = lib.db("analysis");
  var a = coll.find({_id: id})[0];
  if (!a) throw new Error("找不到分析项"+ id);
 
  cql = a.cql;
  tpl = a.tpl;
}

var cqls = lib.parseExp(cql);
var tpls = lib.parseExp(tpl);

var form = ['<form action="gen_cql">'];

if (cqls.struct.length > 1) {
  // 将模板中缺少的部分填充
  for (var name in cqls.names) {
    if (!tpls.names[name]) {
      form.push('参数', name, ' <input name="', name, '" placeholder="', name, '"/><br/>');
    }
  }
  
  // 输出模板
  for (var i=0; i<tpls.struct.length; ++i) {
    var st = tpls.struct[i];
    switch (st.type) {
      case 'plat':
        form.push("<span>", st.txt, "</span>");
        break;
        
      case 'form-txt':
        form.push('<input name="', st.txt, '" placeholder="', st.txt, '"/>');
        break;
        
      default:
        throw new Error("不支持的表达式类型 "+ st.type);
    }
  }
  form.push("<div class='split'></div>");
} else {
  form.push("<div class='split'>分析项没有参数, 可直接执行查询</div>");
  sys.put("empty_form", true);
}

form.push("<input type='hidden' name='_id' value='", id, "'/>");
form.push("<button class='button' type='submit'>执行</button>");
form.push('</form>');

sys.put("form", form);
sys.setRetData(0);