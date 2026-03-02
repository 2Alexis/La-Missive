import { Routes, Route } from 'react-router-dom'
import HeroSection from './components/sections/HeroSection'
import SocialProof from './components/sections/SocialProof'
import AdSense from './components/sections/AdSense'
import FeaturesSection from './components/sections/FeaturesSection'
import SneakPeek from './components/sections/SneakPeek'
import NewsSection from './components/sections/NewsSection'
import CommunitySection from './components/sections/CommunitySection'
import Footer from './components/sections/Footer'
import AllNewsPage from './pages/AllNewsPage'
import ArticlePage from './pages/ArticlePage'

function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <div className="container">
        <AdSense adSlot="SLOT_HORIZONTAL" adFormat="horizontal" className="adsense--horizontal" />
      </div>
      <FeaturesSection />
      <SneakPeek />
      <NewsSection />
      <CommunitySection />
      <Footer />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/actualites" element={<AllNewsPage />} />
        <Route path="/actualites/:id" element={<ArticlePage />} />
      </Routes>
    </div>
  )
}

export default App
