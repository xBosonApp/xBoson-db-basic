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
var type = sys.request.type;    //导出类型
var charset = sys.request.charset;  //字符集

var tp_appid = sys.request.tp_appid;  //第三方应用id

if(type == null || tp_appid == null){
    sys.setRetData("1");
    return;
}
// 获取要导出的表数据
var getData = "select b.userid,a.uid from sys_pl_tp_app_uid a, sys_userinfo b where a.tp_appid=? and a.pid=b.pid";
sql.query(getData,[tp_appid],"res");
var res = sys.result.res;

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