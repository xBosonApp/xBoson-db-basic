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
//name:同步模型分类
//id:settreeupd

var typecd = sys.request.typecd;

if(typecd == null){
    sys.setRetData("1");
    return;
}

var sqlSel = "select typecd, parentcd, typenm, shortkey, standard, datatable, version, status,mark,createdt,updatedt from sys_md_mm001 where typecd =?";

var cnt = sql.query(sqlSel,[typecd]);

if(cnt == 1){
    //增加返回目录字段
    // var result=sys.result.result;
    // for(r in result){
    //     if(sys.trim(r.datatable) == ""){
    //         map.put(r,"catalog","1");
    //     }else{
    //         map.put(r,"catalog","0");
    //     }
    // }
    sys.setRetData("0","","result");
    return;
}else{
    sys.setRetData("2");
}