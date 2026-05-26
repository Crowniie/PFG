´´´mermaid
graph TD

  PAR["Parla"]
  FUE["Fuenlabrada"]
  GET["Getafe"]
  ILL["Illescas"]
  OCA["Ocaña"]
  MAD["Madridejos"]
  MAN["Manzanares"]
  VAL["Valdepeñas"]
  TOM["Tomelloso"]
  TAR["Tarancón"]
  MOT["Motilla del Palancar"]
  SCL["San Clemente"]
  AZU["Azuqueca de Henares"]
  CAB["Cabanillas del Campo"]
  BRI["Brihuega"]

  PAR --- |"M-506 · 13 km"| FUE
  PAR --- |"A-4 · 8 km"| GET
  FUE --- |"M-506 · 12 km"| GET
  GET --- |"A-4 · 25 km"| ILL
  ILL --- |"A-4 · 50 km"| OCA
  OCA --- |"A-4 · 70 km"| MAD
  OCA --- |"N-400 · 45 km"| TAR
  MAD --- |"A-4 · 62 km"| MAN
  MAN --- |"A-4 · 28 km"| VAL
  MAN --- |"N-430 · 43 km"| TOM
  VAL --- |"CM-3127 · 55 km"| TOM
  TAR --- |"A-3 · 119 km"| MOT
  MOT --- |"CM-310 · 70 km"| SCL
  SCL --- |"N-310 · 66 km"| TOM
  AZU --- |"CM-101 · 12 km"| CAB
  CAB --- |"CM-2009 · 44 km"| BRI
  AZU --- |"A-2 · 50 km"| GET

  classDef mad fill:#ddeeff,stroke:#185FA5,color:#0C447C
  classDef tol fill:#dff0d8,stroke:#3B6D11,color:#27500A
  classDef cr  fill:#fae5dc,stroke:#993C1D,color:#712B13
  classDef cue fill:#fef4dc,stroke:#854F0B,color:#633806
  classDef gua fill:#ede8fe,stroke:#534AB7,color:#3C3489

  class PAR,FUE,GET mad
  class ILL,OCA,MAD tol
  class MAN,VAL,TOM cr
  class TAR,MOT,SCL cue
  class AZU,CAB,BRI gua