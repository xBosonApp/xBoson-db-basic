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
//id:getviewmodalupd
//name:同步视图模型定义
var typecd=sys.request.typecd;
if(typecd==null){
    sys.setRetData("1");
    return;
}

var getinfo="select typecd,did,table_json,editingtype,jsondata_select,fromcontent,jsondata_where,sel_whe_columns,sqltext,typecontent,status,mark,createdt,updatedt,onlychart from sys_bm003 where typecd=? and status='1'";

sql.query(getinfo,[typecd]);

sys.setRetData("0","","result");