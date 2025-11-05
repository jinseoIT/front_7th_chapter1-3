import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import MonthView from './MonthView';
import { Event } from '../types';

const meta = {
  title: 'Calendar/MonthView',
  component: MonthView,
  parameters: {
    layout: 'fullscreen',
    chromatic: { viewports: [1280, 768, 375] },
  },
  tags: ['autodocs'],
  argTypes: {
    currentDate: {
      control: 'date',
      description: '현재 선택된 날짜',
    },
    filteredEvents: {
      control: 'object',
      description: '필터링된 이벤트 목록',
    },
    notifiedEvents: {
      control: 'object',
      description: '알림이 설정된 이벤트 ID 목록',
    },
    holidays: {
      control: 'object',
      description: '공휴일 정보',
    },
    overId: {
      control: 'text',
      description: '드래그 오버 중인 셀 ID',
    },
    onClickCell: {
      action: 'cell-clicked',
      description: '셀 클릭 핸들러',
    },
  },
  args: {
    onClickCell: fn(),
  },
} satisfies Meta<typeof MonthView>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 이벤트 데이터 생성 헬퍼
const createEvent = (
  id: string,
  title: string,
  date: string,
  options?: {
    isNotified?: boolean;
    isRepeating?: boolean;
    repeatType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  }
): Event => ({
  id,
  title,
  date,
  startTime: '09:00',
  endTime: '10:00',
  description: '',
  location: '',
  category: '업무',
  repeat: {
    type: options?.isRepeating ? options.repeatType || 'daily' : 'none',
    interval: 1,
    endDate: options?.isRepeating ? '2025-12-31' : undefined,
  },
  notificationTime: options?.isNotified ? 60 : 0,
});

// 기본 스토리: 빈 캘린더
export const Empty: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [],
    notifiedEvents: [],
    holidays: {},
    overId: null,
  },
};

// 기본 스토리: 일반 일정들
export const WithNormalEvents: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '신년 계획 회의', '2025-01-02'),
      createEvent('2', '프로젝트 킥오프', '2025-01-05'),
      createEvent('3', '중간 점검', '2025-01-15'),
      createEvent('4', '월말 회고', '2025-01-28'),
    ],
    notifiedEvents: [],
    holidays: {},
    overId: null,
  },
};

// 알림이 있는 일정들
export const WithNotifiedEvents: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '중요한 발표', '2025-01-10', { isNotified: true }),
      createEvent('2', '일반 회의', '2025-01-12'),
      createEvent('3', '데드라인', '2025-01-20', { isNotified: true }),
      createEvent('4', '평범한 일정', '2025-01-25'),
    ],
    notifiedEvents: ['1', '3'],
    holidays: {},
    overId: null,
  },
};

// 반복 일정들
export const WithRepeatingEvents: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '매일 운동', '2025-01-01', { isRepeating: true, repeatType: 'daily' }),
      createEvent('2', '매주 회의', '2025-01-05', { isRepeating: true, repeatType: 'weekly' }),
      createEvent('3', '매월 정산', '2025-01-10', { isRepeating: true, repeatType: 'monthly' }),
      createEvent('4', '일반 일정', '2025-01-15'),
    ],
    notifiedEvents: [],
    holidays: {},
    overId: null,
  },
};

// 알림 + 반복 일정
export const WithNotifiedAndRepeating: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '매일 아침 운동', '2025-01-01', {
        isNotified: true,
        isRepeating: true,
        repeatType: 'daily',
      }),
      createEvent('2', '매주 중요 회의', '2025-01-05', {
        isNotified: true,
        isRepeating: true,
        repeatType: 'weekly',
      }),
      createEvent('3', '일반 일정', '2025-01-15'),
    ],
    notifiedEvents: ['1', '2'],
    holidays: {},
    overId: null,
  },
};

// 긴 텍스트 처리
export const WithLongTitles: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent(
        '1',
        '매우 긴 제목의 일정이 어떻게 처리되는지 확인하는 테스트 케이스입니다',
        '2025-01-05'
      ),
      createEvent('2', '중간 길이의 일정 제목입니다', '2025-01-10'),
      createEvent('3', '짧은 제목', '2025-01-15'),
      createEvent(
        '4',
        '또 다른 매우 긴 제목으로 오버플로우가 발생하지 않도록 처리되어야 합니다',
        '2025-01-20'
      ),
    ],
    notifiedEvents: [],
    holidays: {},
    overId: null,
  },
};

// 여러 일정이 있는 날
export const WithMultipleEventsPerDay: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '아침 회의', '2025-01-15'),
      createEvent('2', '점심 약속', '2025-01-15'),
      createEvent('3', '저녁 스터디', '2025-01-15'),
      createEvent('4', '야근 작업', '2025-01-15'),
      createEvent('5', '추가 일정', '2025-01-15'),
    ],
    notifiedEvents: ['2'],
    holidays: {},
    overId: null,
  },
};

// 공휴일 포함
export const WithHolidays: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '신정', '2025-01-01'),
      createEvent('2', '설날 연휴', '2025-01-28'),
      createEvent('3', '일반 일정', '2025-01-15'),
    ],
    notifiedEvents: [],
    holidays: {
      '2025-01-01': '신정',
      '2025-01-28': '설날',
      '2025-01-29': '설날 연휴',
    },
    overId: null,
  },
};

// 드래그 오버 상태
export const WithDragOver: Story = {
  args: {
    currentDate: new Date('2025-01-15'),
    filteredEvents: [
      createEvent('1', '이동할 일정', '2025-01-10'),
      createEvent('2', '다른 일정', '2025-01-12'),
    ],
    notifiedEvents: [],
    holidays: {},
    overId: '2025-01-15', // 드래그 오버 중인 셀
  },
};

// 월 시작/끝 경계
export const MonthBoundary: Story = {
  args: {
    currentDate: new Date('2025-01-31'), // 1월 마지막 날
    filteredEvents: [
      createEvent('1', '1월 마지막 일정', '2025-01-31'),
      createEvent('2', '1월 첫 일정', '2025-01-01'),
    ],
    notifiedEvents: [],
    holidays: {},
    overId: null,
  },
};

// 빈 날짜 셀 (이전/다음 달)
export const WithAdjacentMonthDays: Story = {
  args: {
    currentDate: new Date('2025-01-05'), // 1월 첫 주 (12월 일부 포함)
    filteredEvents: [createEvent('1', '1월 첫 일정', '2025-01-03')],
    notifiedEvents: [],
    holidays: {},
    overId: null,
  },
};
