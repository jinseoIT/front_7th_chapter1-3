import { Notifications, Repeat } from '@mui/icons-material';
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import DroppabelBox from './DroppabelBox';
import { weekDays } from '../constants/date';
import { eventBoxStyles } from '../constants/eventBoxStyles';
import { Event } from '../types';
import DroppabelDateCell from './DroppabelDateCell';
import { formatDate, formatWeek, getWeekDates } from '../utils/dateUtils';
import { getRepeatTypeLabel } from '../utils/getRepeatTypeLabel';

type Props = {
  currentDate: Date;
  filteredEvents: Event[];
  notifiedEvents: string[];
  overId: string | null;
  onClickCell: (date: Date) => void;
};

const WeekView = ({ currentDate, filteredEvents, notifiedEvents, overId, onClickCell }: Props) => {
  const weekDates = getWeekDates(currentDate);
  return (
    <Stack data-testid="week-view" spacing={4} sx={{ width: '100%' }}>
      <Typography variant="h5">{formatWeek(currentDate)}</Typography>
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
          <TableHead>
            <TableRow>
              {weekDays.map((day) => (
                <TableCell key={day} sx={{ width: '14.28%', padding: 1, textAlign: 'center' }}>
                  {day}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {weekDates.map((date) => (
                <DroppabelDateCell
                  key={formatDate(date, date.getDate())}
                  id={formatDate(date, date.getDate())}
                  overId={overId}
                  sx={{
                    height: '120px',
                    verticalAlign: 'top',
                    width: '14.28%',
                    padding: 1,
                    border: '1px solid #e0e0e0',
                    overflow: 'hidden',
                  }}
                  onClickCell={() => onClickCell(date)}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {date.getDate()}
                  </Typography>
                  {filteredEvents
                    .filter((event) => new Date(event.date).toDateString() === date.toDateString())
                    .map((event) => {
                      const isNotified = notifiedEvents.includes(event.id);
                      const isRepeating = event.repeat.type !== 'none';

                      return (
                        <DroppabelBox
                          key={event.id}
                          eventId={event.id}
                          disabled={isRepeating}
                          sx={{
                            ...eventBoxStyles.common,
                            ...(isNotified ? eventBoxStyles.notified : eventBoxStyles.normal),
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            {isNotified && <Notifications fontSize="small" />}
                            {/* ! TEST CASE */}
                            {isRepeating && (
                              <Tooltip
                                title={`${event.repeat.interval}${getRepeatTypeLabel(
                                  event.repeat.type
                                )}마다 반복${
                                  event.repeat.endDate ? ` (종료: ${event.repeat.endDate})` : ''
                                }`}
                              >
                                <Repeat fontSize="small" />
                              </Tooltip>
                            )}
                            <Typography
                              variant="caption"
                              noWrap
                              sx={{ fontSize: '0.75rem', lineHeight: 1.2 }}
                            >
                              {event.title}
                            </Typography>
                          </Stack>
                        </DroppabelBox>
                      );
                    })}
                </DroppabelDateCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default WeekView;
