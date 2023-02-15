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
// copy from auth/role_model/getrolemodeltree
var sql1="select typecd,parentcd,typenm from sys_bm001";

var sql2=http.platformGet({app:'c879dcc94d204d96a98a34e0b7d75676',mod:'outdatasource',api:'getdedstree'});

var result=sql2["data"].result1;

var arr=[];
for(i in result){
    if(i.typecd=='DS')
    continue;
    if(i.parentcd=='DS')
    map.put(i,'parentcd','BM.DMLM');
    list.add(arr,i);
    
}
var sql3="select modolcd typecd,modolnm typenm,dstypecd parentcd, '1' as ismodel from sys_bm002";

sql.query(sql1,[],'data');
sql.query(sql3,[],'data2');

var array=[];
for(n in arr){
    list.add(array,n);
}
for(v in sys.result.data){
    if(v.typecd=='BM')
    continue;
    list.add(array,v);
}
for(v in sys.result.data2){
    list.add(array,v);
}

// 过滤array
// 获取视图模型ID，维度模型ID
sql.query("select a.typecd,b.parentcd,b.typenm,'1' as ismodel from sys_bm003 a,sys_bm001 b where a.status='1' and a.typecd=b.typecd",null,"bm003");
sql.query("select a.typecd,b.parentcd,b.typenm,'1' as ismodel from sys_bm004 a,sys_bm001 b where a.status='1' and a.typecd=b.typecd",null,"bm004");
var tmpArr = [];
list.addAll(tmpArr,sys.result.bm003);
list.addAll(tmpArr,sys.result.bm004);
list.addAll(tmpArr,sys.result.data2);
array = sys.getRelatedTreeData(array,tmpArr,"typecd","parentcd");
sys.addRetData(array,"result");
sys.setRetData("0","","result");