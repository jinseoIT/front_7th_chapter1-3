import {
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Forms/FormControls',
  parameters: {
    layout: 'centered',
    chromatic: { viewports: [1280, 768, 375] },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// TextField - 기본 상태
export const TextFieldDefault: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField id="title" size="small" placeholder="일정 제목을 입력하세요" />
      </FormControl>
    </Stack>
  ),
};

// TextField - 값이 있는 상태
export const TextFieldWithValue: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField id="title" size="small" value="팀 미팅" />
      </FormControl>
    </Stack>
  ),
};

// TextField - 에러 상태
export const TextFieldError: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="start-time">시작 시간</FormLabel>
        <Tooltip title="종료 시간보다 늦을 수 없습니다" open={true} placement="top">
          <TextField
            id="start-time"
            size="small"
            type="time"
            value="14:00"
            error={true}
            helperText="종료 시간보다 늦을 수 없습니다"
          />
        </Tooltip>
      </FormControl>
    </Stack>
  ),
};

// TextField - 긴 텍스트
export const TextFieldLongText: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField
          id="title"
          size="small"
          value="매우 긴 제목의 일정이 어떻게 처리되는지 확인하는 테스트 케이스입니다"
        />
      </FormControl>
      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          multiline
          rows={3}
          value="매우 긴 설명 텍스트가 여러 줄로 표시되는지 확인하는 테스트 케이스입니다. 이 텍스트는 여러 줄로 표시되어야 하며, 텍스트 영역이 적절하게 확장되어야 합니다."
        />
      </FormControl>
    </Stack>
  ),
};

// Select - 기본 상태
export const SelectDefault: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select id="category" size="small" value="" aria-labelledby="category-label">
          <MenuItem value="업무">업무</MenuItem>
          <MenuItem value="개인">개인</MenuItem>
          <MenuItem value="가족">가족</MenuItem>
          <MenuItem value="기타">기타</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ),
};

// Select - 선택된 상태
export const SelectSelected: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select id="category" size="small" value="업무" aria-labelledby="category-label">
          <MenuItem value="업무">업무</MenuItem>
          <MenuItem value="개인">개인</MenuItem>
          <MenuItem value="가족">가족</MenuItem>
          <MenuItem value="기타">기타</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ),
};

// Select - 반복 유형
export const SelectRepeatType: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel>반복 유형</FormLabel>
        <Select size="small" value="daily" aria-label="반복 유형">
          <MenuItem value="daily">매일</MenuItem>
          <MenuItem value="weekly">매주</MenuItem>
          <MenuItem value="monthly">매월</MenuItem>
          <MenuItem value="yearly">매년</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  ),
};

// Checkbox - 체크되지 않은 상태
export const CheckboxUnchecked: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl>
        <FormControlLabel control={<Checkbox />} label="반복 일정" />
      </FormControl>
    </Stack>
  ),
};

// Checkbox - 체크된 상태
export const CheckboxChecked: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl>
        <FormControlLabel control={<Checkbox checked />} label="반복 일정" />
      </FormControl>
    </Stack>
  ),
};

// 날짜 필드
export const DateField: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField id="date" size="small" type="date" value="2025-01-15" />
      </FormControl>
    </Stack>
  ),
};

// 시간 필드
export const TimeFields: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 300 }}>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <TextField id="start-time" size="small" type="time" value="09:00" />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <TextField id="end-time" size="small" type="time" value="10:00" />
        </FormControl>
      </Stack>
    </Stack>
  ),
};

// 전체 폼 상태
export const FullFormState: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField id="title" size="small" value="팀 미팅" />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField id="date" size="small" type="date" value="2025-01-15" />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <TextField id="start-time" size="small" type="time" value="09:00" />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <TextField id="end-time" size="small" type="time" value="10:00" />
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          multiline
          rows={2}
          value="프로젝트 진행 상황 논의"
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="location">위치</FormLabel>
        <TextField id="location" size="small" value="회의실 A" />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select id="category" size="small" value="업무" aria-labelledby="category-label">
          <MenuItem value="업무">업무</MenuItem>
          <MenuItem value="개인">개인</MenuItem>
          <MenuItem value="가족">가족</MenuItem>
          <MenuItem value="기타">기타</MenuItem>
        </Select>
      </FormControl>

      <FormControl>
        <FormControlLabel control={<Checkbox checked />} label="반복 일정" />
      </FormControl>
    </Stack>
  ),
};

// 반복 일정 폼 상태
export const RecurringFormState: Story = {
  render: () => (
    <Stack spacing={2} sx={{ width: 400 }}>
      <FormControl>
        <FormControlLabel control={<Checkbox checked />} label="반복 일정" />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel>반복 유형</FormLabel>
        <Select size="small" value="weekly" aria-label="반복 유형">
          <MenuItem value="daily">매일</MenuItem>
          <MenuItem value="weekly">매주</MenuItem>
          <MenuItem value="monthly">매월</MenuItem>
          <MenuItem value="yearly">매년</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="repeat-interval">반복 간격</FormLabel>
          <TextField id="repeat-interval" size="small" type="number" value="1" />
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="repeat-end-date">종료 날짜</FormLabel>
          <TextField id="repeat-end-date" size="small" type="date" value="2025-12-31" />
        </FormControl>
      </Stack>
    </Stack>
  ),
};
