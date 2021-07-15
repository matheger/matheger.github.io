---
layout: project
title: How Does a Bike-Share Navigate Speedy Success?
description: Analysis of publicly available data from a bike sharing company
---

{:no_toc}
* toc
{:toc}

# Preamble

This project is one of the suggested capstone projects that conclude the [Google Data Analytics Certificate](https://www.coursera.org/professional-certificates/google-data-analytics).

All data in this project was warehoused in a local [Microsoft SQL Server](https://www.microsoft.com/sql-server/) installation. Data transformation and analysis was carried out using [KNIME Analytics Platform](https://www.knime.com), a powerful and extensible open-source software for graphical data analysis and data science. Visualizations were created using [Tableau Public](https://www.tableau.com).

# Scenario

In this scenario, we find ourselves employed with a fictional bike-sharing company in Chicago that offers thousands of available bikes across hundreds of docking stations throughout the city.[^fictional_company_name] Customers can unlock and ride the bikes between these stations by buying either single-ride or single-day passes (classifying them as "casual" customers) or becoming subscribed members through an annual fee.

The director of marketing believes that the best way forward for the company is to focus on converting casual customers into subscribed members. To this end, we are tasked with analyzing how these two different customer types differ in their use of the bike-sharing service, and identifying strategies to most effectively approach casual customers and advertise an upgrade to a membership.

# Data Acquisition and Cleaning

## Raw Data Download

To conduct our analysis, we use one year's worth of data describing the rides that both casual and subscribed customers have made with the company's biked. The data is taken from the publicly available download page of [Divvy](https://www.divvybikes.com) (accessed  June 8, 2021) and covers a time frame from the beginning of April 2020 to the end of April 2021.

Within the downloaded zip archives, we find csv files ranging from ca. 10 to 110 megabyte in size. The files contain the following information about each ride made with company bikes: 

* `ride_id`: a unique identifier for each record; 
* `rideable_type`: the type of bicycle used; 
* `started_at` and `ended_at`: the start and end date- and time stamps; 
* `start_station_name`, `start_station_id`, and their `end_` equivalents: names and identifiers for the start and end stations; 
* `start_lat`, `start_lon`, and their `end_` equivalents: the latitude and longitude of the start and end stations, in decimal degrees; and
* `member_casual`: the customer type that carried out the trip. 

For the given time frame, a total of 3,826,978 records are recovered from the raw data files.

Given the large number of records, it is infeasible to approach the data set using spreadsheet software such as Microsoft Excel. Instead, let us first upload the data from all csv files into a single "raw" SQL table, `_RideData_Raw`. At this stage, we store all fields as `varchar` types without assigning a primary key.

After unpacking all csv files into a dedicated folder (and setting them to write-only access to avoid inadvertent modification), we construct a KNIME workflow that loops over all of these files and inserts their data into the SQL table.

{:.center-image}
[
![Full Raw Upload KNIME Workflow.png](/assets/images/bikeshare/FullRawUploadKNIMEWorkflow.png){: height="70%" width="70%"}
](/assets/images/bikeshare/FullRawUploadKNIMEWorkflow.png)  

{:.caption}
The KNIME workflow used for full raw data upload

## Data Cleaning

**Missing Values.** After dumping all available raw data into the monolithic `_RideData_Raw` table, we go on to investigate what kind of mess we're dealing with. A quick glance at the data reveals that there are quite a number of `NULL`s in the `_station_name` and `_station_id` fields. In all, there are 273,273 records with at least one of the relevant fields nulled, which is equal to about 7% of the full data set. Not great, not terrible. We'll come back to them later.

**Ride Durations and Duplicates.** The `ride_id` values might be useful to use as primary keys for the data, however we must first assure that they are indeed unique. However, there are a 209 duplicate values (each appearing twice), which we copy into a `_RideData_Raw_Duplicates` table for further analysis.

Upon closer inspection, we find that for each pair of these duplicate values, one has its end date *before* the start date. Obviously, this is faulty data. Luckily, the other entry for each of these has a valid end date after the start date. In addition, we also find out that this set of duplicate records contains *all* raw data records with invalid ride dates (end before start date). We can thus simply ignore the nonsensical duplicate records and use their valid siblings for analysis. 

**Data Normalization.** It is immediately obvious that there is a lot of redundant information in the original data: Each row carries both a `..._station_id` *and* a `..._station_name` field, together with latitude and longitude information, for the start and end stations. Obviously, we can eliminate these redundancies if we only store the unique station identifiers with each record, offloading the additional information into a lookup table.

The bad news however is that there are 1,267 distinct station IDs, but only 714 station names in the raw data after ignoring all `NULL`s. In other words, a lot of the stations have more than one id assigned to them. We could create new unique identifiers for the stations and put a bridge table between the raw data and the lookup table. For the sake of simplicity however, we will simply forget about the station IDs at this point and use only the station names to identify them.

**Station Names and Locations.** Ultimately, a docking station is characterized by its physical location, while its name is determined from nearby streets and landmarks. Thus, the most important piece of information that we have about the stations are the latitude and longitude values in the original data. As we look at the `_lat` and `_lng` values for some sample stations however, we notice that their values also jitter to some extent.[^station_loc_jitter] To figure out the station locations, we need to apply some form of averaging to these coordinates. Some of the raw data, however, comes with only four decimal figures (which corresponds to a resolution of about 11 m) or even fewer---the worst offenders even have none at all (equivalent to 111 km of resolution). To judge the accuracy of the average data, we thus include the standard deviation of the station coordinates. The overall data is saved in a `Stations` table, with `station_name` as the primary key.

During the process of this data cleaning, we also notice that some of the station names seem to be duplicated with one two suffixes in parentheses---an asterisk or a `Temp` label---such as `Smith Park (*)` and `Wood St & Taylor St (Temp)`. The latter appears to indicate stations that were temporarily relocated, while the meaning of the former is unclear. The starred stations do, however, not significantly differ from their "parent" stations without the suffix. For simplicity,  we choose to simply drop the `(*)` suffixes when evaluating station names, while retaining the `(Temp)` ones.[^temp_stations_retained]

{:.center-image}
[
![StationsV02.png](/assets/images/bikeshare/StationsV02.png){: height="70%" width="70%"}
](/assets/images/bikeshare/StationsV02.png)

{:.caption}
Excerpt of the station location data

**Main Ride Data.** After we have decided to offload the station location information into a separate table and eliminated duplicates and `NULL`s, we can transfer the raw data into a new table, `RideData`, with the following fields:

* `ride_id` (primary key); 
* `bike_type` (copied from `rideable_type` in the raw data); 
* `start_day`, `start_time` and their `end_` equivalents (split into day and time fields from the raw data); 
* `ride_duration` (the time difference in minutes between the start and end times);
* `start_station` and `end_station` (the station names as used in the `Stations` table); and
* `customer_type` (copy of `member_casual` from the raw data).

At this point, we have a data set of 3,553,496 valid and unique ride records.

# Data Analysis

To start out with our analysis, we sort all ride durations into 30-minute bins and investigate their frequency. The results already paint a very interesting picture: The vast majority (about 78%) of all recorded trips are less than 30 minutes long, and members make twice as many of these trips as casual customers. Conversely, trips of more than 30 minutes are taken more often by casual customers than by members. This of course begs the question: Why do subscribed members prefer shorter trips by such a big margin?

{:.tableauPlaceholder}
<!--div markup=0 class='tableauPlaceholder' id='viz1626309379780' style='position: relative;'>
	<noscript>
		<a href='#'>
			<img alt='Number of Rides by Duration ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;GO&#47;GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesbyDuration&#47;1_rss.png' style='border: none' />
		</a>
	</noscript>
	<object class='tableauViz'  style='display:none;' width='630' height='480'>
		<param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> 
		<param name='embed_code_version' value='3' /> 
		<param name='site_root' value='' />
		<param name='name' value='GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesbyDuration' />
		<param name='tabs' value='no'/>
		<param name='toolbar' value='no'/>
		<param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;GO&#47;GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesbyDuration&#47;1.png' /> 
		<param name='showShareOptions' value='false' />
		<param name='animate_transition' value='yes' />
		<param name='display_static_image' value='yes' />
		<param name='display_spinner' value='yes' />
		<param name='display_overlay' value='no' />
		<param name='display_count' value='yes' />
		<param name='language' value='en-US' />
		<param name='filter' value='publish=yes' />
	</object>
</div>                

<script type='text/javascript'>                    
	var divElement = document.getElementById('viz1626309379780');                    
	var vizElement = divElement.getElementsByTagName('object')[0];                    
	//vizElement.style.width='100%';
	//vizElement.style.height=(divElement.offsetWidth*0.75)+'px';  
	var scriptElement = document.createElement('script');                  
	scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';  
	vizElement.parentNode.insertBefore(scriptElement, vizElement);               
</script-->

{% include_relative 01_bikeshare_include/tableau_ridesduration.html %}

{:.caption}
Number of trips by duration (30-minute bins) and customer type

In the introductory notes to the project, we are given the interesting piece of information that about 30% of customers use the company's biked to cycle to work. It seems that this distribution of ride durations might be a clue! In order to dig deeper into this behaviour of our riders, let's take a look at the average number of rides started by the different customers within each hour of the day, differentiated into weekdays and weekends.

{:.tableauPlaceholder}
<div class='tableauPlaceholder' id='viz1626311994834' style='position: relative'><noscript><a href='#'><img alt='Average Number of Rides Started on Workdays and Weekends ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;GO&#47;GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesonWorkdaysWeekends&#47;1_rss.png' style='border: none' /></a></noscript>
	<object class='tableauViz'  style='display:none;' width='690' height='400'>
	<param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesonWorkdaysWeekends' /><param name='tabs' value='no' /><param name='toolbar' value='no' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;GO&#47;GOOGLE_DA-CaseStudy1-Rideshare&#47;RidesonWorkdaysWeekends&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='en-US' /><param name='filter' value='publish=yes' />		<param name='showShareOptions' value='false' />
</object>
</div>

<script type='text/javascript'>                    
var divElement = document.getElementById('viz1626311994834');                    
var vizElement = divElement.getElementsByTagName('object')[0];                    
var scriptElement = document.createElement('script');                    
scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    
vizElement.parentNode.insertBefore(scriptElement, vizElement);                
</script>

{:.caption}
Trips started within each hour during weekdays and weekends

During weekends, casual and subscribed customers do not show much of a difference in their ride behaviour. During weekdays, however, the difference is striking! Members significantly outperform casual customers here, with two very distinct spikes in the number of rides around 7 to 8 am, and 5 pm. This seems to corroborate what was mentioned to us about "Biking to work;" and at the same time, we can see that this is much more popular with members than with casual customers.  


# Key Insights

...

# Odds and Ends

...

# Wrap-Up

...


# SNIPPETS

One obvious limitation of the data set is the absence of any further information on the company's customer base. Specifically, we are unable to tell what proportion of rides are taken by returning customers, and how many subscribed customers the company actually has.


[^fictional_company_name]: While the company in the capstone project for the Google Data Analytics course is made out to be fictional, it has a real-life equivalent: [Divvy](https://www.divvybikes.com), from which we also take the openly available data sets for analysis.

[^station_loc_jitter]: Presumably, these are GPS coordinates reported by transmitters on the bikes themselves, not a fixed value assigned to the station.

[^temp_stations_retained]: This is a somewhat arbitrary decision. We could easily argue for eliminating the temporary stations as well and merging them with the "main" ones. 

