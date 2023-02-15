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
// download接口
// 获取参数

var type = sys.request.type;    //导出类型
var charset = sys.request.charset;  //字符集

var did = sys.request.did;  //数据源ID
var en = sys.request.en;    //表名
var where = sys.request.where;  // where条件

if(type == null || did == null || en == null){
    sys.setRetData("1");
    return;
}
//判断where是否以order by 或group by开头
var isorderby=false,isgroupby=false,islimit=false;
{
    var lowerWhe=sys.toLowerCase(sys.trim(where));
    if(sys.regexFind("^order\\s+by\\s+",lowerWhe)){
        isorderby=true;
    }
    if(sys.regexFind("^group\\s+by\\s+",lowerWhe)){
        isgroupby=true;
    }
    if(sys.regexFind("^limit\\s+",lowerWhe)){
        islimit=true;
    }
}
// 获取要导出的表数据
var getData = "select * from "+en;
if(where != null && sys.trim(where) != ""){
    if(isorderby||isgroupby||islimit){
        getData = getData+" "+where;
    }else{
        getData = getData + " where "+where;
    }
}
if(did!="00000000000000000000000000000000"){
    sql.connection(did);
}
sql.query(getData,null,"res");
var res = sys.result.res;
//title
var MetaData = sql.metaData("select * from "+en+" where 1=2 ");
sys.printValue(MetaData);
var sqlTitle = "select ";
for(r in MetaData){
  // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
  sqlTitle = sqlTitle+"'"+r.ColumnLabel+"("+r.ColumnName+")' AS "+ r.ColumnName +",";
}
sqlTitle=sys.subStringTo(sqlTitle,0,sys.length(sqlTitle)-1);
sql.query(sqlTitle,null,"title");

var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
var name = "";
// type1:CSV
if(type == "1"){
    name = "csv-"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".csv";
    // 生成CSV文件
    sys.listToCsv(path,name,charset,res);
    // download，返回下载路径和文件名称
    sys.addRetData([{"path":path,"name":name}],"result");
    sys.setRetData("0","","result");
}
// type2:JSON
else if(type == "2"){
    var file_content = sys.jsonFromInstance(res);
    // download，返回下载内容和字符集
    sys.addRetData([{"file_content":file_content,"file_charset":charset}],"result");
    sys.setRetData("0","","result");
    return;
}
// type3:Excel
else if(type == "3"){
    //模板路径
    var tmpPath = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TEMPLATE"); 
    //下载路径
    var dowPath = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_REPORT");
    //模板文件名
    var tmpName = "Default_empty_template.xlsx";
    var fileName = sys.setReportData(tmpName,["title","res"],tmpPath,dowPath);
    // download，返回下载路径和文件名称
    sys.addRetData([{"path":dowPath,"name":fileName}],"result");
    sys.setRetData("0","","result");
}
else{
    sys.setRetData("2");
    return;
}