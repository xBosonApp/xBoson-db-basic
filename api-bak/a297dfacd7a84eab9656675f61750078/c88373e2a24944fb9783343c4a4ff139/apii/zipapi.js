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
"use strict";
//
// 该脚本压缩所有 zip==0 的脚本/历史, 慎重调用.
//
var apicount = 0;
var hiscount = 0;
var tbegin = Date.now();
try {
  sql.setAutoCommit(false);
  sql.query('Select orgid From sys_tenant', [], 'org');
  sys.result.org.forEach(function(o) {
    console.log('>>>>>> ORG', o.orgid);
    sql.query('Select * From '+ o.orgid +'.sys_api_content Where zip=0', [], 'api');
    
    sys.result.api.forEach(function(api) {
      if (!api.content) {
        console.log(' + API SKIP', api.contentid);
        return;
      }
      
      var src = se.decodeApiScript(api.content);
      if (!src) {
        console.log(' ! API SKIP', api.contentid);
        return;
      }
      
      var zip = se.genZip(src);
      var cyp = se.encodeApi2(src, zip);
      
      sql.update('UPDATE '+ o.orgid +
        '.sys_api_content SET content=?, zip=? Where contentid=?', 
        [ cyp, zip, api.contentid ], '1');
        
      console.log(' - API', api.contentid, per(cyp, src));
      ++apicount;
      
        
      if (0 < sql.query('Select * From '+ o.orgid +
          '.sys_api_his_content Where contentid=? And zip=0', 
          [api.contentid], 'his')) {
            
        sys.result.his.forEach(function(his) {
          if (!his.content) {
            console.log('  + HIS SKIP', his.hisid);
            return;
          }
          
          var src = se.decodeApiScript(his.content);
          if (!src) {
            console.log('  ! HIS SKIP', his.hisid);
            return;
          }
          var zip = se.genZip(src);
          var cyp = se.encodeApi2(src, zip);
          
          sql.update('Update '+ o.orgid +
            '.sys_api_his_content SET content=?, zip=? Where hisid=?', 
            [ cyp,  zip, his.hisid ], '1');
            
          console.log('  - HIS', his.hisid, per(cyp, src));
          ++hiscount;
        });
      }
    });
  });
  
  sql.commit();
} catch(e) {
  sql.rollback(); 
  throw e;
}

sys.put("apicount", apicount);
sys.put("hiscount", hiscount);
sys.put('use', Date.now() - tbegin +'ms');
sys.setRetData(0, 'ok');

function per(a, b) {
  return (a.length/b.length*100).toFixed(0)+'%';
}