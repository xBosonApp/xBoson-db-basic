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
//id:deletetable
//name:根据业务模型删除表

var typecd=sys.request.typecd;  //业务模型ID
var dsdir=sys.request.dsdir;
var did=sys.request.did;
var en=sys.request.en;

if(typecd==null||dsdir==null||did==null||en==null){
    sys.setRetData("1");
    return;
}

//查看视图下面的维度是否设置了数据来源为视图物理表
//获取typecd下所有子节点的typecd数组
var typecdArray=[];
var tmpSql="select typecd from sys_bm001 where parentcd in (?) and status='1'";
var tmpCnt=sql.query(sys.replace(tmpSql,"?","'"+typecd+"'"),[],"typecds_r");
while(tmpCnt>0){
    var tmpTypecds="";
    for(r in sys.result.typecds_r){
        list.add(typecdArray,r.typecd);
        tmpTypecds=tmpTypecds+",'"+r.typecd+"'";
    }
    tmpTypecds=sys.subString(tmpTypecds,1);
    tmpCnt=sql.query(sys.replace(tmpSql,"?",tmpTypecds),[],"typecds_r");
}
//查看这些子节点是否是维度定义
if(sys.size(typecdArray)>0){
    var typecds="";
    for(r in typecdArray){
        typecds=typecds+",'"+r+"'";
    }
    typecds=sys.subString(typecds,1);
    sql.query("select typecd,tablesource from sys_bm004 where typecd in ("+typecds+") and status='1'",[],"tablesource_r");
    if(sys.size(sys.result.tablesource_r)>0){
        var isfind=false;
        for(r in sys.result.tablesource_r){
            if(r.tablesource!=""){
                isfind=true;
                break;
            }
        }
        if(isfind){
            sys.setRetData("2","维度定义中使用了此物理表，不可删除！");
            return;
        }
    }
}


//调接口删除表
var msg=http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"tableandindex","api":"deletetable"},{"typecd":dsdir,"did":did,"en":en});
if(msg.data.ret!="0"){
    sys.setRetData(msg.data.ret,msg.data.msg);
    return;
}

//清空业务模型table_json字段
var sql_bm003="update sys_bm003 set table_json=? where typecd=?";
var cnt=sql.update(sql_bm003,[null,typecd]);
if(cnt==0){
    //如果sys_bm003没有此记录，则从sys_bm004删除
    var sql_bm004="update sys_bm004 set table_json=? where typecd=?";
    cnt=sql.update(sql_bm004,[null,typecd]);
    if(cnt==0){
        sys.setRetData("2","删除异常！");
        return;
    }
}
// 更新缓存
var ModelCache = se.getCache(_CACHE_REGION_BIZ_MODEL_,typecd);
map.put(ModelCache,"table_json","");
se.setCache(_CACHE_REGION_BIZ_MODEL_,typecd,ModelCache,0);
sys.setRetData("0");