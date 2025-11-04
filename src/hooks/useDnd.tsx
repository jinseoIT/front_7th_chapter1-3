import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';

import { Event } from '../types';
import { findOverlappingEvents } from '../utils/eventOverlap';

export function useDnd(
  events: Event[],
  saveEvent: (event: Event, isEdit: boolean) => Promise<void>,
  onOverlap?: (overlapping: Event[], updatedEvent: Event) => void
) {
  // 👉 state 내부로 이동
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const draggedEvent = events.find((e) => e.id === String(event.active.id));
    setActiveEvent(draggedEvent || null);
  };
  const handleDragOver = (event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  };

  const handleDragCancel = () => {
    setActiveEvent(null);
    setOverId(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !String(active.id) || !activeEvent) {
      setActiveEvent(null);
      setOverId(null);
      return;
    }

    const newDate = String(over.id).split('T')[0];

    if (activeEvent.date !== newDate) {
      const updatedEvent = {
        ...activeEvent,
        date: newDate,
      };

      // 겹침 체크
      const overlapping = findOverlappingEvents(updatedEvent, events);
      if (overlapping.length > 0 && onOverlap) {
        onOverlap(overlapping, updatedEvent);
        setActiveEvent(null);
        setOverId(null);
        return;
      }

      // 즉시 상태 초기화 (Optimistic Update)
      setActiveEvent(null);
      setOverId(null);

      // 일정 업데이트
      await saveEvent(updatedEvent, true);
    }

    setActiveEvent(null);
    setOverId(null);
  };

  /* dnd */
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return {
    sensors,
    activeEvent,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleDragEnd,
  };
}
