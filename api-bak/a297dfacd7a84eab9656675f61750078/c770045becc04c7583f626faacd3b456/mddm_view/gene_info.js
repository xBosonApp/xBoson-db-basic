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
//生成 sqlparams,typecontent等信息

var org=sys.request.org;
var did=sys.request.did;
var editingtype=sys.request.editingtype; //"1"为手动编辑SQL语句,"0"为非手动编辑
var jsondata_select=sys.request.jsondata_select;    //select部分的JSON
var fromcontent=sys.request.fromcontent;    //from字符串
var jsondata_where=sys.request.jsondata_where;  //where部分的JSON
var sel_whe_columns=sys.request.sel_whe_columns;  //选择的表和列
var sqltext=sys.request.sqltext;
var chart_type=sys.request.chart_type;
var first_is_x=sys.request.first_is_x;  //手写SQL的第一列是否为X轴

var typecontent={"type":[],"search":[]};    //typecontent

if(did==null||editingtype==null||sqltext==null){
    sys.setRetData("1");
    return;
}
if(chart_type==null){
    chart_type="";
}

var jsondataObj=sys.instanceFromJson(jsondata_select);
var jsondata_whereObj=sys.instanceFromJson(jsondata_where);
var sel_whe_columnsObj=sys.instanceFromJson(sel_whe_columns);

//type结构
// [{
//     "en": "en3",
//     "cn": "统计B",
//     "view": "是否显示:1",
//     "ro": "是否只读:1",
//     "must": "是否必须输入(sys_md_mm002):1",
//     "search": "是否检索条件:1",
//     "elemtype": "元素标签类型",
//     "datatype": "数据类型",
//     "numrange": "数据长度",
//     "format": "显示格式",
//     "unit": "单位",
//     "dict": "字典类别(typecd)",
//     "chart": "bar"
// }]
// search结构
// [{
//     "en": "enName1",
//     "cn": "名称1",
//     "elemtype": "元素标签类型",
//     "datatype": "数据类型",
//     "numrange": "数据长度",
//     "format": "显示格式",
//     "unit": "单位",
//     "dict": "字典类别(typecd)"
// }]
if(editingtype=="0"){
    //1.判断select别名是否重复
    var select_alias_name=[];
    for(r in jsondataObj){
        list.add(select_alias_name,r.alias_name);
    }
    var tmp_alias_name="";
    for(r in select_alias_name){
        if(sys.trim(r)==""){
            sys.setRetData("2","别名["+r+"]为空！");
            return;
        }
        if(tmp_alias_name==r){
            sys.setRetData("2","别名["+r+"]重复！");
            return;
        }
        tmp_alias_name=r;
    }
    
    //2.扩充sel_whe_columnsObj中的列信息
    var tbl=[];  //存在数据集的表
    var tbl_typecd={}; //表和typecd映射
    //扩充sel_whe_columnsObj中的列信息
    //获取表名与typecd的映射
    var chkds="select typecd from sys_md_mm003 where did=? and en=? and status='1'";
    for(r in sel_whe_columnsObj){
        if(list.contain(tbl,r.table_name)){
        }else{
           sql.query(chkds,[did,r.table_name],"chkds_r");
           if(sys.size(sys.result.chkds_r)>0){
               list.add(tbl,r.table_name);
               map.put(tbl_typecd,r.table_name,sys.result.chkds_r[0].typecd);
           }
        }
    }
    
    var getinfo="select a.en,a.must,a.elemtype,b.format,b.unit,b.dict from sys_md_mm002 a,sys_mdm003 b where a.typecd=? and a.decd=b.decd and a.status='1' and b.status='1' order by a.sorting";
    for(r in sel_whe_columnsObj){
        var _typecd=null;
        if(list.contain(tbl,r.table_name)){
            _typecd=tbl_typecd[r.table_name];
        }
        //如果有typecd，则取出must,elemtype,format,unit,dict等值
        if(_typecd != null){
            sql.query(getinfo,[_typecd],"info_r");
            var info_r=sys.result.info_r;
            if(sys.size(info_r)>0){
                for(_c in r.column_info){
                    for(_r in info_r){
                        if(_c.column_name==_r.en){
                            map.put(_c,"must",_r.must);
                            map.put(_c,"elemtype",_r.elemtype);
                            map.put(_c,"format",_r.format);
                            map.put(_c,"unit",_r.unit);
                            map.put(_c,"dict",_r.dict);
                        }
                    }
                }
            }
        }
    }
    
    //3.为typecontent字段赋值
    //非手动编辑时，为typecontent赋值
     //typecontent.type
    for(r in jsondataObj){
       //选择select出的字段
    //   if(r.is_select!="1"){
    //       continue;
    //   }
       var tmp={"en":r.alias_name,"cn":r.column_name_cn,"view":r.is_view,"ro":r.is_readonly,"must":"0","elemtype":"","datatype":r.datatype,"numrange":r.numrange,"format":"","unit":"","dict":"","chart":r.chart};
       //检查这个表是否有数据集,并返回typecd
       var _typecd=null;
       if(list.contain(tbl,r.table_name)){
           _typecd=tbl_typecd[r.table_name];
       }
       //如果有typecd，则取出must,elemtype,format,unit,dict等值
       if(_typecd != null){
           for(_r in sel_whe_columnsObj){
               if(_r.table_name==r.table_name){
                   for(_c in _r.column_info){
                       if(_c.column_name==r.column_name){
                           map.put(tmp,"must",_c.must);
                           map.put(tmp,"elemtype",_c.elemtype);
                           map.put(tmp,"format",_c.format);
                           map.put(tmp,"unit",_c.unit);
                           map.put(tmp,"dict",_c.dict);
                       }
                   }
               }
           }
       }
       //typecontent.type
      list.add(typecontent.type,tmp);
    }
    //typecontent.serach
    for(w in jsondata_whereObj.params){
        if(sys.contain(w.flag,"1")){
            var _tmp={};
            var isbreak=false;
            for(t in sel_whe_columnsObj){
                if(isbreak){
                    isbreak=false;
                    break;
                }
                if(t.table_name==w.table_name){
                    for(c in t.column_info){
                        if(w.column_name==c.column_name){
                            _tmp={"en":w.name,"cn":c.cn_name,"elemtype":w.elemtype,"datatype":c.datatype,"numrange":c.numrange,"format":c.format,"unit":c.unit,"dict":c.dict,"condition":w.condition};
                            isbreak=true;
                            break;
                        }
                    }
                }
            }
            //between, not between
            if(w.condition=="12" || w.condition=="13"){
                //1,1和1都表示两个参数
                if(w.flag=="1,1" || w.flag=="1"){
                    if(w.elemtype!="date"){
                        //typecontent.search
                        map.put(_tmp,"en",w.name+"1");
                        map.put(_tmp,"cn",w.name+"（开始）");
                        list.add(typecontent.search,_tmp);      //第一个参数
                        
                        var tmpMap={};
                        map.putAll(tmpMap,_tmp);
                        map.put(tmpMap,"en",w.name+"2");
                        map.put(tmpMap,"cn",w.name+"（结束）");
                        list.add(typecontent.search,tmpMap);    //第二个参数
                    }else{
                        //typecontent.search
                        map.put(_tmp,"en",w.name);
                        list.add(typecontent.search,_tmp);
                    }
                }
            }
            //is null, is not null
            else if(w.condition=="14" || w.condition=="15"){
                continue;
            }
            //其他
            else{
                //typecontent.search
                list.add(typecontent.search,_tmp);
            }
        }
    }
}
//手动编辑sql语句时
else if(editingtype == "1"){
    //typecontent.type
    if(did != "00000000000000000000000000000000"){
        sql.connection(did);
    }
    var CInfo=[],Csql="";
    var iscatch=false,catmsg="";
    try{
        //将in , not in条件替换成1=2， 而不是替换成?,例如a in {a}变成1=2
        Csql=sys.regexReplaceAll("(?i)(\\S)+\\s*((IN)|(NOT IN))\\s*\\{\\S+\\}",sqltext," 1=2 ");
        //将其他{参数占位符}替换为?
        Csql=sys.regexReplaceAll("\\{\\S+\\}",Csql,"?");
        CInfo=sql.metaData(Csql);
    }catch(e){
        iscatch=true;
        catmsg=e.cause.message;
    }
    if(iscatch){
        sys.setRetData("2",Csql+" "+catmsg);
        return;
    }
    
    if(sys.size(CInfo)>0){
        //获取did的数据库类型
        var dbtype=se.dbType();
        var dsource=se.getCache(_CACHE_REGION_JDBC_CONNECTION_,org+":"+did);
        if(dbtype==null || dbtype==""){
           sys.setRetData("2","获取数据库类型异常！");
           return;
        }
        var outToPlat=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0014"+dbtype+"3");
        var _index=0;
        for(c in CInfo){
            //numrange
            var _numrange=c.Precision+"";
            if(c.Scale!=0){
                _numrange=_numrange+","+c.Scale;
            }
            // datatype
            //外部数据源类型转平台数据类型
            var _datatype="";
            for(t in outToPlat){
               if(sys.toLowerCase(t.id)==sys.toLowerCase(c.ColumnTypeName)){
                   _datatype=t.name;
               }
            }
            var _tmp={
                "en":c.ColumnLabel,
                "cn":c.ColumnLabel,
                "view":"1",
                "ro":"0",
                "must":"1",
                "elemtype":"text",
                "datatype":_datatype,
                "numrange":_numrange,
                "format":"",
                "unit":"",
                "dict":"",
                "chart":chart_type
            };
            
            if(_index==0 && first_is_x=="1"){
                map.put(_tmp,"chart","");
            }
            sys.printValue("_tmp=",_tmp);
            list.add(typecontent.type,_tmp);
            _index=_index+1;
        }
    }
    //恢复数据库连接
    sql.connection();
    //typecontent.search
    var msg=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"dmlm","api":"getwhereparaminfo"},{"wheretext":sqltext});
    if(msg.data.ret!="0"){
        sys.setRetData(msg.data.ret,"生成where条件参数异常");
        return;
    }
    for(r in msg.data.result){
        var _tmp={"en":r.en,"cn":r.en,"elemtype":"text","datatype":"","numrange":"","format":"","unit":"","dict":"","condition":r.condition};
        list.add(typecontent.search,_tmp);
    }
}
//测试执行sql语句
//用参数替换sql语句
var tmpSqltext=sqltext;
sys.printValue("tmpSqltext=",tmpSqltext);
if(sys.size(typecontent.search)>0){
    sys.printValue(typecontent.search);
    for(r in typecontent.search){
        if(r.elemtype=="date" && (r.condition=="12" || r.condition=="13")){
            tmpSqltext=sys.replace(tmpSqltext,"{"+r.en+"}","' ' and ' '");
        }else if(r.condition=="10" || r.condition=="11"){
            tmpSqltext=sys.replace(tmpSqltext,"{"+r.en+"}","(' ')");
        }else{
            tmpSqltext=sys.replace(tmpSqltext,"{"+r.en+"}","' '");
        }
    }
}
sys.printValue("tmpSqltext2=",tmpSqltext);
if(did!="00000000000000000000000000000000"){
    var iscatch=false;
    try{
        sql.connection(did);
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("1","连接数据源（"+did+"）异常！");
        return;
    }
}
var iscatch=false,catchmsg="";
try{
    sys.printValue("sqltext=",sqltext);
    sql.query(tmpSqltext,null);
    //恢复数据库连接
    sql.connection();
}catch(e){
    iscatch=true;
    catchmsg=e.cause.message;
}
if(iscatch){
    sys.setRetData("2","sql语句语法错误："+catchmsg+" sqltext= "+tmpSqltext+"     sqlparam="+typecontent.search);
    return;
}
//返回typecontent
sys.addRetData(typecontent,"typecontent");
sys.setRetData("0","","typecontent");