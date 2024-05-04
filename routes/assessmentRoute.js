const express = require("express");
const path = require("path");
const router = express.Router();
const pool = require("../database/db");
const auth = require("../middleware/auth");
const requireAuth = auth.requireAuth;
const requireAdmin = auth.requireAdmin;
const requireHr = auth.requireHr;

router.post('/save-temporary', async (req, res) => {
  try {
    console.log(req.body);
    const { question, options, answer, imageData, jobId } = req.body;

    const optionsJSON = JSON.stringify(options);
    const answerJSON = JSON.stringify(answer);
    // Insert the data into the database
    const query = `
      INSERT INTO temp_assessments (question, options, answer, imageData)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const values = [question, optionsJSON, answerJSON, imageData];
    const result = await pool.query(query, values);

    const savedId = result.rows[0].id;
    res.status(200).json({ id: savedId });
  } catch (error) {
    console.error('Error saving assessment data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/save-assessment', async (req, res) => {
  try {
    console.log(req.body);
    const { jobId, question, options, answer, imageData } = req.body;

    const optionsJSON = JSON.stringify(options);
    const answerJSON = JSON.stringify(answer);
    // Insert the data into the database
    const query = `
      INSERT INTO assessments (jobid, question, options, answer, imageData)
      VALUES ($1, $2, $3, $4, $5);
    `;
    const values = [jobId, question, optionsJSON, answerJSON, imageData];
    const result = await pool.query(query, values);
    res.status(200).json({ message: "succesfully submitted" });
  } catch (error) {
    console.error('Error saving assessment data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/preview-assessment', requireAdmin, async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "assessment-preview.html"))
})

router.get('/take-assessment', requireAuth, async (req, res) => {
  res.sendFile(path.join(__dirname, "../public/html", "take-assessment.html"))
})

router.get('/getAssessmentData', requireAdmin, async (req, res) => {
  const tempId = req.query.assessmentData;
  const result = await pool.query(`SELECT question, options, answer, imageData FROM temp_assessments WHERE
  id = $1`, [tempId]);
  console.log(req.body);
  res.json(result.rows[0]);
})

router.get('/getAssessment', requireAuth, async (req, res) => {
  const tempId = req.query.jobId;
  const result = await pool.query(`SELECT id, question, options, answer, imageData FROM assessments WHERE
  jobid = $1`, [tempId]);
  console.log(result.rows[0]);
  res.json(result.rows);
})


router.post('/markAssessment', async (req, res) => {
  const tempId = req.query.jobId;
  const appId = req.query.appId;
  const result = await pool.query(`SELECT id, options, answer FROM assessments WHERE
  jobid = $1`, [tempId]);
  console.log(req.body);
  let candidateScore = 0;
  let idealScore = 0;
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i];
    if (row.answer.length === 1) {
      idealScore += 1;
    } else {
      idealScore += 0.5 * row.answer.length;
    }
    for (let j = 0; j < req.body.length; j++) {
      const [qid, oid] = req.body[j].split("_");
      if (qid === row.id) {
        const selectedOption = row.options[oid];
        if (row.answer.length === 1) {
          // Single correct answer
          if (selectedOption === row.answer[0]) {
            candidateScore += 1;
          }
        } else {
          // Multiple correct answers
          if (row.answer.includes(selectedOption)) {
            candidateScore += 0.5;
          } else {
            candidateScore -= 0.5;
          }
        }
      }
    }
  }
  console.log("Candidate scored: ", candidateScore);
  console.log("Out of: ", idealScore);
  const overallScore = Math.round(candidateScore / idealScore * 100);
  console.log("Overall Score: ", overallScore);

  const storeQuiz = await pool.query(`UPDATE scores SET assessment_score=$1 WHERE appid=$2`, [overallScore, appId]);

  res.json(overallScore);
});



module.exports = router;