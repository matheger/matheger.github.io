---
layout: project
title: Mortality Rates in Alberta
description: Analysis of mortality data for Alberta before and during the Covid-19 pandemic
---

{:no_toc}
* toc
{:toc}

{:.center-image}
![](/projects/bikeshare_assets/bikeshare_logo.svg){: height="150px"}

# Preamble

The Covid-19 pandemic has held the world in its grip for two years now. Just in time for its second anniversary, the virus has mutated into yet another variant with a greatly increased infectiousness, and is spreading throughout the population at rates never seen before. At the same time, scientists and public health officials are monitoring for reports of a reduced severity of illness from this variant, and to what extent this might at least partially dampen the strain on the health care system.

While the assessment of the "infectiousness-vs.-severity" question is still in its infancy -- and may only ever become truly accurate in hindsight --, it has already become abundantly clear that the previously-used metric of infection case numbers fails to be a good instrument this time around. Only half a month into this new wave, we are already seeing cases so drastically outnumber previous waves of the pandemic that it is truly dizzying. (The ever-sarcastic tone of the internet has already deemed the curve of case numbers to be flattened, just along the wrong axis of the graph.) Naturally, the focus is shifting towards hospitalization rates as a more direct measure of the strain imposed on the most crucial public resources. Time will tell whether we might be looking at a cataclysmic turn of events to put everything before to shame; or perhaps a transition into an endemic illness and the beginning of the end of the "new normal" that we all have and haven't gotten used to; or something else entirely.

Besides case numbers, hospitalization rates, and ICU occupancy, there is yet another metric of judging the most severe outcomes of this global health crisis: Mortality rates. Granted, the devastation that the SARS-CoV-2 virus brings on an individual level is not just restricted to this worst one of outcomes, but may otherwise entail crippling and potentially life-long aftereffects in survivors. Nonetheless, even though the chance of death from an infection may be low in comparison to other viruses,[^fatality_rates] it is a compelling "bottom-line" metric to investigate.

# Alberta Mortality Rates 2010–2021

## Data Collection and Preparation

Mortality data for the province of Alberta is available through the [IHDA web portal](http://www.ahw.gov.ab.ca/IHDA_Retrieval/)[^ihda_data_download], categorized by age groups and gender. As of 06-Jan-2022, data is available from January 2010 through November 2021. Since the number of total records is rather small (1,716), we can comfortably do all of this analysis in Excel.

First, the data is downloaded separately for each one of the finer age groups (0 to 19, 20 to 39, 40 to 64, 65 to 74, 75 to 84, 85+) to avoid hitting the 500-record limit that the website imposes for single queries. In a next step, these separate data are then consolidated into one file. In this data, we find the following fields:

* `Sex`: female or male;
* `Age`: the age group as outlined above;
* `Month`: a timestamp of the form `YYYYMM`;
* `Mortality Rate`: the mortality rate as deaths per (100,000 population / month) for the given time frame;
* `Deaths`: the raw number of deaths recorded in the given time frame;
* `Population`: monthly "Person-Years" figures, calculated as the total population (based on quarterly-updated estimates) divided by 12;
* `Standard Error`: error estimate based on assuming a Poisson distribution.

Within these raw data, the total number of deaths (\(D\)) is related to the "person-years" population (\(P$\)) and the calculated mortality rate (\(m\)) as \(m = D / P\).




[^fatality_rates]: See, for example, https://en.wikipedia.org/wiki/List_of_human_disease_case_fatality_rates

[^ihda_data_download]: From the front page: "Go to the IHDA Data" → "Enter IHDA Data" → "Mortality" → "Mortality Rates - Monthly"