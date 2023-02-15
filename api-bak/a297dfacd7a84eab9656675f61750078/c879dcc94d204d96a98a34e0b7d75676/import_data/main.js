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
//main [导入数据，导入更新，导入删除]
//导入主接口
var operation = sys.request.operation;  //操作类型[insert,update,delete]
var type = sys.request.type;    //导入类型
var typecd = sys.request.typecd;    //数据集ID
var did = sys.request.did;  // 数据源ID
var en = sys.request.en;    //表名
var mapping = sys.request.mapping;  //数据列和表列的映射 {"column1":"data_col1","column2":"data_col2"}
var mappingObj = sys.instanceFromJson(mapping);
// var jsonData = sys.request.jsondata;    //json形式数据
if(type == null || did==null || en ==null|| mapping == null){
  sys.setRetData("1");
  return;
}

// 获取文件数据
var fileData = [];
// type1:CSV
if(type == "1"){
    // 分隔符（delimiter）
    // 引号符号（quoteChar）
    // 转义符号（escape）
    var hasHeader = sys.request.header;
    var delimiter = sys.request.delimiter;
    var quoteChar = sys.request.quoteChar;
    var escape = sys.request.escape;
    var file_name = sys.request.file_name;  //文件名
    var file_charset = sys.request.charset; //字符集
    
    if(delimiter == null || file_name == null || file_charset == null){
        sys.setRetData("1");
        return;
    }
    // 分隔符
    if(delimiter == "01"){
        delimiter = ",";
    }else if(delimiter == "02"){
        delimiter = "\t";
    }else if(delimiter == "03"){
        delimiter = ";";
    }
    // 引号符号
    if(quoteChar == "01"){
        quoteChar = "\"";
    }else if(quoteChar == "02"){
        quoteChar = "'";
    }
    // 解析CSV文件 10条
    //var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
    var path = ''; 
    fileData = sys.csvToList([path,file_name,file_charset],delimiter,quoteChar,escape,[],10);
    // 没有表头
    if(hasHeader == "0"){
        if(sys.size(fileData) == 0){
            sys.setRetData("2","CSV文件内容为空");
            return;
        }
        // 生成默认表头
        var defaultHeader = [];
        var _i = 1;
        for(r in fileData[0]){
            list.add(defaultHeader,"header"+_i);
            _i++;
        }
        fileData = sys.csvToList([path,file_name,file_charset],delimiter,quoteChar,escape,defaultHeader,0);
    }else{
        fileData = sys.csvToList([path,file_name,file_charset],delimiter,quoteChar,escape,[],0);
    }
}

// 导入更新，导入删除时，获取表列主键
var mk_col = [];
if(operation == "update" || operation == "delete"){
    var ret = http.platformGet({app:"c879dcc94d204d96a98a34e0b7d75676",mod:"mod",api:"getdscolumns"},{did:did,table_name:en,typecd:typecd});
    if(ret["data"].ret == "0"){
        for(r in ret["data"].result){
            if(r.mk == "1"){
                list.add(mk_col,r.en);
            }
        }
    }else{
        sys.printValue(ret);
        sys.setRetData("2");
        return;
    }
    if(sys.size(mk_col) == 0){
        sys.setRetData("2","表没有主键，不可导入更新或导入删除");
        return;
    }
}
// 生成SQL语句
var sql = "";
if(operation == "insert"){
    // insert语句
    sql = "insert into "+en+" (";
    var tmp1 = ""; //列
    var tmp2 = "";  //问号
    for(r in mappingObj){
      tmp1 = tmp1 + r.key + ",";
      tmp2 = tmp2 + "?,";
    }
    sql =sql + sys.subStringTo(tmp1,0,sys.length(tmp1)-1)+") values ("+sys.subStringTo(tmp2,0,sys.length(tmp2)-1)+")";
}else if(operation == "update"){
    sql = "update "+en+" set ";
    for(r in mappingObj){
        if(r.value != "[[NO_UPDATE]]"){
            sql = sql + r.key+"=?,";
        }
    }
    sql = sys.subStringTo(sql,0,sys.length(sql)-1) + " where 1=1 ";
    for(r in mappingObj){
        if(list.contain(mk_col,r.key)){
            sql = sql +" and "+ r.key+"=?";
        }
    }
}else if(operation == "delete"){
    sql = "delete from "+en+" where 1=1 ";
    for(r in mappingObj){
        if(list.contain(mk_col,r.key)){
            sql = sql +" and "+ r.key+"=?";
        }
    }
}
else{
    sys.setRetData("2","操作类型参数错误");
    return;
}

// 获取批量参数
var batchParams = []; //批量参数
if(operation == "insert" || operation == "delete"){
    for(r in fileData){
        var tmp = [];
        for(p in mappingObj){
            if(p.value == "[[Empty]]"){
                list.add(tmp,null);
            }else if(p.value == "[[UUID]]"){
                list.add(tmp,sys.uuid());
            }else if(p.value == "[[CURRENT_TIME]]"){
                list.add(tmp,sys.currentTimeString());
            }else{
                list.add(tmp,r[p.value]);
            }
        }
        list.add(batchParams,tmp);
    }
}else if(operation == "update"){
    for(r in fileData){
        var tmp = [];
        //更新列
        for(p in mappingObj){
            if(p.value != "[[NO_UPDATE]]"){
                if(p.value == "[[UUID]]"){
                    list.add(tmp,sys.uuid());
                }else if(p.value == "[[CURRENT_TIME]]"){
                    list.add(tmp,sys.currentTimeString());
                }else{
                    list.add(tmp,r[p.value]);
                }
            }
        }
        //主键
        for(p in mappingObj){
            if(list.contain(mk_col,p.key)){
                list.add(tmp,r[p.value]);
            }
        }
        list.add(batchParams,tmp);
    }
}

// 执行SQL
// catch异常，并返回
if(did != "00000000000000000000000000000000"){
    sql.connection(did);
}
var count = sql.updateBatch(sql, batchParams);
sys.addRetData(count, "count");
sys.setRetData("0", "", "count");