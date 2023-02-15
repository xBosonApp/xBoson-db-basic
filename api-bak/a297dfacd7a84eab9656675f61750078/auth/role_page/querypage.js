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
var pageid=sys.request.pageid;
var pagenm=sys.request.pagenm;
var page_path=sys.request.page_path;

var sel = "select pageid,pagenm,page_path,createdt,updatedt from sys_page where 1=1 ";
var params=[];
if(pageid!=null){
    sel = sel + " and pageid like ?";
    list.add(params,"%"+pageid+"%");
}
if(pagenm!=null){
    sel = sel + " and pagenm like ?";
    list.add(params,"%"+pagenm+"%");
}
if(page_path!=null){
    sel = sel + " and page_path like ?";
    list.add(params,"%"+page_path+"%");
}

sql.query(sel,params);

sys.setRetData("0","","result");