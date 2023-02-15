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

var gettable = "select datatable from sys_mdm001 where typecd=?";

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
//是sys_mdm002表 
if(sys.trim(datatable)==""){
    type=[        {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
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
        "datatype": "s",
        "numrange": "20",
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
        "datatype": "s",
        "numrange": "20",
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
        "datatype": "s",
        "numrange": "20",
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
        "datatype": "s",
        "numrange": "20",
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
        "datatype": "s",
        "numrange": "20",
        "dict": "ZR.0039",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    },			
    {			
        "en": "url",			
        "cn": "URL",			
        "view": "1",
        "ro": "0",
        "must": "0",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "50",
        "dict": "",			
        "unit": "",			
        "format": "",
        "chart": ""			
    },
    {			
        "en": "version",			
        "cn": "版本",			
        "view": "1",
        "ro": "0",
        "must": "0",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
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
        "must": "1",
        "search": "1",
        "elemtype": "select2_radio",
        "datatype": "s",
        "numrange": "2",
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
        "datatype": "s",
        "numrange": "200",
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
else if(datatable =="sys_mdm002"){
    type=[        {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "1",
        "must": "0",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
    },
    {			
        "en": "version",			
        "cn": "版本",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
    },
    {			
        "en": "dictcd",			
        "cn": "字典编码",			
        "view": "1",	
        "ro": "0",
        "search": "1",
        "must": "1",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
    },			
    {			
        "en": "dictnm",			
        "cn": "字典名称",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "1",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
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
        "search": "1",
        "elemtype": "text",
        "datatype": "s",
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
        "must": "1",
        "search": "1",
        "elemtype": "select2_radio",
        "datatype": "s",
        "numrange": "2",
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
        "datatype": "s",
        "numrange": "200",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""	
    }
];
    // if(usetype == "2"){
    // //   map.put(type[1], "ro", "0");
    // }
}
//是sys_pl_mdm004表
else if(datatable =="sys_pl_mdm004"){
  type=[        {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "0",
        "elemtype": "text",
        "datatype": "s",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
    },			
    {			
        "en": "dbtype",			
        "cn": "DB类型",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "1",
        "elemtype": "select2_radio",
        "datatype": "s",
        "numrange": "20",
        "dict": "ZR.0014",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    },			
    {			
        "en": "class",			
        "cn": "SQL分类",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "1",
        "elemtype": "select2_radio",
        "datatype": "s",
        "numrange": "20",
        "dict": "ZR.0040",			
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
        "search": "1",
        "elemtype": "select2_radio",
        "datatype": "s",
        "numrange": "2",
        "dict": "ZR.0001",			
        "unit": "",			
        "format": "",		
        "chart": ""		
    },			
    {			
        "en": "sqltext",			
        "cn": "SQL语句",			
        "view": "1",	
        "ro": "0",
        "search": "1",
        "must": "1",
        "elemtype": "textarea",
        "datatype": "s",
        "numrange": "2000",
        "dict": "",			
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
        "datatype": "s",
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
//其他表
else{
    //获取数据集模型ID
    sql.query("select typecd from sys_md_mm003 where did=? and en=?",["00000000000000000000000000000000",datatable],"dstypecd_r");
    if(sys.size(sys.result.dstypecd_r)==0){
        sys.setRetData("2","在平台数据源中无此表信息！");
        return;
    }
    var dstypecd=sys.result.dstypecd_r[0].typecd;
    //获取表字段信息
    sql.query("select a.en,a.cn,a.mk,a.must,b.datatype,b.numrange,b.dict,b.format,b.unit  from sys_md_mm002 a left join sys_mdm003 b on a.decd=b.decd where a.typecd=? and a.status='1'",[dstypecd],"fields_r");
    if(sys.size(sys.result.fields_r)==0){
        sys.setRetData("2","无表字段信息！");
        return;
    }
    //获取表UI设置信息
    sql.query("select field,elemtype,readonly from sys_md_mm005 where typecd=? and did=? and en=? order by sorting",[dstypecd,"00000000000000000000000000000000",datatable],"ui_r");
    if(sys.size(sys.result.ui_r)==0){
        sys.setRetData("2","无画面信息！");
        return;
    }
    //修改模态
    for(r in sys.result.ui_r){
        for(r2 in sys.result.fields_r){
            if(r2.en==r.field){
                list.add(type,{
                    "en":r2.en,
                    "cn":r2.cn,
                    "view":r.elemtype==""?"0":"1",
                    "ro":r.readonly,
                    "must":r2.must,
                    "elemtype":r.elemtype,
                    "datatype":r2.datatype,
                    "numrange":r2.numrange,
                    "unit":r2.unit,
                    "format":r2.format,
                    "dict":r2.dict
                });
            }
        }
    }
    //添加模态
    if(usetype=="1"){
        for(r in type){
            map.put(r,"ro","0");
        }
    }
}
sys.addRetData(type,"type");
sys.setRetData("0","","type");