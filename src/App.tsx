import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WindowButtonGroup from './components/WindowButtonGroup';

const queryClient = new QueryClient();

function App() {
  const test = (window as any).testExpose;

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <WindowButtonGroup />
      <main className='w-full min-h-screen bg-white'>
        <p>{test}</p>
        <Outlet />
      </main>
      <ToastContainer 
        hideProgressBar={true} 
        position='bottom-right' 
        closeOnClick={true} 
        autoClose={2000}
      />
      <div id="popover-root"></div>
    </QueryClientProvider>
  )
}

export default App
