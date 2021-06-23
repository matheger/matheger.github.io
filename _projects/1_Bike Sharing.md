---
layout: post
title: How Does a Bike-Share Navigate Speedy Success?
description: Analysis of publicly available data from a bike sharing company
---

Preamble
========

This project is one of the suggested capstone projects that conclude the Coursera Google Data Analytics Certificate.

All data in this project was warehoused in a local [Microsoft SQL Server](https://www.microsoft.com/sql-server/) installation. Data transformation and analysis was carried out using [KNIME Analytics Platform](https://www.knime.com), a powerful and extensible open-source software for graphical data analysis and data science. Visualizations were created using [Tableau Public](https://www.tableau.com).

Scenario
========

In this scenario, we find ourselves employed with a fictional bike-sharing company in Chicago that offers thousands of available bikes across hundreds of docking stations throughout the city.[^1] Customers can unlock and ride the bikes between these stations by buying either single-ride or single-day passes (classifying them as "casual" customers) or becoming subscribed members through an annual fee.

The director of marketing believes that the best way forward for the company is to focus on converting casual customers into subscribed members. To this end, we are tasked with analyzing how these two different customer types differ in their use of the bike-sharing service, and identifying strategies to most effectively approach casual customers and advertise an upgrade to a membership.

Data Acquisition and Preparation
================================

To conduct our analysis, we use one year's worth of data describing the rides that both casual and subscribed customers have made with the company's biked. The data is taken from the publicly available download page of [Divvy](https://www.divvybikes.com) (accessed XX Jun 2021) and covers a timeframe from XX April 2020 to XX April 2021.

Within the downloaded zip archives, we find csv files ranging from ca. 10 to 110 megabyte in size. The files contain the following information about each ride made with company bikes: 

* `ride_id`: a unique identifier for each record; 
* `rideable_type`: the type of bicycle used; 
* `started_at` and `ended_at`: the start and end date- and time stamps; 
* `start_station_name`, `start_station_id`, and their `end_station_` equivalents: names and identifiers for the start and end stations; 
* `start_lat`, `start_lon`, and their `end_` equivalents: the latitude and longitude of the start and end stations; and
* `member_casual`: the customer type that carried out the trip. 

For the given timeframe, a total of XXXXXXXX records is recovered from the raw data files.

One obvious limitation of the data set is the absence of any further information on the copmany's customer base. Specifically, we are unable to tell what proportion of rides are taken by returning customers, and how many subscribed customers the company actually has.

Given the large number of records, it is infeasible to approach the data set using spreadsheet software such as Microsoft Excel. Instead, let us first upload the data from all csv files into a single "raw" SQL table, `_RideData_Raw`. At this stage, we store all fields as `varchar` types without assigning a primary key.

~~~mysql
SELECT *
FROM _RideData_Raw
~~~


Data Cleaning
=============

...

Data Analysis
=============

...

Key Insights
============

...

Odds and Ends
=============

...

Wrap-Up
=======

...







[^1]: While the company in the capstone project for the Google Data Analytics course is made out to be fictional, it has a real-life equivalent: [Divvy](https://www.divvybikes.com), from which we also take the openly available data sets for analysis.
