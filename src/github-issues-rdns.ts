/**
 * GitHub Issues rDNS
 *
 * Copyright (c) 2020 Tomohisa Oda
 */
import { Github, SeachResult } from './github'
import { GoogleDns } from './google-dns'

/**
 * Github Issues Rdns
 */
export class GithubIssuesRdns {
  private gh: Github
  private config: Config
  private issues: SeachResult
  private reversed: Reversed[]

  private get github(): Github {
    if (this.gh === undefined) {
      this.gh = new Github(this.config.github)
    }
    return this.gh
  }

  public constructor(c: Config) {
    this.config = c
    this.issues = {
      total_count: 0,
      incomplete_results: false,
      items: []
    }
    this.reversed = []
  }

  public run(): void {
    this.fetch()
    if (this.issues.total_count === 0) {
      console.log('target issues not found')
      return
    }
    this.doRdns()
    for (const r of this.reversed) {
      console.log(r)
      this.commentToIssue(r)
      this.addDstLabel(r)
    }
  }

  public fetch(): void {
     const query = [
       'is:issue',
       'is:open',
       `label:${this.config.srcLabel}`,
       `-label:${this.config.dstLabel}`,
       `repo:${this.config.repo}`,
     ]
     this.issues = this.github.searchIssues(query.join('+'))
  }

  public doRdns() {
    const oct = '(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'
    const cidr = '(\\/(3[0-2]|[12][0-9]|[1-9]))'
    const ipRegex = new RegExp(`${oct}\\.${oct}\\.${oct}\\.${oct}${cidr}?`, 'g')
    const cidrRegex = /(\/(3[0-2]|[12][0-9]|[1-9]))|((\.0)?(\.0)?\.0)$/
    const privateIpRegex = /^(10\.|172\.[1-3]|192\.168\.|127\.0\.0\.1)/

    for (const i of this.issues.items) {
      const ips = i.body.match(ipRegex)
      if (ips === null) {
        console.log('ip addresses not found')
        continue
      }

      const ipsWithouts = ips.filter(v => !cidrRegex.test(v))
        .filter(v => !privateIpRegex.test(v))
        .filter((el, i, s) => { return s.indexOf(el) === i })
      for (const ip of ipsWithouts) {
        if (!ip) {
          continue
        }
        const result = GoogleDns.reverse(ip)
        const names = (result === undefined || result.Answer === undefined) ?
          ['name not found'] : result.Answer.map(v => v.data)
        this.reversed.push({number: i.number, title: i.title, ip, names})
      }
    }
  }

  public defaultTemplate(r: Reversed): string {
    return `:name_badge: Resolved reverse DNS(${r.ip}):
~~~
${r.names.join('\n')}
~~~
:octocat: Commented by [GitHub Issues rDNS](${this.config.projectUrl})
`
  }

  public commentToIssue(r: Reversed) {
    const body = this.defaultTemplate(r)
    this.github.createIssueComment(this.config.repo, r.number, body)
  }

  public addDstLabel(r: Reversed) {
    this.github.addLabelsToIssue(this.config.repo, r.number, [this.config.dstLabel])
  }
}

type GithubConfig = {
  token: string
  apiEndpoint?: string
}

type Config = {
  github: GithubConfig
  projectUrl: string
  repo: string
  srcLabel: string
  dstLabel: string
}

type Reversed = {
  number: number
  title: string
  ip: string
  names: string[]
}
