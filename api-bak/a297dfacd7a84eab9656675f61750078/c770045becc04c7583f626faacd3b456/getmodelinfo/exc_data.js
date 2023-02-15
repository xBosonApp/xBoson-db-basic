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
//id:exc_data
//name:查询模型数据

var typecd = sys.request.typecd;
var dataway = sys.request.dataway;  //1为查询sql语句取数据，2为查询物理表取数据
var flag = sys.request.flag;    //1为返回数据，2为导出数据到excel，3为导出数据到CSV文件

if(dataway==null || flag==null){
    sys.setRetData("1");
    return;
}

//获取模型在哪个表
var tbl="";
var table_json="",typecontent="";
var table_jsonObj=null,typecontentObj=null;
var table_en="";
var table_did="";
var sql1="select typecd,table_json,typecontent from sys_bm003 where typecd=?";
var sql2="select typecd,table_json,typecontent from sys_bm004 where typecd=?";
var cnt=sql.query(sql1,[typecd],"chk_r");
if(cnt>0){
    tbl="sys_bm003";
}else{
    cnt=sql.query(sql2,[typecd],"chk_r");
    if(cnt>0){
        tbl="sys_bm004";
    }else{
        sys.setRetData("2",typecd+"不存在");
        return;
    }
}
table_json=sys.result.chk_r[0].table_json;
if(sys.trim(table_json)!=""){
    table_jsonObj=sys.instanceFromJson(table_json);
    if(table_jsonObj!=null){
        table_en=table_jsonObj.en;
        table_did=table_jsonObj.did;
    }
}
typecontent=sys.result.chk_r[0].typecontent;
if(sys.trim(typecontent)!=""){
    typecontentObj=sys.instanceFromJson(typecontent);
}

// 获取请求中的参数
var params = {};
var tmp = JSON.stringify(sys.request);
var requestParams = JSON.parse(tmp).parm;
var requestParamsKeys = Object.keys(requestParams);
// sys.printValue(Object.keys(requestParams));
for(var i=0; i<requestParamsKeys.length; i++){
  var key = requestParamsKeys[i];
  params[key] = requestParams[key][0];
}


if(dataway=="1"){
  
    //调不同的查询接口
    // map.put(params,"modolcd",typecd);
    // map.put(params,"testflg","1");
    params.modolcd = typecd;
    params.testflg = 1;
    if(tbl=="sys_bm003"){
      // sys.printValue(tbl);
      // sys.setRetData("1");
      // return;
        var msg=http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"commapi","api":"exc_select"},params);
        if(msg.data.ret!="0"){
            sys.printValue(msg);
            sys.setRetData(msg.data.ret,msg.data.msg);
            return;
        }
        sys.addRetData(msg.data.type,"type");
        sys.addRetData(msg.data.data,"data");
        sys.addRetData(msg.data.search,"search");
        
    }else if(tbl=="sys_bm004"){
        var msg=http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"commapi","api":"exc_chart_select"},params);
        if(msg.data.ret!="0"){
            sys.printValue(msg);
            sys.setRetData(msg.data.ret,msg.data.msg);
            return;
        }
        sys.addRetData(msg.data.type,"type");
        sys.addRetData(msg.data.data,"data");
        sys.addRetData(msg.data.search,"search");
        
    }
}else if(dataway=="2"){
    //连接数据源
    var iscatch=false;
    try{
        if(table_did!="00000000000000000000000000000000"){
            sql.connection(table_did);
        }
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","连接数据源异常，请检查数据源配置！");
        return;
    }
    //执行SQL语句
    var select_sql="select * from "+table_en;
    sql.query(select_sql,null,"data");
    //恢复数据库连接
    sql.connection();
    sys.addRetData(typecontentObj.type,"type");
    sys.addRetData(typecontentObj.search,"search");
}else{
    sys.setRetData("2");
    return;
}



// 返回数据
if(flag=="1"){
    sys.setRetData("0","","type","data","search");
}
//下载数据(Excel)
else if(flag=="2"){
    //模板路径
    // var template_path=se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TEMPLATE");
    //获取模板路径,模板文件名
    var getfilenm="select filenm,file_dir from sys_template where fileid=(select fileid from sys_bm003 where typecd=? and status='1') or fileid=(select fileid from sys_bm004 where typecd=? and status='1')";
    cnt = sql.query(getfilenm,[typecd,typecd],"fileinfo_r");
    if(cnt==0){
        sys.setRetData("2","此模型无模板信息，请先上传模板！");
        return;
    }
    var temp_filenm=sys.result.fileinfo_r[0].filenm;
    var template_path=sys.result.fileinfo_r[0].file_dir;
    //下载路径
    var download_path=se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_REPORT");
    //导出数据
    //title
    var _title=[];
    var _map={};
    var _i=0;
    for(r in sys.result.type){
        map.put(_map, "col"+_i, r.cn+"（"+r.en+"）");
        _i=_i+1;
    }
    list.add(_title,_map);
    var filenm=sys.setReportData(temp_filenm,[_title,"data"],template_path,download_path);
    //下载excel
    sys.addRetData([{"name":filenm,"path":download_path}],"result");
    sys.setRetData("0","","result");
}
//下载数据(CSV)
else if(flag=="3"){
    var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
    var name = "csv-"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".csv";
    // 生成CSV文件
    sys.listToCsv(path,name,"UTF-8",sys.result.data);
    sys.addRetData([{"name":name,"path":path}],"result");
    sys.setRetData("0","","result");
}else{
    sys.setRetData("2");
    return;
}