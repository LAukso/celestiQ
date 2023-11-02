# Star Seeker App

Welcome to Star Seeker, your passport to the cosmos! We're taking you on an interstellar journey of innovation and discovery, redefining the way you explore the galaxy.

## Product Description

**Star Seeker** is a revolutionary app that calculates the cost of your interstellar journeys, finds efficient routes through a network of gates, and provides detailed gate information. We've added a "Journey Memory" feature, allowing you to save your favourite routes for future adventures. With a sleek and user-friendly interface, our app ensures a delightful experience, whether you're on the web or a mobile device. Join us in this mission to redefine the future of travel, one hyperspace jump at a time. The cosmos is calling, and the journey begins with Star Seeker. Start your cosmic adventure now!

## Assessment Task

### Project Description

Hyperspace Tunnelling Corp manages a system-to-system web of hyperspace gates that spans the United Terran Systems. They charge a fee to their users in order to use their network but they want to expand their business.

Recently, they've expanded into transporting people through their network using light transport space-ships that can take up to 5 people to the gate and then use their hyperspace-enabled ships to travel to the destination gate.

You're tasked with creating the Star Seeker app, a *React-based web app* _or_ *React Native mobile app* that interacts with the provided API endpoints to deliver a seamless and informative experience for travellers.

### Task Details

1. **Setup and API Interaction:**
   - Set up a new React (or React Native) project i.e. NextJS, Expo, Vanilla React Native.
   - Create a user interface for the app, including a navigation (i.e. folder routing etc.) system.
   - Interact with the provided API endpoints to fetch gate information and journey details.
   - Display a list of gates with their information on the home screen of the app.

2. **Calculate Journey Cost:**
   - Create a feature that allows users to input the distance (in AUs), the number of passengers, and the number of days of parking.
   - Implement the logic to calculate the cost of the journey using the `/transport/{distance}?passengers={number}&parking={days}` API endpoint.
   - Display the cheapest vehicle option and the cost of the journey to the user.

3. **Display Gate Details:**
   - Allow users to click on a specific gate from the list to view its details.
   - Use the `/gates/{gateCode}` API endpoint to fetch and display information about the selected gate.

4. **Find Cheapest Route:**
   - Implement a feature that lets users find the cheapest route from one gate to another.
   - Use the `/gates/{gateCode}/to/{targetGateCode}` API endpoint to calculate the route and display the results to the user.

5. **Styling and UI/UX Enhancement:**
   - Apply appropriate styling and design principles to make the app user-friendly and visually appealing.
   - Ensure a responsive design that works well on both web and mobile platforms.

6. **Bonus Tasks (Optional):**
   - **State Persistence:** Implement state persistence to allow users to save routes they've looked at.
   - **Unit Testing:** Write unit tests for critical components and functions of the app to ensure robust functionality.
  
#### API Details
- API URL: `https://hstc-api.testing.keyholding.com/`
- Swagger: https://app.swaggerhub.com/apis-docs/TheKeyholdingCompany/HSTC/
- API Key: `{ 'x-api-key': 94962B9A-966C-43FC-8E1A-145DEAA5970C }`


### Submission:

- Share your source code via a Git repository (GitHub, GitLab, Bitbucket, etc.).
- Include clear documentation on how to run, test, and use the app.
- Provide a brief summary of your approach, any considerations made during development, and details about the bonus tasks (if completed).

Join us in this exciting mission to redefine the future of travel and embark on a cosmic adventure with Star Seeker. The cosmos is calling, and the journey begins with you.

Happy coding and safe travels!
