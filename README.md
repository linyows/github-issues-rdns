GitHub Issues rDNS
==

This does a reverse DNS lookup of the IP in GitHub issue body and comments the result on GAS.

<a href="https://github.com/linyows/github-issues-rdns/actions" title="actions"><img src="https://img.shields.io/github/actions/workflow/status/linyows/github-issues-rdns/build.yml?branch=main&style=for-the-badge"></a>
<a href="https://github.com/google/clasp" title="clasp"><img src="https://img.shields.io/badge/built%20with-clasp-4285f4.svg?style=for-the-badge"></a>
<a href="https://github.com/linyows/github-issues-rdns/blob/master/LICENSE" title="MIT License"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge"></a>

Usage
-----

1. Deploy this
    ```sh
    $ npm i
    $ npx clasp login
    $ npx clasp create 'GitHub Issues rDNS' --rootDir ./src
    $ npx clasp push
    ```
1. Set script properties as ENV(File > Project properties > Script properties)
    - GITHUB_ACCESS_TOKEN
    - GITHUB_REPOSITORY
    - GITHUB_LABEL_SRC
    - GITHUB_LABEL_DST
    - GITHUB_API_ENDPOINT(optional)
1. Add project trigger(Edit > Current project's triggers > Add trigger)
    - Choose which function to run: `notify`
    - Which run at deployment: `head`
    - Select event source: `Time-driven`
    - Select type of time based trigger: `Minute timer`
    - Select hour interval: `Every minute`

Contribution
------------

1. Fork (https://github.com/linyows/github-issues-rdns/fork)
1. Create a feature branch
1. Commit your changes
1. Rebase your local changes against the master branch
1. Run test suite with the `npm ci` command and confirm that it passes
1. Create a new Pull Request

Author
------

[linyows](https://github.com/linyows)
