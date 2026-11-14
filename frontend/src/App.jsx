import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { TourProvider } from './context/TourContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Spinner from './components/common/Spinner';
import ScrollToTop from './components/common/ScrollToTop';
import PublicLayout from './components/layout/PublicLayout';

import { StudySessionProvider } from './contexts/StudySessionContext';

// Lazy loaded pages
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const FeaturesPage = lazy(() => import('./pages/Public/FeaturesPage'));
const HowItWorksPage = lazy(() => import('./pages/Public/HowItWorksPage'));
const TestimonialsPage = lazy(() => import('./pages/Public/TestimonialsPage'));
const FAQPage = lazy(() => import('./pages/Public/FAQPage'));
const ContactPage = lazy(() => import('./pages/Public/ContactPage'));
const AboutPage = lazy(() => import('./pages/Public/AboutPage'));
const BlogPage = lazy(() => import('./pages/Public/BlogPage'));
const StudyGuidesPage = lazy(() => import('./pages/Public/StudyGuidesPage'));
const CommunityPage = lazy(() => import('./pages/Public/CommunityPage'));
const HelpCenterPage = lazy(() => import('./pages/Public/HelpCenterPage'));
const PrivacyPage = lazy(() => import('./pages/Public/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/Public/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/Public/NotFoundPage'));

const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/Auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/Auth/VerifyEmailPage'));
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const DocumentListPage = lazy(() => import('./pages/Documents/DocumentListPage'));
const DocumentsDetailPage = lazy(() => import('./pages/Documents/DocumentsDetailPage'));
const FlashcardPage = lazy(() => import('./pages/Flashcards/FlashcardPage'));
const FlashcardsListPage = lazy(() => import('./pages/Flashcards/FlashcardsListPage'));
const QuizResultPage = lazy(() => import('./pages/Quizzes/QuizResultPage'));
const QuizTakePage = lazy(() => import('./pages/Quizzes/QuizTakePage'));
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const SharedChatPage = lazy(() => import('./pages/SharedChatPage'));
const FocusWorkspacePage = lazy(() => import('./pages/Focus/FocusWorkspacePage'));
const FocusHistoryPage = lazy(() => import('./pages/Focus/FocusHistoryPage'));
const FocusAnalyticsPage = lazy(() => import('./pages/Focus/FocusAnalyticsPage'));

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <StudySessionProvider>
        <AnalyticsProvider>
          <TourProvider>
            <Suspense fallback={<div className="flex items-center justify-center h-screen"><Spinner /></div>}>
              <Routes>
                {/* Public Layout Routes */}
                <Route element={<PublicLayout />}>
                  <Route
                    path='/'
                    element={
                      isAuthenticated ? (
                        <Navigate to='/dashboard' replace />
                      ) : (
                        <LandingPage />
                      )
                    }
                  />
                  <Route path='/features' element={<FeaturesPage />} />
                  <Route path='/how-it-works' element={<HowItWorksPage />} />
                  <Route path='/testimonials' element={<TestimonialsPage />} />
                  <Route path='/faq' element={<FAQPage />} />
                  <Route path='/contact' element={<ContactPage />} />
                  <Route path='/about' element={<AboutPage />} />
                  <Route path='/blog' element={<BlogPage />} />
                  <Route path='/guides' element={<StudyGuidesPage />} />
                  <Route path='/community' element={<CommunityPage />} />
                  <Route path='/help' element={<HelpCenterPage />} />
                  <Route path='/privacy' element={<PrivacyPage />} />
                  <Route path='/terms' element={<TermsPage />} />
                  <Route path='*' element={<NotFoundPage />} />
                </Route>

                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/forgot-password' element={<ForgotPasswordPage />} />
                <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
                <Route path='/verify-email' element={<VerifyEmailPage />} />
                <Route path='/verify-email/:token' element={<VerifyEmailPage />} />
                
                {/* Public Shared Routes */}
                <Route path='/share/:shareId' element={<SharedChatPage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute/>}>
                  <Route path='/dashboard' element={<DashboardPage/>} />
                  <Route path='/documents' element={<DocumentListPage/>}/>
                  <Route path='/documents/:id' element={<DocumentsDetailPage/>}/>
                  <Route path='/flashcards' element={<FlashcardsListPage/>}/>
                  <Route path='/documents/:id/flashcards' element={<FlashcardPage/>}/>
                  <Route path='/quizzes/:id/flashcards' element={<FlashcardPage/>}/>
                  <Route path='/quizzes/:quizId' element={<QuizTakePage />} />
                  <Route path='/quizzes/:quizId/results' element={<QuizResultPage />} />
                  <Route path='/profile' element={<ProfilePage/>}/>
                  <Route path='/focus' element={<FocusWorkspacePage/>}/>
                  <Route path='/focus/history' element={<FocusHistoryPage/>}/>
                  <Route path='/focus/analytics' element={<FocusAnalyticsPage/>}/>
                </Route>
              </Routes>
            </Suspense>
          </TourProvider>
        </AnalyticsProvider>
      </StudySessionProvider>
    </Router>
  );
};

export default App;
