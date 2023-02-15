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
//模型类别表
var bm001="select a.typecd,a.parentcd,a.typenm,a.shortkey,(select count(*) from sys_bm003 where typecd=a.typecd) bm003,(select count(*) from sys_bm004 where typecd=a.typecd) bm004 from sys_bm001  a where a.typecd!='BM.DMLM' and a.typecd!='BM'";
var cnt=sql.query(bm001,null,"bm001R");
var bm001R=sys.result.bm001R;

for(r in bm001R){
    if(r.bm003=="0" && r.bm004=="0"){
        map.put(r,"disabled",true);
    }
    map.put(r,"id",r.typecd);
    map.put(r,"name",r.typenm);
    map.put(r,"text",r.typecd+r.typenm+r.shortkey);
}

//将result转成带children的树结构
var result=sys.transformTreeData(bm001R,"typecd","parentcd","children");

//返回数据
sys.addRetData(result,"result");
sys.setRetData("0","","result");