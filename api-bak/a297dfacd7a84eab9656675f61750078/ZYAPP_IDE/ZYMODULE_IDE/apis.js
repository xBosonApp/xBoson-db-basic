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
// 根据用户个人项目权限显示能看到的APP列表
// HTTP 请求参数
var id = sys.request.id;
var status = sys.request.status;
var roleid=sys.request.roleid;
if(roleid == null){
  sys.setRetData("1","角色未指定");
  return;
}
if (id == null) {
  id = "";
}
var sql = "";
var param = [];
var queryIds = strutil.split(id, "@");
var len = queryIds.~size;
switch (len) {
  case 1:
    if (id == "") {
      // APP
      sql="select distinct app.appid someid,'' belongto,app.appid,app.appid showid,app.appnm,app.about,app.status,app.createdt,app.updatedt from sys_apps app,sys_role_api roleapi,sys_role role where role.roleid=? and roleapi.roleid=role.roleid and app.appid=roleapi.appid and role.status='1' and roleapi.status='1' order by app.appnm";
      list.add(param, roleid);
    } else {
      // 模块
      var appid = id;
      //判断数据库类型
      var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
      if(dbType == "01"){
        sql = "select concat(appid,'@',moduleid) someid, concat(appid) belongto, appid, moduleid,moduleid showid, concat(modulenm) appnm, about, status, createdt, updatedt ,modulenm ,auflag from sys_modules where appid = ? ";
      }else if(dbType == "02"){
        sql = "select appid + '@'+ moduleid someid,appid as belongto, appid, moduleid,moduleid showid, modulenm as appnm, about, status, createdt, updatedt ,modulenm ,auflag from sys_modules where appid = ? ";
      }else if(dbType == "03"){
        sql = "select appid || '@' || moduleid someid, appid as belongto, appid, moduleid,moduleid showid, modulenm as appnm, about, status, createdt, updatedt ,modulenm ,auflag from sys_modules where appid = ? ";
      }
      list.add(param, appid);
      if (status != null) {
        sql = sql + "and status = ? ";
        list.add(param, status);
      }
      sql = sql + "order by appnm ";
    }
    break;
  case 2:
    // API
    var appid = queryIds[0];
    var moduleid = queryIds[1];
    //判断数据库类型
    var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if(dbType == "01"){
      sql = "select concat(appid,'@',moduleid,'@',apiid) someid, concat(appid,'@',moduleid) belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from sys_apis , sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";
    }else if(dbType == "02"){
      sql = "select appid + '@'+ moduleid + '@'+ apiid someid, appid +'@'+ moduleid  belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from sys_apis , sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? ";
    }else if(dbType == "03"){
      sql = "select appid ||'@'|| moduleid || '@'|| apiid someid, appid ||'@'|| moduleid  belongto, appid, moduleid, apiid, apiid showid, apinm appnm, sys_apis.contentid, sys_apis.status, sys_apis.createdt, sys_apis.updatedt,apinm,op_type optype,sys_api_content.stability from sys_apis , sys_api_content where sys_apis.contentid=sys_api_content.contentid  and appid = ? and moduleid = ? "; 
    }
    list.add(param, appid);
    list.add(param, moduleid);
    if (status != null) {
      sql = sql + " where sys_apis.status = ? ";
      list.add(param, status);
    }
    sql = sql + "order by appnm";
    break;
  case 3:
    // API 历史
    var appid = queryIds[0];
    var moduleid = queryIds[1];
    var apiid = queryIds[2];
    //判断数据库类型
    var dbType = se.dbType();  // 01 MySQL, 02 SQLServer, 03 Oracle, 04 DB2
    if(dbType == "01"){
      sql = "select concat(appid,'@',moduleid,'@',apiid,'@',hisid) someid, concat(appid,'@',moduleid,'@',apiid) belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from sys_api_his_content apihis , sys_apis apis where apis.contentid = apihis.contentid and appid = ? and moduleid = ? and apiid = ?";
    }else if(dbType == "02"){
      sql = "select appid+'@'+moduleid+'@'+apiid+'@'+hisid someid,appid+'@'+moduleid+'@'+apiid belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from sys_api_his_content apihis , sys_apis apis where apis.contentid = apihis.contentid and appid = ? and moduleid = ? and apiid = ?";
    }else if(dbType == "03"){
      sql = "select appid ||'@'||moduleid ||'@'||apiid ||'@'|| hisid someid,appid||'@'||moduleid||'@'||apiid belongto, hisid, appid, moduleid, apiid,apinm,apiid showid,apis.status,apihis.updatedt,apihis.updatedt appnm,updatecmt,apihis.stability,apis.op_type from sys_api_his_content apihis , sys_apis apis where apis.contentid = apihis.contentid and appid = ? and moduleid = ? and apiid = ?";  
    }
    list.add(param, appid);
    list.add(param, moduleid);
    list.add(param, apiid);
    sql = sql + " order by apihis.updatedt desc";
    break;
  default:
  sys.setRetData("2");
  return;
}
sql.query(sql, param, "value");
var value = sys.result.value;
//为tree节点显示的name加上（稳定性状态）
if(len == 3 || len == 2){
  var _tmp = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0030");
  for(v in value){
    var _name = "";
    
    if (v.status == '1') {
      if(_tmp != null){
       for(t in _tmp){
        if(t.id == v.stability){
          _name = t.name;
        }
       }
      }
    } else {
      _name = '无效';
    }
    _name = "("+_name+")"+v.appnm;
    map.put(v,"appnm", _name);
  }
}
sys.setRetData("0", null, "value");