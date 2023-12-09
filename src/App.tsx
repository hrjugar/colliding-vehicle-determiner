import { QueryClient, QueryClientProvider } from 'react-query';
import Navbar from './components/Navbar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomTitleBar from './components/CustomTitleBar';

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
      <main className='w-full min-h-screen bg-white'>
        <CustomTitleBar />
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
