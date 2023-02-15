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

var name = sys.request.getString('name', 1, 50);

var c = require('config');
sys.put('desc', c.getDesc(name));
sys.put('data', c.get(name) || {});
sys.put('tpl',  c.getTemplate(name));
sys.put('state', [
  '当前应用:', sys.request.app, 
  ', 机构:', sys.request.org, 
  ', 用户:', sys.getUserIdByPID(),
  ',', sys.request.s == 'd' ? '测试(调试)环境':'生产环境',
  ].join(' '));
sys.setRetData(0, 'ok');