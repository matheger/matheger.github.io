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

**Please note** that Natural Language Processing is very much a field in its own right, and one that I am making contact with for the first time here; things are necessarilry going to be rather rough around the edges in terms of textual analysis. The main idea behind this article is to explore the data preparation and conditioning for machine learning models.

# The Dataset

The dataset contains two csv files with news articles classified as either "fake" or "true", each file holding more than 20,000 records. We find the following fields in the files:

* `title`: the title of the published article;
* `text`: the full text of the article;
* `subject`: a subject categorization of the article;
* `date`: the publication date of the article (2016 and 2017).

More explanations on the collection methodology and the various fields are available in an external [PDF file](https://www.uvic.ca/ecs/ece/isot/assets/docs/ISOT_Fake_News_Dataset_ReadMe.pdf): [^data_pdf] 

> This dataset was collected from real-world sources; the truthful articles were obtained by crawling articles from Reuters.com (News website). As for the fake news articles, they were collected from different sources. The fake news articles were collected from unreliable websites that were flagged by Politifact (a fact-checking organization in the USA) and Wikipedia. The dataset contains different types of articles on different topics, however, the majority of articles focus on political and World news topics.    
> The dataset consists of two CSV files. The first file named “True.csv” contains more than 12,600 articles from reuter.com. The second file named “Fake.csv” contains more than 12,600 articles from different fake news outlet resources. (...) The data collected were cleaned and processed, however, the punctuations and mistakes that existed in the fake news were kept in the text.

## Data Quality

A good data analysis will start with the source and quality of the data itself, so let's take a close look at the dataset and its accompanying PDF notes. At the risk of being overly nitpicky, here are some peculiarities that stand out:

1. All "true" news stem from a single source (Reuters), which poses the danger of introducing a lot of bias into this part of the dataset. The authors don't explain why no other news agencies, like AP or DPA, were included.
2. The "fake" news articles are sourced from a more diverse background, but unfortunately we get no detailed information about those sources. A high-quality dataset would include the original article URLs as well.
3. The source for the "true" news articles is misspelt in the explanatory PDF notes. "reuter.com" leads to the website of a German retailer for bathroom products. The website of the Reuters news agency is "reuter**s**.com". This is not a huge problem in itself, but still gives off an unpleasant impression of sloppy work.
4. For some reason, the notes also point out that each category contains "more than 12,600 articles" of "fake" and "true" news each. That's technically correct,[^correct] but also an example of being "oddly specific". (Perhaps these notes were typed out for an earlier version of the dataset and not updated later on when more articles were added?)
5. The notes state that the data was cleaned, but does not explain *how*.
6. As for the `subject` field, all Reuters articles are labeled either "politicsNews" or "worldnews". The labels on the "fake" articles are somewhat more granular, but only mildly more helpful: "Government News", "US_News", "left-news", "News" and "politics". We get no information how these labels were assigned, and more crucially, why there are no common labels between the "true" and "fake" data sets.

Overall, the subject field doesn't really give us anything useful to work with, so we'll just ignore it from now on. Likewise, we'll leave the publication dates aside and focus on the article titles and bodies for our analysis.

## Data Cleaning

Despite the claims in the PDF notes that the data was cleaned, there are also a number of "junk" entries that we need to deal with: Rows that only contain URLs, duplicate entries, missing text bodies, etc. A cursory look at the data also reveals another problem. All of the articles in the "true" data subset start with a preamble like "WASHINGTON (Reuters)". Including these text fragments later on would cause feature leakage, and our model would simply learn to pick out this preamble to judge whether an article is fake news. Similarly, a lot of the entries in the "fake" data include image source attributions that look like "Featured image via..." which causes the same problem. Thus, we need to strip these parts from the valid entries as well.

All data cleaning is done in Python, using the `pandas` and `re` regex packages.[^code_snippets] 

To remove the "leaky" bits of data mentioned before, we would ideally have some way to detect the according parts in the articles automatically. Otherwise, we will have to manually craft a detection and removal strategy for each piece of harmful "meta"-information separately. For simplicity, we will choose the latter approach here and run each article through a series of regular expression (regex) matches in order to remove the problematic text fragments. At the same time, we can remove any non-printable characters like tabs and newlines from the text bodies that could otherwise mess with us at some point, together with some other unwanted fragments such as link URLs, embedded JavaScript code, etc.

First, all rows with duplicated article titles and bodies are filtered out; this eliminates 5573 entries (!) from the "fake" and 220 entries from the "true" data.[^cleaned] Then, rows with invalid entries (empty title or text fields, containing URLs, ...) are removed; this eliminates a further 508 "fake" and only a single "true" article. Finally, we find that there are 95 entries in the "true" data that are simply uncommented tweets from Trump's official twitter account, and since they contain no other reporting, we remove these as well.

In the end, we are left with 17400 "fake" and 21101 "true" articles.

# Processing and Model Building

Before we dive deeper into analyzing and transforming the data, we have to ask ourselves: What exactly do we want to model with this data? Or, in more practical terms: What will be the inputs and outputs to our models?

## What *is* "Fake News", Really?

Obviously, we want to build some sort of classifier that tells us whether a given article is likely to be fake news or not. That, in turn, raises the issue of how we define "fake news" in the first place. Since we are using a pre-supplied dataset, we are constrained by the contents of that data; in this regard, fake news could be most concisely be characterized as sensationalis, emotionally loaded and heavily editorialized content. The subject of the reporting itself may give an indication as to how likely a piece of writing is to be fake news, but is not necessarily a hard criterion; you can do both factual and sensationalized reporting on the same subject. Likewise, the publication date of an article does not give much of an indication either.

Consequently, metadata alone won't suffice to categorize articles as "fake" or "true". We will have to dive into the actual text to find our clues.

## Stemming and Lemmatization

One basic idea for the textual analysis is to work with the occurrence of certain signal words in the articles and classify whether a combination of them is indicative of a "true" or "fake" article. For robustness, it also makes sense to treat any closely related words as one; for example, "say", "says" and "said" all share the same root, and we replace each one of these words with their common root "say". This process is called "lemmatization".

**To be continued...**

----

[^data_pdf]: Accessed 2022-03-04

[^correct]: The best kind of correct!

[^code_snippets]: See [here](/code_snippets/) for some example code snippets.

[^cleaned]: So much for "The data collected were cleaned and processed"...!