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
var path=se.getCache(_CACHE_REGION_CONFIG_,"FILE_PATH_SUB_TMP");  //导入包相对路径
var filenm=sys.request.filenm;  //导入包名称


// list=[
//     {"name":"zip项名","content":"内容"}
//     ...
// ]
// resultMap={
//     "dedstree":[],  //数据元数据集tree
//     "de_data":[],   //数据元
//     "ds_data":[],   //数据集
//     "table_data":[],    //表数据
//     "item":[],  //项目
//     "app":[],   //app
//     "mod":[],   //mod
//     "api":[],   //api
//     "role":[],  //普通角色
//     "allmodeltree":  //多维模型tree(操纵，视图，多维)
//     "modeltree":[], //多维模型tree（视图，多维）
//     "dmlm_model":[], //操纵模型List
// };
//获取压缩包内容
var decryptKey="export&&import111";
var list=sys.zipToList(path,filenm);
var resultMap={
    "dedstree":[],
    "de_data":[],
    "ds_data":[],
    "table_data":[],
    "item":[],
    "app":[],
    "mod":[],
    "api":[],
    "role":[],
    "allmodeltree":[],
    "modeltree":[],
    "dmlm_model":[]
};
var iscatch=false;
for(r in list){
    if(r.name=="附录"){
        map.put(resultMap,"appendices",r.content);
        continue;
    }
    var content=sys.decrypt(r.content,decryptKey),
    contentObj=sys.instanceFromJson(content);
    //数据元数据集tree
    if(r.name=="数据元数据集tree"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"dedstree",contentObj);
            continue;
        }
        //检查当前系统中，是否已存在相同的typecd
        var in_typecd="";
        for(r2 in contentObj){
            in_typecd=in_typecd+",'"+r2.typecd+"'";
        }
        in_typecd=sys.subString(in_typecd,1);
        var sqlchk_dedstree="select * from sys_md_mm001 where typecd in ("+in_typecd+")";
        sql.query(sqlchk_dedstree,null,"chk_dedstree_r");
        //添加_isexist,_existinfo属性
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_dedstree_r){
                if(r3.typecd==r2.typecd){
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    isfind=true;
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"dedstree",contentObj);
    }
    //数据元
    else if(r.name=="数据元"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"de_data",contentObj);
            continue;
        }
        //检查当前系统中是否已存在相同的decd
        var in_decd="";
        for(r2 in contentObj){
            in_decd=in_decd+",'"+r2.decd+"'";
        }
        in_decd=sys.subString(in_decd,1);
        var sqlchk_de="select * from sys_mdm003 where decd in ("+in_decd+")";
        sql.query(sqlchk_de,null,"chk_de_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_de_r){
                if(r3.decd==r2.decd){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"de_data",contentObj);
    }
    //数据集
    else if(r.name=="数据集"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"ds_data",contentObj);
            continue;
        }
        //检查当前系统中是否已存在相同的typecd--en
        var or_typecd_en="";
        for(r2 in contentObj){
            or_typecd_en=or_typecd_en+" or (typecd='"+r2.typecd+"' and en='"+r2.en+"')  ";
        }
        or_typecd_en=sys.subString(or_typecd_en,3);
        var sqlchk_ds="select * from sys_md_mm002 where "+or_typecd_en;
        sql.query(sqlchk_ds,null,"chk_ds_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_ds_r){
                if(r3.decd==r2.decd){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"ds_data",contentObj);
    }
    //表数据
    else if(r.name=="表数据"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"table_data",contentObj);
            continue;
        }
        //检查数据集表映射是否存在
        var or_typecd_en="";
        for(r2 in contentObj){
            or_typecd_en=or_typecd_en+" or (typecd='"+r2.typecd+"' and en='"+r2.en+"' and did='00000000000000000000000000000000') ";
        }
        or_typecd_en=sys.subString(or_typecd_en,3);
        var sqlchk_ds_table="select * from sys_md_mm003 where "+or_typecd_en;
        sql.query(sqlchk_ds_table,null,"chk_ds_table_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_ds_table_r){
                if(r3.typecd==r2.typecd && r3.en==r2.en){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"table_data",contentObj);
    }
    //项目
    else if(r.name=="项目"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"item",contentObj);
            continue;
        }
        //检查项目是否存在
        var in_item="";
        for(r2 in contentObj){
            in_item=in_item+",'"+r2.roleid+"'";
        }
        in_item=sys.subString(in_item,1);
        var sqlchk_item="select * from sys_role where roleid in ("+in_item+")";
        sql.query(sqlchk_item,null,"chk_item_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_item_r){
                if(r3.roleid==r2.roleid){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
            //添加name字段
            map.put(r2,"name",r2.rolenm);
        }
        map.put(resultMap,"item",contentObj);
    }
    //项目
    else if(r.name=="app"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"app",contentObj);
            continue;
        }
        //检查项目是否存在
        var in_app="";
        for(r2 in contentObj){
            in_app=in_app+",'"+r2.appid+"'";
        }
        in_app=sys.subString(in_app,1);
        var sqlchk_app="select * from sys_apps where appid in ("+in_app+")";
        sql.query(sqlchk_app,null,"chk_app_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_app_r){
                if(r3.appid==r2.appid){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
            //添加name字段
            map.put(r2,"name",r2.appnm);
        }
        map.put(resultMap,"app",contentObj);
    }
    //mod
    else if(r.name=="mod"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"mod",contentObj);
            continue;
        }
        //检查项目是否存在
        var or_app_mod="";
        for(r2 in contentObj){
            or_app_mod=or_app_mod+" or (appid='"+r2.appid+"' and moduleid='"+r2.moduleid+"') ";
        }
        or_app_mod=sys.subString(or_app_mod,3);
        var sqlchk_mod="select * from sys_modules where "+or_app_mod;
        sql.query(sqlchk_mod,null,"chk_mod_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_mod_r){
                if(r3.appid==r2.appid&&r3.moduleid==r2.moduleid){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
            //添加name字段
            map.put(r2,"name",r2.modulenm);
        }
        map.put(resultMap,"mod",contentObj);
    }
    //api
    else if(r.name=="api"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"api",contentObj);
            continue;
        }
        //检查项目是否存在
        var or_app_mod_api="";
        for(r2 in contentObj){
            or_app_mod_api=or_app_mod_api+" or (appid='"+r2.appid+"' and moduleid='"+r2.moduleid+"' and apiid='"+r2.apiid+"') ";
        }
        or_app_mod_api=sys.subString(or_app_mod_api,3);
        var sqlchk_api="select * from sys_apis where "+or_app_mod_api;
        sql.query(sqlchk_api,null,"chk_api_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_api_r){
                if(r3.appid==r2.appid&&r3.moduleid==r2.moduleid&&r3.apiid==r2.apiid){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
            //添加name字段
            map.put(r2,"name",r2.apinm);
        }
        map.put(resultMap,"api",contentObj);
    }
    //角色
    else if(r.name=="普通角色"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"role",contentObj);
            continue;
        }
        //检查角色在当前系统是否存在
        var in_role="";
        for(r2 in contentObj){
            in_role=in_role+",'"+r2.roleid+"'";
        }
        in_role=sys.subString(in_role,1);
        var sqlchk_role="select * from sys_role where roleid in ("+in_role+")";
        sql.query(sqlchk_role,null,"chk_role_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_role_r){
                if(r3.roleid==r2.roleid){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"role",contentObj);
    }
    //业务模型类别tree（操纵，视图，多维）
    else if(r.name=="业务模型类别tree（操纵，视图，多维）"){
        map.put(resultMap,"allmodeltree",contentObj);
    }
    //业务模型类别tree（视图，多维）
    else if(r.name=="业务模型类别tree（视图，多维）"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"modeltree",contentObj);
            continue;
        }
        //检查模型类别是否存在
        var in_model="";
        for(r2 in contentObj){
            in_model=in_model+",'"+r2.typecd+"'";
        }
        in_model=sys.subString(in_model,1);
        var sqlchk_model="select * from sys_bm001 where typecd in ("+in_model+")";
        sql.query(sqlchk_model,null,"chk_model_r");
        //添加_isexist,_existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_model_r){
                if(r3.typecd==r2.typecd){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"modeltree",contentObj);
    }
    //操纵模型
    else if(r.name=="操纵模型"){
        if(sys.size(contentObj)==0){
            map.put(resultMap,"dmlm_model",contentObj);
            continue;
        }
        //检查模型ID是否存在
        var in_model="";
        for(r2 in contentObj){
            in_model=in_model+",'"+r2.modolcd+"'";
        }
        in_model=sys.subString(in_model,1);
        var sqlchk_dmlm="select * from sys_bm002 where modolcd in ("+in_model+")";
        sql.query(sqlchk_dmlm,null,"chk_dmlm_r");
        //添加_isexist,existinfo
        for(r2 in contentObj){
            var isfind=false;
            for(r3 in sys.result.chk_dmlm_r){
                if(r2.modolcd==r3.modolcd){
                    isfind=true;
                    map.put(r2,"_isexist",true);
                    map.put(r2,"_existinfo",r3);
                    break;
                }
            }
            if(!isfind){
                map.put(r2,"_isexist",false);
                map.put(r2,"_existinfo","");
            }
        }
        map.put(resultMap,"dmlm_model",contentObj);
    }
}
sys.printValue(resultMap);
//返回页面需要的数据
var resultData={
    "apitree":[],
    "ui":[],
    "dedstree":[],
    "de_data":{},
    "ds_data":{},
    "ds_table":{},
    "table_data":[],
    "role":[],
    "allmodeltree":[],
    "appendices":""
};
if(resultMap!={}){
    //1.项目--app--mod--api Tree
    sys.setRetList(resultMap.mod,resultMap.api,[["appid","appid"],["moduleid","moduleid"]],"children");
    sys.setRetList(resultMap.app,resultMap.mod,[["appid","appid"]],"children");
    sys.setRetList(resultMap.item,resultMap.app,[["roleid","roleid"]],"children");
    map.put(resultData,"apitree",resultMap.item);
    //2.ui
    //3.数据元数据集tree
    map.put(resultData,"dedstree",resultMap.dedstree);
    //数据元
    var tmp_de={};
    for(r in resultMap.de_data){
        if(map.containsKey(tmp_de,r.typecd)){
            list.add(tmp_de[r.typecd],r);  
        }else{
            map.put(tmp_de,r.typecd,[]);
            list.add(tmp_de[r.typecd],r);
        }
    }
    map.put(resultData,"de_data",tmp_de);
    //数据集
    var tmp_ds={};
    for(r in resultMap.ds_data){
        if(map.containsKey(tmp_ds,r.typecd)){
            list.add(tmp_ds[r.typecd],r);  
        }else{
            map.put(tmp_ds,r.typecd,[]);
            list.add(tmp_ds[r.typecd],r);
        }
    }
    map.put(resultData,"ds_data",tmp_ds);
    //表数据
    map.put(resultData,"table_data",resultMap.table_data);
    //数据集表映射
    var tmp_ds_table={};
    for(r in resultMap.table_data){
        if(map.containsKey(tmp_ds_table,r.typecd)){
        }else{
            map.put(tmp_ds_table,r.typecd,[]);
        }
        list.add(tmp_ds_table[r.typecd],{
            "typecd":r.typecd,
            "en":r.en,
            "_isexist":r["_isexist"],
            "_existinfo":r["_existinfo"]
        });
    }
    map.put(resultData,"ds_table",tmp_ds_table);
    //4.角色
    map.put(resultData,"role",resultMap.role);
    //5.业务模型
    //添加_isexist,_existinfo
    for(r in resultMap.allmodeltree){
        var isfind=false;
        for(r2 in resultMap.modeltree){
            if(r.typecd==r2.typecd){
                map.put(r,"_isexist",r2["_isexist"]);
                map.put(r,"_existinfo",r2["_existinfo"]);
                isfind=true;
                break;
            }
        }
        if(!isfind){
            map.put(r,"_isexist",false);
            map.put(r,"_existinfo","");
        }
    }
    for(r in resultMap.allmodeltree){
        if(!r["_isexist"]){
            var isfind=false;
            for(r2 in resultMap.dmlm_model){
                if(r.typecd==r2.modolcd){
                    map.put(r,"_isexist",r2["_isexist"]);
                    map.put(r,"_existinfo",r2["_existinfo"]);
                    isfind=true;
                    break;
                }
            }
            if(!isfind){
                map.put(r,"_isexist",false);
                map.put(r,"_existinfo","");
            }    
        }
    }
    map.put(resultData,"allmodeltree",resultMap.allmodeltree);
    
    //附录
    map.put(resultData,"appendices",resultMap.appendices);
    
    sys.addRetData(resultData,"result");
    sys.setRetData("0","","result");
}else{
    sys.setRetData("2","压缩包内容为空！");
}