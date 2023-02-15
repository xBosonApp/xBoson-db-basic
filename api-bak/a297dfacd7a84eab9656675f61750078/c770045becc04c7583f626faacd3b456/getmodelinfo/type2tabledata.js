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
//id:type2tableinfo
//name:从模型type获取表信息(即查询模型的type)

var typecd = sys.request.typecd;

if(typecd == null){
    sys.setRetData("1");
    return;
}

//获取模型返回type字段信息
//sys_bm003表
var getType="select a.editingtype,a.sqltext,a.jsondata_where,a.sel_whe_columns,a.typecontent,a.table_json,(select filenm from sys_template where fileid=a.fileid) filenm from sys_bm003 a where a.typecd=? and a.status='1'";
var cnt=sql.query(getType,[typecd],"result");
//sys_bm004表
if(cnt==0){
    getType="select a.typecontent,a.table_json,(select filenm from sys_template where fileid=a.fileid) filenm from sys_bm004 a where a.typecd=? and a.status='1'";
    cnt=sql.query(getType,[typecd],"result");
    if(cnt==0){
        sys.setRetData("2");
        return;
    }
}

var typecontent = sys.result.result[0].typecontent;
var table_json = sys.result.result[0].table_json;

var typecontentObj=sys.instanceFromJson(typecontent);
var table_jsonObj=sys.instanceFromJson(table_json);
// 列英文名	列中文名	是否必填	元素标签类型	数据类型	数据长度	显示格式	单位	数据字典

sys.addRetData(typecontentObj.type,"type");
sys.addRetData(typecontentObj.search,"search");
sys.addRetData(table_jsonObj,"table_json");
sys.setRetData("0","","type","search","table_json","result");