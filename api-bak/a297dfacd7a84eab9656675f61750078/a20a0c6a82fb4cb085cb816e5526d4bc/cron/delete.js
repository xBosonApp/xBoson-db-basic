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
var scheduleid=sys.request.scheduleid;
var orgid = sys.request.org;
if(null==scheduleid)
{
    sys.setRetData("1","缺少必要参数！");
    return;
}
var sqls ="DELETE FROM sys_pl_task_scheduler WHERE scheduleid = ?";
var params=[scheduleid];


if(0<sql.update(sqls,params,1)){
    sql.commit();
    se.delCache(_CACHE_REGION_SCHEDULE_,orgid+":"+scheduleid);
    sys.setRetData("0","");
    return;
}

sql.rollback();
sys.setRetData("1","删除失败！");