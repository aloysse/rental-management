import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { TenantList } from "./pages/tenants/TenantList";
import { TenantDetail } from "./pages/tenants/TenantDetail";
import { LandlordList } from "./pages/landlords/LandlordList";
import { LandlordDetail } from "./pages/landlords/LandlordDetail";
import { PropertyList } from "./pages/properties/PropertyList";
import { PropertyDetail } from "./pages/properties/PropertyDetail";
import { ActiveRentalList } from "./pages/active-rentals/ActiveRentalList";
import { ActiveRentalDetail } from "./pages/active-rentals/ActiveRentalDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/properties" replace /> },
      { path: "tenants", Component: TenantList },
      { path: "tenants/:id", Component: TenantDetail },
      { path: "landlords", Component: LandlordList },
      { path: "landlords/:id", Component: LandlordDetail },
      { path: "properties", Component: PropertyList },
      { path: "properties/:id", Component: PropertyDetail },
      { path: "active-rentals", Component: ActiveRentalList },
      { path: "active-rentals/:id", Component: ActiveRentalDetail },
    ],
  },
], {
  basename: import.meta.env.BASE_URL,
});
