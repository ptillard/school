# SchoolCom Project

This is a Next.js project for SchoolCom, a school communication platform, built within Firebase Studio.

## Getting Started Locally

To run this application on your local machine (e.g., a Mac using VS Code), follow these steps:

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/). This will also install `npm`.
- **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/).

### 1. Install Dependencies

Open the project folder in VS Code. Then, open the integrated terminal (View -> Terminal) and run the following command to install all the necessary packages:

```bash
npm install
```

### 2. Set Up Environment Variables

This project uses Google AI (via Genkit) for generating notification text. To use this feature, you need a Google AI API key.

1.  **Get an API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create a free API key.
2.  **Create a `.env` file**: In the root of your project, create a new file named `.env`.
3.  **Add the key to the file**: Add the following line to your new `.env` file, replacing `YOUR_API_KEY` with the key you just created:

    ```
    GOOGLE_API_KEY=YOUR_API_KEY
    ```

### 3. Run the Development Servers

This project requires two separate development servers to run simultaneously: one for the Next.js frontend and one for the Genkit AI backend.

1.  **Open two terminals**: In VS Code, you can open a second terminal tab or split your existing terminal.
2.  **In the first terminal**, start the Next.js web server:
    ```bash
    npm run dev
    ```
    This will typically run on `http://localhost:9002`.
3.  **In the second terminal**, start the Genkit development server:
    ```bash
    npm run genkit:dev
    ```
    This server handles the AI logic and will be called by the Next.js app.

### 4. Open the App

Once both servers are running, you can open your web browser and navigate to [http://localhost:9002](http://localhost:9002) to see your app in action.
