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
//id:modalsel2
//name:模型下拉菜单

var typecd=sys.request.typecd;

if(typecd==null){
    sys.setRetData("1");
    return;
}
//检查typecd是否存在
var sqlchk="select typecd from sys_md_mm001 where typecd=?";
sql.query(sqlchk,[typecd],"chk_r");
if(sys.size(sys.result.chk_r)==0){
    sys.setRetData("2","类别编码不存在！");
    return;
}
//查看typecd是在数据元目录下，还是数据集目录下
var isde="2";   //0:数据集，1：数据元，2：根目录
//父类别编码不存在，则在根目录
if(sql.query("select typecd from sys_md_mm001 where typecd=(select parentcd from sys_md_mm001 where typecd=?)",[typecd])==0){
    isde="2";
}else{
    var getall="select typecd,parentcd from sys_md_mm001";
    sql.query(getall,null,"data");
    var data=sys.result.data;
    list.add(data,{"typecd":"0","parentcd":"0"});
    if(sys.toLowerCase(typecd)=="de"){
        isde="1";
    }else if(sys.toLowerCase(typecd)=="ds"){
        isde="0";
    }else{
        for(r in data){
            if(r.typecd==typecd){
                var tmp=r;
                while(true){
                    var flag=false;
                    for(d in data){
                        if(tmp.parentcd==d.typecd){
                            if(sys.toLowerCase(d.typecd)=="de"){
                                isde="1";
                                flag=true;
                                break;
                            }else if(sys.toLowerCase(d.typecd)=="ds"){
                                isde="0";
                                flag=true;
                                break;
                            }else if(sys.toLowerCase(d.typecd)=="0"){
                                isde="2";
                                flag=true;
                                break;
                            }else{
                                tmp=d;
                            }
                        }
                    }
                    if(flag){
                       break; 
                    }
                    
                }
            }
        }
    }
}

var defaultValue = "e";// ID is empty
var result = [{"id": defaultValue,"name":"目录","text":"目录"}];   //select2数据源

//默认值，数据元目录的默认值为sys_mdm003，数据集目录下的默认值为sys_md_mm002
if(isde=="0"){
    var tmp = {"id":"sys_md_mm002","name":"数据集","text":"数据集"};
    list.add(result,tmp);
    defaultValue = "sys_md_mm002";
}else if(isde=="1"){
    var tmp = {"id":"sys_mdm003","name":"数据元","text":"数据元"};
    list.add(result,tmp);
    defaultValue = "sys_mdm003";
}else{
    var tmp = {"id":"sys_mdm003","name":"数据元","text":"数据元"};
    list.add(result,tmp);
    tmp = {"id":"sys_md_mm002","name":"数据集","text":"数据集"};
    list.add(result,tmp);
    defaultValue=typecd=="DE"?"sys_mdm003":"sys_md_mm002";
}
// var result = [{"id":"","name":"目录","text":"目录"}];
// if(sys.startWith(typecd,"DS")){
//     var tmp = {"id":"sys_md_mm002","name":"数据集","text":"数据集"};
//     list.add(result,tmp);
// }else if(sys.startWith(typecd,"DE")){
//     var tmp = {"id":"sys_mdm003","name":"数据元","text":"数据元"};
//     list.add(result,tmp);
// }else{
//     var tmp = {"id":"sys_mdm003","name":"数据元","text":"数据元"};
//     list.add(result,tmp);
//     tmp = {"id":"sys_md_mm002","name":"数据集","text":"数据集"};
//     list.add(result,tmp);
// }

//返回默认值
sys.addRetData(defaultValue,"def_value");
sys.addRetData(result,"result");
sys.setRetData("0","","result","def_value");