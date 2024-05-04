CREATE TABLE jobs (
    jobId BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    spec VARCHAR (255) NOT NULL,
    opening DATE NOT NULL,
    closing DATE NOT NULL,
    category VARCHAR(255) NOT NULL,
    details VARCHAR(255) NOT NULL,
    experience INT,
    qualification VARCHAR (255),
    duties TEXT[],
    requirements TEXT[] NOT NULL,
    certificates TEXT[],
    benefits TEXT[],
    type varchar(255),
    recruiter BIGINT
);

CREATE TABLE assessments (
id BIGSERIAL NOT NULL PRIMARY KEY,
jobid BIGINT REFERENCES jobs(jobid),
question TEXT NOT NULL,
options TEXT[] NOT NULL,
answer TEXT[] NOT NULL,
imagedata TEXT,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    userid BIGSERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'user',
	head boolean DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    last_login_attempt TIMESTAMP,
    color VARCHAR(7)
);

CREATE TABLE profiles (
    profileid BIGSERIAL NOT NULL PRIMARY KEY,
    userid SERIAL,
    first_name VARCHAR(255),
    second_name VARCHAR(255),
    third_name VARCHAR(255),
    last_name VARCHAR(255),
    dob DATE,
    nationality VARCHAR(255),
    country_of_residence VARCHAR(255),
    marital_status VARCHAR(50),
    gender VARCHAR(10),
    phone VARCHAR(20),
    FOREIGN KEY (userid) REFERENCES accounts(userid)
)

CREATE TABLE applications (
    appid BIGSERIAL NOT NULL PRIMARY KEY,
    userid BIGINT REFERENCES accounts(userid),       
    jobid BIGINT REFERENCES jobs(jobid),
    subdate DATE NOT NULL,
    status VARCHAR(10) DEFAULT 'pending',
	-- Academic Qualifications
    aq_level VARCHAR(20)[],      
    aq_title VARCHAR(255)[],      
    aq_major VARCHAR(255)[],      
    aq_university VARCHAR(255)[], 
    aq_country VARCHAR(255)[],    
    aq_gradyear INT[],            
	-- Employment History
	eh_employer VARCHAR(255)[],
	eh_title VARCHAR(255)[],
	eh_location VARCHAR(255)[],
	eh_start DATE[],
	eh_end DATE[],
    -- Professional SKills
    ps_skill VARCHAR(255)[],
    ps_experience SMALLINT[],
    ps_lastused SMALLINT[],
    -- Awards and Honors
    ah_title VARCHAR(255)[],
    ah_level VARCHAR(255)[],
    ah_type VARCHAR(255)[],
    ah_inst VARCHAR(255)[],
    ah_year SMALLINT[],
    -- Documents
    documents_path TEXT,
    -- Assessment
    sa_result SMALLINT[],
    -- Approved?
    hr_approval BOOLEAN DEFAULT true
);

CREATE TABLE scores (
    scoreid BIGSERIAL NOT NULL PRIMARY KEY,
    appid BIGINT REFERENCES applications(appid),
    skill_score INT DEFAULT 0,
    employments_score INT DEFAULT 0,
    qualification_score INT DEFAULT 0,
    experience_score INT DEFAULT 0,
    assessment_score INT DEFAULT 0,
    score INT DEFAULT 0
)

CREATE TABLE delegations (
    taskid BIGSERIAL PRIMARY KEY,
    appid BIGINT REFERENCES applications(appid),
    jobid BIGINT REFERENCES jobs(jobid),
    assigned_by VARCHAR(255),
    task_description TEXT,
    assigned_to VARCHAR(255),
    due_date DATE,
    task_status VARCHAR(10) DEFAULT 'Pending'
);

CREATE TABLE comments (
    commentid BIGSERIAL PRIMARY KEY,
    appid BIGINT REFERENCES applications(appid),
    commenter_name VARCHAR(255),
    comment_text TEXT,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* ----------------------------------------------------------- */

CREATE TABLE course (
    courseid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    institution VARCHAR(255),
    academic_rank VARCHAR(255),
    from_date DATE,
    to_date DATE,
    courses_taught TEXT
);

CREATE TABLE publication (
    publicationid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    type VARCHAR(255),
    title VARCHAR(255),
    status VARCHAR(255),
    pub_year INTEGER,
    journal VARCHAR(255),
    citation TEXT,
    url VARCHAR(255)
);

CREATE TABLE postgraduate_supervision (
    supervisionid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    student_name VARCHAR(255),
    thesis_title VARCHAR(255),
    year_published INTEGER
);

CREATE TABLE research_grants (
    grantid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    role VARCHAR(255),
    project_title VARCHAR(255),
    funded_by VARCHAR(255),
    budget VARCHAR(255),
    from_year INTEGER,
    to_year INTEGER
);

CREATE TABLE research_consultation_contracts (
    contractid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    consultancy_title VARCHAR(255),
    organization VARCHAR(255),
    from_year INTEGER,
    to_year INTEGER,
    contract_amount VARCHAR(255)
);

CREATE TABLE committee_participation (
    participationid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    type VARCHAR(255),
    title VARCHAR(255),
    institution VARCHAR(255),
    from_year INTEGER,
    to_year INTEGER
);

CREATE TABLE events_organized (
    eventid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    event_title VARCHAR(255),
    from_date DATE,
    to_date DATE,
    audience_profile VARCHAR(255),
    institution VARCHAR(255),
    country VARCHAR(255)
);

CREATE TABLE professional_memberships (
    membershipid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    type VARCHAR(255),
    organization VARCHAR(255),
    organization_country VARCHAR(255),
    role VARCHAR(255),
    from_year INTEGER,
    to_year INTEGER
);

CREATE TABLE academic_accreditation_qa_participations (
    accreditationid BIGSERIAL PRIMARY KEY,
        userid BIGINT REFERENCES accounts(userid),       
    accrediting_organization VARCHAR(255),
    institution VARCHAR(255),
    role VARCHAR(255),
    accreditation_date DATE
);
