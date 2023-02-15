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


// 短信服务初始化智能配置
var conf_name = "xboson-saas-sms";
var conf = cfg.get(conf_name);
  
// 当配置文件不存在, 创建默认的配置文件
if (!conf) {
  // 创建配置文件
  cfg.create({
      // 必须是全局配置模式
      'mode': cfg.MODE_ORG,
      'name': conf_name,
      'desc': "SaaS 短信服务",
      'create_time': new Date(),
  });
  // 创建配置定义属性项数据类型
  cfg.putTemplate(conf_name, {
      'ebbe-50d64b49': cfg.TYPE_BOOL, //属性ID: 属性类型
  });
  // 配置属性项说明
  cfg.setDesc(conf_name, {
      'ebbe-50d64b49': "MongoDB 连接 URL",
  });
  conf = {
      ebbe-50d64b49: true,
  };
  cfg.set(conf_name,conf);
}

sys.setRetData(0, '智能配置初始化完成！');