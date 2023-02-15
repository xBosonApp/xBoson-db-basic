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
var uri=se.getCache(_CACHE_REGION_TP_APP_,"dfe437babe4c44e08bf2634aeff97cc9").uri;
if(uri==null||sys.trim(uri)==""){
  sys.setRetData("2","服务URI为空！");
  return;
}
sys.addRetData(uri,"uri");
sys.setRetData("0","","uri");