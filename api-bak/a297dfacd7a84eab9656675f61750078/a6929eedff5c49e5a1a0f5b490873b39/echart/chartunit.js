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
var pid = sys.getUserPID(sys.request.openid),
    modtype = sys.request.modtype,
    modnm = sys.request.modnm,
    res = [];
    if(null!=modtype && null!=modnm){
        sql.query(" select count(1) ct from sys_mod_kpi where pid=? and modtype=? and modnm=? ",[pid,modtype,modnm],"counts");
    res = [{"pid":pid,upflag:"0"==sys.result.counts[0].ct}];
    } else { res = [{"pid":pid,"upflag":false}]; }
    sys.addRetData(res, "res");																							
    sys.setRetData("0","","res");