/*
 Navicat MySQL Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost
 Source Database       : TMData_app

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : utf-8

 Date: 05/13/2019 18:29:08 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `CUBs`
-- ----------------------------
DROP TABLE IF EXISTS `CUBs`;
CREATE TABLE `CUBs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `node_id` varchar(7) DEFAULT NULL,
  `unit_name` varchar(255) NOT NULL,
  `unit_number` int(11) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `last_calibrated` timestamp NULL DEFAULT NULL,
  `runtime` float(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_name` (`unit_name`) USING BTREE,
  UNIQUE KEY `unit_number` (`unit_number`) USING BTREE,
  KEY `node_id` (`node_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `CUBs`
-- ----------------------------
BEGIN;
INSERT INTO `CUBs` VALUES ('7', null, 'CÜB One', null, '2019-03-03 11:50:40', null, null, null), ('8', null, 'CÜB Two', null, '2019-03-03 11:50:54', null, null, null), ('9', null, 'CÜB Three', null, '2019-03-03 11:51:04', null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `Canaries`
-- ----------------------------
DROP TABLE IF EXISTS `Canaries`;
CREATE TABLE `Canaries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `node_id` varchar(7) NOT NULL,
  `unit_name` varchar(255) NOT NULL,
  `unit_number` int(11) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_calibrated` timestamp NULL DEFAULT NULL,
  `run_time` float(8,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_name` (`unit_name`) USING BTREE,
  UNIQUE KEY `unit_number` (`unit_number`) USING BTREE,
  KEY `node_id` (`node_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `Canaries`
-- ----------------------------
BEGIN;
INSERT INTO `Canaries` VALUES ('6', 'C8E9F7A', 'Alexander Bain', '28', '2018-10-13 08:24:44', '2019-04-29 12:57:47', null, '3.24'), ('13', 'C8E9FEE', 'Kamerlingh Onnes', '52', '2018-11-02 05:15:58', '2019-04-29 12:57:47', '2019-04-22 03:37:27', '3.24'), ('22', 'C8E9EB0', 'Robert Noyce', '60', '2019-03-01 17:08:53', '2019-04-29 12:57:47', '2019-03-01 09:24:58', '0.13'), ('24', 'C8EA926', 'Hans Christian Oersted', '61', '2019-03-01 17:09:18', '2019-05-01 06:03:50', '2019-03-01 09:27:26', '14.89'), ('25', 'C8EA96B', 'Henry Moseley', '58', '2019-03-01 17:09:31', '2019-04-29 12:57:47', '2019-03-01 09:29:26', '3.24'), ('26', 'C8E9FC5', 'Rasmus Lerdorf', '55', '2019-03-01 17:09:47', '2019-04-29 12:57:47', '2019-03-01 09:20:10', '3.24'), ('27', 'C8E9EC2', 'Claude Bernard', '30', '2019-03-01 17:10:11', '2019-05-01 06:03:50', '2019-03-21 03:57:25', '13.78'), ('28', 'C8E9F92', 'Douglas Engelbart ', '40', '2019-03-01 17:17:14', '2019-05-01 06:03:50', '2019-04-22 01:39:15', '14.89'), ('29', 'C8E9EA2', 'Aage Bohr', '26', '2019-03-21 15:52:50', '2019-05-01 06:03:50', '2019-03-29 03:25:18', '13.68'), ('30', 'C8E9F96', 'William Schockley', '63', '2019-03-21 16:01:51', '2019-04-29 12:57:47', '2019-03-21 04:04:06', '3.24'), ('31', 'C8E9EB2', 'Rene Descartes', '38', '2019-03-21 16:07:33', '2019-04-29 12:57:47', '2019-03-21 04:09:59', '3.24'), ('32', 'C8E9FB2', 'Mark Dean', '35', '2019-03-21 16:11:13', '2019-04-23 16:44:31', '2019-03-21 04:13:23', '0.00'), ('33', 'C8E9FDD', 'John Warcup Cornforth', '33', '2019-03-21 16:14:00', '2019-04-29 12:57:47', null, '3.24'), ('34', 'C8E9FD5', 'Jack Kilby', '53', '2019-03-21 16:14:58', '2019-04-29 12:57:47', null, '3.24'), ('35', 'C8E9FB9', 'Herman Hollerith', '49', '2019-04-23 16:47:29', '2019-04-29 12:57:47', null, '3.24'), ('36', 'C8E9F7E', 'Federico Musto', '59', '2019-04-23 16:47:49', '2019-04-29 12:57:47', null, '3.24'), ('37', 'C8E9FD6', 'Martin Cooper', '34', '2019-04-23 16:48:22', '2019-04-29 12:57:47', null, '3.24');
COMMIT;

-- ----------------------------
--  Table structure for `_carbon_standards`
-- ----------------------------
DROP TABLE IF EXISTS `_carbon_standards`;
CREATE TABLE `_carbon_standards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `factor` varchar(50) DEFAULT NULL,
  `standard_value` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_chemicals`
-- ----------------------------
DROP TABLE IF EXISTS `_chemicals`;
CREATE TABLE `_chemicals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chemical` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_contacts`
-- ----------------------------
DROP TABLE IF EXISTS `_contacts`;
CREATE TABLE `_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `legacy_id` int(10) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `notes` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_countries`
-- ----------------------------
DROP TABLE IF EXISTS `_countries`;
CREATE TABLE `_countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iso` char(2) NOT NULL,
  `country` varchar(80) NOT NULL,
  `nicename` varchar(80) NOT NULL,
  `iso3` char(3) DEFAULT NULL,
  `numcode` smallint(6) DEFAULT NULL,
  `phonecode` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=240 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Records of `_countries`
-- ----------------------------
BEGIN;
INSERT INTO `_countries` VALUES ('1', 'AF', 'AFGHANISTAN', 'Afghanistan', 'AFG', '4', '93'), ('2', 'AL', 'ALBANIA', 'Albania', 'ALB', '8', '355'), ('3', 'DZ', 'ALGERIA', 'Algeria', 'DZA', '12', '213'), ('4', 'AS', 'AMERICAN SAMOA', 'American Samoa', 'ASM', '16', '1684'), ('5', 'AD', 'ANDORRA', 'Andorra', 'AND', '20', '376'), ('6', 'AO', 'ANGOLA', 'Angola', 'AGO', '24', '244'), ('7', 'AI', 'ANGUILLA', 'Anguilla', 'AIA', '660', '1264'), ('8', 'AQ', 'ANTARCTICA', 'Antarctica', null, null, '0'), ('9', 'AG', 'ANTIGUA AND BARBUDA', 'Antigua and Barbuda', 'ATG', '28', '1268'), ('10', 'AR', 'ARGENTINA', 'Argentina', 'ARG', '32', '54'), ('11', 'AM', 'ARMENIA', 'Armenia', 'ARM', '51', '374'), ('12', 'AW', 'ARUBA', 'Aruba', 'ABW', '533', '297'), ('13', 'AU', 'AUSTRALIA', 'Australia', 'AUS', '36', '61'), ('14', 'AT', 'AUSTRIA', 'Austria', 'AUT', '40', '43'), ('15', 'AZ', 'AZERBAIJAN', 'Azerbaijan', 'AZE', '31', '994'), ('16', 'BS', 'BAHAMAS', 'Bahamas', 'BHS', '44', '1242'), ('17', 'BH', 'BAHRAIN', 'Bahrain', 'BHR', '48', '973'), ('18', 'BD', 'BANGLADESH', 'Bangladesh', 'BGD', '50', '880'), ('19', 'BB', 'BARBADOS', 'Barbados', 'BRB', '52', '1246'), ('20', 'BY', 'BELARUS', 'Belarus', 'BLR', '112', '375'), ('21', 'BE', 'BELGIUM', 'Belgium', 'BEL', '56', '32'), ('22', 'BZ', 'BELIZE', 'Belize', 'BLZ', '84', '501'), ('23', 'BJ', 'BENIN', 'Benin', 'BEN', '204', '229'), ('24', 'BM', 'BERMUDA', 'Bermuda', 'BMU', '60', '1441'), ('25', 'BT', 'BHUTAN', 'Bhutan', 'BTN', '64', '975'), ('26', 'BO', 'BOLIVIA', 'Bolivia', 'BOL', '68', '591'), ('27', 'BA', 'BOSNIA AND HERZEGOVINA', 'Bosnia and Herzegovina', 'BIH', '70', '387'), ('28', 'BW', 'BOTSWANA', 'Botswana', 'BWA', '72', '267'), ('29', 'BV', 'BOUVET ISLAND', 'Bouvet Island', null, null, '0'), ('30', 'BR', 'BRAZIL', 'Brazil', 'BRA', '76', '55'), ('31', 'IO', 'BRITISH INDIAN OCEAN TERRITORY', 'British Indian Ocean Territory', null, null, '246'), ('32', 'BN', 'BRUNEI DARUSSALAM', 'Brunei Darussalam', 'BRN', '96', '673'), ('33', 'BG', 'BULGARIA', 'Bulgaria', 'BGR', '100', '359'), ('34', 'BF', 'BURKINA FASO', 'Burkina Faso', 'BFA', '854', '226'), ('35', 'BI', 'BURUNDI', 'Burundi', 'BDI', '108', '257'), ('36', 'KH', 'CAMBODIA', 'Cambodia', 'KHM', '116', '855'), ('37', 'CM', 'CAMEROON', 'Cameroon', 'CMR', '120', '237'), ('38', 'CA', 'CANADA', 'Canada', 'CAN', '124', '1'), ('39', 'CV', 'CAPE VERDE', 'Cape Verde', 'CPV', '132', '238'), ('40', 'KY', 'CAYMAN ISLANDS', 'Cayman Islands', 'CYM', '136', '1345'), ('41', 'CF', 'CENTRAL AFRICAN REPUBLIC', 'Central African Republic', 'CAF', '140', '236'), ('42', 'TD', 'CHAD', 'Chad', 'TCD', '148', '235'), ('43', 'CL', 'CHILE', 'Chile', 'CHL', '152', '56'), ('44', 'CN', 'CHINA', 'China', 'CHN', '156', '86'), ('45', 'CX', 'CHRISTMAS ISLAND', 'Christmas Island', null, null, '61'), ('46', 'CC', 'COCOS (KEELING) ISLANDS', 'Cocos (Keeling) Islands', null, null, '672'), ('47', 'CO', 'COLOMBIA', 'Colombia', 'COL', '170', '57'), ('48', 'KM', 'COMOROS', 'Comoros', 'COM', '174', '269'), ('49', 'CG', 'CONGO', 'Congo', 'COG', '178', '242'), ('50', 'CD', 'CONGO, THE DEMOCRATIC REPUBLIC OF THE', 'Congo, the Democratic Republic of the', 'COD', '180', '242'), ('51', 'CK', 'COOK ISLANDS', 'Cook Islands', 'COK', '184', '682'), ('52', 'CR', 'COSTA RICA', 'Costa Rica', 'CRI', '188', '506'), ('53', 'CI', 'COTE D\'IVOIRE', 'Cote D\'Ivoire', 'CIV', '384', '225'), ('54', 'HR', 'CROATIA', 'Croatia', 'HRV', '191', '385'), ('55', 'CU', 'CUBA', 'Cuba', 'CUB', '192', '53'), ('56', 'CY', 'CYPRUS', 'Cyprus', 'CYP', '196', '357'), ('57', 'CZ', 'CZECH REPUBLIC', 'Czech Republic', 'CZE', '203', '420'), ('58', 'DK', 'DENMARK', 'Denmark', 'DNK', '208', '45'), ('59', 'DJ', 'DJIBOUTI', 'Djibouti', 'DJI', '262', '253'), ('60', 'DM', 'DOMINICA', 'Dominica', 'DMA', '212', '1767'), ('61', 'DO', 'DOMINICAN REPUBLIC', 'Dominican Republic', 'DOM', '214', '1809'), ('62', 'EC', 'ECUADOR', 'Ecuador', 'ECU', '218', '593'), ('63', 'EG', 'EGYPT', 'Egypt', 'EGY', '818', '20'), ('64', 'SV', 'EL SALVADOR', 'El Salvador', 'SLV', '222', '503'), ('65', 'GQ', 'EQUATORIAL GUINEA', 'Equatorial Guinea', 'GNQ', '226', '240'), ('66', 'ER', 'ERITREA', 'Eritrea', 'ERI', '232', '291'), ('67', 'EE', 'ESTONIA', 'Estonia', 'EST', '233', '372'), ('68', 'ET', 'ETHIOPIA', 'Ethiopia', 'ETH', '231', '251'), ('69', 'FK', 'FALKLAND ISLANDS (MALVINAS)', 'Falkland Islands (Malvinas)', 'FLK', '238', '500'), ('70', 'FO', 'FAROE ISLANDS', 'Faroe Islands', 'FRO', '234', '298'), ('71', 'FJ', 'FIJI', 'Fiji', 'FJI', '242', '679'), ('72', 'FI', 'FINLAND', 'Finland', 'FIN', '246', '358'), ('73', 'FR', 'FRANCE', 'France', 'FRA', '250', '33'), ('74', 'GF', 'FRENCH GUIANA', 'French Guiana', 'GUF', '254', '594'), ('75', 'PF', 'FRENCH POLYNESIA', 'French Polynesia', 'PYF', '258', '689'), ('76', 'TF', 'FRENCH SOUTHERN TERRITORIES', 'French Southern Territories', null, null, '0'), ('77', 'GA', 'GABON', 'Gabon', 'GAB', '266', '241'), ('78', 'GM', 'GAMBIA', 'Gambia', 'GMB', '270', '220'), ('79', 'GE', 'GEORGIA', 'Georgia', 'GEO', '268', '995'), ('80', 'DE', 'GERMANY', 'Germany', 'DEU', '276', '49'), ('81', 'GH', 'GHANA', 'Ghana', 'GHA', '288', '233'), ('82', 'GI', 'GIBRALTAR', 'Gibraltar', 'GIB', '292', '350'), ('83', 'GR', 'GREECE', 'Greece', 'GRC', '300', '30'), ('84', 'GL', 'GREENLAND', 'Greenland', 'GRL', '304', '299'), ('85', 'GD', 'GRENADA', 'Grenada', 'GRD', '308', '1473'), ('86', 'GP', 'GUADELOUPE', 'Guadeloupe', 'GLP', '312', '590'), ('87', 'GU', 'GUAM', 'Guam', 'GUM', '316', '1671'), ('88', 'GT', 'GUATEMALA', 'Guatemala', 'GTM', '320', '502'), ('89', 'GN', 'GUINEA', 'Guinea', 'GIN', '324', '224'), ('90', 'GW', 'GUINEA-BISSAU', 'Guinea-Bissau', 'GNB', '624', '245'), ('91', 'GY', 'GUYANA', 'Guyana', 'GUY', '328', '592'), ('92', 'HT', 'HAITI', 'Haiti', 'HTI', '332', '509'), ('93', 'HM', 'HEARD ISLAND AND MCDONALD ISLANDS', 'Heard Island and Mcdonald Islands', null, null, '0'), ('94', 'VA', 'HOLY SEE (VATICAN CITY STATE)', 'Holy See (Vatican City State)', 'VAT', '336', '39'), ('95', 'HN', 'HONDURAS', 'Honduras', 'HND', '340', '504'), ('96', 'HK', 'HONG KONG', 'Hong Kong', 'HKG', '344', '852'), ('97', 'HU', 'HUNGARY', 'Hungary', 'HUN', '348', '36'), ('98', 'IS', 'ICELAND', 'Iceland', 'ISL', '352', '354'), ('99', 'IN', 'INDIA', 'India', 'IND', '356', '91'), ('100', 'ID', 'INDONESIA', 'Indonesia', 'IDN', '360', '62'), ('101', 'IR', 'IRAN, ISLAMIC REPUBLIC OF', 'Iran, Islamic Republic of', 'IRN', '364', '98'), ('102', 'IQ', 'IRAQ', 'Iraq', 'IRQ', '368', '964'), ('103', 'IE', 'IRELAND', 'Ireland', 'IRL', '372', '353'), ('104', 'IL', 'ISRAEL', 'Israel', 'ISR', '376', '972'), ('105', 'IT', 'ITALY', 'Italy', 'ITA', '380', '39'), ('106', 'JM', 'JAMAICA', 'Jamaica', 'JAM', '388', '1876'), ('107', 'JP', 'JAPAN', 'Japan', 'JPN', '392', '81'), ('108', 'JO', 'JORDAN', 'Jordan', 'JOR', '400', '962'), ('109', 'KZ', 'KAZAKHSTAN', 'Kazakhstan', 'KAZ', '398', '7'), ('110', 'KE', 'KENYA', 'Kenya', 'KEN', '404', '254'), ('111', 'KI', 'KIRIBATI', 'Kiribati', 'KIR', '296', '686'), ('112', 'KP', 'KOREA, DEMOCRATIC PEOPLE\'S REPUBLIC OF', 'Korea, Democratic People\'s Republic of', 'PRK', '408', '850'), ('113', 'KR', 'KOREA, REPUBLIC OF', 'Korea, Republic of', 'KOR', '410', '82'), ('114', 'KW', 'KUWAIT', 'Kuwait', 'KWT', '414', '965'), ('115', 'KG', 'KYRGYZSTAN', 'Kyrgyzstan', 'KGZ', '417', '996'), ('116', 'LA', 'LAO PEOPLE\'S DEMOCRATIC REPUBLIC', 'Lao People\'s Democratic Republic', 'LAO', '418', '856'), ('117', 'LV', 'LATVIA', 'Latvia', 'LVA', '428', '371'), ('118', 'LB', 'LEBANON', 'Lebanon', 'LBN', '422', '961'), ('119', 'LS', 'LESOTHO', 'Lesotho', 'LSO', '426', '266'), ('120', 'LR', 'LIBERIA', 'Liberia', 'LBR', '430', '231'), ('121', 'LY', 'LIBYAN ARAB JAMAHIRIYA', 'Libyan Arab Jamahiriya', 'LBY', '434', '218'), ('122', 'LI', 'LIECHTENSTEIN', 'Liechtenstein', 'LIE', '438', '423'), ('123', 'LT', 'LITHUANIA', 'Lithuania', 'LTU', '440', '370'), ('124', 'LU', 'LUXEMBOURG', 'Luxembourg', 'LUX', '442', '352'), ('125', 'MO', 'MACAO', 'Macao', 'MAC', '446', '853'), ('126', 'MK', 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF', 'Macedonia, the Former Yugoslav Republic of', 'MKD', '807', '389'), ('127', 'MG', 'MADAGASCAR', 'Madagascar', 'MDG', '450', '261'), ('128', 'MW', 'MALAWI', 'Malawi', 'MWI', '454', '265'), ('129', 'MY', 'MALAYSIA', 'Malaysia', 'MYS', '458', '60'), ('130', 'MV', 'MALDIVES', 'Maldives', 'MDV', '462', '960'), ('131', 'ML', 'MALI', 'Mali', 'MLI', '466', '223'), ('132', 'MT', 'MALTA', 'Malta', 'MLT', '470', '356'), ('133', 'MH', 'MARSHALL ISLANDS', 'Marshall Islands', 'MHL', '584', '692'), ('134', 'MQ', 'MARTINIQUE', 'Martinique', 'MTQ', '474', '596'), ('135', 'MR', 'MAURITANIA', 'Mauritania', 'MRT', '478', '222'), ('136', 'MU', 'MAURITIUS', 'Mauritius', 'MUS', '480', '230'), ('137', 'YT', 'MAYOTTE', 'Mayotte', null, null, '269'), ('138', 'MX', 'MEXICO', 'Mexico', 'MEX', '484', '52'), ('139', 'FM', 'MICRONESIA, FEDERATED STATES OF', 'Micronesia, Federated States of', 'FSM', '583', '691'), ('140', 'MD', 'MOLDOVA, REPUBLIC OF', 'Moldova, Republic of', 'MDA', '498', '373'), ('141', 'MC', 'MONACO', 'Monaco', 'MCO', '492', '377'), ('142', 'MN', 'MONGOLIA', 'Mongolia', 'MNG', '496', '976'), ('143', 'MS', 'MONTSERRAT', 'Montserrat', 'MSR', '500', '1664'), ('144', 'MA', 'MOROCCO', 'Morocco', 'MAR', '504', '212'), ('145', 'MZ', 'MOZAMBIQUE', 'Mozambique', 'MOZ', '508', '258'), ('146', 'MM', 'MYANMAR', 'Myanmar', 'MMR', '104', '95'), ('147', 'NA', 'NAMIBIA', 'Namibia', 'NAM', '516', '264'), ('148', 'NR', 'NAURU', 'Nauru', 'NRU', '520', '674'), ('149', 'NP', 'NEPAL', 'Nepal', 'NPL', '524', '977'), ('150', 'NL', 'NETHERLANDS', 'Netherlands', 'NLD', '528', '31'), ('151', 'AN', 'NETHERLANDS ANTILLES', 'Netherlands Antilles', 'ANT', '530', '599'), ('152', 'NC', 'NEW CALEDONIA', 'New Caledonia', 'NCL', '540', '687'), ('153', 'NZ', 'NEW ZEALAND', 'New Zealand', 'NZL', '554', '64'), ('154', 'NI', 'NICARAGUA', 'Nicaragua', 'NIC', '558', '505'), ('155', 'NE', 'NIGER', 'Niger', 'NER', '562', '227'), ('156', 'NG', 'NIGERIA', 'Nigeria', 'NGA', '566', '234'), ('157', 'NU', 'NIUE', 'Niue', 'NIU', '570', '683'), ('158', 'NF', 'NORFOLK ISLAND', 'Norfolk Island', 'NFK', '574', '672'), ('159', 'MP', 'NORTHERN MARIANA ISLANDS', 'Northern Mariana Islands', 'MNP', '580', '1670'), ('160', 'NO', 'NORWAY', 'Norway', 'NOR', '578', '47'), ('161', 'OM', 'OMAN', 'Oman', 'OMN', '512', '968'), ('162', 'PK', 'PAKISTAN', 'Pakistan', 'PAK', '586', '92'), ('163', 'PW', 'PALAU', 'Palau', 'PLW', '585', '680'), ('164', 'PS', 'PALESTINIAN TERRITORY, OCCUPIED', 'Palestinian Territory, Occupied', null, null, '970'), ('165', 'PA', 'PANAMA', 'Panama', 'PAN', '591', '507'), ('166', 'PG', 'PAPUA NEW GUINEA', 'Papua New Guinea', 'PNG', '598', '675'), ('167', 'PY', 'PARAGUAY', 'Paraguay', 'PRY', '600', '595'), ('168', 'PE', 'PERU', 'Peru', 'PER', '604', '51'), ('169', 'PH', 'PHILIPPINES', 'Philippines', 'PHL', '608', '63'), ('170', 'PN', 'PITCAIRN', 'Pitcairn', 'PCN', '612', '0'), ('171', 'PL', 'POLAND', 'Poland', 'POL', '616', '48'), ('172', 'PT', 'PORTUGAL', 'Portugal', 'PRT', '620', '351'), ('173', 'PR', 'PUERTO RICO', 'Puerto Rico', 'PRI', '630', '1787'), ('174', 'QA', 'QATAR', 'Qatar', 'QAT', '634', '974'), ('175', 'RE', 'REUNION', 'Reunion', 'REU', '638', '262'), ('176', 'RO', 'ROMANIA', 'Romania', 'ROM', '642', '40'), ('177', 'RU', 'RUSSIAN FEDERATION', 'Russian Federation', 'RUS', '643', '70'), ('178', 'RW', 'RWANDA', 'Rwanda', 'RWA', '646', '250'), ('179', 'SH', 'SAINT HELENA', 'Saint Helena', 'SHN', '654', '290'), ('180', 'KN', 'SAINT KITTS AND NEVIS', 'Saint Kitts and Nevis', 'KNA', '659', '1869'), ('181', 'LC', 'SAINT LUCIA', 'Saint Lucia', 'LCA', '662', '1758'), ('182', 'PM', 'SAINT PIERRE AND MIQUELON', 'Saint Pierre and Miquelon', 'SPM', '666', '508'), ('183', 'VC', 'SAINT VINCENT AND THE GRENADINES', 'Saint Vincent and the Grenadines', 'VCT', '670', '1784'), ('184', 'WS', 'SAMOA', 'Samoa', 'WSM', '882', '684'), ('185', 'SM', 'SAN MARINO', 'San Marino', 'SMR', '674', '378'), ('186', 'ST', 'SAO TOME AND PRINCIPE', 'Sao Tome and Principe', 'STP', '678', '239'), ('187', 'SA', 'SAUDI ARABIA', 'Saudi Arabia', 'SAU', '682', '966'), ('188', 'SN', 'SENEGAL', 'Senegal', 'SEN', '686', '221'), ('189', 'CS', 'SERBIA AND MONTENEGRO', 'Serbia and Montenegro', null, null, '381'), ('190', 'SC', 'SEYCHELLES', 'Seychelles', 'SYC', '690', '248'), ('191', 'SL', 'SIERRA LEONE', 'Sierra Leone', 'SLE', '694', '232'), ('192', 'SG', 'SINGAPORE', 'Singapore', 'SGP', '702', '65'), ('193', 'SK', 'SLOVAKIA', 'Slovakia', 'SVK', '703', '421'), ('194', 'SI', 'SLOVENIA', 'Slovenia', 'SVN', '705', '386'), ('195', 'SB', 'SOLOMON ISLANDS', 'Solomon Islands', 'SLB', '90', '677'), ('196', 'SO', 'SOMALIA', 'Somalia', 'SOM', '706', '252'), ('197', 'ZA', 'SOUTH AFRICA', 'South Africa', 'ZAF', '710', '27'), ('198', 'GS', 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS', 'South Georgia and the South Sandwich Islands', null, null, '0'), ('199', 'ES', 'SPAIN', 'Spain', 'ESP', '724', '34'), ('200', 'LK', 'SRI LANKA', 'Sri Lanka', 'LKA', '144', '94'), ('201', 'SD', 'SUDAN', 'Sudan', 'SDN', '736', '249'), ('202', 'SR', 'SURINAME', 'Suriname', 'SUR', '740', '597'), ('203', 'SJ', 'SVALBARD AND JAN MAYEN', 'Svalbard and Jan Mayen', 'SJM', '744', '47'), ('204', 'SZ', 'SWAZILAND', 'Swaziland', 'SWZ', '748', '268'), ('205', 'SE', 'SWEDEN', 'Sweden', 'SWE', '752', '46'), ('206', 'CH', 'SWITZERLAND', 'Switzerland', 'CHE', '756', '41'), ('207', 'SY', 'SYRIAN ARAB REPUBLIC', 'Syrian Arab Republic', 'SYR', '760', '963'), ('208', 'TW', 'TAIWAN, PROVINCE OF CHINA', 'Taiwan, Province of China', 'TWN', '158', '886'), ('209', 'TJ', 'TAJIKISTAN', 'Tajikistan', 'TJK', '762', '992'), ('210', 'TZ', 'TANZANIA, UNITED REPUBLIC OF', 'Tanzania, United Republic of', 'TZA', '834', '255'), ('211', 'TH', 'THAILAND', 'Thailand', 'THA', '764', '66'), ('212', 'TL', 'TIMOR-LESTE', 'Timor-Leste', null, null, '670'), ('213', 'TG', 'TOGO', 'Togo', 'TGO', '768', '228'), ('214', 'TK', 'TOKELAU', 'Tokelau', 'TKL', '772', '690'), ('215', 'TO', 'TONGA', 'Tonga', 'TON', '776', '676'), ('216', 'TT', 'TRINIDAD AND TOBAGO', 'Trinidad and Tobago', 'TTO', '780', '1868'), ('217', 'TN', 'TUNISIA', 'Tunisia', 'TUN', '788', '216'), ('218', 'TR', 'TURKEY', 'Turkey', 'TUR', '792', '90'), ('219', 'TM', 'TURKMENISTAN', 'Turkmenistan', 'TKM', '795', '7370'), ('220', 'TC', 'TURKS AND CAICOS ISLANDS', 'Turks and Caicos Islands', 'TCA', '796', '1649'), ('221', 'TV', 'TUVALU', 'Tuvalu', 'TUV', '798', '688'), ('222', 'UG', 'UGANDA', 'Uganda', 'UGA', '800', '256'), ('223', 'UA', 'UKRAINE', 'Ukraine', 'UKR', '804', '380'), ('224', 'AE', 'UNITED ARAB EMIRATES', 'United Arab Emirates', 'ARE', '784', '971'), ('225', 'GB', 'UNITED KINGDOM', 'United Kingdom', 'GBR', '826', '44'), ('226', 'US', 'UNITED STATES', 'United States', 'USA', '840', '1'), ('227', 'UM', 'UNITED STATES MINOR OUTLYING ISLANDS', 'United States Minor Outlying Islands', null, null, '1'), ('228', 'UY', 'URUGUAY', 'Uruguay', 'URY', '858', '598'), ('229', 'UZ', 'UZBEKISTAN', 'Uzbekistan', 'UZB', '860', '998'), ('230', 'VU', 'VANUATU', 'Vanuatu', 'VUT', '548', '678'), ('231', 'VE', 'VENEZUELA', 'Venezuela', 'VEN', '862', '58'), ('232', 'VN', 'VIET NAM', 'Viet Nam', 'VNM', '704', '84'), ('233', 'VG', 'VIRGIN ISLANDS, BRITISH', 'Virgin Islands, British', 'VGB', '92', '1284'), ('234', 'VI', 'VIRGIN ISLANDS, U.S.', 'Virgin Islands, U.s.', 'VIR', '850', '1340'), ('235', 'WF', 'WALLIS AND FUTUNA', 'Wallis and Futuna', 'WLF', '876', '681'), ('236', 'EH', 'WESTERN SAHARA', 'Western Sahara', 'ESH', '732', '212'), ('237', 'YE', 'YEMEN', 'Yemen', 'YEM', '887', '967'), ('238', 'ZM', 'ZAMBIA', 'Zambia', 'ZMB', '894', '260'), ('239', 'ZW', 'ZIMBABWE', 'Zimbabwe', 'ZWE', '716', '263');
COMMIT;

-- ----------------------------
--  Table structure for `_customerContacts`
-- ----------------------------
DROP TABLE IF EXISTS `_customerContacts`;
CREATE TABLE `_customerContacts` (
  `cust_id` int(11) NOT NULL AUTO_INCREMENT,
  `cnct_id` int(11) DEFAULT NULL,
  KEY `cust_id` (`cust_id`),
  KEY `cnct_id` (`cnct_id`),
  CONSTRAINT `cnct_id` FOREIGN KEY (`cnct_id`) REFERENCES `_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cust_id` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_customerLocationEnvelopes`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLocationEnvelopes`;
CREATE TABLE `_customerLocationEnvelopes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) DEFAULT NULL,
  `acres` float DEFAULT NULL,
  `hectares` float DEFAULT NULL,
  `sq_meters` float DEFAULT NULL,
  `ttl_sq_meters` float DEFAULT NULL,
  `gutter_height` float DEFAULT NULL,
  `rail_height` float DEFAULT NULL,
  `rail_width` float DEFAULT NULL,
  `design_id` int(11) DEFAULT NULL,
  `frame_id` int(11) DEFAULT NULL,
  `floor_id` int(11) DEFAULT NULL,
  `covering_id` int(11) DEFAULT NULL,
  `gutter_id` int(11) DEFAULT NULL,
  `heating_id` int(11) DEFAULT NULL,
  `vent_id` int(11) DEFAULT NULL,
  `co2_id` int(11) DEFAULT NULL,
  `power_id` int(11) DEFAULT NULL,
  `screens` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `design_id` (`design_id`),
  KEY `frame_id` (`frame_id`),
  KEY `floor_id` (`floor_id`),
  KEY `covering_id` (`covering_id`),
  KEY `gutter_id` (`gutter_id`),
  KEY `heating_id` (`heating_id`),
  KEY `vent_id` (`vent_id`),
  KEY `co2_id` (`co2_id`),
  KEY `screens` (`screens`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `_vent` FOREIGN KEY (`vent_id`) REFERENCES `_grnHse_ventilaition` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `co2` FOREIGN KEY (`co2_id`) REFERENCES `_grnHse_co2_sys` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse` FOREIGN KEY (`floor_id`) REFERENCES `_grnHse_floors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_cvrgHse` FOREIGN KEY (`covering_id`) REFERENCES `_grnHse_coverings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_cvrs` FOREIGN KEY (`covering_id`) REFERENCES `_grnHse_coverings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_design` FOREIGN KEY (`design_id`) REFERENCES `_grnhs_designs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_floor` FOREIGN KEY (`floor_id`) REFERENCES `_grnHse_floors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_frame` FOREIGN KEY (`frame_id`) REFERENCES `_grnhs_framing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_gutt` FOREIGN KEY (`gutter_id`) REFERENCES `_grnHse_gutters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `gHse_heat` FOREIGN KEY (`heating_id`) REFERENCES `_grnHse_heating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loc` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `scrns` FOREIGN KEY (`screens`) REFERENCES `_grnHse_screens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_customerLocationEnvelopes`
-- ----------------------------
BEGIN;
INSERT INTO `_customerLocationEnvelopes` VALUES ('1', '11', '12', '1', '2345', null, null, null, null, '1', null, null, null, null, null, null, null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `_customerLocationEnvelopes_history`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLocationEnvelopes_history`;
CREATE TABLE `_customerLocationEnvelopes_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(11) DEFAULT NULL,
  `acres` float DEFAULT NULL,
  `hectares` float DEFAULT NULL,
  `sq_meters` float DEFAULT NULL,
  `ttl_sq_meters` float DEFAULT NULL,
  `gutter_height` float DEFAULT NULL,
  `rail_height` float DEFAULT NULL,
  `rail_width` float DEFAULT NULL,
  `design_id` int(11) DEFAULT NULL,
  `frame_id` int(11) DEFAULT NULL,
  `floor_id` int(11) DEFAULT NULL,
  `covering_id` int(11) DEFAULT NULL,
  `gutter_id` int(11) DEFAULT NULL,
  `heating_id` int(11) DEFAULT NULL,
  `vent_id` int(11) DEFAULT NULL,
  `co2_id` int(11) DEFAULT NULL,
  `power_id` int(11) DEFAULT NULL,
  `screens` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `design_id` (`design_id`),
  KEY `frame_id` (`frame_id`),
  KEY `floor_id` (`floor_id`),
  KEY `covering_id` (`covering_id`),
  KEY `gutter_id` (`gutter_id`),
  KEY `heating_id` (`heating_id`),
  KEY `vent_id` (`vent_id`),
  KEY `co2_id` (`co2_id`),
  KEY `screens` (`screens`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_1` FOREIGN KEY (`vent_id`) REFERENCES `_grnHse_ventilaition` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_10` FOREIGN KEY (`heating_id`) REFERENCES `_grnHse_heating` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_11` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_12` FOREIGN KEY (`screens`) REFERENCES `_grnHse_screens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_2` FOREIGN KEY (`co2_id`) REFERENCES `_grnHse_co2_sys` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_3` FOREIGN KEY (`floor_id`) REFERENCES `_grnHse_floors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_4` FOREIGN KEY (`covering_id`) REFERENCES `_grnHse_coverings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_5` FOREIGN KEY (`covering_id`) REFERENCES `_grnHse_coverings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_6` FOREIGN KEY (`design_id`) REFERENCES `_grnhs_designs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_7` FOREIGN KEY (`floor_id`) REFERENCES `_grnHse_floors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_8` FOREIGN KEY (`frame_id`) REFERENCES `_grnhs_framing` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_customerlocationenvelopes_history_ibfk_9` FOREIGN KEY (`gutter_id`) REFERENCES `_grnHse_gutters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_customerLocationEnvelopes_history`
-- ----------------------------
BEGIN;
INSERT INTO `_customerLocationEnvelopes_history` VALUES ('1', '11', '10', '1', '2345', null, null, null, null, '1', null, null, null, null, null, null, null, null, null), ('2', '11', '12', '1', '2345', null, null, null, null, '1', null, null, null, null, null, null, null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `_customerLocationPhotos`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLocationPhotos`;
CREATE TABLE `_customerLocationPhotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust_id` int(11) DEFAULT NULL,
  `location_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_id` (`cust_id`),
  CONSTRAINT `cust_id_loc` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_customerLocationPhotos_history`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLocationPhotos_history`;
CREATE TABLE `_customerLocationPhotos_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust_id` int(11) DEFAULT NULL,
  `location_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_id` (`cust_id`),
  CONSTRAINT `_customerlocationphotos_history_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_customerLocations`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLocations`;
CREATE TABLE `_customerLocations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust_id` int(11) DEFAULT NULL,
  `location_id` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `location_type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_id` (`cust_id`),
  KEY `location_type_id` (`location_type_id`),
  CONSTRAINT `custId` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `locType` FOREIGN KEY (`location_type_id`) REFERENCES `_locationTypes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_customerLocations`
-- ----------------------------
BEGIN;
INSERT INTO `_customerLocations` VALUES ('11', '1', 'MAIN', '1'), ('12', '2', 'MAIN', '3'), ('13', '9', 'MAIN', '1'), ('14', '10', 'HDHDJ', '1'), ('15', '11', 'BARN300', '4'), ('16', '11', 'DAVIDSKAR', '4'), ('17', '12', '2323423', '4'), ('18', '11', 'FUNNYLOOKINGCAR', '4'), ('19', '11', 'WEAREINTHEOFFICE', '4'), ('20', '11', 'OFFICE', '4'), ('63', '11', 'MAIN', '5'), ('65', '11', 'OUTSIDE', null), ('66', '11', 'OUTSIDE2', null), ('67', '11', 'BARN301', null), ('68', '21', '234234WERSDFS', null), ('69', '24', 'OUTSIDE', null), ('70', '24', 'OUTSIDE2', null), ('71', '24', 'MAIN', null), ('72', '11', 'BARNORAMA', null), ('73', '27', 'OUTSIDE', null), ('74', '27', 'OUTSIDE2', null), ('75', '27', 'MAIN', null), ('76', '28', 'OUTSIDE', null), ('77', '28', 'OUTSIDE2', null), ('78', '28', 'MAIN', null), ('79', '35', 'OUTSIDE', null), ('80', '35', 'OUTSIDE2', null), ('81', '35', 'MAIN', null), ('82', '42', '111', null), ('86', '11', 'BARNUPPI', null), ('101', '11', 'SHITTY', null);
COMMIT;

-- ----------------------------
--  Table structure for `_customerLogos`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLogos`;
CREATE TABLE `_customerLogos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust_id` int(11) DEFAULT NULL,
  `logo` blob,
  PRIMARY KEY (`id`),
  KEY `cust_id` (`cust_id`),
  CONSTRAINT `cust_id_logo` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_customerLogos_history`
-- ----------------------------
DROP TABLE IF EXISTS `_customerLogos_history`;
CREATE TABLE `_customerLogos_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust_id` int(11) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cust_id` (`cust_id`),
  CONSTRAINT `_customerlogos_history_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_customer_locationAddresses`
-- ----------------------------
DROP TABLE IF EXISTS `_customer_locationAddresses`;
CREATE TABLE `_customer_locationAddresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location_id` int(255) DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `prov` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `postal` varchar(11) CHARACTER SET utf8 DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_customers`
-- ----------------------------
DROP TABLE IF EXISTS `_customers`;
CREATE TABLE `_customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(11) CHARACTER SET utf8 DEFAULT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `prov` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `postal` varchar(10) CHARACTER SET utf8 DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `country_id` char(4) CHARACTER SET utf8 DEFAULT NULL,
  `lat` float(10,6) DEFAULT NULL,
  `long` float(10,6) DEFAULT NULL,
  `industry_id` int(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `draft_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cus_id` (`customer_id`) USING BTREE,
  KEY `industry_id` (`industry_id`),
  KEY `custName` (`customer_name`) USING BTREE,
  CONSTRAINT `ind_id` FOREIGN KEY (`industry_id`) REFERENCES `industry_sectors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_customers`
-- ----------------------------
BEGIN;
INSERT INTO `_customers` VALUES ('1', '1068055575', 'Myers Organic Farms', '5278 256 Street', 'Langley Township', 'British Columbia', 'V4W 1E7', 'Canada', '0000', '49.098202', '-122.514999', '1', null, null), ('2', '1068055573', 'Rossdown Natural Foods Lt', '2325 Bradner Road', 'Abbotsford', 'British Columbia', 'V4X 1E2', 'Canada', '0000', '49.044998', '-122.431999', '5', null, null), ('9', '0000000000', 'techmist_r&d 1', '32905 king road', 'Abbotsford', 'British Columbia', 'V2S 7Z8', 'Canada', '0000', '49.030899', '-122.309998', '8', null, null), ('10', '7337373867', 'techmist_r&d  2', '32905 king road', 'Abbotsford', 'British Columbia', 'V2S 7Z8', null, '0000', null, null, null, null, null), ('11', '1083558489', 'techmist_r&d 3', null, null, null, null, null, '0000', null, null, null, null, null), ('12', '2342323423', 'techmist_r&d 4', null, null, null, null, null, '0000', null, null, null, null, null), ('13', '1099775022', 'Agricola El Rosal, S.A. de C.V.', null, null, null, null, null, null, null, null, null, null, null), ('14', '1099775045', 'Sunny Fields S.A.P.I. de C.V.', null, null, null, null, null, null, null, null, null, null, null), ('15', '1099775027', 'Aphria', null, null, null, null, null, null, null, null, null, null, null), ('16', '1099774986', 'Golden Acre Farms', null, null, null, null, null, null, null, null, null, null, null), ('17', '1099775013', 'Vine Fresh Acres', null, null, null, null, null, null, null, null, null, null, null), ('18', '1099775033', 'Erie View Acres Inc.', null, null, null, null, null, null, null, null, null, null, null), ('34', '1083558488', null, null, null, null, null, null, null, null, null, null, null, null), ('35', '108355848', null, null, null, null, null, null, null, null, null, null, null, null), ('42', '999999854', null, null, null, null, null, null, null, null, null, null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `_emails`
-- ----------------------------
DROP TABLE IF EXISTS `_emails`;
CREATE TABLE `_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_grnHse_co2_sys`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_co2_sys`;
CREATE TABLE `_grnHse_co2_sys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `co2` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_co2_sys`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_co2_sys` VALUES ('1', 'Boiler Stack Recovery System '), ('2', 'Combustion '), ('3', 'Liquid CO2'), ('4', 'Natural gas CO2 Generators'), ('5', 'None');
COMMIT;

-- ----------------------------
--  Table structure for `_grnHse_coverings`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_coverings`;
CREATE TABLE `_grnHse_coverings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `covering` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_coverings`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_coverings` VALUES ('1', 'Glass Panels '), ('2', 'Polycarbonate Panels '), ('3', 'Polythene Skins ');
COMMIT;

-- ----------------------------
--  Table structure for `_grnHse_floors`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_floors`;
CREATE TABLE `_grnHse_floors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floor` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_floors`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_floors` VALUES ('1', 'Bark Chips/ WoodChips/ Sawdust '), ('2', 'Compact Clay/Fabric '), ('3', 'Concrete (Porous) '), ('4', 'Concrete (Portland) '), ('5', 'Gravel '), ('6', 'Stone '), ('7', 'Wood ');
COMMIT;

-- ----------------------------
--  Table structure for `_grnHse_gutters`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_gutters`;
CREATE TABLE `_grnHse_gutters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gutter_connections` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_gutters`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_gutters` VALUES ('1', 'Polythene Skins '), ('2', 'Ridge-Furrow '), ('3', 'Gutter-Connected ');
COMMIT;

-- ----------------------------
--  Table structure for `_grnHse_heating`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_heating`;
CREATE TABLE `_grnHse_heating` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `heting` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_heating`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_heating` VALUES ('1', 'Boiler Heat '), ('2', 'Forced Air '), ('3', 'Both '), ('4', 'None');
COMMIT;

-- ----------------------------
--  Table structure for `_grnHse_power_srcs`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_power_srcs`;
CREATE TABLE `_grnHse_power_srcs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `power_src` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_power_srcs`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_power_srcs` VALUES ('1', '110'), ('2', '220'), ('3', '208'), ('4', '240'), ('5', '460'), ('6', '600');
COMMIT;

-- ----------------------------
--  Table structure for `_grnHse_screens`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_screens`;
CREATE TABLE `_grnHse_screens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `screen` varchar(255) DEFAULT NULL,
  `type` enum('test') DEFAULT 'test',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_grnHse_ventilaition`
-- ----------------------------
DROP TABLE IF EXISTS `_grnHse_ventilaition`;
CREATE TABLE `_grnHse_ventilaition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vent` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnHse_ventilaition`
-- ----------------------------
BEGIN;
INSERT INTO `_grnHse_ventilaition` VALUES ('1', 'Forced Air '), ('2', 'Ridge or Gutter Vents '), ('3', 'None');
COMMIT;

-- ----------------------------
--  Table structure for `_grnhs_designs`
-- ----------------------------
DROP TABLE IF EXISTS `_grnhs_designs`;
CREATE TABLE `_grnhs_designs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `design` varchar(255) DEFAULT NULL,
  `description` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnhs_designs`
-- ----------------------------
BEGIN;
INSERT INTO `_grnhs_designs` VALUES ('1', 'A-frame', 'A series of supporting trusses that form the roof and gables. The strength of this structure primarily comes from the trusses set on vertical walls.\n'), ('2', 'Ridge-and-Furrow (gutter-connected)', 'Single stand-alone structure or combined side-to-side, the interior walls are usually absent. Most commercial greenhouses now utilize some variation of the gutter-connected design.\n'), ('3', 'The sawtooth', 'An uneven span, is more common in high temperature locations and those places that receive prevailing winds since the design allows for improved movement of hot air out of the greenhouse roof vents.'), ('4', 'Lean-To ', 'Most commonly used by homeowners and the geodesic dome is most often used by botanical centers. Some botanical center conservatories have elaborate cylindrical, arched or Victorian designs.'), ('5', 'Quonset', 'Based upon an arched roof. The arched roof allows stresses on the structure to be efﬁciently transferred down to the ground.');
COMMIT;

-- ----------------------------
--  Table structure for `_grnhs_framing`
-- ----------------------------
DROP TABLE IF EXISTS `_grnhs_framing`;
CREATE TABLE `_grnhs_framing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `frame` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_grnhs_framing`
-- ----------------------------
BEGIN;
INSERT INTO `_grnhs_framing` VALUES ('1', 'Aluminum '), ('2', 'Steel'), ('3', 'Wood');
COMMIT;

-- ----------------------------
--  Table structure for `_jobs`
-- ----------------------------
DROP TABLE IF EXISTS `_jobs`;
CREATE TABLE `_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) DEFAULT NULL,
  `PO_num` varchar(255) DEFAULT NULL,
  `carbon_num` float DEFAULT NULL,
  `carbon_standard` float DEFAULT NULL,
  `payment_status` enum('Deposit Paid','Paid in in Full') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_locationContacts`
-- ----------------------------
DROP TABLE IF EXISTS `_locationContacts`;
CREATE TABLE `_locationContacts` (
  `location_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  KEY `location_id` (`location_id`),
  KEY `contact_id` (`contact_id`),
  CONSTRAINT `_loc_id` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loc_cnct_id` FOREIGN KEY (`contact_id`) REFERENCES `_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_locationContacts_history`
-- ----------------------------
DROP TABLE IF EXISTS `_locationContacts_history`;
CREATE TABLE `_locationContacts_history` (
  `location_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  KEY `location_id` (`location_id`),
  KEY `contact_id` (`contact_id`),
  CONSTRAINT `_locationcontacts_history_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_locationcontacts_history_ibfk_2` FOREIGN KEY (`contact_id`) REFERENCES `_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_locationCrops`
-- ----------------------------
DROP TABLE IF EXISTS `_locationCrops`;
CREATE TABLE `_locationCrops` (
  `location_id` int(11) DEFAULT NULL,
  `crop_id` int(11) DEFAULT NULL,
  KEY `location_id` (`location_id`),
  KEY `crop_id` (`crop_id`),
  CONSTRAINT `crop_id` FOREIGN KEY (`crop_id`) REFERENCES `api_gr_crops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `loc_id` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_locationCrops_history`
-- ----------------------------
DROP TABLE IF EXISTS `_locationCrops_history`;
CREATE TABLE `_locationCrops_history` (
  `location_id` int(11) DEFAULT NULL,
  `crop_id` int(11) DEFAULT NULL,
  KEY `location_id` (`location_id`),
  KEY `crop_id` (`crop_id`),
  CONSTRAINT `_locationcrops_history_ibfk_1` FOREIGN KEY (`crop_id`) REFERENCES `api_gr_crops` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_locationcrops_history_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_locationTypes`
-- ----------------------------
DROP TABLE IF EXISTS `_locationTypes`;
CREATE TABLE `_locationTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_locationTypes`
-- ----------------------------
BEGIN;
INSERT INTO `_locationTypes` VALUES ('1', 'greenhouse'), ('2', 'poultry farm'), ('3', 'poultry processing facility'), ('4', 'test facility'), ('5', 'undefined');
COMMIT;

-- ----------------------------
--  Table structure for `_phones`
-- ----------------------------
DROP TABLE IF EXISTS `_phones`;
CREATE TABLE `_phones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` decimal(10,0) DEFAULT NULL,
  `type` enum('office','cell') DEFAULT 'office',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_pretreatmentChemicals`
-- ----------------------------
DROP TABLE IF EXISTS `_pretreatmentChemicals`;
CREATE TABLE `_pretreatmentChemicals` (
  `treatment_id` int(11) DEFAULT NULL,
  `chemical_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `chemical_id` (`chemical_id`),
  CONSTRAINT `pt_chem_id` FOREIGN KEY (`chemical_id`) REFERENCES `_chemicals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pt_t_id` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_target_thresholds`
-- ----------------------------
DROP TABLE IF EXISTS `_target_thresholds`;
CREATE TABLE `_target_thresholds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `threshold_full` varchar(75) CHARACTER SET utf8 NOT NULL,
  `threshold` char(2) CHARACTER SET utf8 DEFAULT NULL,
  `threshold_value` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_target_thresholds`
-- ----------------------------
BEGIN;
INSERT INTO `_target_thresholds` VALUES ('1', 'Carbon Standard = 0.00', 'CS', '0.00'), ('2', 'Bacteria / Clavibacter = 0.10', 'Ba', '0.10'), ('3', 'Virus = 0.25', 'Vi', '0.25'), ('4', 'Insect - Small = 0.50', 'IS', '0.50'), ('5', 'Powdery Mildew = 0.90', 'PM', '0.90'), ('6', 'Insect - Medium = 1.00', 'IM', '1.00'), ('7', 'Biofilm Virus = 1.50', 'BV', '1.50'), ('8', 'Insect - Large = 1.50', 'IL', '1.50'), ('9', 'Algae = 1.50', 'AL', '1.50');
COMMIT;

-- ----------------------------
--  Table structure for `_tasks`
-- ----------------------------
DROP TABLE IF EXISTS `_tasks`;
CREATE TABLE `_tasks` (
  `id` int(11) NOT NULL,
  `task` varchar(255) CHARACTER SET utf8 NOT NULL,
  `status` enum('pending','in_progress','complete') CHARACTER SET utf8 DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_tech_certificates`
-- ----------------------------
DROP TABLE IF EXISTS `_tech_certificates`;
CREATE TABLE `_tech_certificates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `certificate` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_tech_certificates`
-- ----------------------------
BEGIN;
INSERT INTO `_tech_certificates` VALUES ('1', 'SHC- Safe Handeling of Cryogenics'), ('2', 'TDG - Transportation of Dangerous Goods');
COMMIT;

-- ----------------------------
--  Table structure for `_techmist_divisions`
-- ----------------------------
DROP TABLE IF EXISTS `_techmist_divisions`;
CREATE TABLE `_techmist_divisions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `division` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_techmist_divisions`
-- ----------------------------
BEGIN;
INSERT INTO `_techmist_divisions` VALUES ('1', 'West Coast - Treatments'), ('2', 'West Coast - R&D'), ('3', 'East Coast - Treatments');
COMMIT;

-- ----------------------------
--  Table structure for `_technicianCertificates`
-- ----------------------------
DROP TABLE IF EXISTS `_technicianCertificates`;
CREATE TABLE `_technicianCertificates` (
  `tech_id` int(11) DEFAULT NULL,
  `cert_id` int(11) DEFAULT NULL,
  `certification_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `tech_id` (`tech_id`),
  KEY `cert_id` (`cert_id`),
  CONSTRAINT `cert_fk` FOREIGN KEY (`cert_id`) REFERENCES `_techCertificates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `tech_fk` FOREIGN KEY (`tech_id`) REFERENCES `_technicians` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_technicianCertificates_history`
-- ----------------------------
DROP TABLE IF EXISTS `_technicianCertificates_history`;
CREATE TABLE `_technicianCertificates_history` (
  `tech_id` int(11) DEFAULT NULL,
  `cert_id` int(11) DEFAULT NULL,
  `certification_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `tech_id` (`tech_id`),
  KEY `cert_id` (`cert_id`),
  CONSTRAINT `_techniciancertificates_history_ibfk_1` FOREIGN KEY (`cert_id`) REFERENCES `_tech_certificates` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `_techniciancertificates_history_ibfk_2` FOREIGN KEY (`tech_id`) REFERENCES `_technicians` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_technicianEmails`
-- ----------------------------
DROP TABLE IF EXISTS `_technicianEmails`;
CREATE TABLE `_technicianEmails` (
  `technician_id` int(11) NOT NULL,
  `email_id` int(11) NOT NULL,
  KEY `technician_id` (`technician_id`),
  KEY `phone_id` (`email_id`),
  KEY `email_id` (`email_id`),
  CONSTRAINT `_technician_email_bfk` FOREIGN KEY (`email_id`) REFERENCES `_emails` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `_technician_id_e_fk` FOREIGN KEY (`technician_id`) REFERENCES `_technicians` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_technicianPhones`
-- ----------------------------
DROP TABLE IF EXISTS `_technicianPhones`;
CREATE TABLE `_technicianPhones` (
  `technician_id` int(11) NOT NULL,
  `phone_id` int(11) NOT NULL,
  KEY `technician_id` (`technician_id`),
  KEY `phone_id` (`phone_id`),
  CONSTRAINT `techId_fk` FOREIGN KEY (`technician_id`) REFERENCES `_technicians` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `techPhone_fk` FOREIGN KEY (`phone_id`) REFERENCES `_phones` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_technicianTasks`
-- ----------------------------
DROP TABLE IF EXISTS `_technicianTasks`;
CREATE TABLE `_technicianTasks` (
  `tech_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  KEY `tech_id` (`tech_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `tech_id_fk` FOREIGN KEY (`tech_id`) REFERENCES `_technicians` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tech_task_fk` FOREIGN KEY (`task_id`) REFERENCES `_tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_technician_levels`
-- ----------------------------
DROP TABLE IF EXISTS `_technician_levels`;
CREATE TABLE `_technician_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_technician_levels`
-- ----------------------------
BEGIN;
INSERT INTO `_technician_levels` VALUES ('1', 'Level 1 Unsupported - Independant: Staging, Monitor,Reports'), ('2', 'Level 2 Supported -Solo: Staging, Monitor, Reports'), ('3', 'Level 3 Supported - Partnered: Staging Monitor, Report'), ('4', 'null - dev testing');
COMMIT;

-- ----------------------------
--  Table structure for `_technicians`
-- ----------------------------
DROP TABLE IF EXISTS `_technicians`;
CREATE TABLE `_technicians` (
  `division_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `image` longblob,
  `level` int(11) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `level` (`level`),
  KEY `division_id` (`division_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `techDivision` FOREIGN KEY (`division_id`) REFERENCES `_techmist_divisions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tech_level` FOREIGN KEY (`level`) REFERENCES `_technician_levels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tech_user_id` FOREIGN KEY (`user_id`) REFERENCES `_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_technicians`
-- ----------------------------
BEGIN;
INSERT INTO `_technicians` VALUES ('2', '52', null, '4', '1'), ('2', '56', null, '1', '2'), ('1', '53', null, null, '3');
COMMIT;

-- ----------------------------
--  Table structure for `_technicians_copy`
-- ----------------------------
DROP TABLE IF EXISTS `_technicians_copy`;
CREATE TABLE `_technicians_copy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `division_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `image` longblob,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `level` (`level`),
  KEY `division_id` (`division_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `_technicians_copy_ibfk_1` FOREIGN KEY (`division_id`) REFERENCES `_techmist_divisions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_technicians_copy_ibfk_2` FOREIGN KEY (`level`) REFERENCES `_technician_levels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_technicians_copy_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_technicians_copy`
-- ----------------------------
BEGIN;
INSERT INTO `_technicians_copy` VALUES ('1', '2', '56', null, '1'), ('4', '2', '52', null, '4');
COMMIT;

-- ----------------------------
--  Table structure for `_tm_account_types`
-- ----------------------------
DROP TABLE IF EXISTS `_tm_account_types`;
CREATE TABLE `_tm_account_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_tm_account_types`
-- ----------------------------
BEGIN;
INSERT INTO `_tm_account_types` VALUES ('1', 'technician'), ('2', 'designer'), ('3', 'admin'), ('4', 'r&d'), ('5', 'r&d_admin'), ('6', 'r&d_dev');
COMMIT;

-- ----------------------------
--  Table structure for `_treatmentCanaries`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentCanaries`;
CREATE TABLE `_treatmentCanaries` (
  `treatment_id` int(11) DEFAULT NULL,
  `canary_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `latitude` float(10,6) DEFAULT NULL,
  `longitude` float(10,6) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `canary_id` (`canary_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `t_loc_id` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tc_c_id` FOREIGN KEY (`canary_id`) REFERENCES `Canaries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tc_t_id` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatmentCanaries`
-- ----------------------------
BEGIN;
INSERT INTO `_treatmentCanaries` VALUES ('453', '22', '11', '49.098213', '-122.514114'), ('453', '26', '11', '49.098213', '-122.514114'), ('453', '24', '11', '49.098213', '-122.514114'), ('453', '25', '11', '49.098213', '-122.514114'), ('458', '22', '12', '49.043537', '-122.426750'), ('458', '27', '12', '49.043537', '-122.426750'), ('458', '28', '12', '49.043537', '-122.426750'), ('458', '26', '12', '49.043537', '-122.426750'), ('458', '24', '12', '49.043537', '-122.426750'), ('458', '25', '12', '49.043537', '-122.426750'), ('453', '28', '11', '49.098091', '-122.513771'), ('869', '13', '65', '49.044998', '-122.431999'), ('869', '27', '65', '49.044998', '-122.431999'), ('869', '33', '66', '49.044998', '-122.431999'), ('869', '29', '63', '49.044998', '-122.431999'), ('869', '22', '63', '49.044998', '-122.431999'), ('869', '36', '63', '49.044998', '-122.431999'), ('869', '28', '63', '49.044998', '-122.431999'), ('869', '30', '63', '49.044998', '-122.431999'), ('869', '35', '63', '49.044998', '-122.431999'), ('869', '26', '63', '49.044998', '-122.431999'), ('869', '24', '63', '49.044998', '-122.431999'), ('869', '25', '63', '49.044998', '-122.431999'), ('869', '31', '63', '49.044998', '-122.431999'), ('869', '6', '63', '49.044998', '-122.431999'), ('869', '34', '63', '49.044998', '-122.431999'), ('869', '37', '63', '49.044998', '-122.431999');
COMMIT;

-- ----------------------------
--  Table structure for `_treatmentCanaries_copy`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentCanaries_copy`;
CREATE TABLE `_treatmentCanaries_copy` (
  `treatment_id` int(11) DEFAULT NULL,
  `canary_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  `lat` float(10,6) DEFAULT NULL,
  `long` float(10,6) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `canary_id` (`canary_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `_treatmentcanaries_copy_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmentcanaries_copy_ibfk_2` FOREIGN KEY (`canary_id`) REFERENCES `Canaries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmentcanaries_copy_ibfk_3` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatmentCanaries_copy`
-- ----------------------------
BEGIN;
INSERT INTO `_treatmentCanaries_copy` VALUES ('453', '22', '11', '49.098213', '-122.514114'), ('453', '26', '11', '49.098213', '-122.514114'), ('453', '24', '11', '49.098213', '-122.514114'), ('453', '25', '11', '49.098213', '-122.514114'), ('458', '22', '12', '49.043537', '-122.426750'), ('458', '27', '12', '49.043537', '-122.426750'), ('458', '28', '12', '49.043537', '-122.426750'), ('458', '26', '12', '49.043537', '-122.426750'), ('458', '24', '12', '49.043537', '-122.426750'), ('458', '25', '12', '49.043537', '-122.426750');
COMMIT;

-- ----------------------------
--  Table structure for `_treatmentDates`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentDates`;
CREATE TABLE `_treatmentDates` (
  `treatment_id` varchar(255) NOT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`treatment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `_treatmentLocations`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentLocations`;
CREATE TABLE `_treatmentLocations` (
  `treatment_id` int(11) DEFAULT NULL,
  `location_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `location_id` (`location_id`),
  CONSTRAINT `lId` FOREIGN KEY (`location_id`) REFERENCES `_customerLocations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tId` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `_treatmentLocations`
-- ----------------------------
BEGIN;
INSERT INTO `_treatmentLocations` VALUES ('453', '11'), ('458', '12'), ('869', '65'), ('869', '66'), ('869', '63');
COMMIT;

-- ----------------------------
--  Table structure for `_treatmentQuoteServices`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentQuoteServices`;
CREATE TABLE `_treatmentQuoteServices` (
  `quote_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  KEY `quote_id` (`quote_id`),
  KEY `service_id` (`service_id`),
  CONSTRAINT `treat_quote_id` FOREIGN KEY (`quote_id`) REFERENCES `_treatmentQuotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `treat_srv_id` FOREIGN KEY (`service_id`) REFERENCES `_treatment_services` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentQuotes`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentQuotes`;
CREATE TABLE `_treatmentQuotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `service_notes` tinytext,
  `target_threshold` float DEFAULT NULL,
  `appliedBCU_per_hr` int(11) DEFAULT NULL,
  `min_BCU_cost` float DEFAULT NULL,
  `washing_cost` decimal(10,0) DEFAULT NULL,
  `travel_cost` decimal(10,0) DEFAULT NULL,
  `setup_staging_cost` decimal(10,0) DEFAULT NULL,
  `total_cost` decimal(10,0) DEFAULT NULL,
  `notes` tinytext,
  `quote_status_id` int(11) DEFAULT NULL,
  `xtra_details` tinytext,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `contact_id` (`contact_id`),
  KEY `quote_status_id` (`quote_status_id`),
  CONSTRAINT `quote_cnct_id` FOREIGN KEY (`contact_id`) REFERENCES `_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `quote_cust_id` FOREIGN KEY (`customer_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tq_id` FOREIGN KEY (`quote_status_id`) REFERENCES `_treatment_qoute_stats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentQuotes_history`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentQuotes_history`;
CREATE TABLE `_treatmentQuotes_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `contact_id` int(11) DEFAULT NULL,
  `service_notes` tinytext,
  `target_threshold` float DEFAULT NULL,
  `appliedBCU_per_hr` int(11) DEFAULT NULL,
  `min_BCU_cost` float DEFAULT NULL,
  `washing_cost` decimal(10,0) DEFAULT NULL,
  `travel_cost` decimal(10,0) DEFAULT NULL,
  `setup_staging_cost` decimal(10,0) DEFAULT NULL,
  `total_cost` decimal(10,0) DEFAULT NULL,
  `notes` tinytext,
  `quote_status_id` int(11) DEFAULT NULL,
  `xtra_details` tinytext,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `contact_id` (`contact_id`),
  KEY `quote_status_id` (`quote_status_id`),
  CONSTRAINT `_treatmentquotes_history_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `_contacts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmentquotes_history_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmentquotes_history_ibfk_3` FOREIGN KEY (`quote_status_id`) REFERENCES `_treatment_qoute_stats` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTables`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTables`;
CREATE TABLE `_treatmentTables` (
  `treatment_id` int(11) DEFAULT NULL,
  `treatment_table` varchar(255) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  CONSTRAINT `_treatmenttables_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatmentTables`
-- ----------------------------
BEGIN;
INSERT INTO `_treatmentTables` VALUES ('453', 'GD188_0001_1068055575_Main_G1_58'), ('453', 'GD188_0001_1068055575_Main_G1_58'), ('453', 'GD188_0001_1068055575_Main_G1_58'), ('453', 'GD188_0001_1068055575_Main_G1_58'), ('458', 'PD11RD3_0001_1068055573_Main_G1_58'), ('458', 'PD11RD3_0001_1068055573_Main_G1_58'), ('458', 'PD11RD3_0001_1068055573_Main_G1_58'), ('458', 'PD11RD3_0001_1068055573_Main_G1_58'), ('458', 'PD11RD3_0001_1068055573_Main_G1_58'), ('458', 'PD11RD3_0001_1068055573_Main_G1_58'), ('869', 'TT13_0008_1083558489_OUTSIDE_G1_52'), ('869', 'TT13_0008_1083558489_OUTSIDE_G1_30'), ('869', 'TT13_0008_1083558489_OUTSIDE2_G1_33'), ('869', 'TT13_0008_1083558489_MAIN_G1_26'), ('869', 'TT13_0008_1083558489_MAIN_G1_60'), ('869', 'TT13_0008_1083558489_MAIN_G1_59'), ('869', 'TT13_0008_1083558489_MAIN_G1_40'), ('869', 'TT13_0008_1083558489_MAIN_G1_63'), ('869', 'TT13_0008_1083558489_MAIN_G1_49'), ('869', 'TT13_0008_1083558489_MAIN_G1_55'), ('869', 'TT13_0008_1083558489_MAIN_G1_61'), ('869', 'TT13_0008_1083558489_MAIN_G1_58'), ('869', 'TT13_0008_1083558489_MAIN_G1_38'), ('869', 'TT13_0008_1083558489_MAIN_G1_28'), ('869', 'TT13_0008_1083558489_MAIN_G1_53'), ('869', 'TT13_0008_1083558489_MAIN_G1_34');
COMMIT;

-- ----------------------------
--  Table structure for `_treatmentTargetBacterias`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetBacterias`;
CREATE TABLE `_treatmentTargetBacterias` (
  `treatment_id` int(11) DEFAULT NULL,
  `bacteria_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`bacteria_id`),
  KEY `bacteria_id` (`bacteria_id`),
  CONSTRAINT `bacter_id` FOREIGN KEY (`bacteria_id`) REFERENCES `abatement_bacterials` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bt_id` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTargetFugals`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetFugals`;
CREATE TABLE `_treatmentTargetFugals` (
  `treatment_id` int(11) DEFAULT NULL,
  `fungal_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`fungal_id`),
  KEY `fungal_id` (`fungal_id`),
  CONSTRAINT `_treatmenttargetfugals_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fung_id` FOREIGN KEY (`fungal_id`) REFERENCES `abatement_fungals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTargetMildews`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetMildews`;
CREATE TABLE `_treatmentTargetMildews` (
  `treatment_id` int(11) DEFAULT NULL,
  `mildew_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`mildew_id`),
  KEY `mildew_id` (`mildew_id`),
  CONSTRAINT `_treatmenttargetmildews_ibfk_1` FOREIGN KEY (`mildew_id`) REFERENCES `abatement_mildews` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmenttargetmildews_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTargetMolds`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetMolds`;
CREATE TABLE `_treatmentTargetMolds` (
  `treatment_id` int(11) DEFAULT NULL,
  `mold_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`mold_id`),
  KEY `mold_id` (`mold_id`),
  CONSTRAINT `_treatmenttargetmolds_ibfk_1` FOREIGN KEY (`mold_id`) REFERENCES `abatement_molds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmenttargetmolds_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTargetPests`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetPests`;
CREATE TABLE `_treatmentTargetPests` (
  `treatment_id` int(11) DEFAULT NULL,
  `pest_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`pest_id`),
  CONSTRAINT `_treatmenttargetpests_ibfk_1` FOREIGN KEY (`pest_id`) REFERENCES `api_pests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `t_id` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTargetViroids`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetViroids`;
CREATE TABLE `_treatmentTargetViroids` (
  `treatment_id` int(11) DEFAULT NULL,
  `viroid_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`viroid_id`),
  KEY `viroid_id` (`viroid_id`),
  CONSTRAINT `_treatmenttargetviroids_ibfk_1` FOREIGN KEY (`viroid_id`) REFERENCES `abatement_viroids` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmenttargetviroids_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentTargetViruses`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentTargetViruses`;
CREATE TABLE `_treatmentTargetViruses` (
  `treatment_id` int(11) DEFAULT NULL,
  `virus_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `pest_id` (`virus_id`),
  KEY `virus_id` (`virus_id`),
  CONSTRAINT `_treatmenttargetviruses_ibfk_1` FOREIGN KEY (`virus_id`) REFERENCES `abatement_viruses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatmenttargetviruses_ibfk_2` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatmentThresholds`
-- ----------------------------
DROP TABLE IF EXISTS `_treatmentThresholds`;
CREATE TABLE `_treatmentThresholds` (
  `treatment_id` int(11) DEFAULT NULL,
  `threshold_id` int(11) DEFAULT NULL,
  KEY `treatment_id` (`treatment_id`),
  KEY `threshold_id` (`threshold_id`),
  CONSTRAINT `thresh_id` FOREIGN KEY (`threshold_id`) REFERENCES `_target_thresholds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `threst_t_id` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `_treatment_job_type`
-- ----------------------------
DROP TABLE IF EXISTS `_treatment_job_type`;
CREATE TABLE `_treatment_job_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatment_job_type`
-- ----------------------------
BEGIN;
INSERT INTO `_treatment_job_type` VALUES ('1', 'Greenhouse'), ('2', 'Poultry - Egg Layer Farm'), ('3', 'Poulty - Broiler Farm'), ('4', 'Poultry - Hatachery'), ('5', 'Poultry - Processing Facility'), ('6', 'Dairy Farm');
COMMIT;

-- ----------------------------
--  Table structure for `_treatment_qoute_stats`
-- ----------------------------
DROP TABLE IF EXISTS `_treatment_qoute_stats`;
CREATE TABLE `_treatment_qoute_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatment_qoute_stats`
-- ----------------------------
BEGIN;
INSERT INTO `_treatment_qoute_stats` VALUES ('1', 'Quote Sent'), ('2', 'Treatment Confirmed with PO');
COMMIT;

-- ----------------------------
--  Table structure for `_treatment_services`
-- ----------------------------
DROP TABLE IF EXISTS `_treatment_services`;
CREATE TABLE `_treatment_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatment_services`
-- ----------------------------
BEGIN;
INSERT INTO `_treatment_services` VALUES ('1', 'Washing'), ('2', 'Disinfection');
COMMIT;

-- ----------------------------
--  Table structure for `_treatment_statuses`
-- ----------------------------
DROP TABLE IF EXISTS `_treatment_statuses`;
CREATE TABLE `_treatment_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_treatment_statuses`
-- ----------------------------
BEGIN;
INSERT INTO `_treatment_statuses` VALUES ('1', 'Active'), ('2', 'Pending'), ('3', 'Dropped'), ('4', 'Complete'), ('5', 'Archived');
COMMIT;

-- ----------------------------
--  Table structure for `_treatments`
-- ----------------------------
DROP TABLE IF EXISTS `_treatments`;
CREATE TABLE `_treatments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatment_id` varchar(255) NOT NULL,
  `gateway_id` int(11) DEFAULT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `duration` float DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `tech_id` int(11) DEFAULT NULL,
  `latitude` float(10,6) DEFAULT NULL,
  `longitude` float(10,6) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `timeZone` varchar(255) DEFAULT NULL,
  `sunrise` timestamp NULL DEFAULT NULL,
  `sunset` timestamp NULL DEFAULT NULL,
  `moonPhase` decimal(4,2) DEFAULT NULL,
  `percipType` varchar(100) DEFAULT NULL,
  `precipIntensityMax` decimal(7,4) DEFAULT NULL,
  `precipIntensityMaxTime` timestamp NULL DEFAULT NULL,
  `temperatureHigh` decimal(5,2) DEFAULT NULL,
  `temperatureHighTime_forcast` timestamp NULL DEFAULT NULL,
  `temperatureHighTime_actual` timestamp NULL DEFAULT NULL,
  `temperatureLow` decimal(5,2) DEFAULT NULL,
  `temperatureLowTime_forcast` timestamp NULL DEFAULT NULL,
  `temperatureLowTime_actual` timestamp NULL DEFAULT NULL,
  `windGust` decimal(5,2) DEFAULT NULL,
  `windGustTime_forcast` timestamp NULL DEFAULT NULL,
  `windGustTime_actual` datetime DEFAULT NULL,
  `uvIndex` decimal(4,2) DEFAULT NULL,
  `uvIndexMaxTime_forcast` timestamp NULL DEFAULT NULL,
  `uvIndexMaxTime_actual` timestamp NULL DEFAULT NULL,
  `cloudCover_forcast` decimal(5,2) DEFAULT NULL,
  `cloudCover_actual` decimal(5,2) DEFAULT NULL,
  `ozone_forcast` decimal(5,2) DEFAULT NULL,
  `ozone_actual` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `treatId` (`treatment_id`) USING BTREE,
  KEY `gateway_id` (`gateway_id`),
  KEY `cust_id` (`cust_id`),
  KEY `tech_id` (`tech_id`),
  KEY `status_id` (`status_id`),
  KEY `times` (`start_time`,`end_time`,`duration`) USING BTREE,
  KEY `weatherSummaries` (`summary`) USING BTREE,
  KEY `tzs` (`timeZone`) USING BTREE,
  KEY `sunAndMoon` (`sunrise`,`sunset`,`moonPhase`) USING BTREE,
  KEY `percip` (`percipType`,`precipIntensityMax`,`precipIntensityMaxTime`) USING BTREE,
  KEY `temp` (`temperatureHigh`,`temperatureHighTime_forcast`,`temperatureHighTime_actual`,`temperatureLow`,`temperatureLowTime_forcast`,`temperatureLowTime_actual`) USING BTREE,
  KEY `wind` (`windGust`,`windGustTime_forcast`) USING BTREE,
  KEY `uv` (`uvIndex`,`uvIndexMaxTime_forcast`,`uvIndexMaxTime_actual`) USING BTREE,
  KEY `clouds` (`cloudCover_forcast`,`cloudCover_actual`) USING BTREE,
  KEY `o3` (`ozone_forcast`,`ozone_actual`) USING BTREE,
  CONSTRAINT `__stat_id` FOREIGN KEY (`status_id`) REFERENCES `_treatment_statuses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_ibfk_2` FOREIGN KEY (`gateway_id`) REFERENCES `gateways` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_ibfk_3` FOREIGN KEY (`tech_id`) REFERENCES `_technicians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=870 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `_treatments`
-- ----------------------------
BEGIN;
INSERT INTO `_treatments` VALUES ('453', 'GD188_0001_1068055575', '5', '1', '2019-03-01 14:55:23', null, null, '4', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('458', 'PD11RD3_0001_1068055573', '5', '2', '2019-03-02 11:52:48', null, null, '4', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('459', 'PipeTest4_0001_0000000000', '5', '9', '2019-03-08 16:52:02', '2019-03-11 15:27:23', '62.57', '4', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('611', 'TT42_0001_1083558489', '5', '11', '2019-05-03 14:51:28', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('612', 'TT43_0001_1083558489', '5', '11', '2019-05-03 15:21:19', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('613', 'TT44_0001_1083558489', '6', '11', '2019-05-03 15:36:29', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('614', 'TT45_0001_1083558489', '6', '11', '2019-05-03 15:49:43', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('615', 'TT46_0001_1083558489', '7', '11', '2019-05-03 16:14:36', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('869', 'TT13_0008_1083558489', '5', '11', '2019-05-13 18:02:15', null, null, '1', '2', '49.086102', '-122.402603', 'Mostly cloudy throughout the day.', 'America/Vancouver', '2019-05-13 05:30:55', '2019-05-13 08:43:46', '0.32', 'rain', '0.0279', '2019-05-13 06:00:00', '17.59', '2019-05-13 03:00:00', null, '9.37', '2019-05-14 05:00:00', null, '3.76', '2019-05-13 12:00:00', null, '4.00', '2019-05-13 11:00:00', null, '0.59', null, '339.74', null);
COMMIT;

-- ----------------------------
--  Table structure for `_treatments_copy`
-- ----------------------------
DROP TABLE IF EXISTS `_treatments_copy`;
CREATE TABLE `_treatments_copy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatment_id` varchar(255) NOT NULL,
  `gateway_id` int(11) DEFAULT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NULL DEFAULT NULL,
  `duration` float DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `tech_id` int(11) DEFAULT NULL,
  `latitude` float(10,6) DEFAULT NULL,
  `longitude` float(10,6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `treatId` (`treatment_id`) USING BTREE,
  KEY `gateway_id` (`gateway_id`),
  KEY `cust_id` (`cust_id`),
  KEY `tech_id` (`tech_id`),
  KEY `status_id` (`status_id`),
  KEY `times` (`start_time`,`end_time`,`duration`) USING BTREE,
  CONSTRAINT `_treatments_copy_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `_treatment_statuses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_copy_ibfk_2` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_copy_ibfk_3` FOREIGN KEY (`gateway_id`) REFERENCES `gateways` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_copy_ibfk_4` FOREIGN KEY (`tech_id`) REFERENCES `_technicians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=544 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `_treatments_copy`
-- ----------------------------
BEGIN;
INSERT INTO `_treatments_copy` VALUES ('453', 'GD188_0001_1068055575', '5', '1', '2019-03-01 14:55:23', null, null, '4', '2', null, null), ('458', 'PD11RD3_0001_1068055573', '5', '2', '2019-03-02 11:52:48', null, null, '4', '2', null, null), ('459', 'PipeTest4_0001_0000000000', '5', '9', '2019-03-08 16:52:02', '2019-03-11 15:27:23', '62.57', '4', '2', null, null), ('543', 'TT49_0031_1083558489', '5', '11', '2019-05-04 07:55:46', null, null, '1', '2', '49.086102', '-122.402603');
COMMIT;

-- ----------------------------
--  Table structure for `_treatments_copy2`
-- ----------------------------
DROP TABLE IF EXISTS `_treatments_copy2`;
CREATE TABLE `_treatments_copy2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatment_id` varchar(255) NOT NULL,
  `gateway_id` int(11) DEFAULT NULL,
  `cust_id` int(11) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `duration` float DEFAULT NULL,
  `status_id` int(11) DEFAULT NULL,
  `tech_id` int(11) DEFAULT NULL,
  `latitude` float(10,6) DEFAULT NULL,
  `longitude` float(10,6) DEFAULT NULL,
  `summary` varchar(255) DEFAULT NULL,
  `timeZone` varchar(255) DEFAULT NULL,
  `sunrise` timestamp NULL DEFAULT NULL,
  `sunset` timestamp NULL DEFAULT NULL,
  `moonPhase` decimal(4,2) DEFAULT NULL,
  `percipType` varchar(100) DEFAULT NULL,
  `precipIntensityMax` decimal(7,4) DEFAULT NULL,
  `precipIntensityMaxTime` timestamp NULL DEFAULT NULL,
  `temperatureHigh` decimal(5,2) DEFAULT NULL,
  `temperatureHighTime_forcast` timestamp NULL DEFAULT NULL,
  `temperatureHighTime_actual` timestamp NULL DEFAULT NULL,
  `temperatureLow` decimal(5,2) DEFAULT NULL,
  `temperatureLowTime_forcast` timestamp NULL DEFAULT NULL,
  `temperatureLowTime_actual` timestamp NULL DEFAULT NULL,
  `windGust` decimal(5,2) DEFAULT NULL,
  `windGustTime_forcast` timestamp NULL DEFAULT NULL,
  `windGustTime_actual` datetime DEFAULT NULL,
  `uvIndex` decimal(4,2) DEFAULT NULL,
  `uvIndexMaxTime_forcast` timestamp NULL DEFAULT NULL,
  `uvIndexMaxTime_actual` timestamp NULL DEFAULT NULL,
  `cloudCover_forcast` decimal(5,2) DEFAULT NULL,
  `cloudCover_actual` decimal(5,2) DEFAULT NULL,
  `ozone_forcast` decimal(5,2) DEFAULT NULL,
  `ozone_actual` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `treatId` (`treatment_id`) USING BTREE,
  KEY `gateway_id` (`gateway_id`),
  KEY `cust_id` (`cust_id`),
  KEY `tech_id` (`tech_id`),
  KEY `status_id` (`status_id`),
  KEY `times` (`start_time`,`end_time`,`duration`) USING BTREE,
  KEY `weatherSummaries` (`summary`) USING BTREE,
  KEY `tzs` (`timeZone`) USING BTREE,
  KEY `sunAndMoon` (`sunrise`,`sunset`,`moonPhase`) USING BTREE,
  KEY `percip` (`percipType`,`precipIntensityMax`,`precipIntensityMaxTime`) USING BTREE,
  KEY `temp` (`temperatureHigh`,`temperatureHighTime_forcast`,`temperatureHighTime_actual`,`temperatureLow`,`temperatureLowTime_forcast`,`temperatureLowTime_actual`) USING BTREE,
  KEY `wind` (`windGust`,`windGustTime_forcast`) USING BTREE,
  KEY `uv` (`uvIndex`,`uvIndexMaxTime_forcast`,`uvIndexMaxTime_actual`) USING BTREE,
  KEY `clouds` (`cloudCover_forcast`,`cloudCover_actual`) USING BTREE,
  KEY `o3` (`ozone_forcast`,`ozone_actual`) USING BTREE,
  CONSTRAINT `_treatments_copy2_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `_treatment_statuses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_copy2_ibfk_2` FOREIGN KEY (`cust_id`) REFERENCES `_customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_copy2_ibfk_3` FOREIGN KEY (`gateway_id`) REFERENCES `gateways` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_treatments_copy2_ibfk_4` FOREIGN KEY (`tech_id`) REFERENCES `_technicians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=867 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `_treatments_copy2`
-- ----------------------------
BEGIN;
INSERT INTO `_treatments_copy2` VALUES ('453', 'GD188_0001_1068055575', '5', '1', '2019-03-01 14:55:23', null, null, '4', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('458', 'PD11RD3_0001_1068055573', '5', '2', '2019-03-02 11:52:48', null, null, '4', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('459', 'PipeTest4_0001_0000000000', '5', '9', '2019-03-08 16:52:02', '2019-03-11 15:27:23', '62.57', '4', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('611', 'TT42_0001_1083558489', '5', '11', '2019-05-03 14:51:28', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('612', 'TT43_0001_1083558489', '5', '11', '2019-05-03 15:21:19', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('613', 'TT44_0001_1083558489', '6', '11', '2019-05-03 15:36:29', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('614', 'TT45_0001_1083558489', '6', '11', '2019-05-03 15:49:43', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('615', 'TT46_0001_1083558489', '7', '11', '2019-05-03 16:14:36', null, null, '3', '2', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null), ('866', 'TT13_0008_1083558489', '5', '11', '2019-05-13 17:52:26', '2019-05-13 05:55:00', '0.04', '4', '2', '49.086102', '-122.402603', 'Mostly cloudy throughout the day.', 'America/Vancouver', '2019-05-13 05:30:55', '2019-05-13 08:43:46', '0.32', 'rain', '0.0279', '2019-05-13 06:00:00', '17.59', '2019-05-13 03:00:00', null, '9.37', '2019-05-14 05:00:00', null, '3.76', '2019-05-13 12:00:00', null, '4.00', '2019-05-13 11:00:00', null, '0.59', null, '339.74', null);
COMMIT;

-- ----------------------------
--  Table structure for `_users`
-- ----------------------------
DROP TABLE IF EXISTS `_users`;
CREATE TABLE `_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) CHARACTER SET latin1 NOT NULL,
  `last_name` varchar(60) CHARACTER SET latin1 NOT NULL,
  `email` varchar(75) CHARACTER SET latin1 NOT NULL,
  `password` char(60) CHARACTER SET latin1 NOT NULL,
  `account_type` enum('technician','designer','admin','r&d','r&d_admin','r&d_dev') CHARACTER SET latin1 NOT NULL DEFAULT 'technician',
  `loggedIn` int(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resetToken` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `_users`
-- ----------------------------
BEGIN;
INSERT INTO `_users` VALUES ('50', 'Menno', 'Koehoorn', 'menno@techmist.com', '$2a$10$Ip7LyImwDLR/JXu1NNj4.OrJQe0wUZYbaW3p1/PsiwgQ6Ip.z6Q1u', 'admin', '1', '2019-02-22 16:15:06', null, '2019-04-14 10:56:55'), ('52', 'Joe', 'Haddad', 'joeh15ss@gmail.com', '$2a$10$CCzV3ZXCzhyx33.mi4E0YOpzCcAP558vjxx7SV9HWRc73FNzObSoy', 'r&d_dev', '1', '2019-04-03 16:09:01', null, '2019-04-14 10:56:55'), ('53', 'Nathan', 'Koetjes', 'nathan@techmist.com', '$2a$10$XKDOK6cqZ6U0JpF8eYzwEuUTfnZwS3s8rILVTXu70iR2Ij2Vy.D86', 'admin', '0', '2019-04-03 17:51:59', null, '2019-04-14 10:56:55'), ('54', 'David', 'Floren', 'david@techmist.com', '$2a$10$cqCjmudlkNAZnw3Opi1Tr.RvgiqYVd7F4DAE2628nWkkljB/EC8dW', 'r&d', '1', '2019-04-04 21:11:56', null, '2019-04-14 10:56:55'), ('56', 'default ', 'tech', 'test@techmist.com', '$2a$10$HYJTL/voHPXH8UEnUMRC6OWScO9a3ElCdQ/f.X81KiVxOuvxbRt9e', 'technician', '0', '2019-04-08 14:50:07', null, '2019-04-14 10:56:55'), ('57', 'testing', 'test', 'test1@techmist.com', '$2a$10$yvqZAkiRgUuogl.1Hq5qn..GfvZbkX7RP5zPOfw9Qh41Z.lQec5R2', 'admin', '1', '2019-04-23 07:32:30', null, '2019-04-23 07:32:30'), ('58', 'Sheldon', 'Boyd', 'sheldon@techmist.com', '$2a$10$guMCW/N78w/WsRf6R31zK.tLk8IJY9nq.E7oGtknheqnfrEmxbwju', 'designer', '1', '2019-04-30 19:30:20', null, '2019-04-30 19:30:20');
COMMIT;

-- ----------------------------
--  Table structure for `_users_history`
-- ----------------------------
DROP TABLE IF EXISTS `_users_history`;
CREATE TABLE `_users_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(60) CHARACTER SET latin1 NOT NULL,
  `last_name` varchar(60) CHARACTER SET latin1 NOT NULL,
  `email` varchar(75) CHARACTER SET latin1 NOT NULL,
  `password` char(60) CHARACTER SET latin1 NOT NULL,
  `account_type` enum('technician','designer','admin','r&d','r&d_admin','r&d_dev') CHARACTER SET latin1 NOT NULL DEFAULT 'technician',
  `loggedIn` int(1) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resetToken` varchar(150) CHARACTER SET latin1 DEFAULT NULL,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Table structure for `abatement_bacterials`
-- ----------------------------
DROP TABLE IF EXISTS `abatement_bacterials`;
CREATE TABLE `abatement_bacterials` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) DEFAULT '0.00',
  `status` enum('approved','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fungal_type` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatement_bacterials`
-- ----------------------------
BEGIN;
INSERT INTO `abatement_bacterials` VALUES ('1', 'Erwinia', '0.01', 'approved'), ('2', 'Pseudomonas', '0.00', 'approved'), ('3', 'Ralstonia', '0.00', 'approved'), ('4', 'Xanthomonas', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `abatement_fungals`
-- ----------------------------
DROP TABLE IF EXISTS `abatement_fungals`;
CREATE TABLE `abatement_fungals` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) DEFAULT '0.00',
  `status` enum('approved','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fungal_type` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatement_fungals`
-- ----------------------------
BEGIN;
INSERT INTO `abatement_fungals` VALUES ('1', 'Botrytis (Gray Mold) ', '0.02', 'approved'), ('2', 'Fusarium ', '0.00', 'approved'), ('3', 'Phythopthora ', '0.00', 'approved'), ('4', 'Pythium ', '0.00', 'approved'), ('5', 'Rhizoctonia ', '0.00', 'approved'), ('6', 'Thielaviopsis ', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `abatement_mildews`
-- ----------------------------
DROP TABLE IF EXISTS `abatement_mildews`;
CREATE TABLE `abatement_mildews` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) DEFAULT '0.00',
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mildew_types` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatement_mildews`
-- ----------------------------
BEGIN;
INSERT INTO `abatement_mildews` VALUES ('1', 'Mosaic Virus ', '0.00', 'approved'), ('2', 'Powdery mildew ', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `abatement_molds`
-- ----------------------------
DROP TABLE IF EXISTS `abatement_molds`;
CREATE TABLE `abatement_molds` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `mold_types` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatement_molds`
-- ----------------------------
BEGIN;
INSERT INTO `abatement_molds` VALUES ('1', 'Aspergillus Flavus ', '0.00', 'approved'), ('2', 'Aspergillus Fumigatus  ', '0.00', 'approved'), ('3', 'Aspergillus Niger  ', '0.00', 'approved'), ('4', 'Aureobasidium Pullulans ', '0.00', 'approved'), ('5', 'Aspergillus Repens ', '0.00', 'approved'), ('6', 'Aspergillus Versicolor ', '0.00', 'approved'), ('7', 'Chaetomium Globosum ', '0.00', 'approved'), ('8', 'Cladosporium Cladosporioides ', '0.00', 'approved'), ('9', 'Cladosporium Sphaerospermum', '0.00', 'approved'), ('10', 'Doratomyces Spp ', '0.00', 'approved'), ('11', 'Fusarium Spp ', '0.00', 'approved'), ('12', 'Penicillium Aurantiogriseum ', '0.00', 'approved'), ('13', 'Penicillium Chrysogenum ', '0.00', 'approved'), ('14', 'Scopulariopsis Spp ', '0.00', 'approved'), ('15', 'Stachybotrys Chartarum ', '0.00', 'approved'), ('16', 'Trichoderma Spp ', '0.00', 'approved'), ('17', 'Ulocladium Botrytis ', '0.00', 'approved'), ('18', 'Ulocladium Spp. ', '0.00', 'approved'), ('19', 'Wallemia Sebi ', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `abatement_viroids`
-- ----------------------------
DROP TABLE IF EXISTS `abatement_viroids`;
CREATE TABLE `abatement_viroids` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) NOT NULL DEFAULT '0.00',
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `viroid_type` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatement_viroids`
-- ----------------------------
BEGIN;
INSERT INTO `abatement_viroids` VALUES ('1', 'Apscaviroid', '0.00', 'approved'), ('2', 'Hostuviroid ', '0.00', 'approved'), ('3', 'Pelamoviroid  ', '0.00', 'approved'), ('4', 'Pospiviroid', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `abatement_viruses`
-- ----------------------------
DROP TABLE IF EXISTS `abatement_viruses`;
CREATE TABLE `abatement_viruses` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) DEFAULT '0.00',
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `virus_types` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatement_viruses`
-- ----------------------------
BEGIN;
INSERT INTO `abatement_viruses` VALUES ('1', 'Tospoviruses ', null, 'approved'), ('2', 'Mosaic Virus ', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `abatements_bacteria`
-- ----------------------------
DROP TABLE IF EXISTS `abatements_bacteria`;
CREATE TABLE `abatements_bacteria` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `c_value` decimal(5,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `bacteria_type` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `abatements_bacteria`
-- ----------------------------
BEGIN;
INSERT INTO `abatements_bacteria` VALUES ('1', 'Erwinia', null, 'approved'), ('2', 'Pseudomonas', null, 'approved'), ('3', 'Ralstonia', null, 'approved'), ('4', 'Xanthomonas ', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_abatements`
-- ----------------------------
DROP TABLE IF EXISTS `api_abatements`;
CREATE TABLE `api_abatements` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `abatement` varchar(255) NOT NULL,
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `abtement_type` (`abatement`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_abatements`
-- ----------------------------
BEGIN;
INSERT INTO `api_abatements` VALUES ('1', 'bacterial', 'approved'), ('2', 'fungal', 'approved'), ('3', 'mildew', 'approved'), ('4', 'mold', 'approved'), ('5', 'viroid', 'approved'), ('6', 'virus', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_cleanup_types`
-- ----------------------------
DROP TABLE IF EXISTS `api_cleanup_types`;
CREATE TABLE `api_cleanup_types` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_cleanup_types`
-- ----------------------------
BEGIN;
INSERT INTO `api_cleanup_types` VALUES ('1', 'Blood ', 'approved'), ('2', 'Non-Blood Borne Organics ', 'approved'), ('3', 'Toxic Irritants ', 'approved'), ('4', 'Biohazar', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_disinfections`
-- ----------------------------
DROP TABLE IF EXISTS `api_disinfections`;
CREATE TABLE `api_disinfections` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `disinfection` varchar(255) NOT NULL,
  `sectors` varchar(255) DEFAULT NULL,
  `status` enum('approved','pending','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_disinfections`
-- ----------------------------
BEGIN;
INSERT INTO `api_disinfections` VALUES ('1', 'air conditioning', 'Agricultural,Residential', 'approved'), ('2', 'air ducts', 'Industrial,Residential', 'approved'), ('3', 'stairwell', 'Industrial,Residential', 'approved'), ('4', 'freight elevator', 'Industrial,Residential', 'approved'), ('5', 'Elevator', 'All', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_co2`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_co2`;
CREATE TABLE `api_gh_co2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `system` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_co2`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_co2` VALUES ('1', 'Boiler Stack Recovery System', null, 'approved'), ('2', 'Combustion', null, 'approved'), ('3', 'Liquid CO2', null, 'approved'), ('4', 'Natural gas CO2 Generators', null, 'approved'), ('5', 'None', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_covering`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_covering`;
CREATE TABLE `api_gh_covering` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `covering` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_covering`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_covering` VALUES ('1', 'Glass Panels', null, 'approved'), ('2', 'Polycarbonate Panels', null, 'approved'), ('3', 'Polythene Skins', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_design`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_design`;
CREATE TABLE `api_gh_design` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `design` varchar(100) NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `design_name` (`design`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_design`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_design` VALUES ('2', 'Ridge-and-Furrow (gutter-connected)', 'Single stand-alone structure or combined side-to-side, the interior walls are usually absent. Most commercial greenhouses now utilize some variation of the gutter-connected design.', null, 'approved'), ('3', 'The sawtooth', 'An uneven span, is more common in high temperature locations and those places that receive prevailing winds since the design allows for improved movement of hot air out of the greenhouse roof vents.', null, 'approved'), ('4', 'Lean-To ', 'Most commonly used by homeowners and the geodesic dome is most often used by botanical centers. Some botanical center conservatories have elaborate cylindrical, arched or Victorian designs.', null, 'approved'), ('5', 'Quonset', 'Based upon an arched roof. The arched roof allows stresses on the structure to be efﬁ ciently transferred down to the ground.', null, 'approved'), ('15', 'A-Frame', 'A series of supporting trusses that form the roof and gables. The strength of this structure primarily comes from the trusses set on vertical walls.', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_floor`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_floor`;
CREATE TABLE `api_gh_floor` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `floor` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_floor`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_floor` VALUES ('1', 'Bark Chips/ WoodChips/ Sawdust', '0.01', 'approved'), ('2', 'Compact Clay/Fabric', null, 'approved'), ('3', 'Concrete (Porous) ', '9.00', 'approved'), ('4', 'Concrete (Portland)', '9.00', 'approved'), ('5', 'Gravel', null, 'approved'), ('6', 'Stone', null, 'approved'), ('7', 'Wood', null, 'approved'), ('8', 'Fabric', '3.00', 'approved'), ('9', 'Plastic', '1.00', 'approved'), ('10', 'Dirt', '21.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_frame`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_frame`;
CREATE TABLE `api_gh_frame` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `frame` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_frame`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_frame` VALUES ('2', 'Steel', '0.00', 'approved'), ('3', 'Wood', '0.00', 'approved'), ('5', 'Aluminum', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_growMedia`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_growMedia`;
CREATE TABLE `api_gh_growMedia` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `media` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_growMedia`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_growMedia` VALUES ('1', 'Coco Bags 1/4', '3.00', 'approved'), ('2', 'Coco Bags 1/2', '6.00', 'approved'), ('3', 'Coco Bags 3/4', '9.00', 'approved'), ('4', 'Coco Bags in all', '12.00', 'approved'), ('5', 'Rockwool Bags', '3.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_gutter`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_gutter`;
CREATE TABLE `api_gh_gutter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gutter` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_gutter`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_gutter` VALUES ('1', 'Stand-Alone', null, 'approved'), ('2', 'Ridge-and-Furrow', null, 'approved'), ('4', 'Gutter-Connected', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_heating`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_heating`;
CREATE TABLE `api_gh_heating` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `system` varchar(100) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_heating`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_heating` VALUES ('2', 'Forced Air ', null, 'approved'), ('3', 'Both ', null, 'approved'), ('4', 'Boiler Heat ', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_misc`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_misc`;
CREATE TABLE `api_gh_misc` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `obj` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_misc`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_misc` VALUES ('6', 'Yellow Sticker Tape', '2.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_power`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_power`;
CREATE TABLE `api_gh_power` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source` int(3) NOT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `design` (`source`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_power`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_power` VALUES ('3', '110', 'approved'), ('4', '220', 'approved'), ('5', '208', 'approved'), ('6', '240', 'approved'), ('7', '460', 'approved'), ('8', '600', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_screen_types`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_screen_types`;
CREATE TABLE `api_gh_screen_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `screen` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_screen_types`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_screen_types` VALUES ('1', 'open weave', null, 'approved'), ('2', 'closed weave', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_screens`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_screens`;
CREATE TABLE `api_gh_screens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `design` (`state`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_screens`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_screens` VALUES ('1', 'full', '1.00', 'approved'), ('2', '3 quarter', '0.75', 'approved'), ('3', 'two  thirds', '0.66', 'approved'), ('6', 'half', '0.50', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gh_ventilation`
-- ----------------------------
DROP TABLE IF EXISTS `api_gh_ventilation`;
CREATE TABLE `api_gh_ventilation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ventilation` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gh_ventilation`
-- ----------------------------
BEGIN;
INSERT INTO `api_gh_ventilation` VALUES ('1', 'Forced Air', null, 'approved'), ('2', 'Ridge or Gutter Vents', null, 'approved'), ('3', 'None', null, 'approved'), ('4', 'dcf', '1.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `api_gr_crops`
-- ----------------------------
DROP TABLE IF EXISTS `api_gr_crops`;
CREATE TABLE `api_gr_crops` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `crop` varchar(255) NOT NULL,
  `c_value` decimal(4,2) DEFAULT NULL,
  `status` enum('approved','pending') NOT NULL DEFAULT 'approved',
  `appIcon` enum('active','required','pending') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `crop` (`crop`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_gr_crops`
-- ----------------------------
BEGIN;
INSERT INTO `api_gr_crops` VALUES ('1', 'cucumber', '0.00', 'approved', 'active'), ('2', 'lettuce', '0.00', 'approved', 'active'), ('3', 'peppers', '0.00', 'approved', 'active'), ('4', 'tomtoes', '0.00', 'approved', 'active'), ('5', 'flowers', '0.00', 'approved', 'active'), ('6', 'cannabis', '0.01', 'approved', 'active');
COMMIT;

-- ----------------------------
--  Table structure for `api_pests`
-- ----------------------------
DROP TABLE IF EXISTS `api_pests`;
CREATE TABLE `api_pests` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `pest` varchar(255) NOT NULL,
  `sectors` varchar(255) DEFAULT NULL,
  `c_value` decimal(5,2) DEFAULT NULL,
  `status` enum('approved','pending','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_pests`
-- ----------------------------
BEGIN;
INSERT INTO `api_pests` VALUES ('1', 'Ants', 'All', '0.00', 'approved'), ('2', 'Bed bugs', 'Industrial,Residential', '0.00', 'approved'), ('3', 'caterpillars', 'Residential', '0.00', 'approved'), ('4', 'cochroches', 'All', '0.00', 'approved'), ('5', 'darkling beetle', 'Agricultural', '0.00', 'approved'), ('6', 'house fly', 'All', '0.00', 'approved'), ('7', 'moth', 'All', '0.00', 'approved'), ('8', 'picudo beetle', 'Agricultural', '0.00', 'approved'), ('9', 'rodents', 'All', '0.00', 'approved'), ('10', 'Silverfish', 'All', '0.00', 'approved'), ('11', 'spider', 'All', '0.00', 'approved'), ('12', 'termites', 'All', '0.00', 'approved'), ('16', 'Whitefly', 'Agricultural', '0.00', 'approved'), ('17', 'Thrips', 'Agricultural', '0.00', 'approved'), ('18', 'Spidermite', 'Agricultural', '0.00', 'approved'), ('22', 'test', 'Agricultural', '0.00', 'pending');
COMMIT;

-- ----------------------------
--  Table structure for `api_techmist_industries`
-- ----------------------------
DROP TABLE IF EXISTS `api_techmist_industries`;
CREATE TABLE `api_techmist_industries` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `industry` varchar(255) DEFAULT NULL,
  `status` enum('active','deleted') DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `api_techmist_industries`
-- ----------------------------
BEGIN;
INSERT INTO `api_techmist_industries` VALUES ('1', 'Greenhouse-Vegetable', 'active'), ('2', 'Greenhouse-Flowers', 'active'), ('3', 'Greenhouse-Other', 'active'), ('4', 'Poultry', 'active'), ('5', 'Dairy', 'active'), ('6', 'Other', 'active'), ('7', 'Rocky', 'deleted'), ('8', 'Supplier', 'active'), ('9', 'Internal', 'deleted'), ('10', 'Cannabis', 'active');
COMMIT;

-- ----------------------------
--  Table structure for `calibrations`
-- ----------------------------
DROP TABLE IF EXISTS `calibrations`;
CREATE TABLE `calibrations` (
  `calibration_id` int(11) NOT NULL AUTO_INCREMENT,
  `canary_id` int(11) DEFAULT NULL,
  `canary_temp_divisor` varchar(8) DEFAULT NULL,
  `canary_temp_modifier` varchar(8) DEFAULT NULL,
  `node_id` varchar(255) DEFAULT NULL,
  `temp_divisor` varchar(8) NOT NULL,
  `temp_modifier` varchar(8) NOT NULL,
  `humidity_divisor` varchar(8) NOT NULL,
  `humidity_modifier` varchar(8) NOT NULL,
  `pressure_divisor` varchar(8) NOT NULL,
  `pressure_modifier` varchar(8) NOT NULL,
  `UV_divisor` varchar(8) NOT NULL,
  `UV_modifier` varchar(8) NOT NULL,
  `CdS_divisor` varchar(8) NOT NULL,
  `CdS_modifier` varchar(8) NOT NULL,
  `CO2_divisor` varchar(8) NOT NULL,
  `CO2_modifier` varchar(8) NOT NULL,
  `O2_divisor` varchar(8) NOT NULL,
  `O2_modifier` varchar(8) NOT NULL,
  `VOC_divisor` varchar(8) NOT NULL,
  `VOC_modifier` varchar(8) NOT NULL,
  `NH3_divisor` varchar(8) NOT NULL,
  `NH3_modifier` varchar(8) NOT NULL,
  `CH4_divisor` varchar(8) DEFAULT NULL,
  `CH4_modifier` varchar(8) DEFAULT NULL,
  `CO_divisor` varchar(8) NOT NULL,
  `CO_modifier` varchar(8) NOT NULL,
  `SR1_divisor` varchar(8) NOT NULL,
  `SR1_modifier` varchar(8) NOT NULL,
  `SR2_divisor` varchar(8) NOT NULL,
  `SR2_modifier` varchar(8) NOT NULL,
  `SR3_divisor` varchar(8) NOT NULL,
  `SR3_modifier` varchar(8) NOT NULL,
  `dB_divisor` varchar(8) DEFAULT NULL,
  `dB_modifier` varchar(8) DEFAULT NULL,
  `calibrated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`calibration_id`),
  KEY `canary_id` (`canary_id`),
  CONSTRAINT `cal_cnry_id` FOREIGN KEY (`canary_id`) REFERENCES `Canaries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `calibrations`
-- ----------------------------
BEGIN;
INSERT INTO `calibrations` VALUES ('31', '26', null, null, 'C8E9FC5', '1.00', '-2.31', '1', '33', '1.00351', '0', '1', '0', '1', '0', '1', '0', '9.85', '-64.2', '204.75', '0', '3.7', '0', null, null, '19.9', '0', '56.131', '-36.4', '59.343', '-34.3', '140.1', '-3.2', null, null, '2019-03-01 21:20:10'), ('32', '22', null, null, 'C8E9EB0', '1.00', '-3.00', '1', '34', '1.00351', '0', '1', '0', '1', '0', '1', '0', '10', '-229.7', '204.75', '0', '19.05', '0', null, null, '27.7', '0', '54.015', '-37.8', '51.387', '-39.6', '20.1', '-23.8', null, null, '2019-03-01 21:24:58'), ('33', '24', null, null, 'C8EA926', '1.00', '-2.37', '1', '33', '1.00341', '0', '1', '0', '1', '0', '1', '0', '10', '-243.2', '203.95', '0', '40.25', '0', null, null, '29.9', '0', '65.62', '-31.5', '36.13', '-56.8', '323.61', '-2', null, null, '2019-03-01 21:27:26'), ('34', '25', null, null, 'C8EA96B', '1.00', '-3.30', '1', '35', '1.00371', '0', '1', '0', '1', '0', '1', '0', '10', '-235.5', '204.75', '0', '68.6', '0', null, null, '26.6', '0', '51.241', '-39.5', '39.343', '-51.1', '20.1', '-18.1', null, null, '2019-03-01 21:29:26'), ('35', '27', null, null, 'C8E9EC2', '1.00', '0.00', '1', '32', '1.00341', '0', '1', '0', '1', '0', '1', '165', '20', '-114.1', '203.95', '0.9', '40.25', '-10.9', null, null, '19.9', '-4.4', '73.125', '-28.1', '72.656', '-28.3', '323.61', '-2', null, null, '2019-03-21 15:57:25'), ('36', '28', null, null, 'C8E9F92', '1.00', '-0.60', '1', '33', '1.0030', '0', '1', '0', '1', '0', '1', '132', '20', '2.7', '204.75', '0', '20.25', '0.6', null, null, '19.9', '-16.1', '46.875', '-44.2', '57.969', '-35.6', '140.1', '-3.2', null, null, '2019-03-21 16:00:57'), ('37', '30', null, null, 'C8E9F96', '1.00', '-0.10', '1', '32', '1.00351', '0', '1', '0', '1', '0', '1', '165', '20', '-113.7', '204.75', '0', '20.25', '-26.2', null, null, '19.9', '-11.7', '54.375', '-37.7', '13.593', '-149.9', '140.1', '-3.2', null, null, '2019-03-21 16:04:06'), ('39', '31', null, null, 'C8E9EB2', '1.00', '0.60', '1', '32', '1.00371', '0', '1', '0', '1', '0', '1', '119', '20', '-105.5', '204.75', '0.9', '20.25', '-4.2', null, null, '19.9', '-16.8', '50.75', '-40', '56.89', '-36', '140', '-3', null, null, '2019-03-21 16:09:59'), ('40', '32', null, null, 'C8E9FB2', '1.00', '-0.30', '1', '33', '1.00271', '0', '1', '0', '1', '0', '1', '0', '20.85', '-104.3', '204.75', '0', '20.25', '-3.8', null, null, '19.9', '-6.5', '53.28', '-38.4', '57.5', '-30.9', '140.1', '-3.2', null, null, '2019-03-21 16:13:23'), ('41', '29', null, null, 'C8E9EA2', '1.00', '-5.90', '1', '45', '1.00351', '0', '1', '0', '1', '0', '1', '140', '20.85', '-92.6', '204.75', '0', '20.25', '0.7', null, null, '19.9', '0.2', '57.97', '-35', '49.22', '-41.7', '20.1', '-17.8', null, null, '2019-03-29 15:25:18');
COMMIT;

-- ----------------------------
--  Table structure for `calibrations_history`
-- ----------------------------
DROP TABLE IF EXISTS `calibrations_history`;
CREATE TABLE `calibrations_history` (
  `calibration_id` int(11) NOT NULL AUTO_INCREMENT,
  `canary_id` int(11) DEFAULT NULL,
  `canary_temp_divisor` varchar(8) DEFAULT NULL,
  `canary_temp_modifier` varchar(8) DEFAULT NULL,
  `node_id` varchar(255) DEFAULT NULL,
  `temp_divisor` varchar(8) NOT NULL,
  `temp_modifier` varchar(8) NOT NULL,
  `humidity_divisor` varchar(8) NOT NULL,
  `humidity_modifier` varchar(8) NOT NULL,
  `pressure_divisor` varchar(8) NOT NULL,
  `pressure_modifier` varchar(8) NOT NULL,
  `UV_divisor` varchar(8) NOT NULL,
  `UV_modifier` varchar(8) NOT NULL,
  `CdS_divisor` varchar(8) NOT NULL,
  `CdS_modifier` varchar(8) NOT NULL,
  `CO2_divisor` varchar(8) NOT NULL,
  `CO2_modifier` varchar(8) NOT NULL,
  `O2_divisor` varchar(8) NOT NULL,
  `O2_modifier` varchar(8) NOT NULL,
  `VOC_divisor` varchar(8) NOT NULL,
  `VOC_modifier` varchar(8) NOT NULL,
  `NH3_divisor` varchar(8) NOT NULL,
  `NH3_modifier` varchar(8) NOT NULL,
  `CH4_divisor` varchar(8) DEFAULT NULL,
  `CH4_modifier` varchar(8) DEFAULT NULL,
  `CO_divisor` varchar(8) NOT NULL,
  `CO_modifier` varchar(8) NOT NULL,
  `SR1_divisor` varchar(8) NOT NULL,
  `SR1_modifier` varchar(8) NOT NULL,
  `SR2_divisor` varchar(8) NOT NULL,
  `SR2_modifier` varchar(8) NOT NULL,
  `SR3_divisor` varchar(8) NOT NULL,
  `SR3_modifier` varchar(8) NOT NULL,
  `dB_divisor` varchar(8) DEFAULT NULL,
  `dB_modifier` varchar(8) DEFAULT NULL,
  `calibrated_on` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`calibration_id`),
  KEY `canary_id` (`canary_id`),
  CONSTRAINT `calibrations_history_ibfk_1` FOREIGN KEY (`canary_id`) REFERENCES `Canaries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `calibrations_history`
-- ----------------------------
BEGIN;
INSERT INTO `calibrations_history` VALUES ('1', '29', null, null, 'C8E9EA2', '1', '-5.9', '1', '45', '1.00351', '0', '1', '0', '1', '0', '1', '140', '20.85', '-92.6', '204.75', '0', '20.25', '0.7', null, null, '19.9', '0.2', '57.97', '-35', '49.22', '-41.7', '20.1', '-17.8', null, null, '2019-03-21 16:06:51');
COMMIT;

-- ----------------------------
--  Table structure for `captureErrors`
-- ----------------------------
DROP TABLE IF EXISTS `captureErrors`;
CREATE TABLE `captureErrors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatment_id` int(11) DEFAULT NULL,
  `logData` longtext,
  PRIMARY KEY (`id`),
  KEY `treatment_id` (`treatment_id`),
  CONSTRAINT `capErrT_id` FOREIGN KEY (`treatment_id`) REFERENCES `_treatments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
--  Records of `captureErrors`
-- ----------------------------
BEGIN;
INSERT INTO `captureErrors` VALUES ('3', null, 'db  error 2019-05-13_03:23:08\n   =>     update treatment table ERR: Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?\' at line 1\ndb  error 2019-05-13_03:23:58\n   =>     update treatment table ERR: Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?\' at line 1\ndb  error 2019-05-13_03:24:08\n   =>     update treatment table ERR: Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?\' at line 1\ndb  error 2019-05-13_03:26:23\n   =>     update treatment table ERR: Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?\' at line 1\ndb  error 2019-05-13_03:28:03\n   =>     update treatment table ERR: Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?\' at line 1\ndb  error 2019-05-13_03:28:50\n   =>     update treatment table ERR: Error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'?\' at line 1\n'), ('4', null, 'db  error 2019-05-13_05:14:42\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:15:13\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:15:58\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:16:31\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:17:01\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:17:19\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:18:01\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:18:47\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:19:13\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:19:58\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:20:23\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:21:27\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:22:42\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:24:02\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:38:44\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: end_time is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:39:01\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:06\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:40:33\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:27\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:41:59\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:42:40\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:07\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:23\n   =>   capture gateway runtime ERR: ReferenceError: treatment_duration is not defined\ndb  error 2019-05-13_05:43:41\n   =>   CLOSEOUT TREATMENT ERR: ReferenceError: updateTable is not defined\n'), ('5', null, 'db  error 2019-05-13_05:47:25\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: jhl is not defined\n'), ('6', null, 'db  error 2019-05-13_05:48:25\n   =>   QUERY TO UPDATE GATEWAY RUN TIMES ERR: ReferenceError: jhl is not defined\n');
COMMIT;

-- ----------------------------
--  Table structure for `disinfections`
-- ----------------------------
DROP TABLE IF EXISTS `disinfections`;
CREATE TABLE `disinfections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `disinfection` varchar(255) NOT NULL,
  `sector` enum('Agricultural','Industrial','Residential','All') DEFAULT 'Agricultural',
  `status` enum('pending','approved') DEFAULT 'approved',
  PRIMARY KEY (`id`),
  UNIQUE KEY `industry_sector` (`disinfection`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `disinfections`
-- ----------------------------
BEGIN;
INSERT INTO `disinfections` VALUES ('1', 'air conditioning', 'All', 'approved'), ('2', 'air ducts', 'All', 'approved'), ('3', 'stairwells', 'All', 'approved'), ('4', 'freight Elevators', 'Agricultural', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `gateways`
-- ----------------------------
DROP TABLE IF EXISTS `gateways`;
CREATE TABLE `gateways` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gateway_id` varchar(5) DEFAULT NULL,
  `ssid` varchar(50) DEFAULT NULL,
  `gateway` varchar(7) NOT NULL,
  `assignedTo` varchar(255) DEFAULT NULL,
  `activeDate` timestamp NULL DEFAULT NULL,
  `activationDate` timestamp NULL DEFAULT NULL,
  `treatmentBatchCount` int(11) DEFAULT NULL,
  `treatmentCount` int(11) DEFAULT '0',
  `ttlTreatmentCount` int(11) DEFAULT NULL,
  `run_time` float(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gateway` (`gateway`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `gateways`
-- ----------------------------
BEGIN;
INSERT INTO `gateways` VALUES ('5', 'G1', 'GBF4AB9', 'GBF4AB9', 'West Coast - Treatments', '2019-04-15 01:13:04', '2019-03-01 04:52:55', null, '758', '759', '6.37'), ('6', 'G2', 'GE26F45', 'GE26F45', 'West Coast - Treatments', '2019-03-20 10:35:57', '2019-03-20 05:49:31', null, '38', '602', '6.23'), ('7', 'G3', 'GB184CC', 'GB184CC', 'West Coast - Treatments', null, null, null, '0', '602', '6.23'), ('8', 'G4', 'G000000', 'G000000', 'West Coast - Treatments', null, null, null, '0', '602', '6.23');
COMMIT;

-- ----------------------------
--  Table structure for `industry_sectors`
-- ----------------------------
DROP TABLE IF EXISTS `industry_sectors`;
CREATE TABLE `industry_sectors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `industry` varchar(255) NOT NULL,
  `sector` enum('Agricultural','Industrial','Residential','All') DEFAULT 'Agricultural',
  `status` enum('pending','approved') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `industry_sector` (`industry`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `industry_sectors`
-- ----------------------------
BEGIN;
INSERT INTO `industry_sectors` VALUES ('1', 'Greenhouse - Vegetable', 'Agricultural', 'approved'), ('2', 'Greenhouse - Flower', 'Agricultural', 'approved'), ('3', 'Greenhouse - Other', 'Residential', 'approved'), ('4', 'Cannabis', 'Industrial', 'approved'), ('5', 'Poultry', 'Agricultural', 'approved'), ('6', 'Dairy', 'Agricultural', 'approved'), ('7', 'Supplier', 'All', 'approved'), ('8', 'Other', 'All', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `podio_customers`
-- ----------------------------
DROP TABLE IF EXISTS `podio_customers`;
CREATE TABLE `podio_customers` (
  `id` int(11) NOT NULL,
  `customer` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `basic` (`id`,`customer`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptch`
-- ----------------------------
DROP TABLE IF EXISTS `ptch`;
CREATE TABLE `ptch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatment_id` int(11) NOT NULL,
  `injection` bit(1) DEFAULT NULL,
  `pipeDist` bit(1) DEFAULT NULL,
  `02_psi` decimal(5,2) DEFAULT NULL,
  `to_LOX` bit(1) DEFAULT NULL,
  `to_vap` varchar(255) DEFAULT NULL,
  `yellowReg` varchar(255) DEFAULT NULL,
  `greenFeed` varchar(255) DEFAULT NULL,
  `openPressure` varchar(255) DEFAULT NULL,
  `adjRegTo3` varchar(255) DEFAULT NULL,
  `closeReg` varchar(255) DEFAULT NULL,
  `attachGreenToO2` varchar(255) DEFAULT NULL,
  `doubleCheckCons` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_bacteriaTest`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_bacteriaTest`;
CREATE TABLE `ptcl_bacteriaTest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `siteName` varchar(255) DEFAULT NULL,
  `row` varchar(12) DEFAULT NULL,
  `section` varchar(12) DEFAULT NULL,
  `notes` text,
  `preReading` decimal(5,2) DEFAULT NULL,
  `postReading` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `bactMon_treatmntId` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_bacteriaTestImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_bacteriaTestImgs`;
CREATE TABLE `ptcl_bacteriaTestImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `bacteriaImgTreatment_id` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_canaryImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_canaryImgs`;
CREATE TABLE `ptcl_canaryImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_canaryimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_canarySensors`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_canarySensors`;
CREATE TABLE `ptcl_canarySensors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `sensorId` varchar(255) DEFAULT NULL,
  `row` varchar(12) DEFAULT NULL,
  `section` varchar(12) DEFAULT NULL,
  `heightOffGround` decimal(4,2) DEFAULT NULL,
  `description` text,
  `preReading` decimal(5,2) DEFAULT NULL,
  `postReading` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_canarysensors_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_chemicals`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_chemicals`;
CREATE TABLE `ptcl_chemicals` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `chemical` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ptcl_chemicals`
-- ----------------------------
BEGIN;
INSERT INTO `ptcl_chemicals` VALUES ('1', 'CleanGrow'), ('2', 'Bleach');
COMMIT;

-- ----------------------------
--  Table structure for `ptcl_cubDist`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_cubDist`;
CREATE TABLE `ptcl_cubDist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` int(11) DEFAULT NULL,
  `sensorId` varchar(255) DEFAULT NULL,
  `row` varchar(12) DEFAULT NULL,
  `section` varchar(12) DEFAULT NULL,
  `heightOffGround` decimal(4,2) DEFAULT NULL,
  `description` text,
  `preReading` decimal(5,2) DEFAULT NULL,
  `postReading` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_cubdist_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_cubDistImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_cubDistImgs`;
CREATE TABLE `ptcl_cubDistImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_cubdistimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_cubImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_cubImgs`;
CREATE TABLE `ptcl_cubImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_cubimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_cubs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_cubs`;
CREATE TABLE `ptcl_cubs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `siteName` varchar(255) DEFAULT NULL,
  `row` varchar(12) DEFAULT NULL,
  `section` varchar(12) DEFAULT NULL,
  `notes` text,
  `preReading` decimal(5,2) DEFAULT NULL,
  `postReading` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_cubs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_distributionImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_distributionImgs`;
CREATE TABLE `ptcl_distributionImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_distributionimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_generalObs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_generalObs`;
CREATE TABLE `ptcl_generalObs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `cleanliness` tinyint(1) DEFAULT NULL,
  `cleanlinessComment` text,
  `organicMatter` tinyint(4) DEFAULT NULL,
  `chemicalSmell` tinyint(1) DEFAULT NULL,
  `organicSmell` tinyint(1) DEFAULT NULL,
  `smellComment` varchar(255) DEFAULT NULL,
  `temp` decimal(5,2) DEFAULT NULL,
  `humidity` decimal(5,2) DEFAULT NULL,
  `insectsViewed` tinyint(1) DEFAULT NULL,
  `insectComments` text,
  `ventsClosed` bit(1) DEFAULT NULL,
  `shadesAt80` bit(1) DEFAULT NULL,
  `fansOnMax` bit(1) DEFAULT NULL,
  `autoTriggers` bit(1) DEFAULT NULL,
  `markedAndLocked` bit(1) DEFAULT NULL,
  `plannedEntry` bit(1) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `checklistId` (`treatmentId`),
  CONSTRAINT `checklistId` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ptcl_generalObs`
-- ----------------------------
BEGIN;
INSERT INTO `ptcl_generalObs` VALUES ('3', 'we1232', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
COMMIT;

-- ----------------------------
--  Table structure for `ptcl_goChemUsed`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_goChemUsed`;
CREATE TABLE `ptcl_goChemUsed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `chemicalId` int(6) DEFAULT NULL,
  `amountUser` decimal(5,2) DEFAULT NULL,
  `dateUsed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  KEY `chemicalId` (`chemicalId`),
  CONSTRAINT `chemTreatmentId` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chenmId` FOREIGN KEY (`chemicalId`) REFERENCES `ptcl_chemicals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ptcl_goChemUsed`
-- ----------------------------
BEGIN;
INSERT INTO `ptcl_goChemUsed` VALUES ('3', 'we1232', '1', null, null);
COMMIT;

-- ----------------------------
--  Table structure for `ptcl_powerDist`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_powerDist`;
CREATE TABLE `ptcl_powerDist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` int(11) DEFAULT NULL,
  `sensorId` varchar(255) DEFAULT NULL,
  `row` varchar(12) DEFAULT NULL,
  `section` varchar(12) DEFAULT NULL,
  `heightOffGround` decimal(4,2) DEFAULT NULL,
  `description` text,
  `preReading` decimal(5,2) DEFAULT NULL,
  `postReading` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_powerdist_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_powerDistImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_powerDistImgs`;
CREATE TABLE `ptcl_powerDistImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_powerdistimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_powerImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_powerImgs`;
CREATE TABLE `ptcl_powerImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_powerimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_powerSourceImgs`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_powerSourceImgs`;
CREATE TABLE `ptcl_powerSourceImgs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `photo` blob,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_powersourceimgs_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_powerSources`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_powerSources`;
CREATE TABLE `ptcl_powerSources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `siteName` varchar(255) DEFAULT NULL,
  `row` varchar(12) DEFAULT NULL,
  `section` varchar(12) DEFAULT NULL,
  `notes` text,
  `preReading` decimal(5,2) DEFAULT NULL,
  `postReading` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`),
  CONSTRAINT `ptcl_powersources_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcl_sparcDist`
-- ----------------------------
DROP TABLE IF EXISTS `ptcl_sparcDist`;
CREATE TABLE `ptcl_sparcDist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `cleanliness` tinyint(1) DEFAULT NULL,
  `cleanlinessComment` text,
  PRIMARY KEY (`id`),
  KEY `checklistId` (`treatmentId`),
  CONSTRAINT `ptcl_sparcdist_ibfk_1` FOREIGN KEY (`treatmentId`) REFERENCES `ptcls` (`treatmentId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `ptcls`
-- ----------------------------
DROP TABLE IF EXISTS `ptcls`;
CREATE TABLE `ptcls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `treatmentId` varchar(30) DEFAULT NULL,
  `createdOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `lastUpdated` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `treatmentId` (`treatmentId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `ptcls`
-- ----------------------------
BEGIN;
INSERT INTO `ptcls` VALUES ('1', 'we1232', '2019-01-10 00:00:17', null);
COMMIT;

-- ----------------------------
--  Table structure for `restorations_fire`
-- ----------------------------
DROP TABLE IF EXISTS `restorations_fire`;
CREATE TABLE `restorations_fire` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) DEFAULT '0.00',
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `fire_type` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `restorations_fire`
-- ----------------------------
BEGIN;
INSERT INTO `restorations_fire` VALUES ('1', 'Ordinary combustibles ', '0.00', 'approved'), ('2', 'Flammable liquid + gas ', '0.00', 'approved'), ('3', 'Electrical', '0.00', 'approved'), ('4', 'Metal', '0.00', 'approved'), ('5', 'Cooking oils + fats ', '0.00', 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `restortions_flood`
-- ----------------------------
DROP TABLE IF EXISTS `restortions_flood`;
CREATE TABLE `restortions_flood` (
  `id` int(3) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `c_value` decimal(5,2) DEFAULT '0.00',
  `status` enum('pending','approved') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `flood_type` (`type`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `restortions_flood`
-- ----------------------------
BEGIN;
INSERT INTO `restortions_flood` VALUES ('1', 'Sewage Backup ', null, 'approved'), ('2', 'Frozen/Broken Pipes ', null, 'approved'), ('3', 'Storm/Flood Water ', null, 'approved'), ('4', 'Sprinkler System Failures ', null, 'approved'), ('5', 'Water from Fire Department ', null, 'approved'), ('6', 'Roof Leakage ', null, 'approved'), ('7', 'Foundation Leakage ', null, 'approved');
COMMIT;

-- ----------------------------
--  Table structure for `sectors`
-- ----------------------------
DROP TABLE IF EXISTS `sectors`;
CREATE TABLE `sectors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sector` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `service_requests`
-- ----------------------------
DROP TABLE IF EXISTS `service_requests`;
CREATE TABLE `service_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `node_id` varchar(4) NOT NULL,
  `type` enum('canary','cub') DEFAULT 'canary',
  `service` varchar(255) NOT NULL,
  `description` text,
  `priority` enum('low','normal','important','critical') NOT NULL DEFAULT 'normal',
  `requested_by_user` int(11) NOT NULL,
  `service_request_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','inprogress','material delay','complete') DEFAULT 'pending',
  `serviced_by` int(11) DEFAULT NULL,
  `completion_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `user_tasks`
-- ----------------------------
DROP TABLE IF EXISTS `user_tasks`;
CREATE TABLE `user_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('Pending','In Progress','Under  Review','Complete') DEFAULT 'Pending',
  `issueDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `complettionDate` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Procedure structure for `calibrateAndInsert`
-- ----------------------------
DROP PROCEDURE IF EXISTS `calibrateAndInsert`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `calibrateAndInsert`(IN gateway_id char(7), IN node_id char(7), IN job_id varchar(10), IN country_id char(4), IN customer_id varchar(10), IN location_id varchar(10))
    SQL SECURITY INVOKER
BEGIN
SET @batchTblName = CONCAT(gateway_id,'_',node_id,'_',job_id,'_', country_id,'_',customer_id,'_',location_id,'_batch');




SELECT * FROM calibrations WHERE node_id=node_id ORDER BY calibrations.calibration_id DESC LIMIT 1;
IF ISNULL(calibration_id )  THEN call _saveUncalibrated();

end if;


END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `canary_upTime`
-- ----------------------------
DROP PROCEDURE IF EXISTS `canary_upTime`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `canary_upTime`(IN Id int, IN treatment_duration float)
BEGIN
SELECT Canaries.run_time as current_run_time
FROM Canaries 
WHERE Canaries.id=Id;

update canaries set run_time = current_run_time + treatment_duration where Canaries.id = Id;
END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `createTreatmentBatchTables_v1`
-- ----------------------------
DROP PROCEDURE IF EXISTS `createTreatmentBatchTables_v1`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `createTreatmentBatchTables_v1`()
    SQL SECURITY INVOKER
BEGIN

SET @calTblName = CONCAT(gateway_id,'_',node_id,'_',job_id,'_', country_id,'_',customer_id,'_',location_id,'_batch');

SET @createCalTbl = CONCAT('CREATE TABLE F NOT EXISTS ', @calTblName, ' (
`id` int(11) NOT NULL AUTO_INCREMENT,
`node_id` varchar(7) DEFAULT NULL,
`calibration_id` int(11) DEFAULT NULL,
`latitude` float(10,6) DEFAULT NULL,
`longitude` float(10,6) DEFAULT NULL,
`date` date DEFAULT NULL,
`time` time DEFAULT NULL,
`temperature` decimal(7,4) DEFAULT NULL,
`humidity` decimal(7,4) DEFAULT NULL,
`pressure` decimal(7,4) DEFAULT NULL,
`UV` decimal(7,4) DEFAULT NULL,
`CdS` decimal(7,4) DEFAULT NULL,
`CO2` decimal(7,4) DEFAULT NULL,
`O2` decimal(7,4) DEFAULT NULL,
`VOC` decimal(7,4) DEFAULT NULL,
`NH3` decimal(7,4) DEFAULT NULL,
`CO` decimal(7,4) DEFAULT NULL,
`SR1` decimal(10,4) DEFAULT NULL,
`SR2` decimal(10,4) DEFAULT NULL,
`SR3` decimal(10,4) DEFAULT NULL,
`SRalarm` tinyint(1) DEFAULT NULL,
`insert_time` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`),

KEY `calibration_id` (`calibration_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8');
PREPARE createCalTable FROM @createCalTbl ;
EXECUTE createCalTable;
DEALLOCATE PREPARE createCalTable ;
END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `createTreatmentBatchTables_v5`
-- ----------------------------
DROP PROCEDURE IF EXISTS `createTreatmentBatchTables_v5`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `createTreatmentBatchTables_v5`(IN gateway_id char(7), IN node_id char(7), IN job_id varchar(10), IN country_id char(4), IN customer_id varchar(10), IN location_id varchar(10))
    SQL SECURITY INVOKER
BEGIN

SET @batchTblName = CONCAT(gateway_id,'_',node_id,'_',job_id,'_', country_id,'_',customer_id,'_',location_id,'_batch');

SET @createBatchTbl = CONCAT('CREATE TABLE  IF NOT EXISTS ', @batchTblName, ' (
`id` int(11) NOT NULL AUTO_INCREMENT,
`node_id` varchar(7) DEFAULT NULL,
`calibration_id` int(11) DEFAULT NULL,
`latitude` float(10,6) DEFAULT NULL,
`longitude` float(10,6) DEFAULT NULL,
`date` date DEFAULT NULL,
`time` time DEFAULT NULL,
`temperature` decimal(7,4) DEFAULT NULL,
`humidity` decimal(7,4) DEFAULT NULL,
`pressure` decimal(7,4) DEFAULT NULL,
`UV` decimal(7,4) DEFAULT NULL,
`CdS` decimal(7,4) DEFAULT NULL,
`CO2` decimal(7,4) DEFAULT NULL,
`O2` decimal(7,4) DEFAULT NULL,
`VOC` decimal(7,4) DEFAULT NULL,
`NH3` decimal(7,4) DEFAULT NULL,
`CO` decimal(7,4) DEFAULT NULL,
`SR1` decimal(10,4) DEFAULT NULL,
`SR2` decimal(10,4) DEFAULT NULL,
`SR3` decimal(10,4) DEFAULT NULL,
`SRalarm` tinyint(1) DEFAULT NULL,
`insert_time` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`),

KEY `calibration_id` (`calibration_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8');
PREPARE createBatchTable FROM @createBatchTbl; 
EXECUTE createBatchTable;
DEALLOCATE PREPARE createBatchTable;
END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `createTreatmentTables_v5`
-- ----------------------------
DROP PROCEDURE IF EXISTS `createTreatmentTables_v5`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `createTreatmentTables_v5`(IN gateway_id char(7), IN node_id char(7), IN job_id varchar(10), IN country_id char(4), IN customer_id varchar(10), IN location_id varchar(10))
    SQL SECURITY INVOKER
BEGIN

SET @calTblName = CONCAT(gateway_id,'_',node_id,'_',job_id,'_', country_id,'_',customer_id,'_',location_id,'_cal');

SET @dropCalTbl = CONCAT ('DROP TABLE IF EXISTS  ', @calTblName);
PREPARE deleteCalTable FROM @dropCalTbl;
EXECUTE deleteCalTable;
DEALLOCATE PREPARE deleteCalTable;

SET @createCalTbl = CONCAT('CREATE TABLE ', @calTblName, ' (
`id` int(11) NOT NULL AUTO_INCREMENT,
`node_id` varchar(7) DEFAULT NULL,
`calibration_id` int(11) DEFAULT NULL,
`latitude` float(10,6) DEFAULT NULL,
`longitude` float(10,6) DEFAULT NULL,
`date` date DEFAULT NULL,
`time` time DEFAULT NULL,
`temperature` decimal(7,4) DEFAULT NULL,
`humidity` decimal(7,4) DEFAULT NULL,
`pressure` decimal(7,4) DEFAULT NULL,
`UV` decimal(7,4) DEFAULT NULL,
`CdS` decimal(7,4) DEFAULT NULL,
`CO2` decimal(7,4) DEFAULT NULL,
`O2` decimal(7,4) DEFAULT NULL,
`VOC` decimal(7,4) DEFAULT NULL,
`NH3` decimal(7,4) DEFAULT NULL,
`CO` decimal(7,4) DEFAULT NULL,
`SR1` decimal(10,4) DEFAULT NULL,
`SR2` decimal(10,4) DEFAULT NULL,
`SR3` decimal(10,4) DEFAULT NULL,
`SRalarm` tinyint(1) DEFAULT NULL,
`insert_time` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`),

KEY `calibration_id` (`calibration_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8');
PREPARE createCalTable FROM @createCalTbl ; 
EXECUTE createCalTable;
DEALLOCATE PREPARE createCalTable ;
END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `tableExists`
-- ----------------------------
DROP PROCEDURE IF EXISTS `tableExists`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `tableExists`(IN gateway_id char(7), IN node_id char(7), IN job_id varchar(10), IN country_id char(4), IN customer_id varchar(10), IN location_id varchar(10))
    SQL SECURITY INVOKER
BEGIN

SET @calTblName = CONCAT(gateway_id,'_',node_id,'_',job_id,'_', country_id,'_',customer_id,'_',location_id,'_cal');
SET @createCalTbl = CONCAT('CREATE TABLE IF NOT EXISTS ', @calTblName, ' (
`id` int(11) NOT NULL AUTO_INCREMENT,
`node_id` varchar(7) DEFAULT NULL,
`calibration_id` int(11) DEFAULT NULL,
`latitude` float(10,6) DEFAULT NULL,
`longitude` float(10,6) DEFAULT NULL,
`date` date DEFAULT NULL,
`time` time DEFAULT NULL,
`temperature` decimal(7,3) DEFAULT NULL,
`humidity` decimal(7,3) DEFAULT NULL,
`pressure` decimal(7,3) DEFAULT NULL,
`UV` decimal(7,3) DEFAULT NULL,
`CdS` decimal(7,3) DEFAULT NULL,
`CO2` decimal(7,3) DEFAULT NULL,
`O2` decimal(7,3) DEFAULT NULL,
`VOC` decimal(7,3) DEFAULT NULL,
`NH3` decimal(7,3) DEFAULT NULL,
`CO` decimal(7,3) DEFAULT NULL,
`SR1` decimal(10,4) DEFAULT NULL,
`SR2` decimal(10,4) DEFAULT NULL,
`SR3` decimal(10,4) DEFAULT NULL,
`SRalarm` tinyint(1) DEFAULT NULL,
`insert_time` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`),

KEY `calibration_id` (`calibration_id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8');
PREPARE createCalTable FROM @createCalTbl ; 
EXECUTE createCalTable;
DEALLOCATE PREPARE createCalTable ;
END
 ;;
delimiter ;

-- ----------------------------
--  Procedure structure for `_batchUpdateTreatmentTbl`
-- ----------------------------
DROP PROCEDURE IF EXISTS `_batchUpdateTreatmentTbl`;
delimiter ;;
CREATE DEFINER=`2018dataUser`@`localhost` PROCEDURE `_batchUpdateTreatmentTbl`(IN treatmentId varchar(255), IN gatewayId varchar(7), IN custId int(10), IN statusId int, IN techId int)
    SQL SECURITY INVOKER
BEGIN
IF EXISTS(SELECT _treatments.* FROM _treatments WHERE _treatments.treatment_id =treatmentId) THEN
	UPDATE _treatments SET start_time = CURRENT_TIMESTAMP(), status_id = 1;
 ELSE
	INSERT into _treatments (treatment_id, gateway_id, cust_id, start_time, status_id, tech_id) values (treatmentId, gatewayId, custId, CURRENT_TIMESTAMP(), statusId, techId);
END IF;
END
 ;;
delimiter ;

-- ----------------------------
--  Triggers structure for table _customerLocationEnvelopes
-- ----------------------------
DROP TRIGGER IF EXISTS `createEnvHistory`;
delimiter ;;
CREATE TRIGGER `createEnvHistory` AFTER UPDATE ON `_customerLocationEnvelopes` FOR EACH ROW BEGIN 
	INSERT INTO _customerLocationEnvelopes_history (location_id,acres,hectares,sq_meters,ttl_sq_meters,gutter_height,rail_height,rail_width,design_id,frame_id,floor_id,covering_id,gutter_id,heating_id,vent_id,co2_id,power_id,screens)
	VALUES (OLD.location_id, OLD.acres, OLD.hectares, OLD.sq_meters, OLD.ttl_sq_meters, OLD.gutter_height, OLD.rail_height, OLD.rail_width, OLD.design_id, OLD.frame_id, OLD.floor_id, OLD.covering_id, OLD.gutter_id, OLD.heating_id, OLD.vent_id, OLD.co2_id, OLD.power_id, OLD.screens);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table _customerLocationPhotos
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createCustomerLocPhotoHIstory`;
delimiter ;;
CREATE TRIGGER `createCustomerLocPhotoHIstory` AFTER UPDATE ON `_customerLocationPhotos` FOR EACH ROW BEGIN 
	INSERT INTO _customerLocationPhotos_history (  cust_id, location_photo)
	VALUES (  OLD.cust_id, OLD.location_photo);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table _customerLogos
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createCustomerLogoHIstory`;
delimiter ;;
CREATE TRIGGER `createCustomerLogoHIstory` AFTER UPDATE ON `_customerLogos` FOR EACH ROW BEGIN 
	INSERT INTO _customerLogos_history (  cust_id, logo)
	VALUES (  OLD.cust_id, OLD.logo);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table _locationContacts
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createLocationContactsHIstory`;
delimiter ;;
CREATE TRIGGER `createLocationContactsHIstory` AFTER UPDATE ON `_locationContacts` FOR EACH ROW BEGIN 
	INSERT INTO _locationContacts_history (  location_id, contact_id)
	VALUES (  OLD.location_id, OLD.contact_id);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table _locationCrops
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createLocationCropsHIstory`;
delimiter ;;
CREATE TRIGGER `createLocationCropsHIstory` AFTER UPDATE ON `_locationCrops` FOR EACH ROW BEGIN 
	INSERT INTO _locationCrops_history (  location_id, crop_id)
	VALUES (  OLD.location_id, OLD.crop_id);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table _technicianCertificates
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createTechCertHistory`;
delimiter ;;
CREATE TRIGGER `createTechCertHistory` AFTER UPDATE ON `_technicianCertificates` FOR EACH ROW BEGIN 
	INSERT INTO _technicianCertificates_history ( tech_id, cert_id, certification_date)
	VALUES ( OLD.tech_id, OLD.cert_id, OLD.certification_date);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table _treatmentQuotes
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createTreatmentQuoteHIstory`;
delimiter ;;
CREATE TRIGGER `createTreatmentQuoteHIstory` AFTER UPDATE ON `_treatmentQuotes` FOR EACH ROW BEGIN 
	INSERT INTO _treatmentQuotes_history (  title, customer_id, contact_id, service_notes, target_threshold, appliedBCU_per_hr, min_BCU_cost, washing_cost, travel_cost, setup_staging_cost, total_cost, notes, quote_status_id, xtra_details)
	VALUES (  OLD.title, OLD.customer_id, OLD.contact_id, OLD.service_notes, OLD.target_threshold, OLD.appliedBCU_per_hr, OLD.min_BCU_cost, OLD.washing_cost, OLD.travel_cost, OLD.setup_staging_cost, OLD.total_cost, OLD.notes, OLD.quote_status_id, OLD.xtra_details);
END
 ;;
delimiter ;

delimiter ;;
-- ----------------------------
--  Triggers structure for table calibrations
-- ----------------------------
 ;;
delimiter ;
DROP TRIGGER IF EXISTS `createCalibrationHIstory`;
delimiter ;;
CREATE TRIGGER `createCalibrationHIstory` AFTER UPDATE ON `calibrations` FOR EACH ROW BEGIN 
	INSERT INTO calibrations_history ( canary_id, canary_temp_divisor, node_id, canary_temp_modifier, temp_divisor, temp_modifier, humidity_divisor, humidity_modifier, pressure_divisor, pressure_modifier, UV_divisor, UV_modifier, CdS_divisor, CdS_modifier, CO2_divisor, CO2_modifier, O2_divisor, O2_modifier, VOC_divisor, VOC_modifier, NH3_divisor, NH3_modifier, CH4_divisor, CH4_modifier, CO_divisor, CO_modifier, SR1_divisor, SR1_modifier, SR2_divisor, SR2_modifier, SR3_divisor, SR3_modifier, dB_divisor, calibrated_on)
	VALUES (  OLD.canary_id, OLD.canary_temp_divisor, OLD.canary_temp_modifier, OLD.node_id, OLD.temp_divisor, OLD.temp_modifier, OLD.humidity_divisor, OLD.humidity_modifier, OLD.pressure_divisor, OLD.pressure_modifier, OLD.UV_divisor, OLD.UV_modifier, OLD.CdS_divisor, OLD.CdS_modifier, OLD.CO2_divisor, OLD.CO2_modifier, OLD.O2_divisor, OLD.O2_modifier, OLD.VOC_divisor, OLD.VOC_modifier, OLD.NH3_divisor, OLD.NH3_modifier, OLD.CH4_divisor, OLD.CH4_modifier, OLD.CO_divisor, OLD.CO_modifier, OLD.SR1_divisor, OLD.SR1_modifier, OLD.SR2_divisor, OLD.SR2_modifier, OLD.SR3_divisor, OLD.SR3_modifier, OLD.dB_divisor, OLD.calibrated_on);
END
 ;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
