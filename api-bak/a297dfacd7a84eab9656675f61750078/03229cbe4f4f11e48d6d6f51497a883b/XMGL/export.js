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

var prjid = sys.request.getString("prjid");

var index = 0;
var filename = getPrjName() + new Date() +'_app_exports.zip';
var pack = require("pack");
var z = pack.createZipWriter(sys.getResponseStream(filename));
var module_map = {};

try {
  selectApp(prjid);
} catch(err) {
  console.error(err);
} finally {
  z.close();
}

return;


function getPrjName() {
  var s = "SELECT prjnm FROM sys_prj where prjid = ?";
  var rs = sql.queryStream(s, [prjid]);
  if (rs.hasNext()) {
    return rs.next().prjnm;
  }
  throw new Error("无效的项目");
}


function selectRoleApi(appid, roleid) {
  var table = sql.queryStream(
      "Select * From sys_role_api where appid =? And roleid=?", [appid, roleid]);
      
  while (table.hasNext()) {
    var role_api = fixdt(table.next());
    saveFile('sys_role_api', role_api);
    
    if (! module_map[role_api.moduleid]) {
      module_map[role_api.moduleid] = 1;
      selectModule(role_api.moduleid, role_api.appid);
    }
    
    selectApi(role_api.apiid, role_api.moduleid, role_api.appid);
  }
  table.close();
}


function selectModule(moduleid, appid) {
  var table = sql.queryStream(
    "Select * From sys_modules Where moduleid = ? And appid = ?", [moduleid, appid]);
    
  while (table.hasNext()) {
    var row = fixdt(table.next());
    saveFile('sys_modules', row);
  }
  table.close();
}


function selectApi(appid, moduleid, app) {
  var table = sql.queryStream(
    "Select * From sys_apis Where apiid=? And moduleid=?", [appid, moduleid]);
    
  while (table.hasNext()) {
    var row = fixdt(table.next());
    saveFile('sys_apis', row);
    selectApiContent(row.contentid);
  }
  table.close();
}


function selectApiContent(contentid) {
  var table = sql.queryStream(
    "Select * From sys_api_content Where contentid = ?", [contentid]);
    
  while (table.hasNext()) {
    var row = fixdt(table.next());
    saveFile('sys_api_content', row);
  }
  table.close();
}


function saveFile(type, row) {
  z.add(index+'', JSON.stringify({
    type : type,
    data : row,
  }, 0, 2));
  ++index;
}


function fixdt(row) {
  if (row.createdt) row.createdt = row.createdt.getTime();
  if (row.updatedt) row.updatedt = row.updatedt.getTime();
  return row;
}


function selectApp(prjid) {
  var s1 = `
    SELECT 
        app.*, roleid
    FROM
        sys_apps app,
        (SELECT DISTINCT
            sys_role_api.appid appid, sys_role_api.roleid
        FROM
            sys_role_api sys_role_api, 
            (SELECT 
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
    				AND role.status = '1') prjrole
        WHERE
            sys_role_api.roleid = prjrole.roleid
                AND sys_role_api.status = '1') role_app
    WHERE
        app.appflag = '0'
            AND app.appid = role_app.appid`;
            
  var table = sql.queryStream(s1, [prjid]);
  while (table.hasNext()) {
    var app = fixdt(table.next());
    saveFile("sys_apps", app);
    selectRoleApi(app.appid, app.roleid);
    console.log('sys_apps', app.appid);
  }
  table.close();
}