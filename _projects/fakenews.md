---
layout: project
title: Fake News and Dirty Data
description: The kaggle "Fake News" dataset
---


{:no_toc}
* toc
{:toc}

{:.center-image}
![](){: height="150px"}

# Preamble

Among the many datasets available on [kaggle.com](https.//www.kaggle.com) is one called ["Fake and real news"](https://www.kaggle.com/clmentbisaillon/fake-and-real-news-dataset), with its description spelling out a challenge: "Can you use this data set to make an algorithm able to determine if an article is fake news or not ?"

Let's see if we can!

**Please note** that this article is currently very much work-in-progress. I will start here with a very bare-bones and manual analysis of the dataset at first and work my way towards more sophisticated methods as time goes on.

# The Dataset

The dataset contains two csv files with news articles classified as either "fake" or "true", each file holding more than 20,000 records. We find the following fields in the files:

* `title`: the title of the published article;
* `text`: the full text of the article;
* `subject`: a subject categorization of the article;
* `date`: the publication date of the article (2016 and 2017).

More explanations on the collection methodology and the various fields are available in an external [pdf file](https://www.uvic.ca/ecs/ece/isot/assets/docs/ISOT_Fake_News_Dataset_ReadMe.pdf): [^data_pdf] 

> This dataset was collected from real-world sources; the truthful articles were obtained by crawling articles from Reuters.com (News website). As for the fake news articles, they were collected from different sources. The fake news articles were collected from unreliable websites that were flagged by Politifact (a fact-checking organization in the USA) and Wikipedia. The dataset contains different types of articles on different topics, however, the majority of articles focus on political and World news topics.    
> The dataset consists of two CSV files. The first file named “True.csv” contains more than 12,600 articles from reuter.com. The second file named “Fake.csv” contains more than 12,600 articles from different fake news outlet resources. (...) The data collected were cleaned and processed, however, the punctuations and mistakes that existed in the fake news were kept in the text.

## Data Quality

A good data analysis will start with the source and quality of the data itself, so let's take a close look at the dataset and its accompanying pdf notes. At the risk of being overly nitpicky, here are some peculiarities that stand out:

1. All "true" news stem from a single source (Reuters), which poses the danger of introducing a lot of bias into this part of the dataset. The authors don't explain why no other news agencies, like AP or DPA, were included.
2. The "fake" news articles are sourced from a more diverse background, but unfortunately we get no detailed information about those sources. A high-quality dataset would include the original article URLs as well.
3. The source for the "true" news articles is misspelt in the explanatory pdf notes. "reuter.com" leads to the website of a German retailer for bathroom products. The website of the Reuters news agency is "reuter**s**.com". This is not a huge problem in itself, but still gives off an unpleasant impression of sloppy work.
4. For some reason, the notes also point out that each category contains "more than 12,600 articles" of "fake" and "true" news each. That's technically correct,[^correct] but also an example of being "oddly specific". (Perhaps these notes were typed out for an earlier version of the dataset and not updated later on when more articles were added?)
5. The notes state that the data was cleaned, but does not explain *how*.
6. As for the `subject` field, all Reuters articles are labeled either "politicsNews" or "worldnews". The labels on the "fake" articles are somewhat more granular, but only mildly more helpful: "Government News", "US_News", "left-news", "News" and "politics". We get no information how these labels were assigned, and more crucially, why there are no common labels between the "true" and "fake" data sets.

Overall, the subject field doesn't really give us anything useful to work with, so we'll just ignore it from now on. Likewise, we'll leave the publication dates aside and focus on the article titles and bodies for our analysis.

A cursory look at the data also reveals another problem. All of the articles in the "true" data subset start with a preamble like "WASHINGTON (Reuters)". Including these text fragments later on would cause feature leakage, and our model would simply learn to pick out this preamble to judge whether an article is fake news. Similarly, a lot of the entries in the "fake" data include image source attributions that look like "Featured image via..." which causes the same problem. Thus, we need to strip these parts from the entries, which will happen below in the cleanup step.

## Data Cleaning

Despite the claims in the pdf notes that the data was cleaned, a cursory look through the csv files reveals that there are still a few junk entries that we need to deal with: Rows that only contain URLs, duplicate entries, missing text bodies, etc. Thus, the first step is to run both the "true" and "fake" data through some cleanup steps, which is conveniently done using Python. To remove the "leaky" bits of data mentioned before, we would ideally have some way to detect the according parts in the articles automatically. Otherwise, we will have to manually craft a detection and removal strategy for each piece of harmful "meta"-information separately. For simplicity, we will choose the latter approach here and run each article through a series of regular expression (regex) matches in order to remove the problematic text fragments.[^code_snippets] 

**To be continued...**

----

[^data_pdf]: Accessed 2022-03-04

[^correct]: The best kind of correct!

[^code_snippets]: See [here](/projects/code_snippets/) for some example python code snippets.