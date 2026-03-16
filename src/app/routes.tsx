import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";
import { TenantList } from "./pages/tenants/TenantList";
import { TenantDetail } from "./pages/tenants/TenantDetail";
import { LandlordList } from "./pages/landlords/LandlordList";
import { LandlordDetail } from "./pages/landlords/LandlordDetail";
import { PropertyList } from "./pages/properties/PropertyList";
import { PropertyDetail } from "./pages/properties/PropertyDetail";
import { ContractList } from "./pages/contracts/ContractList";
import { ContractDetail } from "./pages/contracts/ContractDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: <Navigate to="/tenants" replace /> },
      { path: "tenants", Component: TenantList },
      { path: "tenants/:id", Component: TenantDetail },
      { path: "landlords", Component: LandlordList },
      { path: "landlords/:id", Component: LandlordDetail },
      { path: "properties", Component: PropertyList },
      { path: "properties/:id", Component: PropertyDetail },
      { path: "contracts", Component: ContractList },
      { path: "contracts/:id", Component: ContractDetail },
    ],
  },
]);
