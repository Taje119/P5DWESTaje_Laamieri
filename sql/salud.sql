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

INSERT INTO participantes (cod_participante, edad, sexo, centro, familia) VALUES
(10001, 18, 'Mujer', 'IES Fernando Zóbel', 'Sanidad'),
(10002, 19, 'Hombre', 'CIFP N1', 'Salud'),
(10003, 18, 'Mujer', 'IES Lorenzo Hervás y Panduro', 'Informática y Comunicaciones'),
(10004, 20, 'Hombre', 'IES Fernando Zóbel', 'Seguridad y Medio Ambiente'),
(10005, 19, 'Mujer', 'CIFP N1', 'Sanidad');

INSERT INTO alimentacion (cod_participante, Ali1, Ali2, Ali3, Ali4, Ali5, Ali6, Ali7, Ali8, Ali9, Ali10, Ali11, Ali12, Ali13, Ali14) VALUES
(10001, 1,1,1,0,1,1,0,1,1,0,1,1,0,1),
(10002, 1,0,1,1,0,1,1,0,1,1,0,1,1,0),
(10003, 1,1,0,1,1,0,1,1,0,1,1,0,1,1),
(10004, 0,1,1,0,1,1,1,0,1,0,1,1,0,1),
(10005, 1,1,1,1,0,1,0,1,1,0,1,0,1,1);

INSERT INTO actividad (cod_participante, AcF1, AcF2, AcF3, AcF4, AcF5, AcF6, AcF7) VALUES
(10001, 2,30,3,40,5,30,120),
(10002, 1,45,2,35,4,25,180),
(10003, 3,25,2,30,5,20,150),
(10004, 2,40,3,30,4,30,100),
(10005, 1,30,4,35,5,25,130);

INSERT INTO sueno (
    cod_participante, Sue1, Sue2, Sue3, Sue4,
    Sue5a, Sue5b, Sue5c, Sue5d, Sue5e, Sue5f, Sue5g, Sue5h, Sue5i, Sue5j,
    Sue5j_Desc, Sue6, Sue7, Sue8, Sue9, Sue10
) VALUES
(10001, '23:30:00', 1, '07:00:00', 7.5, 1,0,1,0,0,1,0,0,0,0, '', 1,0,1,0,1),
(10002, '00:00:00', 2, '06:30:00', 6.5, 2,1,1,0,1,0,0,1,0,0, '', 2,1,1,1,2),
(10003, '23:45:00', 1, '07:15:00', 7.0, 1,0,0,1,0,1,0,0,1,0, '', 1,0,0,1,1),
(10004, '00:15:00', 2, '06:45:00', 6.0, 2,1,0,1,1,0,1,0,0,0, '', 2,1,1,1,2),
(10005, '23:00:00', 1, '07:30:00', 8.0, 1,0,0,0,1,0,0,1,0,0, '', 1,0,0,0,1);

INSERT INTO antropometrico (
    cod_participante, Ant1, Ant2, Ant3, Ant4, Ant5, Ant6, Ant7, Ant8,
    Ant9, Ant10, Ant11, Ant12, Ant13, Ant14, Ant15, Ant16, Ant17,
    Ant18_BD, Ant18_BI, Ant18_PD, Ant18_PI,
    Ant19_BD, Ant19_BI, Ant19_PD, Ant19_PI,
    Ant20, Ant21, observaciones
) VALUES
(10001, 62.00, 1.58, 24.83, 'Normopeso', 72.00, 88.00, 0.77, 0.46, 31.00, 28.00, 25.00, 35.84, 28.04, 7.00, 7, 1.20, 1, 20.10, 20.00, 30.20, 30.00, 15.30, 15.20, 22.10, 22.00, 1, '120/80', 'Datos de prueba'),
(10002, 88.00, 1.60, 34.29, 'Obesidad', 89.00, 104.00, 1.07, 0.55, 32.00, 29.00, 26.00, 41.94, 24.16, 8.00, 2, 1.10, 1, 21.00, 20.80, 31.00, 30.90, 16.00, 15.80, 23.00, 22.80, 1, '130/85', 'Datos de prueba'),
(10003, 70.00, 1.77, 22.27, 'Normopeso', 81.00, 96.00, 0.85, 0.46, 33.00, 30.00, 27.00, 35.45, 34.26, 9.00, 9, 1.30, 1, 22.00, 21.90, 32.00, 31.90, 17.00, 16.90, 24.00, 23.90, 1, '118/76', 'Datos de prueba'),
(10004, 65.00, 1.76, 21.02, 'Normopeso', 85.00, 91.00, 0.96, 0.56, 30.00, 28.00, 24.00, 44.92, 34.82, 11.00, 11, 1.00, 1, 19.80, 19.70, 29.80, 29.70, 14.80, 14.70, 21.80, 21.70, 1, '125/82', 'Datos de prueba'),
(10005, 80.00, 1.64, 29.60, 'Sobrepeso', 88.00, 102.00, 0.99, 0.54, 34.00, 31.00, 28.00, 39.21, 27.43, 6.00, 6, 1.40, 1, 23.00, 22.80, 33.00, 32.80, 18.00, 17.80, 25.00, 24.80, 1, '128/84', 'Datos de prueba');