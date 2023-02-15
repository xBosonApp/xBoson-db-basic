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
var pageid = sys.request.pageid;
var pagenm = sys.request.pagenm;
var page_path = sys.request.page_path;

if(pageid==null||pagenm==null||page_path==null){
    sys.setRetData("1");
    return;
}

//check主键是否重复
if(sql.query("select 1 from sys_page where pageid=?",[pageid])>0){
    sys.setRetData("2","pageid重复");
    return;
}

var dt = sys.currentTimeString();
var ins = "insert into sys_page (pageid,pagenm,page_path,status,createdt,updatedt) values (?,?,?,?,?,?)";
var params=[pageid,pagenm,page_path,"1",dt,dt];

sql.update(ins,params);

sys.setRetData("0");