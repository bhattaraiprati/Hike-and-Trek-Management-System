
import { BrowserRouter } from 'react-router-dom';
import './App.css'
import AppRoutes from './routes/AppRoutes'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OrganizerRoutes from './routes/OrganizerRoutes';
import HikerRoutes from './routes/HikerRoutes';

function App() {
  
const queryClient = new QueryClient();

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes/>
        <OrganizerRoutes/>
        <HikerRoutes/>
      </BrowserRouter>
    </QueryClientProvider>
    </>
  )
}

export default App;
