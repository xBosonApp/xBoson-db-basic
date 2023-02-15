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
// xml / url 参数选一个
//
var xml = sys.request.xml;
var url = sys.request.url;
var ret = null;

if (xml == null && url == null) {
  sys.setRetData(1, "参数说明: xml - 字符串, 待解析 wsdl 文本; url - 从远程获取 wsdl 文档");
  return;
}

var ws = require('ws');
if (xml != null) {
  ret = ws.wsdl(url, xml);
} 
else if (url != null) {
  ret = ws.wsdl(url);
}

sys.addRetData(ret, 'wsdl')
sys.setRetData(0, '成功解析', 'wsdl');