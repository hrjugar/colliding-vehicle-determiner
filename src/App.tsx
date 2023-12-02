import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { ModalProvider } from './contexts/ModalContext';
import ModalGate from './routes/gates/ModalGate';

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
      <ModalProvider>
        <ModalGate>
          <Navbar />
          <main className='w-full min-h-screen'>
            <p>{test}</p>
            <Outlet />
          </main>
        </ModalGate>
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default App
