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
//id: columnselect2
//name: 列名下拉菜单
var typecd = sys.request.typecd;

if(typecd == null){
    sys.setRetData("1");
    return;
}
var sqlSel = "select en,cn from sys_md_mm002 where typecd=? order by sorting";
var param = [typecd];

sql.query(sqlSel,param,"data");

var data = sys.result.data;

var tmp = [];
for(d in data){
    var tmpMap = {"id":d.en, "name":d.cn+"("+d.en+")", "text":d.en+"("+d.cn+")"};
    list.add(tmp, tmpMap);
}

sys.addRetData(tmp,"result");
sys.setRetData("0","","result");