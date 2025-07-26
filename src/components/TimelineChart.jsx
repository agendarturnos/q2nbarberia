// src/components/TimelineChart.jsx
import React, { useMemo } from 'react';
import {
  parseISO,
  format,
  startOfHour,
  addHours,
  differenceInMinutes,
} from 'date-fns';

export default function TimelineChart({ appointments }) {
  const sorted = useMemo(
    () => appointments.slice().sort((a, b) => new Date(a.datetime) - new Date(b.datetime)),
    [appointments]
  );

  const start = useMemo(() => {
    if (!sorted.length) return null;
    return startOfHour(parseISO(sorted[0].datetime));
  }, [sorted]);

  const end = useMemo(() => {
    if (!sorted.length) return null;
    let lastEnd = parseISO(sorted[0].datetime);
    sorted.forEach(appt => {
      const st = parseISO(appt.datetime);
      const en = new Date(st.getTime() + (appt.duration || 0) * 60000);
      if (en > lastEnd) lastEnd = en;
    });
    return addHours(startOfHour(lastEnd), 1);
  }, [sorted]);

  const hours = useMemo(() => {
    if (!start || !end) return [];
    const arr = [];
    let t = start;
    while (t <= end) {
      arr.push(t);
      t = addHours(t, 1);
    }
    return arr;
  }, [start, end]);

  const pxPerMinute = 2;
  const totalMinutes = start && end ? differenceInMinutes(end, start) : 0;
  const height = totalMinutes * pxPerMinute;

  const offset = d => differenceInMinutes(d, start) * pxPerMinute;

  return (
    <div className="relative mb-6" style={{ height }}>
      {hours.map(h => (
        <React.Fragment key={h.getTime()}>
          <div
            className="absolute left-0 w-12 pr-2 text-right text-gray-500 text-xs"
            style={{ top: offset(h) - 6 }}
          >
            {format(h, 'HH:mm')}
          </div>
          <div
            className="absolute left-12 right-0 border-t border-gray-200"
            style={{ top: offset(h) }}
          />
        </React.Fragment>
      ))}

      {sorted.map(appt => {
        const st = parseISO(appt.datetime);
        const top = offset(st);
        const h = (appt.duration || 30) * pxPerMinute;
        return (
          <div
            key={appt.id}
            className="absolute left-12 right-2 bg-blue-100 rounded p-2 text-xs shadow"
            style={{ top, height: h }}
          >
            <div className="font-medium">
              {format(st, 'HH:mm')} - {appt.serviceName}
            </div>
            <div className="text-gray-700">{appt.stylistName}</div>
          </div>
        );
      })}
    </div>
  );
}
