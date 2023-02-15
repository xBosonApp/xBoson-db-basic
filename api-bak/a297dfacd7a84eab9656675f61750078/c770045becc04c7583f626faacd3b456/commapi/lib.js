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

var cfg = require("config");
var conf_name = "bi-mod-conn"

// 当配置文件不存在, 创建默认的配置文件
if (!cfg.get(conf_name)) {
  // 创建配置文件
  cfg.create({
    'mode': cfg.MODE_ORG,
    'name': conf_name,
    'desc': "多维模型 conn 参数与数据源 id 映射, key 为 conn 参数值, value 是映射的 did, 动态参数",
    'create_time': new Date(),
  });
  // 创建配置内容
  cfg.putTemplate(conf_name, {
    '1' : cfg.TYPE_STRING,
  });
  // 配置项说明
  cfg.setDesc(conf_name, {
    '1' : "conn 为 N 时, 对应的数据源 id (这是个例子)",
  });
  cfg.set(conf_name, { 1: '00000000000000000000000000000000' });
}


module.exports = {
  getDidFrom : getDidFrom,
};


//
// 如果没有提供 conn 参数, 则返回 null
//
function getDidFrom(sys) {
  var conn = sys.request.conn;
  if (conn) {
    var mapping = cfg.get(conf_name);
    var did = mapping[conn];
    if (did) return did;
    console.log(mapping)
    throw new Error("conn 参数 '"+ conn +"' 指向无效的配置项");
  }
  return null;
}