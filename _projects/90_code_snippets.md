---
layout: project
title: Code Snippets
description: Code examples from projects
---

On this page, you will find various sample code used in the example projects. Click the "Show code" tags to expand the sections.

{:no_toc}
* toc
{:toc}

# "How Does a Bike-Share Navigate Speedy Success?"

Some exemplary code snippets from the ["bike-share"](/projects/1_bikeshare/) project:

## SQL: Station Locations

The following code was used to build a table named `Stations_V02` which contains the name and geographic location for each bike-sharing station in Chicago, ignoring some testing and maintenance stations specified in `_Ignore_Stations`. The location information is calculated from the average of the latitude/longitude data stored with each single trip record in the `_RideData_Raw` data. However, this data is slightly "jittery" and occasionally includes data points with very low precision. To gauge the impact of these inaccuracies, two additional columns with the standard deviations of all averaged location data are included.

{::options parse_block_html="true" /}

<details><summary markdown="span">Show SQL code</summary>

```sql
/*
Get all distinct and valid station names, 
calculate average latitude and longitude

yields table 'Stations_V02':
703 distinct rows, no nulls in name, lat, lon,
some nulls in standard deviations
*/

drop table if exists #coords;
drop table if exists #coords_avg;
drop table if exists Stations_V02;

create table Stations_V02 (
	station_name varchar(100) not null primary key,
	station_lat float not null,
	station_lon float not null,
	station_lat_stdev float,
	station_lon_stdev float
	)

------------------------------------------------------------
-- collect all coordinate values by station names (start and end)

select
	trim(replace(start_station_name, '(*)', '')) as station_name,
	cast(start_lat as float) as station_lat,
	cast(start_lng as float) as station_lon
into #coords
from _RideData_Raw

union all

select 
	trim(replace(end_station_name, '(*)', '')),
	cast(end_lat as float), 
	cast(end_lng as float)
from _RideData_Raw

------------------------------------------------------------
-- average all locations and store as table Stations

insert into Stations_V02 (station_name, station_lat, station_lon, 
						  station_lat_stdev, station_lon_stdev)
select 
	distinct station_name,
	avg(station_lat) as station_lat,
	avg(station_lon) as station_lon,
	stdev(station_lat) as station_lat_stdev,
	stdev(station_lon) as station_lon_stdev
from #coords
where (
	station_lat is not null
	and station_lon is not null
	and station_name is not null
	and station_name not in (select * from _Ignore_Stations)
	)
group by station_name;
```

</details>
{::options parse_block_html="false" /}
<p></p>

## R: Log-Normal Fit of Ride Durations

The following code was used to create a lognormal fit of the frequency of recorded ride durations in minutes. The references to `knime.in` and `knime.out` data frames are used to interface this code snippet with the KNIME workflow in which it was included.

{::options parse_block_html="true" /}

<details><summary markdown="span">Show R code</summary>

```r
suppressMessages(library(MASS))
suppressMessages(library(dplyr))

# get x data: all ride duration observations
x = filter(knime.in, ride_duration <= 500)$ride_duration

# lognormal fit 
fit = fitdistr(x, "lognormal")
meanlog = coef(fit)[["meanlog"]]
sdlog = coef(fit)[["sdlog"]]

# make model curve for all observed ride duration points
x_unique = unique(x)
curve = dlnorm(x_unique, meanlog, sdlog)

# assign output (data and flow variables)
knime.out = data.frame(x_unique, curve)
knime.flow.out = list(meanlog = meanlog, sdlog = sdlog)
```

<details>
{::options parse_block_html="false" /}
<p></p>