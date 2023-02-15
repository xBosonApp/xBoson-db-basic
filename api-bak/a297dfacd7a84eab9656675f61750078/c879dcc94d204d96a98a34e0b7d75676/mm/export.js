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


  var typecds = [typecd];
  var tmp_data=[];
  var tmp_sqls="";
  var end_flag = false;
  var tmp_typecd = list.toString(typecds,",");
  while(!end_flag){
    var _types = [];
    tmp_sqls = "select typecd from sys_md_mm001 where parentcd in ('"+tmp_typecd+"')";
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
  
if(sys.startWith(typecd,"DE")){
  //DE sys_mdm003
  var sqls = "select typecd ,decd,en,cn,datatype,numrange,format ,unit ,dict ,status ,mark ,createdt,updatedt,isstd ,version from sys_mdm003";
  sqls = sqls + (typesstr!=""?" where typecd in('"+typesstr+"')": "");
  sql.query(sqls,[],"data");  
  results = sys.result.data;
  //字典翻转
  var statusArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0001');
  var datatypeArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0041');
  var formatArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0042');
  var unitArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0043');
  var isstdArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0045');
  
  for(r in results){
    for(statusD in statusArr){
      if(r.status==statusD.id){
          map.put(r,"statusnm",statusD.name);
      }
    }
    for(isstd in isstdArr){
      if(r.standard==isstd.id){
          map.put(r,"isstdnm",isstd.name);
      }
    }
    for(datatype in datatypeArr){
      if(r.datatype==datatype.id){
          map.put(r,"datatypenm",datatype.name);
      }
    }
    for(format in formatArr){
      if(r.format==format.id){
          map.put(r,"formatnm",format.name);
      }
    }
    for(unit in unitArr){
      if(r.unit==unit.id){
          map.put(r,"unitnm",unit.name);
      }
    }
  }
  //title
  sql.query("select 'typecd ,decd,en,cn,datatype,numrange,format ,unit ,dict ,status ,mark ,createdt,updatedt,isstd ,version,statusnm,isstdnm,datatypenm,formatnm,unitnm'",null,"title");
} else {
  //DS
  var sqls = "select typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt,elemtype,version from sys_md_mm002 ";
  sqls = sqls + (typesstr!=""?" where typecd in('"+typesstr+"')": "");
  sql.query(sqls,[],"data");  
  results = sys.result.data;
  //字典翻转
  var statusArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0001');
  var sfArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0045');
  var elemtypeArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0060');
  
  for(r in results){
    for(statusD in statusArr){
      if(r.status==statusD.id){
          map.put(r,"statusnm",statusD.name);
      }
    }
    for(mk in sfArr){
      if(r.mk==mk.id){
          map.put(r,"mknm",mk.name);
      }
    }
    for(must in sfArr){
      if(r.must==must.id){
          map.put(r,"mustnm",must.name);
      }
    }
    for(elemtype in elemtypeArr){
      if(r.elemtype==elemtype.id){
          map.put(r,"elemtypenm",elemtype.name);
      }
    }
  }
  //title
  sql.query("select 'typecd,decd,en,cn,mk,must,dv,sorting,status,mark,createdt,updatedt,elemtype,version,statusnm,mknm,mustnm,elemtypenm'",null,"title");
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