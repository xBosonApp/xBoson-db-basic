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

var url = sys.request.getString('url', 1, 255);
var lib = require('./libs');

var tls = {
  'key' : sys.request.key,
  'pass': sys.request.pass,
  'cert': sys.request.cert,
  'ca'  : sys.request.ca,
};

var cli = lib.docker.open(url, tls);
var info = cli.call('info');
lib.saveHost(url, null, tls);

sys.put('data', info);
sys.setRetData(0, 'ok');