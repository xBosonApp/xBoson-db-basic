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
//id: getindexslist
//name: 获取索引一览

var typecd = sys.request.typecd;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;

if(typecd == null){
    sys.setRetData("1");
    return;
}

var selSql = "select typecd, en, cn, fields, sort, status, mark, createdt, updatedt from sys_md_mm004 where typecd = ?";

if(pagesize == null){
    pagesize = 10;
}
if(pagenum == null){
    pagenum = 1;
}
sql.queryPaging(selSql,[typecd], pagenum, pagesize);

sys.setRetData("0","","result");