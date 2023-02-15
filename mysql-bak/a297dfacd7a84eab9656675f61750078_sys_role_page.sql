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
-- Table structure for table `sys_role_page`
--

DROP TABLE IF EXISTS `sys_role_page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_role_page` (
  `roleid` char(32) NOT NULL COMMENT '角色ID',
  `pageid` varchar(40) NOT NULL COMMENT '页面ID',
  `status` char(1) NOT NULL COMMENT '状态',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`roleid`,`pageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色页面映射';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_role_page`
--

LOCK TABLES `sys_role_page` WRITE;
/*!40000 ALTER TABLE `sys_role_page` DISABLE KEYS */;
INSERT INTO `sys_role_page` VALUES ('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt01','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt02','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt03','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt04','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt05','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt06','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt07','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt08','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt09','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt10','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt11','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('900cfc6b13fa4b09a41be31b411a1bdb','rbac_prj_mgt12','1','2018-05-24 18:37:18','2018-05-24 18:37:18'),('a8abfb2ecb084d7784f125b7d0a2ccb5','bi_chart_config','1','2018-12-11 14:09:37','2018-12-11 14:09:37'),('a8abfb2ecb084d7784f125b7d0a2ccb5','bi_chart_view_config','1','2018-12-11 14:09:37','2018-12-11 14:09:37'),('a8abfb2ecb084d7784f125b7d0a2ccb5','bm_bms_cz','1','2018-12-11 14:09:37','2018-12-11 14:09:37'),('a8abfb2ecb084d7784f125b7d0a2ccb5','bm_bms_dw','1','2018-12-11 14:09:37','2018-12-11 14:09:37'),('a8abfb2ecb084d7784f125b7d0a2ccb5','mdms_datadictD_index','1','2018-12-11 14:09:37','2018-12-11 14:09:37'),('a8abfb2ecb084d7784f125b7d0a2ccb5','md_mmd_index','1','2018-12-11 14:09:37','2018-12-11 14:09:37'),('aac12bc29883461c801008398c570c81','bi_chart_config','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','bi_chart_view_config','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','bm_bms_cz','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','bm_bms_dw','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','mdms_datadictD_index','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','md_mmd_index','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_auth_mgt01','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_auth_mgt02','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt01','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt02','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt03','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt04','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt05','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt06','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt07','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt08','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt09','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt10','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt11','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_prj_mgt12','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt01','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt02','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt03','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt04','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt05','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt06','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aac12bc29883461c801008398c570c81','rbac_role_mgt07','1','2018-12-13 12:15:22','2018-12-13 12:15:22'),('aeac3d92a3b94c02aea482ce12fa78db','bm_bms_dw','1','2018-05-24 17:46:22','2018-05-24 17:46:22'),('aeac3d92a3b94c02aea482ce12fa78db','mdms_datadictD_index','1','2018-05-24 17:46:22','2018-05-24 17:46:22'),('aeac3d92a3b94c02aea482ce12fa78db','md_mmd_index','1','2018-05-24 17:46:22','2018-05-24 17:46:22'),('bbf9908b0cbc4df8bea7c12855a3217e','bm_bms_cz','1','2021-07-15 11:25:12','2021-07-15 11:25:12'),('beb0c24fa27649bb920171eb55036c53','rbac_auth_mgt01','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_auth_mgt02','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt01','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt02','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt03','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt04','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt05','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt06','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('beb0c24fa27649bb920171eb55036c53','rbac_role_mgt07','1','2018-05-24 18:18:02','2018-05-24 18:18:02'),('c8cac943a1214f67976463d3b5633afb','bi_chart_config','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','bi_chart_view_config','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','bm_bms_cz','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','bm_bms_dw','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','mdms_datadictD_index','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','md_gen_index','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','md_mmd_index','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_auth_mgt01','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_auth_mgt02','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt01','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt02','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt03','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt04','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt05','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt06','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt07','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt08','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt09','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt10','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt11','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_prj_mgt12','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt01','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt02','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt03','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt04','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt05','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt06','1','2017-03-02 11:15:14','2017-03-02 11:15:14'),('c8cac943a1214f67976463d3b5633afb','rbac_role_mgt07','1','2017-03-02 11:15:14','2017-03-02 11:15:14');
/*!40000 ALTER TABLE `sys_role_page` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:35:28
