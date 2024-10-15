const express = require('express');

let app = express();

const router = express.Router();
//const authenticate = express.Router();

//const auth = require('../middlewares/auth');
const jiracontroller = require('../controllers/jiracontroller');
const sonarQubeController = require('../controllers/sonarQubeController');

//authentication
//authenticate.use(auth.authenticate);
router.get('/dms/v1', (req, res, next) => {
  res.json({ message: 'ok' });
});

router.get('/dms/v1/jira', jiracontroller.jira);
router.get('/dms/v1/projectSummary', jiracontroller.projectSummary);
router.get('/dms/v1/issueStatics', jiracontroller.issueStatics);
router.get('/dms/v1/userSummary', jiracontroller.userSummary);
router.get(
  '/dms/v1/storyTaskBugsCreationCompletion',
  jiracontroller.storyTaskBugsCreationCompletion
);
router.post('/dms/v1/sonarQubeWebhook', sonarQubeController.sonarQubeWebhook);
router.get(
  '/dms/v1/sonarQubeWebhookResponse',
  sonarQubeController.sendSonarWebhookResponse
);
app.use('', router);
//app.use('', authenticate);
module.exports = app;
