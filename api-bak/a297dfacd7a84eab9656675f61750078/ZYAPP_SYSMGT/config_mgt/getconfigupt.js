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

//getconfigupt
//同步平台配置应用
var config_key=sys.request.config_key;

if(config_key==null){
    sys.setRetData("1");
    return;
}

var sqlQuery="select config_key,config_value,config_desc,status from sys_config where config_key=?";
var paramQey=[config_key];
sql.query(sqlQuery,paramQey);
sys.setRetData("0","","result");