const axios = require('axios');
require('dotenv').config();
exports.getAllJiraProjects = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://sumanbha.atlassian.net/rest/api/latest/project',
    headers: {
      Authorization: `Basic ${process.env.JIRA_TOKEN}`,
      Cookie: `${process.env.JIRA_COOKIE}`,
    },
  };

  const result = await axios.request(config);
  return result;
};

exports.getAllJiraEpics = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://sumanbha.atlassian.net/rest/api/2/search?jql=issuetype = Epic',
    headers: {
      Authorization: `Basic ${process.env.JIRA_TOKEN}`,
      Cookie: `${process.env.JIRA_COOKIE}`,
    },
  };

  const result = await axios.request(config);
  return result;
};

exports.getAllJiraIssues = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://sumanbha.atlassian.net/rest/api/2/search?jql',
    headers: {
      Authorization: `Basic ${process.env.JIRA_TOKEN}`,
      Cookie: `${process.env.JIRA_COOKIE}`,
    },
  };

  const result = await axios.request(config);
  return result;
};

exports.getAllJiraIssuesWithUsers = async () => {
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://sumanbha.atlassian.net/rest/api/2/search?jql=assignee != null',
    headers: {
      Authorization: `Basic ${process.env.JIRA_TOKEN}`,
      Cookie: `${process.env.JIRA_COOKIE}`,
    },
  };

  const result = await axios.request(config);
  return result;
};
