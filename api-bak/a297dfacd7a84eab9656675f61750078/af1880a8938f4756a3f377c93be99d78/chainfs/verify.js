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

var volid    = sys.request.getString('v', 1, 99);
var path     = sys.request.getSafePath('p');
var lib      = require("./lib");
var plib     = require("path");
var Digest   = require('digest');
var selfuser = sys.getUserIdByPID();

var v = lib.openVolumeRead(selfuser, volid);
var attr = lib.getAttr(volid, path);
if (attr == null || !attr.isFile()) {
  throw new Error("不是文件 "+ path);
}

var info = {};
sys.put('data', info);

var cmap = lib.openTable("chain-map");
var chain = lib.openChain(v);
var block = lib.getBlock(chain, cmap, volid, path);
info['区块校验'] = '通过';

var md5 = Digest.md5();
var sha1 = Digest.sha1();
var sha5 = Digest.sha512();

var i = lib.openInput(volid, path);
var out = md5.bind(sha1.bind(sha5.getOutput()));
i.pipe(out);
out.close();

info['文件长度']   = eq(block.data.bytes, attr.size);
info['MD5校验']    = deq(md5, 'md5');
info['SHA1校验']   = deq(sha1, 'sha1');
info['SHA512校验'] = deq(sha5, 'sha512');

sys.setRetData(0, 'ok');

function eq(a, b) {
  return a == b ? '通过' 
                : '失败 ('+ a +' != '+ b +')';
}

function deq(d, n) {
  var a = d.digest().toHex();
  var b = block.data[n];
  return eq(a, b);
}