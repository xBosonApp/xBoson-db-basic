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
"use strict";

var org = sys.request.org;
// var file_name = sys.request.file_name;
// 上传路径
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //临时目录
// var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TEMPLATE"); //Excel模板目录

// sys.printValue(JSON.stringify(sys.request));


// sys.printValue(sys.request.getString("header"));


if(path == null){
    sys.setRetData("1");
    return;
}

var hasHeader = sys.request.getString("header"); // 是否有表头
var delimiter = sys.request.getString("delimiter");   //分隔符（delimiter）
var quoteChar = sys.request.getString("quoteChar");   // 引号符号（quoteChar）
var escape = sys.request.escape;                      // 转义符号（escape）
var charset = sys.request.getString("charset");       //字符集

if(!hasHeader){
  sys.setRetData("1","csv文件没有表头");
  return;
}

// 分隔符
var delimiterMap = { "01": ",", "02": "\t", "03": ";" };
var quoteCharMap = {"01": "\"", "02": "'"};
delimiter = delimiterMap[delimiter];
quoteChar = quoteCharMap[quoteChar];

var file_name = "";
sys.request.multipart(function(item){
  sys.printValue(item.header);
  // 文件名称, 如果是文件才有这个参数
  if(item.header.filename){
    file_name = item.header.filename;
    // 获取文件内容
    var content = item.readString(charset);
    var arr = sys.csvToList(content,delimiter,quoteChar,escape,[],0);
    // 文件存到指定目录
    sys.listToCsv(path,file_name,charset,arr);
  }
  
});


if(!file_name){
  sys.setRetData("1","没有csv文件");
  return;
}


  
// sys.printValue(hasHeader, delimiter, quoteChar, escape, charset);
// sys.setRetData("1");
// return;


// 上传文件名
// var name = "";
// // 重命名
// if(sys.contain(file_name,".")){
//     name = sys.replace(file_name,".","_"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".");
// }else{
//     name = file_name + "_"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS");
// }

// 将上传文件记录到表里
var dt = sys.currentTimeString();
var sql = "insert into sys_template (fileid,filenm,file_dir,orgid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
var paras = [sys.uuid(),file_name,path,org,"1",dt,dt];
sql.update(sql,paras);

// 返回文件名，路径
sys.addRetData([{"path":path,"name":file_name}],"result");
sys.setRetData("0","","result");