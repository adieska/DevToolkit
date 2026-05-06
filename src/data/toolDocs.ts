export const TOOL_DOCS: Record<string, string> = {
  'sql-prettify': `
# SQL Formatter

The SQL Formatter helps you turn messy, minified, or poorly indented SQL queries into clean, readable, and professional code.

## How to Use
1. Paste your SQL query into the input area.
2. The formatted result will appear instantly in the output section.
3. You can adjust the indentation size using the slider in the controls.

## Features
- **Auto-Formatting**: Automatically aligns keywords like SELECT, FROM, JOIN, and WHERE.
- **Keyword Casing**: Standardizes keywords to uppercase for better readability.
- **Indentation Control**: Customizable tab/space width.

## Use Cases
- Debugging complex JOIN queries.
- Prettifying SQL before committing to a repository.
- Reviewing legacy database scripts.
`,
  'jwt-decode': `
# JWT Decoder

Securely decode JSON Web Tokens (JWT) to inspect their header and payload information without validating the signature.

## How to Use
1. Paste your encoded JWT (header.payload.signature) into the input field.
2. The tool will parse the Base64Url encoded segments.
3. The JSON representation of the Header and Claims will be displayed.

## Features
- **Header Inspection**: See algorithm (alg) and type (typ).
- **Claim Viewer**: View user ID, expiration time (exp), and custom claims.
- **Instant Result**: No server-side processing; decoding happens entirely in your browser.

## Use Cases
- Verifying the expiration time of an authentication token.
- Checking if custom scopes or roles are present in the JWT.
- Debugging "Unauthorized" errors in API development.
`,
  'subnet-calculator': `
# Subnet Calculator

Calculate network ranges, broadcast addresses, and usable host bits for any IPv4 CIDR block.

## How to Use
1. Enter an IP address followed by CIDR notation (e.g., 192.168.1.10/24).
2. The calculator will determine the network details immediately.

## Key Information Provided
- **CIDR & Mask**: The network prefix and its decimal equivalent.
- **Network & Broadcast**: The start and end bound of the subnet.
- **Usable Range**: The specific addresses assignable to devices.
- **Host Count**: Total number of addresses and usable host capacity.

## Use Cases
- Planning LAN infrastructure for offices.
- Setting up firewall rules and VPC routing.
- Studying for networking certifications like CCNA.
`,
  'toml-to-json': `
# TOML to JSON Converter

Seamlessly transform TOML (Tom's Obvious, Minimal Language) configuration files into JSON format.

## How to Use
1. Paste your TOML configuration into the input area.
2. The resulting JSON object will be generated.

## Why use TOML?
TOML is designed to be easy to read and write for humans, making it popular for project configs (like pyproject.toml or Cargo.toml). JSON, however, is the standard for web APIs and data interchange.

## Use Cases
- Converting config files for use in web applications.
- Migrating project settings between different language ecosystems.
- Validating the structure of a TOML file.
`,
  'json-prettify': `
# JSON Formatter

Format and validate your JSON data to make it readable for humans.

## How to Use
1. Paste your raw or minified JSON into the input.
2. The tool will automatically attempt to parse and prettify it.
3. Use the indentation slider to switch between 2-space or 4-space indentation.

## Features
- **Validation**: Alerts you if the JSON structure is invalid.
- **Minification**: Use the 'Minify' button to strip all whitespace for production use.
- **Auto-Fixing**: Simple quoting issues are often handled automatically.

## Use Cases
- Inspecting API response payloads.
- Fixing "wall of text" JSON files for easier debugging.
- Preparing configuration files for human review.
`,
  'uuid-generator': `
# UUID Generator

Generate Universally Unique Identifiers (UUID) version 4, which are cryptographically random.

## How to Use
1. Select the number of UUIDs you need (if applicable).
2. Click the 'Generate' button to produce a new unique ID.

## What is a UUID?
A UUID is a 128-bit number used to identify information in computer systems. Version 4 provides high entropy, meaning collisions are practically impossible.

## Use Cases
- Creating unique primary keys for database records.
- Generating session IDs or correlation IDs for logging.
- Naming temporary files or assets.
`,
  'password-generator': `
# Password Generator

Create highly secure, random passwords with customizable parameters to protect your accounts.

## How to Use
1. Set the desired length (default is 16).
2. Click 'Generate' to create a random string.
3. Toggle options for numbers, symbols, and uppercase letters.

## Security Tip
Always use long passwords (12+ characters) and a mix of character types. This makes "brute force" attacks statistically impossible for standard attackers.

## Use Cases
- Setting up new user accounts.
- Generating secret keys for API configurations.
- Rotating credentials for internal systems.
`,
  'cron-to-text': `
# Cron to Human

Translate complex cron expressions (like \`0 0 * * 1\`) into plain, readable English.

## How to Use
1. Enter your cron expression (standard 5 or 6 field format).
2. The tool will explain exactly when the task will run.

## Example
- Input: \`*/15 * * * *\`
- Output: "Every 15 minutes"

## Use Cases
- Verifying scheduled tasks in a Crontab.
- Explaining backup schedules to non-technical stakeholders.
- Debugging unexpected task execution times.
`,
  'base64-encode': `
# Base64 Encoder

Convert text or binary data into a Base64 encoded string, commonly used for embedding data in URLs or HTML.

## How to Use
1. Enter the plain text you want to encode in the Input buffer.
2. The Base64 string will be generated in the Result stream.

## Features
- **URL Safe**: Uses standard Base64 characters.
- **Binary Support**: Handles various character encodings.

## Use Cases
- Encoding images for inline CSS/HTML.
- Passing data in URL parameters where certain characters are forbidden.
- Simple obfuscation of configuration values.
`,
  'text-transform': `
# Case Converter

Quickly change the casing of your text between multiple formats like UPPERCASE, lowercase, and Title Case.

## How to Use
1. Paste your text into the Input Buffer.
2. Use the buttons in the controls section (e.g., "UPPERCASE", "Title Case") to apply the transformation.

## Supported Formats
- **UPPERCASE**: Converts all letters to capitals.
- **lowercase**: Converts all letters to lowercase.
- **Title Case**: Capitalizes the first letter of each significant word.
- **Sentence case**: Capitalizes only the first letter of the first word.
- **iNvErT cAsE**: Flips lowercase to uppercase and vice versa.
- **kebab-case**: hyphenated-lowercase-words.
- **camelCase**: lowercaseFirstWordWithCapitalizedSuffixes.

## Use Cases
- Cleaning up headers for a blog post.
- Normalizing user input data.
- Converting variable names for different programming conventions.
`,
  'hash-generator': `
# Hash Generator

Generate secure cryptographic hashes for strings using multiple industry-standard algorithms.

## How to Use
1. Select your desired algorithm (MD5, SHA1, SHA256, etc.) from the dropdown.
2. Type or paste your text into the input field.
3. The hexadecimal digest will appear in the output.

## Available Algorithms
- **MD5**: Fast but vulnerable to collisions (use for non-security checksums).
- **SHA-256**: High security, recommended for password hashing and data integrity.
- **SHA-512**: Extremely secure, used in high-security environments.

## Use Cases
- Verifying file integrity.
- Creating unique identifiers for data objects.
- Checking if two pieces of data are identical without comparing the full content.
`,
  'image-converter': `
# Image Converter

Convert images between popular formats like PNG, JPEG, and WebP entirely in your browser.

## How to Use
1. Upload your image by clicking the upload area or dragging a file.
2. Select your target format (PNG, JPEG, WebP).
3. Click "Execute Conversion".
4. Download the resulting file or copy it as a Base64 string if using the specific tool.

## Features
- **Privacy First**: No images are uploaded to any server; all processing remains on your device.
- **Quality Control**: Standard optimization settings are applied for web-ready output.

## Use Cases
- Converting high-res photos to WebP for faster websites.
- Extracting PNGs from complex formats for transparent backgrounds.
`,
  'unix-time': `
# Unix Timestamp Tool

A precision utility for converting between human dates and Unix Epoch timestamps.

## How to Use
- **Check Current**: Leave the input blank to see the real-time system timestamp.
- **Convert to Date**: Enter a number (e.g., \`1683370531\`) to see the human-readable UTC and Local time.
- **Convert to Unix**: Enter an ISO date string to get the equivalent Unix second.

## Use Cases
- Debugging database records that store timestamps as integers.
- Converting API response times for log analysis.
- Understanding "Time Since Epoch" values in programming.
`,
  'ip-lookup': `
# IP Lookup & Info

Identify your current IP address and retrieve basic network information.

## How to Use
1. Open the tool.
2. Your public-facing IP address and browser user agent info will be displayed automatically.

## Privacy Note
This tool uses public lookup APIs to determine your external IP. No sensitive personal data is stored.

## Use Cases
- Verifying if your VPN or Proxy is active.
- Identifying your network origin for server allow-listing.
- Troubleshooting connectivity issues.
`,
  'sort-lines': `
# Line Sorter

Organize your lists or data by sorting lines alphabetically or numerically.

## How to Use
1. Paste your list into the Input Buffer.
2. Choose between Ascending (A-Z) or Descending (Z-A) order.
3. The sorted list will appear instantly.

## Use Cases
- Organizing a list of names or items.
- Sorting CSS properties or unique keys in a config file.
- Cleaning up exported data.
`,
  'remove-duplicate-lines': `
# Duplicate Remover

Clean up your data by removing identical lines and keeping only unique entries.

## How to Use
1. Paste your text into the Input Buffer.
2. The tool will scan all lines and remove duplicates automatically.

## Use Cases
- Cleaning up mailing lists.
- Removing duplicate IDs from a log file.
- Normalizing datasets for analysis.
`,
  'word-count': `
# Word Count & Statistics

Get detailed metrics about your text, including word count, character count, and line count.

## Information Provided
- **Characters**: Total count (with and without spaces).
- **Words**: Total number of words detected.
- **Lines**: Total number of lines.
- **Paragraphs**: Groups of text separated by double newlines.

## Use Cases
- Checking length requirements for blog posts or social media.
- Analyzing the density of a document.
- Measuring the size of code snippets.
`,
  'html-prettify': `
# HTML Formatter

Clean up messy HTML code with proper indentation and structure.

## Features
- Standardizes tag indentation.
- Properly handles nested elements.
- Improves code readability for debugging.

## Use Cases
- Reviewing minified HTML from third-party sites.
- Tidying up generated markup.
- Preparing code for tutorials or documentation.
`,
  'css-prettify': `
# CSS Formatter

Format and indent CSS styles to make them easier to maintain.

## Features
- Aligns properties and values.
- Consistent bracing style.
- Visual hierarchy preservation.

## Use Cases
- Debugging complex style sheets.
- Prettifying minified vendor CSS.
- Standardizing team CSS styles.
`,
  'bcrypt-generator': `
# Bcrypt Generator

Generate or verify secure Bcrypt hashes for passwords. Bcrypt is a key-derivation function based on the Blowfish cipher.

## Features
- **Salt Generation**: Automatically generates a unique salt for each hash.
- **Work Factor**: Uses a standard cost (10 rounds) for high security.
- **Verification**: Test if a plain-text password matches a previously generated hash.

## Use Cases
- Testing backend password validation logic.
- Generating initial administrative passwords for databases.
- Understanding how modern password storage works.
`,
  'hmac-generator': `
# HMAC Generator

Calculate Hash-based Message Authentication Codes (HMAC) using a secret key and a hash function (like SHA-256).

## How to Use
1. Enter the message content.
2. Provide a secret key in the specific key field.
3. The resulting HMAC digest will be calculated instantly.

## Use Cases
- Verifying API request integrity.
- Implementing secure webhooks.
- Authenticating data without exposing private information.
`
};

