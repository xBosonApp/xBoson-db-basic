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

var id = sys.request.getString('id', 1, 45);

var lib = require("./lib");
var doc = lib.opendoc();



try {
  var data = doc.find({ _id: id }, { xml:1, access:1 });
  data = data && data[0];
  
  if (data) {
    if (data.access == 0 && id.indexOf(sys.getUserIdByPID()+'/') != 0) {
      sys.setRetData(1, '无权读取该文件');  
      return;
    }
    
    sys.addRetData(lib.decode(data.xml), 'data');
    sys.setRetData(0, 'ok', 'data');
  } else {
    sys.setRetData(1, '文件不存在');
  }
} catch(e) {
  sys.setRetData(1, '失败,'+ e.message);
}