import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  /* TODO: 
    - edit Window interface in electron-env.d.ts to include the properties on preload.ts 
    properties used in exposeInMainWorld()
    - remove the "as any" here
  */
  const test = (window as any).testExpose;

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main className='w-full min-h-screen'>
        <p>{test}</p>
        <Outlet />
      </main>
    </QueryClientProvider>
  )
}

export default App
