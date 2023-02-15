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
//数据元数据集tree
var sql="select typecd,parentcd,typenm,shortkey,standard,url,datatable,version,status,mark,createdt,updatedt from sys_md_mm001";
sql.query(sql,null,"dedstree_r");

//操纵模型
var sqlbm002="select modolcd typecd,modolnm typenm,dstypecd parentcd,did,tablenm,sqltype,sqltext,sqlparams,jsondata,typecontent,status,mark,createdt,updatedt from sys_bm002";
sql.query(sqlbm002,null,"bm002_r");

//业务模型tree
var sqlbm001="select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark,createdt,updatedt from sys_bm001 where typecd != 'BM'";
sql.query(sqlbm001,null,"bm001_r");
//添加sqltype,isbm001
for(r in sys.result.bm001_r){
    if(r.datatable=="sys_bm003"){
        map.put(r,"sqltype","S-view");
    }else if(r.datatable=="sys_bm004"){
        map.put(r,"sqltype","S-dimension");
    }
    map.put(r,"isbm001","1");
}

//将数据元数据集tree中的数据集节点去掉，并把此节点下的子节点的parentcd指向操纵模型typecd
var dedstree=[];
for(r in sys.result.dedstree_r){
    if(r.typecd=="DS"){
        continue;
    }else if(r.parentcd=="DS"){
        map.put(r,"parentcd","BM.DMLM");
    }
    list.add(dedstree,r);
}

//将3个结果集合并
list.addAll(dedstree,sys.result.bm002_r);
list.addAll(dedstree,sys.result.bm001_r);

sys.addRetData(dedstree,"result");
sys.setRetData("0","","result");