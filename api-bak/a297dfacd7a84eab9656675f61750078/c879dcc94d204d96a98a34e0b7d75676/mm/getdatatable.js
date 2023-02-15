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
//获取元数据管理datatable里面的数据
//id:getdatatable
var typecd = sys.request.typecd;

var _is_download=sys.request._is_download;    //是否下载数据{0,1}
var down_type = sys.request.type;  //下载类型{1,2}
var charset = sys.request.charset;    //下载字符集

var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
if(typecd == null){
    sys.setRetData("1");
    return;
}	

var sqlSel = "SELECT datatable FROM sys_md_mm001 where typecd = ?";
var paramSel = [typecd];
sql.query(sqlSel,paramSel);

var result=sys.result.result;
var datatable="";
if(result == null||sys.size(result)==0){
  //如果不是根节点则返回code2
  if(typecd != "0"){
      sys.setRetData("2");
      return;
  }
}else{
  datatable= result[0].datatable;
}

if(pagenum!=null){
    if(!(sys.isNumber(pagenum))){
        sys.setRetData("1","pagenum参数应该为数字类型");
        return;
    }
}
if(pagesize!=null){
    if(!(sys.isNumber(pagesize))){
        sys.setRetData("1","pagesize参数应该为数字类型");
        return;
    }
}
  
var sql3="";
var paramSel2=[];
  //暂时写固定数据
if(sys.trim(datatable) == ""){
    var s_typecd = sys.request.s_typecd;
    var typenm = sys.request.typenm;
    var status = sys.request.status;
    sql3 = "select typecd,parentcd,typenm,shortkey,standard,datatable,version,status,mark,createdt,updatedt from sys_md_mm001 where parentcd=?";
    list.add(paramSel2, typecd);
    if(s_typecd != null){
        sql3=sql3+" and typecd like ?";
        list.add(paramSel2, "%"+s_typecd+"%");
    }
    if(typenm != null){
        sql3=sql3+" and typenm like ?";
        list.add(paramSel2, "%"+typenm+"%");
    }
    if(status != null){
        sql3=sql3+" and status = ?";
        list.add(paramSel2, status);
    }
    if(_is_download=="1" || pagesize==null || pagenum==null){
        sql.query(sql3,paramSel2,"data");    
    }else{
        sql.queryPaging(sql3,paramSel2,pagenum,pagesize,"data");
    }
    
    //字典翻转
    var statusArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0001');
    var standardArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0039');
    for(r in sys.result.data){
        for(statusD in statusArr){
            if(r.status==statusD.id){
                map.put(r,"statusnm",statusD.name);
            }
        }
        for(standardD in standardArr){
            if(r.standard==standardD.id){
                map.put(r,"standardnm",standardD.name);
            }
        }
    }
    
    //title
    // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
    sql.query("select '类别编码(typecd)' typecd,'父类别编码(parentcd)' parentcd,'类别名称(typenm)' typenm,'快捷码(shortkey)' shortkey,'标准(standard)' standard,'数据库表(datatable)' datatable,'版本(version)' version,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt,'状态名称(statusnm)' statusnm,'标准名称(standardnm)' standardnm ",null,"title");
}
if(datatable == "sys_md_mm002"){
    var decd=sys.request.decd;
    var en=sys.request.en;
    var cn=sys.request.cn;
    var must=sys.request.must;
    var mk=sys.request.mk;
    var status=sys.request.status;
    var version=sys.request.version;
    sql3="select a.typecd,a.decd,a.en,a.cn,a.mk,a.must,a.dv,a.sorting,a.elemtype,a.status,a.mark,a.createdt,a.updatedt, a.version from sys_md_mm002 a where a.typecd=?";
    list.add(paramSel2,typecd);
    var before_json={};
    if(decd != null){
        sql3=sql3+" and a.decd like ?";
        list.add(paramSel2,"%"+decd+"%");
        map.put(before_json,"decd",decd);
    }
    if(en != null){
        sql3 = sql3 + " and a.en like ?";
        list.add(paramSel2,"%"+en+"%");
        map.put(before_json,"en",en);
    }
    if(cn != null){
        sql3=sql3+" and a.cn like ?";
        list.add(paramSel2,"%"+cn+"%");
        map.put(before_json,"cn",cn);
    }
    if(must != null){
        sql3=sql3+" and a.must = ?";
        list.add(paramSel2,must);
        map.put(before_json,"must",must);
    }
    if(mk != null){
        sql3=sql3+" and a.mk = ?";
        list.add(paramSel2,mk);
        map.put(before_json,"mk",mk);
    }
    if(status != null){
        sql3=sql3+" and a.status=?";
        list.add(paramSel2,status);
        map.put(before_json,"status",status);
    }
    if(version != null){
        sql3=sql3+" and a.version=?";
        list.add(paramSel2,version);
        map.put(before_json,"version",version);
    }
    //按sorting排序
    sql3 = sql3+" order by sorting";
    if(_is_download=="1" || pagesize==null || pagenum==null){
        sql.query(sql3,paramSel2,"data");   
        //记录下载日志
        map.put(before_json,"down_type",down_type);
        map.put(before_json,"charset",charset);
        map.put(before_json,"count",sys.size(sys.result.data));
        var after_json={};
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00205",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
    }else{
        sql.queryPaging(sql3,paramSel2,pagenum,pagesize,"data");
        //记录查询日志
        var after_json={};
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00204",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
    }
    //元数据信息
    var sqlmdm003="select decd,datatype,numrange,dict from sys_mdm003 where decd in (select decd from sys_md_mm002 where typecd=?) and status='1'";
    sql.query(sqlmdm003,[typecd],"mdm003_r");
    //合并结果集
    for(r in sys.result.data){
        var find=false;//decd
        for(r2 in sys.result.mdm003_r){
            if(r2.decd==r.decd){
                find=true;
                map.put(r,"datatype",r2.datatype);
                map.put(r,"numrange",r2.numrange);
                map.put(r,"dict",r2.dict);
                map.put(r,"_decd_no_exist",false);
                break;
            }
        }
        if(!find){
            map.put(r,"datatype","");
            map.put(r,"numrange","");
            map.put(r,"dict","");
            map.put(r,"_decd_no_exist",true);
        }
    }
    
    //title
    // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
    sql.query("select '类别编码(typecd)' typecd,'数据元编码(decd)' decd,'英文名称(en)' en,'中文名称(cn)' cn,'是否主键(mk)' mk,'是否必填(must)' must,'默认值(dv)' dv,'排序(sorting)' sorting,'画面元素类型(elemtype)' elemtype,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt,'版本(version)' version,'数据类型(datatype)' datatype,'数据长度(numrange)' numrange,'数据字典(dict)' dict,'数据元不存在(_decd_no_exist)' _decd_no_exist",null,"title");
}
if(datatable == "sys_mdm003"){
    var decd=sys.request.decd;
    var en=sys.request.en;
    var cn=sys.request.cn;
    var datatype=sys.request.datatype;
    var status=sys.request.status;
    var version=sys.request.version;
    sql3="select typecd,decd,en,cn,datatype,numrange,format,unit,(select typenm from sys_mdm001 where typecd=dict) dictnm,dict,status,mark,isstd,version from sys_mdm003 where typecd=? ";
    list.add(paramSel2, typecd);
    var before_json={};
    if(decd != null){
      sql3=sql3+" and decd like ?";
      list.add(paramSel2,"%"+decd+"%" );
      map.put(before_json,"decd",decd);
    }
    if(en != null){
      sql3=sql3+" and en like ?";
      list.add(paramSel2,"%"+en+"%");
      map.put(before_json,"en",en);
    }
    if(cn != null){
      sql3=sql3+" and cn like ?";
      list.add(paramSel2,"%"+cn+"%" );
      map.put(before_json,"cn",cn);
    }
    if(datatype != null){
      sql3=sql3+" and datatype like ?";
      list.add(paramSel2,"%"+datatype+"%" );
      map.put(before_json,"datatype",datatype);
    }
    if(status != null){
      sql3=sql3+" and status=?";
      list.add(paramSel2,status);
      map.put(before_json,"status",status);
    }
    if(version != null){
      sql3=sql3+" and version=?";
      list.add(paramSel2,version);
      map.put(before_json,"version",version);
    }
    if(_is_download=="1" || pagesize==null || pagenum==null){
        sql.query(sql3,paramSel2,"data");
        //记录下载日志
        map.put(before_json,"down_type",down_type);
        map.put(before_json,"charset",charset);
        map.put(before_json,"count",sys.size(sys.result.data));
        var after_json={};
        var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"00105",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
    }else{
        sql.queryPaging(sql3,paramSel2,pagenum,pagesize,"data");
        //记录查询日志
        // var after_json={};
        // var log_res = http.platformPost({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"operation_log","api":"record_log"},{
        //     "typecd":typecd,
        //     "operation_type":"00104",
        //     "before_json":sys.jsonFromInstance(before_json),
        //     "after_json":sys.jsonFromInstance(after_json)
        // });
    }
    for(r in sys.result.data){
      if(r.dict!=""){
        map.put(r,"dictnm",r.dict+"-"+r.dictnm);    
      }
    }
  
    //字典翻转
    var statusArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0001');
    var formatArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0042');
    var unitArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0043');
    var isstdArr = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+':ZR.0045');
    for(r in sys.result.data){
        for(statusD in statusArr){
            if(r.status==statusD.id){
                map.put(r,"statusnm",statusD.name);
            }
        }
        for(formatD in formatArr){
            if(r.format==""){
                map.put(r,"formatnm","");
                break;
            }
            if(r.format==formatD.id){
                map.put(r,"formatnm",formatD.name);
            }
        }
        for(unitD in unitArr){
            if(r.unit==""){
                map.put(r,"unitnm","");
                break;
            }
            if(r.unit==unitD.id){
                map.put(r,"unitnm",unitD.name);
            }
        }
        for(isstdD in isstdArr){
            if(r.isstd==""){
                map.put(r,"isstdnm","");
                break;
            }
            if(r.isstd==isstdD.id){
                map.put(r,"isstdnm",isstdD.name);
            }
        }
    }
    
    //title
    // 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
    sql.query("select '类别编码(typecd)' typecd,'数据元编码(decd)' decd,'英文名称(en)' en,'中文名称(cn)' cn,'数据类型(datatype)' datatype,'数据长度(numrange)' numrange,'显示个数(format)' format,'单位(unit)' unit,'字典代码(dict)' dict,'状态(status)' status,'说明(mark)' mark,'是否标准(isstd)' isstd,'字典名称(dictnm)' dictnm,'状态名称(statusnm)' statusnm,'显示格式名称(formatnm)' formatnm,'单位名称(unitnm)' unitnm,'是否标准名称(isstdnm)' isstdnm,'版本（version）' version",null,"title");
}
//是sys_mdm002表 
var type=[];
if(sys.trim(datatable)==""){
   type=[        
      {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "0",
        "must": "1",
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
        "en": "parentcd",			
        "cn": "父类别编码",			
        "view": "1",
        "ro": "1",
        "must": "1",
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
        "en": "typenm",			
        "cn": "类别名称",			
        "view": "1",	
        "ro": "0",
        "search": "1",
        "must": "1",
        "elemtype": "text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""				
      },			
      {			
        "en": "standardnm",			
        "cn": "标准",			
        "view": "1",
        "ro": "0",
        "must": "1",
        "search": "0",
        "elemtype": "",
        "datatype": "VARCHAR",
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
        "datatype": "VARCHAR",
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
        "datatype": "VARCHAR",
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
}
if(datatable =="sys_md_mm002"){
  type=[
    {			
        "en": "decd",			
        "cn": "数据元编码",			
        "view": "true",	
        "ro": "1",
        "search":"1",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
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
        "search":"1",
        "datatype": "VARCHAR",
        "numrange": "20",
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
        "search":"1",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    },
    {			
        "en": "mk",			
        "cn": "主键",			
        "view": "true",
        "ro": "0",
        "search":"1",
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
        "view": "true",
        "ro": "0",
        "search":"1",
        "elemtype":"select2_radio",
        "datatype": "CHAR",
        "numrange": "1",
        "dict": "ZR.0045",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    },
    {			
        "en": "datatype",			
        "cn": "数据类型",			
        "view": "true",
        "ro": "0",
        "search":"1",
        "elemtype":"",
        "datatype": "",
        "numrange": "",
        "dict": "",		
        "unit": "",			
        "format": "",		
        "chart": ""			
    },
    {			
        "en": "numrange",			
        "cn": "数据长度",			
        "view": "true",
        "ro": "0",
        "search":"1",
        "elemtype":"",
        "datatype": "",
        "numrange": "",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    },
    {			
        "en": "dict",			
        "cn": "数据字典",			
        "view": "1",
        "ro": "0",
        "search":"1",
        "elemtype":"",
        "datatype": "",
        "numrange": "",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    },
     {			
        "en": "mark",			
        "cn": "说明",			
        "view": "true",
        "ro": "0",
        "search":"0",
        "elemtype":"textarea",
        "datatype": "VARCHAR",
        "numrange": "200",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""	
    }, {			
        "en": "version",			
        "cn": "版本",			
        "view": "true",
        "ro": "0",
        "search":"1",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
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
        "search":"1",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
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
        "search":"1",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "20",
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
        "search": "1",
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
      "search": "1",
      "elemtype":"text",
      "datatype": "VARCHAR",
      "numrange": "20",
      "dict": "",			
      "unit": "",			
      "format": "",		
      "chart": ""		
    },
    {			
      "en": "numrange",			
      "cn": "数据长度",			
      "view": "true",
      "ro": "0",
      "search":"0",
      "elemtype":"text",
      "datatype": "VARCHAR",
      "numrange": "20",
      "dict": "",			
      "unit": "",			
      "format": "",		
      "chart": ""	
    },
    {			
      "en": "formatnm",			
      "cn": "显示格式",			
      "view": "true",
      "ro": "0",
      "search":"0",
      "elemtype":"text",
      "datatype": "VARCHAR",
      "numrange": "50",
      "dict": "",			
      "unit": "",			
      "format": "",		
      "chart": ""	
    },
    {			
      "en": "unitnm",			
      "cn": "单位",			
      "view": "true",
      "ro": "0",
      "search":"0",
      "elemtype":"text",
      "datatype": "VARCHAR",
      "numrange": "10",
      "dict": "",			
      "unit": "",			
      "format": "",		
      "chart": ""	
    },
    {			
      "en": "dict",			
      "cn": "字典类别",			
      "view": "0",
      "ro": "0",
      "search":"0",
      "elemtype":"text",
      "datatype": "VARCHAR",
      "numrange": "100",
      "dict": "",			
      "unit": "",			
      "format": "",		
      "chart": ""	
    },
    {			
        "en": "dictnm",			
        "cn": "字典类别",			
        "view": "1",
        "ro": "0",
        "search":"0",
        "elemtype":"text",
        "datatype": "VARCHAR",
        "numrange": "100",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""	
    },
    {			
        "en": "isstdnm",			
        "cn": "是否标准",			
        "view": "1",
        "ro": "0",
        "search":"0",
        "datatype": "VARCHAR",
        "numrange": "1",
        "dict": "",
        "unit": "",			
        "format": "",		
        "chart": ""	
    },
    {			
      "en": "statusnm",			
      "cn": "状态",			
      "view": "true",
      "ro": "0",
      "search":"1",
      "elemtype":"",
      "datatype": "CHAR",
      "numrange": "1",
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
      "search":"0",
      "must": "0",
      "elemtype":"textarea",
      "datatype": "VARCHAR",
      "numrange": "200",
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
      "search":"0",
      "must": "0",
      "elemtype":"text",
      "datatype": "VARCHAR",
      "numrange": "20",
      "dict": "",			
      "unit": "",			
      "format": "",		
      "chart": ""	
    }
  ];
}

//是否下载
if(_is_download=="1"){
    var path = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //文件路径
    var name = "";
    // type1:CSV
    if(down_type == "1"){
        name = "csv-"+sys.formattedTime(sys.currentDate(), "yyyyMMddHHmmssSSS")+".csv";
        // 生成CSV文件
        sys.listToCsv(path,name,charset,sys.result.data);
        // download，返回下载路径和文件名称
        sys.addRetData([{"path":path,"name":name}],"result");
    }
    // type2:JSON
    else if(down_type == "2"){
        var file_content = sys.jsonFromInstance(sys.result.data);
        // download，返回下载内容和字符集
        sys.addRetData([{"file_content":file_content,"file_charset":charset}],"result");
    }
    // type3:Excel
    else if(down_type == "3"){
        //模板路径
        var tmpPath = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TEMPLATE"); 
        //下载路径
        var dowPath = se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_REPORT");
        //模板文件名
        var tmpName = "Default_empty_template.xlsx";
        //数据集时为特定模板
        if(datatable =="sys_md_mm002"){
            tmpName = "Default_DS_template.xlsx";
        }
        var fileName = sys.setReportData(tmpName,["title","data"],tmpPath,dowPath);
        // download，返回下载路径和文件名称
        sys.addRetData([{"path":dowPath,"name":fileName}],"result");
    }
    else{
        sys.setRetData("2");
        return;
    }
    sys.setRetData("0","","result");
}else{
    map.put(sys.result,"type",type);
    sys.setRetData("0","","data","type");
}