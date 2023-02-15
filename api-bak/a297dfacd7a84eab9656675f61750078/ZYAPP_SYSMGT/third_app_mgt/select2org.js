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
//name:查询所属机构
//编写人：王莹莹
//测试url：
var status = sys.request.status;
var orgid = sys.request.org;
  //查询 sys_pl_tp_app 表
    var paramSel = [];
var sqlSel ="SELECT distinct a.orgid as id,o.de0810013j as name,o.de0810013j as text "+
    " from sys_pl_tp_app a left join mdm_org o on a.orgid = o.orgid and  o.status = '1'";
    var queryPagingCount = sql.query(sqlSel,paramSel,"result");
    sys.setRetData("0","","result");