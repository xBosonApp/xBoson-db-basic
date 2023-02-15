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
-- Table structure for table `sys_bm004`
--

DROP TABLE IF EXISTS `sys_bm004`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_bm004` (
  `typecd` varchar(100) NOT NULL COMMENT '类别编码',
  `typecd_parent` varchar(100) NOT NULL COMMENT '父视图模型类别编码',
  `table_json` varchar(2000) DEFAULT NULL COMMENT '创建的物理表定义JSON',
  `row_json` longtext COMMENT '行定义JSON',
  `column_json` longtext COMMENT '列定义JSON',
  `where_json` longtext COMMENT '追加的where条件JSON',
  `status` char(1) NOT NULL COMMENT '状态',
  `mark` varchar(600) DEFAULT NULL COMMENT '说明',
  `createdt` datetime NOT NULL COMMENT '创建时间',
  `updatedt` datetime NOT NULL COMMENT '更新时间',
  `fileid` char(32) DEFAULT NULL COMMENT '文件ID',
  `typecontent` longtext COMMENT '返回type和search结构内容',
  `tablesource` varchar(100) DEFAULT NULL COMMENT '数据来源表',
  PRIMARY KEY (`typecd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='维度定义画面';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_bm004`
--

LOCK TABLES `sys_bm004` WRITE;
/*!40000 ALTER TABLE `sys_bm004` DISABLE KEYS */;
INSERT INTO `sys_bm004` VALUES ('t8_1','t8',NULL,'[{\"name\":\"层级\",\"where_group\":\"2\",\"group\":{\"column_name\":\"levels\",\"groupby_area\":\"group by levels\"},\"where\":{\"where_radio\":\"1\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}}]','[{\"name\":\"菜单数\",\"func\":\"02\",\"column_name\":\"menuid\",\"column_content\":\"COUNT(menuid) AS 菜单数\",\"where_radio\":\"1\",\"where_auto\":[{\"column_name\":\"menuid\",\"condition\":\"03\",\"value\":\"2\",\"andor\":\"AND\"},{\"column_name\":\"levels\",\"condition\":\"05\",\"value\":\"15\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\" menuid <> \'2\' AND levels < 15\"},{\"name\":\"最大层级\",\"func\":\"03\",\"column_name\":\"levels\",\"column_content\":\"MAX(levels) AS 最大层级\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"03\",\"value\":\"1\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"15\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}]','{\"add_where_content\":\"menuid <> \'1\' AND menuid IS NOT NULL AND levels < {levels} \",\"add_where_params\":[{\"column_name\":\"menuid\",\"cn_name\":\"菜单ID\",\"condition\":\"03\",\"flag\":\"0\",\"value\":[\"1\"],\"andor\":\"AND\"},{\"column_name\":\"menuid\",\"cn_name\":\"菜单ID\",\"condition\":\"15\",\"flag\":\"\",\"value\":[],\"andor\":\"AND\"},{\"column_name\":\"levels\",\"cn_name\":\"菜单层级\",\"condition\":\"05\",\"flag\":\"1\",\"value\":[],\"andor\":\"and\"}]}','1',NULL,'2015-04-09 10:12:25','2015-04-23 16:39:37',NULL,'{\"type\":[{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"第一列\",\"numrange\":\"\",\"chart\":\"\",\"en\":\"first_column\",\"datatype\":\"\",\"view\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"菜单数\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"菜单数\",\"datatype\":\"\",\"view\":\"1\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"最大层级\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"最大层级\",\"datatype\":\"\",\"view\":\"1\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"search\":[{\"unit\":\"\",\"dict\":\"\",\"cn\":\"菜单ID\",\"numrange\":\"\",\"en\":\"menuid\",\"datatype\":\"\",\"format\":\"\",\"elemtype\":\"text\"},{\"unit\":\"\",\"dict\":\"\",\"cn\":\"菜单ID\",\"numrange\":\"\",\"en\":\"menuid\",\"datatype\":\"\",\"format\":\"\",\"elemtype\":\"text\"},{\"unit\":\"\",\"dict\":\"\",\"cn\":\"菜单层级\",\"numrange\":\"\",\"en\":\"levels\",\"datatype\":\"\",\"format\":\"\",\"elemtype\":\"text\"}]}',NULL),('t8_2','t8',NULL,'[{\"name\":\"d\",\"where_group\":\"1\",\"group\":{\"column_name\":\"\",\"groupby_area\":\"\"},\"where\":{\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"menuid\",\"condition\":\"02\",\"value\":\"1\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\" menuid != \'1\' \"}}]','[{\"name\":\"d\",\"func\":\"02\",\"column_name\":\"menuid\",\"column_content\":\"COUNT(menuid) AS d\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}]','{\"add_where_content\":\"menuid BETWEEN \'1\' and \'1\' \",\"add_where_params\":[{\"column_name\":\"menuid\",\"cn_name\":\"菜单ID\",\"condition\":\"12\",\"flag\":\"0\",\"value\":[\"1\",\"1\"],\"andor\":\"AND\"}]}','1',NULL,'2015-04-20 13:48:11','2015-07-31 14:47:29',NULL,'{\"type\":[{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"第一列\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"\",\"en\":\"first_column\",\"view\":\"\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"d\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"line,bar,column,pie,stagebar,stagecolumn\",\"en\":\"d\",\"view\":\"1\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"search\":[{\"unit\":\"\",\"dict\":\"\",\"cn\":\"菜单ID\",\"numrange\":\"\",\"en\":\"menuid\",\"format\":\"\",\"datatype\":\"\",\"elemtype\":\"text\"}]}',NULL),('t9_1','t9',NULL,'[{\"name\":\"日期\",\"where_group\":\"2\",\"group\":{\"column_name\":\"createdt\",\"groupby_area\":\"group by createdt\"},\"where\":{\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}}]','[{\"name\":\"数量\",\"func\":\"02\",\"column_name\":\"typecd\",\"column_content\":\"COUNT(typecd) AS 数量\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"},{\"name\":\"状态\",\"func\":\"05\",\"column_name\":\"status\",\"column_content\":\"SUM(status) AS 状态\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}]','{\"add_where_content\":\"createdt = {createdt} \",\"add_where_params\":[{\"column_name\":\"createdt\",\"cn_name\":\"createdt\",\"condition\":\"01\",\"flag\":\"1\",\"value\":[],\"andor\":\"AND\"}]}','1',NULL,'2015-04-15 09:39:54','2015-04-16 13:55:07',NULL,'{\"type\":[{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"第一列\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"\",\"en\":\"first_column\",\"view\":\"\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"数量\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"数量\",\"view\":\"1\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"状态\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"状态\",\"view\":\"1\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"search\":[{\"unit\":\"\",\"dict\":\"\",\"cn\":\"createdt\",\"numrange\":\"\",\"en\":\"createdt\",\"format\":\"\",\"datatype\":\"\",\"elemtype\":\"text\"}]}',NULL),('t9_2','t9',NULL,'[{\"name\":\"a1\",\"where_group\":\"1\",\"group\":{\"column_name\":\"\"},\"where\":{\"where_radio\":\"1\",\"where_auto\":[{\"column_name\":\"createdt\",\"condition\":\"08\",\"value\":\"2015-01\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\" createdt LIKE \'%2015-01%\' \"}},{\"name\":\"a2\",\"where_group\":\"1\",\"group\":{\"column_name\":\"\"},\"where\":{\"where_radio\":\"1\",\"where_auto\":[{\"column_name\":\"createdt\",\"condition\":\"08\",\"value\":\"2015-02\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\" createdt LIKE \'%2015-02%\' \"}},{\"name\":\"a3\",\"where_group\":\"1\",\"group\":{\"column_name\":\"\"},\"where\":{\"where_radio\":\"1\",\"where_auto\":[{\"column_name\":\"createdt\",\"condition\":\"08\",\"value\":\"2015-03\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\" createdt LIKE \'%2015-03%\' \"}}]','[{\"name\":\"数量\",\"func\":\"02\",\"column_name\":\"typecd\",\"column_content\":\"COUNT(typecd) AS 数量\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}]','{\"add_where_content\":\"\",\"add_where_params\":[]}','1',NULL,'2015-04-15 10:37:10','2015-04-15 10:37:14',NULL,'{\"type\":[{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"第一列\",\"numrange\":\"\",\"chart\":\"\",\"en\":\"first_column\",\"datatype\":\"\",\"view\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"数量\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"数量\",\"datatype\":\"\",\"view\":\"1\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"search\":[]}',NULL),('t9_3','t9',NULL,'[{\"name\":\"日期\",\"where_group\":\"2\",\"group\":{\"column_name\":\"createdt\",\"groupby_area\":\"group by date_format(createdt,\'%Y-%m-%d\')\"},\"where\":{\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}}]','[{\"name\":\"数量\",\"func\":\"02\",\"column_name\":\"typecd\",\"column_content\":\"COUNT(typecd) AS 数量\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}]','{\"add_where_content\":\"\",\"add_where_params\":[]}','1',NULL,'2015-04-15 12:42:48','2015-04-15 12:42:48',NULL,'{\"type\":[{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"第一列\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"\",\"en\":\"first_column\",\"view\":\"\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"ro\":\"\",\"dict\":\"\",\"cn\":\"数量\",\"search\":\"\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"数量\",\"view\":\"1\",\"datatype\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"search\":[]}',NULL),('t9_4','t9',NULL,'[{\"name\":\"日期\",\"where_group\":\"2\",\"group\":{\"column_name\":\"createdt\",\"groupby_area\":\"group by date_format(createdt,\'%Y\')\"},\"where\":{\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}}]','[{\"name\":\"数量\",\"func\":\"02\",\"column_name\":\"typecd\",\"column_content\":\"COUNT(typecd) AS 数量\",\"where_radio\":\"0\",\"where_auto\":[{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\",\"andor\":\"AND\"},{\"column_name\":\"\",\"condition\":\"\",\"value\":\"\"}],\"where_area\":\"\"}]','{\"add_where_content\":\"\",\"add_where_params\":[]}','1',NULL,'2015-04-15 16:41:54','2015-04-15 16:41:54',NULL,'{\"type\":[{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"第一列\",\"numrange\":\"\",\"chart\":\"\",\"en\":\"first_column\",\"datatype\":\"\",\"view\":\"\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"},{\"unit\":\"\",\"dict\":\"\",\"ro\":\"\",\"search\":\"\",\"cn\":\"数量\",\"numrange\":\"\",\"chart\":\"line,bar,column\",\"en\":\"数量\",\"datatype\":\"\",\"view\":\"1\",\"format\":\"\",\"must\":\"\",\"elemtype\":\"\"}],\"search\":[]}',NULL);
/*!40000 ALTER TABLE `sys_bm004` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15 15:34:52
