import numpy as np
from gensim.models import word2vec
from sklearn.metrics.pairwise import cosine_similarity
import spacy

model = word2vec.Word2Vec.load("C:/Users/mrpig/OneDrive/Documents/Filtering/FYP-2/api/skill2vec.model")
nlp = spacy.load("en_core_web_sm")

def words_in_vocab(words):
    words = [word for word in words if word in model.wv.key_to_index]
    return words


def phrase_similarity(words1, words2):
    similarity = cosine_similarity([model.wv[word] for word in words1], [
                                   model.wv[word] for word in words2])
    return similarity


def rate_candidate(job_kw, can_kw):    
    requirement_satisfaction = {}
    averages_holder = []
    for i in range(0, len(job_kw)):
        filteredWords1 = words_in_vocab(job_kw[i])
        print("Words from requirements: ", filteredWords1)
        for j in range(0, len(can_kw)):
            filteredWords2 = words_in_vocab(can_kw[j])
            maximumValues = np.max(phrase_similarity(
                filteredWords1, filteredWords2), axis=1)
            averageValue = np.mean(maximumValues)
            averages_holder.append(averageValue)
        requirement_satisfaction[str(i)] = max(averages_holder)
        averages_holder = []
    return(np.array(list(requirement_satisfaction.values())).mean())

job_req = ['Experience with statistical analysis software such as R, Python, or MATLAB.', 'Familiarity with data visualization tools and techniques.', 'Experience with data cleaning, transformation, and manipulation techniques.', 'Familiarity with version control systems such as Git for collaborative development and reproducibility.', 'Proficient in conducting advanced statistical analyses, including regression analysis, hypothesis testing, and multivariate techniques.', 'Knowledge of database management systems and SQL for data extraction and manipulation.']
candidate_skills = ['good with MongoDB']
candidate_skills_2 = [
      'Proficient in advanced statistical analysis using R and Python.',  
      'Capable of creating informative data visualizations.',
    'SQL database management',
'Practical use of Git and Gitlab',
'Use of machine learning algorithm for predictive modelling'
]

job_tokens = []
for requirement in job_req:
            doc = nlp(requirement)
            tokens = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
            job_tokens.append(tokens)


can_tokens = []
for requirement in candidate_skills:
            doc = nlp(requirement)
            tokens = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
            can_tokens.append(tokens)


can2_tokens = []
for requirement in candidate_skills_2:
            doc = nlp(requirement)
            tokens = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
            can2_tokens.append(tokens)




print("CAND1:", rate_candidate(job_tokens, can_tokens))
print("CAND2:",rate_candidate(job_tokens, can2_tokens))



