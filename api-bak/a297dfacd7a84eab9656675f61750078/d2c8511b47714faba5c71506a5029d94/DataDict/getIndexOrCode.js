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
//获取值域索引或代码
//刘峰源
    
var org = sys.request.org;
var typecd = sys.request.typecd; 
var down_type = sys.request.type;  //下载类型{1,2}
var charset = sys.request.charset;    //下载字符集
var isindex = sys.request.isindex;    //是否索引下载 0：不是 1：是 

var before_json={};
var after_json={};
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
var name = "";
var results;
if(typecd == null){
    sys.setRetData("1");
    return;
}	

if(typecd=="ROOT" && isindex!="0"){
  //值域索引
  //不返回根节点 防止错误修改导致异常
  var sqls = "select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark,createdt,updatedt from sys_mdm001 where typecd!='ROOT' ";
  sql.query(sqls,[],"data");
  results = sys.result.data;
  //字典翻转
  var statusArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0001');
  var standardArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0039');
  for(r in results){
    for(statusD in statusArr){
      if(r.status==statusD.id){
          map.put(r,"statusnm",statusD.name);
      }
    }
    for(standardD in standardArr){
      if(r.standard==standardD.id){
          map.put(r,"standardnm",standardD.name);
      }
    }
  }
  //title
  // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
  sql.query("select '类别编码(typecd)' typecd,'父类别编码(parentcd)' parentcd,'类别名称(typenm)' typenm,'快捷码(shortkey)' shortkey,'标准(standard)' standard,'数据库表(datatable)' datatable,'页面URL(url)' url,'版本(version)' version,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt,'状态名称(statusnm)' statusnm,'标准名称(standardnm)' standardnm",null,"title");
} else {
  //值域代码
  var typecds = [typecd];
  var tmp_data=[];
  var tmp_sqls="";
  var end_flag = false;
  var tmp_typecd = list.toString(typecds,",");
  while(!end_flag){
    var _types = [];
    tmp_sqls = "select typecd from sys_mdm001 where parentcd in ('"+tmp_typecd+"')";
    sql.query(tmp_sqls,[],"typecd");
    for(var d in sys.result.typecd){
      list.add(_types,d.typecd);
      list.add(typecds,d.typecd);
    }
    tmp_typecd = list.toString(_types,"','");
    if(sys.size(_types)==0){
      end_flag = true;
    }
  }
  
  var typesstr = list.toString(typecds,"','");
  var sqls = "select typecd,version,dictcd,dictnm,shortkey,status,mark,createdt,updatedt from sys_mdm002";
  sqls = sqls + (typesstr!=""?" where typecd in('"+typesstr+"')": "");
  sql.query(sqls,[],"data");  
  results = sys.result.data;
  //记录下载日志
  map.put(before_json,"down_type",down_type);
  map.put(before_json,"charset",charset);
  map.put(before_json,"count",sys.size(results));

  var log_res = http.platformPost({
    "app":"d2c8511b47714faba5c71506a5029d94",
    "mod":"operation_log",
    "api":"record_log"},
    {
      "typecd":typecd,
      "operation_type":"003",
      "before_json":sys.jsonFromInstance(before_json),
      "after_json":sys.jsonFromInstance(after_json)
    });
   
  //title
  // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
  sql.query("select '类别编码(typecd)' typecd,'版本(version)' version,'字典代码(dictcd)' dictcd,'字典名称(dictnm)' dictnm,'快捷码(shortkey)' shortkey,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt",null,"title");
}


// type1:CSV
if(down_type == "1"){
    name = "csv-"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".csv";
    // 生成CSV文件
    sys.listToCsv(path,name,charset,results);
    // download，返回下载路径和文件名称
    sys.addRetData([{"path":path,"name":name}],"result");
}
// type2:JSON
else if(down_type == "2"){
    var file_content = sys.jsonFromInstance(results);
    // download，返回下载内容和字符集
    sys.addRetData([{"file_content":file_content,"file_charset":charset}],"result");
}
// type3:Excel
else if(down_type == "3"){
    //模板路径
    var tmpPath = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TEMPLATE"); 
    //下载路径
    var dowPath = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_REPORT");
    //模板文件名
    var tmpName = "Default_empty_template.xlsx";
    //字典时为特定模板
    if(isindex!="0"){
        tmpName = "Default_Dict_template.xlsx";
    }
    var fileName = sys.setReportData(tmpName,["title","data"],tmpPath,dowPath);
    // download，返回下载路径和文件名称
    sys.addRetData([{"path":dowPath,"name":fileName}],"result");
}
else{
    sys.setRetData("2");
    return;
}
sys.setRetData("0","","result");