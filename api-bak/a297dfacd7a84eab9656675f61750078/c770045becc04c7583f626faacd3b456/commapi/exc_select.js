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
var org=sys.request.org;
//模型ID
var typecd=sys.request.modolcd;
// var _flag=sys.request._flag;    //"0"为取结构，"1"为取结构和数据
//"0"为取SQL语句执行结果，"1"为取模型对应的物理表，默认为"0"
var _source=sys.request._source;
//分页
var pagesize=sys.request.pagesize;
var pagenum=sys.request.pagenum;
//OrderBy-[[a:0],[b:1]]  0:ASC,1:DESC
var _orderby=sys.request._orderby;

var request=sys.request;
var iscatch=false,catchmsg="";  //是否异常

//测试
if(typecd=="static1" || typecd=="static2" || typecd=="static3"){
    var _msg=http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"commapi","api":"test"},{"s":"d","flag":typecd});
    // sys.printValue(_msg);
    sys.addRetData(_msg.data.type,"type");
    sys.addRetData(_msg.data.data,"data");
    sys.addRetData(_msg.data.search,"search");
    sys.setRetData("0","","type","data","search");
    return;
}


if(typecd==null){
    sys.setRetData("1");
    return;
}
if(_source==null){
    _source="0";
}

var modelInfo = se.getCache(_CACHE_REGION_BIZ_MODEL_,typecd);
if (modelInfo==null) {
  sys.setRetData("2","抱歉，该业务模型不存在");
  return;
}

//验证权限
// var auth_res = http.platformGet({"app":"c770045becc04c7583f626faacd3b456","mod":"auth","api":"auth_check"},{"typecd":typecd,"__uri__":http.uri()});
// if(auth_res["data"].ret == "0"){
//     if(!auth_res["data"].result[0].isAuth){
//         sys.setRetData("2","无模型权限！");
//         return;
//     }
// }else{
//     sys.setRetData(auth_res["data"].ret,auth_res["data"].msg);
//     return;
// }
if (!se.isAuthorizedBizModel(typecd)) {
  sys.setRetData("2","抱歉，您暂时没有执行该业务模型的权限");
  return;
}
//从缓存获取模型对应的数据源ID，sql语句，typecontent，jsondata_select，table_json
var did=modelInfo.did;
var sqltext=modelInfo.sqltext;
var typecontent=modelInfo.typecontent;
var jsondata_select=modelInfo.jsondata_select;
var table_json=modelInfo.table_json;

if(sqltext==null||sqltext==""){
    sys.setRetData("2","SQL为空！");
    return;
}

var typecontentObj=sys.instanceFromJson(typecontent);
var jsondata_selectObj=sys.instanceFromJson(jsondata_select);
var table_jsonObj=null;
if(table_json!=null&&sys.trim(table_json)!=""){
    table_jsonObj=sys.instanceFromJson(table_json);
}
//返回type,search
if(sys.trim(typecontent) != ""){
    sys.addRetData(typecontentObj.type,"type");
    sys.addRetData(typecontentObj.search,"search");
    // if(_flag=="0" && sys.size(typecontentObj.search)>0){
    //     return;
    // }
}

if(_source=="0"){
    //用参数替换sql语句
    if(sys.trim(typecontent)!=""){
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
                for(r in in_list){
                    in_string=in_string+",'"+r+"'";
                }
                in_string=sys.subString(in_string,1);
                sqltext=sys.replace(sqltext,"{"+item.en+"}","("+in_string+")");
            }else{
                sqltext=sys.replace(sqltext,"{"+item.en+"}"," '"+request[item.en]+"' ");
            }
        }
    }
    //执行SQL语句
    try{
        if (sys.request.conn) {
          var _did = require("./lib").getDidFrom(sys);
          if (_did) did = _did;
        }
        sys.printValue("did="+did);
        sys.printValue("orderby="+ _orderby);
        if(did!="00000000000000000000000000000000"){
            sql.connection(did);
            //sys.printValue("sql.connection("+did+")");
        }
        //是否排序
        var sqlOrderBy = getOrderSql();
        if(sqlOrderBy!=""){
            sqltext=sqltext+sqlOrderBy;
        }
        //是否分页查询
        if(pagenum!=null&&pagesize!=null){
            sql.queryPaging(sqltext,null,pagenum,pagesize,"data");
        }else{
            sql.query(sqltext,null,"data");
        }
        
    }catch(e){
        iscatch=true;
        catchmsg = e.message;
        throw e;
    }
    if(iscatch){
        sys.setRetData("5",catchmsg);
        return;
    }
    //获取需要翻转的列
    var dict_columns=[];
    if(jsondata_select !="" && sys.trim(typecontent) != ""){
        for(r in jsondata_selectObj){
            if(r.is_dictchk=="1"){
                for(_r in typecontentObj.type){
                    if(_r.en==r.column_name){
                        if(_r.dict==""){
                            sys.setRetData("2","获取数据字典异常");
                            return;
                        }
                        var _tmp={"column_name":r.column_name,"alias_name":r.alias_name,"dict":_r.dict};
                        var _dict_cache=se.getCache(_CACHE_REGION_MDM_,org+":"+_r.dict);
                        map.put(_tmp,"dict_cache",_dict_cache);
                        list.add(dict_columns,_tmp);
                    }
                }
            }
        }
    }
    //翻转数据字典
    if(sys.size(dict_columns)>0){
        for(d in sys.result.data){
            for(r in dict_columns){
                //翻转
                for(_c in r.dict_cache){
                    if(_c.id==d[r.alias_name]){
                        map.put(d,r.alias_name+"_name",_c.name);
                    }
                }
            }    
        }
    }
    
    sys.setRetData("0","","data","type","search");
}
else if(_source=="1"){
    if(table_jsonObj.en==null || sys.trim(table_jsonObj.en)==""){
        sys.setRetData("2","模型没有对应的物理表");
        return;
    }
    var sql="select * from "+table_jsonObj.en;
    var tdid = table_jsonObj.did;
    
    if (sys.request.conn) {
      var _did = require("./lib").getDidFrom(sys);
      if (_did) tdid = _did;
    }
    //执行SQL语句
    if(tdid != "00000000000000000000000000000000"){
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
    //是否排序
    var sqlOrderBy = getOrderSql();
    if(sqlOrderBy!=""){
        sql=sql+sqlOrderBy;
    }
    //是否分页查询
    if(pagenum!=null&&pagesize!=null){
        sql.queryPaging(sql,null,pagenum,pagesize,"data");
    }else{
        sql.query(sql,null,"data");
    }
    sys.setRetData("0","","data","type");
}
else{
    sys.setRetData("2","_source参数错误");
}


function getOrderSql(_orderby) {
  var sqlOrderBy=[];
  if(_orderby!=null){
    try {
      _orderby=sys.instanceFromJson(_orderby);
      
      if(sys.size(_orderby)>0){
          sqlOrderBy.push(" order by ");
          for(r in _orderby){
              if(sys.size(r)!=2){
                throw new Error("_orderby参数错误！");
              }
              
              if (r.indexOf(" ")>=0 || r.indexOf('\t')>=0 
               || r.indexOf('\r')>=0 || r.indexOf("\n")>=0) {
                throw new Error("检测到 sql 攻击");   
              }
               
              if(r[1]=="0" || r[1]==0){
                  sqlOrderBy.push(r[0]," asc", ',');
              }else if(r[1]=="1" || r[1]==1){
                  sqlOrderBy.push(r[0]," desc", ',');
              }else{
                  sqlOrderBy.push(r[0]," desc", ',');
              }
          }
          sqlOrderBy.pop();
      }
    } catch(e) {
      sys.printValue("Bad orderby JSON data: "+ _orderby);
    }
  }
  return sqlOrderBy.join('');
}