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
-- Table structure for table `saas_questionnaire`
--

DROP TABLE IF EXISTS `saas_questionnaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `saas_questionnaire` (
  `id` varchar(32) NOT NULL COMMENT '问卷ID',
  `name` varchar(100) NOT NULL COMMENT '问卷名称',
  `url` varchar(100) NOT NULL COMMENT 'URl',
  `tentId` varchar(36) DEFAULT NULL COMMENT '租户ID',
  `tentName` varchar(100) DEFAULT NULL COMMENT '机构名称',
  `status` varchar(32) DEFAULT NULL COMMENT '状态',
  `createDate` datetime DEFAULT NULL COMMENT '创建时间',
  `updateDate` datetime DEFAULT NULL COMMENT '更新时间',
  `creator` varchar(100) DEFAULT NULL COMMENT '创建人',
  `updater` varchar(100) DEFAULT NULL COMMENT '修改人',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='问卷管理';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saas_questionnaire`
--

LOCK TABLES `saas_questionnaire` WRITE;
/*!40000 ALTER TABLE `saas_questionnaire` DISABLE KEYS */;
INSERT INTO `saas_questionnaire` VALUES ('4f675e3d22bc48a1a68158ddb41a7e2f','病人随访表（脑恶性肿瘤包括脑转移）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj05','fffffe85-45ce-1819-ebbe-50d64b49cbe5','奉城医院（放疗科）','1','2022-03-15 16:38:00','2022-03-15 16:38:00','liufengyuan','liufengyuan'),('5720265b6c8d469b9698e6b70b28eb78','病人随访表（胸部）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj02','fffffe85-45ce-1819-ebbe-50d64b49cbe5','奉城医院（放疗科）','1','2022-03-15 16:36:45','2022-03-15 16:36:45','liufengyuan','liufengyuan'),('a0b4a9c593584a51abea80cc6f5fbc7c','病人随访表（头颈部）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj01','fffffe85-45ce-1819-ebbe-50d64b49cbe5','奉城医院（放疗科）','1','2022-03-15 16:04:49','2022-03-15 16:26:54','liufengyuan','liufengyuan'),('b2f118d18bd94424bab901fe0ac16a4b','病人随访表（头颈部）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj01','fffffe85-4d37-1c01-ebbe-50d64b49cbf6','上海竹呗','1','2022-03-15 14:01:39','2022-03-15 15:48:44','liufengyuan','liufengyuan'),('d218c68b361b49f89c54f30af79b3e88','病人随访表（其他）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj06','fffffe85-45ce-1819-ebbe-50d64b49cbe5','奉城医院（放疗科）','1','2022-03-15 16:38:29','2022-03-15 16:38:29','liufengyuan','liufengyuan'),('ddd5405c4f2f45ffad09db0d7295be39','病人随访表（腹部）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj03','fffffe85-45ce-1819-ebbe-50d64b49cbe5','奉城医院（放疗科）','1','2022-03-15 16:37:03','2022-03-15 16:37:03','liufengyuan','liufengyuan'),('f531fd4a2d32410a878bb0bb831d9a76','病人随访表（骨转移）','https://prod.xboson.net/xboson/face/t/saas/61a9ba99b94a4325ac747b4a9263df68/eform/index.htm?p=wj04','fffffe85-45ce-1819-ebbe-50d64b49cbe5','奉城医院（放疗科）','1','2022-03-15 16:37:25','2022-03-15 16:37:25','liufengyuan','liufengyuan');
/*!40000 ALTER TABLE `saas_questionnaire` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:24
