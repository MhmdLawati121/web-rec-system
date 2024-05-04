from pdfminer.high_level import extract_text
import re
import numpy as np
import spacy
import re
from datetime import datetime
from gensim.models import word2vec
from sklearn.metrics.pairwise import cosine_similarity

model = word2vec.Word2Vec.load("C:/Users/mrpig/OneDrive/Documents/Filtering/FYP-2/api/skill2vec.model")
nlp = spacy.load("en_core_web_sm")
 
def extract_text_from_pdf(pdf_path):
    return extract_text(pdf_path)

def extract_skills_from_resume(text, skills_list):
    skills = []

    # Search for skills in the resume text
    for skill in skills_list:
        pattern = r"\b{}\b".format(re.escape(skill))
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            skills.append(skill)

    return skills


def remove_stopwords(textList):

    # Stringify text
    text = " ".join(textList)

    # Parse the text using the spaCy model
    doc = nlp(text)
    
    # Filter out tokens that are not stop words
    tokens_without_stopwords = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
    
    # Join the tokens back into a single string
    return (tokens_without_stopwords)


 
if __name__ == '__main__':
    
    #text = extract_text_from_pdf(r"C:\Users\mrpig\OneDrive\Documents\FYP\Node\uploads\5-CV - 022024.pdf")

    #job_skills_list = list(model.wv.key_to_index.keys())
    #extracted_skills = extract_skills_from_resume(text, job_skills_list)
    #extracted_skills_kw = remove_stopwords(extracted_skills)
#
    #print(extracted_skills_kw) 

    list1 = [1, 2, 3]
    tuple1 = (2, 4, 6)
    print ((np.array(list1) * np.array(tuple1)).tolist())