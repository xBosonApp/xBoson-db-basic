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
// 清空系统缓存
se.delCache(_CACHE_REGION_CONFIG_);
// select系统配置信息
var selectconfig = se.getCache(_CACHE_REGION_SYS_SQL_,"config0001");
//"select config_key,config_value from sys_config where status='1'";
var cnt = sql.query(selectconfig,[],"sysconfig");
//缓存配置信息开始...
var sysconfig=sys.result.sysconfig;
for(s in sysconfig){
    se.setCache(_CACHE_REGION_CONFIG_,s.config_key,s.config_value,0);
}
se.setCache(_CACHE_REGION_CONFIG_,_CACHE_KEY_READY_,true,0);