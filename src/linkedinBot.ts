import puppeteer, { Browser, Page } from "puppeteer";

import { LinkedInActions } from "./linkedinActions";
import { setupLLM } from "./llmUtils";
import { checkSecurity } from "./securityCheck";

export class LinkedInBot {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private actions: LinkedInActions | null = null;

  async initialize(cookies?: any[]): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ["--start-fullscreen"],
    });
    this.page = await this.browser.newPage();
    if (cookies) {
      await this.page.setCookie(...cookies);
    }
    this.actions = new LinkedInActions(this.page);
  }

  async run(
    urls: string[],
    messages: string[],
    isCookieLogin = false,
    email?: string,
    password?: string
  ): Promise<void> {
    if (!this.browser || !this.page || !this.actions) {
      throw new Error("Bot not initialized");
    }

    try {
      if (isCookieLogin) {
        await this.page.goto("https://www.linkedin.com");
      } else {
        await this.actions.login(email!, password!);
        console.log("Login Successful!");
        await checkSecurity(this.page, setupLLM());
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));

      for (let i = 0; i < urls.length; i++) {
        try {
          console.log(`Proceeding with ${urls[i]}`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          await this.actions.initiate(urls[i], messages[i]);
        } catch (e) {
          console.error(`Error Occurred with ${urls[i]}: `, e);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      // console.log("Signing out");
      // await this.actions.logout();
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Finished Processing");
    } catch (e) {
      console.error("Error occurred: ", e);
      throw e;
    } finally {
      await this.browser.close();
    }
  }

  async closeBrowser(): Promise<void> {
    if (!this.browser) {
      throw new Error("Bot not initialized");
    }

    await this.browser.close();
  }
}
