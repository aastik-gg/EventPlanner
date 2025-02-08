const CALENDLY_API_BASE = "https://api.calendly.com";
const FOURSQUARE_API_KEY = "fsq3z1Ms2LyCVVLqQnxvslshE0khOaGD7McNLJpqKe8zJDE=";
const CALENDLY_API_KEY =
  "eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzM5MDExMzM3LCJqdGkiOiI2YzgxZWNjZC00MWU5LTQyN2EtOTQ3Mi0xNDhmMDM3N2Q5NzYiLCJ1c2VyX3V1aWQiOiJmMTdmMTg2Yy01YWRmLTQ3YmMtYTQxYS1iNTgyNjRmZmEzZGYifQ.T8G3oLI9OtfbvvNZAIwB0l1FSq0tnIf_Ixzto6HVc3QGPrmTCCmxlxUViUwqBbN69YrLKwTwghAqdVN9iX2m4A";

class CalendlyAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
  }

  async getUserDetails() {
    try {
      const response = await fetch(`${CALENDLY_API_BASE}/users/me`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User details response:", data);
      return {
        uuid: data.resource.uri.split("/").pop(),
        name: data.resource.name,
        email: data.resource.email,
        schedulingUrl: data.resource.scheduling_url,
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  async getEventTypes(userUuid) {
    try {
      const userUri = `https://api.calendly.com/users/${userUuid}`;

      const response = await fetch(
        `${CALENDLY_API_BASE}/event_types?user=${userUri}`,
        {
          method: "GET",
          headers: this.headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Event types error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Event types response:", data);
      return data.collection;
    } catch (error) {
      console.error("Error fetching event types:", error);
      throw error;
    }
  }

  async createSchedulingLink(eventTypeUuid, options = {}) {
    try {
      const eventTypeUri = `https://api.calendly.com/event_types/${eventTypeUuid}`;

      const payload = {
        max_event_count: 1,
        owner: eventTypeUri,
        owner_type: "EventType",
        event_types: [eventTypeUri],
        ...options,
      };

      console.log("Creating scheduling link with payload:", payload);

      const response = await fetch(`${CALENDLY_API_BASE}/scheduling_links`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Scheduling link error response:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Scheduling link response:", data);
      return data.resource.booking_url;
    } catch (error) {
      console.error("Error creating scheduling link:", error);
      throw error;
    }
  }
}

const calendlyApi = new CalendlyAPI(CALENDLY_API_KEY);

document
  .getElementById("attendee-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const attendeeName = document.getElementById("attendee-name").value;
    if (attendeeName) {
      addAttendee(attendeeName);
      document.getElementById("attendee-name").value = "";
    }
  });

function addAttendee(name) {
  const li = document.createElement("li");
  li.className = "list-group-item";
  li.innerHTML = `
    ${name}
    <button class="btn-remove" onclick="removeAttendee(this)">X</button>
  `;
  document.getElementById("attendee-list").appendChild(li);
}

function removeAttendee(button) {
  button.parentElement.remove();
}

document
  .getElementById("venue-search-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const location = document.getElementById("location").value;
    const rating = document.getElementById("rating").value || 0;
    const max_price = document.getElementById("price").value;

    if (location) {
      const venues = await searchVenues("event", location, rating, max_price);
      displayVenues(venues);
    }
  });

async function searchVenues(query, location, rating, max_price) {
  try {
    const response = await fetch(
      `https://api.foursquare.com/v3/places/search?query=${query}&near=${location}&min_rating=${rating}&max_price=${max_price}&fields=rating,price,name,location,distance`,
      {
        headers: {
          Authorization: FOURSQUARE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Venue search response:", data);
    return data.results;
  } catch (error) {
    console.error("Error searching venues:", error);
    document.getElementById("venue-results").innerHTML = `
      <div class="alert alert-danger">Failed to fetch venues: ${error.message}</div>
    `;
    return [];
  }
}

function displayVenues(venues) {
  const venueResults = document.getElementById("venue-results");
  venueResults.innerHTML = "";

  venues.forEach((venue) => {
    const rating = venue.rating ? `${venue.rating}/10` : "N/A";
    const price = venue.price ? "$".repeat(venue.price) : "N/A";

    const card = document.createElement("div");
    card.className = "venue-card mb-3";
    card.innerHTML = `
      <h3>${venue.name}</h3>
      <p>Address: ${venue.location?.address || "N/A"}</p>
      <p>Rating: ${rating}</p>
      <p>Price: ${price}</p>
      <p>Distance: ${(venue.distance / 1000).toFixed(1)} km</p>
      <button class="btn btn-success" onclick="addToItinerary('${
        venue.name
      }')">Add to Itinerary</button>
    `;
    venueResults.appendChild(card);
  });
}

function addToItinerary(venueName) {
  const itinerary = document.getElementById("itinerary");
  const event = document.createElement("div");
  event.className = "venue-card";
  event.textContent = `Event at ${venueName}`;
  itinerary.appendChild(event);
}

document
  .getElementById("schedule-calendly")
  .addEventListener("click", async () => {
    const button = document.getElementById("schedule-calendly");
    const originalButtonText = button.textContent;

    try {
      button.textContent = "Loading...";
      button.disabled = true;

      const attendeeList = Array.from(
        document.getElementById("attendee-list").children
      ).map((li) => li.textContent.replace("X", "").trim());

      if (attendeeList.length === 0) {
        throw new Error("Please add at least one attendee");
      }

      const itinerary = document.getElementById("itinerary");
      if (!itinerary.children.length) {
        throw new Error("Please select a venue first");
      }
      const itineraryVenue = itinerary.children[0].textContent;

      const user = await calendlyApi.getUserDetails();
      console.log("User details:", user);

      const eventTypes = await calendlyApi.getEventTypes(user.uuid);
      console.log("Event types:", eventTypes);

      if (!eventTypes || eventTypes.length === 0) {
        throw new Error("No event types found in your Calendly account");
      }

      const eventType = eventTypes[0];
      const eventTypeUuid = eventType.uri.split("/").pop();

      const schedulingLink = await calendlyApi.createSchedulingLink(
        eventTypeUuid,
        {
          metadata: {
            attendees: attendeeList.join(", "),
            venue: itineraryVenue,
          },
        }
      );

      window.open(schedulingLink, "_blank");
    } catch (error) {
      console.error("Failed to create scheduling link:", error);
      alert(
        error.message || "Failed to create scheduling link. Please try again."
      );
    } finally {
      button.textContent = originalButtonText;
      button.disabled = false;
    }
  });

window.addEventListener("load", async () => {
  try {
    const user = await calendlyApi.getUserDetails();
    console.log("Connected to Calendly as:", user.name);
  } catch (error) {
    console.error("Failed to connect to Calendly:", error);
    alert("Failed to connect to Calendly. Please check your API key.");
  }
});
