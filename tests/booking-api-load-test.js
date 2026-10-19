import http from 'k6/http';
import { check } from 'k6';

const bookingUrl = __ENV.BOOKING_URL;

export const options = {
    scenarios: {
        booking_test: {
            executor: 'ramping-arrival-rate',
            startRate: 5,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 30,
            stages: [
                // Normal traffic: 5 requests per second
                { duration: '1m', target: 5 },

                // Gradually increase traffic to 20 requests per second
                { duration: '2m', target: 20 },

                // Maintain peak traffic: 20 requests per second
                { duration: '1m', target: 20 },

                // Reduce traffic back to 5 requests per second
                { duration: '1m', target: 5 },
            ],
        },
    },

    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500'],
        checks: ['rate>0.99'],
    },
};

export default function () {
    const payload = JSON.stringify({
        roomid: 5,
        firstname: 'sasaasa',
        lastname: 'sasasa',
        depositpaid: false,
        bookingdates: {
            checkin: '2026-10-19',
            checkout: '2026-10-20',
        },
        email: 'asasas@mail.com',
        phone: '0812345678900',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    const response = http.post(bookingUrl, payload, params);

    check(response, {
        'booking created successfully': (res) => res.status === 201,
    });
}
