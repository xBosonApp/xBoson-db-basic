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
-- Table structure for table `sys_pl_biz_application`
--

DROP TABLE IF EXISTS `sys_pl_biz_application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_pl_biz_application` (
  `applicationid` char(32) NOT NULL COMMENT '应用ID',
  `biz_status` char(2) NOT NULL COMMENT '应用运营状态 00已提交 10审核中 11审核未通过 12审核通过 20上线 21下线',
  `mark` varchar(600) DEFAULT NULL COMMENT '备注',
  `status` char(1) NOT NULL COMMENT '状态 0无效1有效',
  `createdt` datetime DEFAULT NULL COMMENT '创建时间',
  `updatedt` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`applicationid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='APP（已发布）运营管理表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_pl_biz_application`
--

LOCK TABLES `sys_pl_biz_application` WRITE;
/*!40000 ALTER TABLE `sys_pl_biz_application` DISABLE KEYS */;
INSERT INTO `sys_pl_biz_application` VALUES ('26afd358b6144309bec99b2628ae26c7','20','初始提交','1','2018-06-28 15:48:17','2018-06-28 17:41:51'),('4d00f20b10ac419184010674174032ef','20','初始提交','1','2019-04-04 20:43:32','2019-04-04 20:44:15'),('516470de79b44b3ba57911c30956efa6','20','初始提交','1','2018-06-28 15:58:38','2018-06-28 17:41:57'),('6ffea177f3944bf1ab8fabf7707780f8','20','初始提交','1','2021-11-06 11:54:53','2021-11-06 11:55:07'),('70d6b73e9fd74b1293127f2c126eef18','20','初始提交','1','2018-06-28 15:46:50','2018-06-28 17:42:03'),('b630b6d72d7c42aab1325ebb15f378d5','20','初始提交','1','2018-06-28 15:44:52','2018-06-28 17:42:08'),('b68b40afaa354f6d8044c891f61cafd9','20','初始提交','1','2018-06-28 15:59:17','2018-06-28 17:42:17'),('bbd8c3863a754994b4fe29407d4d218a','20','初始提交','1','2018-06-28 17:41:01','2018-06-28 17:42:23'),('c9a7bc44ff794ce791a1e45dfc51cd1e','20','初始提交','1','2018-06-28 15:56:49','2018-06-28 17:42:29'),('d286b8a9e58344f7ba1faa060aeb579a','20','初始提交','1','2018-05-24 18:44:03','2018-05-24 18:45:46'),('d8fe5c4eac8043058c9417feb496b453','20','初始提交','1','2016-09-19 09:50:59','2016-09-19 10:59:18'),('f98f0bdf736b4c339c14d0d3a4e39c6a','20','初始提交','1','2018-06-28 15:57:26','2018-06-28 17:42:35'),('f9ec8b2b45d24971abede79886e9235f','20','初始提交','1','2016-11-29 14:42:56','2016-11-29 14:43:20');
/*!40000 ALTER TABLE `sys_pl_biz_application` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:06
