import { useDraggable } from '@dnd-kit/core';
import { Theme } from '@emotion/react';
import { Box, SxProps } from '@mui/material';
import React from 'react';

type Props = {
  eventId: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

const DroppabelBox = ({ eventId, sx, children }: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: eventId,
  });
  return (
    <Box
      key={eventId}
      sx={{
        ...sx,
        opacity: isDragging ? 0 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </Box>
  );
};

export default DroppabelBox;
