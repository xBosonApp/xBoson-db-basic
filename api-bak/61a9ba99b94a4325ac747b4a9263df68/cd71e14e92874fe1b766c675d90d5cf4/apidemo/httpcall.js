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
console.log(">>>> ----------------- Test http Functions.", http);
var assert = require("assert");

console.log("schema:", http.schema());
console.log("domain:", http.domain());
console.log("port:", http.port());
console.log("method:", http.method());
console.log("headers:", JSON.stringify( http.headers() ));
console.log("uri:", http.uri());


var r = http.get("http://api.weixin.qq.com/cgi-bin/token", {
  grant_type: "client_credential",
  appid: "APPID", 
  secret: "APPSECRET"
}, "json");


sys.put('x', r.data);
sys.setRetData(0, 'ok');