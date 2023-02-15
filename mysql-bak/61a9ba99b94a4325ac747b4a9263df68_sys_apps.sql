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
-- Table structure for table `sys_apps`
--

DROP TABLE IF EXISTS `sys_apps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_apps` (
  `appid` varchar(32) NOT NULL COMMENT '应用ID',
  `appnm` varchar(50) NOT NULL COMMENT '应用名称',
  `about` varchar(255) DEFAULT NULL COMMENT '关于应用信息',
  `appflag` char(1) DEFAULT NULL COMMENT '平台应用第三方应用标记',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`appid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='APP信息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_apps`
--

LOCK TABLES `sys_apps` WRITE;
/*!40000 ALTER TABLE `sys_apps` DISABLE KEYS */;
INSERT INTO `sys_apps` VALUES ('0cc27966e1a84a17b38ac6a60af62ae3','健康档案数据服务',NULL,'0','1','2018-07-03 14:28:02','2018-07-03 15:47:24'),('19b8f5d7d71a4b22b893fda85ee22431','买方',NULL,'0','1','2018-05-30 15:26:20','2018-07-03 14:30:33'),('25930e7d8c0c47719cccca8fd1f3d6d5','健康干预','健康干预（咨询、康复）','0','1','2021-06-27 21:44:19','2021-06-27 21:44:19'),('5da44257329a48b0a4e5f4a5c5855d48','公共服务','通用API、微信认证服务等','0','1','2021-07-18 16:24:48','2021-07-18 16:24:48'),('65368a9f968a4f77a0131adc73bd563a','电子病历数据服务',NULL,'0','1','2018-07-03 13:43:37','2018-07-03 14:28:10'),('7654838a4aae4f2bb2044be671290484','客户关系','客户管理、会员管理、客户挖掘、行为分析等','0','1','2021-06-27 21:46:22','2021-06-27 22:19:01'),('78cf8922c5ea4afa9dae8970215ea796','运营管理','SaaS应用服务管理','0','1','2021-06-27 21:46:48','2021-07-11 17:07:07'),('9a855114115a4d4d80e6dce56a2d4875','内核',NULL,'0','1','2018-05-30 15:27:01','2018-05-30 15:27:01'),('ad46646a8d424128ba3b2d6c353c8e99','健康筛查','健康（随访）筛查（健康评估：心理、体质、肿瘤、慢病、中医）','0','1','2021-06-27 21:45:01','2021-06-27 21:45:01'),('bcf60fb77dcb4a85acbf83d202ec58c0','区块链','区块链代码展示','0','1','2018-12-12 11:01:05','2018-12-12 11:01:05'),('cd71e14e92874fe1b766c675d90d5cf4','代码演示',NULL,'0','1','2018-12-08 10:33:24','2018-12-12 11:08:49'),('df0c6ef111f846a3ac90c9e6bcfd8b28','卖方',NULL,'0','1','2018-05-30 15:26:27','2018-05-30 15:26:27'),('f1b4adf82ee54a1c8e18d31349988a4b','任务安排','任务助手（日程管理）','0','1','2021-06-27 21:43:28','2021-07-25 18:43:02');
/*!40000 ALTER TABLE `sys_apps` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:27
