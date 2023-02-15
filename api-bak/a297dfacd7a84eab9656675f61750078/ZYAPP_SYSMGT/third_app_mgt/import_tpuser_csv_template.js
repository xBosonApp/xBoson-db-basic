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
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
var name ="CSV上传模板-"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".csv";
var data = [{
    "userid":"平台用户ID",
    "uid":"第三方应用用户ID",
    "email":"邮箱",
    "tel":"手机号码"
}];
// 生成CSV文件
sys.listToCsv(path,name,"UTF-8",data);
// download，返回下载路径和文件名称
sys.addRetData([{"path":path,"name":name}],"result");
sys.setRetData("0","","result");