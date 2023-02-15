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
var keywords = sys.request.keywords;
var version = sys.request.version;
var status = sys.request.status;
var sqls = "select typecd id,typenm name,parentcd,0 ispage,'' url,status from sys_bi_tree_info where treetype=1";

sqls = sqls + " union all select pageid id,typenm name,typecd parentcd, 1 ispage,url,status from sys_bi_page_info";
  
sql.query(sqls,[],"data");

sys.setRetData("0","","data");