let webhookResponse = null;
const Redis = require('ioredis');
const redis = new Redis();

async function saveProjectData(webhookResponse) {
  try {
    const projectName = webhookResponse.project.name;
    const qualityGate = webhookResponse.qualityGate;

    await redis.hmset(`project:${projectName}`, {
      project_name: projectName,
      quality_gate: JSON.stringify(qualityGate),
    });

    const existingProjects = await redis.lrange('latest_projects', 0, -1);
    if (!existingProjects.includes(projectName)) {
      await redis.lpush('latest_projects', projectName);
      await redis.ltrim('latest_projects', 0, 3);
    }
    console.log('Data saved successfully.');
  } catch (error) {
    console.error('Error saving data to Redis:', error);
  }
}

exports.sonarQubeWebhook = async (req, res) => {
  const webhookResponse = req.body;
  await saveProjectData(webhookResponse);
  console.log('Webhook received:', webhookResponse);
  res.status(200).send('Webhook received');
};

exports.sendSonarWebhookResponse = async (req, res) => {
  const latestProjects = await redis.lrange('latest_projects', 0, -1);

  const projectsData = [];

  for (const projectName of latestProjects) {
    const projectData = await redis.hgetall(`project:${projectName}`);
    if (projectData.quality_gate) {
      projectData.quality_gate = JSON.parse(projectData.quality_gate);
    }
    projectsData.push({
      project_name: projectData.project_name,
      quality_gate: projectData.quality_gate,
    });
  }
  res.json(projectsData);
};
