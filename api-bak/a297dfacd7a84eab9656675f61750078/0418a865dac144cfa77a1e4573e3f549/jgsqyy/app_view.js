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
//wangyingying
var orgid = sys.request.org_id;
var sqls ="SELECT case a.status when '1' then 'false' else 'true' end as disabled ,a.applicationid,a.applicationnm,a.p_applicationid,CASE WHEN a.applicationid IN (SELECT DISTINCT applicationid FROM sys_pl_org_application WHERE orgid=? ) THEN 'true' ELSE 'false' END AS checked FROM sys_pl_application_release a ,sys_pl_biz_application b WHERE biz_status='20' AND a.applicationid=b.applicationid ";


sql.query(sqls,[orgid],"result");
sys.setRetData("0","","result");