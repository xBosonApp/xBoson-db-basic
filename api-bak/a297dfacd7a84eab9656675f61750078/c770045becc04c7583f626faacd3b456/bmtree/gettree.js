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
//id:gettree
//name:获取类别索引tree
//点一次tree节点，取一次数据

var typecd=sys.request.typecd;

//检查typecd是否是操纵模型
var flag=false;
if(typecd != null){
    var checkSql="select typecd from sys_bm001 where typecd=?";
    var cnt=sql.query(checkSql,[typecd]);
    if(cnt == 0){
        flag=true;
    }
}

var param=[];
var result=[];
// 第一次加载
if(typecd == null){
    //获取定义操纵模型和多维数据模型两个节点数据
    var sql="select typecd,parentcd,typenm,shortkey,standard,datatable,url uri,version,status,mark,createdt,updatedt from sys_bm001 where typecd='BM.DMLM' or typecd='BM.MDDM'";
    sql.query(sql,null);
    result=sys.result.result;
}
// 操纵模型
else if(typecd=="BM.DMLM" || flag){
    //如果是操纵模型则从sys_md_mm001表中取
    var sql="select a.typecd,a.parentcd,a.typenm,a.shortkey,a.standard,a.datatable,a.url uri,a.version,a.status,a.mark,a.createdt,a.updatedt,(select count(*) from sys_md_mm001 where parentcd=a.typecd) isparent,(select count(*) from sys_md_mm003 where typecd=a.typecd) table_cnt from sys_md_mm001 a where a.parentcd=? and a.status='1'";
    if(typecd=="BM.DMLM"){
        param=["DS"];
    }else{
        param=[typecd];
    }
    sql.query(sql,param);
    for(r in sys.result.result){
        //过滤不存在物理表的子节点
        if(r.isparent=="0" && r.table_cnt=="0"){
            continue;
        }
        if(r.datatable=="sys_md_mm002"){
            map.put(r,"uri","bm/sys_md_mm002.html");
        }
        map.put(r,"flag",true);
        list.add(result,r);
    }
}
else{
    //获取以typecd为父节点的子节点数据
    var sql="select typecd,parentcd,typenm,shortkey,standard,datatable,url uri,version,status,mark,createdt,updatedt,(select count(*) from sys_bm001 b where b.parentcd=a.typecd) isparent,(select count(*) from sys_bm003 where typecd=a.typecd) bm003,(select count(*) from sys_bm004 where typecd=a.typecd) bm004 from sys_bm001 a where parentcd=?";
    sql.query(sql,[typecd]);
    result=sys.result.result;
}

//处理结果集，添加isParent属性等
//如果是第一次请求，则都加isParent = true
if(typecd == null){
    for(r in result){
        map.put(r,"isParent",true);
        if(r.typecd=="BM.DMLM"){
            map.put(r,"flag",true);
        }else{
            map.put(r,"flag",false);
        }
    }
}
else if(typecd=="BM.DMLM" || flag){
    for(r in result){
        if(r.isparent!="0"){
            map.put(r,"isParent",true);
        }
    }
}
else{
    for(r in result){
        //是否父节点
        if(r.isparent!="0"){
            map.put(r,"isParent",true);
        }
        //是否存在视图定义或维度定义
        if(r.bm003 == "0" && r.bm004=="0"){
            map.put(r,"new_node",true);
        }else{
            map.put(r,"new_node",false);
        }
        map.put(r,"flag",false);
    }
    //获取tree的全部节点
    var _sql="select typecd,parentcd,typenm,shortkey,standard,datatable,url uri,version,status,mark,createdt,updatedt,(select count(*) from sys_bm001 b where b.parentcd=a.typecd) isparent,(select count(*) from sys_bm003 where typecd=a.typecd) bm003,(select count(*) from sys_bm004 where typecd=a.typecd) bm004 from sys_bm001 a ";
    sql.query(_sql,[],"_result");
    var _result=sys.result._result;
    for(r in result){
        //父视图模型ID(view_nodecd)遍历获取
        var isfind=false;
        var tmpcd=r.parentcd;
        var max = 10000;
        while(true && --max>0) {
            for(t in _result){
                if(tmpcd=="BM.MDDM"){
                    map.put(r,"view_nodecd","");
                    isfind=true;
                    break;
                }
                if(tmpcd==t.typecd){
                    //向上遍历
                    tmpcd=t.parentcd;
                    if(t.bm003!="0"){
                        map.put(r,"view_nodecd",t.typecd);
                        isfind=true;
                    }
                    break;
                }
            }
            if(isfind){
                break;
            }
        }
    }
}
sys.addRetData(result,"result");
sys.setRetData("0","","result");