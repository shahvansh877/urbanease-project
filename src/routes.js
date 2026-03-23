import { createBrowserRouter } from "react-router";
import { HomePage } from "./components/HomePage";
import { HomeHero } from "./components/HomeHero";
import { ServicesListing } from "./components/ServicesListing";
import { HowItWorks } from "./components/HowItWorks";
import { CallToAction } from "./components/CallToAction";
import { FooterPage } from "./components/FooterPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ProfilePage } from "./components/ProfilePage";
import { BookingPage } from "./components/BookingPage";
import { BookingConfirmation } from "./components/BookingConfirmation";
import { AdminDashboard } from "./components/AdminDashboard";
import { PaymentPage } from "./components/PaymentPage";
import { ProvidersListPage } from "./components/ProvidersListPage";
import { ProviderDashboard } from "./components/ProviderDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/services",
    Component: ServicesListing,
  },
  {
    path: "/how-it-works",
    Component: HowItWorks,
  },
  {
    path: "/cta",
    Component: CallToAction,
  },
  {
    path: "/footer",
    Component: FooterPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/booking",
    Component: BookingPage,
  },
  {
    path: "/booking-confirmation",
    Component: BookingConfirmation,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/payments",
    Component: PaymentPage,
  },
  {
    path: "/providers",
    Component: ProvidersListPage,
  },
  {
    path: "/provider-dashboard",
    Component: ProviderDashboard,
  },
]);
