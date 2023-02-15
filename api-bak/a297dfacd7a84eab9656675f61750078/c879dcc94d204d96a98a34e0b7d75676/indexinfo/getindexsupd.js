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
//id:getindexsupd
//name:同步索引信息

var typecd=sys.request.typecd;
var en=sys.request.en;

if(typecd == null || en==null){
    sys.setRetData("1");
    return;
}

var getIndex = "select typecd,en,cn,fields,status,mark from sys_md_mm004 where typecd=? and en=?";

sql.query(getIndex,[typecd,en],"result");

var data = sys.result.result;
//将fields拆分成数组

for(r in data){
    //判断fields字段不为空
    if(sys.trim(r.fields) == ""){
        sys.setRetData("2","表字段物理名称为空！");
        return;
    }
    var fields_arr = [];
    var _arr = sys.split(r.fields,",");
    for(a in _arr){
        var _arr_in = sys.split(a," ");
        if(sys.size(_arr_in) != 2){
            sys.setRetData("2","表字段物理名称有误！");
            return;
        }
        var _tmp_map = {"column":_arr_in[0], "collation":_arr_in[1]};
        list.add(fields_arr,_tmp_map);
    }
    map.put(r,"fields_arr",fields_arr);
}
sys.setRetData("0","","result");