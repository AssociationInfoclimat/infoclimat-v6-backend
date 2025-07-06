CREATE TABLE `cartes_tuiles` (
  `nom` varchar(255) NOT NULL,
  `donnees` varchar(255) NOT NULL,
  PRIMARY KEY (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `cartes_tuiles` (`nom`, `donnees`)
VALUES
	('temperature', '{\"year\":\"2024\",\"month\":\"04\",\"day\":\"17\",\"hour\":\"22\",\"minute\":\"29\"}'),
	('temperature_max', '{\"year\":\"2024\",\"month\":\"04\",\"day\":\"17\",\"hour\":\"18\",\"minute\":\"59\"}'),
	('temperature_min', '{\"year\":\"2024\",\"month\":\"04\",\"day\":\"17\",\"hour\":\"18\",\"minute\":\"59\"}');


CREATE TABLE `historic_events` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `localisation` varchar(255) NOT NULL,
  `importance` tinyint(4) NOT NULL,
  `type_cyclone` varchar(100) NOT NULL,
  `has_image_cyclone` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 ou 1',
  `date_deb` date NOT NULL,
  `date_fin` date NOT NULL,
  `duree` tinyint(4) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `short_desc` text NOT NULL,
  `sources` text NOT NULL,
  `id_compte` int(11) NOT NULL,
  `valeur_max` float NOT NULL,
  `bs_link` int(11) NOT NULL COMMENT 'si lien avec un bs',
  `gen_cartes` tinyint(2) NOT NULL DEFAULT 0 COMMENT 'indique s''il faut générer des cartes ou non',
  `why` text NOT NULL,
  `tableau_croise` text NOT NULL,
  `tableau_croise_cyclone` text NOT NULL,
  `hits` int(11) NOT NULL DEFAULT 0,
  `notes` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `importance` (`importance`,`type`),
  KEY `nom` (`nom`),
  KEY `gen_cartes` (`gen_cartes`),
  KEY `hits` (`hits`),
  FULLTEXT KEY `recherche` (`nom`,`description`,`short_desc`)
) ENGINE=MyISAM AUTO_INCREMENT=2997 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `historic_events` (`id`, `nom`, `localisation`, `importance`, `type_cyclone`, `has_image_cyclone`, `date_deb`, `date_fin`, `duree`, `type`, `description`, `short_desc`, `sources`, `id_compte`, `valeur_max`, `bs_link`, `gen_cartes`, `why`, `tableau_croise`, `tableau_croise_cyclone`, `hits`, `notes`)
VALUES
	(2995, '', '-1', 4, '', 0, '2024-04-12', '2024-04-15', 2, '8,3', '', '', '', 26, 0, 0, 0, '', 'a:0:{}', '', 18, ''),
	(2994, '', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:22;s:1:\"0\";}}', '', 10, ''),
	(2993, '', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:22;s:1:\"0\";}}', '', 14, ''),
	(2992, '', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:22;s:1:\"0\";}}', '', 11, ''),
	(2991, '', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:22;s:1:\"0\";}}', '', 13, ''),
	(2990, '', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:22;s:1:\"0\";}}', '', 9, ''),
	(2989, '', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:22;s:1:\"0\";}}', '', 22, ''),
	(2988, 'Tempête Pierrick', '53,31,25,23,22', 0, '', 0, '2024-04-08', '2024-04-09', 1, '6', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:6;a:5:{i:53;N;i:31;N;i:25;N;i:23;N;i:22;N;}}', '', 28, ''),
	(2987, '', '-1', 5, '', 0, '2024-04-05', '2024-04-07', 2, '8,3', '<p><img src=\"../FTPS/ftp_actualites/2024/situ-gale-6-avrilpng.png\" alt=\"\" width=\"1500\" height=\"1064\" /></p>', 'Une dépression anormalement profonde pour la saison, baptisée Kathleen est centrée en matinée du 6 au large de l\'Irlande par 954 HPA.\r\nElle joue le rôle de pompe à chaleur en faisant remonter une masse d\'air subtropicale anormalement douce pour la saison. Au radiosondage de Payerne (Suisse) du 7 avril à 00hUTC, la masse d\'air affiche 17.4°C à 850 HPA (env. 1500 m) soit la seconde valeur la plus élevée pour un mois d\'avril (depuis 1954).\r\nCette masse d\'air draine avec elle une importante quantité de poussières de sable.\r\nAvec 33.9°C à Navarrenx, le record national est battu en début de mois.', '', 26, 0, 0, 0, '', 'a:2:{i:8;a:22:{i:42;s:1:\"0\";i:72;s:1:\"0\";i:83;s:1:\"0\";i:26;s:1:\"0\";i:53;s:1:\"0\";i:24;s:1:\"0\";i:21;s:1:\"0\";i:94;s:1:\"0\";i:43;s:1:\"0\";i:11;s:1:\"0\";i:91;s:1:\"0\";i:74;s:1:\"0\";i:41;s:1:\"0\";i:73;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:52;s:1:\"0\";i:22;s:1:\"0\";i:54;s:1:\"0\";i:93;s:1:\"0\";i:82;s:1:\"0\";}i:3;a:22:{i:42;s:1:\"0\";i:72;s:1:\"5\";i:83;s:1:\"0\";i:26;s:1:\"0\";i:53;s:1:\"0\";i:24;s:1:\"0\";i:21;s:1:\"0\";i:94;s:1:\"0\";i:43;s:1:\"0\";i:11;s:1:\"0\";i:91;s:1:\"0\";i:74;s:1:\"0\";i:41;s:1:\"0\";i:73;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:52;s:1:\"0\";i:22;s:1:\"0\";i:54;s:1:\"0\";i:93;s:1:\"0\";i:82;s:1:\"0\";}}', '', 36, ''),
	(2986, 'Tempête Nelson', '83,26,53,24,52,54,82', 3, '', 0, '2024-03-27', '2024-03-29', 2, '4,5,6', '', '', '', 26, 0, 0, 0, '', 'a:3:{i:4;a:7:{i:83;N;i:26;N;i:53;N;i:24;N;i:52;N;i:54;N;i:82;N;}i:5;a:7:{i:83;N;i:26;N;i:53;N;i:24;N;i:52;N;i:54;N;i:82;N;}i:6;a:7:{i:83;s:1:\"0\";i:26;s:1:\"0\";i:53;s:1:\"0\";i:24;s:1:\"0\";i:52;s:1:\"0\";i:54;s:1:\"0\";i:82;s:1:\"0\";}}', '', 143, ''),
	(2985, '', '-1', 2, '', 0, '2024-03-21', '2024-03-22', 1, '3', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:3;a:22:{i:42;s:1:\"0\";i:72;s:1:\"0\";i:83;s:1:\"0\";i:26;s:1:\"0\";i:53;s:1:\"0\";i:24;s:1:\"0\";i:21;s:1:\"0\";i:94;s:1:\"0\";i:43;s:1:\"0\";i:11;s:1:\"0\";i:91;s:1:\"0\";i:74;s:1:\"0\";i:41;s:1:\"0\";i:73;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:52;s:1:\"0\";i:22;s:1:\"0\";i:54;s:1:\"0\";i:93;s:1:\"0\";i:82;s:1:\"0\";}}', '', 31, ''),
	(2983, '', '-1', 0, '', 0, '2024-01-24', '2024-01-24', 2, '3', '', '', '', 2552, 0, 0, 0, '', 'a:1:{i:3;a:22:{i:42;s:1:\"0\";i:72;s:1:\"0\";i:83;s:1:\"0\";i:26;s:1:\"0\";i:53;s:1:\"0\";i:24;s:1:\"0\";i:21;s:1:\"0\";i:94;s:1:\"0\";i:43;s:1:\"0\";i:11;s:1:\"0\";i:91;s:1:\"0\";i:74;s:1:\"0\";i:41;s:1:\"0\";i:73;s:1:\"0\";i:31;s:1:\"0\";i:25;s:1:\"0\";i:23;s:1:\"0\";i:52;s:1:\"0\";i:22;s:1:\"0\";i:54;s:1:\"0\";i:93;s:1:\"0\";i:82;s:1:\"0\";}}', '', 99, '');
