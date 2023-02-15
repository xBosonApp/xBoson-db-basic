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
/*
liufengyuan 
20150408
*/

var domain = sys.request.siteid;
if(domain==null){
    sys.setRetData("1");
    return;
}
var count=sql.query("select * from sys_pl_domain_info where domain_2=?",[domain]);
sys.addRetData([count],"result");
sys.setRetData("0","","result");