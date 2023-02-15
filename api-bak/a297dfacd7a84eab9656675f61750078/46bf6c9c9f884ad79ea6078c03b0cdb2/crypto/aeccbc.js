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

var crypto = require('./lib');

var pass = '123454';
var data = "0001000100010001-0002000200020002-0003000300030003";

var cc = crypto.encode(pass, data);
sys.put('cc', cc);

var cd = crypto.decode(pass, cc);
sys.put('cd', cd.toJavaString());
sys.setRetData(0);