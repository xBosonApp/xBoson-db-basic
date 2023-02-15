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

var prjid = sys.request.prjid;

var tableKey = {
  sys_apps        : ['appid'],
  sys_api_content : ['contentid'],
  sys_apis        : ['apiid', 'moduleid', 'appid'],
  sys_modules     : ['appid', 'moduleid'],
  sys_role_api    : ['roleid', 'appid', 'moduleid', 'apiid'],
};
var role_id_map = {};
var insertc = 0;
var updatec = 0;
var skipc = 0;

var pack = require("pack");
sys.request.multipart(function(item) {
  // 表单参数名称
  if (item.header.name == 'prjid') {
    prjid = item.readString();
  }
  // 文件名称, 如果是文件才有这个参数
  if (item.header.filename) {
    if (!prjid) {
      throw new Error("prjid 参数未设置(必须是第一个参数)");
    }
    
    try {
      sql.setAutoCommit(false);
      initRoles();
      var uz = pack.createUnZipReader(item.openInputStream());
      while (uz.hasNext()) {
        on_file(uz.path(), uz.openInput());
      }
      sql.commit();
    } catch(err) {
      sql.rollback();
      // err.printStackTrace()
      throw err;
    } 
  }
});

sys.setRetData(0, "更新了"+ updatec +", 创建了"+ insertc +", 忽略"+ skipc);
return;


function on_file(p, istream) {
  var row = JSON.parse(istream.readString());
  var w = genWhere(row.data, tableKey[row.type]);
  var s = "Select * From "+ row.type +" Where " + w.where;
  // 查询数据是否存在
  var findRS = sql.queryStream(s, w.bind);
  
  if ('sys_role_api' == row.type) {
    if (! role_id_map[row.data.roleid]) {
      sys.printValue(role_id_map)
      throw new Error("数据错误, 无效的 roleid:"+ row.data.roleid +", 一个项目对应一个 roleid, 导入了错误的项目.");
    }
  }
  
  // 数据存在就更新, 否则插入
  if (findRS.hasNext()) { 
    // sys_api_content 无需更新, 只有插入
    if ('sys_api_content' == row.type) {
      ++skipc;
      return;
    }
    
    var srow = fixdt(findRS.next());
    // 数据库中的数据比较旧时更新数据
    if (row.data.updatedt > srow.updatedt) {
      var u = toUpdate(row.data, tableKey[row.type]);
      var bind = u.bind.concat(w.bind);
      var c = sql.update("Update "+ row.type +" SET " 
            + u.set +" Where "+ w.where, bind);
      if (c < 0) throw new Error("更新失败"+ row.type);
      
      // 把旧 api 插入历史记录
      if (row.type == 'sys_apis') {
        make_api_his_content(srow.contentid);
      }
      ++updatec;
    } else {
      ++skipc;
    }
  } else {
    if ('sys_api_content' == row.type) {
      // 修改状态未测试完成, 导入后发布
      row.data.stability = 30;
    }
    if ('sys_apps' == row.type) {
      // 导出时的错误
      delete row.data.roleid;
    }
    
    // 数据不存在则插入一条新数据
    var i = toInsert(row.data);
    var c = sql.update("Insert INTO "+ row.type +"("+ i.field 
          +") VALUES ("+ i.value +")", i.bind);
    if (c < 0) throw new Error("插入失败"+ row.type);
    ++insertc;
  }
  findRS.close();
}


function make_api_his_content(contentid) {
  var sqlHisContent = "insert into sys_api_his_content (hisid, contentid, stability, updatecmt, pid, updatedt, content, zip) select ?, contentid, stability, updatecmt, pid, updatedt, content, zip from sys_api_content where contentid = ?";
  var paramHisContent = [sys.getUUID(), contentid];
  var c = sql.update(sqlHisContent, paramHisContent);
  if (c < 0 ) throw new Error("更新 sys_api_his_content 失败");
}


function initRoles() {
  var s = `
    SELECT 
    	ugrole.roleid roleid
    FROM
    	sys_role_ug ugrole, sys_prj prj, sys_ug ug, sys_role role
    WHERE
    	prj.prjid = ?
    		AND prj.ugid = ugrole.ugid
    		AND ugrole.ugid = ug.ugid
    		AND ugrole.roleid = role.roleid
    		AND role.status = '1'
    		AND ug.status = '1'
    		AND prj.status = '1'
    		AND ugrole.status = '1'
    		AND role.status = '1';
    `;
  var rs = sql.queryStream(s, [prjid]);
  var count = 0;
  
  while (rs.hasNext()) {
    var row = rs.next();
    role_id_map[row.roleid] = 1;
    ++count;
  }
  
  if (count <= 0) {
    throw new Error("当前项目与文件包中的项目不匹配");
  }
}


function genWhere(row, keys) {
  var w = [];
  var b = [];
  for (var i=0; i<keys.length; ++i) {
    var k = keys[i];
    w.push(k, '=?', ' AND ');
    b.push(row[k]);
  }
  w.pop();
  
  return {
    where : w.join(""),
    bind  : b,
  };
}


function toUpdate(o, pkey) {
  var s = [];
  var b = [];
  var k = {};
  initPKey();
  for (var n in o) {
    if (k[n]) continue;
    s.push(n, '=?', ',');
    b.push(revertdt(n, o[n]));
  }
  s.pop();
  
  return {
    'set' : s.join(""),
    bind  : b,
  };
  
  function initPKey() {
    for (var i=0; i<pkey.length; ++i) {
      k[pkey[i]] = 1;
    }
  }
}


function toInsert(o) {
  var n = [];
  var v = [];
  var b = [];
  for (var name in o) {
    n.push(name, ',');
    v.push('?', ',');
    b.push(revertdt(name, o[name]));
  }
  n.pop();
  v.pop();
  
  return {
    field : n.join(""),
    value : v.join(""),
    bind  : b,
  }
}


function revertdt(n, d) {
  if (n == 'createdt' || n == 'updatedt') {
    return new Date(d);
  }
  return d;
}


function fixdt(row) {
  if (row.createdt) row.createdt = row.createdt.getTime();
  if (row.updatedt) row.updatedt = row.updatedt.getTime();
  return row;
}