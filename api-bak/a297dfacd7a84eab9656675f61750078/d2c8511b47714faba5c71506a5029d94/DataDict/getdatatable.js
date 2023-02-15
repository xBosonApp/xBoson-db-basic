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
//测试路径：http://192.168.7.225:8088/ds/api/getdatatable?app=d2c8511b47714faba5c71506a5029d94&mod=DataDict&org//=a297dfacd7a84eab9656675f61750078&openid=76DF0AEC996EB807534F5C1F3936634CD891FB59F1F45E143106CECC34D60237&//=d&mdk=f4086d64059d44529efd10f93a58eafc&userkeylocal=ccb31b154187490e8bc70fba881294cb&orgtype=v&pagesize//=10&pagenum=1&typecd=24
//获取datatable里面的数据
//王莹莹
    
var org = sys.request.org;
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

var sqlSel = "SELECT datatable  FROM sys_mdm001 ";
var sqlWhere=" where 1=1 ";
var paramSel = [];
if (typecd != null) {
    sqlWhere = sqlWhere + " and typecd = ? ";
    //@paramSel.add(typecd);
    list.add(paramSel, typecd);
}
var sql1=sqlSel+sqlWhere;
sql.query(sql1,paramSel);

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
//   if(sys.trim(datatable) == ""){
//       sys.setRetData("1","无数据");
//       return;
//   }
//检查表是否存在sql语句
var getSql="select sqltext from sys_pl_mdm004 where typecd=? and status='1' and dbtype=? and class=?";
var getSql_cnt=sql.query(getSql,["ZR.0014"+se.dbType()+"1",se.dbType(),"07"],"getsql_r");
if(getSql_cnt==0){
    sys.setRetData("2","获取sql语句异常");
    return;
}
var checkTblExist=sys.result.getsql_r[0].sqltext;
//检查表是否存在
if(sys.trim(datatable) != ""){
  var checkTblExist_cnt=se.query(checkTblExist,[org,datatable],"checkTblExist_r");
  if(checkTblExist_cnt==0){
      sys.setRetData("2","表:"+datatable+"不存在");
      return;
  }
}
//pagenum,pagesize
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
    sql3 = "select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark,createdt,updatedt from sys_mdm001 where parentcd=?";
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
    sql.query("select '类别编码(typecd)' typecd,'父类别编码(parentcd)' parentcd,'类别名称(typenm)' typenm,'快捷码(shortkey)' shortkey,'标准(standard)' standard,'数据库表(datatable)' datatable,'页面URL(url)' url,'版本(version)' version,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt,'状态名称(statusnm)' statusnm,'标准名称(standardnm)' standardnm",null,"title");
}
//是sys_mdm002
else if(datatable == "sys_mdm002"){
    var version=sys.request.version;
    var dictcd=sys.request.dictcd;
    var dictnm=sys.request.dictnm;
    var shortkey=sys.request.shortkey;
    var status=sys.request.status;
    sql3="select typecd,version,dictcd,dictnm,shortkey,status,mark,createdt,updatedt from sys_mdm002 where typecd=? ";
    list.add(paramSel2,typecd);
    var before_json={};
    if(version != null){
      sql3=sql3+" and version = ?";
      list.add(paramSel2,version);
      map.put(before_json,"version",version);
    }
    if(dictcd != null){
      sql3=sql3+" and dictcd like ?";
      list.add(paramSel2,"%"+dictcd+"%");
      map.put(before_json,"dictcd",dictcd);
    }
    if(dictnm != null){
      sql3 = sql3 + " and dictnm like ?";
      list.add(paramSel2,"%"+dictnm+"%");
      map.put(before_json,"dictnm",dictnm);
    }
    if(shortkey != null){
      sql3=sql3+" and shortkey like ?";
      list.add(paramSel2,"%"+shortkey+"%");
      map.put(before_json,"shortkey",shortkey);
    }
    if(status != null){
      sql3=sql3+" and status=?";
      list.add(paramSel2,status);
      map.put(before_json,"status",status);
    }
    //是否下载
    if(_is_download=="1" || pagesize==null || pagenum==null){
        sql.query(sql3,paramSel2,"data");  
        //记录下载日志
        map.put(before_json,"down_type",down_type);
        map.put(before_json,"charset",charset);
        map.put(before_json,"count",sys.size(sys.result.data));
        var after_json={};
        var log_res = http.platformPost({"app":"d2c8511b47714faba5c71506a5029d94","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"003",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
    }else{
        sql.queryPaging(sql3,paramSel2,pagenum,pagesize,"data");
        //记录查询日志
        var after_json={};
        var log_res = http.platformPost({"app":"d2c8511b47714faba5c71506a5029d94","mod":"operation_log","api":"record_log"},{
            "typecd":typecd,
            "operation_type":"002",
            "before_json":sys.jsonFromInstance(before_json),
            "after_json":sys.jsonFromInstance(after_json)
        });
    }
    //title
    // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
    sql.query("select '类别编码(typecd)' typecd,'版本(version)' version,'字典代码(dictcd)' dictcd,'字典名称(dictnm)' dictnm,'快捷码(shortkey)' shortkey,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt",null,"title");
}
//是sys_pl_mdm004
else if(datatable == "sys_pl_mdm004"){
    var dbtype = sys.request.dbtype;
    var class0=sys.request.class;
    var sqltext=sys.request.sqltext;
    var status=sys.request.status;
    sql3="select typecd,dbtype,class,sqltext,status,mark,createdt,updatedt from sys_pl_mdm004 where typecd=? ";
    list.add(paramSel2,typecd);
    if(dbtype != null){
      sql3=sql3+" and dbtype like ?";
      list.add(paramSel2,dbtype);
    }
    if(class0 != null){
      sql3=sql3+" and class like ?";
      list.add(paramSel2,"%"+class0+"%" );
    }
    if(sqltext != null){
      sql3=sql3+" and sqltext like ?";
      list.add(paramSel2,"%"+sqltext+"%" );
    }
    if(status != null){
      sql3=sql3+" and status = ?";
      list.add(paramSel2,status);
    }
    //是否下载
    if(_is_download=="1" || pagesize==null || pagenum==null){
        sql.query(sql3,paramSel2,"data");    
    }else{
        sql.queryPaging(sql3,paramSel2,pagenum,pagesize,"data");
    }
    //title
    // jym: 数据中的列与表头一一对应, 为了实现这一目标, 表头的别名必须与数据的列名一致.
    sql.query("select '类别编码(typecd)' typecd,'数据库类型(dbtype)' dbtype,'SQL分类(class)' class,'SQL语句(sqltext)' sqltext,'状态(status)' status,'说明(mark)' mark,'创建时间(createdt)' createdt,'修改时间(updatedt)' updatedt",null,"title");
}
//是其他表
else{
    sql3 = "select * from "+datatable+" where 1=1 ";
    //获取where条件
    //获取数据集模型ID
    sql.query("select typecd from sys_md_mm003 where did=? and en=?",["00000000000000000000000000000000",datatable],"dstypecd_r");
    if(sys.size(sys.result.dstypecd_r)==0){
        sys.setRetData("2","在平台数据源中无此表信息！");
        return;
    }
    var dstypecd=sys.result.dstypecd_r[0].typecd;
    //获取表UI设置信息
    sql.query("select field,elemtype,readonly,filter from sys_md_mm005 where typecd=? and did=? and en=? order by sorting",[dstypecd,"00000000000000000000000000000000",datatable],"ui_r");
    if(sys.size(sys.result.ui_r)==0){
        sys.setRetData("2","无画面信息！");
        return;
    }
    //where字段
    for(r in sys.result.ui_r){
        if(r.filter!="1"){
            continue;
        }
        if(sys.request[r.field]!=null){
            if(r.elemtype!="select2_radio"){
                sql3=sql3+" and "+r.field+"=?";
                list.add(paramSel2,sys.request[r.field]);
            }else{
                sql3=sql3+" and "+r.field+" like ?";
                list.add(paramSel2,"%"+sys.request[r.field]+"%");
            }
        }
    }
    //是否下载
    if(_is_download=="1" || pagesize==null || pagenum==null){
        sql.query(sql3,paramSel2,"data");    
    }else{
        sql.queryPaging(sql3,paramSel2,pagenum,pagesize,"data");
    }
    //title
    var MetaData = sql.metaData("select * from "+datatable+" where 1=2");
    var sqlTitle = "select ";
    for(r in MetaData){
        sqlTitle = sqlTitle+"'"+r.ColumnLabel+"("+r.ColumnName+")',";
    }
    sqlTitle=sys.subStringTo(sqlTitle,0,sys.length(sqlTitle)-1);
    sql.query(sqlTitle,null,"title");
}

//是sys_mdm002表 
var type=[],search=[];
if(sys.trim(datatable)==""){
    type=[        {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "0",
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
        "en": "parentcd",			
        "cn": "父类别编码",			
        "view": "1",
        "ro": "1",
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
        "en": "typenm",			
        "cn": "类别名称",			
        "view": "1",	
        "ro": "0",
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
        "elemtype": "text",
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
        "elemtype": "text",
        "datatype": "VARCHAR",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",
        "chart": ""			
    },
    //  {			
    //     "en": "status",			
    //     "cn": "状态",			
    //     "view": "1",
    //     "ro": "0",
    //     "must": "1",
    //     "search": "1",
    //     "elemtype": "select2_radio",
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
        "must": "0",
        "elemtype": "textarea",
        "datatype": "VARCHAR",
        "numrange": "200",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""	
    }
];
    search=[
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
    type=[        {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "1",
        "elemtype":"text",
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
        "ro": "1",
        "elemtype":"text",
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
        "ro": "1",
        "elemtype":"text",
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
        "elemtype":"text",
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
        "elemtype":"text",
        "datatype": "s",
        "numrange": "20",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""			
    }
    //  {			
    //     "en": "status",			
    //     "cn": "状态",			
    //     "view": "true",
    //     "ro": "0",
    //     "search":"1",
    //     "elemtype":"select2_radio",
    //     "datatype": "s",
    //     "numrange": "2",
    //     "dict": "ZR.0001",			
    //     "unit": "",			
    //     "format": "",		
    //     "chart": ""		
    // },
    //  {			
    //     "en": "mark",			
    //     "cn": "说明",			
    //     "view": "true",
    //     "ro": "0",
    //     "search":"0",
    //     "elemtype":"textarea",
    //     "datatype": "s",
    //     "numrange": "200",
    //     "dict": "",			
    //     "unit": "",			
    //     "format": "",		
    //     "chart": ""	
    // }
];
    search=[	
    {			
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
    type=[        {			
        "en": "typecd",			
        "cn": "类别编码",			
        "view": "1",
        "ro": "1",
        "search":"0",
        "elemtype":"text",
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
        "search":"1",
        "elemtype":"select2_radio",
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
        "search":"1",
        "elemtype":"select2_radio",
        "datatype": "s",
        "numrange": "20",
        "dict": "ZR.0040",			
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
        "elemtype":"text",
        "search":"1",
        "datatype": "s",
        "numrange": "200",
        "dict": "",			
        "unit": "",			
        "format": "",		
        "chart": ""		
    }
    //  {			
    //     "en": "status",			
    //     "cn": "状态",			
    //     "view": "true",	
    //     "ro": "0",
    //     "search":"1",
    //     "elemtype":"select2_radio",
    //     "datatype": "s",
    //     "numrange": "2",
    //     "dict": "ZR.0001",			
    //     "unit": "",			
    //     "format": "",		
    //     "chart": ""		
    // },
    //  {			
    //     "en": "mark",			
    //     "cn": "说明",			
    //     "view": "true",
    //     "ro": "0",
    //     "search":"0",
    //     "elemtype":"textarea",
    //     "datatype": "s",
    //     "numrange": "200",
    //     "dict": "",			
    //     "unit": "",			
    //     "format": "",		
    //     "chart": ""	
    // }
];
    search=[		
    {			
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
//是其他表
else{
   //获取数据集模型typecd
   var getTypeCD="select typecd from sys_md_mm003 where en=? and did=? and status='1'";
   var gettypecd_cnt=sql.query(getTypeCD,[datatable,"00000000000000000000000000000000"],"gettypecd_r");
   if(gettypecd_cnt==0){
       sys.setRetData("2","数据集中不存在此表！");
       return;
   }
   var typecd_md=sys.result.gettypecd_r[0].typecd;
   //获取表结构
    var getType = "select sys_md_mm002.en,sys_md_mm002.cn,sys_md_mm002.mk,sys_md_mm002.must,sys_mdm003.datatype,sys_mdm003.numrange,sys_mdm003.dict,sys_mdm003.format from sys_md_mm002,sys_mdm003 where sys_md_mm002.decd=sys_mdm003.decd and sys_md_mm002.typecd=? and sys_md_mm002.status='1' order by sys_md_mm002.sorting";
    sql.query(getType,[typecd_md],"type");
    type = sys.result.type;
    for(r in type){
        if(r.mk == "1"){
            map.put(r,"ro","1");
        }else{
            map.put(r,"ro","0");
        }
        map.put(r,"view","1");
        map.put(r,"elemtype", "text");
    }
    //获取表UI设置信息
    sql.query("select field,elemtype,readonly,filter from sys_md_mm005 where typecd=? and did=? and en=? order by sorting",[typecd_md,"00000000000000000000000000000000",datatable],"ui_r");
    if(sys.size(sys.result.ui_r)==0){
        sys.setRetData("2","无画面信息！");
        return;
    }
    //searchForm
    for(r in sys.result.ui_r){
        if(r.filter!="1"){
            continue;
        }
        for(r2 in sys.result.type){
            if(r2.en==r.field){
                list.add(search,{
                    "en":r2.en,
                    "cn":r2.cn,
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
        //字典时为特定模板
        if(datatable == "sys_mdm002"){
            tmpName = "Default_Dict_template.xlsx";
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
    //找出非小写的列名
    var nonLower=[];
    for(t in type){
      if(t.en != sys.toLowerCase(t.en)){
        list.add(nonLower,t.en);
      }
    }
    //将data中的小写字段名，转成正确的
    for(d in sys.result.data){
      for(t in nonLower){
        if(map.containsKey(d,sys.toLowerCase(t))){
          map.put(d,t,d[sys.toLowerCase(t)]);
          map.remove(d,sys.toLowerCase(t));
        }
      }
    }
    sys.addRetData(search,"search");
    sys.addRetData(type,"type");
    sys.setRetData("0","","data","type","search");
}