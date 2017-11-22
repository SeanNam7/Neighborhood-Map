//MODEL: application’s stored data.
var locations = [
    {
        name: 'Tsukiji Fish Market',
        category: 'Food',
        coordinates: {
            lat: 35.665765,
            lng: 139.770688
        },
        show: ko.observable(true)
    },
    {
        name: 'Ichiran Shibuya Ramen',
        category: 'Food',
        coordinates: {
            lat: 35.661292,
            lng: 139.701097
        },
        show: ko.observable(true)
    },
    {
        name: 'Sushi Dai',
        category: 'Food',
        coordinates: {
            lat: 35.663876,
            lng: 139.769712
        },
        show: ko.observable(true)
    },
    {
        name: 'Imperial Palace',
        category: 'History',
        coordinates: {
            lat: 35.685413,
            lng: 139.752851
        },
        show: ko.observable(true)
    },
    {
        name: 'Tokyo National Museum',
        category: 'History',
        coordinates: {
            lat: 35.719079,
            lng: 139.776521
        },
        show: ko.observable(true)
    },
    {
        name: 'Akasuka Shrine',
        category: 'History',
        coordinates: {
            lat: 35.715305,
            lng: 139.797514
        },
        show: ko.observable(true)
    },
    {
        name: 'Rainbow Bridge',
        category: 'Scenery',
        coordinates: {
            lat: 35.636780,
            lng: 139.763691
        },
        show: ko.observable(true)
    },
    {
        name: 'Shinjuku Gyoen National Garden',
        category: 'Scenery',
        coordinates: {
            lat: 35.683573,
            lng: 139.713227
        },
        show: ko.observable(true)
    },
    {
        name: 'Roppongi Mori Tower',
        category: 'Scenery',
        coordinates: {
            lat: 35.660494,
            lng: 139.729631
        },
        show: ko.observable(true)
    }
];