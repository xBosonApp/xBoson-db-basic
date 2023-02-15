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
//id:updatepreset
//更新预设信息

//获取参数
var presetid = sys.request.presetid;
var presetnm = sys.request.presetnm;
var mark = sys.request.mark;
var status = sys.request.status;

//验证必填参数
if(presetnm == null || status==null){
    sys.setRetData("1");
    return;
}
//判断预设名是否已存在
var checkNameSql = "select presetid from sys_pl_init_preset where presetnm=? and presetid !=?";
var checkNameSql_cnt = sql.query(checkNameSql,[presetnm,presetid]);
if(checkNameSql_cnt>0){
    sys.setRetData("2","预设名已存在，请更换预设名");
    return;
}
var dt = sys.currentTimeString();

var updSql = "update sys_pl_init_preset set presetnm=?,mark=?,status=?,updatedt=? where presetid=?";

var params = [presetnm,mark,status,dt,presetid];

sql.update(updSql,params);

sys.setRetData("0");