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

var ret = {};
var blas = require("blas");

ret.c1 = blas.complex(1, 1);
// ret.c2 = blas.test(["c", 2, 3], [["1", 2, 3],["4", 5, 6]], [1, 2, new Date()]);
// ret.c3 = blas.test([ret.c1, ret.c1]);


sys.put("data", ret);
sys.ret(0, 'ok');