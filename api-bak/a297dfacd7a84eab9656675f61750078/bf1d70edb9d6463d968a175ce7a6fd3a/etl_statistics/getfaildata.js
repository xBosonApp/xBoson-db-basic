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
var runningid = sys.request.runningid;  //单次运行ID
var data_row = sys.request.data_row;    //原始数据行号

if(runningid==null || data_row==null){
    sys.setRetData("1");
    return;
}

var sql="select log_data from sys_pl_log_etl_statistics_data where runningid=? and data_row=?";
sql.query(sql,[runningid,data_row],"data");

sys.setRetData("0","","data");