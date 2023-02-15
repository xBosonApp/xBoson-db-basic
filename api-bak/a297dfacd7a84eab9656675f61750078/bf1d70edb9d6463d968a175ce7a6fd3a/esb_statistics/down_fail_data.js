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
var dt=sys.request.dt;  //日期点
var dt_from=sys.request.dt_from;    //开始日期
var dt_to=sys.request.dt_to;    //结束日期
var instanceid=sys.request.instanceid;  //节点ID
var serviceid=sys.request.serviceid;    //服务ID

if(instanceid==null||serviceid==null){
    sys.setRetData("1");
    return;
}

// 调api获取错误记录数据
var res=http.platformGet({
    "app":"bf1d70edb9d6463d968a175ce7a6fd3a",
    "mod":"esb_statistics",
    "api":"faildetail"
},{"dt":dt,"dt_from":dt_from,"dt_to":dt_to,"instanceid":instanceid,"serviceid":serviceid});
sys.printValue(res["data"].data);
//生成CSV
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");
var reFile = sys.listToCsv(path,"log_info"+sys.currentTimeMillis()+".csv","UTF-8",res["data"].data);
var filenm = reFile[0];
// 返回文件路径和名称
sys.addRetData([{"path":path,"name":filenm}],"result");
sys.setRetData("0","","result");