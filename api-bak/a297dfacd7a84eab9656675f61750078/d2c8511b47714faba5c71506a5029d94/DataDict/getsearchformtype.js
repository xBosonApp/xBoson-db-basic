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

//是sys_mdm002表 
var type=[];
if(sys.trim(datatable)==""){
   type=[
    {			
        "en": "s_typecd",			
        "cn": "类别编码",
        "elemtype": "text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": ""			
    },
    {			
        "en": "typenm",			
        "cn": "类别名称",
        "elemtype": "text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": ""			
    },
     {			
        "en": "status",			
        "cn": "状态",
        "elemtype": "select2_radio",
        "datatype": "VARCHAR",
        "numrange": "2",
        "dict": "ZR.0001",			
        "unit": "",			
        "format": ""	
    }
];
} 
else if(datatable =="sys_mdm002"){
  type=[       {			
        "en": "version",			
        "cn": "版本",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": ""		
    },
    {			
        "en": "dictcd",			
        "cn": "字典编码",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": ""			
    },			
    {			
        "en": "dictnm",			
        "cn": "字典名称",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": ""		
    },			
    {			
        "en": "shortkey",			
        "cn": "快捷码",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": ""	
    },
     {			
        "en": "status",			
        "cn": "状态",
        "elemtype":"select2_radio",
        "datatype": "VARCHAR",
        "numrange": "2",
        "dict": "ZR.0001",			
        "unit": "",			
        "format": ""	
    }
];
}
//是sys_pl_mdm004表
else if(datatable =="sys_pl_mdm004"){
  type=[       {			
        "en": "dbtype",			
        "cn": "DB类型",
        "elemtype":"select2_radio",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "ZR.0014",			
        "unit": "",			
        "format": ""		
    },			
    {			
        "en": "class",			
        "cn": "SQL分类",
        "elemtype":"select2_radio",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "ZR.0040",			
         "unit": "",			
        "format": ""
    },			
    {			
        "en": "sqltext",			
        "cn": "SQL语句",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "200",
        "dict": "",			
        "unit": "",			
        "format": ""	
    },
    {			
        "en": "status",			
        "cn": "状态",
        "elemtype":"select2_radio",
        "datatype": "VARCHAR",
        "numrange": "2",
        "dict": "ZR.0001",			
        "unit": "",			
        "format": ""	
    }
];
}
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
    sql.query("select field,elemtype,readonly,filter from sys_md_mm005 where typecd=? and did=? and en=? order by sorting",[dstypecd,"00000000000000000000000000000000",datatable],"ui_r");
    if(sys.size(sys.result.ui_r)==0){
        sys.setRetData("2","无画面信息！");
        return;
    }
    //searchForm
    for(r in sys.result.ui_r){
        if(r.filter!="1"){
            continue;
        }
        for(r2 in sys.result.fields_r){
            if(r2.en==r.field){
                list.add(type,{
                    "en":r2.en,
                    "cn":r2.cn,
                    "view":r.elemtype==""?"0":"1",
                    "ro":"0",
                    "must":"0",
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
}
sys.addRetData(type,"type");
sys.setRetData("0","","type");