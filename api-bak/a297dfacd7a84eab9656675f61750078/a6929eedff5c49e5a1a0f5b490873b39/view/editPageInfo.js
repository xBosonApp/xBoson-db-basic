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
var typenm  = sys.request.typenm;
var parentcd = sys.request.parentcd;

if(typenm==null){
  sys.setRetData("1","名称不能为空！");
  return;
}

if(parentcd==null){
  sys.setRetData("1","上级目录不能为空！");
  return;
}
//生成快捷码
var shortkey=sys.getPinyinFirstLetter(typenm);

var dt = sys.currentTimeString();

var sql = " update sys_bi_page_info set typenm=? ,typecd=?,updatedt=?,shortkey=? where pageid=?";

var params = [typenm,parentcd,dt,shortkey,pageid];
 
sql.update(sql,params);

sys.setRetData("0","");