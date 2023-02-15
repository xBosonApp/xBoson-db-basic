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

var menus_on_table = {};
var rs = sql.queryStream("Select * From sys_menu");
var column;
var bind = [];
var total = 0;
var update = 0;
var insert = 0;
var skip = 0;

while (rs.hasNext()) {
  var row = rs.next();
  menus_on_table[row.menuid] = row;
  ++total;
  
  if (!column) {
    column = [];
    for (var n in row) {
      column.push(n);
      bind.push('?');
    }
  }
}

var pack = require("pack");
sys.request.multipart(function(item) {
  var uz = pack.createUnZipReader(item.openInputStream());
  while (uz.hasNext()) {
    onItem(uz.path(), uz.openInput());
  }
});

function onItem(p, istream) {
  if (p == 'index') return;
  var irow = JSON.parse(istream.readString());
  var exists = menus_on_table[irow.menuid];
  
  if (exists) {
    if (exists.updatedt.getTime() < irow.updatedt) {
      sql.update("Update sys_menu SET "
        + genAllSet() +" Where menuid=?", bingParm(irow, irow.menuid));
      ++update;
    } else {
      ++skip;
    }
  } else {
    sql.update('INSERT INTO sys_menu ('
      + column.join(',') +') VALUES ('+ bind.join(",") +')', bingParm(irow));
    ++insert;
  }
}

function bingParm(x, a, b, c) {
  var parm = [];
  for (var i=0; i<column.length; ++i) {
    parm[i] = x[column[i]];
    
    if ('createdt' == column[i] || 'updatedt' == column[i]) {
      parm[i] = new Date(parm[i]);
    }
  }
  if (a) parm.push(a);
  if (b) parm.push(b);
  if (c) parm.push(c);
  return parm;
}

function genAllSet() {
  var ret = [];
  for (var i=0; i<column.length; ++i) {
    ret.push(column[i], '=?', ',');
  }
  ret.pop();
  return ret.join("");
}

sys.setRetData(0, '完成, 已有菜单'+ total +', 更新'+ update +', 创建'+ insert +", 忽略"+ skip);