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
var orgid=sys.request.org;
var sql_p_app="select a.applicationid id,a.applicationnm name,a.applicationnm text from sys_pl_application_release a, sys_pl_biz_application b where a.applicationid=b.applicationid and a.orgid=? and a.status='1'";
var param_p_app=[orgid];
sql.query(sql_p_app,param_p_app);
sys.setRetData("0","","result");