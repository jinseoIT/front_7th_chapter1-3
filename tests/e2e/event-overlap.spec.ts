import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

import { getCurrentDate } from '../../src/utils/dateUtils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2ePath = join(__dirname, '../../src/__mocks__/response/e2e.json');

test.describe.serial('일정 겹침 처리 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json을 빈 배열로 초기화
    fs.writeFileSync(e2ePath, JSON.stringify({ events: [] }, null, 2));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('일정 생성 시 겹침 감지 및 다이얼로그 표시', async ({ page }) => {
    const date = getCurrentDate(15);
    // 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('기존 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(date);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 겹치는 일정 생성 시도
    await page.getByRole('textbox', { name: '제목' }).fill('겹치는 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(date);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:30'); // 겹침
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:30'); // 겹침
    await page.getByTestId('event-submit-button').click();

    // 겹침 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 3000 });

    const eventList = page.getByTestId('event-list');
    // 겹치는 일정 목록에 표시
    await expect(eventList.getByText('기존 일정')).toBeVisible({ timeout: 3000 });

    // 취소 버튼 클릭
    await page.getByRole('button', { name: '취소' }).click();

    // 일정이 생성되지 않았는지 확인
    await expect(eventList.getByText('겹치는 일정')).not.toBeVisible();
  });

  test('일정 수정 시 겹침 감지', async ({ page }) => {
    const date = getCurrentDate(15);
    // 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('원본 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(date);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 두 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('다른 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(date);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('11:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('12:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 두 번째 일정의 수정 버튼 클릭
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '다른 일정' })
      .filter({ hasText: date })
      .first();

    await eventBox.getByRole('button', { name: 'Edit event' }).click();

    // 시간을 겹치도록 수정
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:30'); // 첫 번째 일정과 겹침
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:30');
    await page.getByTestId('event-submit-button').click();

    // 겹침 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 3000 });
    // 겹치는 일정 목록에 표시
    await expect(eventList.getByText('원본 일정')).toBeVisible({ timeout: 3000 });
  });

  test('겹침 다이얼로그에서 계속 진행 버튼 클릭 시 강제 생성', async ({ page }) => {
    const date = getCurrentDate(15);
    // 기존 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('기존 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(date);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 겹치는 일정 생성 시도
    await page.getByRole('textbox', { name: '제목' }).fill('강제 생성 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(date);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:30');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:30');
    await page.getByTestId('event-submit-button').click();

    // 겹침 다이얼로그 확인
    await expect(page.getByText('일정 겹침 경고')).toBeVisible({ timeout: 3000 });

    // 확인 버튼 클릭 (강제 생성)
    await page.getByRole('button', { name: '계속 진행' }).click();

    // 일정이 생성되었는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('강제 생성 일정')).toBeVisible({ timeout: 3000 });
  });
});
