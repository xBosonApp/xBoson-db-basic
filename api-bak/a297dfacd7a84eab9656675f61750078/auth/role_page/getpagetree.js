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
var roleid = sys.request.roleid;

if(roleid==null){
    sys.setRetData("1");
    return;
}

//角色页面权限-sys_role_page_auth
var sql1 = "select roleid,pageid,page_auth,status,createdt,updatedt from sys_role_page_auth where roleid=? and status='1'";

sql.query(sql1,[roleid],"page_authR");

//页面Tree
var sql2 = "select pageid,pagenm,page_path from sys_page";
sql.query(sql2,null,"pageR");

//sys.result.pageR->Tree(id,pid)
var result=[];
for(r in sys.result.pageR){
    var tmp=sys.split(r.page_path,"/");
    var tmp_size=sys.size(tmp);
    //根路径
    if(tmp_size==1){
        map.put(r,"id",tmp[0]);
        map.put(r,"name",r.pagenm+"("+tmp[0]+")");
        list.add(result,r);
    }else{
        var pid = "";
        map.put(r,"id",tmp[tmp_size-1]);
        map.put(r,"name",r.pagenm+"("+tmp[tmp_size-1]+")");
        //计算父路径
        pid="";
        list.removeAt(tmp,tmp_size-1);
        for(_path in tmp){
            pid = pid+"/"+_path;
        }
        map.put(r,"pid",pid);
        list.add(result,r);
        //父节点
        var i=2;
        while(tmp_size-i>=0){
            var _tmp={};
            //到达根路径
            if(tmp_size-i==0){
                _tmp={
                    "id":"/"+tmp[0],
                    "name":"/"+tmp[0]
                };
                if(!list.contain(result,_tmp)){
                    list.add(result,_tmp);    
                }
                break;
            }
            //计算路径
            var id="";
            for(_path in tmp){
                id = id+"/"+_path;
            }
            //_tmp
            _tmp={
                "name":tmp[tmp_size-i]
            };
            //计算父路径
            pid="";
            list.removeAt(tmp,tmp_size-i);
            for(_path in tmp){
                pid = pid+"/"+_path;
            }
            map.put(_tmp,"pid",pid);
            map.put(_tmp,"id",id);
            if(!list.contain(result,_tmp)){
                list.add(result,_tmp);    
            }
            i++;
        }
    }
}

//Tree节点加上page_auth属性(0-只读,1-编辑)
for(r in sys.result.page_authR){
    for(r2 in result){
        if(r2.pageid==r.pageid){
            map.put(r2,"page_auth",r.page_auth);
            break;
        }
    }
}

sys.addRetData(result,"result");
sys.setRetData("0","","result");