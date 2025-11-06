import { useDroppable } from '@dnd-kit/core';
import { Theme } from '@emotion/react';
import { SxProps, TableCell } from '@mui/material';
import React from 'react';

type Props = {
  id: string;
  overId: string | null;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  onClickCell: () => void;
};

const DroppabelDateCell = ({ id, overId, children, sx, onClickCell }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <TableCell
      key={id}
      ref={setNodeRef}
      sx={{
        ...sx,
        backgroundColor: isOver || overId === id ? '#e3f2fd' : undefined, // 시각적 피드백
      }}
      onClick={onClickCell}
    >
      {children}
    </TableCell>
  );
};

export default DroppabelDateCell;
