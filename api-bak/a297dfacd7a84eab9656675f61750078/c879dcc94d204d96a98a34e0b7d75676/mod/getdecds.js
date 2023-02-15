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
//数据元目录tree

var res=http.platformGet({
    "app":"c879dcc94d204d96a98a34e0b7d75676",
    "mod":"outdatasource",
    "api":"getdedstree"
},null);
if(res.data.ret!="0"){
    sys.setRetData(res.data.ret,res.data.msg);
    return;
}

var de=[];
for(r in res.data.result0){
    list.add(de,{
        "id":r.typecd,
        "pid":r.parentcd,
        "name":r.typenm,
        "text":r.typecd+r.typenm,
        "disabled":true
    });
}

//数据元编码
sql.query("select typecd,decd,status,en,cn,version from sys_mdm003",null,"decds");
for(r in sys.result.decds){
    map.put(r,"id",r.decd);
    map.put(r,"pid",r.typecd);
    map.put(r,"name",r.decd+"("+r.cn+"-"+r.en+")");
    map.put(r,"text",r.cn+"("+r.en+")"+r.decd);
    map.put(r,"version",r.version);
    if(r.status!="1"){
        map.put(r,"disabled",true);
    }
}
list.addAll(de,sys.result.decds);
var de2=sys.transformTreeData(de,"id","pid","children");

sys.addRetData(de2,"result");
sys.setRetData("0","","result");