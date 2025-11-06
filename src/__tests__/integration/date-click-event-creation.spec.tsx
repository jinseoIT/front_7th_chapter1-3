import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { ReactElement } from 'react';
import { describe, it, expect } from 'vitest';

import { setupMockHandlerCreation } from '../../__mocks__/handlersUtils';
import App from '../../App';

const theme = createTheme();

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return {
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>{element}</SnackbarProvider>
      </ThemeProvider>
    ),
    user,
  };
};

describe('날짜 클릭으로 일정 생성 통합 테스트', () => {
  it('월간 뷰에서 날짜 클릭 시 일정 폼에 날짜가 자동 입력됨', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    // 월간 뷰에서 날짜 셀 클릭 (예: 15일)
    const monthView = screen.getByTestId('month-view');
    const dateCells = within(monthView).getAllByText('15');
    // 첫 번째 날짜 셀 클릭 (테이블 셀 내부의 날짜 텍스트)
    const dateCell = dateCells[0].closest('td');
    if (dateCell) {
      await user.click(dateCell);
    }

    // 날짜 입력 필드에 클릭한 날짜가 자동으로 입력되었는지 확인
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    const dateValue = dateInput.value;

    // 날짜가 입력되었는지 확인 (형식: YYYY-MM-DD)
    expect(dateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('날짜 클릭 후 일정 생성 시 해당 날짜로 일정이 생성됨', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    // 월간 뷰에서 날짜 셀 클릭 (예: 15일)
    const monthView = screen.getByTestId('month-view');
    const dateCells = within(monthView).getAllByText('15');
    const dateCell = dateCells[0].closest('td');
    if (dateCell) {
      await user.click(dateCell);
    }

    // 날짜가 자동으로 입력되었는지 확인
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    const selectedDate = dateInput.value;

    // 일정 정보 입력
    await user.type(screen.getByLabelText('제목'), '날짜 클릭으로 생성된 일정');
    await user.type(screen.getByLabelText('시작 시간'), '10:00');
    await user.type(screen.getByLabelText('종료 시간'), '11:00');
    await user.click(screen.getByTestId('event-submit-button'));

    // 성공 메시지 확인
    await screen.findByText('일정이 추가되었습니다');

    // 일정이 해당 날짜로 생성되었는지 확인
    const eventList = within(screen.getByTestId('event-list'));
    expect(eventList.getByText('날짜 클릭으로 생성된 일정')).toBeInTheDocument();
    expect(eventList.getByText(selectedDate)).toBeInTheDocument();
  });

  it('주간 뷰에서 날짜 클릭 시 일정 폼에 날짜가 자동 입력됨', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    // 주간 뷰로 전환
    await user.click(within(screen.getByLabelText('뷰 타입 선택')).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'week-option' }));

    // 주간 뷰에서 날짜 셀 클릭
    const weekView = screen.getByTestId('week-view');
    const dateCells = within(weekView).getAllByRole('cell');
    // 첫 번째 날짜 셀 클릭
    if (dateCells.length > 0) {
      await user.click(dateCells[0]);
    }

    // 날짜 입력 필드에 클릭한 날짜가 자동으로 입력되었는지 확인
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    const dateValue = dateInput.value;

    // 날짜가 입력되었는지 확인
    expect(dateValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('날짜 클릭 후 다른 날짜로 수정 가능', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    // 월간 뷰에서 첫 번째 날짜 셀 클릭
    const monthView = screen.getByTestId('month-view');
    const firstDateCells = within(monthView).getAllByText('15');
    const firstDateCell = firstDateCells[0].closest('td');
    if (firstDateCell) {
      await user.click(firstDateCell);
    }

    // 첫 번째 날짜 확인
    const dateInput = screen.getByLabelText('날짜') as HTMLInputElement;
    const firstDate = dateInput.value;

    // 다른 날짜 클릭
    const secondDateCells = within(monthView).getAllByText('20');
    const secondDateCell = secondDateCells[0].closest('td');
    if (secondDateCell) {
      await user.click(secondDateCell);
    }

    // 날짜가 변경되었는지 확인
    const secondDate = dateInput.value;
    expect(secondDate).not.toBe(firstDate);
    expect(secondDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('날짜 클릭 후 일정 생성하면 해당 날짜에 일정이 표시됨', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);
    await screen.findByText('일정 로딩 완료!');

    // 현재 날짜 기준으로 날짜 선택 (2025-10-01이 setupTests에서 설정됨)
    const targetDay = '1';

    // 월간 뷰에서 해당 날짜 셀 클릭
    const monthView = screen.getByTestId('month-view');
    const dateCells = within(monthView).getAllByText(targetDay);
    const dateCell = dateCells[0].closest('td');
    if (!dateCell) {
      throw new Error('날짜 셀을 찾을 수 없습니다');
    }
    await user.click(dateCell);

    // 일정 생성
    await user.type(screen.getByLabelText('제목'), '캘린더 클릭 일정');
    await user.type(screen.getByLabelText('시작 시간'), '14:00');
    await user.type(screen.getByLabelText('종료 시간'), '15:00');
    await user.click(screen.getByTestId('event-submit-button'));

    await screen.findByText('일정이 추가되었습니다');

    // 월간 뷰에서 해당 날짜 셀에 일정이 표시되는지 확인
    const eventInCell = within(dateCell).getByText('캘린더 클릭 일정');
    expect(eventInCell).toBeInTheDocument();
  });
});
