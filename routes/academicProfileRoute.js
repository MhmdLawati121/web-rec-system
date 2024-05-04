const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const multer = require('multer'); // Middleware for handling multipart/form-data
const upload = multer(); // Initialize multer

router.post("/add-course", upload.none(), async (req, res) => {
    const { institution, academicRank, fromDate, toDate, courses } = req.body;
    if (!institution || !academicRank || !fromDate || !toDate || !courses) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO course (userid, institution, academic_rank, from_date, to_date, courses_taught)
        VALUES ($1, $2, $3, $4, $5, $6)`, [req.session.userId, institution, academicRank, fromDate, toDate, courses]);
        res.status(200).json({ message: 'Course added successfully' });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ error: 'Failed to add course' });
    }
});

// Add publication
router.post("/add-publication", upload.none(), async (req, res) => {
    const { type, title, state, pubYear, journal, citation, url } = req.body;
    if (!type || !title || !state || !pubYear || !journal || !citation || !url) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO publication (userid, type, title, status, pub_year, journal, citation, url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [req.session.userId, type, title, state, pubYear, journal, citation, url]);
        res.status(200).json({ message: 'Publication added successfully' });
    } catch (error) {
        console.error('Error adding publication:', error);
        res.status(500).json({ error: 'Failed to add publication' });
    }
});

// Add postgraduate supervision
router.post("/add-supervision", upload.none(), async (req, res) => {
    const { studentName, thesis, year } = req.body;
    if (!studentName || !thesis || !year) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO postgraduate_supervision (userid, student_name, thesis_title, year_published)
        VALUES ($1, $2, $3, $4)`, [req.session.userId, studentName, thesis, year]);
        res.status(200).json({ message: 'Postgraduate supervision added successfully' });
    } catch (error) {
        console.error('Error adding postgraduate supervision:', error);
        res.status(500).json({ error: 'Failed to add postgraduate supervision' });
    }
});

// Add research grants
router.post("/add-research", upload.none(), async (req, res) => {
    const { role, projectTitle, fundedBy, budget, fromYear, toYear } = req.body;
    if (!role || !projectTitle || !fundedBy || !budget || !fromYear || !toYear) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO research_grants (userid, role, project_title, funded_by, budget, from_year, to_year)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.session.userId, role, projectTitle, fundedBy, budget, fromYear, toYear]);
        res.status(200).json({ message: 'Research grant added successfully' });
    } catch (error) {
        console.error('Error adding research grant:', error);
        res.status(500).json({ error: 'Failed to add research grant' });
    }
});

// Add research consultation contracts
router.post("/add-consultancy", upload.none(), async (req, res) => {
    const { consultancyTitle, organization, fromYear, toYear, contractAmount } = req.body;
    if (!consultancyTitle || !organization || !fromYear || !toYear || !contractAmount) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO research_consultation_contracts (userid, consultancy_title, organization, from_year, to_year, contract_amount)
        VALUES ($1, $2, $3, $4, $5, $6)`, [req.session.userId, consultancyTitle, organization, fromYear, toYear, contractAmount]);
        res.status(200).json({ message: 'Research consultation contract added successfully' });
    } catch (error) {
        console.error('Error adding research consultation contract:', error);
        res.status(500).json({ error: 'Failed to add research consultation contract' });
    }
});

// Add committee participation
router.post("/add-position-committee", upload.none(), async (req, res) => {
    const { type, title, institution, fromYear, toYear } = req.body;
    if (!type || !title || !institution || !fromYear || !toYear) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO committee_participation (userid, type, title, institution, from_year, to_year)
        VALUES ($1, $2, $3, $4, $5, $6)`, [req.session.userId, type, title, institution, fromYear, toYear]);
        res.status(200).json({ message: 'Committee participation added successfully' });
    } catch (error) {
        console.error('Error adding committee participation:', error);
        res.status(500).json({ error: 'Failed to add committee participation' });
    }
});

// Add events organized
router.post("/add-event", upload.none(), async (req, res) => {
    const { eventTitle, fromDate, toDate, audienceProfile, institution, country } = req.body;
    if (!eventTitle || !fromDate || !toDate || !audienceProfile || !institution || !country) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO events_organized (userid, event_title, from_date, to_date, audience_profile, institution, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.session.userId, eventTitle, fromDate, toDate, audienceProfile, institution, country]);
        res.status(200).json({ message: 'Event organized added successfully' });
    } catch (error) {
        console.error('Error adding event organized:', error);
        res.status(500).json({ error: 'Failed to add event organized' });
    }
});

// Add professional memberships
router.post("/add-membership", upload.none(), async (req, res) => {
    const { type, organization, organizationCountry, role, fromYear, toYear } = req.body;
    if (!type || !organization || !organizationCountry || !role || !fromYear || !toYear) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO professional_memberships (userid, type, organization, organization_country, role, from_year, to_year)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.session.userId, type, organization, organizationCountry, role, fromYear, toYear]);
        res.status(200).json({ message: 'Professional membership added successfully' });
    } catch (error) {
        console.error('Error adding professional membership:', error);
        res.status(500).json({ error: 'Failed to add professional membership' });
    }
});

// Add academic accreditation / QA participations
router.post("/add-accreditation", upload.none(), async (req, res) => {
    const { accreditingOrganization, institution, role, accreditationDate } = req.body;
    if (!accreditingOrganization || !institution || !role || !accreditationDate) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await pool.query(`INSERT INTO academic_accreditation_qa_participations (userid, accrediting_organization, institution, role, accreditation_date)
        VALUES ($1, $2, $3, $4, $5)`, [req.session.userId, accreditingOrganization, institution, role, accreditationDate]);
        res.status(200).json({ message: 'Academic accreditation / QA participation added successfully' });
    } catch (error) {
        console.error('Error adding academic accreditation / QA participation:', error);
        res.status(500).json({ error: 'Failed to add academic accreditation / QA participation' });
    }
});


router.get('/getAcademicProfile', async (req, res) => {
    try {

        let userId;
        if (req.query.view === "user")
            userId = req.session.userId;
        else if (req.query.view === "admin")
            userId = 4;

        console.log(userId);


        // Retrieve data for each section
        const courses = await pool.query(`SELECT * FROM course WHERE userid = $1`, [userId]);
        const publications = await pool.query(`SELECT * FROM publication WHERE userid = $1`, [userId]);
        const postgraduateSupervisions = await pool.query(`SELECT * FROM postgraduate_supervision WHERE userid = $1`, [userId]);
        const researchGrants = await pool.query(`SELECT * FROM research_grants WHERE userid = $1`, [userId]);
        const researchConsultationContracts = await pool.query(`SELECT * FROM research_consultation_contracts WHERE userid = $1`, [userId]);
        const committeeParticipations = await pool.query(`SELECT * FROM committee_participation WHERE userid = $1`, [userId]);
        const eventsOrganized = await pool.query(`SELECT * FROM events_organized WHERE userid = $1`, [userId]);
        const professionalMemberships = await pool.query(`SELECT * FROM professional_memberships WHERE userid = $1`, [userId]);
        const academicAccreditations = await pool.query(`SELECT * FROM academic_accreditation_qa_participations WHERE userid = $1`, [userId]);

        // Construct an object containing data for each section
        const sectionData = {
            courses: courses.rows,
            publications: publications.rows,
            postgraduateSupervisions: postgraduateSupervisions.rows,
            researchGrants: researchGrants.rows,
            researchConsultationContracts: researchConsultationContracts.rows,
            committeeParticipations: committeeParticipations.rows,
            eventsOrganized: eventsOrganized.rows,
            professionalMemberships: professionalMemberships.rows,
            academicAccreditations: academicAccreditations.rows
        };

        // Send the section data to the client side
        res.status(200).json(sectionData);

    } catch (error) {
        console.error('Error displaying section tables:', error);
        res.status(500).json({ error: 'Failed to display section tables' });
    }
})

router.post('/deleteEntry', async (req, res) => {
    try {
        const { section, id } = req.body;
        console.log(section, id);

        let tableName = "";
        let idColumnName = "";

        switch (section) {
            case "courses":
                tableName = "course";
                idColumnName = "courseid";
                break;
            case "publications":
                tableName = "publication";
                idColumnName = "publicationid";
                break;
            case "postgraduateSupervisions":
                tableName = "postgraduate_supervision";
                idColumnName = "supervisionid";
                break;
            case "researchGrants":
                tableName = "research_grants";
                idColumnName = "grantid";
                break;
            case "researchConsultationContracts":
                tableName = "research_consultation_contracts";
                idColumnName = "contractid";
                break;
            case "professionalMemberships":
                tableName = "professional_memberships";
                idColumnName = "membershipid";
                break;
            case "eventsOrganized":
                tableName = "events_organized";
                idColumnName = "eventid";
                break;
            case "committeeParticipations":
                tableName = "committee_participation";
                idColumnName = "participationid";
                break;
            case "academicAccreditations":
                tableName = "academic_accreditation_qa_participations";
                idColumnName = "accreditationid";
                break;
            default:
                throw new Error("Invalid section name");
        }

        await pool.query(`DELETE FROM ${tableName} WHERE ${idColumnName} = $1`, [id]);

        res.status(200).json({ message: "Entry deleted successfully" });
    } catch (error) {
        console.error("Error deleting entry:", error);
        res.status(500).json({ error: "Failed to delete entry" });
    }
});


module.exports = router;
