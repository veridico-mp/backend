Codigo create de la base de datos :
NombreBase: "e-commers".
CREATE TABLE `usuarios` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`user` VARCHAR(20) NOT NULL COLLATE 'latin1_swedish_ci',
	`email` VARCHAR(20) NOT NULL COLLATE 'latin1_swedish_ci',
	`password` VARCHAR(40) NOT NULL COLLATE 'latin1_swedish_ci',
	`firstname` VARCHAR(20) NOT NULL DEFAULT 'primernombre' COLLATE 'latin1_swedish_ci',
	`secondname` VARCHAR(20) NOT NULL DEFAULT 'segundonombre' COLLATE 'latin1_swedish_ci',
	`lastname` VARCHAR(20) NOT NULL DEFAULT 'primerapellido' COLLATE 'latin1_swedish_ci',
	`secondlastname` VARCHAR(20) NOT NULL DEFAULT 'segundoapellido' COLLATE 'latin1_swedish_ci',
	`phone` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=2
;