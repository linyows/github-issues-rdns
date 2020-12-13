/**
 * GitHub Issues rDNS
 *
 * Copyright (c) 2020 Tomohisa Oda
 */
import { GithubIssuesRdns } from './github-issues-rdns'

/**
 * Main
 */
/* eslint @typescript-eslint/no-unused-vars: 0 */
function main() {
  const projectUrl = 'https://github.com/linyows/github-issues-rdns'
  const rdns = new GithubIssuesRdns({
    projectUrl,
    repo: PropertiesService.getScriptProperties().getProperty('GITHUB_REPOSITORY'),
    srcLabel: PropertiesService.getScriptProperties().getProperty('GITHUB_LABEL_SRC'),
    dstLabel: PropertiesService.getScriptProperties().getProperty('GITHUB_LABEL_DST'),
    github: {
      token: PropertiesService.getScriptProperties().getProperty('GITHUB_ACCESS_TOKEN'),
      apiEndpoint: PropertiesService.getScriptProperties().getProperty('GITHUB_API_ENDPOINT'),
    },
  })
  rdns.run()
}
