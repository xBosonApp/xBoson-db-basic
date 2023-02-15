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
//id:getdatasourceupt
//同步数据源应用


var did=sys.request.did;

if(did==null){
    sys.setRetData("1");
    return;
}

var sqlQuery=`SELECT did,
    dn,
    owner,
    dbtype,
    en,
    cn,
    dhost,
    dport,
    url,
    user_name,
    '********' pass,
    flg,
    dbsize,
    tcount,
    mark,
    status,
    createdt,
    updatedt,
    prop,
    pool_enabled
FROM sys_pl_drm_ds001 where did=?`;

var paramQey=[did];
sql.query(sqlQuery,paramQey);
sys.setRetData("0","ok","result");