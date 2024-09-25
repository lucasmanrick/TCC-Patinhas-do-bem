-- -----------------------------------------------------
-- Schema DB_PatinhasDoBem
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `DB_PatinhasDoBem` DEFAULT CHARACTER SET utf8;
USE `DB_PatinhasDoBem`;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuario` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Nome` VARCHAR(200) NOT NULL,
  `CEP` VARCHAR(45) NOT NULL,
  `Rua` VARCHAR(45) NOT NULL,
  `Numero` INT NOT NULL,
  `Bairro` VARCHAR(145) NOT NULL,
  `Estado` VARCHAR(45) NOT NULL,
  `DataNasc` DATE NOT NULL,
  `Email` VARCHAR(300) NOT NULL,
  `Senha` VARCHAR(300) NOT NULL,
  `Administrador` TINYINT NOT NULL DEFAULT 0, -- Atributo para indicar se o usuário é administrador
  `Cidade` VARCHAR(70),
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Postagem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Postagem` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Titulo` VARCHAR(255) NOT NULL,
  `Conteudo` TEXT NOT NULL,
  `DataCriacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `IDUsuario` INT,  -- Chave estrangeira que referencia o usuário
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDUsuario`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Avaliacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Avaliacao` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Tipo` VARCHAR(20) NOT NULL,
  `IDPostagem` INT NOT NULL,
  `IDUsuario` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDPostagem`) REFERENCES `Postagem` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDUsuario`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Comentario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Comentario` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Texto` VARCHAR(500) NOT NULL,
  `Data` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IDPostagem` INT NOT NULL,
  `IDUsuario` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDPostagem`) REFERENCES `Postagem` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDUsuario`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Denuncia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Denuncia` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Causa` VARCHAR(300) NOT NULL,
  `IDUsuario` INT NOT NULL,
  `IDPostagem` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDUsuario`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDPostagem`) REFERENCES `Postagem` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`UsuariosBloqueados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `UsuariosBloqueados` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `DataBloqueio` DATE NOT NULL,
  `IDBloqueado` INT NOT NULL,
  `IDBloqueador` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDBloqueador`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Notificacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notificacao` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Texto` VARCHAR(100) NOT NULL,
  `IDDestinatario` INT NOT NULL,
  `IDComentario` INT,
  `IDPostagem` INT,
  `Recebimento` TINYINT NOT NULL DEFAULT 0, -- Atributo para indicar se o usuário viu a notificação
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDDestinatario`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDComentario`) REFERENCES `Comentario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Pet`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pet` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `DataRegistro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `TipoAnimal` VARCHAR(45) NOT NULL,
  `Linhagem` VARCHAR(45) NOT NULL,
  `Status` TINYINT NOT NULL,
  `Idade` VARCHAR(3) NOT NULL,
  `Sexo` VARCHAR(1) NOT NULL,
  `Cor` VARCHAR(45) NOT NULL,
  `Descricao` VARCHAR(500), -- Atributo para a descrição do pet
  `IDDoador` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDDoador`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Interesse`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Interesse` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Status` TINYINT NOT NULL,
  `IDInteressado` INT NOT NULL,
  `IDPet` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDInteressado`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDPet`) REFERENCES `Pet` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`SolicitacaoContato`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `SolicitacaoContato` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `IDSolicitante` INT NOT NULL,
  `IDPetInteressado` INT,
  `IDDestinatario` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDSolicitante`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDPetInteressado`) REFERENCES `Pet` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Contato`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Contato` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Data` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IDSolicitante` INT NOT NULL,
  `IDPetInteressado` INT NOT NULL,
  `IDDestinatario` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDSolicitante`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDPetInteressado`) REFERENCES `Pet` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `DB_PatinhasDoBem`.`Mensagem`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Mensagem` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `DataDeEnvio` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `IDRemetente` INT NOT NULL,
  `IDContato` INT NOT NULL,
  `Remocao` INT NOT NULL,
  `Texto` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`IDRemetente`) REFERENCES `Usuario` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`IDContato`) REFERENCES `Contato` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
