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
//addconfig
//添加平台配置应用

var config_key=sys.request.config_key;
var config_value=sys.request.config_value;
var config_desc=sys.request.config_desc;
var status=sys.request.status;
if(config_key==null||config_value==null||status==null){
    sys.setRetData("1");
    return;
}

var sqlSel = "SELECT COUNT(*) CNT FROM sys_config WHERE config_key = ?";
var paramSel = [config_key];   
var resultCounta = sql.query(sqlSel,paramSel,"configset");

var selResult = sys.result.configset;
var selCount = selResult[0].CNT;

if (selCount != 0) { //已存在该主键
  sys.setRetData("8");
  return;
}

var sqlIns = "INSERT INTO sys_config (config_key,config_value,config_desc,status,createdt,updatedt) VALUES (?,?,?,?,?,?)";

var dt = sys.getCurrentTimeString();//获取当前时间
var paramIns = [config_key,config_value,config_desc,status,dt,dt];
var insCount = sql.update(sqlIns,paramIns);
if (insCount == 0) {
  sys.setRetData("5", "插入数据失败");
  return;
}

//更新缓存
var config = se.getCache(_CACHE_REGION_SYS_SQL_, "config0002");
var cnt = sql.query(config, [config_key], "configR");
var configR = sys.result.configR;
if(cnt>0){
    se.setCache(_CACHE_REGION_CONFIG_, config_key, configR[0].config_value, 0);
}else{
    se.delCache(_CACHE_REGION_CONFIG_, config_key);
}

sys.setRetData("0");