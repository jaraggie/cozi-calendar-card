# Security and privacy

The card reads calendar data from Home Assistant using the browser's existing Home Assistant session. It does not need Cozi credentials or a feed URL and does not send event data to an external service. Calendar text is displayed as text; it must not become executable HTML.

For a suspected vulnerability, use **Security → Report a vulnerability** on the public GitHub repository once private vulnerability reporting is enabled. Do not include working credentials, private subscription URLs, or real calendar data in a public issue. If private reporting is unavailable, open a public issue containing only a request for a private reporting channel and no exploit details or private data.

For ordinary display bugs, use the bug-report template with fictional or redacted events. Support currently targets the latest released card version; a response time is not guaranteed.
