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
var json=sys.request.json;
var path=se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //压缩包上传的路径
var filenm=sys.request.filenm;  //文件名
if(json==null||filenm==null){
    sys.setRetData("1");
    return;
}
// var resultData={
//     "apitree":[],
//     "ui":[],
//     "dedstree":[],
//     "de_data":{},
//     "ds_data":{},
//     "ds_table":[],
//     "table_data":[],
//     "role":[],
//     "allmodeltree":[]
// };
var jsonObj=sys.instanceFromJson(json);
//大部分对象中都包含_isexist,existinfo属性
// jsonObj={
//     "items":[
//         {"roleid":"项目id","appid":"","moduleid":"","apiid":"","contentid":"","level":0,"_isexist":false,"_existinfo":""},
//         ...
//     ],
//     "deds":{
//         "dedstree":[{"typecd":"","_isexist":false,"_existinfo":""}...],  //数据元数据集typecds
//         "de":[{"typecd":"","decd":"","_isexist":false,"_existinfo":""}...]   //数据元
//     },
//     "table_data":[
//         {"typecd":"","en":"","data":[],"_isexist":false,"_existinfo":""}...
//     ],
//     "roles":[{"roleid":"","_isexist":false,"_existinfo":""}...],
//     "model":[{"typecd":"","_isexist":false,"_existinfo":""}...]
// };
//获取压缩包内容
var contentList=sys.zipToList(path,filenm); //zip内容项
var decryptKey="export&&import111";
var dt=sys.currentTimeString();
var openid=sys.request.openid;
var pid=sys.getUserPID(openid);
var org=sys.request.org;
var adminFlag=sys.getUserAdminFlag(openid,org);

//导入结果详细信息
var importDetail=[];

//items-项目
var items=jsonObj["items"];
if(sys.size(items)>0){
    var role_result=[]; //zip中的项目结果集
    var app_result=[];  //zip中的app结果集
    var mod_result=[];  //zip中的mod结果集
    var api_result=[];  //zip中的api结果集
    var apicontent_result=[];  //zip中的apicontent结果集
    for(r in contentList){
        if(r.name=="项目"){
            role_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="app"){
            app_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="mod"){
            mod_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="api"){
            api_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="apicontent"){
            apicontent_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }
    }
    //sys_role
    var sql_role="insert into sys_role (roleid,rolenm,op_type,role_type,role_desc,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
    var params_role=[];
    //sys_user_role
    var sql_user_role="insert into sys_user_role (pid,roleid,status,createdt,updatedt) values (?,?,?,?,?)";
    var params_user_role=[];
    //将管理员添加进项目
    var count=0;
    if(adminFlag!="1"&&adminFlag!="3"&&adminFlag!="5"){
        count = sql.query("select pid from link_vender.sys_tenant_user where orgid=? and admin_flag  in ('1','3','5')",[org],"manapid");
    }
    //sys_apps
    var sql_app="insert into sys_app (appid,appnm,about,appflag,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
    var params_app=[];
    //sys_modules
    var sql_module="insert into sys_modules (appid,moduleid,modulenm,about,auflag,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
    var params_mod=[];
    //sys_apis
    var sql_apis="insert into sys_apis (appid,moduleid,apiid,apinm,op_type,contentid,status,createdt,updatedt,help_info) values (?,?,?,?,?,?,?,?,?,?)";
    var params_api=[];
    //sys_api_content
    var sql_api_content="insert into sys_api_content (contentid,stability,updatecmt,pid,updatedt,content) values (?,?,?,?,?,?)";
    var params_api_content=[];
    //更新sys_api_content
    var sql_api_content_upd="update sys_api_content set stability=?,updatecmt=?,pid=?,updatedt=?,content=? where contentid=?";
    var params_api_content_upd=[];
    //sys_api_his_content
    var sql_api_his_content="insert into sys_api_his_content (hisid,contentid,stability,updatecmt,pid,updatedt,content) values (?,?,?,?,?,?,?)";
    var params_api_his_content=[];
    var contentid_map={"exist":[],"noexist":[],"all_contentid":[]};

    for(r in items){
        if(r.level==0){
            //不存在此项目时则添加
            if(!r._isexist){
                for(r2 in role_result){
                    if(r2.roleid==r.roleid){
                        list.add(params_role,[r2.roleid,r2.rolenm,r2.op_type,r2.role_type,r2.role_desc,r2.status,dt,dt]);
                    }
                }
                //项目人员
                list.add(params_user_role,[pid,r.roleid,"1",dt,dt]);
                if(count == 1){
                    list.add(params_user_role,[sys.result.manapid[0].pid,r.roleid,"1",dt,dt]);
                }
            }
        }
        if(r.level==1){
            //不存在此app时添加
            if(!r._isexist){
                for(r2 in app_result){
                    if(r2.appid==r.appid){
                        list.add(params_app,[r2.appid,r2.appnm,r2.about,r2.appflag,r2.status,dt,dt]);
                    }
                }
            }
        }else if(r.level==2){
            //不存在此mod时添加
            if(!r._isexist){
                for(r2 in mod_result){
                    if(r2.appid==r.appid&&r2.moduleid==r.moduleid){
                        list.add(params_mod,[r2.appid,r2.moduleid,r2.modulenm,r2.about,r2.auflag,"1",dt,dt]);
                    }
                }
            }
        }else if(r.level==3){
            //不存在此api时添加
            if(!r._isexist){
                for(r2 in api_result){
                    if(r2.appid==r.appid&&r2.moduleid==r.moduleid&&r2.apiid==r.apiid){
                        list.add(params_api,[r2.appid,r2.moduleid,r2.apiid,r2.apinm,r2.op_type,r2.contentid,"1",dt,dt,r2.help_info]);
                        list.add(contentid_map.noexist,r.contentid);
                    }
                }
            }else{
                list.add(contentid_map.exist,r.contentid);
            }
            list.add(contentid_map.all_contentid,r.contentid);
        }
    }
    //params_api_content
    for(r in contentid_map.noexist){
        for(r2 in apicontent_result){
            if(r2.contentid==r){
                list.add(params_api_content,[r2.contentid,"30","",pid,dt,r2.content]);
            }
        }
    }
    //params_api_his_content
    var in_contentid="";
    var sql_select_apicontent="select * from sys_api_content where contentid in (";
    for(r in contentid_map.exist){
        in_contentid=in_contentid+",'"+r+"'";
    }
    in_contentid=sys.subString(in_contentid,1);
    if (in_contentid!="") {
      sql_select_apicontent=sql_select_apicontent+in_contentid+")";
      sql.query(sql_select_apicontent,null,"tmp_apicontent_r");
      for(r in sys.result.tmp_apicontent_r){
        list.add(params_api_his_content,[sys.uuid(),r.contentid,r.stability,"导入更新历史",pid,dt,r.content]);
      }
    }

    //params_api_content_upd
    for(r in contentid_map.exist){
        for(r2 in apicontent_result){
            if(r2.contentid==r){
                list.add(params_api_content_upd,["30","导入更新",pid,dt,r2.content,r]);
            }
        }
    }
    
    //项目
    if (sys.size(params_role) > 0) {
      sql.updateBatch(sql_role,params_role,"1");
    }
    //项目人员
    if (sys.size(params_user_role) > 0) {
      sql.updateBatch(sql_user_role,params_user_role,"1");
    }
    //app
    if (sys.size(params_app) > 0) {
      sql.updateBatch(sql_app,params_app,"1");
    }
    //mod
    if (sys.size(params_mod) > 0) {
      sql.updateBatch(sql_module,params_mod,"1");
    }
    //api
    if (sys.size(params_api) > 0) {
      sql.updateBatch(sql_apis,params_api,"1");
    }
    //api历史内容
    if (sys.size(params_api_his_content) > 0) {
      sql.updateBatch(sql_api_his_content,params_api_his_content,"1");
    }
    //api内容
    sql.updateBatch(sql_api_content,params_api_content,"1");
    //存在的api-内容更新
    if (sys.size(params_api_content_upd) > 0) {
      sql.updateBatch(sql_api_content_upd,params_api_content_upd,"1");
    }
    //记录导入情况
    var tmpInfo = "";
    tmpInfo="新增项目："+sys.size(params_role)+"个 </br>";
    for(r in params_role){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增项目人员："+sys.size(params_user_role)+"个 </br>";
    for(r in params_user_role){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增APP："+sys.size(params_app)+"个 </br>";
    for(r in params_app){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增MOD："+sys.size(params_mod)+"个 </br>";
    for(r in params_mod){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增API："+sys.size(params_api)+"个 </br>";
    for(r in params_api){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增API内容："+sys.size(params_api_content)+"个 </br>";
    for(r in params_api_content){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"更新API内容："+sys.size(params_api_content_upd)+"个 </br>";
    for(r in params_api_content_upd){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r[0]+" </br>";
    }
    tmpInfo=tmpInfo+"新增API历史内容："+sys.size(params_api_his_content)+"个 </br>";
    for(r in params_api_his_content){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r[1]+" </br>";
    }
    list.add(importDetail,tmpInfo);
}

//deds
var deds=jsonObj["deds"];
if(deds!=null){
    dedstree=deds["dedstree"];
    de=deds["de"];
    
    var dedstree_result=[],ds_result=[],ds_index_result=[],de_result=[];
    for(r in contentList){
        if(r.name=="数据元数据集tree"){
            dedstree_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="数据集"){
            ds_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="数据集索引映射"){
            ds_index_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="数据元"){
            de_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }
    }
    //sys_md_mm001
    var sql_md_mm001="insert into sys_md_mm001 (typecd,parentcd,typenm,shortkey,standard,url,datatable,version,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_md_mm001=[];
    //sys_md_mm002
    var sql_md_mm002="insert into sys_md_mm002 (typecd,decd,en,cn,mk,must,dv,sorting,elemtype,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_md_mm002=[];
    //sys_md_mm004
    var sql_md_mm004="insert into sys_md_mm004 (typecd,en,cn,fields,sort,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?)";
    var params_md_mm004=[];
    for(r in dedstree){
        //typecd在当前系统不存在时添加
        if(!r._isexist){
            for(r2 in dedstree_result){
                if(r2.typecd==r.typecd){
                    list.add(params_md_mm001,[r2.typecd,r2.parentcd,r2.typenm,r2.shortkey,r2.standard,r2.url,r2.datatable,r2.version,"1",r2.mark,dt,dt]);
                }
            }
            for(r2 in ds_result){
                if(r2.typecd==r.typecd&&r2.en==r.en){
                    list.add(params_md_mm002,[r2.typecd,r2.decd,r2.en,r2.cn,r2.mk,r2.must,r2.dv,r2.sorting,r2.elemtype,"1",r2.mark,dt,dt]);
                }
            }
            for(r2 in ds_index_result){
                if(r2.typecd==r.typecd){
                    list.add(params_md_mm004,[r2.typecd,r2.en,r2.cn,r2.fields,r2.sort,"1",r2.mark,dt,dt]);    
                }
            }
        }
    }
    //sys_mdm003
    var sql_mdm003="insert into sys_mdm003 (typecd,decd,en,cn,datatype,numrange,format,unit,dict,isstd,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_mdm003=[];
    for(r in de){
        //不存在时添加
        if(!r._isexist){
            for(r2 in de_result){
                if(r2.typecd==r.typecd&&r2.decd==r.decd){
                    list.add(params_mdm003,[r2.typecd,r2.decd,r2.en,r2.cn,r2.datatype,r2.numrange,r2.format,r2.unit,r2.isstd,"1",r2.mark,dt,dt]);
                }
            }
        }
    }
    
    //检查数据集所用的数据元是否存在
    var noexist_de=[];
    for(r in params_md_mm002){
        var isfind=false;
        for(r2 in de){
            if(r.decd==r2.decd){
                isfind=true;
                break;
            }
        }
        if(!find){
            list.add(noexist_de,{"数据集ID":r.typecd,"数据元ID":r.decd});
        }
    }
    if(sys.size(noexist_de)>0){
        sys.setRetData("1",noexist_de+"  以上数据集中的数据元不存在！");
        sql.commit();
        return;
    }
    //数据元数据集tree
    sql.updateBatch(sql_md_mm001,params_md_mm001,"1");
    //数据元
    sql.updateBatch(sql_mdm003,params_mdm003,"1");
    //数据集
    sql.updateBatch(sql_md_mm002,params_md_mm002,"1");
    //数据集索引
    sql.updateBatch(sql_md_mm004,params_md_mm004,"1");
    //导入记录
    var tmpInfo="新增数据元数据集类别："+sys.size(params_md_mm001)+"个 </br>";
    for(r in params_md_mm001){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增数据元："+sys.size(params_mdm003)+"个 </br>";
    for(r in params_mdm003){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增数据集："+sys.size(params_md_mm002)+"个 </br>";
    for(r in params_md_mm002){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增数据集索引："+sys.size(params_md_mm004)+"个 </br>";
    for(r in params_md_mm004){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r+" </br>";
    }
    list.add(importDetail,tmpInfo);
}

sql.commit();

//table_data
var table_data=jsonObj["table_data"];
if(sys.size(table_data)>0){
    var md_mm003_result=[];
    for(r in contentList){
        if(r.name=="数据集表映射"){
            md_mm003_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }
    }
    //sys_md_mm003
    // var sql_md_mm003="insert into sys_md_mm003 (typecd,did,en,cn,table_space,status,count,size,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?)";
    var params_md_mm003=[];
    for(r in table_data){
        //映射不存在时添加
        if(!r._isexist){
            for(r2 in md_mm003_result){
                if(r2.typecd==r.typecd&&r2.en==r.en){
                    list.add(params_md_mm003,
                        {
                            "typecd":r2.typecd,
                            "did":r2.did,
                            "en":r2.en,
                            "cn":r2.cn,
                            "status":"1",
                            "mark":r2.mark,
                            "data":r.data
                        });
                }
            }
        }
    }
    var iscatch=false,catchmsg="";
    try{
        //调接口创建表
        for(r in params_md_mm003){
            http.platformGet({
                "app":"c879dcc94d204d96a98a34e0b7d75676",
                "mod":"tableandindex",
                "api":"createtable"
            },r);
            //添加表数据-获取表字段
            sql.query("select en from sys_md_mm002 where typecd=?",[r.typecd],"tfields");
            
            if(sys.size(sys.result.tfields)>0){
                //sql语句
                var sqlInsert="",paramsInsert=[];
                var _tmpFields="",_tmpMark="";
                for(r2 in sys.result.tfields){
                    _tmpFields=_tmpFields+","+r2.en;
                    _tmpMark=_tmpMark+",?";
                }
                sqlInsert="insert into "+r.en+" ("+sys.subString(_tmpFields,1)+") values ("+sys.subString(_tmpMark,1)+")";
                //表数据
                for(rowdata in r.data){
                    var _tmpParams=[];
                    for(_field in sys.result.tfields){
                        list.add(_tmpParams,rowdata[_field.en]);
                    }
                    list.add(paramsInsert,_tmpParams);
                }
                sql.updateBatch(sqlInsert,paramsInsert,"1");
            }else{
                sys.setRetData("2","数据集("+r.typecd+")异常!");
                return;
            }
        }
    }catch(e){
        iscatch=true;
        catchmsg=e.cause.message;
    }
    if(iscatch){
        sys.setRetData("5",catchmsg);
        return;
    }
    //导入历史记录
    var tmpInfo="新增数据集表映射(及创建表)："+sys.size(params_md_mm003)+"个 </br>";
    for(r in params_md_mm003){
        tmpInfo=tmpInfo+"  "+rLP.index+"."+r[0]+r[1]+r[2]+r[3]+r[4]+r[5]+" </br>";
        tmpInfo=tmpInfo+"    "+r[2]+"表数据-插入："+sys.size(r[6])+"个 </br>";
        for(rowdata in r[6]){
            tmpInfo=tmpInfo+"     "+rowdata+" </br>";
        }
    }
    list.add(importDetail,tmpInfo);
}

//roles
var roles=jsonObj["roles"];
if(sys.size(roles)>0){
    var roles_result=[],role_api_result=[],role_model_result=[];
    for(r in contentList){
        if(r.name=="普通角色"){
            roles_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="普通角色API映射"){
            role_api_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey)); 
        }else if(r.name=="普通角色模型映射"){
            role_model_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey)); 
        }
    }
    
    //sys_role
    var sql_role="insert into sys_role (roleid,rolenm,op_type,role_type,role_desc,status,createdt,updatedt) values (?,?,?,?,?,?,?,?)";
    var params_role=[];
    //sys_role_api
    var sql_role_api="insert into sys_role_api (roleid,appid,moduleid,apiid,status,createdt,updatedt) values (?,?,?,?,?,?,?)";
    var params_role_api=[];
    //sys_role_model
    var sql_role_model="insert into sys_role_model (roleid,typecd,status,createdt,updatedt) values (?,?,?,?,?)";
    var params_role_model=[];
    for(r in roles){
        //角色不存在则添加
        if(!r._isexist){
            for(r2 in roles_result){
                if(r2.roleid==r.roleid){
                    list.add(params_role,[r2.roleid,r2.rolenm,r2.op_type,r2.role_type,r2.role_desc,"1",dt,dt]);
                }
            }
            //params_role_api
            for(r2 in role_api_result){
                if(r2.roleid==r.roleid){
                    list.add(params_role_api,[r2.roleid,r2.appid,r2.moduleid,r2.apiid,"1",dt,dt]);
                }
            }
            //params_role_model
            for(r2 in role_model_result){
                if(r2.roleid==r.roleid){
                    list.add(params_role_model,[r2.roleid,r2.typecd,"1",dt,dt]);
                }
            }
        }
        
    }
    var iscatch=false,catchmsg="";
    try{
        //角色
        sql.updateBatch(sql_role,params_role,"1");
        //角色api
        sql.updateBatch(sql_role_api,params_role_api,"1");
        //角色模型
        sql.updateBatch(sql_role_model,params_role_model,"1");
    }catch(e){
        iscatch=true;
    }
    if(iscatch){
        sql.rollback();
        sys.setRetData("5",catchmsg);
        return;
    }
    var tmpInfo="新增普通角色："+sys.size(params_role)+"个 </br>";
    for(r in params_role){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增角色API映射："+sys.size(params_role_api)+"个 </br>";
    for(r in params_role_api){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增角色模型映射："+sys.size(params_role_model)+"个 </br>";
    for(r in params_role_model){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    list.add(importDetail,tmpInfo);
}

//model
var model=jsonObj["model"];
if(sys.size(model)>0){
    var modeltree_result=[],bm002_result=[],bm003_result=[],bm004_result=[];
    for(r in contentList){
        if(r.name=="业务模型类别tree（视图，多维）"){
            modeltree_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="操纵模型"){
            bm002_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="视图模型"){
            bm003_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }else if(r.name=="多维模型"){
            bm004_result=sys.instanceFromJson(sys.decrypt(r.content,decryptKey));
        }
    }
    //sys_bm001
    var sql_bm001="insert into sys_bm001 (typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_bm001=[];
    //sys_bm002
    var sql_bm002="insert into sys_bm002 (modolcd,modolnm,dstypecd,did,tablenm,sqltype,sqltext,jsondata,typecontent,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_bm002=[];
    //sys_bm003
    var sql_bm003="insert into sys_bm003 (typecd,did,table_json,editingtype,jsondata_select,fromcontent,jsondata_where,sel_whe_columns,sqltext,typecontent,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_bm003=[];
    //sys_bm004
    var sql_bm004="insert into sys_bm004 (typecd,typecd_parent,tablesource,table_json,row_json,column_json,where_json,typecontent,status,mark,createdt,updatedt) values (?,?,?,?,?,?,?,?,?,?,?,?)";
    var params_bm004=[];
    for(r in model){
        //不存在时添加
        if(!r._isexist){
            //params_bm001
            for(r2 in modeltree_result){
                if(r2.typecd==r.typecd){
                    list.add(params_bm001,[r2.typecd,r2.parentcd,r2.typenm,r2.shortkey,r2.standard,r2.datatable,r2.url,r2.version,"1",r2.mark,dt,dt]);
                }
            }  
            //params_bm002
            for(r2 in bm002_result){
                if(r2.modolcd==r.typecd){
                    list.add(params_bm002,[r2.modolcd,r2.modolnm,r2.dstypecd,r2.did,r2.tablenm,r2.sqltype,r2.sqltext,r2.jsondata,r2.typecontent,"1",r2.mark,dt,dt]);
                }
            }
            //params_bm003
            for(r2 in bm003_result){
                if(r2.typecd==r.typecd){
                    list.add(params_bm003,[r2.typecd,r2.did,r2.table_json,r2.editingtype,r2.jsondata_select,r2.fromcontent,r2.jsondata_where,r2.sel_whe_columns,r2.sqltext,r2.typecontent,"1",r2.mark,dt,dt]);
                }
            }
            //params_bm004
            for(r2 in bm004_result){
                if(r2.typecd==r.typecd){
                    list.add(params_bm004,[r2.typecd,r2.typecd_parent,r2.tablesource,r2.table_json,r2.row_json,r2.column_json,r2.where_json,r2.typecontent,"1",r2.mark,dt,dt]);
                }
            }
        }
    }
    var iscatch=false,catchmsg="";
    try{
        //视图多维模型tree
        sql.updateBatch(sql_bm001,params_bm001,"1");
        //操纵模型
        sql.updateBatch(sql_bm002,params_bm002,"1");
        //视图模型
        sql.updateBatch(sql_bm003,params_bm003,"1");
        //多维模型
        sql.updateBatch(sql_bm004,params_bm004,"1");
    }catch(e){
        iscatch=true;
        catchmsg=e.cause.message;
    }
    if(iscatch){
        sql.rollback();
        sys.setRetData("5",catchmsg);
        return;
    }
    var tmpInfo="新增视图多维模型Tree节点："+sys.size(params_bm001)+"个 </br>";
    for(r in params_bm001){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增操纵模型："+sys.size(params_bm002)+"个 </br>";
    for(r in params_bm002){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增视图模型："+sys.size(params_bm003)+"个 </br>";
    for(r in params_bm003){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    tmpInfo=tmpInfo+"新增多维模型："+sys.size(params_bm004)+"个 </br>";
    for(r in params_bm004){
        tmpInfo=tmpInfo+"  "+rLP.index+". "+r+" </br>";
    }
    list.add(importDetail,tmpInfo);
}
sql.commit();
sys.addRetData(importDetail,"importDetail");
sys.setRetData("0","","importDetail");