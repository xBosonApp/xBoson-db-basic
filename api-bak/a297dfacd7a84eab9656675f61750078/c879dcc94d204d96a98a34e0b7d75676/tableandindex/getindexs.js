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
// id: getindexs
//name: 获取指定模型的索引

var typecd = sys.request.typecd;
//查询条件
var en = sys.request.en;
var cn = sys.request.cn;
var fields = sys.request.fields;
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
if(typecd == null){
    sys.setRetData("1","缺少typecd参数");
    return;
}

var getindex = "select en, cn, fields, sort, status, mark, createdt, updatedt from sys_md_mm004 where typecd=?";

var params = [typecd];

if(en != null){
    getindex = getindex + " and en like ?";
    list.add(params, "%"+en+"%");
}

if(cn != null){
    getindex = getindex + " and cn like ?";
    list.add(params, "%"+cn+"%");
}
if(fields != null){
    getindex = getindex + " and fields like ?";
    list.add(params, "%"+fields+"%");
}
if(pagesize == null){
    pagesize = 10;
}
if(pagenum == null){
    pagenum = 1;
}
sql.queryPaging(getindex,params, pagenum, pagesize);
// sql.query(getindex, params);

sys.setRetData("0","","result");