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
// getappinfo
// 获取 API 服务信息
// 参数：appid(必须),moduleid(必须)，apiid(必须)
var appid = sys.request.appid;
var modid = sys.request.moduleid;
var apiid = sys.request.apiid;

// 验证必要参数
if (appid == null || modid == null || apiid == null) {
  sys.setRetData("1");
  return;
}
var sql = "select appid, moduleid, apiid, apinm, status,createdt, updatedt,op_type optype,help_info from sys_apis where appid = ? and moduleid = ? and apiid = ?";
var param = [appid, modid, apiid];
var cnt = sql.query(sql, param, "result");
if (cnt > 0) {
  var value = sys.result.result[0];
	var _mdm = se.getCache(_CACHE_REGION_MDM_, _ORGID_PLATFORM_+":ZR.0052");
//sys.printValue(_mdm);
	if(_mdm != null){
    var _info = value.help_info;
    if (_info) {
		  _info = JSON.parse(_info);
      if (_info.requests) {
        for(var t in _mdm){
          if(_mdm[t].id === _info.requests){
            _info.methodid = _mdm[t].id;
            _info.methodnm = _mdm[t].name;
          }
        }
      } else {
        _info.methodid = '01';
        _info.methodnm = 'GET';
      }
      _info = JSON.stringify(_info);
      value.help_info = _info;
		}
	}
  // 取到数据正常返回
  sys.setRetData("0", "", "result");
} else {
  // 未取到数据，返回排他异常
  sys.setRetData("6");
}