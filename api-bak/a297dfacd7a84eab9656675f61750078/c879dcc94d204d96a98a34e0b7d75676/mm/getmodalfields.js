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
//id:getmodalfields
//name:模型字段获取

var typecd = sys.request.typecd;

if(typecd == null){
    sys.setRetData("1");
    return;
}

//获取模型字段
var getModelFields = "select en,cn,sorting from sys_md_mm002 where typecd=? and status='1' order by sorting";
sql.query(getModelFields,[typecd]);

sys.setRetData("0","","result");