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
-- Table structure for table `sys_md_mm001`
--

DROP TABLE IF EXISTS `sys_md_mm001`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_md_mm001` (
  `typecd` varchar(100) NOT NULL COMMENT '类别编码',
  `parentcd` varchar(100) NOT NULL COMMENT '父类别编码',
  `typenm` varchar(150) NOT NULL COMMENT '类别名称',
  `shortkey` varchar(100) DEFAULT NULL COMMENT '快捷码',
  `standard` char(2) NOT NULL COMMENT '标准',
  `url` varchar(100) DEFAULT NULL COMMENT '操作页面',
  `datatable` varchar(100) DEFAULT NULL COMMENT '数据表',
  `version` varchar(100) DEFAULT NULL COMMENT '版本',
  `status` char(1) NOT NULL COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`typecd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='类别索引';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_md_mm001`
--

LOCK TABLES `sys_md_mm001` WRITE;
/*!40000 ALTER TABLE `sys_md_mm001` DISABLE KEYS */;
INSERT INTO `sys_md_mm001` VALUES ('DE','0','数据元','SJY','02',NULL,NULL,'v1.0','1','数据元管理','2014-11-18 12:34:12','2014-11-21 13:04:27'),('DE.SAAS','DE','平台应用自定义','ptyyzdy','02',NULL,'sys_mdm003','2022','1',NULL,'2022-03-13 20:31:18','2022-03-13 20:31:18'),('DS','0','数据集','SJJ','02',NULL,NULL,'v1.0','1',NULL,'2014-11-18 13:05:15','2014-11-18 13:05:15'),('DS.SAAS','DS','SAAS应用','SAASyy','02',NULL,NULL,'2022','1',NULL,'2022-03-13 20:31:43','2022-03-13 21:03:59'),('DS.SAAS.QNRECORD','DS.SAAS','问卷记录','wjjl','02',NULL,'sys_md_mm002','2022','1',NULL,'2022-03-14 17:59:59','2022-03-14 17:59:59'),('DS.SAAS.QUESTIONNAIRE','DS.SAAS','问卷管理','wjgl','02',NULL,'sys_md_mm002','2022','1',NULL,'2022-03-13 21:04:37','2022-03-13 21:04:37');
/*!40000 ALTER TABLE `sys_md_mm001` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:30
