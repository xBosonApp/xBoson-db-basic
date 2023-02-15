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
USE `61a9ba99b94a4325ac747b4a9263df68`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: 61a9ba99b94a4325ac747b4a9263df68
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
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `rolenm` varchar(100) DEFAULT NULL COMMENT '角色名称',
  `comm_flag` char(1) DEFAULT NULL COMMENT '通用角色（废弃）',
  `op_type` char(1) DEFAULT NULL COMMENT '操作类型',
  `role_type` char(2) DEFAULT NULL COMMENT '角色类型',
  `role_desc` varchar(200) DEFAULT NULL COMMENT '角色描述',
  `orgid` char(32) NOT NULL COMMENT '所属机构ID',
  `rg_id` char(32) DEFAULT NULL COMMENT '角色组ID',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`roleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role`
--

LOCK TABLES `sys_role` WRITE;
/*!40000 ALTER TABLE `sys_role` DISABLE KEYS */;
INSERT INTO `sys_role` VALUES ('01b017e00d474953ab665b40b8e51119','SaaS任务安排',NULL,NULL,'01',NULL,'61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-09 10:49:09','2021-08-04 19:12:27'),('35c93d8d00c04b058eb2333546ec00fd','SaaS健康干预',NULL,NULL,'01',NULL,'61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-09 10:49:56','2021-07-09 10:49:56'),('3aca3050d92f4bd5ac0b403bc0caff91','SaaS筛查问卷',NULL,NULL,'01',NULL,'61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-09 10:49:36','2021-07-09 10:49:36'),('521b5f0c171143eca30fafa9e6e23bb2','SaaS云应用开发角色',NULL,'1','02','SaaS云应用开发角色','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-06-27 21:42:21','2021-06-27 21:42:21'),('569c28bd5e8a4d66aa9d99c9e9f80735','SaaS运营管理',NULL,NULL,'01','字典术语管理、租户管理、订单管理、云产品管理、运营日志','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-09 10:33:36','2021-07-09 10:48:38'),('87163623b4a542c99f6b0d53a3c4dd0e','数据服务开发角色',NULL,'1','02','数据服务开发角色','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2018-07-03 13:42:40','2018-07-03 13:42:40'),('90a3e113352645a28d9c85de0a6341fb','SaaS客户关系',NULL,NULL,'01',NULL,'61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-09 10:38:32','2021-07-09 10:48:46'),('a936051b03f943f7be1b1c13e0d57a4e','大数据商城开发角色',NULL,'1','02','大数据商城开发角色','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2018-05-30 15:25:25','2018-05-30 15:25:25'),('ab6460feb0c44269b780aee66dffc7da','管理员角色',NULL,'0','01','','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2018-05-30 14:56:25','2018-05-30 14:56:25'),('b3d5d543ef2141f4bfd99e9b032d5733','SaaS租户管理员',NULL,NULL,'01','租户管理员角色，添加成员，查看租户客户信息及日历、电子表单管理等','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-16 14:35:49','2021-07-16 14:36:07'),('c1293ed0597848c6ac6f39dbd301e577','示例项目开发角色',NULL,'1','02','示例项目开发角色','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2018-12-08 10:33:12','2018-12-08 10:33:12'),('c1a484f76de440fd90567c243307a205','SaaS总管',NULL,NULL,'01','全部权限','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-09 10:51:56','2021-07-09 10:51:56'),('d7d2f8b494b148148a89bdb761bec7fe','SaaS公众匿名服务',NULL,NULL,'01','针对小程序提供匿名访问权限','61a9ba99b94a4325ac747b4a9263df68',NULL,'1','2021-07-19 15:29:28','2021-07-19 15:29:28');
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

-- Dump completed on 2023-02-15 15:34:38
