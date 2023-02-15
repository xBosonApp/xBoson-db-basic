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
var typecd = sys.request.typecd;    //数据集ID
if(typecd==null){
    sys.setRetData("1");
    return;
}
var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
var name ="CSV上传模板-"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".csv";
var data = [], example_data={};
var ret = http.platformGet({app:"c879dcc94d204d96a98a34e0b7d75676",mod:"mod",api:"getdscolumns"},{did:"",table_name:"",typecd:typecd});
if(ret["data"].ret == "0"){
    sys.printValue(ret["data"].result);
    for(r in ret["data"].result){
        var key = r.en;
        var value = r.cn+"("+r.datatype+"("+r.numrange+")";
        if(r.must=="1"){
            value=value+"必填)";
        }else{
            value=value+")";
        }
        map.put(example_data,key,value);
    }
    list.add(data,example_data);
}else{
    sys.printValue(ret);
    sys.setRetData("2");
    return;
}
sys.printValue(data);
// 生成CSV文件
sys.listToCsv(path,name,"UTF-8",data);
// download，返回下载路径和文件名称
sys.addRetData([{"path":path,"name":name}],"result");
sys.setRetData("0","","result");