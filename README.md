# SoulSpace - Mental Health Support Platform

SoulSpace is a supportive platform that combines AI-powered therapy with mood tracking and journaling features to help users manage their mental health journey.

## Features

- User authentication (sign-up, login)
- AI-powered therapeutic chat using OpenAI GPT
- Mood tracking and visualization
- Personal journaling system
- Secure data storage with MongoDB
- Responsive dashboard with mental health resources

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- MongoDB with Mongoose
- NextAuth.js for authentication
- OpenAI API for AI chat

## Prerequisites

- Node.js 18+ and npm
- MongoDB database
- OpenAI API key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/soulspace.git
cd soulspace
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: A random string used to encrypt cookies (you can generate one using `openssl rand -base64 32`)
- `NEXTAUTH_URL`: The URL of your application (use `http://localhost:3000` for development)
- `OPENAI_API_KEY`: Your OpenAI API key for the AI chat feature

## Project Structure

```
soulspace/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── page.tsx       # Home page
├── components/        # Reusable components
├── lib/              # Utility functions
├── models/           # MongoDB models
└── public/           # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is not a replacement for professional mental health care. Always seek the advice of your mental health professional or other qualified health provider with any questions you may have regarding a medical condition.
