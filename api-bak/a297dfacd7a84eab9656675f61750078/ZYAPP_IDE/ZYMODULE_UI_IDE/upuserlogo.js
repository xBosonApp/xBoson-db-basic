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

var userid = sys.request.getString('openid', 1, 20);
var file, buf, x, y, w, h;

sys.request.multipart(function(item) {
  var h = item.header;
  var c = item.content;
  // sys.printValue(item.header);
  
  if (h.filename) {
    file = h.filename;
    buf  = item.readBuffer();
  } else {
    var v = parseInt(item.readString());
    switch (h.name) {
      case 'x'     : x = v; break;
      case 'y'     : y = v; break;
      case 'width' : w = v; break;
      case 'height': h = v; break;
    }
  } 
});

var ext;
if (x>=0 && y>=0 && w>0 && h>0) {
  var image = require("image");
  var pic = image.read(buf);
  pic.resize(x, y, w, h);
  buf = pic.toBuffer("jpeg");
  ext = '.jpg';
} else {
  var i = file.lastIndexOf('.');
  ext = file.substring(i);
}

file = sys.getUserIdByOpenId() + ext;
var uifs = require("fs").open();
uifs.writeFile("/lib/img/"+ file, buf);

var httppath = '../../lib/img/' + file;
var pid      = sys.getUserPID(userid);
var sql1     = "update sys_userinfo set image_path = ?,updatedt = ? where pid = ?"; 
var paramSel = [ httppath, sys.currentTimeString(), pid ];
var updCount = sql.update(sql1, paramSel);

if (updCount == 0) {
  sys.setRetData("5", "更新图片路径失败");
  return;
}

sys.setRetData("0", '头像已经更新');