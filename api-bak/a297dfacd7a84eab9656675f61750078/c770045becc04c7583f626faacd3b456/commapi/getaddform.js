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
//id:getaddform
//name:获取添加模态信息
var typecd=sys.request.typecd;  //数据集模型ID
if(typecd==null){
    sys.setRetData("1");
    return;
}
// "en": "en4",
// "cn": "统计C",
// "view": "是否显示:1",
// "ro": "是否只读:1",
// "must": "是否必须输入(sys_md_mm002):1",
// "search": "是否检索条件:1",
// "elemtype": "元素标签类型",
// "datatype": "数据类型",
// "numrange": "数据长度",
// "format": "显示格式",
// "unit": "单位",
// "dict": "字典类别(typecd)",
// "chart": "pie"
var getType="select a.en,a.cn,'0' ro,a.must,a.elemtype,b.datatype,b.numrange,b.format,b.unit,b.dict from sys_md_mm002 a,sys_mdm003 b where a.typecd=? and a.decd=b.decd and a.status='1' and b.status='1'";
sql.query(getType,[typecd],"type");
var typeList = sys.result.type;
for(r in typeList){
     map.put(r,"view","1");
}
sys.setRetData("0","","type");