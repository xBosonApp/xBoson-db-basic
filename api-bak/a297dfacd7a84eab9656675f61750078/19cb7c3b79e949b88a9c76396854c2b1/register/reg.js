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

module.exports = {
  hasClibAuth : hasClibAuth,
  hasClibModifyAuth : hasClibModifyAuth,
};


// 注册表读取权限
function hasClibAuth(regCollection, componentLibraryID, projectID) {
  var c = regCollection.count({
    _id  : componentLibraryID,
    type : 'component-library',
    $or  : [{
      prjid : projectID,  
    }, {
      isGlobal : true,  
    }],
  });
  return c > 0;
}


// 注册表修改权限
function hasClibModifyAuth(regCollection, componentLibraryID, projectID) {
  var c = regCollection.count({
    _id   : componentLibraryID,
    type  : 'component-library',
    prjid : projectID,
  });
  return c > 0;
}