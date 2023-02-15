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
//ugs 开发项目组列表，select2使用
sql.query("select ugid id, ugnm name from sys_ug,(select sys_role_ug.ugid roleugid from sys_role_ug,sys_role where sys_role_ug.roleid=sys_role.roleid and sys_role.role_type='02' and sys_role.status='1' and sys_role_ug.status='1') roleug where sys_ug.ugid=roleug.roleugid and sys_ug.status='1'",null);
sys.setRetData("0","","result");