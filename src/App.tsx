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

          <Route path="/jobs/:jobId/applicants" element={<ViewApplicants />} />

          <Route path="/post-job" element={<PostJob />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
          <Route path="/alumni" element={<AlumniDirectory />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* --- CONSOLIDATED RESET PASSWORD ROUTES (THE FIX) --- */}
          {/* This route catches the direct link from the Supabase email */}
          <Route path="/auth/reset" element={<ResetPassword />} />
          
          {/* This route catches any internal app redirects for the reset page */}
          <Route path="/reset-password" element={<ResetPassword />} /> 
          
          {/* This catches the /auth/v1/verify callback with parameters */}
          <Route path="/auth/verify" element={<ResetPassword />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;