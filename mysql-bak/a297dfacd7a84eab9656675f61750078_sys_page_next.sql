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
-- Table structure for table `sys_page_next`
--

DROP TABLE IF EXISTS `sys_page_next`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_page_next` (
  `pageid` varchar(40) NOT NULL COMMENT '页面ID',
  `next_pageid` varchar(40) NOT NULL COMMENT '关联页面ID',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`pageid`,`next_pageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='页面间关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_page_next`
--

LOCK TABLES `sys_page_next` WRITE;
/*!40000 ALTER TABLE `sys_page_next` DISABLE KEYS */;
INSERT INTO `sys_page_next` VALUES ('rbac_prj_mgt01','rbac_prj_mgt02','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt03','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt04','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt05','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt06','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt07','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt08','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt09','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt10','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt11','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt01','rbac_prj_mgt12','1','2016-09-02 16:49:41','2016-09-02 16:49:41'),('rbac_prj_mgt02','rbac_prj_mgt03','1','2016-08-25 09:05:33','2016-08-25 09:05:33'),('rbac_prj_mgt07','rbac_prj_mgt08','1','2016-08-25 10:19:03','2016-08-25 10:19:03'),('rbac_prj_mgt07','rbac_prj_mgt09','1','2016-08-25 10:19:03','2016-08-25 10:19:03'),('rbac_prj_mgt09','rbac_prj_mgt10','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt09','rbac_prj_mgt12','1','2016-08-25 09:24:42','2016-08-25 09:24:42'),('rbac_prj_mgt11','rbac_prj_mgt09','1','2016-08-25 09:50:55','2016-08-25 09:50:55'),('rbac_role_mgt01','rbac_role_mgt02','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt03','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt04','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt06','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt01','rbac_role_mgt07','1','2016-09-02 16:51:09','2016-09-02 16:51:09'),('rbac_role_mgt03','rbac_role_mgt02','1','2016-08-25 11:12:51','2016-08-25 11:12:51'),('rbac_role_mgt06','rbac_role_mgt05','1','2016-08-25 11:22:19','2016-08-25 11:22:19');
/*!40000 ALTER TABLE `sys_page_next` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:04
