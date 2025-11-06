import { useDraggable } from '@dnd-kit/core';
import { Theme } from '@emotion/react';
import { Box, SxProps } from '@mui/material';
import React from 'react';

type Props = {
  eventId: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  disabled?: boolean;
};

const DroppabelBox = ({ eventId, sx, children, disabled = false }: Props) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: eventId,
    disabled,
  });
  return (
    <Box
      key={eventId}
      sx={{
        ...sx,
        opacity: isDragging ? 0 : 1,
        cursor: disabled ? 'not-allowed' : isDragging ? 'grabbing' : 'grab',
      }}
      ref={setNodeRef}
      {...(disabled ? {} : attributes)}
      {...(disabled ? {} : listeners)}
    >
      {children}
    </Box>
  );
};

export default DroppabelBox;
