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

//id:getconfiglist
//获取平台应用一览


var config_key=sys.request.config_key;
var config_value=sys.request.config_value;
var config_desc=sys.request.config_desc;
var status=sys.request.status;
var pagenum=sys.request.pagenum;
var pagesize = sys.request.pagesize;
var pNDefualt = 1;
var PSDefualt =10;

var sqlPaging="select config_key,config_value,config_desc,status from sys_config where 1 = 1 ";
var paramSel=[];
if(config_key!=null){
    sqlPaging = sqlPaging + " AND config_key LIKE ?";
    @paramSel.add("%"+config_key+"%");
}
if(config_value!=null){
    sqlPaging = sqlPaging+ "AND config_value LIKE ?";
    @paramSel.add("%"+config_value+"%");
}
if(config_desc!=null){
    sqlPaging = sqlPaging + "AND config_desc LIKE ?";
    @paramSel.add("%"+config_desc+"%");
}
if(status!=null){
    sqlPaging = sqlPaging + "AND status LIKE ?";
    @paramSel.add(status);
}
if (pagenum==null) {
    pagenum = pNDefualt;
}
if (pagesize == null) {
    pagesize = PSDefualt;
}

sql.queryPaging(sqlPaging,paramSel,pagenum,pagesize);
sys.setRetData("0","","result");