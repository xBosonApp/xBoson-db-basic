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
//id:generating_sql
//name:生成SQL语句

var typecd=sys.request.typecd;  //数据集模型id
var did=sys.request.did;    //数据源id
var tablenm=sys.request.tablenm;    //表名
var sqltype=sys.request.sqltype;    //sql操纵类型
var jsondata_str=sys.request.jsondata;  

if(typecd==null || sqltype==null || jsondata_str==null || tablenm==null || did==null){
    sys.setRetData("1");
    return;
}
//jsondata:
// {"wherearea":{"content":"","chkbox":"0","params":[{"column_name":"","name":"","condition":"","andor":"","flag":"","value":""}]},"comm_fields":[{"column_name":"","datatype":"","flag":"","value":""}]}

// flag为0或1，0为预设值，1为参数 
// value：预设值
// column_name:列名， 
// name：参数名 （默认和列名相同）
// condition：where的SQL条件
// chkbox："1"为选中，"0"为非选中
// andor:"AND"或"OR"
var jsondata=sys.instanceFromJson(jsondata_str);

//where条件不能为空
if(sqltype=="D" || sqltype=="U"){
    if(sys.trim(jsondata.wherearea.content)==""){
        sys.setRetData("2","where条件至少包含一个参数");
        return;
    }
}


//根据数据集模型id获取数据集模型字段及其属性
var data=[];
var typetrans=[];
{
    var sqlSel = "select a.en,a.cn,a.must,b.datatype,b.numrange,b.format,b.unit,b.dict,a.elemtype from sys_md_mm002 a,sys_mdm003 b where a.decd=b.decd  and a.typecd=? order by sorting";
    var param = [typecd];
    sql.query(sqlSel,param,"data");
    data=sys.result.data;
    //转换数据类型
    typetrans=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.004101");
    for(r in data){
        for(t in typetrans){
            if(r.datatype==t.id){
                map.put(r,"javatype",t.name);
            }
        }
    }
}
//根据sqltype和其他字段生成sql语句（sqltext字段）
var sqltext="";

if(sqltype=="D"){
    sqltext="delete from "+tablenm+" where "+jsondata.wherearea.content;
}else if(sqltype=="U"){
    sqltext="update "+tablenm+" set ";
    //update语句set字符串
    var set_str="";
    for(r in jsondata.comm_fields){
        // if(sys.trim(r.column_name)==""){
        //     list.remove(jsondata.comm_fields,r);
        //     continue;
        // }
        //判断是参数还是预设值(0为预设值，1为参数)
        if(r.flag=="0"){
            //判断预设值字段是否是数值类型
            var is_num_type=false;
            for(d in data){
                if(r.column_name==d.en && d.javatype=="Double"){
                    is_num_type=true;
                }
            }
            if(is_num_type){
                set_str=set_str+","+r.column_name+"="+r.value;
            }else{
                set_str=set_str+","+r.column_name+"='"+r.value+"'";
            }
            
        }else if(r.flag=="1"){
            set_str=set_str+","+r.column_name+"=?";
        }
    }
    set_str=sys.subString(set_str,1);
    
    sqltext=sqltext+set_str+" where "+jsondata.wherearea.content;
    
}else if(sqltype=="I"){
    //验证insert必填字段
    for(d in data){
        if(d.must=="1"){
            var isfind=false;
            for(c in jsondata.comm_fields){
                if(c.column_name==d.en){
                    isfind=true;
                }
            }
            if(!isfind){
                sys.setRetData("1",d.en+"为"+tablenm+"表的必填字段");
                return;
            }
        }
    }
    //验证列名是否重复
    for(c in jsondata.comm_fields){
        var i=0;
        for(cc in jsondata.comm_fields){
            if(c.column_name==cc.column_name){
                i=i+1;
            }
        }
        if(i==2){
            sys.setRetData("2",c.column_name+"重复了");
            return;
        }
    }
    
    sqltext="insert into "+tablenm+" (";
    //insert语句insert字段及对应的value
    var ins_str="";
    var val_str="";
    for(r in jsondata.comm_fields){
        // if(sys.trim(r.column_name)==""){
        //     list.remove(jsondata.comm_fields,r);
        //     continue;
        // }
        //insert字段
        ins_str=ins_str+","+r.column_name;
        //判断是参数还是预设值(0为预设值，1为参数)
        if(r.flag=="0"){
            //判断预设值字段是否是数值类型
            var is_num_type=false;
            for(d in data){
                if(r.column_name==d.en && d.javatype=="Double"){
                    is_num_type=true;
                }
            }
            if(is_num_type){
                val_str=val_str+","+r.value;
            }else{
                val_str=val_str+",'"+r.value+"'";
            }
            
        }else if(r.flag=="1"){
            val_str=val_str+",?";
        }
    }
    ins_str=sys.subString(ins_str,1);
    val_str=sys.subString(val_str,1);
    sqltext=sqltext+ins_str+") values ("+val_str+")";
}
else if(sqltype=="S"){
    sqltext="select * from "+tablenm;
    if(sys.trim(jsondata.wherearea.content)!=""){
        sqltext=sqltext+" where 1=1 and "+jsondata.wherearea.content;
    }
}

//根据sqltype返回sql参数，同时生成typecontent与多维select模型保持一致
var params=[];  //sql语句参数
var where_params=[];    //where参数
var comm_params=[];  //update参数或insert参数
var tmp_map={},tmp_map2={};

var typecontent={type:[],search:[]};
//where条件参数
//1.手动编辑where时
if(jsondata.wherearea.chkbox=="1"){
    var msg=http.platformPost({"app":"c770045becc04c7583f626faacd3b456","mod":"dmlm","api":"getwhereparaminfo"},{"wheretext":jsondata.wherearea.content}).data;
    if(msg.ret!="0"){
        sys.setRetData(msg.ret,"生成where条件参数异常");
        return;
    }
    for(r in msg.result){
        //where_params
        tmp_map={"column_name":"","name":r.en,"datatype":"","condition":r.condition};
        list.add(where_params,tmp_map);
        //typecontent.search
        tmp_map2={"en":r.en,"cn":"","elemtype":"","datatype":"VARCHAR","numrange":"100","format":"","unit":"","dict":"","condition":r.condition};
        list.add(typecontent.search,tmp_map2);
    }
}
else{
    //2.非手动编辑where时
    for(r in jsondata.wherearea.params){
        //是预设值时，continue
        if(r.flag!="1" && r.flag!="1,0" && r.flag!="0,1" && r.flag!="1,1"){
            continue;
        }
        //andor
        if(r.andor == ""){
            continue;
        }
        //获取列名对应的javatype,elemtype
        var tmp_jtype="";
        var tmp_elemt="";
        var tmp_numra="";
        var tmp_format="";
        var tmp_unit="";
        var tmp_dict="";
        for(d in data){
            if(r.column_name==d.en){
                tmp_jtype=d.datatype;
                tmp_elemt=d.elemtype;
                tmp_numra=d.numrange;
                tmp_format=d.format;
                tmp_unit=d.unit;
                tmp_dict=d.dict;
            }
        }
        map.put(r,"datatype",tmp_jtype);
        map.put(r,"elemtype",tmp_elemt);
        map.put(r,"numrange",tmp_numra);
        map.put(r,"format",tmp_format);
        map.put(r,"unit",tmp_unit);
        map.put(r,"dict",tmp_dict);
        //如果是between或not between，则可能会有两个参数
        if(r.condition=="12" || r.condition=="13"){
            //一个参数
            if(r.flag == "1,0" || r.flag=="0,1"){
                //sqlparams
                tmp_map={"column_name":r.column_name,"name":r.name,"datatype":r.datatype,"condition":r.condition};
                list.add(where_params,tmp_map);
                //typecontent.search
                tmp_map2={"en":r.name,"cn":r.column_name,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"condition":r.condition};
                list.add(typecontent.search,tmp_map2);
            }else if(r.flag=="1,1"){
                //两个参数
                tmp_map={"column_name":r.column_name,"name":r.name+"1","datatype":r.datatype,"condition":r.condition};
                list.add(where_params,tmp_map);
                tmp_map={"column_name":r.column_name,"name":r.name+"2","datatype":r.datatype,"condition":r.condition};
                list.add(where_params,tmp_map);
                //typecontent.search
                tmp_map2={"en":r.name+"1","cn":r.column_name,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"condition":r.condition};
                list.add(typecontent.search,tmp_map2);
                //typecontent.search
                tmp_map2={"en":r.name+"2","cn":r.column_name,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"condition":r.condition};
                list.add(typecontent.search,tmp_map2);
            }else{
                sys.setRetData("2",r+"数据异常");
                return;
            }
        }else{
            //sqlparams
            tmp_map={"column_name":r.column_name,"name":r.name,"datatype":r.datatype,"condition":r.condition};
            list.add(where_params,tmp_map);
            //typecontent.search
            tmp_map2={"en":r.name,"cn":r.column_name,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"condition":r.condition};
            list.add(typecontent.search,tmp_map2);
        }
    }
}

//update字段参数或insert字段参数
if(sqltype=="U"||sqltype=="I"){
    for(r in jsondata.comm_fields){
        if(r.flag=="1"){
            //获取列名对应的javatype,elemtype等字段
            var tmp_jtype="";
            var tmp_elemt="";
            var tmp_numra="";
            var tmp_format="";
            var tmp_unit="";
            var tmp_dict="";
            var tmp_must="";
            for(d in data){
                if(r.column_name==d.en){
                    tmp_jtype=d.datatype;
                    tmp_elemt=d.elemtype;
                    tmp_numra=d.numrange;
                    tmp_format=d.format;
                    tmp_unit=d.unit;
                    tmp_dict=d.dict;
                    tmp_must=d.must;
                }
            }
            //取javatype字段
            // var _javatype="";
            // for(d in data){
            //     if(r.column_name==d.en){
            //         _javatype=d.javatype;
            //     }
            // }
            tmp_map={"column_name":r.column_name,"name":r.column_name,"datatype":tmp_jtype,"condition":""};
            list.add(comm_params,tmp_map);
            //typecontent.type
            tmp_map2={"en":r.column_name,"cn":r.column_name,"must":tmp_must,"elemtype":tmp_elemt,"datatype":tmp_jtype,"numrange":tmp_numra,"format":tmp_format,"unit":tmp_unit,"dict":tmp_dict,"api_func":r.api_func};
            list.add(typecontent.type,tmp_map2);
        }
    }
}
if(sqltype=="S"){
    //循环所有列
    for(r in data){
        list.add(typecontent.type,{"en":r.en,"cn":r.cn,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict});
    }
}

// sys.printValue(comm_params);

//将sql语句参数合并到params中
if(sqltype=="D"){
    params=where_params;
}else if(sqltype=="U"){
    for(u in comm_params){
        list.add(params,u);
    }
    for(w in where_params){
        list.add(params,w);
    }
}else if(sqltype=="I"){
    params=comm_params;
}else if(sqltype=="S"){
    params=where_params;
}
//测试sql语句是否正确
var iscatch=false,catchmsg="";
if(did!="00000000000000000000000000000000"){
    //连接数据源
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
var testSqlParams=[];
var testSqlText=sqltext;
if(sqltype=="I"||sqltype=="U"){
    for(r in typecontent.type){
        var _javatype="";
        for(t in typetrans){
            if(t.id==r.datatype){
                _javatype=t.name;
            }
        }
        if(_javatype==""){
            sys.setRetData("2","获取不到datatype对应的javatype");
            return;
        }
        //测试值
        var testval;
        if(_javatype=="Date"){
            testval=sys.currentTimeString();     
        }else if(_javatype=="Double"){
            testval=0;
        }else{
            testval=" ";
        }
        if(r.api_func!=""){
            if(r.api_func=="uuid"){
                list.add(testSqlParams,sys.uuid());
            }else if(r.api_func=="currentTimeString"){
                list.add(testSqlParams,sys.currentTimeString());
            }else if(r.api_func=="nextId"){
                list.add(testSqlParams,sys.nextId());
            }else if(r.api_func=="getUserIdByOpenId"){
                list.add(testSqlParams,"userid");
            }else if(r.api_func=="getUserIdByPID"){
                list.add(testSqlParams,"userName");
            }else if(r.api_func=="getUserPID"){
                list.add(testSqlParams,"getUserPID");
            }else{
                sys.setRetData("2","api_func："+r.api_func+"异常！");
                return;
            }
        }else{
            list.add(testSqlParams,testval);
        }
    }
}

sys.printValue("typecontent.search=");
sys.printValue(typecontent.search);
for(r in typecontent.search){
    var _javatype="";
    for(t in typetrans){
        if(t.id==r.datatype){
            _javatype=t.name;
        }
    }
    if(_javatype==""){
        sys.setRetData("2","获取不到datatype对应的javatype");
        return;
    }
    //测试值
    var testval;
    if(_javatype=="Date"){
        testval=sys.currentTimeString();     
    }else if(_javatype=="Double"){
        testval=0;
    }else{
        testval=" ";
    }
    if(r.condition=="10"||r.condition=="11"){
        testSqlText=sys.replace(testSqlText,"{"+r.en+"}","('"+testval+"')");
    }else{
        testSqlText=sys.replace(testSqlText,"{"+r.en+"}","'"+testval+"'");
    }
}
iscatch=false;
try{
    if(sqltype!="S"){
        sql.update(testSqlText,testSqlParams,"1");
    }else{
        sql.query(testSqlText,testSqlParams);
    }
}catch(e){
    iscatch=true;
    catchmsg=e.cause.message;
}
//如果发生异常，则返回sql语句错误
if(iscatch){
    if (sqltype!="S") {
      sql.rollback(); 
    }
    sys.setRetData("2","sql语句语法错误或参数不匹配，SQL语句："+testSqlText+" "+catchmsg);
    sys.printValue("参数："+testSqlParams);
    return;
}

if (sqltype!="S") {
  sql.rollback(); 
}
//将params变成字符串
params=sys.jsonFromInstance(params);
//typecontent
typecontent=sys.jsonFromInstance(typecontent);

//返回生成的sql语句和sql参数
sys.addRetData([{"sqltext":sqltext,"sqlparams":params,"typecontent":typecontent}],"result");
sys.setRetData("0","","result");