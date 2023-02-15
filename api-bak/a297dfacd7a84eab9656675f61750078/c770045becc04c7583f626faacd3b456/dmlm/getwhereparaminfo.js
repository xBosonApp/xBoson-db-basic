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
//id:getwhereparaminfo
//name:获取where条件参数（例如{paraname}）

// var typecd=sys.request.typecd;  //数据集模型id
var wheretext=sys.request.wheretext;    //where内容

// if(typecd==null){
//     sys.setRetData("1");
//     return;
// }
if(wheretext==null){
    sys.addRetData([],"result");
    sys.setRetData("0","","result");
    return;
}
var wheretext_copy=wheretext;

//获取wheretext中的{}里的参数名
var para_name_list=[];
while(true){
    var match=sys.regexFind("\\{.*\\}",wheretext);
    sys.printValue(wheretext,match);
    var tmp_wheretext="";
    if(match==true){
        tmp_wheretext=sys.regexReplaceFirst("\\{.*\\}",wheretext,"--{--}--");
    }else{
        //退出循环
        break;
    }
    var ind_start=sys.indexOf(tmp_wheretext,"--{--}--");  //{参数名}的开始索引
    //获取{参数名}结束索引
    var ind_end=0;
    var ind_tmp=ind_start+1;
    while(true){
        var tmp_char=sys.charAt(wheretext,ind_tmp);
        if(tmp_char=="}"){
            ind_end=ind_tmp;
            break;
        }else{
            ind_tmp=ind_tmp+1;
        }
    }
    //获取{参数名}中的参数名
    var param=sys.subStringTo(wheretext,ind_start+1,ind_end);
    list.add(para_name_list,param);
    //为wheretext重新赋值
    wheretext=sys.subString(wheretext,ind_end+1);
}
var result2 = [];
for(r in para_name_list){
    if(sys.regexFind("(?i)(\\S)+\\s*(=)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"01"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s*(!=)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"02"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s*(<>)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"03"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s*(>)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"04"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s*(<)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"05"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s*(>=)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"06"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s*(<=)\\s*\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"07"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(LIKE)\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"08"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(NOT LIKE)\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"09"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(NOT\\s+IN)\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"11"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(IN)\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"10"});
    }
    //修改日期：2016-12-19，修改说明：between 对前后两个参数进行检测
    else if(sys.regexFind("(?i)(\\S)+\\s+(NOT\\s+BETWEEN)\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"13"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(NOT\\s+BETWEEN)\\s+(\\S)+\\s+AND\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"13"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(BETWEEN)\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"12"});
    }
    else if(sys.regexFind("(?i)(\\S)+\\s+(BETWEEN)\\s+(\\S)+\\s+AND\\s+\\{"+r+"\\}",wheretext_copy)){
        list.add(result2,{"en":r,"condition":"12"});
    }
    
}
// sys.addRetData(para_name_list,"result");
sys.addRetData(result2,"result");
sys.setRetData("0","","result");

//获取sql条件数据字典
//=,!=,<>,>,<,>=,<=,like,not like,in,not in,between,not between
//is null,is not null
// var sql_cond=se.getCache(_CACHE_REGION_MDM_,_ORGID_PLATFORM_+":ZR.0049");
// //获取where条件参数
// //0.将where条件中换行去掉
// wherearea=sys.replace(wherearea,"\r\n","");
// wherearea=sys.replace(wherearea,"\n","");
// wherearea=sys.replace(wherearea,"\r","");
// //1.将where条件中双引号内容变为空
// wherearea=sys.regexReplaceAll("(?s)\".*\"",wherearea,"");
// //2.将where条件中单引号内容变为空
// wherearea=sys.regexReplaceAll("(?s)'.*'",wherearea,"");
// //依次获取参数及sql语句条件
// while(true){
//     var tmp_index=@wherearea.indexOf("?");
//     if(tmp_index==-1){
//         break;
//     }
//     //获取子串
//     var tmp_str=sys.subStringTo(wherearea,0,tmp_index+1);
//     if(sys.contain(tmp_str,"!=")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf("!="));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,">=")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf(">="));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,"<=")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf("<="));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,"<>")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf("<>"));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,"=")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf("="));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,">")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf(">"));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,"<")){
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf("<"));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }else if(sys.contain(tmp_str,"between")){
//         //如果是between,重新获取子串
//         tmp_index=@wherearea.indexOf("?");
//         tmp_str=sys.subStringTo(wherearea,0,tmp_index+1);
//         var _str=sys.subStringTo(tmp_str,0,@tmp_str.indexOf("between"));
//         var _arr=sys.split(_str," ");
//         var name=_arr[sys.size(_arr)-1];
//         //去除前面一个参数
//         wherearea=sys.subString(wherearea,tmp_index+1);
//     }
// }