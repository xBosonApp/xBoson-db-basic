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
//查询图形分类树
var sqls = " select typecd id,typenm name,parentcd,'' modid,'' jsondata,'0' ischart from sys_bi_tree_info "
+" where treetype='0' " + " union select modid id,modnm name,modtype parentcd,modid,jsondata,'1' ischart "
+" FROM sys_mod_kpi ";

sql.query(sqls,[],"data");
sys.setRetData("0","","data");