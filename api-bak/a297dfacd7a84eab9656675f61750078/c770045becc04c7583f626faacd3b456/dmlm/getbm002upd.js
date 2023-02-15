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
//id：getbm002upd
//name:同步操纵定义

var modolcd=sys.request.modolcd;//业务模型ID

if(modolcd==null){
    sys.setRetData("1");
    return;
}

var sel="select modolcd,modolnm,dstypecd,did,tablenm,sqltype,sqltext,sqlparams,typecontent,jsondata,mark,status,createdt,updatedt,isui from sys_bm002 where modolcd=?";
sql.query(sel,[modolcd]);
// if(sys.size(sys.result.result)>0){
//     map.put(sys.result.result[0],"definite",sys.split(sys.result.result[0].modolcd,".")[1]);
// }
sys.setRetData("0","","result");