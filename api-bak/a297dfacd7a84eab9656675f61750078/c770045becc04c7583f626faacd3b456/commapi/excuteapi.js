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
var openid=sys.request.openid;
var modolcd=sys.request.modolcd;    //业务模型ID
var request=sys.request;
if(modolcd==null){
    sys.setRetData("1");
    return;
}
// 从缓存获取业务模型信息
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
//     // sys.printValue(auth_res);
//     sys.setRetData(auth_res["data"].ret,auth_res["data"].msg);
//     return;
// }
if (!se.isAuthorizedBizModel(modolcd)) {
  sys.setRetData("2","抱歉，您暂时没有执行该业务模型的权限");
  return;
}

// sys.printValue(modelInfo);
var did = modelInfo.did;
var sqltype = modelInfo.sqltype;
var sqltext = modelInfo.sqltext;
var sqlparams = sys.instanceFromJson(modelInfo.sqlparams);
var typecontent = sys.instanceFromJson(modelInfo.typecontent);

//获取请求参数中的sql参数值(Insert,Update)
var params=[];
var typetrans=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.004101");
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
        //参数为api内的函数
        if(r.api_func!=null && r.api_func!=""){
            if(r.api_func=="uuid"){
                list.add(params,sys.uuid());
                continue;
            }else if(r.api_func=="currentTimeString"){
                list.add(params,sys.currentTimeString());
                continue;
            }else if(r.api_func=="nextId"){
                list.add(params,sys.nextId());
                continue;
            }else if(r.api_func=="getUserIdByOpenId"){
                list.add(params,sys.getUserIdByOpenId(openid));
                continue;
            }else if(r.api_func=="getUserPID"){
                list.add(params,sys.getUserPID());
                continue;
            }else if(r.api_func=="getUserIdByPID"){
                list.add(params,sys.getUserIdByPID());
                continue;
            }else{
                sys.setRetData("2","api_func："+r.api_func+"异常！");
                return;
            }
        }
        //参数为null时
        if(sys.request[r.en]==null){
            list.add(params,null);
            continue;
        }
        //如果为参数类型为数值，则将参数转换为数值
        if(_javatype=="Double" && sys.contain(sys.request[r.en],".")){
            //是小数
            list.add(params,sys.parseDouble(sys.request[r.en]));
        }else if(_javatype=="Double"){
            //不是小数
            list.add(params,sys.parseLong(sys.request[r.en]));
        }
        else{
            list.add(params,sys.request[r.en]);
        }
    }
}

//Delete,Update时，至少包含一个where条件
if(sqltype=="D"||sqltype=="U"){
    if(sys.size(typecontent.search)==0){
        sys.setRetData("2","删除及更新操作需要至少一个where条件");
        return;
    }
}
//替换where条件中的sql参数{a},{b}
for(item in typecontent.search){
    // SELECT语句时，参数为null时，不作为where条件(不包含between,not between)
    if(sqltype=="S"){
        if(request[item.en] == null){
            if(item.condition!='12'&&item.condition!='13'){
                sqltext=sys.regexReplaceAll("(?i)(\\S)+\\s*((=)|(!=)|(<>)|(>)|(<)|(>=)|(<=)|(LIKE)|(NOT LIKE)|(IN)|(NOT IN))\\s*\\{"+item.en+"\\}",sqltext," 1=1 ");
                //预防手写SQL时，between不会替换成功
                sqltext=sys.replace(sqltext,"{"+item.en+"}","''");
                continue;
            }
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
// sys.printValue(sqltext);
//执行SQL语句
var iscatch=false,catchmsg="";

if (sys.request.conn) {
  var _did = require("./lib").getDidFrom(sys);
  if (_did) did = _did;
}

if(did!="00000000000000000000000000000000"){
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
// 抛出sql执行失败message
if(sqltype=="S"){
    var pagesize=sys.request.pagesize;
    var pagenum=sys.request.pagenum;
    var _orderby=sys.request._orderby;
    //是否排序
    try{
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
            sqltext=sqltext+sqlOrderBy;
        }
    }catch(e){
        iscatch=true;
        catchmsg="_orderby参数错误！"+_orderby+" "+e.cause.message;
    }
    if(iscatch){
        sys.setRetData("5",catchmsg);
        return;
    }
    try{
        //分页查询
        if(pagesize!=null&&pagenum!=null){
            sql.queryPaging(sqltext,params,pagenum,pagesize,"data");
        }
        //非分页查询
        else{
            var count=sql.query(sqltext,params,"data");
            sys.addRetData(count,"count");
        }
        sys.addRetData(typecontent.type,"type");
        sys.addRetData(typecontent.search,"search");
        sys.setRetData("0","","data","type","search");
    }catch(e){
        iscatch=true;
        catchmsg=e.message;
    }
    if(iscatch){
        sys.setRetData("5",catchmsg);
        return;
    }
}else{
    try{
        sql.update(sqltext,params);
        sys.setRetData("0");
    }catch(e){
        iscatch=true;
        catchmsg=e.message;
    }
    if(iscatch){
        sys.setRetData("5",catchmsg);
        return;
    }
}