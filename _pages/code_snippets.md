---
title: Projects
layout: default
permalink: /code_snippets/
published: true
---

On this page, you will find various sample code used in the example projects. Click the "Show code" tags to expand the sections.

{:no_toc}
* toc
{:toc}

----

# Fake News and Dirty Data

Some exemplary code snippets from the "[fake news](/projects/1_fakenews)" project:

## Python: Text Cleaning

To clean the raw data of some "leaky" contents, the following function is applied to every article (using the `re` standard library package for regular expressions):

{::options parse_block_html="true" /}

<details><summary markdown="span">Show Python code</summary>

```python
def clean_text(string):
    """
    Clean text by removing leaky features, newlines, and tabs.
    """
    
    # replace tabs and newlines with whitespaces (we'll use tabs as column
    # separators for storage later)
    string = re.sub(r"\s", r" ", string) 
    # remove "(Reuters)" preambles ("true" articles)
    string = re.sub(
        r".{0,100}" # up to 100 characters
        r"\(Reuters\)" # match "(Reuters)"
        r"[ -]*", # separator dash surrounded by spaces
        r"", string, flags=re.IGNORECASE) 
    
    # remove image/video attributions at end of "fake" articles
    string = re.sub(
        r"(Featured|Image|Photo|Video)" # match one of these words
        r".{0,200}$", # allow for 200 arbitrary characters to end of string
        r" ", string)

    # remove "21st Century Wire" preambles ("fake" articles)
    string = re.sub(r"21st Century Wire( says| asks)?", r"", string,
                    flags=re.IGNORECASE)

    # remove pic.twitter.com urls
    string = re.sub(r"pic\.twitter\.com" # domain
                    r"/[\S]+", # 1 or more non-whitespace characters
                    r" ",
                    string)

    # remove any other urls
    string = re.sub(r"(http(s)?://)" # match http:// or https://
                    r"\S+", # collect all following whitespace characters
                    r" ", string)

    # remove embed codes
    string = re.sub(r"(// < !\[CDATA)" # match "// < ![CDATA"
                    r".*" # any number of characters
                    r"(\&gt;)", # match "&gt;" at end
                    " ", string)
    
    # add missing spaces after punctuation
    string = re.sub(r"(?P<word1>[\w\d]+)" # match first word
                    r"(?P<punct>[\.,:;!?])" # match punctuation
                    r"(?P<word2>[\w\d]+)", # match second word
                    r"\g<word1>\g<punct> \g<word2>",
                    string)

    return string.strip()
```

</details>
{::options parse_block_html="false" /}
<p></p>

## Python: Lemmatization

Processing of the article bodies (word splitting, tagging and lemmatization) is done using the following function:

{::options parse_block_html="true" /}

<details><summary markdown="span">Show Python code</summary>

```python
def lemmatize(string):
    """
    Clean up and lemmatize string
    """
        
    # remove all non-word characters 
    string_clean = re.sub(r"[\d\W_]+", r" ", string.lower()) 
    
    # remove twitter handles and hashtags
    string_clean = re.sub(r"(@|#)[\w\d_]+", r" ", string_clean)
    
    # split string and remove stop words
    string_split = [word for word in string_clean.split()
                    if word not in STOPWORDS]
    
    # tag remaining words
    string_tagged = nltk.pos_tag(string_split)
    
    # lemmatize words using a wrapper function (leaves words alone that 
    # are not nouns, verbs or adjectives)
    string_lem = [_lemmatize(word, tag) for (word, tag) in string_tagged]
    
    # reassemble string
    lemmatized = " ".join(string_lem)
    
    return lemmatized
```

</details>
{::options parse_block_html="false" /}
<p></p>

----

# Mortality Rates in Alberta

Some exemplary code snippets from the "[mortality rates](/projects/2_ab_mortality)" project:

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


## Python/Plotly Visualizations

Once the necessary Pivot Tables have been created, we can use `pandas` to load and transform the data, and then visualize it using `plotly`.

### `data_loader.py`

For convenience and re-usability, the step of loading the data from the Excel files is outsourced to a separate Python script. 

{::options parse_block_html="true" /}

<details><summary markdown="span">Show Python code</summary>

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

</details>
{::options parse_block_html="false" /}
<p></p>



### `plot_mortality.py`

The code below will create a graph with the averaged 2010–2019 data and the grey shaded "error band".

{::options parse_block_html="true" /}

<details><summary markdown="span">Show Python code</summary>

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

</details>
{::options parse_block_html="false" /}
<p></p>

----

# "How Does a Bike-Share Navigate Speedy Success?"

Some exemplary code snippets from the "[bike-share](/projects/3_bikeshare/)" project:

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

</details>
{::options parse_block_html="false" /}

{:.hidden .center} 
(Yes, I write lowercase SQL code and use = for assignments in R. Fight me!)