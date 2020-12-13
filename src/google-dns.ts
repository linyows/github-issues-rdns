/**
 * GitHub Issues rDNS
 *
 * Copyright (c) 2020 Tomohisa Oda
 */

/**
 * Google DNS Client
 */
export class GoogleDns {
  public static resolve(name: string, type: string): Resolve {
    const url = `https://dns.google/resolve?name=${name}&type=${type}`
    const res = UrlFetchApp.fetch(url)
    return JSON.parse(res.getContentText())
  }

  public static reverse(ip: string): Resolve | undefined {
    const url = `https://dns.google.com/query?name=${ip}`
    const res = UrlFetchApp.fetch(url)
    const regex = /([0-9\.]+).in-addr.arpa/
    const name = res.getContentText().match(regex)

    if (name === null) {
      return undefined
    }

    return GoogleDns.resolve(name[0], 'PTR')
  }
}

type Question = {
  name: string
  type: number
}

type Answer = {
  name: string
  type: number
  TTL: number
  data: string
}

type Resolve = {
  Status: number
  TC: boolean
  RD: boolean
  RA: boolean
  AD: boolean
  CD: boolean
  Question: Question[]
  Answer?: Answer[]
  Comment: string
}
