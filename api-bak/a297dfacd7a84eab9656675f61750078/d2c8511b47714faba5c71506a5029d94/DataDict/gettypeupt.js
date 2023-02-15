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
//测试URL:http://192.168.7.225:8088/ds/api/gettypeupt?app=d2c8511b47714faba5c71506a5029d94&mod//=DataDict&org=a297dfacd7a84eab9656675f61750078&openid=B8C9BC769810A9D324523B7059F15B7EB6B438F4E//EF9A3D622E61A3351CF2D34&s=d&mdk=b415405bd63947a3aa9eccf6607dd496&userkeylocal=e08bdb531504480c8//b42987bed4bf2af&orgtype=v&typecd=2222222
//编写人:王莹莹
//接口名称：同步数据类别索引信息
//功能说明：同步数据类别索引信息
//接口URL：gettypeupt

//获取参数
var typecd=sys.request.typecd;

if(typecd==null){
  sys.setRetData("1");
  return;
}

var param=[typecd];
var sql="select typecd,parentcd,typenm,shortkey,standard,datatable,version,mark,status,url  from sys_mdm001 where typecd=?";
sql.query(sql,param);
// 获取版本集合
var getVersion = "select distinct version from sys_mdm002 where typecd=?";
sql.query(getVersion,[typecd],"versions");
for(r in sys.result.versions){
    map.put(r,"id",r.version);
    map.put(r,"name",r.version);
    map.put(r,"text",r.version);
}

sys.setRetData("0","","result","versions");