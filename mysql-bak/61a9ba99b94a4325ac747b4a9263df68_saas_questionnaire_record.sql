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
-- Table structure for table `saas_questionnaire_record`
--

DROP TABLE IF EXISTS `saas_questionnaire_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saas_questionnaire_record` (
  `id` varchar(32) DEFAULT NULL COMMENT '问卷ID',
  `recordId` varchar(32) NOT NULL COMMENT '记录ID',
  `qn_name` varchar(100) DEFAULT NULL COMMENT '问卷名称',
  `updateDate` datetime DEFAULT NULL COMMENT '问卷完成时间',
  `jsondata` varchar(2000) DEFAULT NULL COMMENT 'JSON数据字符串',
  `tentId` varchar(36) DEFAULT NULL COMMENT '租户ID',
  `answer_name` varchar(100) DEFAULT NULL COMMENT '答卷人姓名',
  `taskId` varchar(36) NOT NULL COMMENT '任务ID',
  PRIMARY KEY (`recordId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='问卷记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_questionnaire_record`
--

LOCK TABLES `saas_questionnaire_record` WRITE;
/*!40000 ALTER TABLE `saas_questionnaire_record` DISABLE KEYS */;
INSERT INTO `saas_questionnaire_record` VALUES ('b2f118d18bd94424bab901fe0ac16a4b','eaefbf08841d44b8b6f26d7645815c2a',NULL,'2022-03-21 14:57:07','{\"sfcs\":1,\"dqsfsj\":\"2022年3月21日\",\"jkzk\":true,\"_id\":\"2022-YcVfQoLDnfHeif9zsds4NT\",\"id\":\"b2f118d18bd94424bab901fe0ac16a4b\",\"tentId\":\"fffffe85-4d37-1c01-ebbe-50d64b49cbf6\",\"answer_name\":\"YcVfRCKx4aAmieorMcS7FE\",\"qnName\":\"病人随访表（头颈部）\"}','fffffe85-4d37-1c01-ebbe-50d64b49cbf6','YcVfRCKx4aAmieorMcS7FE','2022-YcVfQoLDnfHeif9zsds4NT'),('b2f118d18bd94424bab901fe0ac16a4b','ef9bb398098142d9a84bbf6fda9130cd',NULL,'2022-03-21 17:11:01','{\"sfcs\":1,\"dqsfsj\":\"2022年3月21日\",\"jkzk\":true,\"_id\":\"2022-YcVfQoLDnfHeif9zsds4NT\",\"id\":\"b2f118d18bd94424bab901fe0ac16a4b\",\"tentId\":\"fffffe85-4d37-1c01-ebbe-50d64b49cbf6\",\"answer_name\":\"YcVfRCKx4aAmieorMcS7FE\",\"qnName\":\"病人随访表（头颈部）\"}','fffffe85-4d37-1c01-ebbe-50d64b49cbf6','YcVfRCKx4aAmieorMcS7FE','2022-YcVfQoLDnfHeif9zsds4NT');
/*!40000 ALTER TABLE `saas_questionnaire_record` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:25
