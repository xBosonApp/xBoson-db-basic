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
//id:getpresetupd
//name:同步预设信息

var presetid = sys.request.presetid;

if(presetid == null){
    sys.setRetData("1");
    return;
}

var getSql = "select presetid,presetnm,mark,status from sys_pl_init_preset where presetid=?";

sql.query(getSql,[presetid]);

sys.setRetData("0","","result");