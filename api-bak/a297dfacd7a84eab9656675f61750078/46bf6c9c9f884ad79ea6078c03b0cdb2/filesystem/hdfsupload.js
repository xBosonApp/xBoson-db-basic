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

var Digest = require('digest');
var file_system = require('fs');
var fs = file_system.openURI("hdfs://10.0.0.9:9000");
var msg = [];

sys.request.multipart(function(item) {
  fs.delete(item.header.filename);
  
  var md5 = Digest.md5();
  var sha1 = Digest.sha1();
  var sha5 = Digest.sha512();
  
  var out = fs.openOutputStream(item.header.filename);
  var md5out = md5.bind(sha1.bind(sha5.bind(out)));
  item.readTo(md5out);
  md5out.close();
  msg.push(item.header.filename 
    +' MD5:'+ md5.digest().toHex()
    +' SHA1:'+ sha1.digest().toHex()
    +' SHA512:'+ sha5.digest().toHex());
});

sys.setRetData(0, msg.join(", "));