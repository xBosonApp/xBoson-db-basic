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
var sh = require('shell').open();

sh.putEnv('PLAT_JS_ENV', 'from javascript env var.('+ Math.random() +')');
var r1 = sh.execute("subdir/env");
sys.addRetData(r1, 'r1');


var r2 = sh.execute("subdir/args", ["1", Math.random()]);
sys.addRetData(r2, 'r2');


sys.setRetData(0, 'ok', 'r1', 'r2');