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


// 初始化智能配置
var conf_name = "xboson-saas";
var conf = cfg.get(conf_name);
  
// 当配置文件不存在, 创建默认的配置文件
if (!conf) {
  // 创建配置文件
  cfg.create({
      // 必须是全局配置模式
      'mode': cfg.MODE_ORG,
      'name': conf_name,
      'desc': "SaaS 云应用",
      'create_time': new Date(),
  });
  // 创建配置内容
  cfg.putTemplate(conf_name, {
      'mongodb': cfg.TYPE_STRING,
      'dbname_mdm': cfg.TYPE_STRING,
      'dbname_operate': cfg.TYPE_STRING,
      'dbname_crm': cfg.TYPE_STRING,
      'dbname_task': cfg.TYPE_STRING,
      'dbname_form': cfg.TYPE_STRING,
      'task_api_path': cfg.TYPE_STRING,
      'task_api_userid': cfg.TYPE_STRING,
      'task_api_orgid': cfg.TYPE_STRING,
      'appid': cfg.TYPE_STRING,
      'appsecret': cfg.TYPE_STRING,
      'cache_region': cfg.TYPE_STRING,
      'cache_key_access_token': cfg.TYPE_STRING
  });
  // 配置项说明
  cfg.setDesc(conf_name, {
      'mongodb': "MongoDB 连接 URL",
      'dbname_mdm': '数据库名（主数据）',
      'dbname_operate': '数据库名（运营管理）',
      'dbname_crm': '数据库名（客户关系）',
      'dbname_task': '数据库名（任务安排）',
      'dbname_form': '数据库名（表单）',
      'task_api_path': '计划任务调用的发送消息API',
      'task_api_userid': '用户ID',
      'task_api_orgid': '机构ID',
      'appid': '微信小程序ID',
      'appsecret': '微信密钥',
      'cache_region': '缓存region的名称',
      'cache_key_access_token': '存放微信服务端AccessToken的缓存key'
  });
  conf = {
      mongodb: 'mongodb://mongo-x',
      dbname_mdm: 'xboson-saas-mdm',
      dbname_operate: 'xboson-saas-operate',
      dbname_crm: 'xboson-saas-crm',
      dbname_task: 'xboson-saas-task',
      dbname_form: 'xboson-saas-form',
      task_api_path: '/xboson/app/61a9ba99b94a4325ac747b4a9263df68/f1b4adf82ee54a1c8e18d31349988a4b/message/sendMsg',
      task_api_userid: 'admin_pl',
      task_api_orgid: '61a9ba99b94a4325ac747b4a9263df68',
      appid: '111',
      appsecret: '222',
      cache_region: 'saas-wx-miniprogram',
      cache_key_access_token: 'wx_mp_access_token'
  };
  cfg.set(conf_name,conf);
}

sys.setRetData(0, '智能配置初始化完成！');