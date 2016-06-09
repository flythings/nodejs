# [FlyThings Client](http://flythings.io) - developed by [ITG](http://www.itg.es)

## Getting Started

To use this client is necesary:
*	Install [NodeJS](https://nodejs.org)
* Run **npm install**

And now start to test the flythings clients.

## General

The general properties configuration:
* user: (Mandatory) user email or identifier to login on the system.
* password: (Optional, Default readline process) the user password to login, is not recommended use this configuration.
* serverName: (Optional, Default http://beta.flythings.io/api) configure the server url to insert the data.
* debug: (Optional, Default false) to show the full response of the requests to the server.
* minutes: (Optional, Default 15) the frequency time in minutes to insert the observations.

## Temp Single Triple Insertion

**Description**: node script that insert the cpu data to the flythings monitoring system. Insert the cpu precent usage, mb memory and processors number of nodejs and chrome.

**File**: clients/tempSingleTripleInsertion.js

**Execution**: node clients/tempSingleTripleInsertion.js (from this path)

Available Properties:
* foi: (Optional, Default PC Flythings) the interest thing name to monitoring.
* procedure: (Optional, Default CPU-Memory) the "sensor" name where we register the data.

## Random Id From Date Insertion

**Description**: random data insertions to generate observations from specific date to another specific date, with specific series identifier. 

**File**: clients/randomIdFromDateInsertion.js

**Execution**: node clients/randomIdFromDateInsertion.js (from this path)

Available Properties:
* series: (Optional, Default readline process) series identifier number where make the insertions.
* unit:  (Optional, Default Unit Test) unit name of the data insertions (P. ej. kWh, ºC, etc.)
* numSeries: (Optional, Default 50)  quantity of observations by request for 10 seconds. Take care about the number overflow.
* from: (Optional, Default readline process) timestamp from insert the data.
* to: (Optional, Default readline process) timestamp to insert the data.

## Random Triple From Date Insertion

**Description**: random data insertions to generate observations from specific date to another specific date, without series identifier, but with the things names.

**File**: clients/randomTripleInsertion.js

**Execution**: node clients/randomMultipleTripleInsertion.js (from this path)

Available Properties:
* foi: (Optional, Default Foi Test) the interest thing name to monitoring.
* procedure: (Optional, Default Procedure Test) the "sensor" name where we register the data.
* property: (Optional, Default Property Test) the property name where we register the data.
* unit: (Optional, Default Unit Test) unit name of the data insertions (P. ej. kWh, ºC, etc.)
* numSeries: (Optional, Default 50)  quantity of observations by request for 10 seconds. Take care about the number overflow.
* from: (Optional, Default readline process) timestamp from insert the data.
* to: (Optional, Default readline process) timestamp to insert the data.

## Random Single Id Insertion

**Description**: random data insertion with an specific frequency and series identifier.

**File**: clients/randomSingleTripleInsertion.js

**Execution**: node clients/randomSingleTripleInsertion.js (from this path)

Available Properties:
* series: (Optional, Default readline process) series identifier number where make the insertions.
* unit: (Optional, Default Unit Test) unit name of the data insertions (P. ej. kWh, ºC, etc.)

## Random Single Triple Insertion

**Description**: random data insertion with an specific frequency and series identifier unkown, but with the things names.

**File**: clients/randomSingleTripleInsertion.js

**Execution**: node clients/randomSingleTripleInsertion.js (from this path)

Available Properties:
* foi: (Optional, Default Foi Test) the interest thing name to monitoring.
* procedure: (Optional, Default Procedure Test) the "sensor" name where we register the data.
* property: (Optional, Default Property Test) the property name where we register the data.
* unit: (Optional, Default Unit Test) unit name of the data insertions (P. ej. kWh, ºC, etc.)

## Random Multiple Triple Insertion

**Description**: random data insertion with an specific frequency and series identifier unkown, but with the things names, and multiple observations each request.

**File**: clients/randomMultipleTripleInsertion.js

**Execution**: node clients/randomMultipleTripleInsertion.js (from this path)

Available Properties:
* foi: (Optional, Default Foi Test) the interest thing name to monitoring.
* procedure: (Optional, Default Procedure Test) the "sensor" name where we register the data.
* property: (Optional, Default Property Test) the property name where we register the data.
* unit: (Optional, Default Unit Test) unit name of the data insertions (P. ej. kWh, ºC, etc.)
* numSeries: (Optional, Default 50)  quantity of random series to insert the data.

## API Request Documentation

#### Single Insertion Example

**Method**: PUT

**EndPoint**: /observation/single

**Object Request**:

```JSON
OPTION 1:
{	"foi": "<<Foi name identifier>>",
	"procedure": "<<Sensor name identifier>>",
	"property": "<<Property name identifier>>",
	"value": "<<Value as number>>",
	"unit": "<<Unit name identifier | Optional>>",
	"time": "<<Time in ISO Standar Format Or Timestamp>> | Optional",
	"geom": "<<Geom Object format with the OGC Standar>> | Optional" 
}

OPTION 2:
{	"seriesId": "<<Identifier>>",
	"value": "<<Value as number>>",
	"unit": "<<Unit name identifier>> | Optional",
	"time": "<<Time in ISO Standar Format Or Timestamp>> | Optional",
	"geom": "<<Geom Object format with the OGC Standar>> | Optional"
}
```

#### Multiple Insertion Example

**Method**: PUT

**EndPoint**: /observation/multiple

**Object Request**:

```JSON
OPTION 1:
{ "observations": [
	{	"foi": "<<Foi name identifier>>",
		"procedure": "<<Sensor name identifier>>",
		"property": "<<Property name identifier>>",
		"value": "<<Value as number>>",
		"unit": "<<Unit name identifier | Optional>>",
		"time": "<<Time in ISO Standar Format Or Timestamp>> | Optional",
		"geom": "<<Geom Object format with the OGC Standar>> | Optional" 
	}, "..."]
}

OPTION 2:
{ "observations": [
	{	"seriesId": "<<Number Series Identifier>>",
		"value": "<<Value as number>>",
		"unit": "<<Unit name identifier>> | Optional",
		"time": "<<Time in ISO Standar Format Or Timestamp>> | Optional",
		"geom": "<<Geom Object format with the OGC Standar>> | Optional"
	}, "..."]
}
```

#### CSV Insertion Example

**Method**: POST

**EndPoint From File**: /observation/csv

**EndPoint Without File**: /observation/csv/nofile

**Object Request**:

> OPTION 1
> <"Foi name identifier">;<"Procedure name identifier">;<"Property name identifier">;<"Time in ISO Standar Format Or Timestamp">;<"Value as number">;<"Unit name identifier | Optional">;

> OPTION 2
> <"Number Series Identifier">;<"Time in ISO Standar Format Or Timestamp">;<"Value as number">;<"Unit name identifier | Optional">;
