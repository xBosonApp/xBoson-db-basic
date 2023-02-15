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
// 异步获取
var typecd=sys.request.typecd;

var sql="select a.typecd,a.parentcd,a.typenm,a.shortkey,a.standard,a.version,a.mark,a.status,a.createdt,a.updatedt,(select count(*) from sys_pl_cd1 b where b.parentcd=a.typecd) isparent from sys_pl_cd1 a where a.parentcd=?";
var params=[];
if(typecd==null){
    params=["0"];
}else{
    params=[typecd];
}
sql.query(sql,params);
//过滤
//1.isParent
//2.有效的结果集
var result2=[];
for(r in sys.result.result){
    if(r.isparent=="0"){
        map.put(r,"isParent",false);
    }else{
        map.put(r,"isParent",true);
    }
    if(r.status=="1"){
        list.add(result2,{
            "typecd":r.typecd,
            "parentcd":r.parentcd,
            "typenm":r.typenm,
            "shortkey":r.shortkey,
            "standard":r.standard,
            "version":r.version,
            "mark":r.mark,
            "isParent":r.isParent
        });
    }
}

sys.addRetData(result2,"result2");
sys.setRetData("0","","result","result2");