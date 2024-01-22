import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { restoreUser } from "./store/session";
import Navigation from "./components/Navigation";
import ViewAllSpots from "./components/ViewAllSpots";
import SpotDetails from "./components/SpotDetails";
import CreateSpot from "./components/CreateSpot";
import ManageSpots from "./components/ManageSpots";
import UpdateSpot from "./components/UpdateSpot";

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
        path: '/spots/:spotId/edit',
        element: <UpdateSpot />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '/spots/current',
        element: <ManageSpots />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App;
