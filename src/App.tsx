import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Page Imports
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import ApplyJob from "./pages/ApplyJob";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import AlumniDirectory from "./pages/AlumniDirectory";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResetPassword from "@/pages/ResetPassword";
import ViewApplicants from "./pages/ViewApplicants"; 
// --- CONFIRMING IMPORTS ---
import ViewMyApplication from "./pages/ViewMyApplication"; 
import MyApplicationsList from "./pages/MyApplicationsList"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/job/:id/apply" element={<ApplyJob />} />

          {/* Employer Routes */}
          <Route path="/jobs/:jobId/applicants" element={<ViewApplicants />} />

          {/* APPLICANT MONITORING ROUTES (NEW) */}
          {/* List of all applications for the logged-in user */}
          <Route path="/my-applications" element={<MyApplicationsList />} /> 
          {/* Detailed status page for a single application */}
          <Route path="/my-application/:jobId" element={<ViewMyApplication />} />

          <Route path="/post-job" element={<PostJob />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* Reset Password Routes */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/reset" element={<ResetPassword />} />
          <Route path="/auth/verify" element={<ResetPassword />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;