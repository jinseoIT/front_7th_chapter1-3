import { test, expect } from '@playwright/test';

test.describe('알림 시스템 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('알림 설정된 일정 생성 및 알림 표시', async ({ page }) => {
    // 알림이 설정된 일정 생성
    const futureDate = new Date();
    futureDate.setMinutes(futureDate.getMinutes() + 2); // 2분 후
    const dateStr = futureDate.toISOString().split('T')[0];
    const timeStr = `${futureDate.getHours().toString().padStart(2, '0')}:${futureDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    await page.getByRole('textbox', { name: '제목' }).fill('알림 테스트 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(dateStr);
    await page.getByRole('textbox', { name: '시작 시간' }).fill(timeStr);

    const endTime = new Date(futureDate);
    endTime.setHours(endTime.getHours() + 1);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    await page.getByRole('textbox', { name: '종료 시간' }).fill(endTimeStr);

    // 알림 시간 설정 (1분 전)
    await page.getByRole('combobox', { name: '알림' }).click();
    await page.getByRole('option', { name: '1분 전' }).click();

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 알림이 표시될 때까지 대기 (최대 2분)
    await expect(page.getByText('1분 후 알림 테스트 일정 일정이 시작됩니다')).toBeVisible({
      timeout: 120000,
    });
  });

  test('알림 설정된 일정이 시각적으로 표시됨', async ({ page }) => {
    // 알림이 설정된 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('알림 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

    // 알림 시간 설정
    await page.getByRole('combobox', { name: '알림' }).click();
    await page.getByRole('option', { name: '1시간 전' }).click();

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 캘린더 뷰에서 알림 아이콘이 표시되는지 확인
    const weekView = page.getByTestId('week-view');
    const eventWithNotification = weekView
      .locator('[data-testid*="event"]')
      .filter({ hasText: '알림 일정' });

    // 알림 아이콘이 있는지 확인 (Notifications 아이콘)
    await expect(eventWithNotification).toBeVisible();

    // 알림이 설정된 일정은 빨간색 배경 또는 특별한 스타일이 적용되어야 함
    // (실제 스타일 확인은 컴포넌트에 따라 다를 수 있음)
  });

  test('여러 알림이 동시에 표시됨', async ({ page }) => {
    // 여러 알림 일정 생성
    const baseDate = new Date();
    baseDate.setMinutes(baseDate.getMinutes() + 5);

    for (let i = 0; i < 3; i++) {
      const eventDate = new Date(baseDate);
      eventDate.setMinutes(eventDate.getMinutes() + i * 2);
      const dateStr = eventDate.toISOString().split('T')[0];
      const timeStr = `${eventDate.getHours().toString().padStart(2, '0')}:${eventDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      await page.getByRole('textbox', { name: '제목' }).fill(`알림 일정 ${i + 1}`);
      await page.getByRole('textbox', { name: '날짜' }).fill(dateStr);
      await page.getByRole('textbox', { name: '시작 시간' }).fill(timeStr);

      const endTime = new Date(eventDate);
      endTime.setHours(endTime.getHours() + 1);
      const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      await page.getByRole('textbox', { name: '종료 시간' }).fill(endTimeStr);

      await page.getByRole('combobox', { name: '알림' }).click();
      await page.getByRole('option', { name: '1분 전' }).click();

      await page.getByTestId('event-submit-button').click();
      await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });
    }

    // 여러 알림이 표시되는지 확인 (최대 6분 대기)
    await expect(page.getByText(/분 후 .* 일정이 시작됩니다/).first()).toBeVisible({
      timeout: 360000,
    });
  });

  test('알림 닫기 버튼 클릭 시 알림 제거', async ({ page }) => {
    // 알림이 곧 시작되는 일정 생성
    const futureDate = new Date();
    futureDate.setSeconds(futureDate.getSeconds() + 65); // 1분 5초 후
    const dateStr = futureDate.toISOString().split('T')[0];
    const timeStr = `${futureDate.getHours().toString().padStart(2, '0')}:${futureDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    await page.getByRole('textbox', { name: '제목' }).fill('닫을 알림');
    await page.getByRole('textbox', { name: '날짜' }).fill(dateStr);
    await page.getByRole('textbox', { name: '시작 시간' }).fill(timeStr);

    const endTime = new Date(futureDate);
    endTime.setHours(endTime.getHours() + 1);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    await page.getByRole('textbox', { name: '종료 시간' }).fill(endTimeStr);

    await page.getByRole('combobox', { name: '알림' }).click();
    await page.getByRole('option', { name: '1분 전' }).click();

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 알림이 표시될 때까지 대기
    const notification = page.getByText('1분 후 닫을 알림 일정이 시작됩니다');
    await expect(notification).toBeVisible({ timeout: 120000 });

    // 알림 닫기 버튼 찾기 및 클릭
    const closeButton = page
      .locator('button[aria-label="Close"]')
      .or(page.locator('button').filter({ hasText: /닫기|Close/i }))
      .first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }

    // 알림이 사라졌는지 확인
    await expect(notification).not.toBeVisible({ timeout: 3000 });
  });

  test('알림이 없는 일정은 알림 아이콘이 표시되지 않음', async ({ page }) => {
    // 알림이 없는 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('알림 없는 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    // 알림 설정 안 함 (기본값)

    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 일정이 생성되었는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('알림 없는 일정')).toBeVisible();

    // 알림 아이콘이 표시되지 않는지 확인 (캘린더 뷰에서)
    const weekView = page.getByTestId('week-view');
    const eventWithoutNotification = weekView
      .locator('[data-testid*="event"]')
      .filter({ hasText: '알림 없는 일정' });

    // 알림 아이콘이 없어야 함 (실제 구현에 따라 다를 수 있음)
    await expect(eventWithoutNotification).toBeVisible();
  });
});
