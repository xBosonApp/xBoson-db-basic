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
if(json==null){
    sys.setRetData("1");
    return;
}
var jsonObj=sys.instanceFromJson(json);
var contentList=[]; //zip内容项
var encryptKey="export&&import111";
// jsonObj={
//      "deds":{
//          "dedstree":[],  //数据元，数据集typecds
//          "de":[{"typecd":"","decd":""}...]   //数据元
//      },
//     "table_data":[
//         {"typecd":"","en":"表名","data":[]},  //表和数据
//         ...
//     ],
//     "items":[
//         {"roleid":"项目id","appid":"","moduleid":"","apiid":"","level":0}
//         ...
//     ],
//     "roles":["普通角色id",...],
//     "model":[
//         {"typecd":"模型ID","typenm":"","parentcd":"","sqltype":"（I,U,D,S,SS）","isbm001":"1"},
//         ...
//     ],
//     "appendices":"附录说明"
// };

//1.类别tree,数据元，数据集
var deds=jsonObj["deds"];
if(deds!=null){
    var dedsTree=deds["dedstree"];  //数据元数据集tree
    var de=deds["de"];  //数据元
    if(sys.size(dedsTree)>0){
        //类别tree
        var typecds="";
        for(r in dedsTree){
            typecds=typecds+","+"'"+r+"'";
        }
        typecds=sys.subString(typecds,1);
        var sqldedsTree="select typecd,parentcd,typenm,shortkey,standard,url,datatable,version,status,mark,createdt,updatedt from sys_md_mm001 where typecd in ("+typecds+")";
        sql.query(sqldedsTree,null,"dedstree_r");
        list.add(contentList,{
            "name":"数据元数据集tree",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.dedstree_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.de_r));
        //数据集
        var sqlds="select typecd,decd,en,cn,mk,must,dv,sorting,elemtype,status,mark,createdt,updatedt from sys_md_mm002 where typecd in ("+typecds+")";
        sql.query(sqlds,null,"ds_r");
        list.add(contentList,{
            "name":"数据集",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.ds_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.ds_r));
        
        //数据集索引映射
        var sqlds_index="select typecd,en,cn,fields,sort,status,mark,createdt,updatedt from sys_md_mm004 where typecd in ("+typecds+")";
        sql.query(sqlds_index,null,"ds_index_r");
        list.add(contentList,{
            "name":"数据集索引映射",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.ds_index_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.ds_index_r)); 
    
        //检查数据集中的数据元是否存在
        var noexist_de=[];
        for(r in sys.result.ds_r){
            var isfind=false;
            for(r2 in de){
                if(r.decd==r2.decd){
                    isfind=true;
                    break;
                }
            }
            if(!isfind){
                list.add(noexist_de,{"数据集ID":r.typecd,"数据元ID":r.decd});
            }
        }
        if(sys.size(noexist_de)>0){
            sys.setRetData("1",noexist_de+"  以上数据集中的数据元不存在！");
            return;
        }
    }
    if(sys.size(de)>0){
        //数据元
        var decds="";
        for(r in de){
            decds=decds+","+"'"+r.decd+"'";
        }
        decds=sys.subString(decds,1);
        var sqlde="select typecd,decd,en,cn,datatype,numrange,format,unit,dict,status,mark,createdt,updatedt,isstd from sys_mdm003 where decd in ("+decds+")";
        sql.query(sqlde,null,"de_r");
        list.add(contentList,{
            "name":"数据元",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.de_r),encryptKey)
        });
    }
}
//2.表数据
var table_data=jsonObj["table_data"];
if(table_data!=null){
    if(sys.size(table_data)>0){
        var or_typecd_en="";
        for(r in table_data){
            or_typecd_en=or_typecd_en+" or (typecd='"+r.typecd+"' and en='"+r.en+"' and did='00000000000000000000000000000000') ";
        }
        or_typecd_en=sys.subString(or_typecd_en,3);
        //数据集表映射
        var sqlds_table="select typecd,did,en,cn,table_space,status,count,size,mark,createdt,updatedt from sys_md_mm003 where "+or_typecd_en;
        sql.query(sqlds_table,null,"ds_table_r");
        list.add(contentList,{
            "name":"数据集表映射",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.ds_table_r),encryptKey)
        });
        
        list.add(contentList,{
            "name":"表数据",
            "content":sys.encrypt(sys.jsonFromInstance(table_data),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(table_data));
    }
}
//3.itemid,appid,moduleid,apiid
var items=jsonObj["items"];
if(items!=null){
    if(sys.size(items)>0){
        //项目
        var in_items="";
        for(r in items){
            if(r.level==0){
                in_items=in_items+","+"'"+r.roleid+"'";
            }
        }
        in_items=sys.subString(in_items,1);
        var sqlitem="select roleid,rolenm,op_type,role_type,role_desc,status,createdt,updatedt from sys_role where roleid in ("+in_items+")";
        sql.query(sqlitem,null,"items_r");
        list.add(contentList,{
            "name":"项目",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.items_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.items_r));
        //app
        var in_apps="";
        for(r in items){
            if(r.level==1){
                in_apps=in_apps+","+"'"+r.appid+"'";
            }
        }
        in_apps=sys.subString(in_apps,1);
        var sqlapps="select appid,appnm,about,appflag,status,createdt,updatedt from sys_apps where appid in ("+in_apps+")";
        sql.query(sqlapps,null,"apps_r");
        //结果集添加roleid字段
        for(r in sys.result.apps_r){
            for(r2 in items){
                if(r2.level==1&&r2.appid==r.appid){
                    map.put(r,"roleid",r2.roleid);
                }
            }
        }
        list.add(contentList,{
            "name":"app",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.apps_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.apps_r));
        //mod
        var or_mods="";
        for(r in items){
            if(r.level==2){
                or_mods=or_mods+" or (appid='"+r.appid+"' and moduleid='"+r.moduleid+"')";
            }
        }
        or_mods=sys.subString(or_mods,3);
        var sqlmods="select appid,moduleid,modulenm,about,auflag,status,createdt,updatedt from sys_modules where "+or_mods;
        sql.query(sqlmods,null,"mods_r");
        list.add(contentList,{
            "name":"mod",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.mods_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.mods_r));
        //api
        var or_apis="";
        for(r in items){
            if(r.level==3){
                or_apis=or_apis+" or (appid='"+r.appid+"' and moduleid='"+r.moduleid+"' and apiid='"+r.apiid+"')";
            }
        }
        or_apis=sys.subString(or_apis,3);
        var sqlapis="select appid,moduleid,apiid,apinm,op_type,contentid,help_info,status,createdt,updatedt from sys_apis where "+or_apis;
        sql.query(sqlapis,null,"apis_r");
        list.add(contentList,{
            "name":"api",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.apis_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.apis_r));
        //apicontent
        var sqlapicontent="select contentid,stability,updatecmt,pid,updatedt,content from  sys_api_content where contentid in (select contentid from sys_apis where "+or_apis+")";
        sql.query(sqlapicontent,null,"apicontent_r");
        list.add(contentList,{
            "name":"apicontent",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.apicontent_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.apicontent_r));
    }
}

//4.普通角色
var roles=jsonObj["roles"];
if(roles!=null){
    if(sys.size(roles)>0){
        var in_roleid="";
        for(r in roles){
            in_roleid=in_roleid+",'"+r+"'";
        }
        in_roleid=sys.subString(in_roleid,1);
        var sqlroles="select roleid,rolenm,op_type,role_type,role_desc,status,createdt,updatedt from sys_role where roleid in ("+in_roleid+")";
        sql.query(sqlroles,null,"roles_r");
        list.add(contentList,{
            "name":"普通角色",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.roles_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.roles_r));
        //角色api映射
        var sqlroleapi="select roleid,appid,moduleid,apiid,status,createdt,updatedt from sys_role_api where roleid in ("+in_roleid+")";
        sql.query(sqlroleapi,null,"roleapi_r");
        list.add(contentList,{
            "name":"普通角色API映射",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.roleapi_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.roleapi_r));
        //角色模型映射
        var sqlrolemodel="select roleid,typecd,status,createdt,updatedt from sys_role_model where roleid in ("+in_roleid+")";
        sql.query(sqlrolemodel,null,"rolemodel_r");
        list.add(contentList,{
            "name":"普通角色模型映射",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.rolemodel_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.rolemodel_r));
    }
}

//5.业务模型
var model=jsonObj["model"];
if(model!=null){
    if(sys.size(model)>0){
        var model1=[];  //操纵模型id
        var model2=[];  //视图模型id
        var model3=[];  //多维模型id
        var bm001Model=[];   //视图，多维模型tree
        for(r in model){
            if(r.sqltype=="I"||r.sqltype=="D"||r.sqltype=="U"||r.sqltype=="S"){
                list.add(model1,r.typecd);
            }else if(r.sqltype=="S-view"){
                list.add(model2,r.typecd);
            }else if(r.sqltype=="S-dimension"){
                list.add(model3,r.typecd);
            }
            if(r.isbm001=="1"){
                list.add(bm001Model,r.typecd);
            }
        }
        //业务模型类别tree（操纵，视图，多维）
        list.add(contentList,{
            "name":"业务模型类别tree（操纵，视图，多维）",
            "content":sys.encrypt(sys.jsonFromInstance(model),encryptKey)
        });
        //业务模型类别tree（视图，多维）
        var in_modelcd="";
        for(r in bm001Model){
            in_modelcd=in_modelcd+",'"+r+"'";
        }
        in_modelcd=sys.subString(in_modelcd,1);
        var sqlmodelTree="select typecd,parentcd,typenm,shortkey,standard,datatable,url,version,status,mark,createdt,updatedt from sys_bm001 where typecd in ("+in_modelcd+")";
        sql.query(sqlmodelTree,null,"modeltree_r");
        list.add(contentList,{
            "name":"业务模型类别tree（视图，多维）",
            "content":sys.encrypt(sys.jsonFromInstance(sys.result.modeltree_r),encryptKey)
        });
        // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.modeltree_r));
        //操纵模型
        if(sys.size(model1)>0){
            var in_model1="";
            for(r in model1){
                in_model1=in_model1+",'"+r+"'";
            }
            in_model1=sys.subString(in_model1,1);
            var sqlmodel1="select modolcd,modolnm,dstypecd,did,tablenm,sqltype,sqltext,sqlparams,jsondata,typecontent,status,mark,createdt,updatedt from sys_bm002 where modolcd in ("+in_model1+")";
            sql.query(sqlmodel1,null,"model1_r");
            list.add(contentList,{
                "name":"操纵模型",
                "content":sys.encrypt(sys.jsonFromInstance(sys.result.model1_r),encryptKey)
            });
            // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.model1_r));
        }
        //视图模型
        if(sys.size(model2)>0){
            var in_model2="";
            for(r in model2){
                in_model2=in_model2+",'"+r+"'";
            }
            in_model2=sys.subString(in_model2,1);
            var sqlmodel2="select typecd,did,table_json,editing_type,jsondata_select,fromcontent,jsondata_where,sel_whe_columns,sqltext,typecontent,status,mark,createdt,updatedt from sys_bm003 where typecd in ("+in_model2+")";
            sql.query(sqlmodel2,null,"model2_r");
            list.add(contentList,{
                "name":"视图模型",
                "content":sys.encrypt(sys.jsonFromInstance(sys.result.model2_r),encryptKey)
            });
            // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.model2_r));
        }
        //多维模型
        if(sys.size(model3)>0){
            var in_model3="";
            for(r in model3){
                in_model3=in_model3+",'"+r+"'";
            }
            in_model3=sys.subString(in_model3,1);
            var sqlmodel3="select typecd,typecd_parent,tablesource,table_json,row_json,column_json,where_json,typecontent,status,mark,createdt,updatedt from sys_bm004 where typecd in ("+in_model3+")";
            sql.query(sqlmodel3,null,"model3_r");
            list.add(contentList,{
                "name":"多维模型",
                "content":sys.encrypt(sys.jsonFromInstance(sys.result.model3_r),encryptKey)
            });
            // list.add(contentList,sys.encrypt(sys.jsonFromInstance(sys.result.model3_r));
        }
    }
}

//6.UI文件
// var uitree=jsonObj["uitree"];
// if(uitree!=null){
    
// }

//7.附录说明
var appendices=jsonObj["appendices"];
if(appendices!=""){
    list.add(contentList,{
        "name":"附录",
        "content":appendices
    });
}

if(sys.size(contentList)==0){
    sys.setRetData("1","请选择至少一项！");
    return;
}
var filenm=sys.listToZip(contentList,"/tmp");
sys.addRetData([{"path":"/tmp","name":filenm}]);
sys.setRetData("0","","result");