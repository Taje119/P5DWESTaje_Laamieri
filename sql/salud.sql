CREATE DATABASE IF NOT EXISTS salud_primera_persona
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE salud_primera_persona;

DROP TABLE IF EXISTS sueno;
DROP TABLE IF EXISTS actividad;
DROP TABLE IF EXISTS alimentacion;
DROP TABLE IF EXISTS antropometrico;
DROP TABLE IF EXISTS participantes;

CREATE TABLE participantes (
    cod_participante INT PRIMARY KEY,
    edad TINYINT,
    sexo VARCHAR(30),
    centro VARCHAR(100),
    familia VARCHAR(100)
);

CREATE TABLE alimentacion (
    cod_participante INT PRIMARY KEY,
    Ali1 TINYINT DEFAULT 0,
    Ali2 TINYINT DEFAULT 0,
    Ali3 TINYINT DEFAULT 0,
    Ali4 TINYINT DEFAULT 0,
    Ali5 TINYINT DEFAULT 0,
    Ali6 TINYINT DEFAULT 0,
    Ali7 TINYINT DEFAULT 0,
    Ali8 TINYINT DEFAULT 0,
    Ali9 TINYINT DEFAULT 0,
    Ali10 TINYINT DEFAULT 0,
    Ali11 TINYINT DEFAULT 0,
    Ali12 TINYINT DEFAULT 0,
    Ali13 TINYINT DEFAULT 0,
    Ali14 TINYINT DEFAULT 0,
    FOREIGN KEY (cod_participante) REFERENCES participantes(cod_participante)
);

CREATE TABLE actividad (
    cod_participante INT PRIMARY KEY,
    AcF1 TINYINT DEFAULT 0,
    AcF2 SMALLINT,
    AcF3 TINYINT DEFAULT 0,
    AcF4 SMALLINT,
    AcF5 TINYINT DEFAULT 0,
    AcF6 SMALLINT,
    AcF7 SMALLINT,
    FOREIGN KEY (cod_participante) REFERENCES participantes(cod_participante)
);

CREATE TABLE sueno (
    cod_participante INT PRIMARY KEY,
    Sue1 TIME,
    Sue2 TINYINT,
    Sue3 TIME,
    Sue4 DECIMAL(3,1),
    Sue5a TINYINT,
    Sue5b TINYINT,
    Sue5c TINYINT,
    Sue5d TINYINT,
    Sue5e TINYINT,
    Sue5f TINYINT,
    Sue5g TINYINT,
    Sue5h TINYINT,
    Sue5i TINYINT,
    Sue5j TINYINT,
    Sue5j_Desc VARCHAR(255),
    Sue6 TINYINT,
    Sue7 TINYINT,
    Sue8 TINYINT,
    Sue9 TINYINT,
    Sue10 TINYINT,
    FOREIGN KEY (cod_participante) REFERENCES participantes(cod_participante)
);

CREATE TABLE antropometrico (
    cod_participante INT PRIMARY KEY,
    Ant1 DECIMAL(5,2),
    Ant2 DECIMAL(5,2),
    Ant3 DECIMAL(4,2),
    Ant4 VARCHAR(30),
    Ant5 DECIMAL(5,2),
    Ant6 DECIMAL(5,2),
    Ant7 DECIMAL(4,2),
    Ant8 DECIMAL(4,2),
    Ant9 DECIMAL(5,2),
    Ant10 DECIMAL(5,2),
    Ant11 DECIMAL(5,2),
    Ant12 DECIMAL(5,2),
    Ant13 DECIMAL(5,2),
    Ant14 DECIMAL(5,2),
    Ant15 TINYINT,
    Ant16 DECIMAL(4,2),
    Ant17 TINYINT,
    Ant18_BD DECIMAL(5,2),
    Ant18_BI DECIMAL(5,2),
    Ant18_PD DECIMAL(5,2),
    Ant18_PI DECIMAL(5,2),
    Ant19_BD DECIMAL(5,2),
    Ant19_BI DECIMAL(5,2),
    Ant19_PD DECIMAL(5,2),
    Ant19_PI DECIMAL(5,2),
    Ant20 TINYINT,
    Ant21 VARCHAR(30),
    observaciones TEXT,
    FOREIGN KEY (cod_participante) REFERENCES participantes(cod_participante)
);