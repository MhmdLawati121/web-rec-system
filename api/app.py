from flask import Flask, jsonify, request 
from flask_cors import CORS
import psycopg2
import numpy as np
import spacy
import re
from datetime import datetime
from gensim.models import word2vec
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os

###########
## MODEL ##
###########
# loading model
model = word2vec.Word2Vec.load("api/skill2vec.model")

# Loading SpaCy
nlp = spacy.load("en_core_web_sm")

# Middleware functions
def words_in_vocab(words):
    words_to_remove = [
    "talented", "talent", "ability", "abilities", "proficient", "proficiency",
    "skilled", "skillful", "skill", "strong", "strength", "excellent", "excellence",
    "good", "competent", "competence", "capable", "capability",
    "experienced", "experience", "knowledgeable", "knowledge",
    "qualified", "qualification", "expert", "expertise", "proven", "proof",
    "exceptional", "exception", "effective", "effectiveness", "successful", "success",
    "versatile", "versatility", "efficient", "efficiency",
    "accomplished", "accomplishment", "including", "adaptable", "dedicated", "motivated", 
    "driven", "reliable", "trustworthy", "collaborative", "creative", "proactive", 
    "dependable", "organized", "familiarity", "familiar"
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

qualifications = {
    "diploma": 0,
    "bachelor": 1,
    "master": 2,
    "phd": 3,
    "equivalent to phd": 3
}

# Cosine Similarity
def rate_candidate(job, can_skills):
    requirement_satisfaction = {}
    averages_holder = []
    for i in range(0, len(job.skill_requirements)):
        filteredWords1 = words_in_vocab(job.skill_requirements)
        #print("Words from requirements: ", filteredWords1)
        for j in range(0, len(can_skills)):
            filteredWords2 = words_in_vocab(can_skills)
            #print("Words from skills: ", filteredWords2)
            maximumValues = np.max(phrase_similarity(
                filteredWords1, filteredWords2), axis=1)
            averageValue = np.mean(maximumValues)
            #print("Best matches: ", maximumValues)
            averages_holder.append(averageValue)
        requirement_satisfaction[str(i)] = max(averages_holder)
        averages_holder = []
    # #print(maximumValues)
    return (np.array(list(requirement_satisfaction.values())).mean())


# Class    

class Job:
    def __init__(self, skill_requirements, experience_requirements, education_requirements):
        self.skill_requirements = skill_requirements
        self.experience_requirements = experience_requirements
        self.education_requirements = education_requirements
        self.skill_keywords = []

        # Retrieves job skill requirement keywords                
        for requirement in self.skill_requirements:
            doc = nlp(requirement)
            tokens = [token.text.lower() for token in doc if not (
                token.is_stop or token.is_punct)]
            self.skill_keywords.append(tokens)

##############
## DATABASE ##
##############
# Establish a connection to the PostgreSQL database
dotenv_path = '.env'

# Load environment variables from the specified .env file
load_dotenv(dotenv_path)
#C:\Users\mrpig\OneDrive\Documents\FYP\Node\.env

# Establish connection

conn = psycopg2.connect(
    dbname=os.getenv("DB_DATABASE"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

############
## SERVER ##
############
app = Flask(__name__)
CORS(app)

@app.route('/')
def send_data():
    return("<h1>hello</h1>")

@app.route('/rankApp', methods=['POST'])
def receive_data():

    total_experience = {}
    total_employments = {}

    data_from_express = request.json
    app_data = data_from_express['appData']
    job_data = data_from_express['jobData']
    weights = data_from_express['weights']

    candidate_skills = []
    candidate_education = []

    #print(job_data[0]['requirements'])

    # Create a cursor object
    cur = conn.cursor()

    weights = [int(weight) for weight in weights]
    #print("WEIGHTS: ", weights)
    #print("---------------------")
    #print("Number of applicants = ", len(app_data))
    #print("---------------------")
    job = Job(job_data[0]['requirements'], job_data[0]['experience'], job_data[0]['qualification'] )
    #print(job.skill_keywords)
    #print("---------------------")
    #print(job.experience_requirements)
    #print("---------------------")
    #print(job.education_requirements)
    #print("---------------------")


    # Fetching application data sections
    for app in app_data:

        skill_score = 0
        experience_score = 1
        qualification_score = 0
        employment_score = 1

        #print("---------------------") 
        #print("Application ID: {}".format(app['appid']))
        
        # Get acadmic qualifications
        if app['aq_level']:
            for i in range(0, len(app['aq_level'])):
                temp = app['aq_level'][i] + " " + app['aq_title'][i]
                #print("Qualification: ", temp)
                candidate_education.append(temp)
                app_q = app['aq_level'][i].lower()
                job_q = job_data[0]['qualification'].split()[0].lower()
                #print(app_q, job_q)

                if (qualifications[app_q] >= qualifications[job_q]):
                    qualification_score = 100
                elif (qualifications[app_q] >= qualifications[job_q]-1):
                    qualification_score = 50
                else:
                    qualification_score = 0
        
        # Get skills
        candidate_skills = []
        if app['ps_skill']:
            for i in range(0, len(app['ps_skill'])):
                #print("Skill: ", app['ps_skill'][i])
                candidate_skills.append(app['ps_skill'][i])

            skill_score = rate_candidate(job, candidate_skills)
            skill_score = round(skill_score * 100, 1)
            #print("Overall Skill score of Candidate = ", skill_score)

        # Get employements and years of experience
        if app['eh_employer']:
            appId = str((app['appid']))
            total_experience[appId] = 0
            for i in range(0, len(app['eh_employer'])):
                #print("Employed as: ", app['eh_title'][i])
                start_date = datetime.fromisoformat(app['eh_start'][i].replace('Z', '+00:00'))
                end_date = datetime.fromisoformat(app['eh_end'][i].replace('Z', '+00:00'))
                years_of_experience = (end_date - start_date).days / 365.25
                #print("Years of Experience:", max(round(years_of_experience, 1),0))
                total_experience[appId] += round(years_of_experience, 1)
            
            total_employments[str(app['appid'])] = total_experience[appId] / len(np.unique(app['eh_employer']))
                    
        
        ###########################################################################
        ###########################################################################

        # Storing scores    
        insert_query = "UPDATE scores SET skill_score = %s WHERE appid = %s"
        data_to_insert = (skill_score, app['appid'])
        cur.execute(insert_query, data_to_insert)

        insert_query = "UPDATE scores SET qualification_score = %s WHERE appid = %s"
        data_to_insert = (qualification_score, app['appid'])
        cur.execute(insert_query, data_to_insert)
        # Commit the transaction
        conn.commit()

        # Extract experience values
        experience_values = [0]
        employments_values = [0]
        #print(total_experience)
        #print(total_employments)
        if total_experience.values():
            experience_values = list(total_experience.values())
        if total_employments:
            employments_values = list(total_employments.values())

        max_experience = min(max(experience_values),3*job.experience_requirements)
        min_experience = max(min(experience_values), 0)

        max_employments = max(employments_values)
        min_employments = max(min(employments_values), 0)

    for appId in total_experience.keys():
        if (max_experience != min_experience):
            if (round(total_experience[appId]) < job.experience_requirements):
                experience_score = 0
            else:
                experience_score = (total_experience[appId] - min_experience) / (max_experience - min_experience)
        else:
            print("All candidates possess the same experience")

        insert_query = "UPDATE scores SET experience_score = %s WHERE appid = %s"
        data_to_insert = (experience_score*100, int(appId))
        cur.execute(insert_query, data_to_insert)

    for appId in total_employments.keys():
        if (max_employments != min_employments):
            if (total_employments[appId] < 0):
                employment_score = 0
            else:
                employment_score = (total_employments[appId] - min_employments) / (max_employments - min_employments)
        else:
            print("All candidates possess the same employments")
            
        insert_query = "UPDATE scores SET employments_score = %s WHERE appid = %s"
        data_to_insert = (employment_score*100, int(appId))
        cur.execute(insert_query, data_to_insert)

    for app in app_data:
        appId = app['appid']
        sql_query = "SELECT skill_score, employments_score, qualification_score, experience_score, assessment_score FROM scores WHERE appid = %s"
        # Execute the SQL query
        cur.execute(sql_query, (int(appId),))

        # Fetch the results
        scores = cur.fetchone()
        #print(scores)

        weighted_scores = (np.array(weights) / 100 * np.array(scores)).tolist()
        #print (weighted_scores)
        #print (sum(weighted_scores))
        insert_query = "UPDATE scores SET score = %s WHERE appid = %s"
        data_to_insert = (sum(weighted_scores), (int(appId),))
        cur.execute(insert_query, data_to_insert)

        conn.commit()

    # Close the cursor and the connection
    cur.close()
    return jsonify({'message': 'Data received successfully'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)