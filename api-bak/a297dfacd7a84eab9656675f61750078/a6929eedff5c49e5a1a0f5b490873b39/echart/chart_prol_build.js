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
var chartdata = sys.request.chartdata,
filenm = sys.request.filenm,
condition=sys.request.condition,
colcount=sys.request.colcount,
rowcount=sys.request.rowcount,
org =sys.request.org,
pid=sys.getUserPID(sys.request.openid);
  if(null == chartdata || null== condition || null==colcount || null==rowcount){
  	sys.setRetData("1");
   	return;
   }
   
        //拼下载路径
  var download_path="report/";
  //模板路径
  var tem_path="chart/"+pid+"/";
  var filenm_down=sys.convertCsvToXls(filenm,chartdata,tem_path,download_path,condition,colcount,rowcount);
  sys.addRetData([{"name":filenm_down,"path":download_path}],"result");
  sys.setRetData("0","","result");