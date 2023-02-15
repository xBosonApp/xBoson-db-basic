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
//id:updatetableupt
//name:根据模型同步物理表

var typecd = sys.request.typecd;
var did = sys.request.did;
var en = sys.request.en;

//验证参数
if(typecd == null || did == null || en == null){
    sys.setRetData("1");
    return;
}

var selSql = "select typecd,did,en,cn,status,mark,createdt,updatedt from sys_md_mm003 where typecd=? and did=? and en=?";

sql.query(selSql,[typecd,did,en]);

sys.setRetData("0","","result");