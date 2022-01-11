---
layout: project
title: Code Snippets
description: Code examples from projects
---

On this page, you will find various sample code used in the example projects. Click the "Show code" tags to expand the sections.

{:no_toc}
* toc
{:toc}

----

# Mortality Rates in Alberta

Some exemplary code snippets from the ["mortality rates"](/projects/ab_mortality) project:

## Excel: Month Name Lookup

To convert the month numbers to their names (or abbreviations), we can follow one of two strategies. The first one is to use the `CHOOSE` function which selects one entry out of a number of given options based on a supplied numeric input:

```
CHOOSE(<month number>, "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
```

A more elaborate approach would be to create a separate lookup table and use the `VLOOKUP` function:

{:.center}

| Number         | Name      | Abbrev. |
|----------------|:----------|:--------|
| 1              | January   | Jan     |
| 2              | February  | Feb     |
| 3              | March     | Mar     |
| ... |... |...                               |


`VLOOKUP(<month number>, <lookup table range>, 3)`,

where `<lookup table range>` is the cell range of the lookup table, starting with the "Number" column and the first data row ("1, January, Jan"); and `<month number>` is a reference to a cell holding the number of the requested month. The third function parameter `3` indicates that we want to return the value from the third column in the lookup table --- i.e., the abbreviated month name; we could adjust this to also return the full name by setting it to `2`.


# Python/Plotly Visualizations

Once the necessary Pivot Tables have been created, we can use `pandas` to load and transform the data, and then visualize it using `plotly`.

## `data_loader.py`

For convenience and re-usability, the step of loading the data from the Excel files is outsourced to a separate Python script. 

```python
import pandas as pd

DATA_PATH = "../_Data/01 Processed/"

with pd.ExcelFile(DATA_PATH + "2022-01-06-V01 Mortality Data.xlsx") \
    as xlsx_mort:

    # all age groups and M,F combined
    avg_mort = xlsx_mort.parse("Averaged Mortality Rates", header=0,
                               index_col=0)

    months = avg_mort.index.tolist()
```

## `plot_mortality.py`

The code below will create a graph with the averaged 2010–2019 data and the grey shaded "error band".

```python
import plotly.graph_objects as go

from data_loader import avg_mort, months

# create trace for averaged mortality data
avg_trace = go.Scatter(x=months, y=avg_mort["Average Mortality"],
                       name="2010–2019<br>"
                       f"<sup>(Avg. ±3 Std.Dev.)</sup>",
                       mode="lines+markers", line_color="darkgrey"
                       )

# forward-backward strategy for error band,
# as per https://plotly.com/python/continuous-error-bars/
_avg_plus = (avg_mort["Average Mortality"]
             + 3 * avg_mort["StdDev of Mortality"])
_avg_minus = (avg_mort["Average Mortality"]
              - 3 * avg_mort["StdDev of Mortality"])

stdev_trace = go.Scatter(x=months + months[::-1],
                         y=_avg_plus.tolist() + _avg_minus.tolist()[::-1],
                         mode="lines",
                         fill="toself",
                         showlegend=False,
                         hoverinfo="none")
stdev_trace.line.width = 0
stdev_trace.fillcolor = "rgba(0,0,0,0.1)" # slight transparency

# create figure object
fig = go.Figure(data=[avg_trace, stdev_trace])

# update legend to be horizontal and on top of the graph
fig.layout.legend.update({"orientation": "h",
                          "yanchor": "bottom",
                          "y": 1.0,
                          "valign": "top"})

# adjust axis titles
fig.layout.yaxis.title = "Mortality per 100,000"
fig.layout.xaxis.title = "Month"

# plot
fig.show()
```

----

# "How Does a Bike-Share Navigate Speedy Success?"

Some exemplary code snippets from the ["bike-share"](/projects/bikeshare/) project:

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