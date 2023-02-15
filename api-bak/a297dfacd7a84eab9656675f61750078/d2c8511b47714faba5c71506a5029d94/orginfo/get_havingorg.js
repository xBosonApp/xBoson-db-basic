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
//机构验证
var orgid=sys.request.orgid;
var orgnm = sys.request.de0810013j;
var f= sys.request.flag;

var str = "select de0810013j from mdm_org where de0810013j=? ";
var params = [orgnm];
if(f=="u"){
    str = str+" and orgid != ?";
    list.add(params,orgid);
}

if(0 < sql.query(str,params)) {
     sys.addRetData([{"count":"0"}],"result"); 
     sys.setRetData("0","机构名已经存在！","result");
     return;
}

sys.addRetData([{"count":"1"}],"result");
sys.setRetData("0","","result");