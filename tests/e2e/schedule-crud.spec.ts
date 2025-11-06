import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2ePath = join(__dirname, '../../src/__mocks__/response/e2e.json');

test.describe.serial('일정 관리 CRUD E2E', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json을 빈 배열로 초기화
    fs.writeFileSync(e2ePath, JSON.stringify({ events: [] }, null, 2));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('일정 생성 - Create', async ({ page }) => {
    // 일정 추가
    await page.getByRole('textbox', { name: '제목' }).fill('테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-05');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('12:30');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('13:30');
    await page.getByRole('textbox', { name: '설명' }).fill('테스트 설명');
    await page.getByRole('textbox', { name: '위치' }).fill('테스트 위치');
    await page.getByRole('combobox', { name: '업무' }).click();
    await page.getByRole('option', { name: '개인-option' }).click();
    await page.getByTestId('event-submit-button').click();

    // 성공 메시지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 이벤트 리스트에 추가되었는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('테스트 일정')).toBeVisible({ timeout: 3000 });
  });

  test('일정 조회 - Read', async ({ page }) => {
    // 먼저 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('조회 테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-10');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 리스트에 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '조회 테스트 일정' })
      .filter({ hasText: '2025-11-10' })
      .first();

    // 일정 상세 정보 확인
    await expect(eventBox.getByText('조회 테스트 일정')).toBeVisible();
    await expect(eventBox.getByText('2025-11-10')).toBeVisible();
    await expect(eventBox.getByText('10:00')).toBeVisible();
    await expect(eventBox.getByText('11:00')).toBeVisible();
  });

  test('일정 수정 - Update', async ({ page }) => {
    // 먼저 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('수정 전 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('14:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정 수정 버튼 클릭
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '수정 전 일정' })
      .filter({ hasText: '2025-11-15' })
      .first();

    await eventBox.getByRole('button', { name: 'Edit event' }).click();

    // 일정 정보 수정
    await page.getByRole('textbox', { name: '제목' }).fill('수정 후 일정');
    await page.getByRole('textbox', { name: '설명' }).fill('수정된 설명');
    await page.getByTestId('event-submit-button').click();

    // 성공 메시지 확인
    await expect(page.getByText('일정이 수정되었습니다')).toBeVisible({ timeout: 3000 });

    // 수정된 일정 확인
    await expect(eventList.getByText('수정 후 일정')).toBeVisible({ timeout: 3000 });
    await expect(eventList.getByText('수정된 설명')).toBeVisible({ timeout: 3000 });
    // 원래 일정은 없어야 함
    await expect(eventList.getByText('수정 전 일정')).toHaveCount(0, { timeout: 3000 });
  });

  test('일정 삭제 - Delete', async ({ page }) => {
    // 먼저 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('삭제 테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-20');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('16:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('17:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정 삭제 버튼 클릭
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '삭제 테스트 일정' })
      .filter({ hasText: '2025-11-20' })
      .first();

    await eventBox.getByRole('button', { name: 'Delete event' }).click();

    // 삭제 확인 대화상자 확인 (일반 일정은 다이얼로그 없이 바로 삭제될 수도 있음)
    // 삭제 성공 메시지 확인
    await expect(page.getByText('일정이 삭제되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 리스트에서 제거되었는지 확인
    await expect(eventList.getByText('삭제 테스트 일정')).toHaveCount(0, { timeout: 3000 });
  });
});
