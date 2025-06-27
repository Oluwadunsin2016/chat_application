  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import './index.css'
  import App from './App.jsx'
  import { BrowserRouter } from "react-router-dom";
  import TimeAgo from 'javascript-time-ago';
  import en from 'javascript-time-ago/locale/en.json';
  import ru from 'javascript-time-ago/locale/ru.json';
  import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

  TimeAgo.addDefaultLocale(en)
  TimeAgo.addLocale(ru)
  const queryClient = new QueryClient()
  import { io } from 'socket.io-client';
  import { AuthProvider } from './contex/authContex.jsx';
import { HeroUIProvider } from '@heroui/react';

  // const socket = io('http://localhost:2500');
  // const socket = io('https://let-us-discuss-server.onrender.com');
  const socket = io('https://let-us-discuss-server.onrender.com');
  export default socket;


  createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
        <HeroUIProvider>
        <QueryClientProvider client={queryClient} >
          <AuthProvider >
        <App />
          </AuthProvider>
        </QueryClientProvider>        
        </HeroUIProvider>
      </BrowserRouter>
    </StrictMode>,
  )
