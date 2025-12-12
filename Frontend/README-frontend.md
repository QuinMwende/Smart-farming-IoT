# Smart Farming IoT Frontend

A React-based real-time dashboard for monitoring smart farming IoT sensors.

## Features

- **Real-time Dashboard**: Monitor soil moisture, temperature, and humidity
- **Interactive Charts**: Visualize sensor readings over time using Chart.js
- **Responsive UI**: Mobile-friendly design (React Native ready)
- **Alert System**: Displays alerts when sensor readings exceed thresholds
- **API Integration**: Fetches data from Spring Boot backend

## Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
cd Frontend
npm install
```

### Running Locally

```bash
npm start
```

The app will open at `http://localhost:3000` and proxy API requests to `http://localhost:8080`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── Dashboard.jsx       # Main dashboard component
  │   ├── FarmList.jsx        # Display list of farms
  │   ├── SensorChart.jsx     # Real-time sensor data chart
  │   ├── AlertSystem.jsx     # Alert notifications
  │   └── FarmForm.jsx        # Farm CRUD form
  ├── services/
  │   └── api.js              # Axios API client
  ├── App.jsx                 # Root component
  └── index.js                # Entry point
```

## API Endpoints Used

- `GET /api/farms` - Get all farms
- `GET /api/farms/{id}` - Get specific farm
- `GET /api/farms/{id}/readings` - Get sensor readings for a farm
- `POST /api/farms` - Create new farm
- `PUT /api/farms/{id}` - Update farm
- `DELETE /api/farms/{id}` - Delete farm

## Environment Variables

Create a `.env` file in the root:

```
REACT_APP_API_URL=http://localhost:8080
```

## State Management

Uses React hooks (`useState`, `useEffect`) for component state and API data management.

## Error Handling

All API calls include error handling with user-friendly messages displayed in the UI.
