/**
 *  Copyright 2023 Jing Yanming
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";

var privateKey = `
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgI3lxkVeWEahFcPn/
OtrRu2ybyF6LMb5w+91bmEMcNQ2hRANCAASgCE6Y6LGcPH5fNF5fZmHlTOCq+oFt
Enl7jzqvgpe23bwkbI5DJJC1eMkF4EPIK9GB6kSAdnXZZGaCM7jAOIpZ
-----END PRIVATE KEY-----
`;

var certificate = `
-----BEGIN CERTIFICATE-----
MIICjzCCAjWgAwIBAgIUDBfrKy2R7Vi4v59hHoaR5Y4nniwwCgYIKoZIzj0EAwIw
czELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh
biBGcmFuY2lzY28xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMT
E2NhLm9yZzEuZXhhbXBsZS5jb20wHhcNMTgwMjAxMDkwMzAwWhcNMTkwMjAxMDkw
ODAwWjBCMTAwDQYDVQQLEwZjbGllbnQwCwYDVQQLEwRvcmcxMBIGA1UECxMLZGVw
YXJ0bWVudDExDjAMBgNVBAMTBXVzZXIxMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcD
QgAEoAhOmOixnDx+XzReX2Zh5UzgqvqBbRJ5e486r4KXtt28JGyOQySQtXjJBeBD
yCvRgepEgHZ12WRmgjO4wDiKWaOB1zCB1DAOBgNVHQ8BAf8EBAMCB4AwDAYDVR0T
AQH/BAIwADAdBgNVHQ4EFgQUP2j/ub/qtY0LWnfsPy1Tkq+dH4QwKwYDVR0jBCQw
IoAgQjmqDc122u64ugzacBhR0UUE0xqtGy3d26xqVzZeSXwwaAYIKgMEBQYHCAEE
XHsiYXR0cnMiOnsiaGYuQWZmaWxpYXRpb24iOiJvcmcxLmRlcGFydG1lbnQxIiwi
aGYuRW5yb2xsbWVudElEIjoidXNlcjEiLCJoZi5UeXBlIjoiY2xpZW50In19MAoG
CCqGSM49BAMCA0gAMEUCIQCkRhlYr1EkjfBeLFFuQN70zwmGliUdlpC35g0Q+ITB
QQIgOU6XdxRuqq5F5XKuz+YioqW8NUjtGKc39RmzDyI9suw=
-----END CERTIFICATE-----
`;

var user2_key = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg3BX7CQPr0q92YRDT
waLQpLqSWTzlHeFUKf1Zn819VjShRANCAARB44EG+6xd9X5PlzQggrAXnqtpT1LK
zJvF8Bw9sS/XQDzC8Kwz3y6XTNXf0V8yqf2sirOrcihxw5NyWzE7cvDH
-----END PRIVATE KEY-----
`;

var user2_cert = `
-----BEGIN CERTIFICATE-----
MIICGTCCAb+gAwIBAgIQLVJt5yR4zYhmd/b3XdLxVjAKBggqhkjOPQQDAjBzMQsw
CQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy
YW5jaXNjbzEZMBcGA1UEChMQb3JnMS5leGFtcGxlLmNvbTEcMBoGA1UEAxMTY2Eu
b3JnMS5leGFtcGxlLmNvbTAeFw0xODA1MDkwODMxMTBaFw0yODA1MDYwODMxMTBa
MFsxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYwFAYDVQQHEw1T
YW4gRnJhbmNpc2NvMR8wHQYDVQQDDBZBZG1pbkBvcmcxLmV4YW1wbGUuY29tMFkw
EwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEQeOBBvusXfV+T5c0IIKwF56raU9Sysyb
xfAcPbEv10A8wvCsM98ul0zV39FfMqn9rIqzq3IoccOTclsxO3Lwx6NNMEswDgYD
VR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwKwYDVR0jBCQwIoAg4in18a7FDYmZ
cipi7GK6OWCDP4IRp5PBy6jKOgamVY8wCgYIKoZIzj0EAwIDSAAwRQIhANURRwCd
jjMo2FM0tMJByeID3Q8xK+qdSYnCyembOgWGAiBaSJBu76z+0yLf/OnEWWuKb2TK
S8g8H7nvDG+nfJ6pRQ==
-----END CERTIFICATE-----

`;

module.exports = {
  privateKey : privateKey,
  certificate : certificate,
  user2 : {
    privateKey : user2_key,
    certificate : user2_cert,
  },
};