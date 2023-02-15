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

var scenesid = sys.request.getString("scenes", 1);
var id = sys.request.getString("_id", 1);
var prod_name = sys.request.getString("name", 1);

var lib = require("./lib");

lib.checkScene(sys.getUserIdByOpenId(), scenesid);

var meta = [];
if (sys.requestParameterMap.m_name) {
  for (var i=0; i<sys.requestParameterMap.m_name.length; ++i) {
    var name = sys.requestParameterMap.m_name[i];
    if (!name) throw new Error("属性名不能空");
    
    var type    = sys.requestParameterMap.m_type[i];
    var defval  = sys.requestParameterMap.m_defval[i];
    var notnull = parseInt(sys.requestParameterMap.m_notnull[i]);
    var dict    = sys.requestParameterMap.m_dict[i];
    
    if (notnull) {
      if (!defval) throw new Error("非空时必须填写默认值");
    }
    
    switch (parseInt(type)) {
      case 101: // 数字
        if (isNaN(defval)) 
          throw new Error("无效的数字 "+ defval);
        break;
      
      case 102: // 字典
        if (!dict) 
          throw new Error("必须选择一个字典");
        break;
        
      case 103: // 日期
        if (isNaN(new Date(defval).getTime()))
          throw new Error("无效的日期默认值 "+ defval);
        break;
    }
    
    meta.push({
      name    : name,
      desc    : sys.requestParameterMap.m_desc[i],
      type    : type,
      notnull : notnull,
      defval  : defval,
      dict    : dict,
    });
  }
}

var data = [];
if (sys.requestParameterMap.d_name) {
  for (var i=0; i<sys.requestParameterMap.d_name.length; ++i) {
    var name = sys.requestParameterMap.d_name[i];
    if (!name) throw new Error("数据名不能空");
    
    data.push({
      name : name,
      desc : sys.requestParameterMap.d_desc[i],
      type : sys.requestParameterMap.d_type[i],
      unit : sys.requestParameterMap.d_unit[i],
    });
  }
}

var cmd  = [];
if (sys.requestParameterMap.c_name) {
  for (var i=0; i<sys.requestParameterMap.c_name.length; ++i) {
    var name = sys.requestParameterMap.c_name[i];
    if (!name) throw new Error("命令名不能空");
    
    cmd.push({
      name : name,
      desc : sys.requestParameterMap.c_desc[i],
      type : sys.requestParameterMap.c_type[i],
    });
  }
}

var event = {};
if (sys.requestParameterMap.e_key) {
  for (var i=0; i<sys.requestParameterMap.e_key.length; ++i) {
    var key = sys.requestParameterMap.e_key[i];
    var val = sys.requestParameterMap.e_val[i];
    if (!key) throw new Error("事件主键不能为空");
    if (!val)  throw new Error("事件说明不能为空");
    event[key] = val;
  }
}

var r = lib.open("product").updateOne({
  _id : id,
  scenes : scenesid,
}, {
  $set : {
    name    : prod_name,
    desc    : sys.request.desc || '',
    md      : new Date(),
    meta    : meta,
    data    : data,
    cmd     : cmd,
    event   : event,
  }
});

if (r.getMatchedCount() < 1) {
  sys.ret(11);
  return;
}

sys.setRetData(0);