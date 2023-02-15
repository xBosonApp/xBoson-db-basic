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
var typecd=sys.request.typecd;
if(typecd==null){
    sys.setRetData("1");
    return;
}

var gettable = "select datatable from sys_md_mm001 where typecd=?";

var cnt = sql.query(gettable, [typecd], "result");

var result = sys.result.result;
//判断datatable是否为空
var datatable="";
if(cnt == 0 ){
    //如果不是根节点则返回code2
      if(typecd != "0"){
          sys.setRetData("2");
          return;
      }
}else{
     datatable = result[0].datatable;
}
// if(sys.trim(datatable)==""){
//     sys.setRetData("1","没有表信息！");
//     return;
// }

var type=[];
if(sys.trim(datatable)==""){
    type=[
        {			
            "en": "s_typecd",			
            "cn": "类别编码",			
            "view": "1",	
            "ro": "0",
            "must": "1",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""				
        },
        {			
            "en": "typenm",			
            "cn": "类别名称",			
            "view": "1",	
            "ro": "0",
            "must": "1",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""				
        },
        {	
            "en": "status",			
            "cn": "状态",			
            "view": "1",
            "ro": "0",
            "must": "1",
            "elemtype": "select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0001",			
            "unit": "",			
            "format": "",	
            "chart": ""		
        }
    ];
}
if(datatable =="sys_mdm003"){
    type=[		
        {			
            "en": "decd",			
            "cn": "数据元编码",			
            "view": "true",
            "ro": "0",
            "elemtype":"text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",	
            "chart": ""			
        },			
        {			
            "en": "en",			
            "cn": "英文名称",			
            "view": "true",
            "ro": "0",
            "elemtype":"text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",	
            "chart": ""			
        },			
        {			
            "en": "cn",			
            "cn": "中文名称",			
            "view": "true",	
            "ro": "0",
            "datatype": "VARCHAR",
            "elemtype":"text",
            "numrange": "50",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""		
        },
        {			
            "en": "datatype",			
            "cn": "数据类型",			
            "view": "true",	
            "ro": "0",
            "elemtype":"select2_radio",
            "datatype": "VARCHAR",
            "numrange": "20",
            "dict": "ZR.0041",			
            "unit": "",			
            "format": "",		
            "chart": ""		
        },
        {			
            "en": "status",			
            "cn": "状态",			
            "view": "true",
            "ro": "0",
            "elemtype":"select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0001",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        }
    ];
}
sys.addRetData(type,"type");
sys.setRetData("0","","type");