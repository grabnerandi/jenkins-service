import { DeploymentModel } from '../types/DeploymentModel';

//const jenkins = require('jenkins')({ baseUrl: process.env.JENKINS_URL });
const jenkins = require('jenkins')({ baseUrl: 'http://admin:AiTx4u8VyUV8tCKk@35.232.207.212:24711' });

export class JenkinsService {

  private static instance: JenkinsService;

  private constructor() {
  }

  static async getInstance() {
    if (JenkinsService.instance === undefined) {
      JenkinsService.instance = new JenkinsService();
    }
    return JenkinsService.instance;
  }

  async deployService(deployment: DeploymentModel) : Promise<boolean> {
    const deployed: boolean = false;

    new Promise(resolve => {
      jenkins.job.build({
        name: `/deploy`,
        parameters: {
          SERVICE: deployment.service,
          PROJECT: deployment.project,
          STAGE: deployment.stage,
          GITHUB_ORG: deployment.githubOrg,
        },
      }, function(err) {
        if (err) console.log(err);
        resolve();
      });
    });

    return deployed;
  }

  async startTests(deployment: DeploymentModel) : Promise<boolean> {
    let started: boolean = false;

    if(deployment.stage === 'dev') {
      new Promise(resolve => {
        jenkins.job.build({
          name: `/test.dev`,
          parameters: {
            SERVICE: deployment.service,
          },
        }, function(err) {
          if (err) console.log(err);
          resolve();
        });
      });
    } else if(deployment.stage === 'staging') {
      new Promise(resolve => {
        jenkins.job.build({
          name: `/test.staging`,
          parameters: {
            SERVICE: deployment.service,
          },
        }, function(err) {
          if (err) console.log(err);
          resolve();
        });
      });
    }

    return started;
  }

  async evaluateTests(deployment: DeploymentModel) : Promise<boolean> {
    let evaluated: boolean = false;

    new Promise(resolve => {
      jenkins.job.build({
        name: `/evaluate`,
        parameters: {
          SERVICE: deployment.service,
        },
      }, function(err) {
        if (err) console.log(err);
        resolve();
      });
    });

    return evaluated;
  }
}
