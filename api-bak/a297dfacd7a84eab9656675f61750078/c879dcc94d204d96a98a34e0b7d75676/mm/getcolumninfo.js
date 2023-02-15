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
//获取添加时列信息

var typecd = sys.request.typecd;
var usetype = sys.request.usetype;  //使用类型:  1为添加，2为修改

if(typecd==null || usetype == null){
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

//暂时写固定数据
var type=[];
//是sys_md_mm001表 
if(sys.trim(datatable)==""){
       type=[        {			
            "en": "typecd",			
            "cn": "类别编码",			
            "view": "1",
            "ro": "0",
            "must": "1",
            "search": "0",
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
            "search": "1",
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
            "en": "parentcd",			
            "cn": "父类别编码",			
            "view": "1",
            "ro": "1",
            "must": "1",
            "search": "0",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""				
        },	
        {			
            "en": "datatable",			
            "cn": "数据库表",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "0",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",
            "chart": ""			
        },	
        {			
            "en": "shortkey",			
            "cn": "快捷码",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "0",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",
            "chart": ""			
        },
        {			
            "en": "standard",			
            "cn": "标准",			
            "view": "1",
            "ro": "0",
            "must": "1",
            "search": "0",
            "elemtype": "select2_radio",
            "datatype": "VARCHAR",
            "numrange": "20",
            "dict": "ZR.0039",			
            "unit": "",			
            "format": "",		
            "chart": ""			
        },			
        
        
        // {			
        //     "en": "version",			
        //     "cn": "版本",			
        //     "view": "1",
        //     "ro": "0",
        //     "must": "0",
        //     "search": "0",
        //     "elemtype": "text",
        //     "datatype": "VARCHAR",
        //     "numrange": "20",
        //     "dict": "",			
        //     "unit": "",			
        //     "format": "",
        //     "chart": ""			
        // },
         {			
            "en": "status",			
            "cn": "状态",			
            "view": "1",
            "ro": "0",
            "must": "1",
            "search": "1",
            "elemtype": "select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0001",			
            "unit": "",			
            "format": "",	
            "chart": ""		
        },
         {			
            "en": "mark",			
            "cn": "说明",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "0",
            "elemtype": "textarea",
            "datatype": "VARCHAR",
            "numrange": "200",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        }
];
   if(usetype == "2"){
       map.put(type[0], "ro", "1");
   }
  }
if(datatable =="sys_md_mm002"){
      type=[        {			
            "en": "typecd",			
            "cn": "模型编码",			
            "view": "1",
            "ro": "1",
            "search":"0",
            "must": "1",
            "elemtype":"text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""				
        },			
        {			
            "en": "decd",			
            "cn": "数据元编码",			
            "view": "1",	
            "ro": "0",
            "search":"1",
            "must": "1",
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
            "view": "1",
            "ro": "0",
            "must": "1",
            "elemtype":"text",
            "search":"1",
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
            "view": "1",
            "ro": "0",
            "search":"1",
            "must": "1",
            "elemtype":"text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""			
        },
        {			
            "en": "mk",			
            "cn": "主键",			
            "view": "1",
            "ro": "0",
            "search":"1",
            "must": "1",
            "elemtype":"select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0045",			
            "unit": "",			
            "format": "",		
            "chart": ""			
        },
        {			
            "en": "must",			
            "cn": "必须",			
            "view": "1",
            "ro": "0",
            "search":"1",
            "must": "1",
            "elemtype":"select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0045",			
            "unit": "",			
            "format": "",		
            "chart": ""			
        },
        //  {			
        //     "en": "sorting",			
        //     "cn": "排序",			
        //     "view": "true",
        //     "ro": "0",
        //     "search":"1",
        //     "elemtype":"text",
        //     "datatype": "s",
        //     "numrange": "2",
        //     "dict": "",			
        //     "unit": "",			
        //     "format": "",		
        //     "chart": ""		
        // },
        //  {			
        //     "en": "status",			
        //     "cn": "状态",			
        //     "view": "1",
        //     "ro": "0",
        //     "search":"1",
        //     "must": "1",
        //     "elemtype":"select2_radio",
        //     "datatype": "s",
        //     "numrange": "2",
        //     "dict": "ZR.0001",			
        //     "unit": "",			
        //     "format": "",		
        //     "chart": ""		
        // },
         {			
            "en": "mark",			
            "cn": "说明",			
            "view": "1",
            "ro": "0",
            "search":"0",
            "must": "0",
            "elemtype":"textarea",
            "datatype": "VARCHAR",
            "numrange": "600",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        }
];
  if(usetype == "2"){
      map.put(type[1], "ro", "0");
  }
}
if(datatable =="sys_mdm003"){
      type=[        {			
            "en": "typecd",			
            "cn": "类别编码",			
            "view": "1",
            "ro": "1",
            "must": "0",
            "search": "0",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""				
        },			
        {			
            "en": "decd",			
            "cn": "数据元编码",			
            "view": "1",	
            "ro": "0",
            "must": "1",
            "search": "0",
            "elemtype": "text",
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
            "view": "1",
            "ro": "0",
            "must": "1",
            "search": "1",
            "elemtype": "text",
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
            "view": "1",
            "ro": "0",
            "search": "1",
            "must": "0",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""			
        },
         {			
            "en": "datatype",			
            "cn": "数据类型",			
            "view": "1",
            "ro": "0",
            "must": "1",
            "search": "0",
            "elemtype": "select2_radio",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "ZR.0041",			
            "unit": "",			
            "format": "",		
            "chart": ""		
        },
         {			
            "en": "numrange",			
            "cn": "数据长度",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "0",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "20",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "format",			
            "cn": "显示格式",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "0",
            "elemtype": "select2_radio",
            "datatype": "VARCHAR",
            "numrange": "50",
            "dict": "ZR.0042",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "unit",			
            "cn": "单位",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "0",
            "elemtype": "select2_radio",
            "datatype": "VARCHAR",
            "numrange": "100",
            "dict": "ZR.0043",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "dict",			
            "cn": "字典类别",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "1",
            "elemtype": "text",
            "datatype": "VARCHAR",
            "numrange": "20",
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
            "must": "0",
            "search": "1",
            "elemtype": "select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0001",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
        {			
            "en": "isstd",			
            "cn": "是否标准",			
            "view": "1",
            "ro": "0",
            "must": "0",
            "search": "1",
            "elemtype": "select2_radio",
            "datatype": "CHAR",
            "numrange": "1",
            "dict": "ZR.0045",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        },
         {			
            "en": "mark",			
            "cn": "说明",			
            "view": "1",
            "ro": "0",
            "search":"0",
            "must": "0",
            "elemtype":"textarea",
            "datatype": "VARCHAR",
            "numrange": "200",
            "dict": "",			
            "unit": "",			
            "format": "",		
            "chart": ""	
        }
];
   if(usetype == "2"){
       map.put(type[1], "ro", "1");
   }
}
sys.addRetData(type,"type");
sys.setRetData("0","","type");