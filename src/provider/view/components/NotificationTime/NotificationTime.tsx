import * as React from 'react';
import moment from 'moment';

export interface NotificationTimeProps {
    date: number;
}

moment.locale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'seconds',
        ss: '%ss',
        m: 'a minute',
        mm: '%dm',
        h: 'an hour',
        hh: '%dh',
        d: 'a day',
        dd: '%dd',
        M: 'a month',
        MM: '%dM',
        y: 'a year',
        yy: '%dY'
    }
});

export function NotificationTime(props: NotificationTimeProps) {
    const {date} = props;

    const [formattedDate, setFormattedDate] = React.useState<string>(moment(date).fromNow());

    // Update timestamp
    React.useEffect(() => {
        const timer = setInterval(() => {
            setFormattedDate(moment(date).fromNow());
        }, 1000 * 60);

        return () => {
            clearTimeout(timer);
        };
    });

    return (
        <div className="time single-line">
            {formattedDate}
        </div>
    );
}
