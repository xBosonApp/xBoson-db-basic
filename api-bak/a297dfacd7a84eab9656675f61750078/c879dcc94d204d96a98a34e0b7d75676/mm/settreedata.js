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
//name:修改一条模型分类数据
//id:settreedata

//获取参数
var openid = sys.request.openid;
var org = sys.request.org;
var _typecd = sys.request._typecd;  //旧主键
var _datatable = sys.request._datatable;
var typecd = sys.request.typecd;   //修改的新主键
var parentcd = sys.request.parentcd;
var typenm = sys.request.typenm;
var shortkey = sys.request.shortkey;
var standard = sys.request.standard;
var datatable = sys.request.datatable;
var version = sys.request.version;
var status = sys.request.status;
var mark = sys.request.mark;

var userid = sys.getUserIdByOpenId(openid);

//验证必要参数
if(_typecd == null || typecd == null || parentcd == null || typenm == null || standard == null || status == null){
    sys.setRetData("1");
    return;
}
if (datatable == "e") datatable=null;
//如果datatable不为空，则验证datatable
if(datatable != null){
    if(datatable == "sys_mdm003" || datatable == "sys_md_mm002"){
    }else{
        sys.setRetData("2","datatable参数错误");
        return;
    }
}
//获取数据库中的typecd
var getsk="select typecd,parentcd,typenm,shortkey,standard,datatable,version,status,mark  from sys_md_mm001 where typecd=?";
var count_sk=sql.query(getsk,[typecd],"beforeR");

//判断主键是否修改
if(typecd != _typecd && count_sk>0){
//检查修改的主键是否存在
    sys.setRetData("2","主键-类别编码已存在");
    return;
}
if(typecd==_typecd){
    //检查typecd是否存在
    count_sk=sql.query(getsk,[typecd]);
    if(count_sk==0){
        sys.setRetData("2","类别编码不存在！");
        return;
    }
}
//判断parentcd是否存在
sql.query(getsk,[parentcd]);
//避免大小写问题
if(sys.size(sys.result.result)==0||sys.result.result[0].typecd!=parentcd){
    sys.setRetData("2","父类别编码不存在！");
    return;
}

//为shortkey赋值
if(shortkey==null ){
    shortkey = sys.getPinyinFirstLetter(typenm);        
}

//当前时间
var dt = sys.currentTimeString();
var sqlUpd="",params=[];
//如果修改了datatable,则判断 如果_datatable有typecd对应的数据,则不允许修改
if(datatable == null && _datatable == null){
}else{
    if(datatable != _datatable && _datatable != null){
        var sqlc = "select typecd from "+_datatable+" where typecd =?";
        try{
            var sqlc_cnt = sql.query(sqlc,[_typecd], "sqlc");
            if(sqlc_cnt > 0){
                sys.setRetData("2",_datatable+"表里对应的typecd有数据！");
                return;
            }
            //如果_datatable=="sys_md_mm002",则还需检查sys_md_mm003,sys_md_mm004表
            if(_datatable=="sys_md_mm002"){
                var mm003_sql="select typecd from sys_md_mm003 where typecd=?";
                var mm003_sql_cnt=sql.query(mm003_sql,[_typecd],"mm003_r");
                if(mm003_sql_cnt > 0){
                    sys.setRetData("2","sys_md_mm003表里对应的typecd有数据！");
                    return;
                }
                var mm004_sql="select typecd from sys_md_mm004 where typecd=?";
                var mm004_sql_cnt=sql.query(mm004_sql,[_typecd],"mm004_r");
                if(mm004_sql_cnt > 0){
                    sys.setRetData("2","sys_md_mm004表里对应的typecd有数据！");
                    return;
                }
            }
        }catch(e){
            
        }
    }
}

//主键没修改
if(typecd == _typecd){
    //修改所有字段（除createdt和主键）
    sqlUpd = "update sys_md_mm001 set parentcd=?,typenm=?,shortkey=?,standard=?,datatable=?,version=?,status=?,mark=?,updatedt=? where typecd=?";

    params = [parentcd, typenm, shortkey, standard, datatable, version, status,mark,dt,typecd];
}else{
    //主键修改
    sqlUpd = "update sys_md_mm001 set typecd=?,parentcd=?,typenm=?,shortkey=?,standard=?,datatable=?,version=?,status=?,mark=?,updatedt=? where typecd=?";

    params = [typecd, parentcd, typenm, shortkey, standard, datatable, version, status,mark,dt,_typecd]; 
}


var cnt = sql.update(sqlUpd, params,"1");

sql.commit();
if(cnt == 0){
    sys.setRetData("2");
    return;
}else{
    //...同时修改datatable链接的表
    if(typecd != _typecd){
        var sqld="update "+_datatable+" set typecd = ? where typecd=?";
        sql.update(sqld,[typecd,_typecd]);
        //如果_datatable==sys_md_mm002,则还需更新sys_md_mm003,sys_md_mm004表
        if(_datatable=="sys_md_mm002"){
            var mm003_upd="update sys_md_mm003 set typecd=? where typecd=?";
            sql.update(mm003_upd,[typecd,_typecd]);
            var mm004_upd="update sys_md_mm004 set typecd=? where typecd=?";
            sql.update(mm004_upd,[typecd,_typecd]);
        }
    }
      //返回数据，更新节点
    var data = {"typenm":typenm,"shownm":typecd+"("+datatable+")","typecd":typecd,"datatable":datatable,"parentcd":parentcd};
    map.put(sys.result,"data",data);
    
    //操作数据集日志
    http.platformGet({"app":"c879dcc94d204d96a98a34e0b7d75676","mod":"mm","api":"cachedatasetinfo"},{"typecd":typecd});

    sys.setRetData("0","","data");
}