import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RecurringEventDialog from './RecurringEventDialog';
import { Event } from '../types';

type RecurringEventDialogProps = {
  open: boolean;
  mode?: 'edit' | 'delete';
  event: Event | null;
  onClose: () => void;
  onConfirm: (editSingleOnly: boolean) => void;
};

const meta: Meta<RecurringEventDialogProps> = {
  title: 'Dialogs/RecurringEventDialog',
  component: RecurringEventDialog,
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [1280, 768, 375] },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: '다이얼로그 열림 상태',
    },
    mode: {
      control: 'select',
      options: ['edit', 'delete'],
      description: '다이얼로그 모드',
    },
    event: {
      control: 'object',
      description: '반복 일정 이벤트',
    },
    onClose: {
      action: 'closed',
      description: '다이얼로그 닫기 핸들러',
    },
    onConfirm: {
      action: 'confirmed',
      description: '확인 핸들러',
    },
  },
  args: {
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 반복 일정 데이터
const mockRecurringEvent: Event = {
  id: '1',
  title: '매일 운동',
  date: '2025-01-15',
  startTime: '07:00',
  endTime: '08:00',
  description: '아침 운동 시간',
  location: '집',
  category: '개인',
  repeat: {
    type: 'daily',
    interval: 1,
    endDate: '2025-12-31',
  },
  notificationTime: 60,
};

// 수정 모드
export const EditMode: Story = {
  args: {
    open: true,
    mode: 'edit',
    event: mockRecurringEvent,
  },
};

// 삭제 모드
export const DeleteMode: Story = {
  args: {
    open: true,
    mode: 'delete',
    event: mockRecurringEvent,
  },
};

// 닫힌 상태
export const Closed: Story = {
  args: {
    open: false,
    mode: 'edit',
    event: mockRecurringEvent,
  },
};

// 긴 제목의 반복 일정
export const WithLongTitle: Story = {
  args: {
    open: true,
    mode: 'edit',
    event: {
      ...mockRecurringEvent,
      title: '매우 긴 제목의 반복 일정 다이얼로그가 어떻게 처리되는지 확인하는 테스트 케이스입니다',
    },
  },
};

// 주간 반복 일정
export const WeeklyRecurring: Story = {
  args: {
    open: true,
    mode: 'edit',
    event: {
      ...mockRecurringEvent,
      title: '매주 회의',
      repeat: {
        type: 'weekly',
        interval: 1,
        endDate: '2025-12-31',
      },
    },
  },
};

// 월간 반복 일정
export const MonthlyRecurring: Story = {
  args: {
    open: true,
    mode: 'edit',
    event: {
      ...mockRecurringEvent,
      title: '매월 정산',
      repeat: {
        type: 'monthly',
        interval: 1,
        endDate: '2025-12-31',
      },
    },
  },
};

// 종료일이 없는 반복 일정
export const WithoutEndDate: Story = {
  args: {
    open: true,
    mode: 'edit',
    event: {
      ...mockRecurringEvent,
      repeat: {
        type: 'daily',
        interval: 1,
      },
    },
  },
};
