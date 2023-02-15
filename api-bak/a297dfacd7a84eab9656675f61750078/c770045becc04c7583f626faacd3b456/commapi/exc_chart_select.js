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
//id:exc_chart_select
//name:执行图表查询api(测试)
var modolcd=sys.request.modolcd;
//"0"为取SQL语句执行结果，"1"为取模型对应的物理表，默认为"0"
var _source=sys.request._source;
//OrderBy-[['a',0],['b',1]]  0:ASC,1:DESC
var _orderby=sys.request._orderby;
//分页(只有_source=="1"时，分页参数才起作用，_source=="0"时，数据全返回)
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;

var request=sys.request;
if(modolcd==null){
    sys.setRetData("1");
    return;
}
if(_source==null){
    _source="0";
}
// 模型信息
var modelInfo = se.getCache(_CACHE_REGION_BIZ_MODEL_,modolcd);
if (modelInfo==null) {
  sys.setRetData("2","抱歉，该业务模型不存在");
  return;
}
//验证权限
// var auth_res = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"auth_check"},{"typecd":modolcd,"__uri__":http.uri()});
// if(auth_res["data"].ret == "0"){
//     if(!auth_res["data"].result[0].isAuth){
//         sys.setRetData("2","无模型权限！");
//         return;
//     }
// }else{
//     sys.setRetData(auth_res["data"].ret,auth_res["data"].msg);
//     return;
// }
if (!se.isAuthorizedBizModel(modolcd)) {
  sys.setRetData("2","抱歉，您暂时没有执行该业务模型的权限");
  return;
}

//json字符串
var tablesource=modelInfo.tablesource;
var table_json=modelInfo.table_json;
var row_json=modelInfo.row_json;
var column_json=modelInfo.column_json;
var where_json=modelInfo.where_json;
var typecontent=modelInfo.typecontent;
//json对象
var row_jsonObj=sys.instanceFromJson(row_json);
var column_jsonObj=sys.instanceFromJson(column_json);
var where_jsonObj=sys.instanceFromJson(where_json);
var typecontentObj=sys.instanceFromJson(typecontent);
var table_jsonObj=sys.trim(table_json)=="" ?null:sys.instanceFromJson(table_json);

if(_source=="0"){
    //视图模型信息
    var modelInfoView = se.getCache(_CACHE_REGION_BIZ_MODEL_,modelInfo.typecd_parent);
    if(modelInfoView==null){
        sys.setRetData("2");
        return;
    }
    
    var view_tbl_exist=false;   //视图模型物理表是否存在
    var view_tbl_json=""; //视图模型物理表信息
    var view_tbl_jsonObj=null;
    var view_tbl="";//视图模型物理表名
    var view_sql=""; //视图sql
    var view_typecontent=""; //返回的type和search
    
    var view_typecontentObj=null;
    if(sys.trim(modelInfoView.table_json)!=""){
        view_tbl_exist=true;
        view_tbl_json=modelInfoView.table_json;
        view_tbl_jsonObj=sys.instanceFromJson(view_tbl_json);
        view_tbl=view_tbl_jsonObj.en;
    }else{
        view_sql=modelInfoView.sqltext;
        view_typecontent=modelInfoView.typecontent;
        view_typecontentObj=sys.instanceFromJson(view_typecontent);
    }
    //获取子查询SQL或视图模型物理表
    var tmp_table_sql="";
    var iscatch=false,catchmsg="";
    try{
        var _did="";
        if(modelInfo.tablesource!="" && view_tbl_exist){
            tmp_table_sql=view_tbl;
            _did=view_tbl_jsonObj.did;
        }
        else{
            tmp_table_sql="("+view_sql+") tmp";
            _did=modelInfoView.did;
        }
        if (sys.request.conn) {
          var _t_did = require("./lib").getDidFrom(sys);
          if (_t_did) _did = _t_did;
        }
        if(_did!="00000000000000000000000000000000"){
            sql.connection(_did);
        }
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sys.setRetData("2","数据源连接失败！");
        return;
    }
    
    //获取追加的where条件片段
    var add_where=where_jsonObj.add_where_content;
    
    //行定义为自定义设置时
    var data=[];
    
    try{
        if(row_jsonObj[0].where_group=="1"){
            //循环获取执行sql
            //二维数组
            var sqlList=[];
            var sqltext="";
            //循环行
            for(r in row_jsonObj){
                //循环列
                var tmpList=[];
                for(c in column_jsonObj){
                    sqltext="select "+c.column_content+" from "+tmp_table_sql+" where 1=1 ";
                    //追加的where条件
                    if(add_where != ""){
                        sqltext=sqltext+" and "+add_where;
                    }
                    //列定义的where条件
                    if(sys.trim(c.where_area) != ""){
                        sqltext=sqltext+" and "+c.where_area;
                    }
                    //行定义的where条件
                    if(sys.trim(r.where.where_area) != ""){
                        sqltext=sqltext+" and "+r.where.where_area;
                    }
                    //替换sql参数
                    for(item in typecontentObj.search){
                        // 参数为null时，不作为where条件(不包含between,not between)
                        if(request[item.en] == null){
                            if(item.condition!='12'&&item.condition!='13'){
                                sqltext=sys.regexReplaceAll("(?i)(\\S)+\\s*((=)|(!=)|(<>)|(>)|(<)|(>=)|(<=)|(LIKE)|(NOT LIKE)|(IN)|(NOT IN))\\s*\\{"+item.en+"\\}",sqltext," 1=1 ");
                                //预防手写SQL时，between不会替换成功
                                sqltext=sys.replace(sqltext,"{"+item.en+"}","''");
                                continue;
                            }
                        }
                        //（特殊情况）元素标签类型为date的参数为 "'2010-01-01' and '2010-03-03'"
                        if(item.elemtype=="date"){
                            var _paramObj=null;
                            try{
                                _paramObj=sys.instanceFromJson(request[item.en]);
                            }catch(e){
                                iscatch=true;
                            }
                            if(iscatch){
                                sys.setRetData("2",item.en+"参数格式为"+"{'dt_type':'',dt_from:'',dt_to:'','flg':''}");
                                return;
                            }
                            //_paramObj为null时
                            if(_paramObj==null){
                                sys.setRetData("2",item.en+"参数格式为"+"{'dt_type':'',dt_from:'',dt_to:'','flg':''}");
                                return;
                            }
                            var _dt_to=_paramObj.dt_to;
                            //时间点时dt_to加1
                            if(_paramObj.flg=="0" || _paramObj.flg==0){
                                var _tmp_num=0;
                                if(_paramObj.dt_type=="1" || _paramObj.dt_type==1){
                                    _tmp_num=sys.parseInt(sys.subStringTo(_dt_to,0,4))+1;
                                    _dt_to=_tmp_num+sys.subString(_dt_to,4);
                                }else if(_paramObj.dt_type=="2" || _paramObj.dt_type==2){
                                    //todo:季
                                }else if(_paramObj.dt_type=="3" || _paramObj.dt_type==3){
                                    _tmp_num=sys.parseInt(sys.subStringTo(_dt_to,5,7))+1;
                                    if(_tmp_num<10){
                                        _tmp_num="0"+_tmp_num;
                                    }
                                    _dt_to=sys.subStringTo(_dt_to,0,5)+_tmp_num+sys.subString(_dt_to,7);
                                }else if(_paramObj.dt_type=="4" || _paramObj.dt_type==4){
                                    _tmp_num=sys.parseInt(sys.subString(_dt_to,8))+1;
                                    if(_tmp_num<10){
                                        _tmp_num="0"+_tmp_num;
                                    }
                                    _dt_to=sys.subStringTo(_dt_to,0,8)+_tmp_num;
                                }
                            }
                            //替换参数：between的时候
                            if(item.condition=="12" || item.condition=="13"){
                                sqltext=sys.replace(sqltext,"{"+item.en+"}","'"+_paramObj.dt_from+"' and '"+_dt_to+"'");
                            }
                            //in, not in 
                            else if(item.condition=="10" || item.condition=="11"){
                                sqltext=sys.replace(sqltext,"{"+item.en+"}","('"+_paramObj.dt_from+"')");
                            }
                            else{
                                sqltext=sys.replace(sqltext,"{"+item.en+"}","'"+_paramObj.dt_from+"'");
                            }
                        }
                        //IN,NOT IN
                        else if(item.condition=="10"||item.condition=="11"){
                            // if(sys.startWith(request[item.en],"'")||sys.startWith(request[item.en],"\"")){
                            // }else{
                            //     sys.setRetData("2","IN,NOT IN的参数为字符串（逗号分隔的每一项需要引着引号） eg:'123' ");
                            //     return;
                            // }
                            // sqltext=sys.replace(sqltext,"{"+item.en+"}","("+request[item.en]+")");
                            
                            var in_list=sys.split(request[item.en],",");
                            var in_string="";
                            for(rr in in_list){
                                in_string=in_string+",'"+rr+"'";
                            }
                            in_string=sys.subString(in_string,1);
                            sqltext=sys.replace(sqltext,"{"+item.en+"}","("+in_string+")");
                        }else{
                            sqltext=sys.replace(sqltext,"{"+item.en+"}"," '"+request[item.en]+"' ");
                        }
                    }
                    list.add(tmpList,sqltext);
                }
                //将一行中每个单元格的sql放到tmpList,在将tmpList放到sqlList里
                list.add(sqlList,tmpList);
            }
            
            //循环执行sql语句,获取结果集
            var num=0;
            for(rList in sqlList){
                var _tmpMap={};
                map.put(_tmpMap,"first_column",row_jsonObj[num].name);//???
                for(r in rList){
                    sql.query(r,null);
                    var _result=sys.result.result;
                    if(sys.size(_result)==0){
                        sys.setRetData("2","接口异常");
                        return;
                    }
                    map.putAll(_tmpMap,_result[0]);
                    // list.add(data,_result[0]);
                }
                list.add(data,_tmpMap);
                num=num+1;
            }
        }
        //行定义为group by时
        else if(row_jsonObj[0].where_group=="2"){
            //循环获取执行sql
            //一维数组
            var sqlList=[];
            var sqltext="";
            //处理group by 内容
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
            //不改变大小写
            _groupby=sys.subString(sys.trim(row_jsonObj[0].group.groupby_area),5);
            _groupby=sys.subString(sys.trim(_groupby),2);
            //可以group by 多个列 eg:['aa','bb']    行名称为：别名
            var _groupbyArr = sys.split(sys.trim(_groupby),",");  
            //转换为 eg:['aa','别名']    行名称为：别名
            var _groupbyArr2 = sys.split(sys.trim(_groupby),",");
            list.removeAt(_groupbyArr2,sys.size(_groupbyArr2)-1);
            list.add(_groupbyArr2,row_jsonObj[0].name);
            
            //循环列
            for(c in column_jsonObj){
                sqltext="select "+_groupby+" AS "+row_jsonObj[0].name+","+c.column_content+" from "+tmp_table_sql+" where 1=1 ";
                //追加的where条件
                if(add_where != ""){
                    sqltext=sqltext+" and "+add_where;
                }
                //列定义的where条件
                if(sys.trim(c.where_area) != ""){
                    sqltext=sqltext+" and "+c.where_area;
                }
                //行定义的group by
                sqltext=sqltext+" "+row_jsonObj[0].group.groupby_area;
                //替换sql参数
                for(item in typecontentObj.search){
                    // 参数为null时，不作为where条件(不包含between,not between)
                    if(request[item.en] == null){
                        if(item.condition!='12'&&item.condition!='13'){
                            sqltext=sys.regexReplaceAll("(?i)(\\S)+\\s*((=)|(!=)|(<>)|(>)|(<)|(>=)|(<=)|(LIKE)|(NOT LIKE)|(IN)|(NOT IN))\\s*\\{"+item.en+"\\}",sqltext," 1=1 ");
                            //预防手写SQL时，between不会替换成功
                            sqltext=sys.replace(sqltext,"{"+item.en+"}","''");
                            continue;
                        }
                    }
                    //（特殊情况）元素标签类型为date的参数为 "'2010-01-01' and '2010-03-03'"
                    if(item.elemtype=="date"){
                        var _paramObj=null;
                        try{
                            _paramObj=sys.instanceFromJson(request[item.en]);
                        }catch(e){
                            iscatch=true;
                        }
                        if(iscatch){
                            sys.setRetData("2",item.en+"参数格式为"+"{'dt_type':'',dt_from:'',dt_to:'','flg':''}");
                            return;
                        }
                        //_paramObj为null时
                        if(_paramObj==null){
                            sys.setRetData("2",item.en+"参数格式为"+"{'dt_type':'',dt_from:'',dt_to:'','flg':''}");
                            return;
                        }
                        var _dt_to=_paramObj.dt_to;
                        //时间点时dt_to加1
                        if(_paramObj.flg=="0" || _paramObj.flg==0){
                            var _tmp_num=0;
                            if(_paramObj.dt_type=="1" || _paramObj.dt_type==1){
                                _tmp_num=sys.parseInt(sys.subStringTo(_dt_to,0,4))+1;
                                _dt_to=_tmp_num+sys.subString(_dt_to,4);
                            }else if(_paramObj.dt_type=="2" || _paramObj.dt_type==2){
                                //todo:季
                            }else if(_paramObj.dt_type=="3" || _paramObj.dt_type==3){
                                _tmp_num=sys.parseInt(sys.subStringTo(_dt_to,5,7))+1;
                                if(_tmp_num<10){
                                    _tmp_num="0"+_tmp_num;
                                }
                                _dt_to=sys.subStringTo(_dt_to,0,5)+_tmp_num+sys.subString(_dt_to,7);
                            }else if(_paramObj.dt_type=="4" || _paramObj.dt_type==4){
                                _tmp_num=sys.parseInt(sys.subString(_dt_to,8))+1;
                                if(_tmp_num<10){
                                    _tmp_num="0"+_tmp_num;
                                }
                                _dt_to=sys.subStringTo(_dt_to,0,8)+_tmp_num;
                            }
                        }
                        //替换参数：between的时候
                        if(item.condition=="12" || item.condition=="13"){
                            sqltext=sys.replace(sqltext,"{"+item.en+"}","'"+_paramObj.dt_from+"' and '"+_dt_to+"'");
                        }
                        //in, not in 
                        else if(item.condition=="10" || item.condition=="11"){
                            sqltext=sys.replace(sqltext,"{"+item.en+"}","('"+_paramObj.dt_from+"')");
                        }
                        else{
                            sqltext=sys.replace(sqltext,"{"+item.en+"}","'"+_paramObj.dt_from+"'");
                        }
                    }
                    //IN,NOT IN
                    else if(item.condition=="10"||item.condition=="11"){
                        // if(sys.startWith(request[item.en],"'")||sys.startWith(request[item.en],"\"")){
                        // }else{
                        //     sys.setRetData("2","IN,NOT IN的参数为字符串（逗号分隔的每一项需要引着引号） eg:'123' ");
                        //     return;
                        // }
                        // sqltext=sys.replace(sqltext,"{"+item.en+"}","("+request[item.en]+")");
                        
                        var in_list=sys.split(request[item.en],",");
                        var in_string="";
                        for(rr in in_list){
                            in_string=in_string+",'"+rr+"'";
                        }
                        in_string=sys.subString(in_string,1);
                        sqltext=sys.replace(sqltext,"{"+item.en+"}","("+in_string+")");
                    }else{
                        sqltext=sys.replace(sqltext,"{"+item.en+"}"," '"+request[item.en]+"' ");
                    }
                }
                list.add(sqlList,sqltext);
            }
            
            //循环执行sql语句,拼装group by结果集 
            var num=0;
            // var _fname=row_jsonObj[0].name;
            for(r in sqlList){
                //第一次循环
                if(num==0){
                    sql.query(r,null,"result0");
                }else{
                    sql.query(r,null,"result");
                    for(_first in sys.result.result0){
                        sys.printValue(sys.result.result);
                        for(_next in sys.result.result){
                            //group by多个列值相等
                            var _eq = true;
                            for(_group_c in _groupbyArr2){
                                if(_first[_group_c]!=_next[_group_c]){
                                    _eq = false;    
                                }
                            }
                            if(_eq){
                                sys.printValue(222);
                                map.putAll(_first,_next);
                                break;
                            }
                        }
                    }
                }
                num=num+1;
            }
            data=sys.result.result0;
            
            sys.printValue(data);
            // sys.printValue(typecontentObj.type);
            // sys.printValue(_groupbyArr);
            //更改typecontentObj.type的group by列的en,cn
            for(var _i = sys.size(_groupbyArr)-1, _j = 0;_i>=0;_i--,_j++){
                if(_j==0){
                    map.put(typecontentObj.type[0],"en",row_jsonObj[0].name);
                    map.put(typecontentObj.type[0],"cn",row_jsonObj[0].name);
                }else{
                    map.put(typecontentObj.type[_j],"en",_groupbyArr[_i]);
                    map.put(typecontentObj.type[_j],"cn",_groupbyArr[_i]);
                }
            }
        }
    }catch(e){
        sys.printValue(e);
        iscatch=true;
        catchmsg=e.cause.message;
    }
    if(iscatch){
        sys.setRetData("5",catchmsg);
        return;
    }
    //获取要返回的列名
    // var ret_column=[];
    // for(r in column_jsonObj){
    //     list.add(ret_column,r.column_name);
    // }
    //返回type
    // var type=[];
    // for(r in view_typecontentObj.type){
    //     if(list.contain(ret_column,r.en)){
    //         list.add(type,r);
    //     }
    // }
    
    //OrderBy
    if(_orderby!=null){
        try{
            _orderby = sys.instanceFromJson(_orderby);
        }catch(e){
            iscatch=true;
        }
        if(iscatch){
            sys.setRetData("2","_orderby参数错误，eg:[['a',0],['b',1]]");
            return;
        }
        if(sys.size(_orderby)>0){
            var sort_cond = [];
            for(r in _orderby){
                if(sys.size(r)!=2){
                    sys.setRetData("2","_orderby参数错误，eg:[['a',0],['b',1]]");
                    return;
                }
                if(r[1]=="0" || r[1]==0){
                    list.add(sort_cond,r[0]);
                    list.add(sort_cond,"0");
                }else if(r[1]=="1" || r[1]==1){
                    list.add(sort_cond,r[0]);
                    list.add(sort_cond,"1");
                }else{
                    list.add(sort_cond,r[0]);
                    list.add(sort_cond,"0");
                }
            }
            //list.sort第二个参数可以是数组，非List
            var sort_cond_arr = @sort_cond.toArray();
            list.sort(data,sort_cond_arr);
        }
    }
    sys.addRetData(typecontentObj.type,"type");
    //返回search
    sys.addRetData(typecontentObj.search,"search");
    sys.addRetData(data,"data");
    sys.setRetData("0","","data","type","search");
}
else if(_source=="1"){
    if(table_jsonObj==null||table_jsonObj.en==null || sys.trim(table_jsonObj.en)==""){
        sys.setRetData("2","模型没有对应的物理表");
        return;
    }
    var sqltext="select * from "+table_jsonObj.en;
    //是否排序
    var sqlOrderBy="";
    if(_orderby!=null){
        _orderby=sys.instanceFromJson(_orderby);
        if(sys.size(_orderby)>0){
            sqlOrderBy=" order by ";
            for(r in _orderby){
                if(sys.size(r)!=2){
                    sys.setRetData("2","_orderby参数错误！");
                    return;
                }
                if(r[1]=="0" || r[1]==0){
                    sqlOrderBy=sqlOrderBy+r[0]+" asc,";
                }else if(r[1]=="1" || r[1]==1){
                    sqlOrderBy=sqlOrderBy+r[0]+" desc,";
                }else{
                    sqlOrderBy=sqlOrderBy+r[0]+" desc,";
                }
            }
            sqlOrderBy=sys.subStringTo(sqlOrderBy,0,sys.length(sqlOrderBy)-1);
        }
    }
    if(sqlOrderBy!=""){
        sqltext=sqltext+" "+sqlOrderBy;
    }
    var tdid = table_jsonObj.did;
    if (sys.request.conn) {
      var _did = require("./lib").getDidFrom(sys);
      if (_did) tdid = _did;
    }
    //执行SQL语句
    if(tdid != "00000000000000000000000000000000"){
        var iscatch=false;
        try{
            sql.connection(tdid);
        }catch(e){
            iscatch=true;
        }
        if(iscatch){
            sys.setRetData("1","连接数据源（"+tdid+"）异常！");
            return;
        }
    }
    //是否分页查询
    if(pagenum!=null&&pagesize!=null){
        sql.queryPaging(sqltext,null,pagenum,pagesize,"data");
    }else{
        sql.query(sqltext,null,"data");
    }
    sys.addRetData(typecontentObj.type,"type");
    sys.setRetData("0","","data","type");
}
else{
    sys.setRetData("2","_source参数错误");
}