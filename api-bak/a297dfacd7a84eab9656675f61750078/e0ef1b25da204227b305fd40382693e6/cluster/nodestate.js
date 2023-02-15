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

var nodeid = sys.request.getString('nodeid', 1, 3);
var cluster = require("cluster").open();

var nameMapper = {};
nameMapper[cluster.RUNNING] = '运行中';
nameMapper[cluster.DOWN]    = '离线';
nameMapper[cluster.UNKNOW]  = '未知';

sys.put('state', nameMapper[cluster.state(nodeid)] || '未知');
sys.setRetData(0, 'ok');