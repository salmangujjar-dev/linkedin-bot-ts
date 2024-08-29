# LinkedIn Bot TS

A bot for automating LinkedIn tasks using TypeScript, Puppeteer, and Express.

## Description

This project is a LinkedIn automation bot built with TypeScript. It uses Puppeteer for web scraping and automation, and Express for creating a simple API to interact with the bot. The bot can perform tasks such as sending connection invites and messages to LinkedIn profiles.

## Features

- Send connection invites with custom messages
- Send messages to existing connections
- Handle LinkedIn security checks using AI-powered CAPTCHA solving
- Express API for easy integration with other applications

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/linkedin-bot-ts.git
   cd linkedin-bot-ts
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your LinkedIn credentials and other necessary environment variables:

   ```
   LINKEDIN_EMAIL=your_email@example.com
   LINKEDIN_PASSWORD=your_password
   AZURE_OPENAI_API_KEY=your_azure_openai_api_key
   AZURE_OPENAI_API_VERSION=your_azure_openai_api_version
   AZURE_OPENAI_API_DEPLOYMENT_NAME=your_azure_openai_deployment_name
   AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
   IS_COOKIE_LOGIN=true
   ```

   Note: Set `IS_COOKIE_LOGIN` to `true` if you want to use cookie-based login, or `false` for regular login.

4. If using cookie-based login (`IS_COOKIE_LOGIN=true`), create a `cookies.json` file in the root directory with your LinkedIn cookies. The file should contain an array of cookie objects:

   ```json
   [
     {
       "name": "cookie_name",
       "value": "cookie_value",
       "domain": ".linkedin.com"
       // other cookie properties...
     }
     // more cookies...
   ]
   ```

## Usage

1. Start the server:

   ```
   npm start
   ```

2. The server will start on `http://localhost:3000` (or the port specified in your environment variables).

3. To send invites and messages, make a POST request to `/linkedin/send_invites` with the following JSON body:
   ```json
   {
     "urls": [
       "https://www.linkedin.com/in/profile1",
       "https://www.linkedin.com/in/profile2"
     ],
     "messages": ["Custom message for profile1", "Custom message for profile2"]
   }
   ```

## Project Structure

- `main.ts`: Entry point of the application, sets up the Express server
- `src/linkedinBot.ts`: Main bot class that orchestrates the automation
- `src/linkedinActions.ts`: Contains specific LinkedIn actions (login, send invite, etc.)
- `src/securityCheck.ts`: Handles LinkedIn security checks and CAPTCHA solving
- `src/llmUtils.ts`: Sets up the language model for CAPTCHA solving

## Scripts

- `npm start`: Starts the application
- `npm run lint`: Runs ESLint to check and fix code style issues
- `npm run type-check`: Runs TypeScript compiler to check for type errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Disclaimer

This bot is for educational purposes only. Use of this bot may violate LinkedIn's terms of service. Use at your own risk.
