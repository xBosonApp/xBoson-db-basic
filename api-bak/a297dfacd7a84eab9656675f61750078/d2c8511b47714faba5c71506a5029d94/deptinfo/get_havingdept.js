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
//部门验证

var deptnm = sys.request.deptnm;
var orgid = sys.request.orgid;
var _orgid = sys.request._orgid;
var flag = sys.request.flag;

if(0 < sql.query("select deptnm from mdm_dept where deptnm=? and orgid=?",[deptnm,orgid])) {
     if(flag == "u"){
         //如果是更新
         if(orgid == _orgid){
             //如果下拉选择的机构和铺数据时的机构一样
             sys.addRetData([{"count":"1"}],"result");
             sys.setRetData("0","","result");
             return;
         }
     }
     sys.addRetData([{"count":"0"}],"result"); 
     sys.setRetData("0","部门名已经存在！","result");
     return;
}
sys.addRetData([{"count":"1"}],"result");
sys.setRetData("0","","result");