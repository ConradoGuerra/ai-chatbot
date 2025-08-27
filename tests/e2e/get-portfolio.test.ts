import { ChatPage } from '../pages/chat';
import { test, expect } from '../fixtures';

test.describe('Get a portfolio of stocks', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.createNewChat();
  });

  test('Call get_portfolio tool with valid tickers', async () => {
    await chatPage.sendUserMessage('Get portfolio for AAPL,GOOGL');
    await chatPage.isGenerationComplete();

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toMatch(/AAPL|GOOGL/i);
  });
});
