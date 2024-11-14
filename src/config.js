const citys = {
    from: 'bru', // Source city code (e.g., 'bru' for Brussels)
    to: 'dvo'    // Destination city code (e.g., 'dvo' for Davao)
};

module.exports = {
    headless: true, // Set to true to run the browser in headless mode
    checkDays: {
        start: '', // Start date (in future) for checking prices (format: 'yyyy-MM-dd')
        to: 30,    // Number of days to check for flights to the destination
        from: 35,  // Number of days to check for flights from the destination
        stay: 30,   // Number of days to stay at the destination
    },
    citys,
    urls: {
        to: (day) => `https://www.bing.com/travel/flight-search?src=${citys.from}&des=${citys.to}&ddate=${day}`,
        from: (day) => `https://www.bing.com/travel/flight-search?src=${citys.to}&des=${citys.from}&ddate=${day}`
    }
};