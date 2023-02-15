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
//
// TXT 文件下载地址 http://ips.chacuo.net/
// Nodejs 脚本
//
var fs = require('fs');

var outfile = fs.openSync('outfile.sql', 'w');
fs.writeSync(outfile, 'Insert Into sys_ip_adscription(a1,a2,a3,a4, b1,b2,b3,b4, province) VALUES\n');

var dir = fs.readdirSync(__dirname + '/data');
dir.forEach(parseFile);

function parseFile(fname) {
  var zone = fname.split('.')[0];
  console.log(zone);
  
  var d = fs.readFileSync('data/'+ fname, 'utf8');
  var lines = d.split('\n');
  
  lines.forEach(function(t) {
    var x = t.split('\t');
    var a = x[0].trim();
    var b = x[1].trim();
    write(a, b, zone);
  });
}


function write(a, b, name) {
  a = a.split('.').join(',');
  b = b.split('.').join(',');
  var buf = a.concat(b);
  fs.writeSync(outfile, '('+ a +','+ b +',"'+ name +'"),\n');
}