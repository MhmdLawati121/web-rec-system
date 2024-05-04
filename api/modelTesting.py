import numpy as np
import spacy
import re
from datetime import datetime
from gensim.models import word2vec
from sklearn.metrics.pairwise import cosine_similarity

# loading model
model = word2vec.Word2Vec.load("C:/Users/mrpig/OneDrive/Documents/Filtering/FYP-2/api/skill2vec.model")


# Loading SpaCy
nlp = spacy.load("en_core_web_sm")

# Classes and Functions
# region# Helper Functions

def words_in_vocab(words):
    words_to_remove = [
    "talented", "talent", "ability", "abilities", "proficient", "proficiency",
    "skilled", "skillful", "skill", "strong", "strength", "excellent", "excellence",
    "good", "competent", "competence", "capable", "capability",
    "experienced", "experience", "knowledgeable", "knowledge",
    "qualified", "qualification", "expert", "expertise", "proven", "proof",
    "exceptional", "exception", "effective", "effectiveness", "successful", "success",
    "versatile", "versatility", "efficient", "efficiency",
    "accomplished", "accomplishment", "including"
]

    combined_words = []
    for word in words:
        word = " ".join([token for token in word.split() if token.lower() not in words_to_remove])
        # Tokenize the word using SpaCy
        tokens = [token.text.lower() for token in nlp(word)]
        #print(tokens)
        #print("len of tokens:", len(tokens))

        # Combine consecutive tokens into bigrams
        bigrams = []
        i = 0
        while i < len(tokens):
            if i < len(tokens) - 1:
                # Check if the current token and the next token form a bigram
                bigram_candidate = f"{tokens[i]}_{tokens[i+1]}"
                #print("bigram_candidate:", bigram_candidate)
                if bigram_candidate in model.wv.key_to_index:
                    bigrams.append(bigram_candidate)

            # If no bigram is formed, use the current token as-is
            bigrams.append(tokens[i])
            i += 1

        # Check if the tokens and bigrams are present in the model's vocabulary
        words_in_vocab = [
            token for token in bigrams if token in model.wv.key_to_index]

        # Combine single terms and bigrams for all skill requirements
        combined_words.extend(words_in_vocab)
    return np.unique(combined_words)

def phrase_similarity(words1, words2):
    similarity = cosine_similarity([model.wv[word] for word in words1], [
                                   model.wv[word] for word in words2])
    return similarity

# Classes


class Candidate:
    def __init__(self, skills, experience, education):
        self.skills = skills
        self.experience = experience
        self.education = education
        self.skill_keywords = []
                
        for requirement in self.skills:
            doc = nlp(requirement)
            tokens = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
            self.skill_keywords.append(tokens)

    def calculate_experience_years(self):
        total_years = 0
        current_year = datetime.now().year

        for exp in self.experience:
            # Use regular expression to find years in the experience string
            years = re.findall(r'\b\d{4}\b', exp)

            if len(years) == 2:
                # Calculate the difference in years
                start_year, end_year = map(int, years)
                years_of_experience = end_year - start_year
                total_years += years_of_experience
            elif len(years) == 1:
                # If "Present" is mentioned, consider it as the end year
                start_year = int(years[0])
                years_of_experience = current_year - start_year
                total_years += years_of_experience

        return total_years
    

class Job:
    def __init__(self, skill_requirements, experience_requirements, education_requirements):
        self.skill_requirements = skill_requirements
        self.experience_requirements = experience_requirements
        self.education_requirements = education_requirements
        self.skill_keywords = []
    
        for requirement in self.skill_requirements:
            doc = nlp(requirement)
            tokens = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
            self.skill_keywords.append(tokens)

# endregion


# Object Data
# region
# Candidate Data
candidate_skills = ["Proficient in statistical analysis using R and Python's pandas library","Experience with data visualization techniques, including ggplot2 and Matplotlib","Strong analytical and problem-solving skills developed through coursework and projects"]

candidate_experience = [
    "Senior Software Developer | XYZ Tech Solutions | Cityville, State | May 2023 - Present",
    "Junior Software Developer | XYZ Tech Solutions | Cityville, State | June 2022 - May 2023",
    "Intern, Data Analyst | ABC Analytics | Cityville, State | May 2021 - August 2021"]

candidate_education = ["Bachelor in Computer Science"]


# Job requirements
skill_requirements = ["Proficiency in R and Python pandas library","Experience with data visualization techniques","Familiarity with machine learning algorithms","Ability to work with large datasets"]

experience_requirements = ["Minimum of 2 years of experience as a Software Developer, with a focus on backend systems development using Python and Django.",
                           "Previous internship or work experience as a Data Analyst, involving data collection, cleaning, and analysis using Python and SQL.",
                           "Proven track record of collaborating with cross-functional teams to deliver high-quality software solutions.",
                           "Experience conducting code reviews and providing constructive feedback to team members."]

education_requirements = [
    "Bachelor's degree in Computer Science or a related field."]
# endregion


# Create Candidate objects
# region
candidate = Candidate(
    candidate_skills, candidate_experience, candidate_education)

# Create Job Object
job = Job(skill_requirements, experience_requirements, education_requirements)
# endregion

##########################
# Job requirement analysis
##########################


##########################
# Candidate analysis
##########################

# ---------------------#
# Years of Experience #
# ---------------------#
total_exp = candidate.calculate_experience_years()
# print(total_exp, " years of experience")

# ---------------------#
# Qualifications #
# ---------------------#
""" for qualification in candidate_education:
    doc = nlp(qualification)
    for ent in doc.ents:
        print(ent.text) """


##########################
# Experiments
##########################

# Cosine Similarity Test
def rate_candidate(job_kw, can_kw):    
    requirement_satisfaction = {}
    averages_holder = []
    for i in range(0, len(job_kw)):
        filteredWords1 = words_in_vocab(job_kw[i])
        print("Words from requirements: ", filteredWords1)
        for j in range(0, len(can_kw)):
            filteredWords2 = words_in_vocab(can_kw[j])
            print("Words from skills: ", filteredWords2)
            maximumValues = np.max(phrase_similarity(
                filteredWords1, filteredWords2), axis=1)
            averageValue = np.mean(maximumValues)
            print("Best matches: ", maximumValues)
            averages_holder.append(averageValue)
        requirement_satisfaction[str(i)] = max(averages_holder)
        averages_holder = []
    print(maximumValues)
    return(np.array(list(requirement_satisfaction.values())).mean())

######################
## Printing Results ##
######################


score_candidate_1 = rate_candidate(job.skill_keywords, candidate.skill_keywords)
print("Overall Score of Candidate 1 = ", score_candidate_1)

