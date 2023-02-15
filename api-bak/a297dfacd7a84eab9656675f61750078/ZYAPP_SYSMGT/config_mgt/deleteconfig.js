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
//deleteconfig
//删除平台配置

var config_key=sys.request.config_key;

if(config_key==null){
    sys.setRetData("1");
    return;
}
 var sqlDlt="delete from sys_config where config_key=?";
 
 var paramDlt=[config_key];
 var dltCount = sql.update(sqlDlt,paramDlt);
  if (dltCount == 0) {
    sys.setRetData("5");
  }else {
    se.delCache(_CACHE_REGION_CONFIG_, config_key);
    sys.setRetData("0");
  }