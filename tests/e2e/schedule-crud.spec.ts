import { test, expect } from '@playwright/test';

test.describe('일정 관리 CRUD E2E', () => {
  test('Create a new schedule', async ({ page }) => {
    await page.goto('/');
    // 일정 추가
    await page.goto('http://localhost:5173/');
    await page.getByRole('textbox', { name: '제목' }).click();
    await page.getByRole('textbox', { name: '제목' }).fill('일정추가');
    await page.getByRole('textbox', { name: '제목' }).press('Tab');
    await page.getByRole('textbox', { name: '제목' }).fill('일정추가');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-05');
    await page.getByRole('textbox', { name: '시작 시간' }).click();
    await page.getByRole('textbox', { name: '시작 시간' }).fill('12:30');
    await page.getByRole('textbox', { name: '종료 시간' }).click();
    await page.getByRole('textbox', { name: '종료 시간' }).press('Tab');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('13:30');
    await page.getByRole('textbox', { name: '설명' }).click();
    await page.getByRole('textbox', { name: '설명' }).fill('설명');
    await page.getByRole('textbox', { name: '설명' }).press('Tab');
    await page.getByRole('textbox', { name: '설명' }).fill('설명');
    await page.getByRole('textbox', { name: '위치' }).fill('위치');
    await page.getByRole('textbox', { name: '위치' }).press('Tab');
    await page.getByRole('textbox', { name: '위치' }).fill('위치');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '개인-option' }).click();
    await page.getByTestId('event-submit-button').click();

    // 일정이 이벤트 리스트에 추가되었는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('일정추가')).toBeVisible({ timeout: 3000 });
  });
});
