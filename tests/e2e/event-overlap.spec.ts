import { test, expect } from '@playwright/test';

test.describe('일정 겹침 처리 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('일정 생성 시 겹침 감지 및 다이얼로그 표시', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('기존 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 겹치는 일정 생성 시도
    await page.getByRole('textbox', { name: '제목' }).fill('겹치는 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:30'); // 겹침
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:30'); // 겹침
    await page.getByTestId('event-submit-button').click();

    // 겹침 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정이 겹칩니다')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('기존 일정')).toBeVisible(); // 겹치는 일정 목록에 표시

    // 취소 버튼 클릭
    await page.getByRole('button', { name: '취소' }).click();

    // 일정이 생성되지 않았는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('겹치는 일정')).not.toBeVisible();
  });

  test('일정 수정 시 겹침 감지', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('원본 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 두 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('다른 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('11:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('12:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 두 번째 일정을 클릭하여 수정
    const eventList = page.getByTestId('event-list');
    await eventList.getByText('다른 일정').click();

    // 수정 버튼 클릭
    await page.getByRole('button', { name: '수정' }).click();

    // 시간을 겹치도록 수정
    await page.getByRole('textbox', { name: '시작 시간' }).fill('09:30'); // 첫 번째 일정과 겹침
    await page.getByRole('textbox', { name: '종료 시간' }).fill('10:30');
    await page.getByTestId('event-submit-button').click();

    // 겹침 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정이 겹칩니다')).toBeVisible({ timeout: 3000 });
    await expect(page.getByText('원본 일정')).toBeVisible();
  });

  test('드래그 앤 드롭 시 겹침 감지', async ({ page }) => {
    // 첫 번째 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('드래그할 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('14:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 두 번째 일정 생성 (다른 날짜)
    await page.getByRole('textbox', { name: '제목' }).fill('기존 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-16');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('14:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('15:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 첫 번째 일정을 드래그하여 두 번째 일정과 같은 시간으로 이동
    // 캘린더 뷰에서 드래그 앤 드롭 수행
    // 주의: DND는 실제 마우스 이벤트가 필요하므로, 실제 드래그를 시뮬레이션해야 함
    const weekView = page.getByTestId('week-view');
    const sourceEvent = weekView
      .locator('[data-testid*="event"]')
      .filter({ hasText: '드래그할 일정' })
      .first();
    const targetCell = weekView.locator('td').filter({ hasText: '16' }); // 16일 셀

    // 드래그 앤 드롭 수행
    await sourceEvent.dragTo(targetCell);

    // 겹침 다이얼로그가 표시되는지 확인
    await expect(page.getByText('일정이 겹칩니다')).toBeVisible({ timeout: 3000 });
  });

  test('겹침 다이얼로그에서 확인 버튼 클릭 시 강제 생성', async ({ page }) => {
    // 기존 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('기존 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 겹치는 일정 생성 시도
    await page.getByRole('textbox', { name: '제목' }).fill('강제 생성 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:30');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:30');
    await page.getByTestId('event-submit-button').click();

    // 겹침 다이얼로그 확인
    await expect(page.getByText('일정이 겹칩니다')).toBeVisible({ timeout: 3000 });

    // 확인 버튼 클릭 (강제 생성)
    await page.getByRole('button', { name: '확인' }).click();

    // 일정이 생성되었는지 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('강제 생성 일정')).toBeVisible({ timeout: 3000 });
  });
});
