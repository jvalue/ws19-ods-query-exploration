# Example Data

The JSON documents represent example data that the query experiments should work with.

## 1. Pegel Data

Data was taken from Pegelonline: https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations.json

Queries:
* query for short name EITZE
* query for all data on water ALLER
* select shortname and km

## 2. Crime Statistics

Data was taken from BKA and transformed to JSON: https://www.bka.de/DE/AktuelleInformationen/StatistikenLagebilder/PolizeilicheKriminalstatistik/PKS2018/BKATabellen/bkaTabellenLaenderKreiseStaedteFaelle.html?nn=108686

Queries:
* query for "Straftat"="Mord"
* query for "Stadt-/Landkreis"="Nürnberg"
* query for data of "Straftat"="Mord" and select the one with highest "Aufklärungsrate"

## 3. Protocol of German Bundestag

Data was taken from Bundestag and transformed to JSON: https://www.bundestag.de/resource/blob/667742/8eef520612cc2c4777496cce4ed466c1/19125-data.xml

Queries:
* select all speeches, remove the other information
* query for speeches of Konstantin Kuhle (FDP)
* query for all comments of Konstantin Kuhle (FDP) (->probably full-text query?)