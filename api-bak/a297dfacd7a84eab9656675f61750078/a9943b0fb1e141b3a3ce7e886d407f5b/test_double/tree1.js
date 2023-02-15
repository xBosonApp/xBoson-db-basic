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
var sqlAll = "select * from sys_mdm001 where status = '1' limit 100";
sql.query(sqlAll,[],"alldata");
var alldata = sys.result.alldata;

var sqldata = "select typecd,parentcd from sys_mdm001 where datatable ="+
  " 'sys_mdm002' and status = '1' limit 2";
sql.query(sqldata,[],"subdata");
var subdata = sys.result.subdata;


var result = sys.getRelatedTreeData(alldata,subdata,"typecd","parentcd");
sys.printValue(result);
sys.printValue(alldata);

sys.addRetData(result);
sys.addRetData(alldata, "all");
sys.addRetData(subdata, "sub");
sys.setRetData("0","","result", "all", "sub");