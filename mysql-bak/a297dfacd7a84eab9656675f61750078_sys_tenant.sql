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
-- Table structure for table `sys_tenant`
--

DROP TABLE IF EXISTS `sys_tenant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_tenant` (
  `orgid` char(32) NOT NULL COMMENT '租户ID',
  `org_type` char(1) NOT NULL COMMENT '开发商租户标记 0开发商1租户',
  `init_db` char(1) NOT NULL,
  `presetid` char(32) DEFAULT NULL COMMENT '初始化预设ID',
  `pid` char(32) NOT NULL COMMENT '租户创建者个人编号',
  `url` varchar(200) DEFAULT NULL COMMENT 'URL地址',
  `status` char(1) NOT NULL COMMENT '字典. 0. 无效 1. 有效 2. 迁出',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`orgid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='平台租户信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_tenant`
--

LOCK TABLES `sys_tenant` WRITE;
/*!40000 ALTER TABLE `sys_tenant` DISABLE KEYS */;
INSERT INTO `sys_tenant` VALUES ('3da44270469945f19fa7192c9a6a5d44','v','1','fa3d4d8db3b449bdb96404231a17534c','1f33f752805443e59bfe5f8f77481443',NULL,'1','2021-08-23 12:07:09','2021-08-23 12:11:38'),('61a9ba99b94a4325ac747b4a9263df68','v','1','fa3d4d8db3b449bdb96404231a17534c','1f33f752805443e59bfe5f8f77481443',NULL,'1','2018-05-30 13:26:57','2018-06-06 14:36:22'),('649de03e8ef0435593b14c54cb52b0fa','v','1','fe28f1e8ebf34729bcbad51a48033047','1f33f752805443e59bfe5f8f77481443',NULL,'1','2021-10-18 17:42:35','2021-10-18 17:42:35'),('a297dfacd7a84eab9656675f61750078','v','1',NULL,'1f33f752805443e59bfe5f8f77481443',NULL,'1','2016-07-02 14:23:53','2016-07-02 14:23:53'),('afb9a9a1c80647e6a0d7e807f68e055a','v','1','c2b58bbc61e4453b930e7fd26d82aa42','1f33f752805443e59bfe5f8f77481443',NULL,'1','2016-10-24 13:36:44','2021-08-21 19:47:41'),('bc02994ec23341708e54c97f6b3f9f48','v','1',NULL,'1f33f752805443e59bfe5f8f77481443',NULL,'1','2016-07-02 14:23:53','2021-08-21 19:48:39'),('fd0ec7186f9247daac2b3183b8782081','v','1','fe28f1e8ebf34729bcbad51a48033047','eb143244ef5745f1b92669f7c4ff9769',NULL,'1','2017-01-18 14:49:34','2017-03-02 11:25:59');
/*!40000 ALTER TABLE `sys_tenant` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:31
