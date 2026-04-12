import React from 'react'
import { Route,RouterProvider,createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Loginpage from './pages/auth/Loginpage'
import Registerpage from './pages/auth/Registerpage'
import { Navigate } from 'react-router-dom'
import DashboardPages from './pages/dashboard/DashboardPages'
import Documentdetailespages from './pages/documents/Documentdetailespages'
import Documentslistpages from './pages/documents/Documentslistpages'
import FlashcardPages from './pages/flashcards/FlashcardPages'
import FlashcardlistPages from './pages/flashcards/FlashcardlistPages'
import TakequizessPages from './pages/quizess/TakequizessPages'
import ProfilePages from './pages/profile/ProfilePages'
import NotfoundPages from './pages/NotfoundPages'
import QuizesresultPages from './pages/quizess/QuizesresultPages'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useAuth } from './context/AuthContexts'
function App() {
  const{isauthenticated,loading}=useAuth();
  const router=createBrowserRouter(
  createRoutesFromElements(
    <>
    {/*replace is used to avoid the reterning back to / without login */}
   <Route path="/" element={isauthenticated ? <Navigate to="/dashboard" replace/> : <Navigate to="/login" replace/>}
   />
   <Route path="/login" element={<Loginpage/>}/>
   <Route path="/register" element={<Registerpage/>}/>
   {/*proceted routes */}
   <Route element={<ProtectedRoute/>}>
    <Route path='/dashboard' element={<DashboardPages/>}/>
    <Route path='/documents/:id' element={<Documentdetailespages/>}/>
    <Route path='/documents' element={<Documentslistpages/>}/>
    <Route path='/flashcards' element={<FlashcardlistPages/>}/>
    <Route path='/documents/:id/flashcards' element={<FlashcardPages/>}/>
    <Route path='/quizess/:id' element={<TakequizessPages/>}/>
    <Route path='/quizess/:id/result' element={<QuizesresultPages/>}/>
    <Route path='/profile' element={<ProfilePages/>}/>
   </Route>
   <Route path='*' element={<NotfoundPages/>}/>
    </>
  )
)
  if(loading){
    //loading screen
    return (
      <div className="flex items-center justify-center h-screen">
        <p>loading...</p>
      </div>
    );
  }
  return (
    <RouterProvider router={router} />
  );
}

export default App