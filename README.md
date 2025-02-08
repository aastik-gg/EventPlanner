# Open using this link
https://event-planner-blond.vercel.app/

# Event Planner

Event Planner is a web-based application designed to help users efficiently plan events by managing attendees, searching for venues, and scheduling events through seamless Calendly integration. This project leverages modern web technologies to provide an intuitive and user-friendly experience.

## Features
### Attendee Management
- Add attendees by entering their names in the input field.
- Remove attendees from the list with a single click.
- Display an up-to-date list of all added attendees.

### Venue Search
- Search for venues based on location using the **Foursquare Places API**.
- Filter results by **minimum rating** and **maximum price tier**.
- View key venue details such as name, rating, price tier, address, and distance.
- Add a selected venue to the event itinerary.

### Event Scheduling
- Retrieve user details from **Calendly API**.
- Fetch available event types from the user's Calendly account.
- Generate scheduling links for planned events.
- Open the scheduling link in a new window for easy access.

### Responsive Design
- The UI is built with **Bootstrap 5**, ensuring compatibility across various devices.
- Responsive layouts adjust seamlessly between desktop and mobile views.

## Project Structure
```
├── index.html         # Main event planner page (Attendees, Venue Search, Itinerary)
├── home.html          # Landing page introducing the platform
├── styles.css         # Stylesheet for UI/UX enhancements
├── script.js          # JavaScript logic for interactions and API handling
├── README.md          # Project documentation (this file)
```

## Installation
This project does not require any installation. Simply open `home.html` in your web browser to get started.

Alternatively, if hosting on a local web server:
```sh
# Start a simple HTTP server (Python 3)
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

## Usage
1. Open `home.html` in a web browser.
2. Click the **Start Planning** button to navigate to `index.html`.
3. In the **Attendee List** section:
   - Enter an attendee name and click "Add Attendee".
   - View the list of attendees and remove any if necessary.
4. In the **Venue Search** section:
   - Enter a location.
   - (Optional) Set a minimum rating and maximum price tier.
   - Click "Search Venues" and view the results.
   - Select a venue to add it to the event itinerary.
5. In the **Event Itinerary** section:
   - View the selected venue.
   - Click "Schedule on Calendly" to create and access the scheduling link.
6. Share the generated Calendly scheduling link with attendees.

## Dependencies
This project utilizes the following external resources:
- **[Bootstrap 5](https://getbootstrap.com/)** for styling and layout.
- **[Foursquare Places API](https://developer.foursquare.com/)** for venue search.
- **[Calendly API](https://developer.calendly.com/)** for event scheduling.

## API Keys
The project requires API keys for Foursquare and Calendly to function properly. Ensure that you replace placeholder keys in `script.js` with your own valid API credentials.

### API Key Setup
1. Obtain an API key from **Foursquare** and replace `FOURSQUARE_API_KEY` in `script.js`.
2. Generate a **Calendly API Key** from [Calendly Developer Portal](https://developer.calendly.com/) and update `CALENDLY_API_KEY` in `script.js`.

## Security Notice
🚨 **Important:** Do not expose API keys in public repositories.
- Use environment variables or a backend proxy to secure your API keys.
- Consider implementing authentication and access control for production use.

## Future Improvements
- **Google Maps Integration**: Display venue locations directly on a map.
- **User Authentication**: Secure access with login/logout functionality.
- **Multiple Event Scheduling**: Support scheduling for multiple events simultaneously.

## License
This project is open-source and available under the MIT License.

