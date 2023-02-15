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
var pagenum = sys.request.pagenum;
var pagesize = sys.request.pagesize;
var zxlx = sys.request.zxlx;
if(zxlx==null)
{
  var params = [1];
  if(pagenum!=null && pagesize!=null)
  {
    var sqlPaging = "select * from zsyl_zxgl where zt = ? order by gxrq desc";
    
    var queryPagingCount = sql.queryPaging(sqlPaging, params, pagenum, pagesize, "resKey");
    var res = sys.result.resKey;
    var results = [];
    for(var r in res)
    {
      list.add(results, r);
    }
    sys.addRetData(results,"result");
    sys.setRetData("0","","result");
  }
  
  else
  {
    var sqls = "select * from zsyl_zxgl where zt = ? order by gxrq desc";
    sql.query(sqls,params,"resKey");
    var resKey = sys.result.resKey;
    if(resKey == null || sys.size(resKey) == 0)
    {
      sys.setRetData(-1,"该资讯不存在！");
      return;
    }
    else
    {
      var result = resKey[0];
    } 
    
    sys.addRetData(resKey, "result");
    sys.setRetData(0,"","result");
  }
}
else
{
  var params = ["1", zxlx];


  if(pagenum!=null && pagesize!=null)
  {
    var sqlPaging = "select * from zsyl_zxgl where zt = ? and zxlx = ? order by gxrq desc";
    
    var queryPagingCount = sql.queryPaging(sqlPaging, params, pagenum, pagesize, "resKey");
    var res = sys.result.resKey;
    var results = [];
    for(var r in res)
    {
      list.add(results, r);
    }
    sys.addRetData(results,"result");
    sys.setRetData("0","","result");
  }
  
  else
  {
    var sqls = "select * from zsyl_zxgl where zt = ? and zxlx = ? order by gxrq desc";
    sql.query(sqls,params,"resKey");
    var resKey = sys.result.resKey;
    if(resKey == null || sys.size(resKey) == 0)
    {
      sys.setRetData(-1,"该资讯不存在！");
      return;
    }
    else
    {
      var result = resKey[0];
    } 
    
    sys.addRetData(resKey, "result");
    sys.setRetData(0,"","result");
  }
}