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
//获取从URL中传过来的参数
/*
*删除已经创建的模块（图表）
*/
var pid = sys.getUserPID(sys.request.openid),
    modid  = sys.request.modid;
//判断参数是否合法 
if(pid==null || modid==null){
  sys.setRetData("1");
    return;
}

sql.update("delete from sys_mod_kpi where pid=? and  modid=?",[pid,modid]);

sys.setRetData("0");