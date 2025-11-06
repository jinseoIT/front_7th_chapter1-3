import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2ePath = join(__dirname, '../../src/__mocks__/response/e2e.json');

test.describe('반복 일정 관리 워크플로우 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json을 빈 배열로 초기화
    fs.writeFileSync(e2ePath, JSON.stringify({ events: [] }, null, 2));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('반복 일정 생성 - 매일 반복', async ({ page }) => {
    // 반복 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('매일 운동');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('07:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('08:00');

    // 반복 일정 체크박스 클릭
    await page.getByRole('checkbox', { name: '반복 일정' }).check();

    // 반복 유형 선택 (매일)
    await page.getByText('매일').click();
    await page.getByRole('option', { name: 'daily-option' }).click();

    // 반복 간격 설정
    await page.getByRole('spinbutton', { name: '반복 간격' }).fill('1');

    // 종료 날짜 설정
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-11-20');

    // 일정 추가
    await page.getByTestId('event-submit-button').click();

    // 성공 메시지 확인
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 여러 일정이 생성되었는지 확인 (2025-11-15부터 2025-11-20까지 매일)
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('매일 운동')).toHaveCount(6, { timeout: 5000 });
  });

  test('반복 일정 수정 - 단일 일정만 수정', async ({ page }) => {
    // 먼저 반복 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('매주 회의');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

    // 반복 일정 체크박스 클릭
    await page.getByRole('checkbox', { name: '반복 일정' }).check();

    // 반복 유형 선택 (매주)
    await page.getByText('매일', { exact: true }).click();
    await page.getByRole('option', { name: 'weekly-option' }).click();

    // 반복 간격 설정
    await page.getByRole('spinbutton', { name: '반복 간격' }).fill('1');

    // 종료 날짜 설정
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-12-15');

    // 일정 추가
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 첫 번째 일정 클릭하여 수정 모드로 전환
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '매주 회의' })
      .filter({ hasText: '2025-11-15' })
      .first();

    // 해당 일정의 수정 버튼 클릭
    await eventBox.getByRole('button', { name: 'Edit event' }).click();

    // 반복 일정 수정 다이얼로그 확인
    await expect(page.getByText('반복 일정 수정')).toBeVisible();
    await expect(page.getByText('해당 일정만 수정하시겠어요?')).toBeVisible();

    // "예" 버튼 클릭 (단일 일정만 수정)
    await page.getByRole('button', { name: '예' }).click();

    // 제목 수정
    await page.getByRole('textbox', { name: '제목' }).fill('매주 회의 (변경됨)');
    await page.getByTestId('event-submit-button').click();

    // 수정된 일정 확인
    await expect(eventList.getByText('매주 회의 (변경됨)')).toHaveCount(1, { timeout: 3000 });
  });

  test('반복 일정 삭제 - 단일 일정만 삭제', async ({ page }) => {
    // 먼저 반복 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('매일 점심');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-10');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('12:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('13:00');

    // 반복 일정 체크박스 클릭
    await page.getByRole('checkbox', { name: '반복 일정' }).check();

    // 반복 유형 선택 (매일)
    await page.getByText('매일').click();
    await page.getByRole('option', { name: 'daily-option' }).click();

    // 반복 간격 설정
    await page.getByRole('spinbutton', { name: '반복 간격' }).fill('1');

    // 종료 날짜 설정
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-11-15');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 첫 번째 일정의 삭제 버튼 클릭
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '매일 점심' })
      .filter({ hasText: '2025-11-10' })
      .first();
    await eventBox.getByRole('button', { name: 'Delete event' }).click();

    // 반복 일정 삭제 다이얼로그 확인
    await expect(page.getByText('반복 일정 삭제')).toBeVisible();
    await expect(page.getByText('해당 일정만 삭제하시겠어요?')).toBeVisible();

    // "예" 버튼 클릭 (단일 일정만 삭제)
    await page.getByRole('button', { name: '예' }).click();

    // 하나만 삭제되었는지 확인 (나머지 일정은 남아있어야 함)
    await expect(eventList.getByText('매일 점심')).toHaveCount(5, { timeout: 3000 });
  });

  test('반복 일정 삭제 - 전체 일정 삭제', async ({ page }) => {
    // 먼저 반복 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('매주 스터디');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-05');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('19:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('21:00');

    // 반복 일정 체크박스 클릭
    await page.getByRole('checkbox', { name: '반복 일정' }).check();

    // 반복 유형 선택 (매주)
    await page.getByText('매일').click();
    await page.getByRole('option', { name: 'weekly-option' }).click();

    // 반복 간격 설정
    await page.getByRole('spinbutton', { name: '반복 간격' }).fill('1');

    // 종료 날짜 설정
    await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-12-05');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 첫 번째 일정의 삭제 버튼 클릭
    const eventList = page.getByTestId('event-list');
    const eventBox = eventList
      .locator('div')
      .filter({ hasText: '매주 스터디' })
      .filter({ hasText: '2025-11-05' })
      .first();
    await eventBox.getByRole('button', { name: 'Delete event' }).click();

    // "아니오" 버튼 클릭 (전체 일정 삭제)
    await page.getByRole('button', { name: '아니오' }).click();

    // 모든 일정이 삭제되었는지 확인
    await expect(eventList.getByText('매주 스터디')).toHaveCount(0, { timeout: 3000 });
  });
});
