import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { Page } from "puppeteer";

export async function checkSecurity(
  page: Page,
  llm: ChatOpenAI
): Promise<boolean> {
  try {
    try {
      await page.waitForSelector(
        'h1:text("Let\'s do a quick security check")',
        { timeout: 10000 }
      );
      console.log("Security Check header found.");
    } catch {
      console.log("No Security Check Found.");
      return true;
    }

    // Navigate through iframes (simplified for Puppeteer)
    await page.waitForSelector("#captcha-internal");
    const captchaFrame = await page
      .frames()
      .find((frame) => frame.name() === "captcha-internal");
    if (!captchaFrame) throw new Error("Captcha frame not found");

    await captchaFrame.waitForSelector(
      'button[aria-describedby*="descriptionVerify"]'
    );
    await captchaFrame.click('button[aria-describedby*="descriptionVerify"]');
    console.log("Clicked on Verify Button.");

    await captchaFrame.waitForSelector('div[id*="game"]');
    console.log("Game Loaded in iframe.");

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const screenshot = await page.screenshot({ encoding: "base64" });

    const messages = [
      new SystemMessage(
        "You are an intelligent assistant that solves puzzles with clarity and max success rate."
      ),
      new HumanMessage({
        content: [
          {
            type: "text",
            text: "Solve the puzzle. image indexes starts from 1 and moves from left to right and increment on each index change. I want the only response you should give is that integer and nothing else should be in response.",
          },
          {
            type: "image_url",
            image_url: `data:image/png;base64,${screenshot}`,
          },
        ],
      }),
    ];

    const aiMessage = await llm.invoke(messages);
    console.log(`Correct index is ${aiMessage.content}`);

    await captchaFrame.click(`li[id*="image${aiMessage.content}"] a`);

    console.log("Puzzle Solved Successfully!");
    return true;
  } catch (e) {
    console.error("Security Check Error.", e);
    throw e;
  }
}
