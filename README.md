# Flight Price Checker


This project is a flight price checker that uses Puppeteer to scrape flight prices from Bing Travel. You can configure the source and destination cities, as well as the days to check for flight prices.


## Configuration


You can configure the project in the `src/config.js` file. Here are the available configuration options:


```javascript
const citys = {
    from: 'bru', // Source city code (e.g., 'bru' for Brussels)
    to: 'dvo'    // Destination city code (e.g., 'dvo' for Davao)
};

module.exports = {
    headless: true, // Set to true to run the browser in headless mode
    checkDays: {
        start: '', // Start date for checking prices (format: 'yyyy-MM-dd')
        to: 30,    // Number of days to check for flights to the destination
        from: 35,  // Number of days to check for flights from the destination
        stay: 30,   // Number of days to stay at the destination
    },
    citys,
    urls: {
        to: (day) => `https://www.bing.com/travel/flight-search?src=${citys.from}&des=${citys.to}&ddate=${day}`,
        from: (day) => `https://www.bing.com/travel/flight-search?src=${citys.to}&des=${citys.from}&ddate=${day}`
    }
}
```
### Parameters

- **citys**: 
  - `from`: The IATA code of the departure city.
  
  - `to`: The IATA code of the destination city.

- **checkDays**:
  - `start`: The start date for checking flight prices (optional).
  
  - `to`: The number of days to check for flights to the destination.
  
  - `from`: The number of days to check for flights from the destination.

  - `stay`: The number of days to stay at the destination.

## Running the Project


1. **Install Dependencies**: Make sure you have Node.js installed. Then, install the required dependencies by running:


   ```bash
   npm install
   ```


2. **Run the Script**: Execute the script to start checking flight prices:


   ```bash
   node src/index.js
   ```


3. **View Results**: After the script completes, you can view the results in the webpage located at:

   ```
   output/index.html
   ```


## Output

The output will display the flight prices for the specified routes based on the configuration in `src/config.js`. You can open the `index.html` file in your web browser to see the results, sorted on price. 

- **Click on a table row** to show flights back and total price.
- **Click on the link** associated with a date to navigate to the specific flight details.
- **Click on "Reverse"** to show flights back home first, and see the flights to the destination when clicked.


![Screenshot of the Output](/Screenshot1.png)

## Acknowledgments

- [Puppeteer](https://pptr.dev/) - A Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol.
- [Bing Travel](https://www.bing.com/travel) - The source of flight data for this project.