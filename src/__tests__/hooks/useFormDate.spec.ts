import { act, renderHook } from '@testing-library/react';

import { useFormDate } from '../../hooks/useFormDate';

describe('useFormDate', () => {
  it('Date 객체를 전달하면 YYYY-MM-DD 형식으로 포맷팅되어 setDate가 호출된다', () => {
    const mockSetDate = vi.fn();
    const { result } = renderHook(() => useFormDate(mockSetDate));

    const testDate = new Date('2025-10-15');
    act(() => {
      result.current.handleSelectDate(testDate);
    });

    expect(mockSetDate).toHaveBeenCalledWith('2025-10-15');
    expect(mockSetDate).toHaveBeenCalledTimes(1);
  });

  it('문자열 날짜를 전달하면 YYYY-MM-DD 형식으로 포맷팅되어 setDate가 호출된다', () => {
    const mockSetDate = vi.fn();
    const { result } = renderHook(() => useFormDate(mockSetDate));

    act(() => {
      result.current.handleSelectDate('2025-11-20');
    });

    expect(mockSetDate).toHaveBeenCalledWith('2025-11-20');
    expect(mockSetDate).toHaveBeenCalledTimes(1);
  });

  it('다양한 날짜 형식에 대해 올바르게 포맷팅된다', () => {
    const mockSetDate = vi.fn();
    const { result } = renderHook(() => useFormDate(mockSetDate));

    const testCases = [
      { input: new Date('2025-01-01'), expected: '2025-01-01' },
      { input: new Date('2025-12-31'), expected: '2025-12-31' },
      { input: new Date('2025-02-28'), expected: '2025-02-28' },
      { input: '2025-06-15', expected: '2025-06-15' },
    ];

    testCases.forEach(({ input }) => {
      act(() => {
        result.current.handleSelectDate(input);
      });
    });

    expect(mockSetDate).toHaveBeenCalledTimes(testCases.length);
    testCases.forEach(({ expected }, index) => {
      expect(mockSetDate).toHaveBeenNthCalledWith(index + 1, expected);
    });
  });

  it('같은 날짜를 여러 번 선택해도 setDate가 매번 호출된다', () => {
    const mockSetDate = vi.fn();
    const { result } = renderHook(() => useFormDate(mockSetDate));

    const testDate = new Date('2025-10-15');

    act(() => {
      result.current.handleSelectDate(testDate);
      result.current.handleSelectDate(testDate);
      result.current.handleSelectDate(testDate);
    });

    expect(mockSetDate).toHaveBeenCalledTimes(3);
    expect(mockSetDate).toHaveBeenCalledWith('2025-10-15');
  });

  it('날짜가 변경될 때마다 setDate가 올바른 값으로 호출된다', () => {
    const mockSetDate = vi.fn();
    const { result } = renderHook(() => useFormDate(mockSetDate));

    act(() => {
      result.current.handleSelectDate(new Date('2025-10-15'));
      result.current.handleSelectDate(new Date('2025-10-16'));
      result.current.handleSelectDate(new Date('2025-10-17'));
    });

    expect(mockSetDate).toHaveBeenCalledTimes(3);
    expect(mockSetDate).toHaveBeenNthCalledWith(1, '2025-10-15');
    expect(mockSetDate).toHaveBeenNthCalledWith(2, '2025-10-16');
    expect(mockSetDate).toHaveBeenNthCalledWith(3, '2025-10-17');
  });
});
