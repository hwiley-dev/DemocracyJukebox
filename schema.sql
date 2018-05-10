-- Drops the jukeBox if it exists currently --
DROP DATABASE IF EXISTS jukeBox;
-- Creates the jukeBox database --
CREATE DATABASE jukeBox;

USE jukeBox;
INSERT INTO Admins (name, password)
VALUES ('admin', 'password');