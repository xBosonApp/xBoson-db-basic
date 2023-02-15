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
//id:getdstables
//name:获取数据集模型对应的物理表

var typecd=sys.request.typecd;  //数据集模型id
var did=sys.request.did;    //数据源ID

if(typecd==null || did==null){
    sys.setRetData("1");
    return;
}
var gettables="select en,cn from sys_md_mm003 where typecd=? and did=?";
sql.query(gettables,[typecd,did],"data");

var data=sys.result.data;

//返回select2数据结构
var result=[];
for(r in data){
    var tmp={"id":r.en,"name":r.cn+"["+r.en+"]","text":r.cn+"["+r.en+"]"};
    list.add(result,tmp);
}
//返回数据
sys.addRetData(result,"result");
sys.setRetData("0","","result");