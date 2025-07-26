// src/components/TimelineChart.jsx
import React, { useMemo } from 'react';
import { parseISO, format } from 'date-fns';

export default function TimelineChart({ appointments }) {
  const sorted = useMemo(
    () => appointments.slice().sort((a, b) => new Date(a.datetime) - new Date(b.datetime)),
    [appointments]
  );

  const start = useMemo(() => {
    if (!sorted.length) return null;
    const first = parseISO(sorted[0].datetime);
    first.setMinutes(Math.floor(first.getMinutes() / 30) * 30, 0, 0);
    return first;
  }, [sorted]);

  const end = useMemo(() => {
    if (!sorted.length) return null;
    const last = parseISO(sorted[sorted.length - 1].datetime);
    last.setMinutes(Math.ceil(last.getMinutes() / 30) * 30, 0, 0);
    return last;
  }, [sorted]);

  const slots = useMemo(() => {
    if (!start || !end) return [];
    const arr = [];
    const t = new Date(start);
    while (t <= end) {
      arr.push(new Date(t));
      t.setMinutes(t.getMinutes() + 30);
    }
    return arr;
  }, [start, end]);

  return (
    <div className="grid grid-cols-[60px_1fr] text-sm mb-6">
      {slots.map(slot => {
        const timeStr = format(slot, 'HH:mm');
        const apptsAt = sorted.filter(
          appt => format(parseISO(appt.datetime), 'HH:mm') === timeStr
        );
        return (
          <React.Fragment key={slot.getTime()}>
            <div className="border-t py-1 pr-2 text-right text-gray-500">{timeStr}</div>
            <div className="border-t py-1 space-y-1">
              {apptsAt.map(appt => (
                <div key={appt.id} className="bg-blue-100 rounded px-2 py-1">
                  {appt.serviceName} - {appt.stylistName}
                </div>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
