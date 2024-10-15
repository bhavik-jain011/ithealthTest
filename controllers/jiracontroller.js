const axios = require('axios');
const {
  getAllJiraProjects,
  getAllJiraEpics,
  getAllJiraIssues,
  getAllJiraIssuesWithUsers,
} = require('../middlewares/JiraApis');
const projectIssues = async (key) => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://sumanbha.atlassian.net//rest/api/2/search?jql=project=${key}&maxResults=1000`,
    headers: {
      Authorization:
        'Basic c3VtYW4ubWU4MEBnbWFpbC5jb206QVRBVFQzeEZmR0YwYUdGbWRXcGdhXzRlR2Ffa1JfTjhrVXQ4ZGd6MnZIekpBaFItdkJMVFhzM1JvZ2k2UWdvdGJvYXhKWDZSZloyeGhmVUxxQ1Q0bTFGamNUVkJJaTdvR1Z3M3ZtQkhrY2s2am1TNjZ0T3AwaDUzbzlzRkRSaTFNUmdFVjd5Q3R2eVBRdGF3YllsY0I3UVVDVlZYSnl4cF9feTkxTHhGaVFEdG9iNHByRXNud3o4PUEyREMyQjUy',
      Cookie:
        'atlassian.xsrf.token=20612d1012e8cd51d5717a65d3433e019fa7ca1e_lin',
    },
  };
  const response = await axios.request(config);
  //console.log(response.data.issues.length)
  return response.data.issues.length;
};
exports.jira = async (req, res, next) => {
  try {
    const response = await getAllJiraProjects();
    res.json(response.data);
  } catch (error) {
    return res.json(error);
  }
};

//projectSummary API
exports.projectSummary = async (req, res, next) => {
  try {
    const response = await getAllJiraEpics();
    let result = {};
    for (let i = 0; i < response.data.issues.length; i++) {
      const projectName = response.data.issues[i].fields.project.name;
      if (!result[projectName]) {
        result[projectName] = [];
      }
      result[projectName].push({
        EpicName: response.data.issues[i].key,
        EpicDescription: response.data.issues[i].fields.summary,
        Progress: Math.floor(Math.random() * (60 - 30 + 1)) + 30,
      });
    }
    res.json(result);
  } catch (error) {
    return res.json(error);
  }
};

//Issue Statics API
exports.issueStatics = async (req, res, next) => {
  try {
    const response = await getAllJiraIssues();
    let result = {};
    for (let i = 0; i < response.data.issues.length; i++) {
      const projectName = response.data.issues[i].fields.project.name;
      const projectCode = response.data.issues[i].fields.project.key;
      const status = response.data.issues[i].fields.status.name;
      // const NumberOfIssues = await projectIssues(response.data.issues[i].fields.project.key );
      if (!result[projectName]) {
        result[projectName] = {
          ProjectName: projectName,
          ProjectCode: projectCode,
          NumberOfIssues: 0,
          StatusCount: {},
        };
      }
      if (!result[projectName].StatusCount[status]) {
        result[projectName].StatusCount[status] = 0;
      }
      result[projectName].StatusCount[status]++;
      result[projectName].NumberOfIssues++;
    }
    res.json(Object.values(result));
  } catch (error) {
    return res.json(error);
  }
};

//userSummary API
exports.userSummary = async (req, res, next) => {
  try {
    const response = await getAllJiraIssuesWithUsers();
    let result = {};
    for (let i = 0; i < response.data.issues.length; i++) {
      const projectName = response.data.issues[i].fields.project.name;
      const projectCode = response.data.issues[i].fields.project.key;
      const assignee = response.data.issues[i].fields.assignee.displayName;
      const status = response.data.issues[i].fields.status.name;
      if (!result[projectName]) {
        result[projectName] = {
          ProjectName: projectName,
          ProjectCode: projectCode,
          Assignee: {},
        };
      }
      if (!result[projectName].Assignee[assignee]) {
        result[projectName].Assignee[assignee] = {
          IssuesAssigned: 0,
          IssuesDone: 0,
        };
      }
      if (status == 'Done') {
        result[projectName].Assignee[assignee].IssuesDone++;
      }
      result[projectName].Assignee[assignee].IssuesAssigned++;
    }
    res.json(Object.values(result));
  } catch (error) {
    return res.json(error);
  }
};

//StoryTaskBugsCreationCompletion API
exports.storyTaskBugsCreationCompletion = async (req, res, next) => {
  try {
    const response = await getAllJiraIssues();
    let result = {};
    for (const element of response.data.issues) {
      const projectName = element.fields.project.name;
      const storyTaskBugs = element.fields.issuetype.name;
      const status = element.fields.status.name;
      if (!result[projectName]) {
        result[projectName] = {
          ProjectName: projectName,
          StoryTaskBugs: {},
        };
      }
      if (!result[projectName].StoryTaskBugs[storyTaskBugs]) {
        result[projectName].StoryTaskBugs[storyTaskBugs] = {
          Total: 0,
          Resolved: 0,
          Completion: 0,
        };
      }
      let placeholder = result[projectName].StoryTaskBugs[storyTaskBugs];
      if (status == 'Done') {
        placeholder.Resolved++;
      }
      placeholder.Total++;
      placeholder.Completion =
        Math.round((placeholder.Resolved / placeholder.Total) * 100 * 100) /
        100;
    }
    res.json(Object.values(result));
  } catch (error) {
    return res.json(error);
  }
};
