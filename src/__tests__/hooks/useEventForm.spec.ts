import { act, renderHook } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { useEventForm } from '../../hooks/useEventForm';
import { Event } from '../../types';

describe('useEventForm', () => {
  describe('초기 상태', () => {
    it('initialEvent가 없을 때 모든 필드가 기본값으로 초기화된다', () => {
      const { result } = renderHook(() => useEventForm());

      expect(result.current.title).toBe('');
      expect(result.current.date).toBe('');
      expect(result.current.startTime).toBe('');
      expect(result.current.endTime).toBe('');
      expect(result.current.description).toBe('');
      expect(result.current.location).toBe('');
      expect(result.current.category).toBe('업무');
      expect(result.current.isRepeating).toBe(false);
      expect(result.current.repeatType).toBe('none');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('');
      expect(result.current.notificationTime).toBe(10);
      expect(result.current.editingEvent).toBe(null);
      expect(result.current.startTimeError).toBe(null);
      expect(result.current.endTimeError).toBe(null);
    });

    it('initialEvent가 있을 때 해당 이벤트의 값으로 초기화된다', () => {
      const initialEvent: Event = {
        id: '1',
        title: '기존 회의',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '기존 팀 미팅',
        location: '회의실 B',
        category: '개인',
        repeat: { type: 'daily', interval: 1, endDate: '2025-10-20' },
        notificationTime: 30,
      };

      const { result } = renderHook(() => useEventForm(initialEvent));

      expect(result.current.title).toBe('기존 회의');
      expect(result.current.date).toBe('2025-10-15');
      expect(result.current.startTime).toBe('09:00');
      expect(result.current.endTime).toBe('10:00');
      expect(result.current.description).toBe('기존 팀 미팅');
      expect(result.current.location).toBe('회의실 B');
      expect(result.current.category).toBe('개인');
      expect(result.current.isRepeating).toBe(true);
      expect(result.current.repeatType).toBe('daily');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('2025-10-20');
      expect(result.current.notificationTime).toBe(30);
      expect(result.current.editingEvent).toBe(null);
    });

    it('initialEvent의 repeat.type이 none일 때 isRepeating이 false로 설정된다', () => {
      const initialEvent: Event = {
        id: '1',
        title: '일반 일정',
        date: '2025-10-15',
        startTime: '09:00',
        endTime: '10:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      const { result } = renderHook(() => useEventForm(initialEvent));

      expect(result.current.isRepeating).toBe(false);
      expect(result.current.repeatType).toBe('none');
    });
  });

  describe('폼 필드 업데이트', () => {
    it('title을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setTitle('새로운 제목');
      });

      expect(result.current.title).toBe('새로운 제목');
    });

    it('date를 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setDate('2025-11-15');
      });

      expect(result.current.date).toBe('2025-11-15');
    });

    it('startTime을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setStartTime('10:00');
      });

      expect(result.current.startTime).toBe('10:00');
    });

    it('endTime을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setEndTime('11:00');
      });

      expect(result.current.endTime).toBe('11:00');
    });

    it('description을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setDescription('새로운 설명');
      });

      expect(result.current.description).toBe('새로운 설명');
    });

    it('location을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setLocation('새로운 위치');
      });

      expect(result.current.location).toBe('새로운 위치');
    });

    it('category를 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setCategory('개인');
      });

      expect(result.current.category).toBe('개인');
    });
  });

  describe('반복 일정 관련 상태', () => {
    it('isRepeating을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setIsRepeating(true);
      });

      expect(result.current.isRepeating).toBe(true);
    });

    it('repeatType을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setRepeatType('weekly');
      });

      expect(result.current.repeatType).toBe('weekly');
    });

    it('repeatInterval을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setRepeatInterval(2);
      });

      expect(result.current.repeatInterval).toBe(2);
    });

    it('repeatEndDate를 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setRepeatEndDate('2025-12-31');
      });

      expect(result.current.repeatEndDate).toBe('2025-12-31');
    });
  });

  describe('알림 시간 설정', () => {
    it('notificationTime을 업데이트할 수 있다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setNotificationTime(60);
      });

      expect(result.current.notificationTime).toBe(60);
    });
  });

  describe('시간 유효성 검사', () => {
    it('시작 시간이 종료 시간보다 빠르면 에러가 없다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setStartTime('09:00');
        result.current.setEndTime('10:00');
      });

      expect(result.current.startTimeError).toBe(null);
      expect(result.current.endTimeError).toBe(null);
    });

    it('handleStartTimeChange를 통해 시작 시간을 변경하면 유효성 검사가 실행된다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setEndTime('10:00');
      });

      act(() => {
        result.current.handleStartTimeChange({
          target: { value: '11:00' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.startTime).toBe('11:00');
      expect(result.current.startTimeError).toBe('시작 시간은 종료 시간보다 빨라야 합니다.');
    });

    it('handleEndTimeChange를 통해 종료 시간을 변경하면 유효성 검사가 실행된다', () => {
      const { result } = renderHook(() => useEventForm());

      act(() => {
        result.current.setStartTime('10:00');
      });

      act(() => {
        result.current.handleEndTimeChange({
          target: { value: '09:00' },
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.endTime).toBe('09:00');
      expect(result.current.endTimeError).toBe('종료 시간은 시작 시간보다 늦어야 합니다.');
    });
  });

  describe('폼 리셋', () => {
    it('resetForm을 호출하면 모든 필드가 기본값으로 리셋된다', () => {
      const { result } = renderHook(() => useEventForm());

      // 필드 값 설정
      act(() => {
        result.current.setTitle('제목');
        result.current.setDate('2025-10-15');
        result.current.setStartTime('09:00');
        result.current.setEndTime('10:00');
        result.current.setDescription('설명');
        result.current.setLocation('위치');
        result.current.setCategory('개인');
        result.current.setIsRepeating(true);
        result.current.setRepeatType('daily');
        result.current.setRepeatInterval(2);
        result.current.setRepeatEndDate('2025-12-31');
        result.current.setNotificationTime(60);
      });

      // 폼 리셋
      act(() => {
        result.current.resetForm();
      });

      expect(result.current.title).toBe('');
      expect(result.current.date).toBe('');
      expect(result.current.startTime).toBe('');
      expect(result.current.endTime).toBe('');
      expect(result.current.description).toBe('');
      expect(result.current.location).toBe('');
      expect(result.current.category).toBe('업무');
      expect(result.current.isRepeating).toBe(false);
      expect(result.current.repeatType).toBe('none');
      expect(result.current.repeatInterval).toBe(1);
      expect(result.current.repeatEndDate).toBe('');
      expect(result.current.notificationTime).toBe(10);
    });
  });

  describe('이벤트 편집', () => {
    it('editEvent를 호출하면 해당 이벤트의 값으로 폼이 채워진다', () => {
      const { result } = renderHook(() => useEventForm());

      const event: Event = {
        id: '1',
        title: '편집할 일정',
        date: '2025-10-20',
        startTime: '14:00',
        endTime: '15:00',
        description: '편집 설명',
        location: '편집 위치',
        category: '개인',
        repeat: { type: 'weekly', interval: 2, endDate: '2025-12-31' },
        notificationTime: 30,
      };

      act(() => {
        result.current.editEvent(event);
      });

      expect(result.current.editingEvent).toEqual(event);
      expect(result.current.title).toBe('편집할 일정');
      expect(result.current.date).toBe('2025-10-20');
      expect(result.current.startTime).toBe('14:00');
      expect(result.current.endTime).toBe('15:00');
      expect(result.current.description).toBe('편집 설명');
      expect(result.current.location).toBe('편집 위치');
      expect(result.current.category).toBe('개인');
      expect(result.current.isRepeating).toBe(true);
      expect(result.current.repeatType).toBe('weekly');
      expect(result.current.repeatInterval).toBe(2);
      expect(result.current.repeatEndDate).toBe('2025-12-31');
      expect(result.current.notificationTime).toBe(30);
    });

    it('editEvent를 호출하면 repeat.type이 none일 때 isRepeating이 false로 설정된다', () => {
      const { result } = renderHook(() => useEventForm());

      const event: Event = {
        id: '1',
        title: '일반 일정',
        date: '2025-10-20',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'none', interval: 0 },
        notificationTime: 10,
      };

      act(() => {
        result.current.editEvent(event);
      });

      expect(result.current.isRepeating).toBe(false);
      expect(result.current.repeatType).toBe('none');
    });

    it('editEvent를 호출하면 repeat.endDate가 없을 때 빈 문자열로 설정된다', () => {
      const { result } = renderHook(() => useEventForm());

      const event: Event = {
        id: '1',
        title: '반복 일정',
        date: '2025-10-20',
        startTime: '14:00',
        endTime: '15:00',
        description: '',
        location: '',
        category: '업무',
        repeat: { type: 'daily', interval: 1 },
        notificationTime: 10,
      };

      act(() => {
        result.current.editEvent(event);
      });

      expect(result.current.repeatEndDate).toBe('');
    });
  });
});
