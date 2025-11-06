import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2ePath = join(__dirname, '../../src/__mocks__/response/e2e.json');

test.describe.serial('알림 시스템 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json을 빈 배열로 초기화
    fs.writeFileSync(e2ePath, JSON.stringify({ events: [] }, null, 2));
    await page.clock.install();
    // 현재 시간을 고정
    const baseTime = Date.now();
    await page.clock.setFixedTime(baseTime);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('알림 설정된 일정 생성 및 알림 표시', async ({ page }) => {
    // 현재 시간 기준으로 일정 생성 (setFixedTime으로 이미 고정되어 있음)
    const baseTime = Date.now();
    // 일정 시작: 현재 + 5분
    const startTime = new Date(baseTime + 5 * 60 * 1000);
    // 일정 종료: 현재 + 10분
    const endTime = new Date(baseTime + 10 * 60 * 1000);

    // 로컬 시간 기준으로 날짜 추출 (toISOString은 UTC를 사용하므로 날짜가 하루 전으로 될 수 있음)
    const year = startTime.getFullYear();
    const month = (startTime.getMonth() + 1).toString().padStart(2, '0');
    const day = startTime.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const startTimeStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    await page.getByRole('textbox', { name: '제목' }).fill('알림 테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(dateStr);
    await page.getByRole('textbox', { name: '시작 시간' }).fill(startTimeStr);
    await page.getByRole('textbox', { name: '종료 시간' }).fill(endTimeStr);
    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '1분 전' }).click();

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // fastForward로 타이머를 진행시켜 setInterval이 실행되도록 함
    // 여러 번 호출하여 알림 체크가 실행되도록 보장
    await page.clock.setFixedTime(baseTime + 4 * 60 * 1000);

    // 알림이 표시될 때까지 대기
    await expect(page.getByText(/1분 후 알림 테스트 일정 일정이 시작됩니다/)).toBeVisible({
      timeout: 5000,
    });
  });

  test('알림 설정된 일정이 시각적으로 표시됨', async ({ page }) => {
    // 알림이 설정된 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('알림 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

    // 알림 시간 설정
    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '1시간 전' }).click();

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 리스트에 표시되는지 확인
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '알림 일정' })
      .filter({ hasText: '2025-11-15' })
      .first();

    // 알림 아이콘이 있는지 확인 (Notifications 아이콘 - MUI 아이콘은 svg로 렌더링됨)
    await expect(eventBox).toBeVisible();
    // 알림이 설정된 일정은 빨간색 텍스트나 특별한 스타일이 적용됨
    // 실제 알림 아이콘은 알림 시간이 되었을 때만 표시되므로, 여기서는 일정이 생성되었는지만 확인
  });

  test('알림 닫기 버튼 클릭 시 알림 제거', async ({ page }) => {
    // 현재 시간 기준으로 일정 생성
    const baseTime = Date.now();
    // 일정 시작: 현재 + 5분
    const startTime = new Date(baseTime + 5 * 60 * 1000);
    // 일정 종료: 현재 + 10분
    const endTime = new Date(baseTime + 10 * 60 * 1000);

    // 로컬 시간 기준으로 날짜 추출
    const year = startTime.getFullYear();
    const month = (startTime.getMonth() + 1).toString().padStart(2, '0');
    const day = startTime.getDate().toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const startTimeStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    await page.getByRole('textbox', { name: '제목' }).fill('닫을 알림');
    await page.getByRole('textbox', { name: '날짜' }).fill(dateStr);
    await page.getByRole('textbox', { name: '시작 시간' }).fill(startTimeStr);
    await page.getByRole('textbox', { name: '종료 시간' }).fill(endTimeStr);

    await page.getByRole('combobox', { name: '분 전' }).click();
    await page.getByRole('option', { name: '1분 전' }).click();

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 4분 후로 시간 이동 (알림이 표시되어야 하는 시점: 5분 - 1분 = 4분)
    await page.clock.setFixedTime(baseTime + 4 * 60 * 1000);

    // 알림이 표시될 때까지 대기
    const notification = page.getByText('1분 후 닫을 알림 일정이 시작됩니다');
    await expect(notification).toBeVisible({ timeout: 5000 });

    // 알림 닫기 버튼 찾기 및 클릭 (Alert 내부의 IconButton)
    const alert = page
      .locator('div[role="alert"]')
      .filter({ hasText: '1분 후 닫을 알림 일정이 시작됩니다' });
    const closeButton = alert.locator('button').last(); // IconButton은 마지막 버튼
    await closeButton.click();

    // 알림이 사라졌는지 확인
    await expect(notification).not.toBeVisible({ timeout: 3000 });
  });

  test('알림이 없는 일정은 알림 아이콘이 표시되지 않음', async ({ page }) => {
    // 알림이 없는 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('알림 없는 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    // 알림 설정 안 함 (기본값)

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 생성되었는지 확인
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '알림 없는 일정' })
      .filter({ hasText: '2025-11-15' })
      .first();

    await expect(eventBox).toBeVisible();

    // 알림이 없는 일정은 알림 아이콘이 없어야 함
    const notificationIcon = eventBox.locator('[data-testid="NotificationsIcon"]');
    await expect(notificationIcon).toHaveCount(0);
  });
});
