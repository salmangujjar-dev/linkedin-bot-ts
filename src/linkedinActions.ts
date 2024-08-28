import { Page } from "puppeteer";

export class LinkedInActions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async login(email: string, password: string): Promise<void> {
    await this.page.goto("https://www.linkedin.com/login");
    await this.page.type("#username", email);
    await this.page.type("#password", password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation();
  }

  async logout(): Promise<void> {
    try {
      await this.page.goto("https://www.linkedin.com/m/logout/");
      await this.page.waitForSelector(
        'h1:text("Welcome to your professional community")',
        { timeout: 10000 }
      );
    } catch (e) {
      console.error(e);
    }
  }

  async initiate(url: string, message: string): Promise<void> {
    await this.page.goto(url);
    const username = url.split("/in/")[1].replace("/", "");
    const name = await this.page.$eval(
      "h1.text-heading-xlarge",
      (el) => el.textContent || ""
    );
    console.log(`Name: ${name} - ${username}`);

    if (await this.checkPendingRequest(name, username)) return;

    const isWithNote = true;

    if (!(await this.alreadyConnected(name, username))) {
      await this.tryConnect(name, username, isWithNote, message);
    } else {
      await this.message(username, message);
    }
  }

  private async checkPendingRequest(
    name: string,
    username: string
  ): Promise<boolean> {
    try {
      await this.page.waitForSelector(
        `button[aria-label="Pending, click to withdraw invitation sent to ${name}"]`,
        { timeout: 5000 }
      );
      console.log(`${username} - Already has a pending request.`);
      return true;
    } catch {
      console.log(
        `${username} - No Pending request found. Initiating Invitation Request.`
      );
      return false;
    }
  }

  private async alreadyConnected(
    name: string,
    username: string
  ): Promise<boolean> {
    try {
      await this.page.waitForSelector(
        `div[aria-label="Remove your connection to ${name}"]`,
        { timeout: 5000 }
      );
      console.log(`${username} - User is already Connected.`);
      return true;
    } catch {
      console.log(`${username} - User Not Connected.`);
      return false;
    }
  }

  private async tryConnect(
    name: string,
    username: string,
    isWithNote: boolean,
    message: string
  ): Promise<boolean> {
    try {
      await this.inviteMethod1(name, username, isWithNote, message);
      return true;
    } catch {
      console.log(
        `${username} - Connect button not found. Trying alternative method.`
      );
      try {
        await this.inviteMethod2(name, username, isWithNote, message);
        return true;
      } catch {
        console.log(
          `${username} - Failed to connect. User might be already connected.`
        );
        return false;
      }
    }
  }

  private async inviteModalAction(
    username: string,
    isWithNote: boolean,
    message: string
  ): Promise<void> {
    if (isWithNote) {
      await this.page.click('button[aria-label="Add a note"]');
      console.log(`${username} - Adding a note`);
      await this.page.type("#custom-message", message);
      await this.page.click('button[aria-label="Send invitation"]');
      console.log(`${username} - Clicked on Send successfully!`);
    } else {
      await this.page.click('button[aria-label="Send without a note"]');
    }
  }

  private async inviteMethod1(
    name: string,
    username: string,
    isWithNote: boolean,
    message: string
  ): Promise<void> {
    await this.page.click(`button[aria-label="Invite ${name} to connect"]`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.inviteModalAction(username, isWithNote, message);
    console.log(`${username} - Invitation sent successfully!`);
  }

  private async inviteMethod2(
    name: string,
    username: string,
    isWithNote: boolean,
    message: string
  ): Promise<void> {
    await this.page.click('button[aria-label="More actions"]');
    console.log(`${username} - Clicked on More Button!`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.page.click(`div[aria-label="Invite ${name} to connect"]`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.inviteModalAction(username, isWithNote, message);
    console.log(
      `${username} - Invitation sent successfully using alternative method!`
    );
  }

  async message(username: string, message: string): Promise<void> {
    await this.page.click(
      "button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action"
    );
    console.log(`${username} - Message Button Clicked.`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.page.evaluate(() => {
      const hiddenArea = document.querySelector(
        'div[aria-hidden="true"].msg-form__placeholder'
      );
      if (hiddenArea) hiddenArea.remove();
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.page.focus('div[aria-label="Write a message…"] p');

    // Clear any existing text (if necessary)
    await this.page.keyboard.down("Control");
    await this.page.keyboard.press("A");
    await this.page.keyboard.up("Control");
    await this.page.keyboard.press("Backspace");

    await this.page.type('div[aria-label="Write a message…"] p', message);

    // Send Text
    await this.page.keyboard.down("Control");
    await this.page.keyboard.press("Enter");
    await this.page.keyboard.up("Control");

    console.log(`${username} - Message sent Successfully!`);
    await this.page.keyboard.press("Escape");
  }
}
