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
//id:generate_default
//name:生成默认操纵模型

//获取参数
var org=sys.request.org;
var dstypecd=sys.request.typecd;    //数据集模型ID
var did=sys.request.did;    //数据源ID
var tablenm=sys.request.en;    //表名

var dt=sys.currentTimeString();
if(dstypecd==null){
    sys.setRetData("1");
    return;
}
if(did==null || tablenm==null){
    //根据数据集模型id获取表名及数据源id
    var getdidtbl="select did,en from sys_md_mm003 where typecd=? and status='1' order by did";
    sql.query(getdidtbl,[dstypecd],"didtbl_r");
    if(sys.size(sys.result.didtbl_r)>0){
        did=sys.result.didtbl_r[0].did;
        tablenm=sys.result.didtbl_r[0].en;
    }
}

//根据数据集模型id获取表字段信息
var getcolinfo="select a.decd,a.en,a.cn,a.mk,a.must,a.dv,a.sorting,a.elemtype,b.datatype,b.numrange,b.format,b.unit,b.dict from sys_md_mm002 a,sys_mdm003 b where a.typecd=? and a.decd=b.decd and a.status='1' and b.status='1' order by a.sorting";
var dsinfo_cnt=sql.query(getcolinfo,[dstypecd],"dsinfo_r");
var dsinfo_r=sys.result.dsinfo_r;
if(dsinfo_cnt==0){
    sys.setRetData("2");
    return;
}
var mk=[];  //主键
var allColumns=[]; //所有列字段
for(r in dsinfo_r){
    if(r.mk=="1"){
        list.add(mk,r);
    }
    list.add(allColumns,r);
}

//insert语句
var ins="insert into sys_bm002 (modolcd,modolnm,dstypecd,did,tablenm,sqltype,sqltext,sqlparams,jsondata,typecontent,isui,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
var params=[];
//DELETE业务模型
var modolcd_D=dstypecd+".base"+".D";   //业务模型ID
//检查主键是否存在
if(sql.query("select modolcd from sys_bm002 where modolcd=?",[modolcd_D])>0){
    modolcd_D=dstypecd+".base"+sys.randomNumber(3)+".D";
}
var modolnm=tablenm+"-delete";  //业务模型名称
var sqltext="delete from "+tablenm+" where 1=1 ";   //业务SQL语句
var sqlparams="";   //sql参数json字符串
var typecontent={type:[],search:[]}; //typecontent
//[{column_name:"",name:"",datatype:"",condition:“”},{column_name:"",name:"",datatype:"",condition:“”}]
var tmp_list=[];
var tmp_list_where=[];
var tmp_map={};
var where_str="";
for(r in mk){
    where_str=where_str+" and "+r.en+"={"+r.en+"}";
    tmp_map={"column_name":r.en,"name":r.en,"datatype":r.datatype,"condition":"01"};
    list.add(tmp_list,tmp_map);
    tmp_map={"column_name":r.en,"name":r.en,"condition":"01","andor":"AND","flag":"1","value":[]};
    list.add(tmp_list_where,tmp_map);
    //typecontent.search
    tmp_map={"en":r.en,"cn":r.cn,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"condition":"01"};
    list.add(typecontent.search,tmp_map);
}
sqltext=sqltext+where_str;
sqlparams=sys.jsonFromInstance(tmp_list);
where_str=sys.subString(where_str,4);
//,"chkbox":"0","params":[{"column_name":"","name":"","condition":"","andor":"","flag":"","value":""}
var jsondata={"wherearea":{"content":where_str,"chkbox":"0","params":tmp_list_where},"comm_fields":[]};
jsondata=sys.jsonFromInstance(jsondata);
typecontent=sys.jsonFromInstance(typecontent);

params=[modolcd_D,modolnm,dstypecd,did,tablenm,"D",sqltext,sqlparams,jsondata,typecontent,"1","1",null,dt,dt];
sql.update(ins,params,"1");

//Insert业务模型
var modolcd_I=dstypecd+".base"+".I";   //业务模型ID
//检查主键是否存在
if(sql.query("select modolcd from sys_bm002 where modolcd=?",[modolcd_I])>0){
    modolcd_I=dstypecd+".base"+sys.randomNumber(3)+".I";
}
modolnm=tablenm+"-insert";
sqltext="insert into "+tablenm+"(";   //业务SQL语句
sqlparams="";   //sql参数json字符串
typecontent={type:[],search:[]}; //typecontent
//[{column_name:"",name:"",datatype:"",condition:“”},{column_name:"",name:"",datatype:"",condition:“”}]
tmp_list=[];
var tmp_list_comm_fields=[];
tmp_map={};
var tmp_col=""; //列名
var tmp_param="";   //参数?
for(r in allColumns){
    tmp_col=tmp_col+","+r.en;
    tmp_param=tmp_param+",?";
    tmp_map={"column_name":r.en,"name":r.en,"datatype":r.datatype,"condition":""};
    list.add(tmp_list,tmp_map);
    tmp_map={"column_name":r.en,"datatype":"","flag":"1","value":""};
    list.add(tmp_list_comm_fields,tmp_map);
    //typecontent.type
    tmp_map={"en":r.en,"cn":r.cn,"must":r.must,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict};
    list.add(typecontent.type,tmp_map);
}
sqltext=sqltext+sys.subString(tmp_col,1)+") values ("+sys.subString(tmp_param,1)+")";
sqlparams=sys.jsonFromInstance(tmp_list);
jsondata={"wherearea":{"content":"","chkbox":"0","params":[]},"comm_fields":tmp_list_comm_fields};
jsondata=sys.jsonFromInstance(jsondata);
typecontent=sys.jsonFromInstance(typecontent);

params=[modolcd_I,modolnm,dstypecd,did,tablenm,"I",sqltext,sqlparams,jsondata,typecontent,"1","1",null,dt,dt];
sql.update(ins,params,"1");

//Update业务模型
var modolcd_U=dstypecd+".base"+".U";   //业务模型ID
//检查主键是否存在
if(sql.query("select modolcd from sys_bm002 where modolcd=?",[modolcd_U])>0){
    modolcd_U=dstypecd+".base"+sys.randomNumber(3)+".U";
}
modolnm=tablenm+"-update";
sqltext="update "+tablenm+" set ";   //业务SQL语句
sqlparams="";   //sql参数json字符串
typecontent={type:[],search:[]}; //typecontent
//[{column_name:"",name:"",datatype:"",condition:“”},{column_name:"",name:"",datatype:"",condition:“”}]
tmp_list=[];    //insert项目
tmp_map={};
var tmp_list1=[];   //where条件
var total=[];   //整个sql语句的参数
var tmp_col_para=""; //列名参数?
var tmp_pk="";   //主键参数?
for(r in allColumns){
    tmp_col_para=tmp_col_para+","+r.en+"=?";
    //为tmp_list添加元素
    tmp_map={"column_name":r.en,"datatype":r.datatype,"flag":"1","value":""};
    list.add(tmp_list,tmp_map);
    //为total添加元素
    tmp_map={"column_name":r.en,"name":r.en,"datatype":r.datatype,"condition":""};
    list.add(total,tmp_map);
    //typecontent.type
    tmp_map={"en":r.en,"cn":r.cn,"must":r.must,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict};
    list.add(typecontent.type,tmp_map);
}
for(r in mk){
    tmp_pk=tmp_pk+" and "+r.en+"={"+r.en+"}";
    tmp_map={"column_name":r.en,"name":r.en,"condition":"01","andor":"AND","flag":"1","value":[]};
    list.add(tmp_list1,tmp_map);
    //为total添加元素
    tmp_map={"column_name":r.en,"name":r.en,"datatype":r.datatype,"condition":""};
    list.add(total,tmp_map);
    //typecontent.search
    tmp_map={"en":r.en,"cn":r.cn,"elemtype":r.elemtype,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"condition":"01"};
    list.add(typecontent.search,tmp_map);
}
sqltext=sqltext+sys.subString(tmp_col_para,1)+" where 1=1 "+tmp_pk;
tmp_pk=sys.subString(tmp_pk,4);
jsondata={"wherearea":{"content":tmp_pk,"chkbox":"0","params":tmp_list1},"comm_fields":tmp_list};

jsondata=sys.jsonFromInstance(jsondata);

sqlparams=sys.jsonFromInstance(total);
typecontent=sys.jsonFromInstance(typecontent);

params=[modolcd_U,modolnm,dstypecd,did,tablenm,"U",sqltext,sqlparams,jsondata,typecontent,"1","1",null,dt,dt];
sql.update(ins,params,"1");

//Select业务模型
var modolcd_S=dstypecd+".base"+".S";   //业务模型ID
//检查主键是否存在
if(sql.query("select modolcd from sys_bm002 where modolcd=?",[modolcd_S])>0){
    modolcd_S=dstypecd+".base"+sys.randomNumber(3)+".S";
}
modolnm=tablenm+"-select";
sqltext="select * from "+tablenm+" where 1=1";   //业务SQL语句
sqlparams=[];   //sql参数
typecontent={type:[],search:[]}; //typecontent
//页面的jsondata
jsondata={"wherearea":{"content":"","chkbox":"0","params":[]},"comm_fields":[]};
//循环主键列
for(r in mk){
    //jsondata.wherearea.content
    map.put(jsondata.wherearea,"content",jsondata.wherearea.content+" and "+r.en+"={"+r.en+"}");
    //sqltext
    sqltext=sqltext+" and "+r.en+"={"+r.en+"}";
    //sqlparams
    list.add(sqlparams,{"column_name":r.en,"name":r.en,"datatype":r.datatype,"condition":"01"});
    //typecontent.search
    list.add(typecontent.search,{"en":r.en,"cn":r.cn,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict,"elemtype":r.elemtype,"condition":"01"});
    //jsondata.wherearea.params
    list.add(jsondata.wherearea.params,{"column_name":r.en,"name":r.en,"condition":"01","andor":"AND","flag":"1","value":[]});
}
//循环所有列
for(r in allColumns){
    list.add(typecontent.type,{"en":r.en,"cn":r.cn,"datatype":r.datatype,"numrange":r.numrange,"format":r.format,"unit":r.unit,"dict":r.dict});
}

//去掉wherecontent的前4个字符
map.put(jsondata.wherearea,"content",sys.subString(jsondata.wherearea.content,4));
params=[modolcd_S,modolnm,dstypecd,did,tablenm,"S",sqltext,sys.jsonFromInstance(sqlparams),sys.jsonFromInstance(jsondata),sys.jsonFromInstance(typecontent),"1","1",null,dt,dt];
sql.update(ins,params,"1");

// sql.commit();

// 为所有开发角色加上模型权限
var typecdArr = [modolcd_D,modolcd_I,modolcd_U,modolcd_S];
var typecdArrStr = sys.jsonFromInstance(typecdArr);
var GetRes = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"dev_auth"},{"typecdArr":typecdArrStr});
if(GetRes["data"].ret != "0"){
    sql.rollback(); //回滚事务
    sys.setRetData(GetRes["data"].ret,GetRes["data"].msg);
    return;
}
// 更新缓存
for(modolcd in typecdArr){
    var getRes = "select modolcd typecd,modolnm name,dstypecd,did,tablenm,sqltype,sqltext,sqlparams,typecontent,isui from sys_bm002 where modolcd=?";
    sql.query(getRes,[modolcd],"modelR");
    map.put(sys.result.modelR[0],"org",org);
    map.put(sys.result.modelR[0],"model_type","bm002");
    se.setCache(_CACHE_REGION_BIZ_MODEL_,modolcd,sys.result.modelR[0],0);
}


sys.setRetData("0");