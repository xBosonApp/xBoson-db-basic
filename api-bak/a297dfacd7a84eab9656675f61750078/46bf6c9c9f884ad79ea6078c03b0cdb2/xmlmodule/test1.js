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

var xml = require("xml");
var stream = require("streamutil");

var buf = stream.openStringBufferOutputStream();
var build = xml.build(buf);

var a = build.tag('a');
var b = a.tag('b');
var c = b.tag('c');
var d = b.tag('d').attr("type", 'int');

build.end();

var x = buf.toString();
console.log(x);
sys.setRetData(0, x);