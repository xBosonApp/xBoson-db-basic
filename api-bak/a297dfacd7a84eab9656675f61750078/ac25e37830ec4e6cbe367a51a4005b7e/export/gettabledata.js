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
var en=sys.request.en;
var where=sys.request.where;
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;
if(en==null){
    sys.setRetData("1");
    return;
}
if(pagesize==null){
    pagesize=10;
}
if(pagenum==null){
    pagenum=1;
}

var sql="select * from "+en;
if(where != null){
    sql=sql+" where "+where;
}
sql.queryPaging(sql,null,pagenum,pagesize,"data");

//header
var type=[];
for(r in sys.result.data){
    for(r2 in r){
        list.add(type,{"en":r2.key,"cn":r2.key});
    }
    break;
}
sys.addRetData(type,"type");
sys.setRetData("0","","type","data");