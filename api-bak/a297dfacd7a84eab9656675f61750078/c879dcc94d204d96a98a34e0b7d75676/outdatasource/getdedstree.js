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
//id:getdedstree
//name:获取数据元数据集tree

var gettree = "select typecd,parentcd,typenm,shortkey,standard,datatable,version,status,mark,typenm shownm from sys_md_mm001";

sql.query(gettree,[],"data");

var data = sys.result.data;
var result0 = [];   //数据元tree
var result1 = [];   //数据集tree

//耗时
var tmpms=date.currentTimeMillis();
var tmpMap={};  //typecd,parentcd映射
for(r in data){
    map.put(tmpMap,r.typecd,r.parentcd);
}
for(r in data){
    map.put(r,"click",false);
    var _typecd=r.typecd;
    var _typecd_nocase=sys.toLowerCase(r.typecd);
    while(true){
        if(_typecd_nocase=="de"){
            list.add(result0,r);
            break;
        }else if(_typecd_nocase=="ds"){
            list.add(result1,r);
            break;
        }
        _typecd=tmpMap[_typecd];
        _typecd_nocase=sys.toLowerCase(_typecd);
    }
}
tmpms=date.currentTimeMillis()-tmpms;

sys.addRetData(tmpms,"tmpms");
sys.addRetData(result0,"result0");
sys.addRetData(result1,"result1");
sys.setRetData("0","","result0","result1","tmpms");