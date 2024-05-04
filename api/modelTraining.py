# Similarity Model Training
import pandas as pd
from gensim import utils
from gensim.models import word2vec, Word2Vec
from gensim.models.phrases import Phrases, ENGLISH_CONNECTOR_WORDS
import numpy as np

csvFilePath = 'api\skill2vec_50K.csv\skill2vec_50K.csv'


# Load the CSV file into a DataFrame without column names
df = pd.read_csv(csvFilePath, header=None, dtype=str)
df = df.fillna('')

sentences = []
for index, row in df.iterrows():
    sentence = ' '.join(str(value) for value in row)
    sentences.append(utils.simple_preprocess(sentence, min_len=1))

# Generate bi-grams
phrases = Phrases(sentences, min_count=1, threshold=1, connector_words=ENGLISH_CONNECTOR_WORDS)
bigram_transformer = Word2Vec(sentences=phrases[sentences], vector_size=100, window=5, min_count=1)

model = word2vec.Word2Vec(sentences=sentences, vector_size=100,
                          window=5, min_count=1)  # Adjust parameters as needed
model.save("skill2vec_2.model")
