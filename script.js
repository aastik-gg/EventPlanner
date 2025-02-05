// Attendee Management
document.getElementById('attendee-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const attendeeName = document.getElementById('attendee-name').value;
  if (attendeeName) {
    addAttendee(attendeeName);
    document.getElementById('attendee-name').value = ''; // Clear input
  }
});

function addAttendee(name) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerHTML = `
    ${name}
    <button class="btn-remove" onclick="removeAttendee(this)">X</button>
  `;
  document.getElementById('attendee-list').appendChild(li);
}

function removeAttendee(button) {
  button.parentElement.remove();
}

// Venue Search (Foursquare API Integration)
document.getElementById('venue-search-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const location = document.getElementById('location').value;
  const rating = document.getElementById('rating').value || 0;
  // const distance = document.getElementById('distance').value || 10;
  const max_price = document.getElementById('price').value;
  // const radius = distance * 1000;

  if (location) {
    const venues = await searchVenues('event', location, rating, max_price);
    displayVenues(venues);
  }
});

async function searchVenues(query, location, rating, max_price) {
  const apiKey = 'fsq3z1Ms2LyCVVLqQnxvslshE0khOaGD7McNLJpqKe8zJDE=';

  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&near=${location}&min_rating=${rating}&max_price=${max_price}&fields=rating,price,name,location,distance`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data)
    return data.results;

  } catch (error) {
    // Display error to the user
    document.getElementById('venue-results').innerHTML = `
      <div class="alert alert-danger">Failed to fetch venues: ${error.message}</div>
    `;
    return [];
  }
}

function displayVenues(venues) {
  const venueResults = document.getElementById('venue-results');
  venueResults.innerHTML = '';

  venues.forEach(venue => {
    const rating = venue.rating ? `${venue.rating}/10` : 'N/A';
    const price = venue.price ? '$'.repeat(venue.price) : 'N/A'; // Convert 1-4 to $ symbols

    const card = document.createElement('div');
    card.className = 'venue-card mb-3';
    card.innerHTML = `
      <h3>${venue.name}</h3>
      <p>Address: ${venue.location?.address || 'N/A'}</p>
      <p>Rating: ${rating}</p>
      <p>Price: ${price}</p>
      <p>Distance: ${(venue.distance / 1000).toFixed(1)} km</p>
      <button class="btn btn-success" onclick="addToItinerary('${venue.name}')">Add to Itinerary</button>
    `;
    venueResults.appendChild(card);
  });
}

// Itinerary Management
function addToItinerary(venueName) {
  const itinerary = document.getElementById('itinerary');
  const event = document.createElement('div');
  event.className = 'venue-card';
  event.textContent = `Event at ${venueName}`;
  itinerary.appendChild(event);
}