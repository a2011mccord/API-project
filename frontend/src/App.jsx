import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { restoreUser } from "./store/session";
import Navigation from "./components/Navigation";
import ViewAllSpots from "./components/ViewAllSpots";
import SpotDetails from "./components/SpotDetails";

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(restoreUser()).then(() => {
      setIsLoaded(true);
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <ViewAllSpots />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
