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
//id:sortmodaldata
//name:对数据集模型进行排序

var typecd = sys.request.typecd;
var fields = sys.request.fields;

if(typecd == null || fields == null){
    sys.setRetData("1");
    return;
}

var fields_arr = sys.split(fields,",");

var updSort = "update sys_md_mm002 set sorting=? where typecd=? and en=? and status='1'";

var i=0;
for(r in fields_arr){
    //判断r不为空
    if(sys.trim(r) == ""){
        sys.setRetData("2","fields参数错误");
        sql.rollback();
        return;
    }
    sql.update(updSort,[i,typecd,r],"1");
    i=i+1;
}

sql.commit();

//操作数据集日志
http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});
sys.setRetData("0");