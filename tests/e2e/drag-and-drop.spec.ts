import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2ePath = join(__dirname, '../../src/__mocks__/response/e2e.json');

test.describe.serial('드래그 앤 드롭 (DND-kit) E2E', () => {
  test.beforeEach(async ({ page }) => {
    fs.writeFileSync(e2ePath, JSON.stringify({ events: [] }, null, 2));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('일반 일정 드래그 앤 드롭 - 날짜 변경', async ({ page }) => {
    // 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('드래그 테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    const monthView = page.getByTestId('month-view');
    const eventBox = monthView.locator('span').filter({ hasText: '드래그 테스트 일정' }).first();

    // 15일 셀에서 16일 셀으로 드래그
    const targetCell = monthView.locator('td').filter({ hasText: '16' }).first();

    // 드래그 앤 드롭 수행
    await eventBox.dragTo(targetCell);

    // 일정 업데이트 완료 대기 (TODO: 일정 업데이트 후 일정이 수정 되었습니다. 변경 필요)
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 16일로 이동했는지 확인
    const eventList = page.getByTestId('event-list');
    const movedEvent = eventList
      .locator('div')
      .filter({ hasText: '드래그 테스트 일정' })
      .filter({ hasText: '2025-11-16' })
      .first();
    await expect(movedEvent).toBeVisible({ timeout: 3000 });

    // 원래 날짜(15일)에는 일정이 없어야 함
    await expect(
      eventList
        .locator('div')
        .filter({ hasText: '드래그 테스트 일정' })
        .filter({ hasText: '2025-11-15' })
    ).toHaveCount(0, { timeout: 3000 });
  });
  /*
   NOTE: 페어 프로그래밍
   드라이버: 고다솜, 양진성
   네비게이터: 정나리, 이정민 */
  test('빈 영역으로 드래그 시 원래 위치로 복귀', async ({ page }) => {
    // 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    const monthView = page.getByTestId('month-view');
    const eventBox = monthView.locator('span').filter({ hasText: '테스트 일정' }).first();

    // 빈영역 셀
    const firstEmptyCell = monthView.locator('td:empty').first();
    await expect(firstEmptyCell).toBeVisible();

    // 드래그 앤 드롭 수행
    await eventBox.dragTo(firstEmptyCell);

    const movedEvent = monthView
      .locator('td')
      .filter({ hasText: '테스트 일정' })
      .filter({ hasText: '15' })
      .first();
    await expect(movedEvent).toBeVisible({ timeout: 3000 });
  });
});
