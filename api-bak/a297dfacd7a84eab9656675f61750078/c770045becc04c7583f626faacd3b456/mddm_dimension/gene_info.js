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
//id:gene_info
//生成typecontent等信息
var typecd_parent=sys.request.typecd_parent;    //父视图模型ID
var tablesource=sys.request.tablesource;    //数据来源的表名
var row_json=sys.request.row_json;      //行定义
var column_json=sys.request.column_json;    //列定义
var where_json=sys.request.where_json;  //追加的where条件

var cnt=0;

//必需参数
if(typecd_parent==null || row_json==null || column_json==null){
    sys.setRetData("1");
    return;
}
var result={"type":[],"search":[]};
var iscatch=false,catmsg="";

//转换row_json,column_json,where_json为对象
var row_jsonObj=sys.instanceFromJson(row_json);
var column_jsonObj=sys.instanceFromJson(column_json);
var where_jsonObj=sys.instanceFromJson(where_json);

if(sys.size(row_jsonObj)==0){
    sys.setRetData("1");
    return;
}
if(sys.size(column_jsonObj)==0){
    sys.setRetData("1");
    return;
}

//获取视图模型的typecontent
var getTypecontent="select typecontent,sqltext,did from sys_bm003 where typecd=? and status='1'";
cnt=sql.query(getTypecontent,[typecd_parent],"typecontent_r");
if(cnt==0){
    sys.setRetData("2");
    return;
}
var typecontentObj=sys.instanceFromJson(sys.result.typecontent_r[0].typecontent);
var did=sys.result.typecontent_r[0].did;

//判断选择的是视图物理表，还是视图SQL语句
var isTable=false,subQuery="("+sys.result.typecontent_r[0].sqltext+") tmp";;
if(tablesource != null){
    isTable=true;
    subQuery=tablesource;
}

//判断行定义是自定义，还是group by
var isGroup=false;
if(row_jsonObj[0].where_group=="2"){
    isGroup=true;
}

//result.type
if(isGroup){
    //验证group by 内容
    var _groupby=sys.trim(sys.toLowerCase(row_jsonObj[0].group.groupby_area));
    //前5个字符为group
    if(sys.startWith(_groupby,"group")){
        _groupby=sys.trim(sys.subString(_groupby,5));
    }else{
        sys.setRetData("2","Group By的内容要以group by开头！");
        return;
    }
    //group后面为by
    if(sys.startWith(_groupby,"by")){
        _groupby=sys.trim(sys.subString(_groupby,2));
    }else{
        sys.setRetData("2","Group By的内容要以group by开头！");
        return;
    }
    _groupby=sys.subString(sys.trim(row_jsonObj[0].group.groupby_area),5);
    _groupby=sys.subString(sys.trim(_groupby),2);
    _groupbyArr = sys.split(_groupby,",");  //可以group by 多个列 
    //添加result.type的行定义列
    for(r in _groupbyArr){
        list.add(result.type,{
            "en": r,
            "cn": r,
            "view": "",
            "ro": "",
            "must": "",
            "elemtype": "",
            "datatype": "VARCHAR",
            "numrange": "100",
            "format": "",
            "unit": "",
            "dict": "",
            "chart": ""
        });
    }
}
else{
    list.add(result.type,{
        "en": "first_column",
        "cn": "第一列",
        "view": "",
        "ro": "",
        "must": "",
        "elemtype": "",
        "datatype": "VARCHAR",
        "numrange": "100",
        "format": "",
        "unit": "",
        "dict": "",
        "chart": ""
    });
}

//将列定义添加到result.type中
if(did!="00000000000000000000000000000000"){
    sql.connection(did);
}
var dictCache = se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+se.dbType()+"3");
for(r in column_jsonObj){
    var Csql="select "+r.column_content+" from "+subQuery+" where 1=2 ";
    sys.printValue("Csql:"+Csql);
    var CInfo=[];
    try{
        //将in , not in条件替换成1=2， 而不是替换成?,例如a in {a}变成1=2
        Csql=sys.regexReplaceAll("(?i)(\\S)+\\s*((IN)|(NOT IN))\\s*\\{\\S+\\}",Csql," 1=2 ");
        //将其他{参数占位符}替换为?
        Csql=sys.regexReplaceAll("\\{\\S+\\}",Csql,"?");
        sys.printValue("metaData_SQL:"+sys.regexReplaceAll("\\{\\S+\\}",Csql,"?"));
        CInfo=sql.metaData(Csql);
    }catch(e){
        iscatch=true;
        catchmsg=e.cause.message;
    }
    if(iscatch){
        sys.setRetData("2",catchmsg);
        return;
    }
    
    if(sys.size(CInfo)!=1){
        sys.setRetData("2","列定义有误！");
        return;
    }
    var tmp_dtype="VARCHAR";
    var tmp_numrange=CInfo[0].Precision;
    if(CInfo[0].Scale!=0){
        tmp_numrange=tmp_numrange+","+CInfo[0].Scale;
    }
    for(t in dictCache){
        if(t.id==CInfo[0].ColumnTypeName){
            tmp_dtype=t.name;
            break;
        }
    }
    list.add(result.type,{
        "en": sys.toLowerCase(CInfo[0].ColumnLabel),
        "cn": r.name,
        "view": "1",
        "ro": "",
        "must": "",
        "elemtype": "",
        "datatype": tmp_dtype,
        "numrange": tmp_numrange,
        "format": "",
        "unit": "",
        "dict": "",
        "chart": "line,bar,column,pie,stagebar,stagecolumn"
    });
}
//恢复数据库连接
sql.connection();

//result.search
//如果选择的是视图SQL语句，将视图SQL语句对应的参数放到result.search中
if(!isTable){
    //将视图SQL参数放到result.search中
    for(r in typecontentObj.search){
        list.add(result.search,r);
    }
}
//将追加where条件放到result.search中
for(r in where_jsonObj.add_where_params){
    //获取追加where条件的列信息
    var tmp_dtype="";
    var tmp_dnumrange="";
    var tmp_elemtype="";
    var tmp_format="";
    var tmp_unit="";
    var tmp_dict="";
    for(t in typecontentObj.type){
        if(r.cn_name==t.cn_name){
            tmp_dtype=t.datatype;
            tmp_dnumrange=t.numrange;
            tmp_elemtype=t.elemtype;
            tmp_format=t.format;
            tmp_unit=t.unit;
            tmp_dict=t.dict;
        }
    }
    //元素标签类型默认为text
    if(tmp_elemtype==null || sys.trim(tmp_elemtype)==""){
        tmp_elemtype="text";
    }
    list.add(result.search,{
        "en": r.column_name,
        "cn": r.cn_name,
        "elemtype": tmp_elemtype,
        "datatype": tmp_dtype,
        "numrange": tmp_dnumrange,
        "format": tmp_format,
        "unit": tmp_unit,
        "dict": tmp_dict,
        "condition": r.condition
    });
}

result=sys.jsonFromInstance(result);

sys.addRetData(result,"typecontent");

sys.setRetData("0","","typecontent");