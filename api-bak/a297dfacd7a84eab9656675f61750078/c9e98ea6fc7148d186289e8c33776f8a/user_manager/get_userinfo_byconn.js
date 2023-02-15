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
var orgid=sys.result.org;
var tel=sys.result.tel;
var email=sys.result.email;

var q="";

if(tel==email) {
    sys.setRetData("1","请正确输入查询条件！"); return;
}

if(null!=tel) {q=tel;}
if(null!=email) {q=email;}

var count =sql.query("select pid id,de0201039 name from mdm_personal_info where (de0201010=? or de0201012=?) and pid not in(select distinct pid from sys_tenant_user where orgid=?) ", [q,q,orgid],"result");

sys.setRetData("0","","result");