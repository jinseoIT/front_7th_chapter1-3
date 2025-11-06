import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { test, expect } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const e2ePath = join(__dirname, '../../src/__mocks__/response/e2e.json');

test.describe.serial('검색 및 필터링 E2E', () => {
  test.beforeEach(async ({ page }) => {
    // e2e.json을 빈 배열로 초기화
    fs.writeFileSync(e2ePath, JSON.stringify({ events: [] }, null, 2));

    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('제목으로 일정 검색', async ({ page }) => {
    // 여러 일정 생성
    const events = [
      { title: '팀 미팅', date: '2025-11-15', startTime: '10:00', endTime: '11:00' },
      { title: '코드 리뷰', date: '2025-11-16', startTime: '14:00', endTime: '15:00' },
      { title: '프로젝트 회의', date: '2025-11-17', startTime: '16:00', endTime: '17:00' },
    ];

    for (const event of events) {
      await page.getByRole('textbox', { name: '제목' }).fill(event.title);
      await page.getByRole('textbox', { name: '날짜' }).fill(event.date);
      await page.getByRole('textbox', { name: '시작 시간' }).fill(event.startTime);
      await page.getByRole('textbox', { name: '종료 시간' }).fill(event.endTime);
      await page.getByTestId('event-submit-button').click();
      await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });
    }

    // 검색어 입력
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('팀');

    // 검색 결과 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('팀 미팅')).toBeVisible({ timeout: 3000 });
    await expect(eventList.getByText('코드 리뷰')).not.toBeVisible();
    await expect(eventList.getByText('프로젝트 회의')).not.toBeVisible();
  });

  test('설명으로 일정 검색', async ({ page }) => {
    // 설명이 있는 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('회의 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByRole('textbox', { name: '설명' }).fill('프로젝트 진행 상황 논의');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 검색어 입력 (설명 내용)
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('프로젝트');

    // 검색 결과 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('회의 일정')).toBeVisible({ timeout: 3000 });
  });

  test('위치로 일정 검색', async ({ page }) => {
    // 위치가 있는 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('오프라인 미팅');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByRole('textbox', { name: '위치' }).fill('서울 강남구');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 검색어 입력 (위치 내용)
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('강남구');

    // 검색 결과 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('오프라인 미팅')).toBeVisible({ timeout: 3000 });
  });

  test('검색 결과가 없을 때 메시지 표시', async ({ page }) => {
    // 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('기존 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 존재하지 않는 검색어 입력
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('존재하지않는일정');

    // 검색 결과 없음 메시지 확인
    await expect(page.getByText('검색 결과가 없습니다')).toBeVisible({ timeout: 3000 });
  });

  test('검색어 삭제 시 모든 일정 표시', async ({ page }) => {
    // 여러 일정 생성
    const events = [
      { title: '첫 번째 일정', date: '2025-11-15', startTime: '10:00', endTime: '11:00' },
      { title: '두 번째 일정', date: '2025-11-16', startTime: '14:00', endTime: '15:00' },
    ];

    for (const event of events) {
      await page.getByRole('textbox', { name: '제목' }).fill(event.title);
      await page.getByRole('textbox', { name: '날짜' }).fill(event.date);
      await page.getByRole('textbox', { name: '시작 시간' }).fill(event.startTime);
      await page.getByRole('textbox', { name: '종료 시간' }).fill(event.endTime);
      await page.getByTestId('event-submit-button').click();
      await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });
    }

    // 검색어 입력
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('첫 번째');

    // 검색 결과 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('첫 번째 일정')).toBeVisible({ timeout: 3000 });
    await expect(eventList.getByText('두 번째 일정')).not.toBeVisible();

    // 검색어 삭제
    await searchInput.clear();

    // 모든 일정이 다시 표시되는지 확인
    await expect(eventList.getByText('첫 번째 일정')).toBeVisible({ timeout: 3000 });
    await expect(eventList.getByText('두 번째 일정')).toBeVisible({ timeout: 3000 });
  });

  test('검색은 현재 뷰(주/월)의 일정만 필터링', async ({ page }) => {
    // 현재 주의 일정 생성
    const today = new Date();
    const currentWeekDate = new Date(today);
    currentWeekDate.setDate(today.getDate() + 2); // 이번 주 일정
    const currentWeekDateStr = currentWeekDate.toISOString().split('T')[0];

    await page.getByRole('textbox', { name: '제목' }).fill('이번 주 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(currentWeekDateStr);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 다음 달 일정 생성
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    const nextMonthDateStr = nextMonth.toISOString().split('T')[0];

    await page.getByRole('textbox', { name: '제목' }).fill('다음 달 일정');
    await page.getByRole('textbox', { name: '날짜' }).fill(nextMonthDateStr);
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 주간 뷰에서 검색
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('일정');

    // 현재 주의 일정만 표시되는지 확인 (뷰 필터링 확인)
    const eventList = page.getByTestId('event-list');
    // 주간 뷰에서는 현재 주의 일정만 표시되어야 함
    await expect(eventList.getByText('이번 주 일정')).toBeVisible({ timeout: 3000 });
    // 다음 달 일정은 현재 주간 뷰에 표시되지 않아야 함
    await expect(eventList.getByText('다음 달 일정')).not.toBeVisible();
  });

  test('대소문자 구분 없이 검색', async ({ page }) => {
    // 일정 생성
    await page.getByRole('textbox', { name: '제목' }).fill('대소문자 테스트');
    await page.getByRole('textbox', { name: '날짜' }).fill('2025-11-15');
    await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
    await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');
    await page.getByTestId('event-submit-button').click();
    await expect(page.getByText('일정이 추가되었습니다')).toBeVisible({ timeout: 3000 });

    // 대문자로 검색
    const searchInput = page.getByRole('textbox', { name: '일정 검색' });
    await searchInput.fill('테스트');

    // 검색 결과 확인
    const eventList = page.getByTestId('event-list');
    await expect(eventList.getByText('대소문자 테스트')).toBeVisible({ timeout: 3000 });
  });
});
