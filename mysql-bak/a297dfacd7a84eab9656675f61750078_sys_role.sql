-- Copyright 2023 Jing Yanming
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
USE `a297dfacd7a84eab9656675f61750078`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: a297dfacd7a84eab9656675f61750078
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sys_role`
--

DROP TABLE IF EXISTS `sys_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_role` (
  `roleid` varchar(32) NOT NULL COMMENT '角色ID',
  `rolenm` varchar(100) NOT NULL COMMENT '角色名',
  `comm_flag` char(1) DEFAULT NULL COMMENT '通用角色（废弃）',
  `op_type` char(1) DEFAULT NULL COMMENT '操作类型',
  `role_type` char(2) DEFAULT NULL COMMENT '角色类型',
  `role_desc` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `orgid` char(32) NOT NULL COMMENT '所属机构ID',
  `rg_id` char(32) DEFAULT NULL COMMENT '角色组ID',
  `status` char(1) NOT NULL COMMENT '状态对应数据字典0无效1有效2移除',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
INSERT INTO `sys_role` VALUES ('02256cd3d184477aaaf6e330bb8c71f7','跨机构用户管理',NULL,NULL,'01',NULL,'a297dfacd7a84eab9656675f61750078','f595db21192c4ed9beb8b481e2ab4993','1','2019-04-04 20:35:09','2019-04-04 20:35:09'),('0f4ab864317647e9bc9eab48ed03d94e','应用示例开发角色',NULL,'1','02','应用示例开发角色','a297dfacd7a84eab9656675f61750078',NULL,'1','2018-05-21 22:06:36','2018-05-21 22:06:36'),('13573ff15ba347ffb780b79a96b049c9','应用开发示例开发角色',NULL,'1','02','应用开发示例开发角色','fd0ec7186f9247daac2b3183b8782081',NULL,'1','2018-05-21 23:02:32','2018-05-21 23:02:32'),('1439f4b35f874c9b89d2ab1efd135bff','互联网使用者',NULL,NULL,'01','访问互联网应用, 这些应用的业务实现必须根据用户将内容分离','a297dfacd7a84eab9656675f61750078','f595db21192c4ed9beb8b481e2ab4993','1','2018-12-10 09:05:19','2018-12-10 09:05:19'),('4c52a5e45aeb424cbf0bc1adf97d50e8','集成开发角色',NULL,NULL,'01','含数据采集与交换菜单','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-05-24 17:42:50','2018-05-24 17:42:50'),('61f12d1f311c438f932687ff5b6bc289','应用示例开发角色',NULL,'1','02','应用示例开发角色','a297dfacd7a84eab9656675f61750078',NULL,'1','2018-05-21 22:05:39','2018-05-21 22:05:39'),('6c3192de078540c18538252b5795cce1','数据分析角色',NULL,NULL,'01','数据分析开发角色','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-05-24 18:28:07','2018-05-24 18:28:39'),('7ce9762ae913456298d6828d6a388d09','平台运营管理',NULL,NULL,'01','创建机构或应用角色','a297dfacd7a84eab9656675f61750078','de2a41239faf46079022657f50649e68','1','2018-07-03 18:07:36','2018-07-03 18:07:36'),('8649f77a563548828dca642feaa7dff1','数据交换开发角色',NULL,'1','02','数据交换开发角色','a297dfacd7a84eab9656675f61750078',NULL,'1','2018-06-08 10:04:55','2018-06-08 10:04:55'),('900cfc6b13fa4b09a41be31b411a1bdb','开发管理角色',NULL,NULL,'01','项目经理及负责人','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-05-24 18:04:34','2018-05-24 18:04:34'),('a0f9f62d3f6c47289615103b31dca3d5','用户',NULL,'0','01','RBAC：所有用户通用的基本权限角色','a297dfacd7a84eab9656675f61750078','f595db21192c4ed9beb8b481e2ab4993','1','2016-08-25 08:09:21','2018-05-24 18:01:18'),('a8abfb2ecb084d7784f125b7d0a2ccb5','演示应用角色',NULL,NULL,'01','演示应用使用','a297dfacd7a84eab9656675f61750078',NULL,'1','2016-11-29 14:14:06','2016-11-29 14:14:06'),('aac12bc29883461c801008398c570c81','管理员角色',NULL,NULL,'01','RBAC','a297dfacd7a84eab9656675f61750078','de2a41239faf46079022657f50649e68','1','2016-08-24 07:59:59','2016-09-22 15:18:41'),('aeac3d92a3b94c02aea482ce12fa78db','信息标准管理角色',NULL,NULL,'01','主数据、元数据（数据元、数据集）、多维业务模型','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-05-24 17:45:40','2018-05-24 17:45:40'),('b0b46fc9d8aa475ebce6723ac71e37f2','数据源配置者',NULL,NULL,'01',NULL,'a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-12-14 15:38:12','2018-12-14 15:38:12'),('bbf9908b0cbc4df8bea7c12855a3217e','开发者',NULL,NULL,'01','RBAC：应用开发人员角色','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2016-08-24 07:54:34','2018-05-24 18:05:14'),('beb0c24fa27649bb920171eb55036c53','管理角色',NULL,NULL,'01','RBAC','a297dfacd7a84eab9656675f61750078','de2a41239faf46079022657f50649e68','1','2016-08-24 07:59:45','2016-09-22 15:18:30'),('c5f6b53a47ce4705b03d9a0903447e25','平台运维角色',NULL,NULL,'01','平台基本运行维护','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-05-24 17:55:29','2018-05-24 17:55:29'),('c8cac943a1214f67976463d3b5633afb','基础项目',NULL,'0','02','平台基础项目','a297dfacd7a84eab9656675f61750078',NULL,'1','2016-02-07 09:13:45','2016-02-07 09:13:45'),('d23a15ad0f404708b32b5a1930a8b196','数据交换服务',NULL,NULL,'01','数据接口服务开发及数据上传服务（医疗）','a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2018-06-28 17:13:41','2018-06-28 17:13:41'),('e2c73809e2b0429fb78e46177f3e6c51','平台提供 API 列表',NULL,'0','02','平台向各机构提供的可调用的 API 列表','a297dfacd7a84eab9656675f61750078',NULL,'1','2016-02-07 09:13:45','2016-02-07 09:13:45'),('e86f6eb53bd34a4f9e49b0ab83a016d2','匿名用户',NULL,NULL,'01','匿名用户无需登录即可访问','a297dfacd7a84eab9656675f61750078','f595db21192c4ed9beb8b481e2ab4993','1','2018-08-19 13:40:55','2018-08-19 13:40:55'),('ea873dded23446f9b32e3c1e3a55e4a0','知识图谱',NULL,NULL,'01',NULL,'a297dfacd7a84eab9656675f61750078','d90bc6630dd94510869e49f4976d9df5','1','2021-11-06 11:51:32','2021-11-06 11:52:04'),('efd7a6602af44a55a41f05f1cc518e50','测试用例开发角色',NULL,'1','02','测试用例开发角色','a297dfacd7a84eab9656675f61750078',NULL,'1','2017-11-16 15:36:46','2017-11-16 15:36:46');
/*!40000 ALTER TABLE `sys_role` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:25
