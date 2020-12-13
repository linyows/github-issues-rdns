/**
 * GitHub Issues rDNS
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

/**
 * Github Client
 */
export class Github {
  private config: Config

  constructor(c: Config) {
    this.config = c
    if (this.config.apiEndpoint === undefined || this.config.apiEndpoint === '') {
      this.config.apiEndpoint = 'https://api.github.com/'
    }
  }

  public get headers(): Headers {
    return {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${this.config.token}`,
    }
  }

  public createIssueComment(repo: string, num: number, body: string): Comment {
    const res = UrlFetchApp.fetch(`${this.config.apiEndpoint}repos/${repo}/issues/${num}/comments`, {
      method: 'post' as const,
      headers: this.headers,
      payload: JSON.stringify({ body }),
    })
    return JSON.parse(res.getContentText())
  }

  public addLabelsToIssue(repo: string, num: number, labels: string[]): Label[] {
    const res = UrlFetchApp.fetch(`${this.config.apiEndpoint}repos/${repo}/issues/${num}/labels`, {
      method: 'post' as const,
      headers: this.headers,
      payload: JSON.stringify({ labels }),
    })
    return JSON.parse(res.getContentText())
  }

  public searchIssues(query: string): SeachResult {
    const res = UrlFetchApp.fetch(`${this.config.apiEndpoint}search/issues?q=${query}`, {
      method: 'get' as const,
      headers: this.headers,
    })
    return JSON.parse(res.getContentText())
  }
}

export type SeachResultItem = Issue & {
  score: number
  closed_at: null | string
  active_lock_reason: null | string
  performed_via_github_app: null | string
}

export type SeachResult = {
  total_count: number
  incomplete_results: boolean
  items: SeachResultItem[]
}

export type Config = {
  token: string
  apiEndpoint?: string
}

export type IssueOptions = {
  labels?: string
  since?: string
  sort?: string
  direction?: string
  state?: string
}

export type User = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export type Label = {
  id: number
  node_id: string
  url: string
  name: string
  color: string
  default: boolean
  description: string
}

export type Milestone = {
  url: string
  html_url: string
  labels_url: string
  id: number
  node_id: string
  number: number
  title: string
  description: string
  creator: User
  open_issues: number
  closed_issues: number
  state: string
  created_at: string
  updated_at: string
  due_on: string
  closed_at: null | string
}

export type Issue = {
  url: string
  repository_url: string
  labels_url: string
  comments_url: string
  events_url: string
  html_url: string
  id: number
  node_id: string
  number: number
  title: string
  user: User
  labels: Label[]
  state: string
  locked: boolean
  assignee: null | User
  assignees: User[]
  milestone: null | Milestone
  comments: number
  created_at: string
  updated_at: string
  author_association: string
  pull_request?: {
    url: string
    html_url: string
    diff_url: string
    patch_url: string
  }
  body: string
}

type Headers = {
  Authorization: string
  Accept: string
}

type Comment = {
  id: number
  node_id: string
  url: string
  html_url: string
  body: string
  user: User
  created_at: string
  updated_at: string
  issue_url: string
  author_association: string
}
