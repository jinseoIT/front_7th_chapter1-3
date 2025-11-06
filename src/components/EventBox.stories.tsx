import { DndContext } from '@dnd-kit/core';
import { Notifications, Repeat } from '@mui/icons-material';
import { Stack, Tooltip, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

import DroppabelBox from './DroppabelBox';
import { eventBoxStyles } from '../constants/eventBoxStyles';
import { getRepeatTypeLabel } from '../utils/getRepeatTypeLabel';

const meta = {
  title: 'Components/EventBox',
  component: DroppabelBox,
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [1280, 768, 375] },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DndContext>
        <Story />
      </DndContext>
    ),
  ],
  argTypes: {
    eventId: {
      control: 'text',
      description: '이벤트 ID',
    },
    sx: {
      control: 'object',
      description: 'MUI sx prop',
    },
  },
} satisfies Meta<typeof DroppabelBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 일반 일정 박스
export const Normal: Story = {
  args: {
    eventId: '1',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.normal,
    },
    children: (
      <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
        일반 일정
      </Typography>
    ),
  },
};

// 알림이 있는 일정 박스
export const Notified: Story = {
  args: {
    eventId: '2',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.notified,
    },
    children: (
      <Stack direction="row" spacing={1} alignItems="center">
        <Notifications fontSize="small" />
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          알림 설정된 일정
        </Typography>
      </Stack>
    ),
  },
};

// 반복 일정 박스
export const Repeating: Story = {
  args: {
    eventId: '3',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.normal,
    },
    children: (
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title="매일 반복">
          <Repeat fontSize="small" />
        </Tooltip>
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          반복 일정
        </Typography>
      </Stack>
    ),
  },
};

// 알림 + 반복 일정 박스
export const NotifiedAndRepeating: Story = {
  args: {
    eventId: '4',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.notified,
    },
    children: (
      <Stack direction="row" spacing={1} alignItems="center">
        <Notifications fontSize="small" />
        <Tooltip title="매주 반복">
          <Repeat fontSize="small" />
        </Tooltip>
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          알림 + 반복 일정
        </Typography>
      </Stack>
    ),
  },
};

// 긴 제목 처리
export const LongTitle: Story = {
  args: {
    eventId: '5',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.normal,
    },
    children: (
      <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
        매우 긴 제목의 일정이 어떻게 처리되는지 확인하는 테스트 케이스입니다
      </Typography>
    ),
  },
};

// 매우 긴 제목 (알림 포함)
export const LongTitleWithNotification: Story = {
  args: {
    eventId: '6',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.notified,
    },
    children: (
      <Stack direction="row" spacing={1} alignItems="center">
        <Notifications fontSize="small" />
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          매우 긴 제목의 알림 설정된 일정이 어떻게 처리되는지 확인하는 테스트 케이스입니다
        </Typography>
      </Stack>
    ),
  },
};

// 짧은 제목
export const ShortTitle: Story = {
  args: {
    eventId: '7',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.normal,
    },
    children: (
      <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
        회의
      </Typography>
    ),
  },
};

// 월간 반복 일정
export const MonthlyRepeating: Story = {
  args: {
    eventId: '8',
    sx: {
      ...eventBoxStyles.common,
      ...eventBoxStyles.normal,
    },
    children: (
      <Stack direction="row" spacing={1} alignItems="center">
        <Tooltip title={`1${getRepeatTypeLabel('monthly')}마다 반복`}>
          <Repeat fontSize="small" />
        </Tooltip>
        <Typography variant="caption" noWrap sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}>
          매월 정산
        </Typography>
      </Stack>
    ),
  },
};
