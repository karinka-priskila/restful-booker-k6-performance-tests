import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    const url = __ENV.BOOKING_URL;

    const payload = JSON.stringify({
        roomid: 5,
        firstname: 'John',
        lastname: 'Doe',
        depositpaid: false,
        bookingdates: {
            checkin: '2026-10-25',
            checkout: '2026-10-28',
        },
        email: 'johndoe@example.com',
        phone: '0812345678900',
    });

    const response = http.post(url, payload, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    console.log(`Status: ${response.status}`);
    console.log(`Response: ${response.body}`);

    check(response, {
        'booking created with status 201': (res) =>
            res.status === 201,
    });
}