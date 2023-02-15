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
var typenm  = sys.request.typenm;
var parentcd = sys.request.parentcd;
var shortkey = sys.request.shortkey;
var status = 1;
var url = sys.request.url;
var mark = sys.request.mark;


if(typenm==null){
  sys.setRetData("1","名称不能为空！");
  return;
}

if(parentcd==null){
  sys.setRetData("1","上级目录不能为空！");
  return;
}
//生成快捷码
if(shortkey==null){
    shortkey=sys.getPinyinFirstLetter(typenm);
}
var pageid = sys.getUUID();
var dt = sys.currentTimeString();

var sql = " insert into sys_bi_page_info(pageid,typenm,typecd,url,shortkey,status,mark,createdt,updatedt) values(?,?,?,?,?,?,?,?,?) ";

var params = [pageid,typenm,parentcd,url,shortkey,status,mark,dt,dt];
 
sql.update(sql,params);

sys.setRetData("0","");