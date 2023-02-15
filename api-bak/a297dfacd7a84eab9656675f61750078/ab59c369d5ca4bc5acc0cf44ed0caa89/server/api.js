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
sys.authorization('api.opc.manager.functions()');

var lib = require("./lib");
var resp = { code:0, msg:'ok' };
var body = sys.request.body(10*1024*1024);
if (!body) {
  sys.setRetData(1);
  return; // end(1, "miss parameater");
}

var client_id = sys.request.getHeader('cli');
if (!client_id) {
  sys.setRetData(1);
  return; // end(1, '"cli" header not found');
}

// console.log('content body length :::::::::::::::', sys.request.getHeader("Content-Length"), body.toString('utf8').length(), body.length, body.toString('utf8'));
var client_key_data = lib.findClient(client_id);
var _xbuf = lib.decode(client_key_data.secret, body.toString('utf8'));
var req = JSON.parse(_xbuf.toJavaString());

switch (req.act) {
  default:
    resp.code = 2;
    resp.msg = 'Unknow ACTION';
    break;
    
  case 'getconn':
    resp.data = lib.getConn(client_id);
    break;
    
  case 'getver':
    var conn = lib.getConn(client_id);
    resp.version = conn.version;
    break;
    
  case 'senddata':
    lib.onSendData(client_id, req);
    break;
    
  case 'getitem':
    resp.data = lib.getItemData(client_id);
    break;
}

lib.updateState(client_id);
end();


function end(code, msg) {
  if (code >= 0) {
    resp.code = code;
  }
  if (msg) {
    resp.msg = msg;
  }
  sys.setHeader("Content-Encoding", "AES/CBC/PKCS5Padding/JSON");
  var stream = require('streamutil');
  var txt = JSON.stringify(resp);
  var encdata = lib.encode(client_key_data.secret, txt);
  sys.setStream(stream.openStringInputStream(encdata), "aes.data");
}