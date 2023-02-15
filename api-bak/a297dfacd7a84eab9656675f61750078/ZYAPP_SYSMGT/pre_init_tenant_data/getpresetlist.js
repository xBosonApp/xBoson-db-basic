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
//id:getpresetlist
//name:获取初始化预设一览
var presetnm = sys.request.presetnm;
var status = sys.request.status;
var pagesize = sys.request.pagesize;
var pagenum = sys.request.pagenum;

if(pagesize == null){
    pagesize = 10;
}
if(pagenum == null){
    pagenum = 1;
}
var getPreset = "select presetid,presetnm,mark,status,createdt,updatedt from sys_pl_init_preset where 1=1 ";
var params = [];
if(presetnm != null){
    getPreset = getPreset + " and presetnm like ?";
    list.add(params,"%"+presetnm+"%");
}
if(status != null){
    getPreset = getPreset + " and status = ?";
    list.add(params,status);
}

sql.queryPaging(getPreset,params,pagenum,pagesize);
sys.setRetData("0","","result");